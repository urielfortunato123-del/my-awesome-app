import { useState, useEffect } from "react";
import { 
  Cpu, 
  HardDrive, 
  Monitor, 
  Wifi, 
  Battery, 
  Database,
  Microchip,
  CircuitBoard,
  Usb,
  Bluetooth,
  RefreshCw,
  Download,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Laptop,
  Loader2,
  Clock,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useHardwareDetection } from "@/hooks/useHardwareDetection";
import { toast } from "sonner";

interface DriverInfo {
  id: string;
  name: string;
  icon: React.ElementType;
  status: "ok" | "update" | "warning" | "downloading" | "installing";
  details: string;
  currentVersion: string;
  newVersion?: string;
  driverDate: string;
  downloadProgress?: number;
}

export function HardwarePage() {
  const { hardware, isLoading } = useHardwareDetection();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [drivers, setDrivers] = useState<DriverInfo[]>([]);

  // Gera lista de drivers baseado no hardware detectado
  useEffect(() => {
    if (!hardware) return;
    
    const initialDrivers: DriverInfo[] = [
      { 
        id: "device",
        name: "Dispositivo", 
        icon: Laptop, 
        status: "ok", 
        details: hardware.deviceModel,
        currentVersion: hardware.deviceType,
        driverDate: "-"
      },
      { 
        id: "os",
        name: "Sistema Operacional", 
        icon: Laptop, 
        status: "ok", 
        details: hardware.osVersion ? `${hardware.os} ${hardware.osVersion}` : hardware.os,
        currentVersion: "Atual",
        driverDate: new Date().toLocaleDateString('pt-BR')
      },
      { 
        id: "browser",
        name: "Navegador", 
        icon: Monitor, 
        status: "ok", 
        details: hardware.browserVersion ? `${hardware.browser} v${hardware.browserVersion}` : hardware.browser,
        currentVersion: hardware.browserVersion || "-",
        driverDate: "-"
      },
      { 
        id: "cpu",
        name: "Processador", 
        icon: Cpu, 
        status: "ok", 
        details: `${hardware.cpu.name} (${hardware.cpu.cores} núcleos)`,
        currentVersion: `${hardware.cpu.cores} cores`,
        driverDate: "-"
      },
      { 
        id: "memory",
        name: "Memória RAM", 
        icon: Database, 
        status: hardware.memory.total === "Não disponível" ? "warning" : "ok", 
        details: hardware.memory.total,
        currentVersion: "-",
        driverDate: "-"
      },
      { 
        id: "gpu",
        name: "Tela", 
        icon: Monitor, 
        status: "ok", 
        details: `${hardware.display.resolution} @${hardware.display.pixelRatio}x (${hardware.display.colorDepth}bit)`,
        currentVersion: "-",
        driverDate: "-"
      },
      { 
        id: "storage",
        name: "Armazenamento", 
        icon: HardDrive, 
        status: hardware.storage.percentage > 80 ? "warning" : "ok", 
        details: `${hardware.storage.used} / ${hardware.storage.total} (${hardware.storage.percentage}%)`,
        currentVersion: "-",
        driverDate: "-"
      },
      { 
        id: "network",
        name: "Rede", 
        icon: Wifi, 
        status: hardware.network.status === "Conectado" ? "ok" : "warning", 
        details: hardware.network.downlink 
          ? `${hardware.network.status} - ${hardware.network.type} (${hardware.network.downlink} Mbps)`
          : `${hardware.network.status} - ${hardware.network.type}`,
        currentVersion: "-",
        driverDate: "-"
      },
      { 
        id: "bluetooth",
        name: "Bluetooth", 
        icon: Bluetooth, 
        status: "ok", 
        details: "Disponível",
        currentVersion: "-",
        driverDate: "-"
      },
      { 
        id: "usb",
        name: "USB", 
        icon: Usb, 
        status: "ok", 
        details: "Funcionando",
        currentVersion: "-",
        driverDate: "-"
      },
      { 
        id: "audio",
        name: "Áudio", 
        icon: Microchip, 
        status: "ok", 
        details: "Dispositivo de áudio",
        currentVersion: "-",
        driverDate: "-"
      },
      { 
        id: "power",
        name: "Energia", 
        icon: Battery, 
        status: hardware.battery.level < 20 && !hardware.battery.charging ? "warning" : "ok", 
        details: hardware.battery.status,
        currentVersion: `${hardware.battery.level}%`,
        driverDate: "-"
      },
      { 
        id: "language",
        name: "Idioma", 
        icon: Laptop, 
        status: "ok", 
        details: hardware.language,
        currentVersion: "-",
        driverDate: "-"
      },
    ];
    
    setDrivers(initialDrivers);
  }, [hardware]);

  const handleDetectHardware = () => {
    setIsDetecting(true);
    toast.info("Detectando hardware...");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleScanForUpdates = async () => {
    setIsScanning(true);
    toast.info("Verificando atualizações de drivers...", {
      description: "Isso pode levar alguns segundos"
    });
    
    // Simula scan progressivo
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simula encontrar algumas atualizações
    const driversWithUpdates = ["gpu", "audio", "network"];
    const newVersions: Record<string, string> = {
      gpu: "31.0.15.5000",
      audio: "6.0.9500.1",
      network: "22.200.0"
    };
    
    setDrivers(prev => prev.map(driver => {
      if (driversWithUpdates.includes(driver.id)) {
        return {
          ...driver,
          status: "update" as const,
          newVersion: newVersions[driver.id]
        };
      }
      return driver;
    }));
    
    setIsScanning(false);
    setHasScanned(true);
    
    const updatesCount = driversWithUpdates.length;
    toast.success(`Verificação concluída!`, {
      description: `${updatesCount} atualizações disponíveis`
    });
  };

  const handleDownloadDriver = async (driverId: string) => {
    // Inicia download
    setDrivers(prev => prev.map(driver => 
      driver.id === driverId 
        ? { ...driver, status: "downloading" as const, downloadProgress: 0 }
        : driver
    ));
    
    const driverName = drivers.find(d => d.id === driverId)?.name || "Driver";
    toast.info(`Baixando ${driverName}...`);
    
    // Simula progresso de download
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setDrivers(prev => prev.map(driver => 
        driver.id === driverId 
          ? { ...driver, downloadProgress: progress }
          : driver
      ));
    }
    
    // Inicia instalação
    setDrivers(prev => prev.map(driver => 
      driver.id === driverId 
        ? { ...driver, status: "installing" as const }
        : driver
    ));
    
    toast.info(`Instalando ${driverName}...`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Finaliza
    setDrivers(prev => prev.map(driver => 
      driver.id === driverId 
        ? { 
            ...driver, 
            status: "ok" as const, 
            currentVersion: driver.newVersion || driver.currentVersion,
            newVersion: undefined,
            downloadProgress: undefined,
            driverDate: new Date().toLocaleDateString('pt-BR')
          }
        : driver
    ));
    
    toast.success(`${driverName} atualizado com sucesso!`);
  };

  const handleUpdateAll = async () => {
    const driversToUpdate = drivers.filter(d => d.status === "update");
    
    if (driversToUpdate.length === 0) {
      // Se não há atualizações, faz scan primeiro
      await handleScanForUpdates();
      return;
    }
    
    setIsUpdating(true);
    toast.info(`Atualizando ${driversToUpdate.length} drivers...`);
    
    for (const driver of driversToUpdate) {
      await handleDownloadDriver(driver.id);
    }
    
    setIsUpdating(false);
    toast.success("Todos os drivers foram atualizados!", {
      description: `${hardware?.os || 'Sistema'} está totalmente atualizado`
    });
  };

  const updatesAvailable = drivers.filter(d => d.status === "update").length;
  const warningsCount = drivers.filter(d => d.status === "warning").length;
  const okCount = drivers.filter(d => d.status === "ok").length;

  const getStatusIcon = (status: DriverInfo["status"]) => {
    switch (status) {
      case "downloading":
      case "installing":
        return <Loader2 className="h-5 w-5 animate-spin text-info" />;
      case "update":
        return <Download className="h-5 w-5 text-info" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-warning" />;
      default:
        return <CheckCircle className="h-5 w-5 text-success" />;
    }
  };

  const getStatusBadge = (driver: DriverInfo) => {
    switch (driver.status) {
      case "downloading":
        return (
          <div className="flex items-center gap-2">
            <div className="w-24">
              <Progress value={driver.downloadProgress} className="h-2" />
            </div>
            <span className="text-xs text-info">{driver.downloadProgress}%</span>
          </div>
        );
      case "installing":
        return (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-info/20 text-info text-xs font-medium">
            <Loader2 className="h-3 w-3 animate-spin" />
            Instalando...
          </div>
        );
      case "update":
        return (
          <Button 
            size="sm" 
            className="h-7 text-xs gap-1 bg-info hover:bg-info/90"
            onClick={(e) => {
              e.stopPropagation();
              handleDownloadDriver(driver.id);
            }}
          >
            <Download className="h-3 w-3" />
            Atualizar
          </Button>
        );
      case "warning":
        return (
          <div className="px-3 py-1 rounded-full bg-warning/20 text-warning text-xs font-medium">
            Atenção
          </div>
        );
      default:
        return (
          <div className="px-3 py-1 rounded-full bg-success/20 text-success text-xs font-medium">
            OK
          </div>
        );
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Hardware & Drivers</h2>
            <p className="text-muted-foreground">
              {hardware ? `Sistema: ${hardware.os} - ${hardware.deviceType}` : 'Detectando sistema...'}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Button 
              variant="outline" 
              className="gap-2" 
              onClick={handleDetectHardware}
              disabled={isDetecting}
            >
              {isDetecting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Detectar
            </Button>
            <Button 
              variant="outline"
              className="gap-2" 
              onClick={handleScanForUpdates}
              disabled={isScanning || isUpdating}
            >
              {isScanning ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              {isScanning ? "Verificando..." : "Buscar Atualizações"}
            </Button>
            <Button 
              className="gap-2 bg-gradient-to-r from-primary to-info hover:opacity-90 text-primary-foreground"
              onClick={handleUpdateAll}
              disabled={isUpdating || isLoading || isScanning}
            >
              {isUpdating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {isUpdating ? "Atualizando..." : updatesAvailable > 0 ? `Atualizar Todos (${updatesAvailable})` : "Atualizar Todos"}
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{okCount}</p>
                <p className="text-sm text-muted-foreground">Drivers atualizados</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-info/20 flex items-center justify-center">
                <Download className="h-6 w-6 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{updatesAvailable}</p>
                <p className="text-sm text-muted-foreground">Atualizações disponíveis</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{warningsCount}</p>
                <p className="text-sm text-muted-foreground">Atenção necessária</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scan prompt */}
        {!hasScanned && !isScanning && (
          <div className="glass-card p-4 border-info/30 bg-info/5">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-info" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Verificação de drivers pendente</p>
                <p className="text-xs text-muted-foreground">Clique em "Buscar Atualizações" para verificar se há drivers desatualizados</p>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                className="gap-1 border-info/30 text-info hover:bg-info/10"
                onClick={handleScanForUpdates}
              >
                <Search className="h-3 w-3" />
                Verificar agora
              </Button>
            </div>
          </div>
        )}

        {/* Components List */}
        <div className="glass-card">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-medium text-foreground">Componentes do Sistema</h3>
            {hasScanned && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-success" />
                Última verificação: agora
              </span>
            )}
          </div>
          {isLoading ? (
            <div className="p-8 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Detectando hardware...</span>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {drivers.map((driver) => (
                <div 
                  key={driver.id}
                  className="p-4 flex items-center justify-between hover:bg-muted/20 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      driver.status === 'ok' ? 'bg-success/20' :
                      driver.status === 'update' || driver.status === 'downloading' || driver.status === 'installing' ? 'bg-info/20' : 
                      'bg-warning/20'
                    }`}>
                      {getStatusIcon(driver.status)}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{driver.name}</p>
                      <p className="text-sm text-muted-foreground">{driver.details}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 md:gap-6">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm text-muted-foreground">
                        {driver.newVersion ? (
                          <span className="text-info">{driver.currentVersion} → {driver.newVersion}</span>
                        ) : (
                          `v${driver.currentVersion}`
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">{driver.driverDate}</p>
                    </div>
                    {getStatusBadge(driver)}
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors hidden md:block" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
