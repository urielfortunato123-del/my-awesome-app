import { Wifi, Wrench, Bell, Eye } from "lucide-react";
import { ActionCard } from "@/components/shared/ActionCard";

const settingsCards = [
  {
    icon: Wifi,
    title: "Conexão com a Internet",
    description: "Escolha como você deseja se conectar à internet.",
  },
  {
    icon: Wrench,
    title: "Varreduras e otimizações",
    description: "Mantenha o máximo desempenho do PC com varreduras programadas e atualizações automáticas.",
  },
  {
    icon: Bell,
    title: "Notificações",
    description: "Conte-nos o que é importante para você, e garantiremos que você fique atualizado.",
  },
  {
    icon: Eye,
    title: "Privacidade e termos",
    description: "Revise nossos termos de privacidade e permissões para executarmos atualizações por você.",
  },
];

export function SettingsPage() {
  return (
    <div className="container mx-auto px-6 py-8">
      <h2 className="text-2xl font-light text-foreground mb-2">
        Configurações e preferências
      </h2>
      <p className="text-muted-foreground mb-8">
        Podemos ajudar você a economizar bastante tempo e esforço. Basta nos dizer o que prefere.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {settingsCards.map((card) => (
          <ActionCard
            key={card.title}
            icon={card.icon}
            title={card.title}
            description={card.description}
          />
        ))}
      </div>
    </div>
  );
}
