import { useState, useEffect } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useRegisterSW } from "virtual:pwa-register/react";

export const APP_VERSION = "1.2.0";
export const NEW_VERSION = "1.3.0";

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
  const [showDialog, setShowDialog] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateComplete, setUpdateComplete] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState<Date | null>(null);

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    immediate: true, // Registra imediatamente ao carregar
    onRegisteredSW(swUrl, registration) {
      console.log("SW registrado:", swUrl);
      
      if (registration) {
        // Verifica imediatamente ao registrar
        registration.update().catch(console.error);
        
        // Verifica atualizações a cada 5 minutos (mais frequente para PWA)
        const intervalId = setInterval(() => {
          console.log("Verificando atualizações automaticamente...");
          registration.update().catch(console.error);
        }, 5 * 60 * 1000);

        // Cleanup
        return () => clearInterval(intervalId);
      }
    },
    onRegisterError(error) {
      console.error("Erro ao registrar SW:", error);
    },
  });

  // Verifica atualizações ao abrir o app (focus/visibility)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Verifica se faz mais de 1 minuto desde a última verificação
        const now = new Date();
        if (!lastCheckTime || (now.getTime() - lastCheckTime.getTime()) > 60000) {
          console.log("App visível - verificando atualizações...");
          navigator.serviceWorker.getRegistrations().then(registrations => {
            registrations.forEach(registration => {
              registration.update().catch(console.error);
            });
          }).catch(console.error);
          setLastCheckTime(now);
        }
      }
    };

    const handleFocus = () => {
      const now = new Date();
      if (!lastCheckTime || (now.getTime() - lastCheckTime.getTime()) > 60000) {
        console.log("App em foco - verificando atualizações...");
        navigator.serviceWorker.getRegistrations().then(registrations => {
          registrations.forEach(registration => {
            registration.update().catch(console.error);
          });
        }).catch(console.error);
        setLastCheckTime(now);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    // Verifica ao montar o componente
    handleVisibilityChange();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [lastCheckTime]);

  // Gerencia o badge do ícone do app
  useEffect(() => {
    const setBadge = async () => {
      if ('setAppBadge' in navigator) {
        try {
          if (needRefresh) {
            // Mostra badge com número 1 indicando atualização
            await (navigator as any).setAppBadge(1);
            console.log("Badge de atualização exibido");
          } else {
            // Remove o badge quando não há atualização
            await (navigator as any).clearAppBadge();
            console.log("Badge removido");
          }
        } catch (error) {
          console.error("Erro ao gerenciar badge:", error);
        }
      }
    };

    setBadge();
  }, [needRefresh]);

  // Quando detectar atualização disponível, mostra o dialog
  useEffect(() => {
    if (needRefresh) {
      setShowDialog(true);
      toast.success("Nova versão disponível!", {
        description: `Versão ${NEW_VERSION} está pronta para instalar`
      });
    }
  }, [needRefresh]);

  const handleCheckUpdate = async () => {
    setIsChecking(true);
    toast.info("Verificando atualizações...");
    
    try {
      // Força verificação de atualização do Service Worker
      const registrations = await navigator.serviceWorker.getRegistrations();
      
      if (registrations.length === 0) {
        toast.warning("Nenhum Service Worker registrado", {
          description: "Tente recarregar a página"
        });
        setIsChecking(false);
        return;
      }

      for (const registration of registrations) {
        await registration.update();
        
        // Verifica se há um SW aguardando ativação
        if (registration.waiting) {
          setNeedRefresh(true);
          setShowDialog(true);
          toast.success("Nova versão encontrada!");
          setIsChecking(false);
          return;
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (!needRefresh) {
        toast.success("Você está usando a versão mais recente!", {
          description: `Versão atual: ${APP_VERSION}`
        });
      }
      
      setLastCheckTime(new Date());
    } catch (error) {
      console.error("Erro ao verificar atualizações:", error);
      toast.error("Erro ao verificar atualizações", {
        description: "Verifique sua conexão com a internet"
      });
    }
    
    setIsChecking(false);
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    
    toast.info("Instalando atualização...");
    
    try {
      // Envia mensagem para o SW aguardando para ativar imediatamente
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      }

      await updateServiceWorker(true);
      setUpdateComplete(true);
      setNeedRefresh(false);
      
      toast.success("Atualização concluída!", {
        description: "O aplicativo será recarregado"
      });
      
      // Recarrega após 1.5 segundos
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      toast.error("Erro ao instalar atualização", {
        description: "Tente recarregar manualmente"
      });
      setIsUpdating(false);
    }
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
        ) : needRefresh ? (
          <Download className="h-3 w-3 md:h-4 md:w-4 text-info" />
        ) : (
          <RefreshCw className="h-3 w-3 md:h-4 md:w-4" />
        )}
        <span className="hidden md:inline">
          {isChecking ? "Verificando..." : needRefresh ? "Atualizar" : "Verificar Atualizações"}
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