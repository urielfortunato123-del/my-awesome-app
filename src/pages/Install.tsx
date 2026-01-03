import { useState, useEffect } from "react";
import { Download, Smartphone, Check, X, Share, Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type DeviceType = "android" | "ios" | "desktop";

export default function InstallPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [deviceType, setDeviceType] = useState<DeviceType>("desktop");

  useEffect(() => {
    // Detect device type
    const userAgent = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setDeviceType("ios");
    } else if (/android/.test(userAgent)) {
      setDeviceType("android");
    } else {
      setDeviceType("desktop");
    }

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

  const renderIOSInstructions = () => (
    <div className="space-y-4">
      <div className="bg-muted/50 rounded-xl p-5">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Smartphone className="h-5 w-5 text-primary" />
          Instalar no iPhone/iPad:
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-primary">1</span>
            </div>
            <div>
              <p className="font-medium text-foreground flex items-center gap-2">
                Toque no ícone <Share className="h-4 w-4" /> Compartilhar
              </p>
              <p className="text-sm text-muted-foreground">Na barra inferior do Safari</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-primary">2</span>
            </div>
            <div>
              <p className="font-medium text-foreground flex items-center gap-2">
                Role e toque em <Plus className="h-4 w-4" /> "Adicionar à Tela Inicial"
              </p>
              <p className="text-sm text-muted-foreground">Procure na lista de opções</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-primary">3</span>
            </div>
            <div>
              <p className="font-medium text-foreground">Toque em "Adicionar"</p>
              <p className="text-sm text-muted-foreground">O app aparecerá na sua tela inicial</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAndroidInstructions = () => (
    <div className="space-y-4">
      {deferredPrompt ? (
        <Button
          onClick={handleInstall}
          disabled={isInstalling}
          className="w-full bg-gradient-to-r from-primary to-info hover:opacity-90"
          size="lg"
        >
          <Download className="h-5 w-5 mr-2" />
          {isInstalling ? "Instalando..." : "Instalar Agora"}
        </Button>
      ) : (
        <div className="bg-muted/50 rounded-xl p-5">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-primary" />
            Instalar no Android:
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-primary">1</span>
              </div>
              <div>
                <p className="font-medium text-foreground">Toque no menu ⋮ do Chrome</p>
                <p className="text-sm text-muted-foreground">No canto superior direito</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-primary">2</span>
              </div>
              <div>
                <p className="font-medium text-foreground">"Instalar aplicativo" ou "Adicionar à tela inicial"</p>
                <p className="text-sm text-muted-foreground">Procure na lista de opções</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-primary">3</span>
              </div>
              <div>
                <p className="font-medium text-foreground">Confirme a instalação</p>
                <p className="text-sm text-muted-foreground">O app será instalado automaticamente</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderDesktopInstructions = () => (
    <div className="space-y-4">
      {deferredPrompt ? (
        <Button
          onClick={handleInstall}
          disabled={isInstalling}
          className="w-full bg-gradient-to-r from-primary to-info hover:opacity-90"
          size="lg"
        >
          <Download className="h-5 w-5 mr-2" />
          {isInstalling ? "Instalando..." : "Instalar Agora"}
        </Button>
      ) : (
        <div className="bg-muted/50 rounded-xl p-5">
          <h3 className="font-semibold text-foreground mb-4">
            Para instalar manualmente:
          </h3>
          <div className="space-y-4 text-sm">
            <div className="p-3 bg-card rounded-lg border border-border">
              <p className="font-medium text-foreground">Chrome/Edge:</p>
              <p className="text-muted-foreground">Clique no ícone de instalação na barra de endereços</p>
            </div>
            <div className="p-3 bg-card rounded-lg border border-border">
              <p className="font-medium text-foreground">Safari (macOS):</p>
              <p className="text-muted-foreground">Arquivo → Adicionar ao Dock</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full glass-card border-border">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 w-20 h-20 bg-gradient-to-br from-primary/20 to-info/20 rounded-2xl flex items-center justify-center">
            <Smartphone className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl gradient-text">Instalar Essencial</CardTitle>
          <CardDescription className="text-muted-foreground">
            {deviceType === "ios" && "Adicione à tela inicial do seu iPhone/iPad"}
            {deviceType === "android" && "Instale no seu dispositivo Android"}
            {deviceType === "desktop" && "Instale no seu computador"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isInstalled ? (
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-success/20 rounded-full flex items-center justify-center">
                <Check className="h-8 w-8 text-success" />
              </div>
              <p className="text-lg font-medium text-foreground">
                App instalado com sucesso!
              </p>
              <p className="text-sm text-muted-foreground">
                O Essencial está disponível no seu dispositivo.
              </p>
              <Button className="w-full" asChild>
                <a href="/">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Abrir Essencial
                </a>
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-2 pb-4 border-b border-border">
                <h3 className="font-medium text-foreground text-sm">Benefícios:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-success flex-shrink-0" />
                    Acesso rápido pela tela inicial
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-success flex-shrink-0" />
                    Funciona offline
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-success flex-shrink-0" />
                    Notificações do sistema
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-success flex-shrink-0" />
                    Experiência de app nativo
                  </li>
                </ul>
              </div>

              {deviceType === "ios" && renderIOSInstructions()}
              {deviceType === "android" && renderAndroidInstructions()}
              {deviceType === "desktop" && renderDesktopInstructions()}

              <Button variant="outline" className="w-full border-border" asChild>
                <a href="/">
                  <X className="h-4 w-4 mr-2" />
                  Voltar ao Início
                </a>
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
