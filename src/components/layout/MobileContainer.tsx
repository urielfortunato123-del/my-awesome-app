import { ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface MobileContainerProps {
  children: ReactNode;
}

export function MobileContainer({ children }: MobileContainerProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        {/* Container 9:16 vertical */}
        <div 
          className="relative bg-background overflow-hidden flex flex-col"
          style={{
            width: '100%',
            height: '100%',
            maxWidth: 'min(100vw, calc(100vh * 9 / 16))',
            maxHeight: '100vh',
            aspectRatio: '9 / 16',
          }}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {children}
    </div>
  );
}
