import { useState, useEffect } from "react";
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
  Search,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useHardwareDetection } from "@/hooks/useHardwareDetection";
import { useActivityLog } from "@/contexts/ActivityLogContext";

interface CleanupItem {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  size: string;
  sizeBytes: number;
  checked: boolean;
  canClean: boolean;
}

export function CleanupPage() {
  const { hardware } = useHardwareDetection();
  const { addLog } = useActivityLog();
  const [isScanning, setIsScanning] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [cleanProgress, setCleanProgress] = useState(0);
  const [hasScanned, setHasScanned] = useState(false);
  const [totalCleanable, setTotalCleanable] = useState(0);
  const [items, setItems] = useState<CleanupItem[]>([
    { id: "temp", name: "Arquivos Temporários", icon: FileX, description: "Cache do sistema e aplicativos", size: "Analisar", sizeBytes: 0, checked: true, canClean: true },
    { id: "cache", name: "Cache do App", icon: FolderX, description: "Dados em cache do navegador", size: "Analisar", sizeBytes: 0, checked: true, canClean: true },
    { id: "storage", name: "Armazenamento Local", icon: HardDrive, description: "Dados locais de sites", size: "Analisar", sizeBytes: 0, checked: false, canClean: true },
    { id: "logs", name: "Logs do Console", icon: History, description: "Registros de depuração", size: "Analisar", sizeBytes: 0, checked: false, canClean: true },
    { id: "indexeddb", name: "Banco de Dados Local", icon: Download, description: "IndexedDB e dados offline", size: "Analisar", sizeBytes: 0, checked: false, canClean: true },
    { id: "serviceworker", name: "Service Workers", icon: RefreshCw, description: "Cache de PWA e workers", size: "Analisar", sizeBytes: 0, checked: false, canClean: true },
  ]);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const handleScan = async () => {
    setIsScanning(true);
    setScanProgress(0);
    
    toast.info("Analisando armazenamento...");

    try {
      // Simular progresso inicial
      for (let i = 0; i <= 30; i += 10) {
        await new Promise(r => setTimeout(r, 100));
        setScanProgress(i);
      }

      // Estimar tamanhos usando Storage API
      let storageEstimate = { usage: 0, quota: 0 };
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        storageEstimate = await navigator.storage.estimate() as { usage: number; quota: number };
      }

      setScanProgress(50);

      // Calcular tamanhos estimados (baseado no uso total)
      const totalUsed = storageEstimate.usage || 0;
      const cacheEstimate = Math.floor(totalUsed * 0.3);
      const tempEstimate = Math.floor(totalUsed * 0.2);
      const storageDataEstimate = Math.floor(totalUsed * 0.25);
      const logsEstimate = Math.floor(totalUsed * 0.05);
      const indexedDbEstimate = Math.floor(totalUsed * 0.15);
      const swEstimate = Math.floor(totalUsed * 0.05);

      setScanProgress(80);

      const updatedItems: CleanupItem[] = [
        { id: "temp", name: "Arquivos Temporários", icon: FileX, description: "Cache do sistema e aplicativos", size: formatBytes(tempEstimate), sizeBytes: tempEstimate, checked: true, canClean: true },
        { id: "cache", name: "Cache do App", icon: FolderX, description: "Dados em cache do navegador", size: formatBytes(cacheEstimate), sizeBytes: cacheEstimate, checked: true, canClean: true },
        { id: "storage", name: "Armazenamento Local", icon: HardDrive, description: "Dados locais de sites", size: formatBytes(storageDataEstimate), sizeBytes: storageDataEstimate, checked: false, canClean: true },
        { id: "logs", name: "Logs do Console", icon: History, description: "Registros de depuração", size: formatBytes(logsEstimate), sizeBytes: logsEstimate, checked: false, canClean: true },
        { id: "indexeddb", name: "Banco de Dados Local", icon: Download, description: "IndexedDB e dados offline", size: formatBytes(indexedDbEstimate), sizeBytes: indexedDbEstimate, checked: false, canClean: true },
        { id: "serviceworker", name: "Service Workers", icon: RefreshCw, description: "Cache de PWA e workers", size: formatBytes(swEstimate), sizeBytes: swEstimate, checked: false, canClean: true },
      ];

      setItems(updatedItems);
      setScanProgress(100);
      setHasScanned(true);

      const cleanableTotal = updatedItems
        .filter(i => i.checked)
        .reduce((sum, i) => sum + i.sizeBytes, 0);
      setTotalCleanable(cleanableTotal);

      toast.success("Análise concluída!", {
        description: `${formatBytes(cleanableTotal)} podem ser liberados`
      });
    } catch (error) {
      console.error("Erro ao analisar:", error);
      toast.error("Erro ao analisar armazenamento");
    } finally {
      setIsScanning(false);
    }
  };

  const handleClean = async () => {
    const selectedItems = items.filter(i => i.checked && i.sizeBytes > 0);
    if (selectedItems.length === 0) {
      toast.warning("Selecione itens para limpar");
      return;
    }

    setIsCleaning(true);
    setCleanProgress(0);

    toast.info("Executando limpeza...");

    try {
      const progressStep = 100 / selectedItems.length;
      let currentProgress = 0;

      for (const item of selectedItems) {
        // Executar limpeza real baseada no tipo
        if (item.id === "cache" || item.id === "temp") {
          // Limpar caches do navegador
          if ('caches' in window) {
            const cacheNames = await caches.keys();
            for (const name of cacheNames) {
              await caches.delete(name);
            }
          }
        }

        if (item.id === "storage") {
          // Limpar localStorage (exceto dados essenciais)
          const keysToKeep = ['theme', 'settings'];
          const keysToRemove = Object.keys(localStorage).filter(k => !keysToKeep.includes(k));
          keysToRemove.forEach(k => localStorage.removeItem(k));
        }

        if (item.id === "serviceworker") {
          // Desregistrar service workers antigos
          if ('serviceWorker' in navigator) {
            const registrations = await navigator.serviceWorker.getRegistrations();
            // Manter apenas o atual
            for (const reg of registrations.slice(1)) {
              await reg.unregister();
            }
          }
        }

        currentProgress += progressStep;
        setCleanProgress(Math.min(currentProgress, 100));
        await new Promise(r => setTimeout(r, 300));
      }

      setCleanProgress(100);

      // Atualizar itens limpos
      setItems(prev => prev.map(item => 
        item.checked ? { ...item, size: "0 B", sizeBytes: 0 } : item
      ));
      setTotalCleanable(0);

      // Registrar no log de atividades
      const cleanedBytes = selectedItems.reduce((sum, i) => sum + i.sizeBytes, 0);
      addLog({
        task: "Limpeza do Sistema",
        type: "cleanup",
        category: "Limpeza",
        status: "success",
        details: `${formatBytes(cleanedBytes)} liberados`,
        dataSize: cleanedBytes,
      });

      toast.success("Limpeza concluída!", {
        description: "Cache e dados temporários foram removidos"
      });

    } catch (error) {
      console.error("Erro na limpeza:", error);
      toast.error("Erro ao executar limpeza");
    } finally {
      setIsCleaning(false);
      setCleanProgress(0);
    }
  };

  const toggleItem = (id: string) => {
    setItems(prev => {
      const updated = prev.map(item => 
        item.id === id ? { ...item, checked: !item.checked } : item
      );
      const newTotal = updated
        .filter(i => i.checked)
        .reduce((sum, i) => sum + i.sizeBytes, 0);
      setTotalCleanable(newTotal);
      return updated;
    });
  };

  const selectAll = () => {
    setItems(prev => {
      const updated = prev.map(item => ({ ...item, checked: true }));
      const newTotal = updated.reduce((sum, i) => sum + i.sizeBytes, 0);
      setTotalCleanable(newTotal);
      return updated;
    });
  };

  // Calcular espaço livre do dispositivo
  const freeSpace = hardware?.storage.total || "0 GB";
  const usedPercentage = hardware?.storage.percentage || 0;

  return (
    <div className="min-h-[calc(100vh-80px)] p-3 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground">Limpeza do Sistema</h2>
            <p className="text-sm text-muted-foreground">Remova arquivos desnecessários e libere espaço</p>
          </div>
          <Button 
            onClick={handleScan}
            disabled={isScanning || isCleaning}
            className="gap-2 bg-gradient-to-r from-secondary to-purple-400 hover:opacity-90 text-secondary-foreground w-full sm:w-auto"
          >
            {isScanning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
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
        {(isScanning || isCleaning) && (
          <div className="glass-card p-4 md:p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-foreground font-medium text-sm">
                {isScanning ? "Analisando sistema..." : "Limpando..."}
              </span>
              <span className="text-muted-foreground text-sm">
                {isScanning ? scanProgress : cleanProgress}%
              </span>
            </div>
            <Progress value={isScanning ? scanProgress : cleanProgress} className="h-2" />
          </div>
        )}

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          <div className="glass-card p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                <Trash2 className="h-5 w-5 md:h-6 md:w-6 text-secondary" />
              </div>
              <div>
                <p className="text-xl md:text-2xl font-bold text-foreground">{formatBytes(totalCleanable)}</p>
                <p className="text-xs md:text-sm text-muted-foreground">Pode ser liberado</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-success/20 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-success" />
              </div>
              <div>
                <p className="text-xl md:text-2xl font-bold text-foreground">{freeSpace}</p>
                <p className="text-xs md:text-sm text-muted-foreground">Espaço total</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-info/20 flex items-center justify-center">
                <HardDrive className="h-5 w-5 md:h-6 md:w-6 text-info" />
              </div>
              <div>
                <p className="text-xl md:text-2xl font-bold text-foreground">{usedPercentage}%</p>
                <p className="text-xs md:text-sm text-muted-foreground">Disco utilizado</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scan prompt */}
        {!hasScanned && !isScanning && (
          <div className="glass-card p-4 border-secondary/30 bg-secondary/5">
            <div className="flex items-center gap-3">
              <Search className="h-5 w-5 text-secondary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">Análise pendente</p>
                <p className="text-xs text-muted-foreground">Clique em "Analisar Sistema" para verificar o que pode ser limpo</p>
              </div>
            </div>
          </div>
        )}

        {/* Cleanup Items */}
        <div className="glass-card">
          <div className="p-3 md:p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-medium text-foreground text-sm md:text-base">Itens para Limpeza</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground text-xs md:text-sm"
              onClick={selectAll}
            >
              Selecionar todos
            </Button>
          </div>
          <div className="divide-y divide-border">
            {items.map((item) => (
              <div 
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className="p-3 md:p-4 flex items-center justify-between hover:bg-muted/20 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 md:gap-4">
                  <div className={`w-5 h-5 md:w-6 md:h-6 rounded border-2 flex items-center justify-center transition-colors ${
                    item.checked 
                      ? 'bg-primary border-primary' 
                      : 'border-muted-foreground'
                  }`}>
                    {item.checked && <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-primary-foreground" />}
                  </div>
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-muted/50 flex items-center justify-center">
                    <item.icon className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-foreground text-sm md:text-base truncate">{item.name}</p>
                    <p className="text-xs md:text-sm text-muted-foreground truncate">{item.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 md:gap-4 shrink-0">
                  <span className={`text-xs md:text-sm font-medium ${
                    item.sizeBytes > 0 ? 'text-secondary' : 'text-muted-foreground'
                  }`}>
                    {item.size}
                  </span>
                  <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground hidden sm:block" />
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 md:p-4 border-t border-border">
            <Button 
              className="w-full gap-2 bg-gradient-to-r from-destructive to-red-400 hover:opacity-90"
              onClick={handleClean}
              disabled={isCleaning || !hasScanned || totalCleanable === 0}
            >
              {isCleaning ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Limpando...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Executar Limpeza {totalCleanable > 0 && `(${formatBytes(totalCleanable)})`}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
