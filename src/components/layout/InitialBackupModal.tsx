import { Shield, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBackup } from "@/contexts/BackupContext";

export function InitialBackupModal() {
  const { hasInitialBackup, isCreatingBackup, createInitialBackup } = useBackup();

  if (hasInitialBackup) return null;

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card max-w-md w-full p-8 text-center">
        {isCreatingBackup ? (
          <>
            <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-3">
              Criando Backup Inicial
            </h2>
            <p className="text-muted-foreground mb-6">
              Estamos criando um ponto de restauração do seu sistema. 
              Isso permite restaurar caso algo dê errado.
            </p>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-info rounded-full animate-pulse w-2/3" />
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Por favor, aguarde...
            </p>
          </>
        ) : (
          <>
            <div className="w-20 h-20 rounded-2xl bg-success/20 flex items-center justify-center mx-auto mb-6">
              <Shield className="h-10 w-10 text-success" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-3">
              Bem-vindo ao Essencial
            </h2>
            <p className="text-muted-foreground mb-6">
              Antes de começar, vamos criar um ponto de restauração inicial do seu sistema. 
              Isso garante que você possa voltar a este estado se algo der errado.
            </p>
            <div className="bg-muted/30 rounded-xl p-4 mb-6 text-left">
              <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                O que será salvo:
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Configurações do sistema</li>
                <li>• Informações de hardware</li>
                <li>• Estado atual do sistema</li>
              </ul>
            </div>
            <Button 
              onClick={createInitialBackup}
              className="w-full gap-2 bg-gradient-to-r from-success to-emerald-400 hover:opacity-90 text-success-foreground"
              size="lg"
            >
              <Shield className="h-5 w-5" />
              Criar Backup Inicial
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              Recomendado para sua segurança
            </p>
          </>
        )}
      </div>
    </div>
  );
}
