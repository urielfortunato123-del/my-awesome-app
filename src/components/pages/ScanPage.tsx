import { useState, useEffect } from "react";
import { 
  RefreshCw, 
  HardDrive, 
  Zap, 
  Shield, 
  Trash2,
  CheckCircle, 
  X,
  Play,
  Clock,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useBackup } from "@/contexts/BackupContext";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: string;
  name: string;
  description: string;
  status: "pending" | "running" | "success" | "warning";
  progress: number;
  icon: React.ElementType;
}

const initialTasks: Task[] = [
  { id: "1", name: "Verificar atualizações", description: "Buscando novas versões", status: "pending", progress: 0, icon: RefreshCw },
  { id: "2", name: "Analisar hardware", description: "Detectando componentes", status: "pending", progress: 0, icon: HardDrive },
  { id: "3", name: "Otimizar desempenho", description: "Melhorando performance", status: "pending", progress: 0, icon: Zap },
  { id: "4", name: "Verificar segurança", description: "Analisando proteções", status: "pending", progress: 0, icon: Shield },
  { id: "5", name: "Limpar arquivos", description: "Removendo temporários", status: "pending", progress: 0, icon: Trash2 },
];

interface ScanPageProps {
  onClose: () => void;
}

export function ScanPage({ onClose }: ScanPageProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [isRunning, setIsRunning] = useState(false);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [currentTask, setCurrentTask] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const { createBackup } = useBackup();
  const { toast } = useToast();

  const startScan = async () => {
    // First, create a backup before any operation
    setIsCreatingBackup(true);
    toast({
      title: "Criando ponto de restauração",
      description: "Salvando estado atual do sistema antes da varredura...",
    });
    
    await createBackup("Backup automático antes da varredura");
    
    toast({
      title: "Backup criado!",
      description: "Ponto de restauração salvo com sucesso.",
    });
    
    setIsCreatingBackup(false);
    setIsRunning(true);
    setTasks(initialTasks);
    setCurrentTask(0);
    setOverallProgress(0);
  };

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTasks(prev => {
        const newTasks = [...prev];
        
        if (currentTask < newTasks.length) {
          const task = newTasks[currentTask];
          
          if (task.status === "pending") {
            task.status = "running";
            task.progress = 0;
          } else if (task.status === "running") {
            task.progress += Math.random() * 15 + 5;
            
            if (task.progress >= 100) {
              task.progress = 100;
              task.status = "success";
              setCurrentTask(c => c + 1);
            }
          }
        }
        
        const totalProgress = newTasks.reduce((acc, t) => acc + t.progress, 0) / newTasks.length;
        setOverallProgress(totalProgress);
        
        if (newTasks.every(t => t.status === "success")) {
          setIsRunning(false);
        }
        
        return newTasks;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isRunning, currentTask]);

  const completedTasks = tasks.filter(t => t.status === "success").length;

  return (
    <div className="min-h-[calc(100vh-80px)] p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Varredura do Sistema</h2>
            <p className="text-muted-foreground">Análise completa de performance e segurança</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="gap-2">
            <X className="h-4 w-4" />
            Fechar
          </Button>
        </div>

        {/* Progress Overview */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                overallProgress >= 100 
                  ? 'bg-success/20' 
                  : isRunning 
                    ? 'bg-primary/20' 
                    : isCreatingBackup
                      ? 'bg-warning/20'
                      : 'bg-muted'
              }`}>
                {overallProgress >= 100 ? (
                  <CheckCircle className="h-8 w-8 text-success" />
                ) : isRunning ? (
                  <RefreshCw className="h-8 w-8 text-primary animate-spin" />
                ) : isCreatingBackup ? (
                  <Shield className="h-8 w-8 text-warning animate-pulse" />
                ) : (
                  <Play className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  {overallProgress >= 100 
                    ? 'Varredura Concluída!' 
                    : isRunning 
                      ? 'Analisando Sistema...' 
                      : isCreatingBackup
                        ? 'Criando Backup...'
                        : 'Pronto para Iniciar'}
                </h3>
                <p className="text-muted-foreground">
                  {isCreatingBackup 
                    ? 'Salvando ponto de restauração...'
                    : `${completedTasks} de ${tasks.length} tarefas concluídas`
                  }
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-foreground">{Math.round(overallProgress)}%</p>
              <p className="text-sm text-muted-foreground">Progresso</p>
            </div>
          </div>
          <Progress value={overallProgress} className="h-3" />
          
          {!isRunning && !isCreatingBackup && overallProgress < 100 && (
            <>
              <div className="mt-4 p-4 bg-success/10 border border-success/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-success" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Backup Automático</p>
                    <p className="text-xs text-muted-foreground">
                      Um ponto de restauração será criado antes de iniciar a varredura.
                    </p>
                  </div>
                </div>
              </div>
              <Button 
                onClick={startScan}
                className="mt-4 w-full gap-2 bg-gradient-to-r from-primary to-info hover:opacity-90 text-primary-foreground"
              >
                <Play className="h-5 w-5" />
                Iniciar Varredura Completa
              </Button>
            </>
          )}
        </div>

        {/* Tasks List */}
        <div className="glass-card">
          <div className="p-4 border-b border-border">
            <h3 className="font-medium text-foreground">Tarefas de Análise</h3>
          </div>
          <div className="divide-y divide-border">
            {tasks.map((task) => (
              <div key={task.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      task.status === 'success' ? 'bg-success/20' :
                      task.status === 'running' ? 'bg-primary/20' : 'bg-muted/50'
                    }`}>
                      {task.status === 'success' ? (
                        <CheckCircle className="h-5 w-5 text-success" />
                      ) : task.status === 'running' ? (
                        <task.icon className="h-5 w-5 text-primary animate-pulse" />
                      ) : (
                        <task.icon className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className={`font-medium ${
                        task.status === 'pending' ? 'text-muted-foreground' : 'text-foreground'
                      }`}>
                        {task.name}
                      </p>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-medium ${
                      task.status === 'success' ? 'text-success' :
                      task.status === 'running' ? 'text-primary' : 'text-muted-foreground'
                    }`}>
                      {task.status === 'success' ? 'Concluído' :
                       task.status === 'running' ? `${Math.round(task.progress)}%` : 'Aguardando'}
                    </span>
                  </div>
                </div>
                {(task.status === 'running' || task.status === 'success') && (
                  <Progress value={task.progress} className="h-1.5 mt-2" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Results Summary */}
        {overallProgress >= 100 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <p className="text-2xl font-bold text-foreground">0</p>
              <p className="text-sm text-muted-foreground">Problemas encontrados</p>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-info/20 flex items-center justify-center mx-auto mb-3">
                <Trash2 className="h-6 w-6 text-info" />
              </div>
              <p className="text-2xl font-bold text-foreground">0 MB</p>
              <p className="text-sm text-muted-foreground">Espaço liberado</p>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-3">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">--</p>
              <p className="text-sm text-muted-foreground">Tempo total</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
