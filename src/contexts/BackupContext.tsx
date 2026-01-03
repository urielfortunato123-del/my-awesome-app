import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface RestorePoint {
  id: string;
  date: Date;
  description: string;
  type: "auto" | "manual";
}

interface BackupContextType {
  restorePoints: RestorePoint[];
  hasInitialBackup: boolean;
  isCreatingBackup: boolean;
  createBackup: (description: string, type?: "auto" | "manual") => Promise<void>;
  createInitialBackup: () => Promise<void>;
  restoreFromPoint: (pointId: string) => Promise<void>;
}

const BackupContext = createContext<BackupContextType | undefined>(undefined);

export function BackupProvider({ children }: { children: ReactNode }) {
  const [restorePoints, setRestorePoints] = useState<RestorePoint[]>([]);
  const [hasInitialBackup, setHasInitialBackup] = useState(false);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);

  useEffect(() => {
    // Check localStorage for existing backup status
    const savedBackup = localStorage.getItem("optimapc_initial_backup");
    const savedPoints = localStorage.getItem("optimapc_restore_points");
    
    if (savedBackup === "true") {
      setHasInitialBackup(true);
    }
    
    if (savedPoints) {
      try {
        const points = JSON.parse(savedPoints);
        setRestorePoints(points.map((p: any) => ({ ...p, date: new Date(p.date) })));
      } catch (e) {
        console.error("Error loading restore points:", e);
      }
    }
  }, []);

  const saveRestorePoints = (points: RestorePoint[]) => {
    localStorage.setItem("optimapc_restore_points", JSON.stringify(points));
  };

  const createBackup = async (description: string, type: "auto" | "manual" = "auto") => {
    setIsCreatingBackup(true);
    
    // Simulate backup creation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newPoint: RestorePoint = {
      id: Date.now().toString(),
      date: new Date(),
      description,
      type
    };
    
    const updatedPoints = [newPoint, ...restorePoints].slice(0, 10); // Keep last 10 points
    setRestorePoints(updatedPoints);
    saveRestorePoints(updatedPoints);
    setIsCreatingBackup(false);
  };

  const createInitialBackup = async () => {
    setIsCreatingBackup(true);
    
    // Simulate initial backup
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const initialPoint: RestorePoint = {
      id: Date.now().toString(),
      date: new Date(),
      description: "Ponto de restauração inicial",
      type: "auto"
    };
    
    setRestorePoints([initialPoint]);
    saveRestorePoints([initialPoint]);
    localStorage.setItem("optimapc_initial_backup", "true");
    setHasInitialBackup(true);
    setIsCreatingBackup(false);
  };

  const restoreFromPoint = async (pointId: string) => {
    // Simulate restore
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log("Restored from point:", pointId);
  };

  return (
    <BackupContext.Provider value={{
      restorePoints,
      hasInitialBackup,
      isCreatingBackup,
      createBackup,
      createInitialBackup,
      restoreFromPoint
    }}>
      {children}
    </BackupContext.Provider>
  );
}

export function useBackup() {
  const context = useContext(BackupContext);
  if (!context) {
    throw new Error("useBackup must be used within BackupProvider");
  }
  return context;
}
