import { useState, useEffect } from "react";

interface HardwareInfo {
  cpu: { name: string; cores: number };
  memory: { total: string; used: number };
  storage: { used: string; total: string; percentage: number };
  display: { resolution: string; colorDepth: number; pixelRatio: number };
  network: { status: string; type: string; downlink?: number };
  battery: { status: string; level: number; charging: boolean };
  os: string;
  osVersion: string;
  isMobile: boolean;
  deviceType: string;
  deviceModel: string;
  browser: string;
  browserVersion: string;
  language: string;
  platform: string;
}

// Parse user agent para extrair informações detalhadas
function parseUserAgent(ua: string): { 
  os: string; 
  osVersion: string; 
  deviceModel: string; 
  browser: string; 
  browserVersion: string;
  isMobile: boolean;
  deviceType: string;
} {
  const uaLower = ua.toLowerCase();
  let os = "Desconhecido";
  let osVersion = "";
  let deviceModel = "Dispositivo";
  let browser = "Navegador";
  let browserVersion = "";
  let isMobile = false;
  let deviceType = "Computador";

  // Detectar dispositivos móveis primeiro
  isMobile = /mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua);

  // Detectar OS e versão
  if (/android/i.test(ua)) {
    os = "Android";
    const match = ua.match(/android\s+(\d+\.?\d*\.?\d*)/i);
    osVersion = match ? match[1] : "";
    isMobile = true;
    
    // Detectar modelo do dispositivo Android
    const modelMatch = ua.match(/;\s*([^;)]+)\s*build/i);
    if (modelMatch) {
      deviceModel = modelMatch[1].trim();
    } else {
      // Tentar outro padrão
      const altMatch = ua.match(/android[^;]*;\s*([^)]+)\)/i);
      if (altMatch) {
        const parts = altMatch[1].split(';');
        deviceModel = parts[parts.length - 1].trim().replace(/build.*/i, '').trim();
      }
    }
    
    deviceType = /mobile/i.test(ua) ? "Smartphone Android" : "Tablet Android";
  } else if (/iphone/i.test(ua)) {
    os = "iOS";
    const match = ua.match(/os\s+(\d+[_\d]*)/i);
    osVersion = match ? match[1].replace(/_/g, '.') : "";
    deviceModel = "iPhone";
    isMobile = true;
    deviceType = "iPhone";
  } else if (/ipad/i.test(ua)) {
    os = "iPadOS";
    const match = ua.match(/os\s+(\d+[_\d]*)/i);
    osVersion = match ? match[1].replace(/_/g, '.') : "";
    deviceModel = "iPad";
    isMobile = true;
    deviceType = "iPad";
  } else if (/macintosh|mac os x/i.test(ua)) {
    os = "macOS";
    const match = ua.match(/mac os x\s+(\d+[_\d\.]*)/i);
    osVersion = match ? match[1].replace(/_/g, '.') : "";
    deviceModel = "Mac";
    deviceType = "Mac";
  } else if (/windows nt/i.test(ua)) {
    os = "Windows";
    const match = ua.match(/windows nt\s+(\d+\.?\d*)/i);
    if (match) {
      const ntVersion = match[1];
      // Mapear versões NT para nomes comerciais
      const versionMap: Record<string, string> = {
        '10.0': '10/11',
        '6.3': '8.1',
        '6.2': '8',
        '6.1': '7',
        '6.0': 'Vista',
        '5.1': 'XP'
      };
      osVersion = versionMap[ntVersion] || ntVersion;
    }
    deviceModel = "PC Windows";
    deviceType = "Computador Windows";
  } else if (/linux/i.test(ua)) {
    os = "Linux";
    if (/ubuntu/i.test(ua)) {
      osVersion = "Ubuntu";
      deviceModel = "PC Ubuntu";
    } else if (/fedora/i.test(ua)) {
      osVersion = "Fedora";
      deviceModel = "PC Fedora";
    } else if (/debian/i.test(ua)) {
      osVersion = "Debian";
      deviceModel = "PC Debian";
    } else {
      deviceModel = "PC Linux";
    }
    deviceType = "Computador Linux";
  } else if (/cros/i.test(ua)) {
    os = "Chrome OS";
    deviceModel = "Chromebook";
    deviceType = "Chromebook";
  }

  // Detectar navegador e versão
  if (/edg/i.test(ua)) {
    browser = "Microsoft Edge";
    const match = ua.match(/edg\/(\d+\.?\d*)/i);
    browserVersion = match ? match[1] : "";
  } else if (/chrome/i.test(ua) && !/chromium/i.test(ua)) {
    browser = "Google Chrome";
    const match = ua.match(/chrome\/(\d+\.?\d*)/i);
    browserVersion = match ? match[1] : "";
  } else if (/firefox/i.test(ua)) {
    browser = "Mozilla Firefox";
    const match = ua.match(/firefox\/(\d+\.?\d*)/i);
    browserVersion = match ? match[1] : "";
  } else if (/safari/i.test(ua) && !/chrome/i.test(ua)) {
    browser = "Safari";
    const match = ua.match(/version\/(\d+\.?\d*)/i);
    browserVersion = match ? match[1] : "";
  } else if (/opera|opr/i.test(ua)) {
    browser = "Opera";
    const match = ua.match(/(?:opera|opr)\/(\d+\.?\d*)/i);
    browserVersion = match ? match[1] : "";
  } else if (/samsungbrowser/i.test(ua)) {
    browser = "Samsung Internet";
    const match = ua.match(/samsungbrowser\/(\d+\.?\d*)/i);
    browserVersion = match ? match[1] : "";
  }

  return { os, osVersion, deviceModel, browser, browserVersion, isMobile, deviceType };
}

export function useHardwareDetection() {
  const [hardware, setHardware] = useState<HardwareInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const detectHardware = async () => {
      try {
        const ua = navigator.userAgent;
        const parsed = parseUserAgent(ua);

        // CPU info
        const cores = navigator.hardwareConcurrency || 0;
        let cpuName = "Processador";
        if (parsed.isMobile) {
          if (cores >= 8) cpuName = "Processador Octa-Core";
          else if (cores >= 6) cpuName = "Processador Hexa-Core";
          else if (cores >= 4) cpuName = "Processador Quad-Core";
          else if (cores >= 2) cpuName = "Processador Dual-Core";
          else cpuName = "Processador Mobile";
        } else {
          if (cores >= 16) cpuName = "Processador Multi-Core";
          else if (cores >= 8) cpuName = "Processador Octa-Core";
          else if (cores >= 4) cpuName = "Processador Quad-Core";
          else if (cores >= 2) cpuName = "Processador Dual-Core";
        }

        // Memory info
        const deviceMemory = (navigator as any).deviceMemory;
        let memoryTotal = "Não disponível";
        if (deviceMemory) {
          memoryTotal = `${deviceMemory} GB`;
        }

        // Storage info
        let storageUsed = "Calculando...";
        let storageTotal = "Calculando...";
        let storagePercentage = 0;
        
        if ('storage' in navigator && 'estimate' in navigator.storage) {
          const estimate = await navigator.storage.estimate();
          if (estimate.usage !== undefined && estimate.quota) {
            const usedMB = estimate.usage / (1024 * 1024);
            const totalGB = estimate.quota / (1024 * 1024 * 1024);
            
            if (usedMB < 1024) {
              storageUsed = `${usedMB.toFixed(1)} MB`;
            } else {
              storageUsed = `${(usedMB / 1024).toFixed(2)} GB`;
            }
            storageTotal = `${totalGB.toFixed(1)} GB`;
            storagePercentage = Math.round((estimate.usage / estimate.quota) * 100);
          }
        }

        // Display info
        const resolution = `${window.screen.width}x${window.screen.height}`;
        const colorDepth = window.screen.colorDepth || 24;
        const pixelRatio = window.devicePixelRatio || 1;

        // Network info
        const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
        let networkStatus = navigator.onLine ? "Conectado" : "Desconectado";
        let networkType = "Rede";
        let downlink: number | undefined;
        
        if (connection) {
          downlink = connection.downlink;
          const effectiveType = connection.effectiveType?.toUpperCase();
          
          if (connection.type === 'wifi') {
            networkType = "Wi-Fi";
          } else if (connection.type === 'cellular') {
            networkType = effectiveType ? `${effectiveType} Móvel` : "Dados Móveis";
          } else if (connection.type === 'ethernet') {
            networkType = "Ethernet";
          } else if (effectiveType) {
            networkType = effectiveType;
          }
        }

        // Battery info
        let batteryStatus = "Sem bateria";
        let batteryLevel = 100;
        let batteryCharging = false;

        if ('getBattery' in navigator) {
          try {
            const battery: any = await (navigator as any).getBattery();
            batteryLevel = Math.round(battery.level * 100);
            batteryCharging = battery.charging;
            
            if (batteryCharging && batteryLevel === 100) {
              batteryStatus = "Carregado (AC)";
            } else if (batteryCharging) {
              batteryStatus = `Carregando (${batteryLevel}%)`;
            } else {
              batteryStatus = `${batteryLevel}%`;
            }

            // Listener para mudanças na bateria
            battery.addEventListener('chargingchange', () => {
              setHardware(prev => prev ? {
                ...prev,
                battery: {
                  ...prev.battery,
                  charging: battery.charging,
                  status: battery.charging 
                    ? `Carregando (${Math.round(battery.level * 100)}%)`
                    : `${Math.round(battery.level * 100)}%`
                }
              } : null);
            });

            battery.addEventListener('levelchange', () => {
              const level = Math.round(battery.level * 100);
              setHardware(prev => prev ? {
                ...prev,
                battery: {
                  ...prev.battery,
                  level,
                  status: battery.charging 
                    ? level === 100 ? "Carregado (AC)" : `Carregando (${level}%)`
                    : `${level}%`
                }
              } : null);
            });
          } catch (e) {
            console.log("Battery API não disponível");
          }
        }

        setHardware({
          cpu: { name: cpuName, cores },
          memory: { total: memoryTotal, used: 0 },
          storage: { used: storageUsed, total: storageTotal, percentage: storagePercentage },
          display: { resolution, colorDepth, pixelRatio },
          network: { status: networkStatus, type: networkType, downlink },
          battery: { status: batteryStatus, level: batteryLevel, charging: batteryCharging },
          os: parsed.os,
          osVersion: parsed.osVersion,
          isMobile: parsed.isMobile,
          deviceType: parsed.deviceType,
          deviceModel: parsed.deviceModel,
          browser: parsed.browser,
          browserVersion: parsed.browserVersion,
          language: navigator.language,
          platform: navigator.platform || "Desconhecido"
        });
      } catch (error) {
        console.error("Erro ao detectar hardware:", error);
      } finally {
        setIsLoading(false);
      }
    };

    detectHardware();

    // Listeners de rede
    const handleOnline = () => {
      setHardware(prev => prev ? { ...prev, network: { ...prev.network, status: "Conectado" } } : null);
    };
    const handleOffline = () => {
      setHardware(prev => prev ? { ...prev, network: { ...prev.network, status: "Desconectado" } } : null);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { hardware, isLoading };
}
