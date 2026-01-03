import { useState } from "react";
import { 
  Trash2, 
  HardDrive, 
  FileX, 
  FolderX,
  History,
  Download,
  RefreshCw,
  CheckCircle,
  Play,
  ChevronRight,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface CleanupItem {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  size: string;
  checked: boolean;
}

const cleanupItems: CleanupItem[] = [
  { id: "temp", name: "Arquivos Temporários", icon: FileX, description: "Cache do sistema e aplicativos", size: "Calculando...", checked: true },
  { id: "recycle", name: "Lixeira", icon: Trash2, description: "Arquivos excluídos", size: "Calculando...", checked: true },
  { id: "browser", name: "Cache do Navegador", icon: FolderX, description: "Dados de navegação armazenados", size: "Calculando...", checked: true },
  { id: "logs", name: "Logs Antigos", icon: History, description: "Registros de sistema antigos", size: "Calculando...", checked: false },
  { id: "downloads", name: "Downloads Antigos", icon: Download, description: "Arquivos baixados há mais de 30 dias", size: "Calculando...", checked: false },
  { id: "updates", name: "Cache de Atualizações", icon: RefreshCw, description: "Arquivos de atualização do sistema", size: "Calculando...", checked: false },
];

export function CleanupPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [items, setItems] = useState(cleanupItems);

  const handleScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  return (
    <div className="min-h-[calc(100vh-80px)] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Limpeza do Sistema</h2>
            <p className="text-muted-foreground">Remova arquivos desnecessários e libere espaço</p>
          </div>
          <Button 
            onClick={handleScan}
            disabled={isScanning}
            className="gap-2 bg-gradient-to-r from-secondary to-purple-400 hover:opacity-90 text-secondary-foreground"
          >
            {isScanning ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Analisando...
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Analisar Sistema
              </>
            )}
          </Button>
        </div>

        {/* Progress */}
        {isScanning && (
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-foreground font-medium">Analisando sistema...</span>
              <span className="text-muted-foreground">{scanProgress}%</span>
            </div>
            <Progress value={scanProgress} className="h-2" />
          </div>
        )}

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                <Trash2 className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">0 MB</p>
                <p className="text-sm text-muted-foreground">Pode ser liberado</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">0 GB</p>
                <p className="text-sm text-muted-foreground">Espaço livre atual</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-info/20 flex items-center justify-center">
                <HardDrive className="h-6 w-6 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">0%</p>
                <p className="text-sm text-muted-foreground">Disco utilizado</p>
              </div>
            </div>
          </div>
        </div>

        {/* Cleanup Items */}
        <div className="glass-card">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-medium text-foreground">Itens para Limpeza</h3>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              Selecionar todos
            </Button>
          </div>
          <div className="divide-y divide-border">
            {items.map((item) => (
              <div 
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className="p-4 flex items-center justify-between hover:bg-muted/20 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                    item.checked 
                      ? 'bg-primary border-primary' 
                      : 'border-muted-foreground'
                  }`}>
                    {item.checked && <CheckCircle className="h-4 w-4 text-primary-foreground" />}
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">{item.size}</span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-border">
            <Button className="w-full gap-2 bg-gradient-to-r from-destructive to-red-400 hover:opacity-90">
              <Play className="h-4 w-4" />
              Executar Limpeza
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
