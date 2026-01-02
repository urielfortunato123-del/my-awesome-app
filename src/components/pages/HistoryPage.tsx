import { RefreshCw, Trash2, Zap, Shield, Calendar, ChevronDown, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

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
  {
    id: "1",
    task: "Otimizar rede",
    type: "Manual",
    status: "success",
    time: "8:15:27 PM",
    duration: "8 segundos",
    icon: Wifi,
  },
  {
    id: "2",
    task: "Melhorar desempenho",
    type: "Manual",
    status: "success",
    time: "8:13:48 PM",
    duration: "4:14 minutos",
    icon: Zap,
  },
  {
    id: "3",
    task: "Atualizações de software",
    type: "Manual",
    status: "failed",
    time: "8:09:59 PM",
    duration: "40 segundos",
    icon: RefreshCw,
  },
];

export function HistoryPage() {
  return (
    <div className="container mx-auto px-6 py-8">
      {/* Summary Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-light text-foreground mb-2">
          Resumo de atividades do sistema
        </h2>
        <p className="text-muted-foreground mb-6">
          Sua atividade do sistema é exibida abaixo. Use o filtro para visualizar os resultados durante períodos mais longos.
        </p>

        {/* Filter */}
        <div className="mb-6">
          <label className="text-sm font-medium text-foreground mb-2 block">
            Filtrar por data
          </label>
          <Select defaultValue="90">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Últimos 7 dias</SelectItem>
              <SelectItem value="30">Últimos 30 dias</SelectItem>
              <SelectItem value="90">Últimos 90 dias</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-accent/50 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <RefreshCw className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">11</p>
                <p className="text-sm text-muted-foreground">Atualizações de software instaladas</p>
              </div>
            </div>
          </div>
          
          <div className="bg-accent/50 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Trash2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">5,57 GB</p>
                <p className="text-sm text-muted-foreground">Espaço na unidade recuperado</p>
              </div>
            </div>
          </div>
          
          <div className="bg-accent/50 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">1473</p>
                <p className="text-sm text-muted-foreground">Arquivos otimizados</p>
              </div>
            </div>
          </div>
          
          <div className="bg-muted/50 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="bg-muted p-3 rounded-full">
                <Shield className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-lg font-medium text-muted-foreground">Não disponível em seu plano</p>
                <a href="#" className="text-sm text-primary hover:underline">
                  Obter proteção contra vírus e malware
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Activity Logs Section */}
      <section>
        <h2 className="text-2xl font-light text-foreground mb-2">
          Logs de atividades recentes
        </h2>
        <p className="text-muted-foreground mb-6">
          Selecione seu intervalo de datas e filtre para visualizar resultados para sua atividade recente.
        </p>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Filtrar por data
            </label>
            <Select defaultValue="today">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hoje</SelectItem>
                <SelectItem value="yesterday">Ontem</SelectItem>
                <SelectItem value="week">Última semana</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Filtrar por categoria
            </label>
            <Select defaultValue="all">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Mostrar tudo</SelectItem>
                <SelectItem value="updates">Atualizações</SelectItem>
                <SelectItem value="optimization">Otimização</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Activity Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {/* Date Header */}
          <div className="flex items-center gap-3 px-6 py-4 bg-muted/30 border-b border-border">
            <Calendar className="h-5 w-5 text-primary" />
            <span className="font-medium text-foreground">2 de janeiro de 2026 - sexta-feira</span>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-[1fr,120px,120px,150px,150px,100px] gap-4 px-6 py-3 border-b border-border text-sm font-medium text-muted-foreground">
            <span></span>
            <span>Tipo</span>
            <span>Status</span>
            <span>Tempo</span>
            <span>Tempo decorrido</span>
            <span></span>
          </div>

          {/* Table Rows */}
          {activityLogs.map((log) => (
            <div
              key={log.id}
              className="grid grid-cols-[1fr,120px,120px,150px,150px,100px] gap-4 px-6 py-4 border-b border-border last:border-0 items-center hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <log.icon className="h-5 w-5 text-primary" />
                <span className="font-medium text-foreground">{log.task}</span>
              </div>
              <span className="text-sm text-muted-foreground">{log.type}</span>
              <Badge
                variant={log.status === "success" ? "default" : "destructive"}
                className={
                  log.status === "success"
                    ? "bg-success/10 text-success hover:bg-success/20"
                    : "bg-warning/10 text-warning hover:bg-warning/20"
                }
              >
                {log.status === "success" ? "Concluído" : "Falha"}
              </Badge>
              <span className="text-sm text-muted-foreground">{log.time}</span>
              <span className="text-sm text-muted-foreground">{log.duration}</span>
              <Button variant="ghost" size="sm" className="text-primary">
                Detalhes
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
