import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { VirtualAssistant } from "@/components/layout/VirtualAssistant";
import { HomePage } from "@/components/pages/HomePage";
import { HistoryPage } from "@/components/pages/HistoryPage";
import { SettingsPage } from "@/components/pages/SettingsPage";
import { ScanPage } from "@/components/pages/ScanPage";

const Index = () => {
  const [activeTab, setActiveTab] = useState("inicio");
  const [showScan, setShowScan] = useState(false);

  const renderContent = () => {
    if (showScan) {
      return <ScanPage onClose={() => setShowScan(false)} />;
    }

    switch (activeTab) {
      case "inicio":
        return <HomePage onNavigate={setActiveTab} />;
      case "historico":
        return <HistoryPage />;
      case "configuracoes":
        return <SettingsPage />;
      default:
        return (
          <div className="container mx-auto px-6 py-12 text-center">
            <h2 className="text-2xl font-light text-muted-foreground">
              Página em desenvolvimento
            </h2>
            <p className="text-muted-foreground mt-2">
              Esta seção estará disponível em breve.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main>
        {renderContent()}
      </main>
      <VirtualAssistant />
    </div>
  );
};

export default Index;
