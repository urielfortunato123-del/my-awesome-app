import { 
  Home, 
  Cpu, 
  HardDrive, 
  Shield, 
  History, 
  Settings
} from "lucide-react";
import logo from "@/assets/logo.png";
import { UpdateChecker, APP_VERSION } from "./UpdateChecker";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "inicio", label: "Início", icon: Home },
  { id: "hardware", label: "Hardware", icon: Cpu },
  { id: "limpeza", label: "Limpeza", icon: HardDrive },
  { id: "protecao", label: "Proteção", icon: Shield },
  { id: "historico", label: "Histórico", icon: History },
  { id: "configuracoes", label: "Configurações", icon: Settings },
];

export function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="bg-sidebar border-b border-sidebar-border sticky top-0 z-50 shrink-0">
      <div className="flex items-center justify-between px-3 md:px-6 py-2 md:py-4">
        {/* Logo & Version */}
        <div className="flex items-center gap-2">
          <img 
            src={logo} 
            alt="Essencial Logo" 
            className="h-8 md:h-12 w-auto"
          />
          <span className="text-[9px] md:text-xs text-muted-foreground font-medium px-1.5 py-0.5 bg-muted/50 rounded">
            v{APP_VERSION}
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`nav-item flex items-center gap-2 ${
                activeTab === tab.id ? "active" : ""
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Status & Update */}
        <div className="flex items-center gap-2 md:gap-3">
          <UpdateChecker />
          <div className="flex items-center gap-1.5 px-2 py-1 bg-success/10 border border-success/20 rounded-full">
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-success animate-pulse" />
            <span className="text-[10px] md:text-xs font-medium text-success">
              <span className="hidden md:inline">Sistema </span>OK
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className="flex md:hidden items-center justify-between px-2 pb-2 gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-all min-w-[48px] ${
              activeTab === tab.id 
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span className="text-[9px] font-medium">{tab.label}</span>
          </button>
        ))}
      </nav>
    </header>
  );
}
