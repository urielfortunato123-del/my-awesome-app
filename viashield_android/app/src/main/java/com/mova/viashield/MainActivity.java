package com.mova.viashield;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.net.VpnService;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.view.Gravity;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;

import java.util.Locale;

public class MainActivity extends Activity {
    private static final int VPN_REQUEST = 101;

    private android.content.SharedPreferences uiPrefs;
    private android.content.SharedPreferences statsPrefs;
    private boolean active;
    private String selected;

    private TextView statusTitle;
    private TextView statusSubtitle;
    private TextView statsText;
    private TextView guardianText;
    private Button mainButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setStatusBarColor(Color.rgb(8, 16, 31));
        getWindow().setNavigationBarColor(Color.rgb(8, 16, 31));
        uiPrefs = getSharedPreferences("viashield_ui", Context.MODE_PRIVATE);
        statsPrefs = getSharedPreferences("viashield_stats", Context.MODE_PRIVATE);
        active = uiPrefs.getBoolean("active", false);
        selected = uiPrefs.getString("provider", "adguard");
        render();
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (uiPrefs != null) active = uiPrefs.getBoolean("active", false);
        refresh();
    }

    private void render() {
        setContentView(buildUi());
        refresh();
    }

    private View buildUi() {
        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setPadding(dp(18), dp(18), dp(18), dp(28));
        root.setBackgroundColor(Color.rgb(8, 16, 31));

        ScrollView scroll = new ScrollView(this);
        scroll.addView(root);

        TextView title = text("ViaShield DNS", 30, Color.WHITE, true);
        root.addView(title);

        TextView subtitle = text("Bloqueio inteligente • DNS criptografado • sem root", 14, Color.rgb(155, 169, 194), false);
        subtitle.setPadding(0, dp(3), 0, dp(18));
        root.addView(subtitle);

        LinearLayout hero = card(18);
        hero.setPadding(dp(20), dp(20), dp(20), dp(20));
        statusTitle = text("", 24, Color.WHITE, true);
        statusSubtitle = text("", 14, Color.rgb(155, 169, 194), false);
        statusSubtitle.setPadding(0, dp(6), 0, dp(18));
        mainButton = new Button(this);
        mainButton.setAllCaps(false);
        mainButton.setTextSize(16);
        mainButton.setTextColor(Color.WHITE);
        mainButton.setOnClickListener(v -> {
            if (active) stopProtection(); else requestVpn();
        });
        hero.addView(statusTitle);
        hero.addView(statusSubtitle);
        hero.addView(mainButton, new LinearLayout.LayoutParams(-1, dp(54)));
        root.addView(hero, lp(14));

        root.addView(section("DNS protegido"));
        addProvider(root, "adguard", "AdGuard DNS", "Anúncios + rastreadores");
        addProvider(root, "controld", "Control D", "Ads + tracking + malware");
        addProvider(root, "family", "AdGuard Family", "Ads + rastreadores + conteúdo adulto");

        root.addView(section("Network Guardian"));
        LinearLayout guardianCard = card(14);
        guardianCard.setPadding(dp(16), dp(16), dp(16), dp(16));
        guardianText = text("", 14, Color.rgb(205, 216, 235), false);
        guardianText.setLineSpacing(0, 1.25f);
        guardianCard.addView(guardianText);
        root.addView(guardianCard, lp(14));

        root.addView(section("Hoje"));
        LinearLayout statCard = card(14);
        statCard.setPadding(dp(16), dp(16), dp(16), dp(16));
        statsText = text("", 14, Color.rgb(205, 216, 235), false);
        statsText.setLineSpacing(0, 1.25f);
        statCard.addView(statsText);
        root.addView(statCard, lp(14));

        Button refresh = new Button(this);
        refresh.setAllCaps(false);
        refresh.setText("Atualizar diagnóstico");
        refresh.setTextColor(Color.WHITE);
        refresh.setBackground(rounded(Color.rgb(24, 39, 65), 14));
        refresh.setOnClickListener(v -> refresh());
        root.addView(refresh, new LinearLayout.LayoutParams(-1, dp(50)));

        Button privateDns = new Button(this);
        privateDns.setAllCaps(false);
        privateDns.setText("Abrir configurações de rede");
        privateDns.setTextColor(Color.WHITE);
        privateDns.setBackground(rounded(Color.rgb(24, 39, 65), 14));
        privateDns.setOnClickListener(v -> {
            try {
                startActivity(new Intent(Settings.ACTION_WIRELESS_SETTINGS));
            } catch (Throwable ignored) {}
        });
        LinearLayout.LayoutParams p = new LinearLayout.LayoutParams(-1, dp(50));
        p.topMargin = dp(9);
        root.addView(privateDns, p);

        TextView foot = text(
                "O ViaShield direciona ao túnel somente o endereço DNS virtual. O restante do Wi‑Fi/4G/5G continua pela conexão normal. Aplicativos com DNS/DoH próprio podem ignorar esse filtro.",
                12, Color.rgb(116, 132, 159), false);
        foot.setPadding(0, dp(16), 0, 0);
        root.addView(foot);

        return scroll;
    }

    private void addProvider(LinearLayout root, String id, String name, String sub) {
        LinearLayout row = card(14);
        row.setPadding(dp(16), dp(14), dp(16), dp(14));
        row.setGravity(Gravity.CENTER_VERTICAL);
        row.setClickable(true);

        LinearLayout texts = new LinearLayout(this);
        texts.setOrientation(LinearLayout.VERTICAL);
        texts.addView(text(name, 17, Color.WHITE, true));
        texts.addView(text(sub, 13, Color.rgb(155, 169, 194), false));

        TextView mark = text(selected.equals(id) ? "●" : "○", 28,
                selected.equals(id) ? Color.rgb(69, 218, 151) : Color.rgb(95, 111, 139), false);

        row.addView(texts, new LinearLayout.LayoutParams(0, -2, 1f));
        row.addView(mark);
        row.setOnClickListener(v -> {
            selected = id;
            uiPrefs.edit().putString("provider", id).apply();
            if (active) {
                stopProtection();
                startProtection();
            }
            render();
        });
        root.addView(row, lp(9));
    }

    private void requestVpn() {
        Intent intent = VpnService.prepare(this);
        if (intent != null) startActivityForResult(intent, VPN_REQUEST);
        else startProtection();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == VPN_REQUEST && resultCode == RESULT_OK) startProtection();
    }

    private void startProtection() {
        Intent i = new Intent(this, DnsVpnService.class);
        i.setAction(DnsVpnService.ACTION_START);
        i.putExtra(DnsVpnService.EXTRA_PROVIDER, selected);
        if (Build.VERSION.SDK_INT >= 26) startForegroundService(i); else startService(i);
        active = true;
        uiPrefs.edit().putBoolean("active", true).apply();
        refresh();
    }

    private void stopProtection() {
        Intent i = new Intent(this, DnsVpnService.class);
        i.setAction(DnsVpnService.ACTION_STOP);
        startService(i);
        active = false;
        uiPrefs.edit().putBoolean("active", false).apply();
        refresh();
    }

    private String providerName() {
        if ("controld".equals(selected)) return "Control D";
        if ("family".equals(selected)) return "AdGuard Family";
        return "AdGuard DNS";
    }

    private void refresh() {
        if (statusTitle == null) return;
        active = uiPrefs.getBoolean("active", active);

        long total = statsPrefs.getLong("total", 0);
        long blocked = statsPrefs.getLong("blocked", 0);
        long failures = statsPrefs.getLong("failures", 0);
        long latency = statsPrefs.getLong("latency", 0);
        String resolver = statsPrefs.getString("resolver", "—");
        String domain = statsPrefs.getString("last_domain", "—");
        double pct = total > 0 ? (blocked * 100.0 / total) : 0.0;

        statusTitle.setText(active ? "Proteção ativa" : "Proteção pausada");
        statusSubtitle.setText(active ? providerName() + " • failover automático ligado" : "Toque para proteger o aparelho");
        mainButton.setText(active ? "Pausar proteção" : "Ativar proteção");
        mainButton.setBackground(rounded(active ? Color.rgb(184, 67, 67) : Color.rgb(43, 109, 255), 15));

        statsText.setText(
                "Consultas DNS: " + total +
                "\nBloqueadas: " + blocked + " (" + String.format(Locale.US, "%.1f", pct) + "%)" +
                "\nÚltima latência: " + latency + " ms" +
                "\nÚltimo domínio: " + domain);

        if (active) {
            guardianText.setText(
                    "✓ Rota: somente DNS" +
                    "\n✓ Internet principal: direta" +
                    "\n✓ DNS criptografado: DoH" +
                    "\n✓ Resolver atual: " + resolver +
                    "\n✓ Cache local: ativo" +
                    "\n" + (failures == 0 ? "✓" : "⚠") + " Falhas de resolução: " + failures);
        } else {
            guardianText.setText("○ Guardian em espera\n○ A conexão não é alterada enquanto a proteção estiver pausada");
        }
    }

    private TextView section(String s) {
        TextView t = text(s, 14, Color.rgb(121, 145, 186), true);
        t.setPadding(dp(2), dp(8), 0, dp(9));
        return t;
    }

    private TextView text(String s, int size, int color, boolean bold) {
        TextView t = new TextView(this);
        t.setText(s);
        t.setTextSize(size);
        t.setTextColor(color);
        if (bold) t.setTypeface(Typeface.DEFAULT, Typeface.BOLD);
        return t;
    }

    private LinearLayout card(int radius) {
        LinearLayout l = new LinearLayout(this);
        l.setOrientation(LinearLayout.VERTICAL);
        l.setBackground(rounded(Color.rgb(15, 27, 48), radius));
        return l;
    }

    private GradientDrawable rounded(int color, int radius) {
        GradientDrawable d = new GradientDrawable();
        d.setShape(GradientDrawable.RECTANGLE);
        d.setColor(color);
        d.setCornerRadius(dp(radius));
        return d;
    }

    private LinearLayout.LayoutParams lp(int bottom) {
        LinearLayout.LayoutParams p = new LinearLayout.LayoutParams(-1, -2);
        p.bottomMargin = dp(bottom);
        return p;
    }

    private int dp(int v) {
        return (int) (v * getResources().getDisplayMetrics().density);
    }
}
