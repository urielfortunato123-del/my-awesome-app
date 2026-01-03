import { useState } from "react";
import { 
  Shield, 
  Lock,
  Eye,
  Bell,
  MapPin,
  Clipboard,
  Globe,
  HardDrive,
  Wifi,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Loader2,
  Play,
  RefreshCw,
  Zap,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useSecurityCheck, SecurityCheck } from "@/hooks/useSecurityCheck";
import { useBenchmark } from "@/hooks/useBenchmark";
import { useActivityLog } from "@/contexts/ActivityLogContext";
import { toast } from "sonner";

const getCheckIcon = (id: string) => {
  const icons: Record<string, React.ElementType> = {
    https: Lock,
    cookies: Eye,
    dnt: Eye,
    sw: Shield,
    secure_context: Lock,
    notifications: Bell,
    geolocation: MapPin,
    clipboard: Clipboard,
    webrtc: Wifi,
    storage: HardDrive,
  };
  return icons[id] || Shield;
};

const getStatusIcon = (status: SecurityCheck["status"]) => {
  switch (status) {
    case "secure":
      return <CheckCircle className="h-5 w-5 text-success" />;
    case "warning":
      return <AlertTriangle className="h-5 w-5 text-warning" />;
    case "danger":
      return <XCircle className="h-5 w-5 text-destructive" />;
    case "checking":
      return <Loader2 className="h-5 w-5 text-info animate-spin" />;
  }
};

const getScoreColor = (level: string) => {
  switch (level) {
    case "excellent":
      return "text-success";
    case "good":
      return "text-info";
    case "moderate":
      return "text-warning";
    case "poor":
      return "text-destructive";
    default:
      return "text-muted-foreground";
  }
};

export function ProtectionPage() {
  const { checks, isScanning, hasScanned, score, runSecurityScan } = useSecurityCheck();
  const { results: benchResults, summary: benchSummary, isRunning: isBenchmarking, progress: benchProgress, currentTest, runBenchmark } = useBenchmark();
  const { addLog } = useActivityLog();
  const [activeTab, setActiveTab] = useState<"security" | "benchmark">("security");

  const handleSecurityScan = async () => {
    toast.info("Iniciando verificação de segurança...");
    const results = await runSecurityScan();
    
    addLog({
      task: "Verificação de Segurança",
      type: "protection",
      category: "Segurança",
      status: "success",
      details: `${results.filter(r => r.status === "secure").length}/${results.length} verificações OK`,
    });
    
    toast.success("Verificação concluída!", {
      description: `Pontuação: ${score.percentage}%`
    });
  };

  const handleBenchmark = async () => {
    toast.info("Iniciando benchmark de performance...");
    const result = await runBenchmark();
    
    addLog({
      task: "Benchmark de Performance",
      type: "benchmark",
      category: "Performance",
      status: "success",
      details: `Pontuação: ${result.summary.percentage}% - ${result.summary.rating}`,
    });
    
    toast.success("Benchmark concluído!", {
      description: `Classificação: ${result.summary.rating}`
    });
  };

  return (
    <div className="min-h-[calc(100vh-80px)] p-3 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground">Proteção & Performance</h2>
            <p className="text-sm text-muted-foreground">Verifique a segurança e performance do seu dispositivo</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <Button
            variant={activeTab === "security" ? "default" : "outline"}
            onClick={() => setActiveTab("security")}
            className="gap-2"
          >
            <Shield className="h-4 w-4" />
            Segurança
          </Button>
          <Button
            variant={activeTab === "benchmark" ? "default" : "outline"}
            onClick={() => setActiveTab("benchmark")}
            className="gap-2"
          >
            <Activity className="h-4 w-4" />
            Benchmark
          </Button>
        </div>

        {activeTab === "security" && (
          <>
            {/* Score Card */}
            {hasScanned && (
              <div className="glass-card p-4 md:p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center ${
                      score.level === "excellent" ? "bg-success/20" :
                      score.level === "good" ? "bg-info/20" :
                      score.level === "moderate" ? "bg-warning/20" : "bg-destructive/20"
                    }`}>
                      <span className={`text-2xl md:text-3xl font-bold ${getScoreColor(score.level)}`}>
                        {score.percentage}%
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-semibold text-foreground">
                        {score.level === "excellent" ? "Excelente!" :
                         score.level === "good" ? "Bom" :
                         score.level === "moderate" ? "Moderado" : "Precisa Atenção"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {checks.filter(c => c.status === "secure").length} de {checks.length} verificações seguras
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="gap-2"
                    onClick={handleSecurityScan}
                    disabled={isScanning}
                  >
                    <RefreshCw className={`h-4 w-4 ${isScanning ? "animate-spin" : ""}`} />
                    Verificar Novamente
                  </Button>
                </div>
              </div>
            )}

            {/* Scan Button */}
            {!hasScanned && !isScanning && (
              <div className="glass-card p-6 md:p-8 text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 md:h-10 md:w-10 text-primary" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                  Verificação de Segurança
                </h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                  Analise as configurações de segurança do seu navegador e identifique possíveis vulnerabilidades.
                </p>
                <Button 
                  className="gap-2 bg-gradient-to-r from-primary to-info hover:opacity-90"
                  onClick={handleSecurityScan}
                >
                  <Play className="h-4 w-4" />
                  Iniciar Verificação
                </Button>
              </div>
            )}

            {/* Scanning Progress */}
            {isScanning && (
              <div className="glass-card p-4 md:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  <span className="font-medium text-foreground">Verificando segurança...</span>
                </div>
                <Progress value={(checks.length / 10) * 100} className="h-2" />
              </div>
            )}

            {/* Security Checks List */}
            {checks.length > 0 && (
              <div className="glass-card">
                <div className="p-3 md:p-4 border-b border-border">
                  <h3 className="font-medium text-foreground">Verificações de Segurança</h3>
                </div>
                <div className="divide-y divide-border">
                  {checks.map((check) => {
                    const IconComponent = getCheckIcon(check.id);
                    return (
                      <div 
                        key={check.id}
                        className="p-3 md:p-4 flex items-center justify-between hover:bg-muted/20 transition-colors"
                      >
                        <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                          <div className={`w-9 h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center shrink-0 ${
                            check.status === "secure" ? "bg-success/20" :
                            check.status === "warning" ? "bg-warning/20" : "bg-destructive/20"
                          }`}>
                            <IconComponent className={`h-4 w-4 md:h-5 md:w-5 ${
                              check.status === "secure" ? "text-success" :
                              check.status === "warning" ? "text-warning" : "text-destructive"
                            }`} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-foreground text-sm md:text-base truncate">{check.name}</p>
                            <p className="text-xs md:text-sm text-muted-foreground truncate">{check.details}</p>
                          </div>
                        </div>
                        <div className="shrink-0 ml-2">
                          {getStatusIcon(check.status)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "benchmark" && (
          <>
            {/* Benchmark Summary */}
            {benchSummary && (
              <div className="glass-card p-4 md:p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center ${
                      benchSummary.percentage >= 70 ? "bg-success/20" :
                      benchSummary.percentage >= 50 ? "bg-info/20" :
                      benchSummary.percentage >= 30 ? "bg-warning/20" : "bg-destructive/20"
                    }`}>
                      <span className={`text-2xl md:text-3xl font-bold ${
                        benchSummary.percentage >= 70 ? "text-success" :
                        benchSummary.percentage >= 50 ? "text-info" :
                        benchSummary.percentage >= 30 ? "text-warning" : "text-destructive"
                      }`}>
                        {benchSummary.percentage}%
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-semibold text-foreground">
                        {benchSummary.rating}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Pontuação: {benchSummary.totalScore}/{benchSummary.maxScore}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="gap-2"
                    onClick={handleBenchmark}
                    disabled={isBenchmarking}
                  >
                    <RefreshCw className={`h-4 w-4 ${isBenchmarking ? "animate-spin" : ""}`} />
                    Testar Novamente
                  </Button>
                </div>
              </div>
            )}

            {/* Start Benchmark */}
            {!benchSummary && !isBenchmarking && (
              <div className="glass-card p-6 md:p-8 text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-info/20 flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 md:h-10 md:w-10 text-info" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                  Benchmark de Performance
                </h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                  Teste a capacidade de processamento do seu dispositivo com benchmarks de CPU, memória, gráficos e mais.
                </p>
                <Button 
                  className="gap-2 bg-gradient-to-r from-info to-primary hover:opacity-90"
                  onClick={handleBenchmark}
                >
                  <Play className="h-4 w-4" />
                  Iniciar Benchmark
                </Button>
              </div>
            )}

            {/* Running Benchmark */}
            {isBenchmarking && (
              <div className="glass-card p-4 md:p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Loader2 className="h-5 w-5 text-info animate-spin" />
                  <span className="font-medium text-foreground">{currentTest || "Preparando..."}</span>
                </div>
                <Progress value={benchProgress} className="h-2 mb-2" />
                <p className="text-sm text-muted-foreground text-right">{benchProgress}%</p>
              </div>
            )}

            {/* Benchmark Results */}
            {benchResults.length > 0 && (
              <div className="glass-card">
                <div className="p-3 md:p-4 border-b border-border">
                  <h3 className="font-medium text-foreground">Resultados do Benchmark</h3>
                </div>
                <div className="divide-y divide-border">
                  {benchResults.map((result) => (
                    <div 
                      key={result.id}
                      className="p-3 md:p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-foreground text-sm md:text-base">{result.name}</span>
                        <span className={`font-bold ${
                          result.status === "excellent" ? "text-success" :
                          result.status === "good" ? "text-info" :
                          result.status === "moderate" ? "text-warning" : "text-destructive"
                        }`}>
                          {result.score}/{result.maxScore}
                        </span>
                      </div>
                      <Progress 
                        value={result.score} 
                        className={`h-2 mb-1 ${
                          result.status === "excellent" ? "[&>div]:bg-success" :
                          result.status === "good" ? "[&>div]:bg-info" :
                          result.status === "moderate" ? "[&>div]:bg-warning" : "[&>div]:bg-destructive"
                        }`}
                      />
                      <p className="text-xs text-muted-foreground">{result.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
