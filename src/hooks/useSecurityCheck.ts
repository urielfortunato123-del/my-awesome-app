import { useState, useEffect } from "react";

export interface SecurityCheck {
  id: string;
  name: string;
  description: string;
  status: "secure" | "warning" | "danger" | "checking";
  details: string;
  recommendation?: string;
}

export interface SecurityScore {
  score: number;
  maxScore: number;
  percentage: number;
  level: "excellent" | "good" | "moderate" | "poor";
}

export function useSecurityCheck() {
  const [checks, setChecks] = useState<SecurityCheck[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [score, setScore] = useState<SecurityScore>({
    score: 0,
    maxScore: 100,
    percentage: 0,
    level: "moderate",
  });

  const runSecurityScan = async () => {
    setIsScanning(true);
    setChecks([]);

    const results: SecurityCheck[] = [];

    // 1. Verificar HTTPS
    await new Promise((r) => setTimeout(r, 300));
    const isHttps = window.location.protocol === "https:";
    results.push({
      id: "https",
      name: "Conexão HTTPS",
      description: "Verifica se a conexão é criptografada",
      status: isHttps ? "secure" : "danger",
      details: isHttps 
        ? "Conexão segura via HTTPS" 
        : "Conexão não criptografada (HTTP)",
      recommendation: isHttps 
        ? undefined 
        : "Use sempre sites com HTTPS para proteger seus dados",
    });
    setChecks([...results]);

    // 2. Verificar cookies de terceiros
    await new Promise((r) => setTimeout(r, 300));
    const cookiesEnabled = navigator.cookieEnabled;
    results.push({
      id: "cookies",
      name: "Cookies",
      description: "Status dos cookies do navegador",
      status: cookiesEnabled ? "secure" : "warning",
      details: cookiesEnabled 
        ? "Cookies habilitados (necessário para funcionalidades)" 
        : "Cookies desabilitados",
      recommendation: cookiesEnabled 
        ? undefined 
        : "Alguns recursos podem não funcionar sem cookies",
    });
    setChecks([...results]);

    // 3. Verificar Do Not Track
    await new Promise((r) => setTimeout(r, 300));
    const dnt = navigator.doNotTrack === "1";
    results.push({
      id: "dnt",
      name: "Do Not Track",
      description: "Preferência de não rastreamento",
      status: dnt ? "secure" : "warning",
      details: dnt 
        ? "Do Not Track está ativado" 
        : "Do Not Track está desativado",
      recommendation: dnt 
        ? undefined 
        : "Ative o Do Not Track nas configurações do navegador para mais privacidade",
    });
    setChecks([...results]);

    // 4. Verificar Service Worker
    await new Promise((r) => setTimeout(r, 300));
    const swSupported = "serviceWorker" in navigator;
    results.push({
      id: "sw",
      name: "Service Worker",
      description: "Suporte a PWA e cache offline",
      status: swSupported ? "secure" : "warning",
      details: swSupported 
        ? "Service Worker suportado e ativo" 
        : "Service Worker não suportado",
    });
    setChecks([...results]);

    // 5. Verificar Secure Context
    await new Promise((r) => setTimeout(r, 300));
    const isSecureContext = window.isSecureContext;
    results.push({
      id: "secure_context",
      name: "Contexto Seguro",
      description: "APIs de segurança disponíveis",
      status: isSecureContext ? "secure" : "danger",
      details: isSecureContext 
        ? "Contexto seguro - todas as APIs disponíveis" 
        : "Contexto inseguro - algumas APIs bloqueadas",
      recommendation: isSecureContext 
        ? undefined 
        : "Acesse via HTTPS para habilitar todas as funcionalidades",
    });
    setChecks([...results]);

    // 6. Verificar Permissões de Notificação
    await new Promise((r) => setTimeout(r, 300));
    let notifStatus: SecurityCheck["status"] = "warning";
    let notifDetails = "Não verificado";
    
    if ("Notification" in window) {
      const permission = Notification.permission;
      if (permission === "granted") {
        notifStatus = "secure";
        notifDetails = "Notificações permitidas";
      } else if (permission === "denied") {
        notifStatus = "warning";
        notifDetails = "Notificações bloqueadas";
      } else {
        notifStatus = "warning";
        notifDetails = "Permissão não solicitada";
      }
    }
    results.push({
      id: "notifications",
      name: "Notificações",
      description: "Permissão para notificações push",
      status: notifStatus,
      details: notifDetails,
    });
    setChecks([...results]);

    // 7. Verificar Geolocalização
    await new Promise((r) => setTimeout(r, 300));
    let geoStatus: SecurityCheck["status"] = "secure";
    let geoDetails = "Geolocalização não solicitada";
    
    if ("permissions" in navigator) {
      try {
        const result = await navigator.permissions.query({ name: "geolocation" });
        if (result.state === "granted") {
          geoStatus = "warning";
          geoDetails = "Localização compartilhada com sites";
        } else if (result.state === "denied") {
          geoStatus = "secure";
          geoDetails = "Localização bloqueada";
        } else {
          geoStatus = "secure";
          geoDetails = "Localização será solicitada quando necessário";
        }
      } catch (e) {
        geoDetails = "Não foi possível verificar";
      }
    }
    results.push({
      id: "geolocation",
      name: "Geolocalização",
      description: "Acesso à sua localização",
      status: geoStatus,
      details: geoDetails,
    });
    setChecks([...results]);

    // 8. Verificar Clipboard
    await new Promise((r) => setTimeout(r, 300));
    let clipStatus: SecurityCheck["status"] = "secure";
    let clipDetails = "Área de transferência protegida";
    
    if ("permissions" in navigator) {
      try {
        const result = await navigator.permissions.query({ name: "clipboard-read" as PermissionName });
        if (result.state === "granted") {
          clipStatus = "warning";
          clipDetails = "Sites podem ler sua área de transferência";
        } else {
          clipStatus = "secure";
          clipDetails = "Área de transferência protegida";
        }
      } catch (e) {
        // Clipboard API pode não estar disponível
      }
    }
    results.push({
      id: "clipboard",
      name: "Área de Transferência",
      description: "Acesso ao clipboard",
      status: clipStatus,
      details: clipDetails,
    });
    setChecks([...results]);

    // 9. Verificar WebRTC (potencial vazamento de IP)
    await new Promise((r) => setTimeout(r, 300));
    const hasWebRTC = !!(window.RTCPeerConnection || (window as any).webkitRTCPeerConnection);
    results.push({
      id: "webrtc",
      name: "WebRTC",
      description: "Comunicação em tempo real",
      status: hasWebRTC ? "warning" : "secure",
      details: hasWebRTC 
        ? "WebRTC ativo - IP pode ser exposto em chamadas" 
        : "WebRTC não disponível",
      recommendation: hasWebRTC 
        ? "Use uma VPN para proteger seu IP real" 
        : undefined,
    });
    setChecks([...results]);

    // 10. Verificar LocalStorage
    await new Promise((r) => setTimeout(r, 300));
    let storageStatus: SecurityCheck["status"] = "secure";
    let storageDetails = "Armazenamento local disponível";
    try {
      const testKey = "__storage_test__";
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      
      const itemCount = localStorage.length;
      storageDetails = `${itemCount} itens armazenados localmente`;
      storageStatus = itemCount > 20 ? "warning" : "secure";
    } catch (e) {
      storageStatus = "warning";
      storageDetails = "LocalStorage bloqueado ou cheio";
    }
    results.push({
      id: "storage",
      name: "Armazenamento Local",
      description: "Dados salvos no navegador",
      status: storageStatus,
      details: storageDetails,
    });
    setChecks([...results]);

    // Calcular pontuação
    const secureCount = results.filter((r) => r.status === "secure").length;
    const warningCount = results.filter((r) => r.status === "warning").length;
    const dangerCount = results.filter((r) => r.status === "danger").length;
    
    const calculatedScore = (secureCount * 10) + (warningCount * 5);
    const maxScore = results.length * 10;
    const percentage = Math.round((calculatedScore / maxScore) * 100);
    
    let level: SecurityScore["level"] = "moderate";
    if (percentage >= 90) level = "excellent";
    else if (percentage >= 70) level = "good";
    else if (percentage >= 50) level = "moderate";
    else level = "poor";

    setScore({ score: calculatedScore, maxScore, percentage, level });
    setIsScanning(false);
    setHasScanned(true);

    return results;
  };

  return {
    checks,
    isScanning,
    hasScanned,
    score,
    runSecurityScan,
  };
}
