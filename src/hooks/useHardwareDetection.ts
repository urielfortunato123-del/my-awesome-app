import { useState, useEffect } from "react";

interface HardwareInfo {
  cpu: { name: string; cores: number };
  memory: { total: string; used: number };
  storage: { used: string; total: string; percentage: number };
  display: { resolution: string };
  network: { status: string; type: string };
  battery: { status: string; level: number; charging: boolean };
  os: string;
}

export function useHardwareDetection() {
  const [hardware, setHardware] = useState<HardwareInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const detectHardware = async () => {
      try {
        // Detect OS
        const userAgent = navigator.userAgent;
        let os = "Desconhecido";
        if (userAgent.includes("Win")) os = "Windows";
        else if (userAgent.includes("Mac")) os = "macOS";
        else if (userAgent.includes("Linux")) os = "Linux";
        else if (userAgent.includes("Android")) os = "Android";
        else if (userAgent.includes("iOS")) os = "iOS";

        // CPU info
        const cores = navigator.hardwareConcurrency || 0;
        let cpuName = "Processador";
        if (cores >= 16) cpuName = "Processador Multi-Core";
        else if (cores >= 8) cpuName = "Processador Octa-Core";
        else if (cores >= 4) cpuName = "Processador Quad-Core";
        else if (cores >= 2) cpuName = "Processador Dual-Core";

        // Memory info (approximate - deviceMemory gives GB)
        const deviceMemory = (navigator as any).deviceMemory;
        let memoryTotal = "Desconhecido";
        if (deviceMemory) {
          memoryTotal = `${deviceMemory} GB`;
        }

        // Storage info
        let storageUsed = "Calculando...";
        let storageTotal = "Calculando...";
        let storagePercentage = 0;
        
        if ('storage' in navigator && 'estimate' in navigator.storage) {
          const estimate = await navigator.storage.estimate();
          if (estimate.usage && estimate.quota) {
            const usedGB = (estimate.usage / (1024 * 1024 * 1024)).toFixed(2);
            const totalGB = (estimate.quota / (1024 * 1024 * 1024)).toFixed(2);
            storageUsed = `${usedGB} GB`;
            storageTotal = `${totalGB} GB`;
            storagePercentage = Math.round((estimate.usage / estimate.quota) * 100);
          }
        }

        // Display info
        const resolution = `${window.screen.width}x${window.screen.height}`;

        // Network info
        const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
        let networkStatus = navigator.onLine ? "Conectado" : "Desconectado";
        let networkType = "Rede";
        if (connection) {
          networkType = connection.effectiveType?.toUpperCase() || "Rede";
          if (connection.type === 'wifi') networkType = "Wi-Fi";
          else if (connection.type === 'cellular') networkType = "Dados Móveis";
          else if (connection.type === 'ethernet') networkType = "Ethernet";
        }

        // Battery info
        let batteryStatus = "AC Power";
        let batteryLevel = 100;
        let batteryCharging = true;

        if ('getBattery' in navigator) {
          try {
            const battery: any = await (navigator as any).getBattery();
            batteryLevel = Math.round(battery.level * 100);
            batteryCharging = battery.charging;
            batteryStatus = battery.charging ? "Carregando" : `${batteryLevel}%`;
            if (batteryCharging && batteryLevel === 100) {
              batteryStatus = "AC Power";
            }
          } catch (e) {
            // Battery API not available
          }
        }

        setHardware({
          cpu: { name: cpuName, cores },
          memory: { total: memoryTotal, used: 0 },
          storage: { used: storageUsed, total: storageTotal, percentage: storagePercentage },
          display: { resolution },
          network: { status: networkStatus, type: networkType },
          battery: { status: batteryStatus, level: batteryLevel, charging: batteryCharging },
          os
        });
      } catch (error) {
        console.error("Error detecting hardware:", error);
      } finally {
        setIsLoading(false);
      }
    };

    detectHardware();

    // Listen for online/offline changes
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
