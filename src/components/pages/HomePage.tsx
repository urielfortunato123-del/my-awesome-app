import { 
  Search, 
  HardDrive, 
  RefreshCw, 
  Trash2, 
  Shield, 
  Database,
  Cpu,
  Wifi,
  Battery,
  Monitor,
  ChevronRight,
  Play,
  Clock,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHardwareDetection } from "@/hooks/useHardwareDetection";

interface HomePageProps {
  onNavigate: (tab: string) => void;
}

const quickActions = [
  { 
    icon: Search, 
    label: "Varredura Completa",
    description: "Analisa todo o sistema",
    color: "from-primary to-info"
  },
  { 
    icon: HardDrive, 
    label: "Limpar Disco",
    description: "Remove arquivos temporários",
    color: "from-secondary to-purple-400"
  },
  { 
    icon: RefreshCw, 
    label: "Atualizações",
    description: "Busca novas versões",
    color: "from-accent to-warning"
  },
  { 
    icon: Shield, 
    label: "Verificar Segurança",
    description: "Proteção do sistema",
    color: "from-success to-emerald-400"
  },
];

export function HomePage({ onNavigate }: HomePageProps) {
  const { hardware, isLoading } = useHardwareDetection();

  const systemModules = [
    { 
      icon: Cpu, 
      label: "Processador", 
      status: "ok" as const, 
      info: isLoading ? "Detectando..." : hardware ? `${hardware.cpu.cores} núcleos` : "Aguardando" 
    },
    { 
      icon: Database, 
      label: "Memória RAM", 
      status: "ok" as const, 
      info: isLoading ? "Detectando..." : hardware?.memory.total || "Aguardando" 
    },
    { 
      icon: HardDrive, 
      label: "Armazenamento", 
      status: "ok" as const, 
      info: isLoading ? "Detectando..." : hardware ? `${hardware.storage.percentage}% usado` : "Aguardando" 
    },
    { 
      icon: Monitor, 
      label: "Display", 
      status: "ok" as const, 
      info: isLoading ? "Detectando..." : hardware?.display.resolution || "Aguardando" 
    },
    { 
      icon: Wifi, 
      label: "Rede", 
      status: hardware?.network.status === "Desconectado" ? "warning" as const : "ok" as const, 
      info: isLoading ? "Detectando..." : hardware?.network.status || "Aguardando" 
    },
    { 
      icon: Battery, 
      label: "Energia", 
      status: "ok" as const, 
      info: isLoading ? "Detectando..." : hardware?.battery.status || "Aguardando" 
    },
  ];

  return (
    <div className="p-3 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-8">
        {/* Hero Section */}
        <div className="glass-card p-4 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl md:text-3xl font-semibold text-foreground mb-1 md:mb-2">
                Bem-vindo ao <span className="gradient-text">Essencial</span>
              </h2>
              <p className="text-xs md:text-base text-muted-foreground max-w-xl">
                Sistema em Ordem.
                {hardware && (
                  <span className="ml-1 text-primary">
                    • {hardware.os} ({hardware.deviceType})
                  </span>
                )}
              </p>
            </div>
            <Button 
              size="sm"
              className="bg-gradient-to-r from-primary to-info hover:opacity-90 text-primary-foreground gap-2 md:size-lg"
              onClick={() => onNavigate('scan')}
            >
              <Play className="h-4 w-4 md:h-5 md:w-5" />
              <span className="text-xs md:text-sm">Iniciar Varredura</span>
            </Button>
          </div>
        </div>

        {/* Quick Actions - 2x2 grid on mobile */}
        <div>
          <h3 className="text-sm md:text-lg font-medium text-foreground mb-2 md:mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
            {quickActions.map((action) => (
              <button
                key={action.label}
                className="feature-card text-left group p-3 md:p-6"
                onClick={() => onNavigate('scan')}
              >
                <div className={`w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-2 md:mb-4`}>
                  <action.icon className="h-4 w-4 md:h-6 md:w-6 text-primary-foreground" />
                </div>
                <h4 className="text-xs md:text-base text-foreground font-medium mb-0.5 md:mb-1">{action.label}</h4>
                <p className="text-[10px] md:text-sm text-muted-foreground hidden md:block">{action.description}</p>
                <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground mt-1 md:mt-3 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-6">
          {/* Hardware Status */}
          <div className="lg:col-span-2 glass-card p-3 md:p-6">
            <div className="flex items-center justify-between mb-3 md:mb-6">
              <div className="flex items-center gap-2 md:gap-3">
                <h3 className="text-sm md:text-lg font-medium text-foreground">Status do Hardware</h3>
                {isLoading && <Loader2 className="h-3 w-3 md:h-4 md:w-4 text-primary animate-spin" />}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-foreground text-xs md:text-sm h-7 md:h-9"
                onClick={() => onNavigate('hardware')}
              >
                Ver detalhes
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
              {systemModules.map((module) => (
                <div 
                  key={module.label}
                  className="p-2 md:p-4 bg-muted/30 rounded-lg md:rounded-xl border border-border/50"
                >
                  <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                    <module.icon className="h-3.5 w-3.5 md:h-5 md:w-5 text-muted-foreground" />
                    <span className="text-[10px] md:text-sm font-medium text-foreground">{module.label}</span>
                  </div>
                  <p className="text-[10px] md:text-sm text-muted-foreground truncate">{module.info}</p>
                  <div className="flex items-center gap-1.5 md:gap-2 mt-1 md:mt-2">
                    <span className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${
                      module.status === 'ok' ? 'bg-success' : 'bg-warning'
                    }`} />
                    <span className={`text-[9px] md:text-xs ${
                      module.status === 'ok' ? 'text-success' : 'text-warning'
                    }`}>
                      {module.status === 'ok' ? 'Normal' : 'Atenção'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="glass-card p-3 md:p-6">
            <h3 className="text-sm md:text-lg font-medium text-foreground mb-3 md:mb-6">Estatísticas</h3>
            <div className="space-y-3 md:space-y-6">
              <div>
                <div className="flex items-center justify-between mb-1 md:mb-2">
                  <span className="text-[10px] md:text-sm text-muted-foreground">Saúde do Sistema</span>
                  <span className="text-[10px] md:text-sm font-medium text-muted-foreground">--</span>
                </div>
                <div className="h-1.5 md:h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-0 bg-gradient-to-r from-success to-emerald-400 rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1 md:mb-2">
                  <span className="text-[10px] md:text-sm text-muted-foreground">Espaço Recuperado</span>
                  <span className="text-[10px] md:text-sm font-medium text-muted-foreground">0 GB</span>
                </div>
                <div className="h-1.5 md:h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-0 bg-gradient-to-r from-info to-primary rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1 md:mb-2">
                  <span className="text-[10px] md:text-sm text-muted-foreground">Arquivos Otimizados</span>
                  <span className="text-[10px] md:text-sm font-medium text-muted-foreground">0</span>
                </div>
                <div className="h-1.5 md:h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-0 bg-gradient-to-r from-secondary to-purple-400 rounded-full" />
                </div>
              </div>
              
              <div className="pt-2 md:pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="text-[9px] md:text-xs">Última varredura: Aguardando</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-4 gap-2 md:gap-4">
          <button onClick={() => onNavigate('limpeza')} className="feature-card text-center p-2 md:p-6">
            <Trash2 className="h-5 w-5 md:h-8 md:w-8 text-secondary mx-auto mb-1 md:mb-3" />
            <span className="text-[10px] md:text-sm font-medium text-foreground">Limpeza</span>
            <p className="text-[8px] md:text-xs text-muted-foreground mt-0.5 md:mt-1 hidden md:block">Arquivos temporários</p>
          </button>
          <button onClick={() => onNavigate('protecao')} className="feature-card text-center p-2 md:p-6">
            <Shield className="h-5 w-5 md:h-8 md:w-8 text-success mx-auto mb-1 md:mb-3" />
            <span className="text-[10px] md:text-sm font-medium text-foreground">Backup</span>
            <p className="text-[8px] md:text-xs text-muted-foreground mt-0.5 md:mt-1 hidden md:block">Proteção de dados</p>
          </button>
          <button onClick={() => onNavigate('protecao')} className="feature-card text-center p-2 md:p-6">
            <RefreshCw className="h-5 w-5 md:h-8 md:w-8 text-info mx-auto mb-1 md:mb-3" />
            <span className="text-[10px] md:text-sm font-medium text-foreground">Restaurar</span>
            <p className="text-[8px] md:text-xs text-muted-foreground mt-0.5 md:mt-1 hidden md:block">Recuperar sistema</p>
          </button>
          <button onClick={() => onNavigate('hardware')} className="feature-card text-center p-2 md:p-6">
            <Cpu className="h-5 w-5 md:h-8 md:w-8 text-accent mx-auto mb-1 md:mb-3" />
            <span className="text-[10px] md:text-sm font-medium text-foreground">Drivers</span>
            <p className="text-[8px] md:text-xs text-muted-foreground mt-0.5 md:mt-1 hidden md:block">Atualizar drivers</p>
          </button>
        </div>
      </div>
    </div>
  );
}
