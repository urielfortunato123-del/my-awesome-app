import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { VirtualAssistant } from "@/components/layout/VirtualAssistant";
import { InitialBackupModal } from "@/components/layout/InitialBackupModal";
import { MobileContainer } from "@/components/layout/MobileContainer";
import { HomePage } from "@/components/pages/HomePage";
import { HardwarePage } from "@/components/pages/HardwarePage";
import { CleanupPage } from "@/components/pages/CleanupPage";
import { ProtectionPage } from "@/components/pages/ProtectionPage";
import { HistoryPage } from "@/components/pages/HistoryPage";
import { SettingsPage } from "@/components/pages/SettingsPage";
import { ScanPage } from "@/components/pages/ScanPage";
import { BackupProvider } from "@/contexts/BackupContext";

const Index = () => {
  const [activeTab, setActiveTab] = useState("inicio");
  const [showScan, setShowScan] = useState(false);

  const handleNavigate = (tab: string) => {
    if (tab === 'scan') {
      setShowScan(true);
    } else {
      setActiveTab(tab);
      setShowScan(false);
    }
  };

  const renderContent = () => {
    if (showScan) {
      return <ScanPage onClose={() => setShowScan(false)} />;
    }

    switch (activeTab) {
      case "inicio":
        return <HomePage onNavigate={handleNavigate} />;
      case "hardware":
        return <HardwarePage />;
      case "limpeza":
        return <CleanupPage />;
      case "protecao":
        return <ProtectionPage />;
      case "historico":
        return <HistoryPage />;
      case "configuracoes":
        return <SettingsPage />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <BackupProvider>
      <MobileContainer>
        <InitialBackupModal />
        <Header activeTab={activeTab} onTabChange={handleNavigate} />
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
        <footer className="py-1.5 md:py-3 text-center border-t border-border bg-sidebar shrink-0">
          <p className="text-[9px] md:text-xs text-muted-foreground">
            Desenvolvido por <span className="text-primary font-medium">Uriel da Fonseca Fortunato</span>
          </p>
        </footer>
        <VirtualAssistant />
      </MobileContainer>
    </BackupProvider>
  );
};

export default Index;
