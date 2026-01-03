import { 
  Home, 
  Cpu, 
  HardDrive, 
  Shield, 
  History, 
  Settings,
  Sparkles
} from "lucide-react";

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
    <header className="bg-sidebar border-b border-sidebar-border sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-info flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              Essencial
            </h1>
            <p className="text-xs text-muted-foreground">Sistema em Ordem</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
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

        {/* Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-success/10 border border-success/20 rounded-full">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-medium text-success">Sistema OK</span>
          </div>
        </div>
      </div>
    </header>
  );
}
