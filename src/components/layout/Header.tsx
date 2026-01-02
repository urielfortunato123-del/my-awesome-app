import { User, Globe, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "inicio", label: "Início" },
  { id: "descubra", label: "Descubra" },
  { id: "suporte", label: "Suporte" },
  { id: "historico", label: "Histórico" },
  { id: "configuracoes", label: "Configurações" },
];

export function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="bg-card border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <h1 className="text-xl font-semibold text-primary">
          SystemAssist
        </h1>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
            <User className="h-4 w-4" />
            Fazer login
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                <Globe className="h-4 w-4" />
                Português (BR)
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Português (BR)</DropdownMenuItem>
              <DropdownMenuItem>English (US)</DropdownMenuItem>
              <DropdownMenuItem>Español</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex items-center justify-between px-6">
        <nav className="flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                activeTab === tab.id
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </nav>

        {/* Service info */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Plano de serviço:</span>
            <span className="inline-flex items-center gap-1 bg-success/10 text-success px-2 py-0.5 rounded-full text-xs font-medium">
              ✓ Basic
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Monitor className="h-4 w-4" />
            Etiqueta de serviço: <span className="font-mono text-primary">J624294</span>
          </div>
        </div>
      </div>
    </header>
  );
}
