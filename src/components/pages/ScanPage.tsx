import { RefreshCw, HardDrive, Zap, Wifi, Shield, AlertTriangle, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Task {
  id: string;
  name: string;
  lastRun: string;
  duration: string;
  status: "success" | "warning" | "pending";
  icon: React.ElementType;
}

const tasks: Task[] = [
  {
    id: "1",
    name: "Verificar se há atualizações",
    lastRun: "02 de jan. de 2026",
    duration: "40 segundos",
    status: "warning",
    icon: RefreshCw,
  },
  {
    id: "2",
    name: "Fazer varredura de hardware",
    lastRun: "18 de dez. de 2025",
    duration: "Não selecionado",
    status: "pending",
    icon: HardDrive,
  },
  {
    id: "3",
    name: "Melhorar desempenho",
    lastRun: "02 de jan. de 2026",
    duration: "4:41 minutos",
    status: "success",
    icon: Zap,
  },
  {
    id: "4",
    name: "Otimizar rede",
    lastRun: "02 de jan. de 2026",
    duration: "8 segundos",
    status: "success",
    icon: Wifi,
  },
  {
    id: "5",
    name: "Remover vírus",
    lastRun: "N/A",
    duration: "Não selecionado",
    status: "pending",
    icon: Shield,
  },
];

interface ScanPageProps {
  onClose: () => void;
}

export function ScanPage({ onClose }: ScanPageProps) {
  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-medium text-foreground">
          Executar varreduras e otimizações
        </h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Fechar <X className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Problem Alert */}
      <div className="bg-card rounded-lg p-6 mb-8 border border-border">
        <h3 className="text-xl font-light text-foreground mb-2">
          Encontramos um problema
        </h3>
        <p className="text-muted-foreground">
          Não foi possível verificar se há atualizações. Você pode selecionar{" "}
          <span className="font-semibold text-foreground">O que aconteceu</span>{" "}
          nas tarefas listadas abaixo para saber mais.
        </p>

        <div className="flex gap-3 mt-4">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Reiniciar
          </Button>
          <Button variant="outline">
            Voltar ao Início
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tasks Table */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-medium text-foreground mb-4">
            Tarefas concluídas
          </h3>
          
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-[1fr,200px,150px] gap-4 px-6 py-3 border-b border-border text-sm font-medium text-muted-foreground">
              <span>Tarefa</span>
              <span>Tempo decorrido</span>
              <span></span>
            </div>

            {/* Table Rows */}
            {tasks.map((task) => (
              <div
                key={task.id}
                className="grid grid-cols-[1fr,200px,150px] gap-4 px-6 py-4 border-b border-border last:border-0 items-center hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {task.status === "warning" && (
                    <AlertTriangle className="h-5 w-5 text-warning" />
                  )}
                  {task.status === "success" && (
                    <CheckCircle className="h-5 w-5 text-success" />
                  )}
                  {task.status === "pending" && (
                    <div className="h-5 w-5" />
                  )}
                  <div className="bg-muted p-2 rounded-full">
                    <task.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className={`font-medium ${task.status === "pending" ? "text-muted-foreground" : "text-foreground"}`}>
                      {task.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Última execução: {task.lastRun}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">{task.duration}</span>
                {task.status === "warning" && (
                  <Button variant="ghost" size="sm" className="text-primary">
                    O que aconteceu
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Results Sidebar */}
        <div>
          <h3 className="text-lg font-medium text-foreground mb-4">
            Resultados
          </h3>
          
          <div className="space-y-4">
            <div className="bg-card rounded-xl p-4 border border-border">
              <div className="flex items-center gap-3">
                <div className="bg-warning/10 p-2 rounded-full">
                  <RefreshCw className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">3,30 GB</p>
                  <p className="text-sm text-muted-foreground">Espaço na unidade recuperado</p>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-xl p-4 border border-border">
              <div className="flex items-center gap-3">
                <div className="bg-warning/10 p-2 rounded-full">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">0</p>
                  <p className="text-sm text-muted-foreground">Atualizações de software falharam</p>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-xl p-4 border border-border">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">488</p>
                  <p className="text-sm text-muted-foreground">Arquivos otimizados</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
