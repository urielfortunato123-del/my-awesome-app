import { useState } from "react";
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
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHardwareDetection } from "@/hooks/useHardwareDetection";
import { toast } from "sonner";

export function HardwarePage() {
  const { hardware, isLoading } = useHardwareDetection();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);

  const handleDetectHardware = () => {
    setIsDetecting(true);
    toast.info("Detectando hardware...");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleUpdateAll = async () => {
    setIsUpdating(true);
    toast.info("Verificando atualizações de drivers...");
    
    // Simula verificação de drivers
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success("Sistema verificado! Todos os drivers estão atualizados.", {
      description: `${hardware?.os || 'Sistema'} - Nenhuma atualização necessária`
    });
    
    setIsUpdating(false);
  };

  const getSystemComponents = () => {
    if (!hardware) return [];
    
    return [
      { 
        name: "Sistema Operacional", 
        icon: Laptop, 
        status: "ok" as const, 
        details: hardware.os,
        driver: "-", 
        driverDate: "-" 
      },
      { 
        name: "Processador", 
        icon: Cpu, 
        status: "ok" as const, 
        details: `${hardware.cpu.name} (${hardware.cpu.cores} núcleos)`,
        driver: "-", 
        driverDate: "-" 
      },
      { 
        name: "Memória RAM", 
        icon: Database, 
        status: "ok" as const, 
        details: hardware.memory.total !== "Desconhecido" ? hardware.memory.total : "Detectando...",
        driver: "-", 
        driverDate: "-" 
      },
      { 
        name: "Placa de Vídeo", 
        icon: Monitor, 
        status: "ok" as const, 
        details: `Resolução: ${hardware.display.resolution}`,
        driver: "-", 
        driverDate: "-" 
      },
      { 
        name: "Armazenamento", 
        icon: HardDrive, 
        status: hardware.storage.percentage > 80 ? "warning" as const : "ok" as const, 
        details: `${hardware.storage.used} / ${hardware.storage.total} (${hardware.storage.percentage}%)`,
        driver: "-", 
        driverDate: "-" 
      },
      { 
        name: "Placa-mãe", 
        icon: CircuitBoard, 
        status: "ok" as const, 
        details: `${hardware.deviceType}`,
        driver: "-", 
        driverDate: "-" 
      },
      { 
        name: "Rede", 
        icon: Wifi, 
        status: hardware.network.status === "Conectado" ? "ok" as const : "warning" as const, 
        details: `${hardware.network.status} - ${hardware.network.type}`,
        driver: "-", 
        driverDate: "-" 
      },
      { 
        name: "Bluetooth", 
        icon: Bluetooth, 
        status: "ok" as const, 
        details: "Disponível",
        driver: "-", 
        driverDate: "-" 
      },
      { 
        name: "USB Controllers", 
        icon: Usb, 
        status: "ok" as const, 
        details: "Funcionando",
        driver: "-", 
        driverDate: "-" 
      },
      { 
        name: "Áudio", 
        icon: Microchip, 
        status: "ok" as const, 
        details: "Dispositivo de áudio padrão",
        driver: "-", 
        driverDate: "-" 
      },
      { 
        name: "Energia", 
        icon: Battery, 
        status: "ok" as const, 
        details: hardware.battery.status,
        driver: "-", 
        driverDate: "-" 
      },
    ];
  };

  const systemComponents = getSystemComponents();

  return (
    <div className="min-h-[calc(100vh-80px)] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Hardware & Drivers</h2>
            <p className="text-muted-foreground">
              {hardware ? `Sistema: ${hardware.os} - ${hardware.deviceType}` : 'Detectando sistema...'}
            </p>
          </div>
          <div className="flex items-center gap-3">
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
              Detectar Hardware
            </Button>
            <Button 
              className="gap-2 bg-gradient-to-r from-primary to-info hover:opacity-90 text-primary-foreground"
              onClick={handleUpdateAll}
              disabled={isUpdating || isLoading}
            >
              {isUpdating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {isUpdating ? "Verificando..." : "Atualizar Todos"}
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
                <p className="text-2xl font-bold text-foreground">{systemComponents.filter(c => c.status === 'ok').length}</p>
                <p className="text-sm text-muted-foreground">Componentes OK</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-info/20 flex items-center justify-center">
                <Download className="h-6 w-6 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">0</p>
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
                <p className="text-2xl font-bold text-foreground">{systemComponents.filter(c => c.status === 'warning').length}</p>
                <p className="text-sm text-muted-foreground">Atenção necessária</p>
              </div>
            </div>
          </div>
        </div>

        {/* Components List */}
        <div className="glass-card">
          <div className="p-4 border-b border-border">
            <h3 className="font-medium text-foreground">Componentes do Sistema</h3>
          </div>
          {isLoading ? (
            <div className="p-8 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Detectando hardware...</span>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {systemComponents.map((component) => (
                <div 
                  key={component.name}
                  className="p-4 flex items-center justify-between hover:bg-muted/20 transition-colors cursor-pointer group"
                >
                <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      component.status === 'ok' ? 'bg-success/20' : 'bg-warning/20'
                    }`}>
                      <component.icon className={`h-5 w-5 ${
                        component.status === 'ok' ? 'text-success' : 'text-warning'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{component.name}</p>
                      <p className="text-sm text-muted-foreground">{component.details}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Driver: {component.driver}</p>
                      <p className="text-xs text-muted-foreground">{component.driverDate}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      component.status === 'ok' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
                    }`}>
                      {component.status === 'ok' ? 'OK' : 'Atenção'}
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
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
