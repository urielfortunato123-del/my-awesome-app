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
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Component {
  name: string;
  icon: React.ElementType;
  status: "ok" | "warning" | "update";
  details: string;
  driver: string;
  driverDate: string;
}

const systemComponents: Component[] = [
  { name: "Processador", icon: Cpu, status: "ok", details: "Detectando...", driver: "-", driverDate: "-" },
  { name: "Memória RAM", icon: Database, status: "ok", details: "Detectando...", driver: "-", driverDate: "-" },
  { name: "Placa de Vídeo", icon: Monitor, status: "update", details: "Detectando...", driver: "-", driverDate: "-" },
  { name: "Armazenamento", icon: HardDrive, status: "ok", details: "Detectando...", driver: "-", driverDate: "-" },
  { name: "Placa-mãe", icon: CircuitBoard, status: "ok", details: "Detectando...", driver: "-", driverDate: "-" },
  { name: "Rede Wi-Fi", icon: Wifi, status: "ok", details: "Detectando...", driver: "-", driverDate: "-" },
  { name: "Bluetooth", icon: Bluetooth, status: "warning", details: "Detectando...", driver: "-", driverDate: "-" },
  { name: "USB Controllers", icon: Usb, status: "ok", details: "Detectando...", driver: "-", driverDate: "-" },
  { name: "Áudio", icon: Microchip, status: "ok", details: "Detectando...", driver: "-", driverDate: "-" },
  { name: "Energia", icon: Battery, status: "ok", details: "Detectando...", driver: "-", driverDate: "-" },
];

export function HardwarePage() {
  return (
    <div className="min-h-[calc(100vh-80px)] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Hardware & Drivers</h2>
            <p className="text-muted-foreground">Gerencie componentes e atualize drivers do sistema</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Detectar Hardware
            </Button>
            <Button className="gap-2 bg-gradient-to-r from-primary to-info hover:opacity-90 text-primary-foreground">
              <Download className="h-4 w-4" />
              Atualizar Todos
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
                <p className="text-2xl font-bold text-foreground">0</p>
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
                <p className="text-2xl font-bold text-foreground">0</p>
                <p className="text-sm text-muted-foreground">Problemas detectados</p>
              </div>
            </div>
          </div>
        </div>

        {/* Components List */}
        <div className="glass-card">
          <div className="p-4 border-b border-border">
            <h3 className="font-medium text-foreground">Componentes do Sistema</h3>
          </div>
          <div className="divide-y divide-border">
            {systemComponents.map((component) => (
              <div 
                key={component.name}
                className="p-4 flex items-center justify-between hover:bg-muted/20 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    component.status === 'ok' ? 'bg-success/20' :
                    component.status === 'update' ? 'bg-info/20' : 'bg-warning/20'
                  }`}>
                    <component.icon className={`h-5 w-5 ${
                      component.status === 'ok' ? 'text-success' :
                      component.status === 'update' ? 'text-info' : 'text-warning'
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
                    component.status === 'ok' ? 'bg-success/20 text-success' :
                    component.status === 'update' ? 'bg-info/20 text-info' : 'bg-warning/20 text-warning'
                  }`}>
                    {component.status === 'ok' ? 'Atualizado' :
                     component.status === 'update' ? 'Atualização' : 'Atenção'}
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
