import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface ActivityLog {
  id: string;
  task: string;
  type: "scan" | "cleanup" | "update" | "protection" | "benchmark" | "export";
  category: string;
  status: "success" | "failed" | "pending";
  timestamp: Date;
  duration?: number; // em segundos
  details?: string;
  dataSize?: number; // em bytes
}

interface ActivityStats {
  totalUpdates: number;
  totalSpaceRecovered: number; // em bytes
  totalFilesOptimized: number;
  totalScans: number;
}

interface ActivityLogContextType {
  logs: ActivityLog[];
  stats: ActivityStats;
  addLog: (log: Omit<ActivityLog, "id" | "timestamp">) => void;
  clearLogs: () => void;
  getLogsByType: (type: ActivityLog["type"]) => ActivityLog[];
  getLogsByPeriod: (days: number) => ActivityLog[];
}

const ActivityLogContext = createContext<ActivityLogContextType | undefined>(undefined);

const STORAGE_KEY = "essencial_activity_logs";
const STATS_KEY = "essencial_activity_stats";

export function ActivityLogProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [stats, setStats] = useState<ActivityStats>({
    totalUpdates: 0,
    totalSpaceRecovered: 0,
    totalFilesOptimized: 0,
    totalScans: 0,
  });

  // Carregar logs do localStorage
  useEffect(() => {
    try {
      const savedLogs = localStorage.getItem(STORAGE_KEY);
      const savedStats = localStorage.getItem(STATS_KEY);
      
      if (savedLogs) {
        const parsedLogs = JSON.parse(savedLogs).map((log: any) => ({
          ...log,
          timestamp: new Date(log.timestamp),
        }));
        setLogs(parsedLogs);
      }
      
      if (savedStats) {
        setStats(JSON.parse(savedStats));
      }
    } catch (error) {
      console.error("Erro ao carregar logs:", error);
    }
  }, []);

  // Salvar logs no localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
      localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch (error) {
      console.error("Erro ao salvar logs:", error);
    }
  }, [logs, stats]);

  const addLog = (log: Omit<ActivityLog, "id" | "timestamp">) => {
    const newLog: ActivityLog = {
      ...log,
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };

    setLogs((prev) => [newLog, ...prev].slice(0, 100)); // Manter apenas os últimos 100 logs

    // Atualizar estatísticas
    if (log.status === "success") {
      setStats((prev) => {
        const newStats = { ...prev };
        
        switch (log.type) {
          case "update":
            newStats.totalUpdates += 1;
            break;
          case "cleanup":
            newStats.totalSpaceRecovered += log.dataSize || 0;
            newStats.totalFilesOptimized += 1;
            break;
          case "scan":
          case "protection":
            newStats.totalScans += 1;
            break;
        }
        
        return newStats;
      });
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const getLogsByType = (type: ActivityLog["type"]) => {
    return logs.filter((log) => log.type === type);
  };

  const getLogsByPeriod = (days: number) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return logs.filter((log) => log.timestamp >= cutoff);
  };

  return (
    <ActivityLogContext.Provider
      value={{
        logs,
        stats,
        addLog,
        clearLogs,
        getLogsByType,
        getLogsByPeriod,
      }}
    >
      {children}
    </ActivityLogContext.Provider>
  );
}

export function useActivityLog() {
  const context = useContext(ActivityLogContext);
  if (context === undefined) {
    throw new Error("useActivityLog must be used within an ActivityLogProvider");
  }
  return context;
}
