import { 
  RefreshCw, 
  Trash2, 
  Zap, 
  Shield, 
  Calendar, 
  ChevronDown, 
  Wifi,
  CheckCircle,
  XCircle,
  Clock,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ActivityLog {
  id: string;
  task: string;
  type: string;
  status: "success" | "failed";
  time: string;
  duration: string;
  icon: React.ElementType;
}

const activityLogs: ActivityLog[] = [
  { id: "1", task: "Varredura completa", type: "Manual", status: "success", time: "--:--", duration: "--", icon: Shield },
];

export function HistoryPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Histórico de Atividades</h2>
            <p className="text-muted-foreground">Acompanhe todas as ações realizadas no sistema</p>
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <RefreshCw className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">0</p>
                <p className="text-sm text-muted-foreground">Atualizações instaladas</p>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                <Trash2 className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">0 GB</p>
                <p className="text-sm text-muted-foreground">Espaço recuperado</p>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-info/20 flex items-center justify-center">
                <Zap className="h-6 w-6 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">0</p>
                <p className="text-sm text-muted-foreground">Arquivos otimizados</p>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
                <Shield className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">0</p>
                <p className="text-sm text-muted-foreground">Varreduras realizadas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <Select defaultValue="90">
            <SelectTrigger className="w-48 bg-card border-border">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Últimos 7 dias</SelectItem>
              <SelectItem value="30">Últimos 30 dias</SelectItem>
              <SelectItem value="90">Últimos 90 dias</SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue="all">
            <SelectTrigger className="w-48 bg-card border-border">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              <SelectItem value="scan">Varreduras</SelectItem>
              <SelectItem value="cleanup">Limpeza</SelectItem>
              <SelectItem value="update">Atualizações</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Activity Table */}
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-border flex items-center gap-3">
            <Calendar className="h-5 w-5 text-primary" />
            <span className="font-medium text-foreground">Atividades Recentes</span>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-[1fr,120px,120px,150px,150px,100px] gap-4 px-6 py-3 border-b border-border text-sm font-medium text-muted-foreground bg-muted/20">
            <span>Tarefa</span>
            <span>Tipo</span>
            <span>Status</span>
            <span>Hora</span>
            <span>Duração</span>
            <span></span>
          </div>

          {/* Empty State or Logs */}
          {activityLogs.length === 1 && activityLogs[0].time === "--:--" ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">Nenhuma atividade ainda</h3>
              <p className="text-muted-foreground">
                Execute uma varredura ou limpeza para ver o histórico aqui.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {activityLogs.map((log) => (
                <div
                  key={log.id}
                  className="grid grid-cols-[1fr,120px,120px,150px,150px,100px] gap-4 px-6 py-4 items-center hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                      <log.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span className="font-medium text-foreground">{log.task}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{log.type}</span>
                  <div className="flex items-center gap-2">
                    {log.status === "success" ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span className="text-sm text-success">Sucesso</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-destructive" />
                        <span className="text-sm text-destructive">Falha</span>
                      </>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">{log.time}</span>
                  <span className="text-sm text-muted-foreground">{log.duration}</span>
                  <Button variant="ghost" size="sm" className="text-primary gap-1">
                    Detalhes
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
