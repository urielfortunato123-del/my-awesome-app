import { useState } from "react";
import { 
  Download, 
  RefreshCw, 
  Sparkles, 
  CheckCircle2, 
  Rocket,
  Bug,
  Zap,
  Shield,
  Loader2,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const APP_VERSION = "1.2.0";
const NEW_VERSION = "1.3.0";

interface ChangelogItem {
  type: "feature" | "fix" | "improvement" | "security";
  description: string;
}

const changelog: ChangelogItem[] = [
  { type: "feature", description: "Verificação automática de atualizações de drivers" },
  { type: "feature", description: "Download e instalação de drivers com progresso" },
  { type: "improvement", description: "Detecção aprimorada de hardware no Windows" },
  { type: "improvement", description: "Interface mais responsiva e moderna" },
  { type: "fix", description: "Correção na detecção de memória RAM" },
  { type: "fix", description: "Correção de bugs na página de limpeza" },
  { type: "security", description: "Melhorias de segurança e estabilidade" },
];

const getIcon = (type: ChangelogItem["type"]) => {
  switch (type) {
    case "feature":
      return <Sparkles className="h-4 w-4 text-primary" />;
    case "fix":
      return <Bug className="h-4 w-4 text-warning" />;
    case "improvement":
      return <Zap className="h-4 w-4 text-info" />;
    case "security":
      return <Shield className="h-4 w-4 text-success" />;
  }
};

const getLabel = (type: ChangelogItem["type"]) => {
  switch (type) {
    case "feature":
      return "Novo";
    case "fix":
      return "Correção";
    case "improvement":
      return "Melhoria";
    case "security":
      return "Segurança";
  }
};

const getLabelColor = (type: ChangelogItem["type"]) => {
  switch (type) {
    case "feature":
      return "bg-primary/20 text-primary";
    case "fix":
      return "bg-warning/20 text-warning";
    case "improvement":
      return "bg-info/20 text-info";
    case "security":
      return "bg-success/20 text-success";
  }
};

export function UpdateChecker() {
  const [isChecking, setIsChecking] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateComplete, setUpdateComplete] = useState(false);

  const handleCheckUpdate = async () => {
    setIsChecking(true);
    toast.info("Verificando atualizações...");
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simula encontrar uma atualização
    const hasUpdate = Math.random() > 0.3; // 70% chance de ter atualização
    
    if (hasUpdate) {
      setUpdateAvailable(true);
      setShowDialog(true);
      toast.success("Nova versão disponível!", {
        description: `Versão ${NEW_VERSION} está pronta para instalar`
      });
    } else {
      toast.success("Você está usando a versão mais recente!", {
        description: `Versão atual: ${APP_VERSION}`
      });
    }
    
    setIsChecking(false);
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    
    toast.info("Baixando atualização...");
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.info("Instalando atualização...");
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsUpdating(false);
    setUpdateComplete(true);
    setUpdateAvailable(false);
    
    toast.success("Atualização concluída!", {
      description: "O aplicativo será recarregado"
    });
    
    // Recarrega após 2 segundos
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="gap-1 md:gap-2 text-muted-foreground hover:text-foreground h-7 md:h-9 px-2 md:px-3 text-[10px] md:text-sm"
        onClick={handleCheckUpdate}
        disabled={isChecking}
      >
        {isChecking ? (
          <Loader2 className="h-3 w-3 md:h-4 md:w-4 animate-spin" />
        ) : updateAvailable ? (
          <Download className="h-3 w-3 md:h-4 md:w-4 text-info" />
        ) : (
          <RefreshCw className="h-3 w-3 md:h-4 md:w-4" />
        )}
        <span className="hidden md:inline">
          {isChecking ? "Verificando..." : updateAvailable ? "Atualizar" : "Verificar Atualizações"}
        </span>
        <span className="md:hidden">
          {isChecking ? "..." : "Atualizar"}
        </span>
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-[calc(100%-2rem)] md:max-w-md w-full rounded-2xl p-4 md:p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-sm md:text-base">
              <Rocket className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              Nova Versão Disponível!
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3 md:space-y-4">
            {/* Version info */}
            <div className="flex items-center justify-between p-2 md:p-3 rounded-lg bg-muted/50">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Versão atual</p>
                <p className="font-semibold text-foreground text-sm md:text-base">{APP_VERSION}</p>
              </div>
              <div className="text-lg md:text-2xl text-muted-foreground">→</div>
              <div className="text-right">
                <p className="text-xs md:text-sm text-muted-foreground">Nova versão</p>
                <p className="font-semibold text-primary text-sm md:text-base">{NEW_VERSION}</p>
              </div>
            </div>

            {/* Changelog */}
            <div>
              <h4 className="text-xs md:text-sm font-medium text-foreground mb-2 md:mb-3">Novidades e Melhorias:</h4>
              <div className="space-y-1.5 md:space-y-2 max-h-40 md:max-h-60 overflow-y-auto pr-1 md:pr-2">
                {changelog.map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-2 md:gap-3 p-1.5 md:p-2 rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <div className="mt-0.5 shrink-0">{getIcon(item.type)}</div>
                    <p className="text-xs md:text-sm text-foreground flex-1">{item.description}</p>
                    <span className={`text-[9px] md:text-xs px-1.5 md:px-2 py-0.5 rounded-full shrink-0 ${getLabelColor(item.type)}`}>
                      {getLabel(item.type)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 md:gap-3 pt-1 md:pt-2">
              <Button 
                variant="outline" 
                size="sm"
                className="flex-1 h-8 md:h-10 text-xs md:text-sm"
                onClick={() => setShowDialog(false)}
                disabled={isUpdating}
              >
                Depois
              </Button>
              <Button 
                size="sm"
                className="flex-1 gap-1.5 md:gap-2 h-8 md:h-10 text-xs md:text-sm bg-gradient-to-r from-primary to-info hover:opacity-90"
                onClick={handleUpdate}
                disabled={isUpdating || updateComplete}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="h-3 w-3 md:h-4 md:w-4 animate-spin" />
                    Atualizando...
                  </>
                ) : updateComplete ? (
                  <>
                    <CheckCircle2 className="h-3 w-3 md:h-4 md:w-4" />
                    Concluído!
                  </>
                ) : (
                  <>
                    <Download className="h-3 w-3 md:h-4 md:w-4" />
                    Atualizar Agora
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}