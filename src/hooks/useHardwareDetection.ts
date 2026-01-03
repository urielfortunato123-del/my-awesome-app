import { useState, useEffect } from "react";

interface HardwareInfo {
  cpu: { name: string; cores: number; architecture: string };
  memory: { total: string; used: number };
  storage: { used: string; total: string; percentage: number };
  display: { resolution: string; colorDepth: number; pixelRatio: number; orientation: string };
  network: { status: string; type: string; downlink?: number };
  battery: { status: string; level: number; charging: boolean };
  os: string;
  osVersion: string;
  isMobile: boolean;
  deviceType: string;
  deviceModel: string;
  manufacturer: string;
  browser: string;
  browserVersion: string;
  browserEngine: string;
  language: string;
  platform: string;
  kernelVersion: string;
  webGLRenderer: string;
  touchSupport: boolean;
  maxTouchPoints: number;
  timezone: string;
  screenType: string;
}

// Database expandido de fabricantes - cobre todos os dispositivos conhecidos
const manufacturerDatabase: Record<string, string> = {
  // Samsung (modelos completos)
  'sm-s9': 'Samsung', 'sm-s8': 'Samsung', 'sm-s7': 'Samsung',
  'sm-g9': 'Samsung', 'sm-g8': 'Samsung', 'sm-g7': 'Samsung',
  'sm-a': 'Samsung', 'sm-m': 'Samsung', 'sm-f': 'Samsung', 'sm-n': 'Samsung',
  'sm-t': 'Samsung', 'sm-x': 'Samsung', 'sm-p': 'Samsung',
  'gt-': 'Samsung', 'sch-': 'Samsung', 'sgh-': 'Samsung', 'sph-': 'Samsung',
  'samsung': 'Samsung', 'galaxy': 'Samsung',
  
  // Google
  'pixel': 'Google', 'nexus': 'Google',
  
  // Xiaomi / Redmi / POCO
  'redmi': 'Xiaomi', 'xiaomi': 'Xiaomi', 'mi ': 'Xiaomi', 'miui': 'Xiaomi',
  'poco': 'POCO', 'pocophone': 'POCO',
  '2201': 'Xiaomi', '2203': 'Xiaomi', '2206': 'Xiaomi', '2210': 'Xiaomi',
  '2211': 'Xiaomi', '2304': 'Xiaomi', '2311': 'Xiaomi', '2312': 'Xiaomi',
  '21': 'Xiaomi', '22': 'Xiaomi', '23': 'Xiaomi', '24': 'Xiaomi',
  'm2': 'Xiaomi',
  
  // OnePlus
  'oneplus': 'OnePlus', 'one plus': 'OnePlus',
  'kb2': 'OnePlus', 'le2': 'OnePlus', 'ne2': 'OnePlus', 'cph23': 'OnePlus',
  'in2': 'OnePlus', 'gm1': 'OnePlus', 'hd1': 'OnePlus',
  
  // OPPO
  'oppo': 'OPPO', 'cph': 'OPPO', 'pch': 'OPPO', 'pbm': 'OPPO',
  'pam': 'OPPO', 'pem': 'OPPO', 'pfm': 'OPPO', 'pgm': 'OPPO',
  'find x': 'OPPO', 'reno': 'OPPO',
  
  // Realme
  'realme': 'Realme', 'rmx': 'Realme',
  
  // Vivo
  'vivo': 'Vivo', 'v19': 'Vivo', 'v20': 'Vivo', 'v21': 'Vivo', 'v23': 'Vivo',
  'y': 'Vivo', 'x50': 'Vivo', 'x60': 'Vivo', 'x70': 'Vivo', 'x80': 'Vivo',
  'iqoo': 'Vivo iQOO',
  
  // Huawei
  'huawei': 'Huawei', 'hw-': 'Huawei', 'hma-': 'Huawei', 'els-': 'Huawei',
  'ana-': 'Huawei', 'nop-': 'Huawei', 'bla-': 'Huawei', 'clt-': 'Huawei',
  'p30': 'Huawei', 'p40': 'Huawei', 'p50': 'Huawei', 'mate': 'Huawei',
  
  // Honor
  'honor': 'Honor', 'pgt-': 'Honor', 'nth-': 'Honor', 'any-': 'Honor',
  
  // Motorola
  'motorola': 'Motorola', 'moto': 'Motorola', 'xt': 'Motorola',
  'razr': 'Motorola', 'edge': 'Motorola',
  
  // LG
  'lg-': 'LG', 'lg ': 'LG', 'lm-': 'LG', 'lgl': 'LG',
  
  // Sony
  'sony': 'Sony', 'xperia': 'Sony', 'xq-': 'Sony', 'so-': 'Sony',
  
  // ASUS
  'asus': 'ASUS', 'zenfone': 'ASUS', 'rog phone': 'ASUS ROG',
  'asus_': 'ASUS', 'ai2': 'ASUS',
  
  // Nokia
  'nokia': 'Nokia', 'ta-': 'Nokia',
  
  // HTC
  'htc': 'HTC', 'desire': 'HTC', 'htc_': 'HTC',
  
  // Lenovo
  'lenovo': 'Lenovo', 'tab': 'Lenovo', 'tb-': 'Lenovo', 'yt3-': 'Lenovo',
  'legion': 'Lenovo Legion',
  
  // ZTE / Nubia
  'zte': 'ZTE', 'nubia': 'ZTE Nubia', 'nx': 'ZTE Nubia', 'zte blade': 'ZTE',
  
  // Alcatel / TCL
  'tcl': 'TCL', 'alcatel': 'Alcatel', '60': 'TCL',
  
  // Infinix / Tecno / itel (Transsion)
  'infinix': 'Infinix', 'tecno': 'Tecno', 'itel': 'itel',
  'hot': 'Infinix', 'spark': 'Tecno', 'camon': 'Tecno', 'phantom': 'Tecno',
  
  // Nothing
  'nothing': 'Nothing', 'a063': 'Nothing',
  
  // Black Shark (gaming)
  'black shark': 'Black Shark', 'shark': 'Black Shark',
  
  // Meizu
  'meizu': 'Meizu', 'm6': 'Meizu', 'm8': 'Meizu',
  
  // Apple
  'iphone': 'Apple', 'ipad': 'Apple', 'ipod': 'Apple',
  'macbook': 'Apple', 'imac': 'Apple', 'mac pro': 'Apple', 'mac mini': 'Apple',
  'macintosh': 'Apple', 'mac': 'Apple',
  
  // Microsoft
  'surface': 'Microsoft', 'xbox': 'Microsoft',
  
  // Desktop/Laptop fabricantes
  'dell': 'Dell', 'inspiron': 'Dell', 'latitude': 'Dell', 'xps': 'Dell', 'alienware': 'Dell Alienware',
  'hp': 'HP', 'pavilion': 'HP', 'envy': 'HP', 'elitebook': 'HP', 'probook': 'HP', 'omen': 'HP Omen',
  'acer': 'Acer', 'aspire': 'Acer', 'nitro': 'Acer', 'predator': 'Acer Predator', 'swift': 'Acer',
  'thinkpad': 'Lenovo ThinkPad', 'ideapad': 'Lenovo IdeaPad', 'yoga': 'Lenovo Yoga',
  'vaio': 'Sony VAIO',
  'toshiba': 'Toshiba', 'dynabook': 'Dynabook',
  'msi': 'MSI', 'razer': 'Razer', 'blade': 'Razer',
  'gigabyte': 'GIGABYTE', 'aorus': 'GIGABYTE AORUS',
  'huawei matebook': 'Huawei',
  'samsung galaxy book': 'Samsung',
  'chromebook': 'Chromebook',
};

// Prefixos de código de modelo por fabricante
const modelPrefixes: Record<string, string> = {
  'SM': 'Samsung', 'GT': 'Samsung', 'SCH': 'Samsung', 'SGH': 'Samsung', 'SPH': 'Samsung',
  'LM': 'LG', 'LGL': 'LG', 'VS': 'LG',
  'XT': 'Motorola', 'MOTO': 'Motorola',
  'RMX': 'Realme',
  'CPH': 'OPPO', 'PCH': 'OPPO', 'PBM': 'OPPO',
  'V': 'Vivo', 'PD': 'Vivo',
  'M2': 'Xiaomi', 'MI': 'Xiaomi',
  'IN': 'OnePlus', 'NE': 'OnePlus', 'LE': 'OnePlus', 'KB': 'OnePlus',
  'TA': 'Nokia',
  'XQ': 'Sony', 'SO': 'Sony',
  'HMA': 'Huawei', 'ELS': 'Huawei', 'ANA': 'Huawei', 'CLT': 'Huawei', 'VOG': 'Huawei',
  'PGT': 'Honor', 'NTH': 'Honor', 'ANY': 'Honor',
  'AI': 'ASUS', 'ZS': 'ASUS',
  'NX': 'ZTE Nubia',
  'INFINIX': 'Infinix', 'TECNO': 'Tecno',
  'A0': 'Nothing',
  'PIXEL': 'Google',
};

// Detectar fabricante pelo modelo - sistema universal
function detectManufacturer(model: string, os: string, userAgent: string = ''): string {
  const modelLower = model.toLowerCase();
  const uaLower = userAgent.toLowerCase();
  
  // Apple devices - detectar pelo OS primeiro
  if (os === 'iOS' || os === 'iPadOS' || os === 'macOS') {
    return 'Apple';
  }
  
  // 1. Buscar correspondência direta no database (mais específico primeiro)
  // Ordenar por comprimento da chave (mais longo primeiro para match mais específico)
  const sortedKeys = Object.keys(manufacturerDatabase).sort((a, b) => b.length - a.length);
  
  for (const key of sortedKeys) {
    if (modelLower.includes(key) || uaLower.includes(key)) {
      return manufacturerDatabase[key];
    }
  }
  
  // 2. Verificar prefixos de código de modelo
  const modelUpper = model.toUpperCase().replace(/[^A-Z0-9]/g, '');
  
  for (const [prefix, manufacturer] of Object.entries(modelPrefixes)) {
    if (modelUpper.startsWith(prefix)) {
      return manufacturer;
    }
  }
  
  // 3. Tentar extrair do User-Agent diretamente para Android
  if (os === 'Android' || /android/i.test(userAgent)) {
    // Padrão comum: "Build/XXXX" precedido pelo modelo
    const buildMatch = userAgent.match(/;\s*([^;)]+)\s*Build/i);
    if (buildMatch) {
      const extractedModel = buildMatch[1].trim().toLowerCase();
      
      for (const key of sortedKeys) {
        if (extractedModel.includes(key)) {
          return manufacturerDatabase[key];
        }
      }
    }
  }
  
  // 4. Análise heurística baseada em padrões comuns
  // Samsung: SM-XXXX, GT-XXXX
  if (/^sm-/i.test(model) || /^gt-/i.test(model)) return 'Samsung';
  
  // Xiaomi: geralmente começa com números como 2201, 2203, etc
  if (/^2[0-4]\d{2}/i.test(model)) return 'Xiaomi';
  
  // Realme: RMX
  if (/^rmx/i.test(model)) return 'Realme';
  
  // OPPO: CPH, PCH
  if (/^cph|^pch/i.test(model)) return 'OPPO';
  
  // Motorola: XT, moto
  if (/^xt|moto/i.test(model)) return 'Motorola';
  
  // 5. Detectar por WebGL renderer (GPUs específicas de fabricantes)
  const webGLRenderer = getWebGLRendererForManufacturer();
  if (webGLRenderer) {
    if (/adreno/i.test(webGLRenderer)) {
      // Adreno é usado por muitos, mas ajuda a confirmar Android
      if (/mali/i.test(webGLRenderer)) return 'Samsung'; // Samsung usa Mali frequentemente
    }
    if (/apple/i.test(webGLRenderer)) return 'Apple';
    if (/intel/i.test(webGLRenderer) || /nvidia/i.test(webGLRenderer) || /amd|radeon/i.test(webGLRenderer)) {
      // Desktop - tentar identificar pelo User-Agent
      if (/dell/i.test(uaLower)) return 'Dell';
      if (/hp|hewlett/i.test(uaLower)) return 'HP';
      if (/lenovo|thinkpad/i.test(uaLower)) return 'Lenovo';
      if (/asus/i.test(uaLower)) return 'ASUS';
      if (/acer/i.test(uaLower)) return 'Acer';
      if (/msi/i.test(uaLower)) return 'MSI';
    }
  }
  
  // 6. Para desktops/notebooks, tentar detectar por características
  if (!(/android|iphone|ipad|mobile/i.test(userAgent))) {
    if (/windows/i.test(userAgent)) {
      return 'PC (Windows)';
    }
    if (/linux/i.test(userAgent) && !/android/i.test(userAgent)) {
      return 'PC (Linux)';
    }
  }
  
  return 'Dispositivo';
}

// Helper para obter WebGL renderer para detecção de fabricante
function getWebGLRendererForManufacturer(): string {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        return (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '';
      }
    }
  } catch (e) {}
  return '';
}

// Parse user agent para extrair informações detalhadas
function parseUserAgent(ua: string): { 
  os: string; 
  osVersion: string; 
  deviceModel: string; 
  browser: string; 
  browserVersion: string;
  browserEngine: string;
  isMobile: boolean;
  deviceType: string;
  kernelVersion: string;
} {
  let os = "Desconhecido";
  let osVersion = "";
  let deviceModel = "Dispositivo";
  let browser = "Navegador";
  let browserVersion = "";
  let browserEngine = "Desconhecido";
  let isMobile = false;
  let deviceType = "Computador";
  let kernelVersion = "";

  // Detectar dispositivos móveis primeiro
  isMobile = /mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua);

  // Detectar engine do navegador
  if (/webkit/i.test(ua)) {
    browserEngine = "WebKit";
    const match = ua.match(/applewebkit\/(\d+\.?\d*)/i);
    if (match) browserEngine = `WebKit/${match[1]}`;
  } else if (/gecko/i.test(ua)) {
    browserEngine = "Gecko";
    const match = ua.match(/gecko\/(\d+)/i);
    if (match) browserEngine = `Gecko/${match[1]}`;
  } else if (/trident/i.test(ua)) {
    browserEngine = "Trident";
  } else if (/presto/i.test(ua)) {
    browserEngine = "Presto";
  }

  // Detectar OS e versão
  if (/android/i.test(ua)) {
    os = "Android";
    // Múltiplos padrões para detectar versão do Android (incluindo Android 16+)
    let versionMatch = ua.match(/android\s+(\d+(?:\.\d+)*)/i);
    if (!versionMatch) {
      // Padrão alternativo: "Android/16" ou similar
      versionMatch = ua.match(/android[\/\s]+(\d+(?:\.\d+)*)/i);
    }
    if (!versionMatch) {
      // Tentar encontrar versão após "Linux; Android"
      versionMatch = ua.match(/linux;\s*android\s+(\d+(?:\.\d+)*)/i);
    }
    osVersion = versionMatch ? versionMatch[1] : "";
    isMobile = true;
    
    // Extrair versão do kernel Linux - múltiplos padrões
    let kernelMatch = ua.match(/linux;\s*[^;]*?(\d+\.\d+\.\d+[^\s;)]*)/i);
    if (!kernelMatch) {
      kernelMatch = ua.match(/linux\s*(\d+\.\d+[^\s;)]*)/i);
    }
    if (kernelMatch) {
      kernelVersion = `Linux ${kernelMatch[1]}`;
    } else {
      kernelVersion = "Linux (versão não disponível)";
    }
    
    // Detectar modelo do dispositivo Android - sistema robusto
    let model = "";
    
    // Múltiplos padrões para extrair modelo
    const patterns = [
      /;\s*([^;)]+)\s*Build\//i,                    // Padrão principal: "Model Build/"
      /;\s*([^;)]+)\s*\)\s*AppleWebKit/i,           // Antes de AppleWebKit
      /Android\s+[\d.]+;\s*([^;)]+?)(?:\)|;|Build)/i, // Após versão Android
      /;\s*([A-Z]{2,3}[0-9]{2,}[A-Za-z0-9-]*)/i,    // Códigos como SM-G960, RMX3085
      /;\s*((?:SM|GT|LM|XT|RMX|CPH|V|M2|IN|TA|XQ|HMA|PGT)-?[A-Z0-9]+)/i, // Códigos específicos
    ];
    
    for (const pattern of patterns) {
      const match = ua.match(pattern);
      if (match && match[1]) {
        model = match[1].trim();
        // Validar se parece um modelo válido (não é genérico demais)
        if (model.length > 2 && !/^(linux|android|mobile|en-|wv)/i.test(model)) {
          break;
        }
        model = "";
      }
    }
    
    // Limpar modelo
    if (model) {
      model = model
        .replace(/Build\/.*/i, '')
        .replace(/MIUI\/.*/i, '')
        .replace(/\s+/g, ' ')
        .replace(/^\s*;\s*/, '')
        .trim();
      
      // Formatar códigos de modelo para legibilidade
      if (/^sm-/i.test(model)) {
        deviceModel = model.toUpperCase();
      } else {
        deviceModel = model;
      }
    }
    
    deviceType = /mobile/i.test(ua) ? "Smartphone Android" : "Tablet Android";
    
  } else if (/iphone/i.test(ua)) {
    os = "iOS";
    const match = ua.match(/os\s+(\d+[_\d]*)/i);
    osVersion = match ? match[1].replace(/_/g, '.') : "";
    deviceModel = "iPhone";
    isMobile = true;
    deviceType = "iPhone";
    kernelVersion = `Darwin/XNU (iOS ${osVersion})`;
    
    // Tentar detectar modelo específico do iPhone pelo tamanho da tela
    const screenHeight = window.screen.height;
    const screenWidth = window.screen.width;
    const ratio = window.devicePixelRatio;
    
    if (screenHeight === 926 || screenWidth === 926) deviceModel = "iPhone 12/13/14 Pro Max";
    else if (screenHeight === 896 || screenWidth === 896) deviceModel = "iPhone 11 Pro Max/XS Max";
    else if (screenHeight === 844 || screenWidth === 844) deviceModel = "iPhone 12/13/14";
    else if (screenHeight === 812 || screenWidth === 812) deviceModel = "iPhone X/XS/11 Pro";
    else if (screenHeight === 736 || screenWidth === 736) deviceModel = "iPhone 6/7/8 Plus";
    else if (screenHeight === 667 || screenWidth === 667) deviceModel = "iPhone 6/7/8/SE";
    else if (screenHeight === 568 || screenWidth === 568) deviceModel = "iPhone 5/5S/SE";
    
  } else if (/ipad/i.test(ua)) {
    os = "iPadOS";
    const match = ua.match(/os\s+(\d+[_\d]*)/i);
    osVersion = match ? match[1].replace(/_/g, '.') : "";
    deviceModel = "iPad";
    isMobile = true;
    deviceType = "iPad";
    kernelVersion = `Darwin/XNU (iPadOS ${osVersion})`;
    
  } else if (/macintosh|mac os x/i.test(ua)) {
    os = "macOS";
    const match = ua.match(/mac os x\s+(\d+[_\d\.]*)/i);
    osVersion = match ? match[1].replace(/_/g, '.') : "";
    kernelVersion = `Darwin/XNU (macOS ${osVersion})`;
    
    // Detectar tipo de Mac
    if (window.screen.width <= 1440) {
      deviceModel = "MacBook";
    } else {
      deviceModel = "Mac";
    }
    deviceType = "Mac";
    
  } else if (/windows nt/i.test(ua)) {
    os = "Windows";
    const match = ua.match(/windows nt\s+(\d+\.?\d*)/i);
    if (match) {
      const ntVersion = match[1];
      const versionMap: Record<string, string> = {
        '10.0': '10/11',
        '6.3': '8.1',
        '6.2': '8',
        '6.1': '7',
        '6.0': 'Vista',
        '5.1': 'XP'
      };
      osVersion = versionMap[ntVersion] || ntVersion;
    }
    kernelVersion = `NT Kernel ${osVersion}`;
    deviceModel = "PC Windows";
    deviceType = "Computador Windows";
    
  } else if (/linux/i.test(ua)) {
    os = "Linux";
    
    // Detectar distro
    if (/ubuntu/i.test(ua)) {
      osVersion = "Ubuntu";
      deviceModel = "PC Ubuntu";
    } else if (/fedora/i.test(ua)) {
      osVersion = "Fedora";
      deviceModel = "PC Fedora";
    } else if (/debian/i.test(ua)) {
      osVersion = "Debian";
      deviceModel = "PC Debian";
    } else if (/arch/i.test(ua)) {
      osVersion = "Arch Linux";
      deviceModel = "PC Arch";
    } else if (/mint/i.test(ua)) {
      osVersion = "Linux Mint";
      deviceModel = "PC Mint";
    } else {
      deviceModel = "PC Linux";
    }
    
    // Extrair versão do kernel
    const kernelMatch = ua.match(/linux\s+([xi]\d+[_-]?\d*)/i);
    if (kernelMatch) {
      kernelVersion = `Linux ${kernelMatch[1]}`;
    } else {
      kernelVersion = "Linux Kernel";
    }
    
    deviceType = "Computador Linux";
    
  } else if (/cros/i.test(ua)) {
    os = "Chrome OS";
    deviceModel = "Chromebook";
    deviceType = "Chromebook";
    kernelVersion = "Linux (Chrome OS)";
  }

  // Detectar navegador e versão
  if (/edg/i.test(ua)) {
    browser = "Microsoft Edge";
    const match = ua.match(/edg\/(\d+\.?\d*\.?\d*)/i);
    browserVersion = match ? match[1] : "";
  } else if (/chrome/i.test(ua) && !/chromium/i.test(ua)) {
    browser = "Google Chrome";
    const match = ua.match(/chrome\/(\d+\.?\d*\.?\d*)/i);
    browserVersion = match ? match[1] : "";
  } else if (/firefox/i.test(ua)) {
    browser = "Mozilla Firefox";
    const match = ua.match(/firefox\/(\d+\.?\d*)/i);
    browserVersion = match ? match[1] : "";
  } else if (/safari/i.test(ua) && !/chrome/i.test(ua)) {
    browser = "Safari";
    const match = ua.match(/version\/(\d+\.?\d*\.?\d*)/i);
    browserVersion = match ? match[1] : "";
  } else if (/opera|opr/i.test(ua)) {
    browser = "Opera";
    const match = ua.match(/(?:opera|opr)\/(\d+\.?\d*)/i);
    browserVersion = match ? match[1] : "";
  } else if (/samsungbrowser/i.test(ua)) {
    browser = "Samsung Internet";
    const match = ua.match(/samsungbrowser\/(\d+\.?\d*)/i);
    browserVersion = match ? match[1] : "";
  } else if (/ucbrowser/i.test(ua)) {
    browser = "UC Browser";
    const match = ua.match(/ucbrowser\/(\d+\.?\d*)/i);
    browserVersion = match ? match[1] : "";
  } else if (/brave/i.test(ua)) {
    browser = "Brave";
    const match = ua.match(/brave\/(\d+\.?\d*)/i);
    browserVersion = match ? match[1] : "";
  } else if (/vivaldi/i.test(ua)) {
    browser = "Vivaldi";
    const match = ua.match(/vivaldi\/(\d+\.?\d*)/i);
    browserVersion = match ? match[1] : "";
  }

  return { os, osVersion, deviceModel, browser, browserVersion, browserEngine, isMobile, deviceType, kernelVersion };
}

// Detectar GPU via WebGL
function getWebGLRenderer(): string {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        return renderer || "GPU Desconhecida";
      }
    }
  } catch (e) {
    console.log("WebGL não disponível");
  }
  return "GPU (WebGL não disponível)";
}

// Detectar arquitetura do processador
function getCPUArchitecture(): string {
  const platform = navigator.platform?.toLowerCase() || '';
  const ua = navigator.userAgent.toLowerCase();
  
  if (/arm64|aarch64/i.test(ua)) return "ARM64";
  if (/arm/i.test(ua)) return "ARM";
  if (/x64|x86_64|amd64|win64/i.test(ua) || platform.includes('x64') || platform.includes('amd64')) return "x86_64 (64-bit)";
  if (/ia32|x86|i[3-6]86/i.test(ua) || platform.includes('x86') || platform.includes('i686')) return "x86 (32-bit)";
  if (/ppc|powerpc/i.test(ua)) return "PowerPC";
  if (/mips/i.test(ua)) return "MIPS";
  
  // Tentar detectar por características
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency >= 8) {
    return "Multi-Core (arquitetura desconhecida)";
  }
  
  return "Arquitetura Desconhecida";
}

export function useHardwareDetection() {
  const [hardware, setHardware] = useState<HardwareInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const detectHardware = async () => {
      try {
        const ua = navigator.userAgent;
        const parsed = parseUserAgent(ua);
        const manufacturer = detectManufacturer(parsed.deviceModel, parsed.os, ua);
        const webGLRenderer = getWebGLRenderer();
        const cpuArchitecture = getCPUArchitecture();

        // CPU info
        const cores = navigator.hardwareConcurrency || 0;
        let cpuName = "Processador";
        if (parsed.isMobile) {
          if (cores >= 8) cpuName = "Octa-Core Mobile";
          else if (cores >= 6) cpuName = "Hexa-Core Mobile";
          else if (cores >= 4) cpuName = "Quad-Core Mobile";
          else if (cores >= 2) cpuName = "Dual-Core Mobile";
          else cpuName = "Processador Mobile";
        } else {
          if (cores >= 16) cpuName = "Multi-Core Desktop";
          else if (cores >= 8) cpuName = "Octa-Core Desktop";
          else if (cores >= 4) cpuName = "Quad-Core Desktop";
          else if (cores >= 2) cpuName = "Dual-Core Desktop";
        }

        // Memory info
        const deviceMemory = (navigator as any).deviceMemory;
        let memoryTotal = "Não disponível";
        if (deviceMemory) {
          memoryTotal = `${deviceMemory} GB`;
        }

        // Storage info
        let storageUsed = "Calculando...";
        let storageTotal = "Calculando...";
        let storagePercentage = 0;
        
        if ('storage' in navigator && 'estimate' in navigator.storage) {
          const estimate = await navigator.storage.estimate();
          if (estimate.usage !== undefined && estimate.quota) {
            const usedMB = estimate.usage / (1024 * 1024);
            const totalGB = estimate.quota / (1024 * 1024 * 1024);
            
            if (usedMB < 1024) {
              storageUsed = `${usedMB.toFixed(1)} MB`;
            } else {
              storageUsed = `${(usedMB / 1024).toFixed(2)} GB`;
            }
            storageTotal = `${totalGB.toFixed(1)} GB`;
            storagePercentage = Math.round((estimate.usage / estimate.quota) * 100);
          }
        }

        // Display info
        const resolution = `${window.screen.width}x${window.screen.height}`;
        const colorDepth = window.screen.colorDepth || 24;
        const pixelRatio = window.devicePixelRatio || 1;
        const orientation = window.screen.orientation?.type || 
          (window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
        
        // Determinar tipo de tela
        let screenType = "LCD";
        if (colorDepth >= 30) screenType = "HDR Display";
        else if (pixelRatio >= 3) screenType = "Retina/AMOLED";
        else if (pixelRatio >= 2) screenType = "High DPI";

        // Network info
        const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
        let networkStatus = navigator.onLine ? "Conectado" : "Desconectado";
        let networkType = "Rede";
        let downlink: number | undefined;
        
        if (connection) {
          downlink = connection.downlink;
          const effectiveType = connection.effectiveType?.toUpperCase();
          
          if (connection.type === 'wifi') {
            networkType = "Wi-Fi";
          } else if (connection.type === 'cellular') {
            networkType = effectiveType ? `${effectiveType} Móvel` : "Dados Móveis";
          } else if (connection.type === 'ethernet') {
            networkType = "Ethernet";
          } else if (effectiveType) {
            networkType = effectiveType;
          }
        }

        // Touch support
        const touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const maxTouchPoints = navigator.maxTouchPoints || 0;

        // Timezone
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        // Battery info
        let batteryStatus = "Sem bateria";
        let batteryLevel = 100;
        let batteryCharging = false;

        if ('getBattery' in navigator) {
          try {
            const battery: any = await (navigator as any).getBattery();
            batteryLevel = Math.round(battery.level * 100);
            batteryCharging = battery.charging;
            
            if (batteryCharging && batteryLevel === 100) {
              batteryStatus = "Carregado (AC)";
            } else if (batteryCharging) {
              batteryStatus = `Carregando (${batteryLevel}%)`;
            } else {
              batteryStatus = `${batteryLevel}%`;
            }

            // Listeners
            battery.addEventListener('chargingchange', () => {
              setHardware(prev => prev ? {
                ...prev,
                battery: {
                  ...prev.battery,
                  charging: battery.charging,
                  status: battery.charging 
                    ? `Carregando (${Math.round(battery.level * 100)}%)`
                    : `${Math.round(battery.level * 100)}%`
                }
              } : null);
            });

            battery.addEventListener('levelchange', () => {
              const level = Math.round(battery.level * 100);
              setHardware(prev => prev ? {
                ...prev,
                battery: {
                  ...prev.battery,
                  level,
                  status: battery.charging 
                    ? level === 100 ? "Carregado (AC)" : `Carregando (${level}%)`
                    : `${level}%`
                }
              } : null);
            });
          } catch (e) {
            console.log("Battery API não disponível");
          }
        }

        setHardware({
          cpu: { name: cpuName, cores, architecture: cpuArchitecture },
          memory: { total: memoryTotal, used: 0 },
          storage: { used: storageUsed, total: storageTotal, percentage: storagePercentage },
          display: { resolution, colorDepth, pixelRatio, orientation },
          network: { status: networkStatus, type: networkType, downlink },
          battery: { status: batteryStatus, level: batteryLevel, charging: batteryCharging },
          os: parsed.os,
          osVersion: parsed.osVersion,
          isMobile: parsed.isMobile,
          deviceType: parsed.deviceType,
          deviceModel: parsed.deviceModel,
          manufacturer,
          browser: parsed.browser,
          browserVersion: parsed.browserVersion,
          browserEngine: parsed.browserEngine,
          language: navigator.language,
          platform: navigator.platform || "Desconhecido",
          kernelVersion: parsed.kernelVersion,
          webGLRenderer,
          touchSupport,
          maxTouchPoints,
          timezone,
          screenType
        });
      } catch (error) {
        console.error("Erro ao detectar hardware:", error);
      } finally {
        setIsLoading(false);
      }
    };

    detectHardware();

    // Listeners de rede
    const handleOnline = () => {
      setHardware(prev => prev ? { ...prev, network: { ...prev.network, status: "Conectado" } } : null);
    };
    const handleOffline = () => {
      setHardware(prev => prev ? { ...prev, network: { ...prev.network, status: "Desconectado" } } : null);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { hardware, isLoading };
}
