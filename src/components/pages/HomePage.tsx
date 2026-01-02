import { RefreshCw, Trash2, Zap, Wifi, Shield, Search, Download, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/shared/StatCard";

interface HomePageProps {
  onNavigate: (tab: string) => void;
}

const quickActions = [
  { icon: Search, label: "Varredura do sistema" },
  { icon: RefreshCw, label: "Atualizar software" },
  { icon: Zap, label: "Melhorar desempenho" },
  { icon: Wifi, label: "Otimizar rede" },
];

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="flex flex-col min-h-[calc(100vh-130px)]">
      {/* Quick Actions */}
      <div className="bg-card border-b border-border py-6">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center gap-12">
            {quickActions.map((action) => (
              <button
                key={action.label}
                className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
              >
                <div className="p-3 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                  <action.icon className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section with Stats */}
      <div 
        className="flex-1 relative bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80')`,
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          {/* Tabs */}
          <div className="flex items-center gap-2 mb-8">
            <Button 
              variant="secondary" 
              size="sm"
              className="bg-foreground/20 text-white border-0 hover:bg-foreground/30"
            >
              <Settings className="h-4 w-4 mr-2" />
              Resumo
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-white/80 hover:text-white hover:bg-foreground/20"
            >
              <Download className="h-4 w-4 mr-2" />
              Ações
            </Button>
          </div>

          {/* Title */}
          <h2 className="text-4xl font-light text-white mb-12 max-w-2xl">
            Este é o resumo das atividades nos últimos 90 dias
          </h2>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl w-full">
            <div className="bg-card rounded-xl p-6 shadow-lg">
              <div className="flex flex-col items-center gap-2">
                <div className="bg-primary/10 p-3 rounded-full">
                  <RefreshCw className="h-6 w-6 text-primary" />
                </div>
                <p className="text-2xl font-bold text-foreground">11</p>
                <p className="text-sm text-muted-foreground text-center">Atualizações de software instaladas</p>
              </div>
            </div>
            
            <div className="bg-card rounded-xl p-6 shadow-lg">
              <div className="flex flex-col items-center gap-2">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Trash2 className="h-6 w-6 text-primary" />
                </div>
                <p className="text-2xl font-bold text-foreground">5,57 GB</p>
                <p className="text-sm text-muted-foreground text-center">Espaço na unidade recuperado</p>
              </div>
            </div>
            
            <div className="bg-card rounded-xl p-6 shadow-lg">
              <div className="flex flex-col items-center gap-2">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <p className="text-2xl font-bold text-foreground">1473</p>
                <p className="text-sm text-muted-foreground text-center">Arquivos otimizados</p>
              </div>
            </div>
            
            <div className="bg-card rounded-xl p-6 shadow-lg">
              <div className="flex flex-col items-center gap-2">
                <div className="bg-muted p-3 rounded-full">
                  <Shield className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-lg font-medium text-muted-foreground">Não disponível</p>
                <p className="text-sm text-muted-foreground text-center">em seu plano</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
