import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function VirtualAssistant() {
  return (
    <Button
      className="fixed bottom-6 right-6 gap-2 bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
      size="lg"
    >
      <Sparkles className="h-4 w-4" />
      Virtual Assistant
    </Button>
  );
}
