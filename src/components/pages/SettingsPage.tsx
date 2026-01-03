import { useState } from "react";
import { 
  Wifi, 
  Wrench, 
  Bell, 
  Eye, 
  Moon, 
  Sun, 
  Monitor,
  Download,
  Share2,
  FileText,
  ChevronRight,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/contexts/ThemeContext";
import { useHardwareDetection } from "@/hooks/useHardwareDetection";
import { toast } from "sonner";
import { useActivityLog } from "@/contexts/ActivityLogContext";

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { hardware } = useHardwareDetection();
  const { addLog } = useActivityLog();
  const [notifications, setNotifications] = useState(false);
  const [autoScan, setAutoScan] = useState(false);

  const handleExportReport = () => {
    if (!hardware) {
      toast.error("Aguarde a detecção de hardware");
      return;
    }

    const report = `
╔══════════════════════════════════════════════════════════════╗
║                    RELATÓRIO DO DISPOSITIVO                   ║
║                         Essencial App                         ║
╠══════════════════════════════════════════════════════════════╣

📅 Data: ${new Date().toLocaleString('pt-BR')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏭 FABRICANTE E MODELO
   Fabricante: ${hardware.manufacturer}
   Modelo: ${hardware.deviceModel}
   Tipo: ${hardware.deviceType}

💻 SISTEMA OPERACIONAL
   Sistema: ${hardware.os} ${hardware.osVersion}
   Kernel: ${hardware.kernelVersion}
   Plataforma: ${hardware.platform}

🌐 NAVEGADOR
   Navegador: ${hardware.browser} v${hardware.browserVersion}
   Engine: ${hardware.browserEngine}
   Idioma: ${hardware.language}

⚡ PROCESSADOR
   Tipo: ${hardware.cpu.name}
   Núcleos: ${hardware.cpu.cores}
   Arquitetura: ${hardware.cpu.architecture}

💾 MEMÓRIA
   RAM: ${hardware.memory.total}

📁 ARMAZENAMENTO
   Usado: ${hardware.storage.used}
   Total: ${hardware.storage.total}
   Porcentagem: ${hardware.storage.percentage}%

🖥️ TELA
   Resolução: ${hardware.display.resolution}
   Pixel Ratio: ${hardware.display.pixelRatio}x
   Profundidade de Cor: ${hardware.display.colorDepth}bit
   Tipo: ${hardware.screenType}
   Orientação: ${hardware.display.orientation}

🎮 GPU
   ${hardware.webGLRenderer}

📶 REDE
   Status: ${hardware.network.status}
   Tipo: ${hardware.network.type}
   ${hardware.network.downlink ? `Velocidade: ${hardware.network.downlink} Mbps` : ''}

🔋 BATERIA
   Status: ${hardware.battery.status}
   Nível: ${hardware.battery.level}%
   Carregando: ${hardware.battery.charging ? 'Sim' : 'Não'}

👆 TOUCH
   Suporte: ${hardware.touchSupport ? 'Sim' : 'Não'}
   Pontos: ${hardware.maxTouchPoints}

🌍 LOCALIZAÇÃO
   Fuso Horário: ${hardware.timezone}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Gerado por Essencial App - Sistema em Ordem
`.trim();

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_${hardware.deviceModel.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    addLog({
      task: "Exportar Relatório",
      type: "export",
      category: "Sistema",
      status: "success",
      details: `Relatório de ${hardware.deviceModel}`,
    });

    toast.success("Relatório exportado!");
  };

  const handleShare = async () => {
    if (!hardware) return;

    const shareText = `📱 Meu dispositivo: ${hardware.manufacturer} ${hardware.deviceModel}
💻 Sistema: ${hardware.os} ${hardware.osVersion}
⚡ CPU: ${hardware.cpu.cores} núcleos
💾 RAM: ${hardware.memory.total}
🖥️ Tela: ${hardware.display.resolution}

Gerado por Essencial App`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Info do Dispositivo',
          text: shareText,
        });
        toast.success("Compartilhado!");
      } catch (e) {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      toast.success("Copiado para a área de transferência!");
    }
  };

  const themeOptions = [
    { id: "light", label: "Claro", icon: Sun },
    { id: "dark", label: "Escuro", icon: Moon },
    { id: "system", label: "Sistema", icon: Monitor },
  ] as const;

  return (
    <div className="min-h-[calc(100vh-80px)] p-3 md:p-6">
      <div className="max-w-3xl mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-foreground">Configurações</h2>
          <p className="text-sm text-muted-foreground">Personalize o app do seu jeito</p>
        </div>

        {/* Appearance */}
        <div className="glass-card">
          <div className="p-3 md:p-4 border-b border-border">
            <h3 className="font-medium text-foreground">Aparência</h3>
          </div>
          <div className="p-3 md:p-4">
            <p className="text-sm text-muted-foreground mb-3">Escolha o tema do aplicativo</p>
            <div className="grid grid-cols-3 gap-2 md:gap-3">
              {themeOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setTheme(option.id)}
                  className={`p-3 md:p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                    theme === option.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-muted-foreground"
                  }`}
                >
                  <option.icon className={`h-5 w-5 md:h-6 md:w-6 ${
                    theme === option.id ? "text-primary" : "text-muted-foreground"
                  }`} />
                  <span className={`text-xs md:text-sm font-medium ${
                    theme === option.id ? "text-primary" : "text-foreground"
                  }`}>
                    {option.label}
                  </span>
                  {theme === option.id && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="glass-card">
          <div className="p-3 md:p-4 border-b border-border">
            <h3 className="font-medium text-foreground">Preferências</h3>
          </div>
          <div className="divide-y divide-border">
            <div className="p-3 md:p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-info/20 flex items-center justify-center">
                  <Bell className="h-4 w-4 md:h-5 md:w-5 text-info" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm md:text-base">Notificações</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Lembretes de limpeza e atualizações</p>
                </div>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
            <div className="p-3 md:p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-success/20 flex items-center justify-center">
                  <Wrench className="h-4 w-4 md:h-5 md:w-5 text-success" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm md:text-base">Varredura automática</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Verificar sistema semanalmente</p>
                </div>
              </div>
              <Switch checked={autoScan} onCheckedChange={setAutoScan} />
            </div>
          </div>
        </div>

        {/* Export & Share */}
        <div className="glass-card">
          <div className="p-3 md:p-4 border-b border-border">
            <h3 className="font-medium text-foreground">Relatório do Dispositivo</h3>
          </div>
          <div className="p-3 md:p-4 space-y-3">
            <p className="text-sm text-muted-foreground">
              Exporte ou compartilhe as informações do seu dispositivo
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                className="gap-2 flex-1"
                onClick={handleExportReport}
              >
                <Download className="h-4 w-4" />
                Exportar Relatório
              </Button>
              <Button 
                variant="outline" 
                className="gap-2 flex-1"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
                Compartilhar
              </Button>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="glass-card">
          <div className="p-3 md:p-4 border-b border-border">
            <h3 className="font-medium text-foreground">Sobre</h3>
          </div>
          <div className="divide-y divide-border">
            <div className="p-3 md:p-4 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Versão</span>
              <span className="text-sm font-medium text-foreground">1.2.0</span>
            </div>
            <div className="p-3 md:p-4 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Desenvolvido com</span>
              <span className="text-sm font-medium text-foreground">❤️ e Lovable</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
