import { 
  Shield, 
  Database, 
  RefreshCw, 
  Download,
  Upload,
  History,
  CheckCircle,
  Clock,
  HardDrive,
  FolderOpen,
  Play,
  ChevronRight,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";

const backupHistory = [
  { id: "1", date: "Aguardando primeiro backup", type: "-", size: "-", status: "pending" },
];

const restorePoints = [
  { id: "1", date: "Nenhum ponto de restauração", description: "Execute uma varredura para criar", status: "none" },
];

export function ProtectionPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Proteção & Recuperação</h2>
            <p className="text-muted-foreground">Backup, restauração e recuperação do sistema</p>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="feature-card">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
                <Upload className="h-6 w-6 text-success" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Criar Backup</h3>
                <p className="text-sm text-muted-foreground">Salve seus arquivos</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Faça backup de documentos, fotos e configurações importantes.
            </p>
            <Button className="w-full gap-2 bg-gradient-to-r from-success to-emerald-400 hover:opacity-90 text-success-foreground">
              <Play className="h-4 w-4" />
              Iniciar Backup
            </Button>
          </div>

          <div className="feature-card">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-info/20 flex items-center justify-center">
                <Download className="h-6 w-6 text-info" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Restaurar Arquivos</h3>
                <p className="text-sm text-muted-foreground">Recupere de backup</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Restaure arquivos e configurações de um backup anterior.
            </p>
            <Button variant="outline" className="w-full gap-2">
              <RefreshCw className="h-4 w-4" />
              Restaurar
            </Button>
          </div>

          <div className="feature-card">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center">
                <Shield className="h-6 w-6 text-warning" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Recuperar Sistema</h3>
                <p className="text-sm text-muted-foreground">Voltar ao normal</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Restaure o sistema para um ponto anterior em caso de problemas.
            </p>
            <Button variant="outline" className="w-full gap-2 border-warning text-warning hover:bg-warning/10">
              <History className="h-4 w-4" />
              Pontos de Restauração
            </Button>
          </div>
        </div>

        {/* Backup Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Backup History */}
          <div className="glass-card">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-medium text-foreground">Histórico de Backup</h3>
              <Button variant="ghost" size="sm" className="text-muted-foreground gap-2">
                <FolderOpen className="h-4 w-4" />
                Abrir Pasta
              </Button>
            </div>
            <div className="divide-y divide-border">
              {backupHistory.map((backup) => (
                <div 
                  key={backup.id}
                  className="p-4 flex items-center justify-between hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
                      <Database className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{backup.date}</p>
                      <p className="text-sm text-muted-foreground">{backup.type} • {backup.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {backup.status === 'pending' ? (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                        Aguardando
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-success/20 text-success">
                        Completo
                      </span>
                    )}
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Restore Points */}
          <div className="glass-card">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-medium text-foreground">Pontos de Restauração</h3>
              <Button variant="ghost" size="sm" className="text-muted-foreground gap-2">
                <Clock className="h-4 w-4" />
                Criar Ponto
              </Button>
            </div>
            <div className="divide-y divide-border">
              {restorePoints.map((point) => (
                <div 
                  key={point.id}
                  className="p-4 flex items-center justify-between hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
                      <History className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{point.date}</p>
                      <p className="text-sm text-muted-foreground">{point.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="glass-card p-6 flex items-center gap-4 border-warning/30">
          <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-6 w-6 text-warning" />
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-1">Recomendação</h4>
            <p className="text-sm text-muted-foreground">
              Mantenha backups regulares dos seus arquivos importantes. Recomendamos backup semanal para documentos e mensal para o sistema completo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
