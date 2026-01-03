import { useState } from "react";
import { Sparkles, X, Send, Bot, User, Minimize2, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function VirtualAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Olá! Sou o assistente do OptimaPC. Posso ajudar com otimização, limpeza, diagnósticos e muito mais. Como posso ajudar?"
    }
  ]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    
    // Simulated response
    setTimeout(() => {
      const responses = [
        "Analisando seu sistema... Encontrei alguns arquivos temporários que podem ser limpos para liberar espaço.",
        "Posso executar uma varredura completa para verificar a saúde do seu sistema. Deseja continuar?",
        "Detectei que seu disco está com 78% de uso. Recomendo executar a limpeza de arquivos desnecessários.",
        "Para atualizar os drivers, vá em Hardware > Drivers. Posso te guiar nesse processo.",
      ];
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)]
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-primary to-info hover:opacity-90 text-primary-foreground shadow-lg"
        size="icon"
      >
        <Sparkles className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div 
      className={`fixed bottom-6 right-6 bg-sidebar border border-sidebar-border rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ${
        isExpanded ? 'w-[500px] h-[600px]' : 'w-[380px] h-[500px]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-info flex items-center justify-center">
            <Bot className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">Assistente IA</h3>
            <p className="text-xs text-success">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                message.role === 'assistant' 
                  ? 'bg-gradient-to-br from-primary to-info' 
                  : 'bg-secondary'
              }`}>
                {message.role === 'assistant' 
                  ? <Bot className="h-4 w-4 text-primary-foreground" />
                  : <User className="h-4 w-4 text-secondary-foreground" />
                }
              </div>
              <div className={`max-w-[75%] p-3 rounded-2xl ${
                message.role === 'assistant' 
                  ? 'bg-muted/50 text-foreground rounded-tl-sm' 
                  : 'bg-primary text-primary-foreground rounded-tr-sm'
              }`}>
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Digite sua mensagem..."
            className="bg-muted/50 border-border"
          />
          <Button 
            onClick={handleSend}
            size="icon"
            className="bg-gradient-to-r from-primary to-info hover:opacity-90 text-primary-foreground shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Powered by AI • Windows • Linux • macOS
        </p>
      </div>
    </div>
  );
}
