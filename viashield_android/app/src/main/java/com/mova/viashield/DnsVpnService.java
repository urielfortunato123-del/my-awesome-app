package com.mova.viashield;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.ServiceInfo;
import android.net.VpnService;
import android.os.Build;
import android.os.ParcelFileDescriptor;

import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.net.URL;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicBoolean;

import javax.net.ssl.HttpsURLConnection;

public class DnsVpnService extends VpnService {
    public static final String ACTION_START = "com.mova.viashield.START";
    public static final String ACTION_STOP = "com.mova.viashield.STOP";
    public static final String EXTRA_PROVIDER = "provider";
    private static final String VIRTUAL_DNS = "10.233.0.2";
    private static final byte[] VIRTUAL_DNS_BYTES = new byte[]{10, (byte)233, 0, 2};

    private final AtomicBoolean running = new AtomicBoolean(false);
    private final ExecutorService workers = Executors.newFixedThreadPool(4);
    private ParcelFileDescriptor tun;
    private String provider = "adguard";
    private SharedPreferences stats;
    private SharedPreferences ui;

    private static class CacheEntry {
        final byte[] response;
        final long expiresAt;
        CacheEntry(byte[] response, long expiresAt) {
            this.response = response;
            this.expiresAt = expiresAt;
        }
    }

    private final LinkedHashMap<Integer, CacheEntry> cache =
            new LinkedHashMap<Integer, CacheEntry>(256, 0.75f, true) {
                @Override
                protected boolean removeEldestEntry(Map.Entry<Integer, CacheEntry> eldest) {
                    return size() > 256;
                }
            };

    @Override
    public void onCreate() {
        super.onCreate();
        stats = getSharedPreferences("viashield_stats", MODE_PRIVATE);
        ui = getSharedPreferences("viashield_ui", MODE_PRIVATE);
        createChannel();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent != null && ACTION_STOP.equals(intent.getAction())) {
            stopVpn();
            return Service.START_NOT_STICKY;
        }

        if (intent != null) {
            String p = intent.getStringExtra(EXTRA_PROVIDER);
            if (p != null) provider = p;
        }

        Notification n = notification("Proteção ativa • " + providerLabel(provider));
        if (Build.VERSION.SDK_INT >= 34) {
            startForeground(4201, n, ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE);
        } else {
            startForeground(4201, n);
        }

        ui.edit().putBoolean("active", true).apply();
        if (!running.get()) startVpn();
        return Service.START_STICKY;
    }

    private void startVpn() {
        try {
            Builder builder = new Builder()
                    .setSession("ViaShield DNS")
                    .setMtu(1500)
                    .addAddress("10.233.0.1", 32)
                    .addDnsServer(VIRTUAL_DNS)
                    .addRoute(VIRTUAL_DNS, 32)
                    .setBlocking(true);

            tun = builder.establish();
            if (tun == null) {
                ui.edit().putBoolean("active", false).apply();
                stopSelf();
                return;
            }
            running.set(true);
            new Thread(this::loop, "ViaShield-TUN").start();
        } catch (Throwable t) {
            onFailure();
            ui.edit().putBoolean("active", false).apply();
            stopSelf();
        }
    }

    private void loop() {
        ParcelFileDescriptor fd = tun;
        if (fd == null) return;

        FileInputStream input = new FileInputStream(fd.getFileDescriptor());
        FileOutputStream output = new FileOutputStream(fd.getFileDescriptor());
        byte[] buffer = new byte[32767];

        try {
            while (running.get()) {
                int n = input.read(buffer);
                if (n <= 0) continue;
                byte[] packet = new byte[n];
                System.arraycopy(buffer, 0, packet, 0, n);
                Query q = parseIpv4UdpDns(packet, n);
                if (q == null) continue;
                workers.submit(() -> handle(q, output));
            }
        } catch (Throwable ignored) {
        } finally {
            running.set(false);
        }
    }

    private void handle(Query q, FileOutputStream output) {
        int key = java.util.Arrays.hashCode(q.dnsPayload);
        long now = System.currentTimeMillis();
        CacheEntry cached;
        synchronized (cache) {
            cached = cache.get(key);
            if (cached != null && cached.expiresAt <= now) {
                cache.remove(key);
                cached = null;
            }
        }

        byte[] result;
        long latency = 0;
        String resolver = "Cache";

        if (cached != null) {
            result = cached.response;
        } else {
            ResolveResult rr = resolveDoh(q.dnsPayload, endpoints(provider));
            if (rr == null) {
                onFailure();
                return;
            }
            result = rr.bytes;
            latency = rr.latencyMs;
            resolver = rr.resolver;
            synchronized (cache) {
                cache.put(key, new CacheEntry(result, now + 60_000L));
            }
        }

        boolean blocked = isBlockedResponse(result);
        onQuery(q.domain, blocked, latency, resolver);

        byte[] responsePacket = buildIpv4UdpResponse(q, result, VIRTUAL_DNS_BYTES);
        synchronized (output) {
            try {
                output.write(responsePacket);
                output.flush();
            } catch (Throwable ignored) {}
        }
    }

    private String[] endpoints(String provider) {
        if ("controld".equals(provider)) {
            return new String[]{
                    "https://freedns.controld.com/p2",
                    "https://dns.adguard-dns.com/dns-query",
                    "https://security.cloudflare-dns.com/dns-query",
                    "https://cloudflare-dns.com/dns-query"
            };
        }
        if ("family".equals(provider)) {
            return new String[]{
                    "https://family.adguard-dns.com/dns-query",
                    "https://freedns.controld.com/p2",
                    "https://security.cloudflare-dns.com/dns-query",
                    "https://cloudflare-dns.com/dns-query"
            };
        }
        return new String[]{
                "https://dns.adguard-dns.com/dns-query",
                "https://freedns.controld.com/p2",
                "https://security.cloudflare-dns.com/dns-query",
                "https://cloudflare-dns.com/dns-query"
        };
    }

    private String providerLabel(String id) {
        if ("controld".equals(id)) return "Control D";
        if ("family".equals(id)) return "AdGuard Family";
        return "AdGuard DNS";
    }

    private static class ResolveResult {
        final byte[] bytes;
        final String resolver;
        final long latencyMs;
        ResolveResult(byte[] bytes, String resolver, long latencyMs) {
            this.bytes = bytes;
            this.resolver = resolver;
            this.latencyMs = latencyMs;
        }
    }

    private ResolveResult resolveDoh(byte[] query, String[] endpoints) {
        for (String endpoint : endpoints) {
            long started = System.nanoTime();
            HttpsURLConnection conn = null;
            try {
                conn = (HttpsURLConnection) new URL(endpoint).openConnection();
                conn.setRequestMethod("POST");
                conn.setConnectTimeout(2500);
                conn.setReadTimeout(3000);
                conn.setDoOutput(true);
                conn.setUseCaches(false);
                conn.setRequestProperty("Content-Type", "application/dns-message");
                conn.setRequestProperty("Accept", "application/dns-message");
                conn.setRequestProperty("User-Agent", "ViaShieldDNS/0.1.1");
                conn.getOutputStream().write(query);

                if (conn.getResponseCode() == 200) {
                    ByteArrayOutputStream out = new ByteArrayOutputStream();
                    byte[] b = new byte[2048];
                    int n;
                    java.io.InputStream in = conn.getInputStream();
                    while ((n = in.read(b)) != -1) out.write(b, 0, n);
                    in.close();
                    byte[] body = out.toByteArray();
                    if (body.length >= 12) {
                        long ms = (System.nanoTime() - started) / 1_000_000L;
                        String resolver = endpoint.contains("adguard") ? "AdGuard" :
                                endpoint.contains("controld") ? "Control D" :
                                endpoint.contains("security.cloudflare") ? "Cloudflare Security" : "Cloudflare";
                        return new ResolveResult(body, resolver, ms);
                    }
                }
            } catch (Throwable ignored) {
            } finally {
                if (conn != null) conn.disconnect();
            }
        }
        return null;
    }

    private void onQuery(String domain, boolean blocked, long latency, String resolver) {
        long total = stats.getLong("total", 0) + 1;
        long blockedCount = stats.getLong("blocked", 0) + (blocked ? 1 : 0);
        stats.edit()
                .putLong("total", total)
                .putLong("blocked", blockedCount)
                .putLong("latency", latency)
                .putString("resolver", resolver)
                .putString("last_domain", domain == null ? "—" : domain)
                .putLong("last_ok", System.currentTimeMillis())
                .apply();
    }

    private void onFailure() {
        stats.edit().putLong("failures", stats.getLong("failures", 0) + 1).apply();
    }

    private void stopVpn() {
        running.set(false);
        try {
            if (tun != null) tun.close();
        } catch (Throwable ignored) {}
        tun = null;
        if (ui != null) ui.edit().putBoolean("active", false).apply();
        stopForeground(STOP_FOREGROUND_REMOVE);
        stopSelf();
    }

    @Override
    public void onDestroy() {
        running.set(false);
        try {
            if (tun != null) tun.close();
        } catch (Throwable ignored) {}
        tun = null;
        workers.shutdownNow();
        if (ui != null) ui.edit().putBoolean("active", false).apply();
        super.onDestroy();
    }

    @Override
    public void onRevoke() {
        stopVpn();
        super.onRevoke();
    }

    private void createChannel() {
        if (Build.VERSION.SDK_INT >= 26) {
            NotificationChannel channel = new NotificationChannel(
                    "viashield_vpn", "Proteção DNS", NotificationManager.IMPORTANCE_LOW);
            channel.setDescription("Mantém o bloqueio DNS ativo");
            getSystemService(NotificationManager.class).createNotificationChannel(channel);
        }
    }

    private Notification notification(String text) {
        return new Notification.Builder(this, "viashield_vpn")
                .setSmallIcon(com.mova.viashield.R.drawable.ic_shield)
                .setContentTitle("ViaShield DNS")
                .setContentText(text)
                .setOngoing(true)
                .build();
    }

    private static class Query {
        final byte[] sourceIp;
        final int sourcePort;
        final byte[] dnsPayload;
        final String domain;

        Query(byte[] sourceIp, int sourcePort, byte[] dnsPayload, String domain) {
            this.sourceIp = sourceIp;
            this.sourcePort = sourcePort;
            this.dnsPayload = dnsPayload;
            this.domain = domain;
        }
    }

    private Query parseIpv4UdpDns(byte[] packet, int length) {
        if (length < 28) return null;
        int version = (packet[0] >> 4) & 0x0F;
        if (version != 4) return null;
        int ihl = (packet[0] & 0x0F) * 4;
        if (ihl < 20 || length < ihl + 8) return null;
        if ((packet[9] & 0xFF) != 17) return null;

        int udpOffset = ihl;
        int srcPort = u16(packet, udpOffset);
        int dstPort = u16(packet, udpOffset + 2);
        if (dstPort != 53) return null;

        int udpLen = u16(packet, udpOffset + 4);
        if (udpLen < 8 || udpOffset + udpLen > length) return null;

        int dnsOffset = udpOffset + 8;
        int dnsLen = udpLen - 8;
        byte[] dns = new byte[dnsLen];
        System.arraycopy(packet, dnsOffset, dns, 0, dnsLen);
        if (dns.length < 12) return null;

        byte[] srcIp = new byte[4];
        System.arraycopy(packet, 12, srcIp, 0, 4);
        return new Query(srcIp, srcPort, dns, parseDomain(dns));
    }

    private String parseDomain(byte[] dns) {
        if (dns.length < 13) return null;
        int p = 12;
        StringBuilder sb = new StringBuilder();
        int guard = 0;
        while (p < dns.length && guard++ < 64) {
            int len = dns[p] & 0xFF;
            if (len == 0) break;
            if ((len & 0xC0) == 0xC0) break;
            if (len > 63 || p + 1 + len > dns.length) return null;
            if (sb.length() > 0) sb.append('.');
            sb.append(new String(dns, p + 1, len, java.nio.charset.StandardCharsets.UTF_8));
            p += 1 + len;
        }
        return sb.length() == 0 ? null : sb.toString().toLowerCase(java.util.Locale.US);
    }

    private boolean isBlockedResponse(byte[] dns) {
        if (dns.length < 12) return false;
        int rcode = dns[3] & 0x0F;
        if (rcode == 3 || rcode == 5) return true;

        int qd = u16(dns, 4);
        int an = u16(dns, 6);
        int p = 12;

        for (int i = 0; i < qd; i++) {
            p = skipName(dns, p);
            if (p < 0 || p + 4 > dns.length) return false;
            p += 4;
        }

        for (int i = 0; i < an; i++) {
            p = skipName(dns, p);
            if (p < 0 || p + 10 > dns.length) return false;
            int type = u16(dns, p); p += 2;
            p += 2;
            p += 4;
            int rdLen = u16(dns, p); p += 2;
            if (p + rdLen > dns.length) return false;

            if (type == 1 && rdLen == 4 &&
                    dns[p] == 0 && dns[p + 1] == 0 && dns[p + 2] == 0 && dns[p + 3] == 0) return true;

            if (type == 28 && rdLen == 16) {
                boolean allZero = true;
                for (int j = 0; j < 16; j++) if (dns[p + j] != 0) { allZero = false; break; }
                if (allZero) return true;
            }
            p += rdLen;
        }
        return false;
    }

    private int skipName(byte[] dns, int start) {
        int p = start;
        int guard = 0;
        while (p < dns.length && guard++ < 128) {
            int len = dns[p] & 0xFF;
            if (len == 0) return p + 1;
            if ((len & 0xC0) == 0xC0) return p + 1 < dns.length ? p + 2 : -1;
            if (len > 63 || p + 1 + len > dns.length) return -1;
            p += 1 + len;
        }
        return -1;
    }

    private byte[] buildIpv4UdpResponse(Query q, byte[] dnsResponse, byte[] dnsIp) {
        int totalLen = 20 + 8 + dnsResponse.length;
        byte[] out = new byte[totalLen];
        out[0] = 0x45;
        out[1] = 0;
        put16(out, 2, totalLen);
        put16(out, 4, (int)(System.nanoTime() & 0xFFFF));
        put16(out, 6, 0);
        out[8] = 64;
        out[9] = 17;
        System.arraycopy(dnsIp, 0, out, 12, 4);
        System.arraycopy(q.sourceIp, 0, out, 16, 4);
        put16(out, 10, checksum(out, 0, 20));

        int udp = 20;
        put16(out, udp, 53);
        put16(out, udp + 2, q.sourcePort);
        put16(out, udp + 4, 8 + dnsResponse.length);
        put16(out, udp + 6, 0);
        System.arraycopy(dnsResponse, 0, out, udp + 8, dnsResponse.length);

        int c = udpChecksumIpv4(out, dnsIp, q.sourceIp, udp, 8 + dnsResponse.length);
        put16(out, udp + 6, c == 0 ? 0xFFFF : c);
        return out;
    }

    private int udpChecksumIpv4(byte[] packet, byte[] src, byte[] dst, int udpOffset, int udpLen) {
        long sum = 0;
        sum += word(src[0], src[1]) + word(src[2], src[3]);
        sum += word(dst[0], dst[1]) + word(dst[2], dst[3]);
        sum += 17 + udpLen;

        int i = udpOffset;
        int end = udpOffset + udpLen;
        while (i + 1 < end) {
            sum += word(packet[i], packet[i + 1]);
            i += 2;
        }
        if (i < end) sum += word(packet[i], (byte)0);
        while ((sum >>> 16) != 0) sum = (sum & 0xFFFF) + (sum >>> 16);
        return ((int)~sum) & 0xFFFF;
    }

    private int checksum(byte[] data, int offset, int len) {
        long sum = 0;
        int i = offset;
        int end = offset + len;
        while (i + 1 < end) {
            sum += word(data[i], data[i + 1]);
            i += 2;
        }
        if (i < end) sum += word(data[i], (byte)0);
        while ((sum >>> 16) != 0) sum = (sum & 0xFFFF) + (sum >>> 16);
        return ((int)~sum) & 0xFFFF;
    }

    private int word(byte a, byte b) {
        return ((a & 0xFF) << 8) | (b & 0xFF);
    }

    private int u16(byte[] b, int off) {
        return ((b[off] & 0xFF) << 8) | (b[off + 1] & 0xFF);
    }

    private void put16(byte[] b, int off, int v) {
        b[off] = (byte)((v >>> 8) & 0xFF);
        b[off + 1] = (byte)(v & 0xFF);
    }
}
