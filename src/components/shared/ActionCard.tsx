import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onAction?: () => void;
  actionLabel?: string;
}

export function ActionCard({ 
  icon: Icon, 
  title, 
  description, 
  onAction,
  actionLabel = "Comece agora"
}: ActionCardProps) {
  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border/50 hover:shadow-md hover:border-primary/20 transition-all duration-300 flex flex-col h-full">
      <div className="flex items-start gap-3 mb-4">
        <Icon className="h-5 w-5 text-primary mt-0.5" />
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground flex-1 mb-4">
        {description}
      </p>
      <Button 
        variant="outline" 
        size="sm"
        className="w-fit text-primary border-primary hover:bg-primary hover:text-primary-foreground"
        onClick={onAction}
      >
        {actionLabel}
      </Button>
    </div>
  );
}
