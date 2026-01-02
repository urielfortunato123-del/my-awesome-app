import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  iconColor?: string;
  iconBgColor?: string;
}

export function StatCard({ 
  icon: Icon, 
  value, 
  label, 
  iconColor = "text-primary",
  iconBgColor = "bg-primary/10"
}: StatCardProps) {
  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border/50 hover:shadow-md transition-all duration-300">
      <div className="flex flex-col items-center text-center gap-3">
        <div className={`${iconBgColor} p-3 rounded-full`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-sm text-muted-foreground mt-1">{label}</p>
        </div>
      </div>
    </div>
  );
}
