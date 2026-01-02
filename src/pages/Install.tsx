import { useState, useEffect } from "react";
import { Download, Monitor, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    setIsInstalling(true);
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
    setIsInstalling(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center">
            <Monitor className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">Instalar SystemAssist</CardTitle>
          <CardDescription>
            Instale o app no seu computador para acesso rápido
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isInstalled ? (
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
                <Check className="h-8 w-8 text-success" />
              </div>
              <p className="text-lg font-medium text-foreground">
                App instalado com sucesso!
              </p>
              <p className="text-sm text-muted-foreground">
                O SystemAssist está disponível no seu sistema.
              </p>
            </div>
          ) : deferredPrompt ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium text-foreground">Benefícios:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-success" />
                    Acesso rápido pela área de trabalho
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-success" />
                    Funciona offline
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-success" />
                    Carregamento mais rápido
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-success" />
                    Experiência como app nativo
                  </li>
                </ul>
              </div>

              <Button
                onClick={handleInstall}
                disabled={isInstalling}
                className="w-full"
                size="lg"
              >
                <Download className="h-5 w-5 mr-2" />
                {isInstalling ? "Instalando..." : "Instalar Agora"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-medium text-foreground mb-3">
                  Para instalar manualmente:
                </h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div>
                    <p className="font-medium text-foreground">Windows/Linux (Chrome):</p>
                    <p>Clique no ícone de instalação na barra de endereços ou menu → "Instalar SystemAssist"</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">macOS (Safari):</p>
                    <p>Arquivo → Adicionar ao Dock</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Edge:</p>
                    <p>Menu (⋯) → Apps → Instalar este site como app</p>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full" asChild>
                <a href="/">
                  <X className="h-4 w-4 mr-2" />
                  Voltar ao Início
                </a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
