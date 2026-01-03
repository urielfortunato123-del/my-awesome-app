import { useState } from "react";
import { 
  RefreshCw, 
  Trash2, 
  Zap, 
  Shield, 
  Calendar, 
  Wifi,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  FileText,
  Download,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useActivityLog, ActivityLog } from "@/contexts/ActivityLogContext";
import { toast } from "sonner";

const getIconForType = (type: ActivityLog["type"]) => {
  switch (type) {
    case "scan":
      return Shield;
    case "cleanup":
      return Trash2;
    case "update":
      return RefreshCw;
    case "protection":
      return Shield;
    case "benchmark":
      return Zap;
    case "export":
      return FileText;
    default:
      return Activity;
  }
};

const formatDuration = (seconds?: number) => {
  if (!seconds) return "-";
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
};

const formatBytes = (bytes?: number) => {
  if (!bytes) return "-";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};

export function HistoryPage() {
  const { logs, stats, clearLogs, getLogsByPeriod, getLogsByType } = useActivityLog();
  const [periodFilter, setPeriodFilter] = useState("90");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredLogs = logs.filter(log => {
    const periodDays = parseInt(periodFilter);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - periodDays);
    
    const inPeriod = log.timestamp >= cutoff;
    const matchesType = typeFilter === "all" || log.type === typeFilter;
    
    return inPeriod && matchesType;
  });

  const handleExportLogs = () => {
    if (logs.length === 0) {
      toast.warning("Nenhum log para exportar");
      return;
    }

    const logText = logs.map(log => 
      `[${log.timestamp.toLocaleString('pt-BR')}] ${log.task} - ${log.category} - ${log.status.toUpperCase()}${log.details ? ` - ${log.details}` : ''}`
    ).join('\n');

    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `essencial_historico_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success("Histórico exportado!");
  };

  const handleClearLogs = () => {
    clearLogs();
    toast.success("Histórico limpo!");
  };

  return (
    <div className="min-h-[calc(100vh-80px)] p-3 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground">Histórico de Atividades</h2>
            <p className="text-sm text-muted-foreground">Acompanhe todas as ações realizadas no sistema</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={handleExportLogs}>
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Exportar</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive" onClick={handleClearLogs}>
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Limpar</span>
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="glass-card p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <RefreshCw className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              </div>
              <div>
                <p className="text-xl md:text-2xl font-bold text-foreground">{stats.totalUpdates}</p>
                <p className="text-xs md:text-sm text-muted-foreground">Atualizações</p>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                <Trash2 className="h-5 w-5 md:h-6 md:w-6 text-secondary" />
              </div>
              <div>
                <p className="text-xl md:text-2xl font-bold text-foreground">{formatBytes(stats.totalSpaceRecovered)}</p>
                <p className="text-xs md:text-sm text-muted-foreground">Recuperado</p>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-info/20 flex items-center justify-center">
                <Zap className="h-5 w-5 md:h-6 md:w-6 text-info" />
              </div>
              <div>
                <p className="text-xl md:text-2xl font-bold text-foreground">{stats.totalFilesOptimized}</p>
                <p className="text-xs md:text-sm text-muted-foreground">Otimizados</p>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-success/20 flex items-center justify-center">
                <Shield className="h-5 w-5 md:h-6 md:w-6 text-success" />
              </div>
              <div>
                <p className="text-xl md:text-2xl font-bold text-foreground">{stats.totalScans}</p>
                <p className="text-xs md:text-sm text-muted-foreground">Varreduras</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <Select value={periodFilter} onValueChange={setPeriodFilter}>
            <SelectTrigger className="w-40 bg-card border-border">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Últimos 7 dias</SelectItem>
              <SelectItem value="30">Últimos 30 dias</SelectItem>
              <SelectItem value="90">Últimos 90 dias</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40 bg-card border-border">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="scan">Varreduras</SelectItem>
              <SelectItem value="cleanup">Limpeza</SelectItem>
              <SelectItem value="update">Atualizações</SelectItem>
              <SelectItem value="protection">Segurança</SelectItem>
              <SelectItem value="benchmark">Benchmark</SelectItem>
            </SelectContent>
          </Select>

          <span className="text-sm text-muted-foreground">
            {filteredLogs.length} {filteredLogs.length === 1 ? "atividade" : "atividades"}
          </span>
        </div>

        {/* Activity List */}
        <div className="glass-card overflow-hidden">
          <div className="p-3 md:p-4 border-b border-border flex items-center gap-3">
            <Calendar className="h-5 w-5 text-primary" />
            <span className="font-medium text-foreground">Atividades Recentes</span>
          </div>

          {filteredLogs.length === 0 ? (
            <div className="p-8 md:p-12 text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-7 w-7 md:h-8 md:w-8 text-muted-foreground" />
              </div>
              <h3 className="text-base md:text-lg font-medium text-foreground mb-2">Nenhuma atividade ainda</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Execute uma varredura, limpeza ou verificação de segurança para ver o histórico aqui.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredLogs.map((log) => {
                const IconComponent = getIconForType(log.type);
                return (
                  <div
                    key={log.id}
                    className="p-3 md:p-4 flex items-center gap-3 md:gap-4 hover:bg-muted/20 transition-colors"
                  >
                    <div className={`w-9 h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      log.status === "success" ? "bg-success/20" :
                      log.status === "failed" ? "bg-destructive/20" : "bg-muted/50"
                    }`}>
                      <IconComponent className={`h-4 w-4 md:h-5 md:w-5 ${
                        log.status === "success" ? "text-success" :
                        log.status === "failed" ? "text-destructive" : "text-muted-foreground"
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-foreground text-sm md:text-base">{log.task}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          log.status === "success" ? "bg-success/20 text-success" :
                          log.status === "failed" ? "bg-destructive/20 text-destructive" : "bg-muted text-muted-foreground"
                        }`}>
                          {log.status === "success" ? "Sucesso" : log.status === "failed" ? "Falha" : "Pendente"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <span>{log.timestamp.toLocaleString('pt-BR')}</span>
                        {log.details && (
                          <>
                            <span>•</span>
                            <span className="truncate">{log.details}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0">
                      {log.status === "success" ? (
                        <CheckCircle className="h-5 w-5 text-success" />
                      ) : log.status === "failed" ? (
                        <XCircle className="h-5 w-5 text-destructive" />
                      ) : (
                        <Clock className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
