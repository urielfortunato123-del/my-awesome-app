import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { VirtualAssistant } from "@/components/layout/VirtualAssistant";
import { HomePage } from "@/components/pages/HomePage";
import { HardwarePage } from "@/components/pages/HardwarePage";
import { CleanupPage } from "@/components/pages/CleanupPage";
import { ProtectionPage } from "@/components/pages/ProtectionPage";
import { HistoryPage } from "@/components/pages/HistoryPage";
import { SettingsPage } from "@/components/pages/SettingsPage";
import { ScanPage } from "@/components/pages/ScanPage";

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
    <div className="min-h-screen bg-background">
      <Header activeTab={activeTab} onTabChange={handleNavigate} />
      <main>
        {renderContent()}
      </main>
      <VirtualAssistant />
    </div>
  );
};

export default Index;
