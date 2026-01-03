import { useState } from "react";

export interface BenchmarkResult {
  id: string;
  name: string;
  score: number;
  maxScore: number;
  status: "excellent" | "good" | "moderate" | "poor";
  details: string;
}

export interface BenchmarkSummary {
  totalScore: number;
  maxScore: number;
  percentage: number;
  rating: string;
  timestamp: Date;
}

export function useBenchmark() {
  const [results, setResults] = useState<BenchmarkResult[]>([]);
  const [summary, setSummary] = useState<BenchmarkSummary | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTest, setCurrentTest] = useState("");

  const runBenchmark = async () => {
    setIsRunning(true);
    setResults([]);
    setProgress(0);
    const benchResults: BenchmarkResult[] = [];

    // Test 1: CPU - Cálculos matemáticos
    setCurrentTest("Testando CPU...");
    setProgress(10);
    await new Promise((r) => setTimeout(r, 200));
    
    const cpuStart = performance.now();
    let cpuResult = 0;
    for (let i = 0; i < 1000000; i++) {
      cpuResult += Math.sqrt(i) * Math.sin(i);
    }
    const cpuTime = performance.now() - cpuStart;
    
    const cpuScore = Math.max(0, Math.min(100, Math.round(1000 / cpuTime * 100)));
    benchResults.push({
      id: "cpu",
      name: "CPU (Cálculos)",
      score: cpuScore,
      maxScore: 100,
      status: cpuScore >= 80 ? "excellent" : cpuScore >= 60 ? "good" : cpuScore >= 40 ? "moderate" : "poor",
      details: `${cpuTime.toFixed(0)}ms para 1M operações`,
    });
    setResults([...benchResults]);
    setProgress(25);

    // Test 2: Memória - Alocação e acesso
    setCurrentTest("Testando Memória...");
    await new Promise((r) => setTimeout(r, 200));
    
    const memStart = performance.now();
    const testArray: number[] = [];
    for (let i = 0; i < 100000; i++) {
      testArray.push(Math.random());
    }
    testArray.sort();
    const memTime = performance.now() - memStart;
    
    const memScore = Math.max(0, Math.min(100, Math.round(500 / memTime * 100)));
    benchResults.push({
      id: "memory",
      name: "Memória (Ordenação)",
      score: memScore,
      maxScore: 100,
      status: memScore >= 80 ? "excellent" : memScore >= 60 ? "good" : memScore >= 40 ? "moderate" : "poor",
      details: `${memTime.toFixed(0)}ms para ordenar 100K itens`,
    });
    setResults([...benchResults]);
    setProgress(40);

    // Test 3: DOM - Manipulação
    setCurrentTest("Testando renderização...");
    await new Promise((r) => setTimeout(r, 200));
    
    const domStart = performance.now();
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 1000; i++) {
      const div = document.createElement("div");
      div.textContent = `Item ${i}`;
      div.style.display = "none";
      fragment.appendChild(div);
    }
    const tempContainer = document.createElement("div");
    tempContainer.appendChild(fragment);
    document.body.appendChild(tempContainer);
    document.body.removeChild(tempContainer);
    const domTime = performance.now() - domStart;
    
    const domScore = Math.max(0, Math.min(100, Math.round(100 / domTime * 100)));
    benchResults.push({
      id: "dom",
      name: "DOM (Renderização)",
      score: domScore,
      maxScore: 100,
      status: domScore >= 80 ? "excellent" : domScore >= 60 ? "good" : domScore >= 40 ? "moderate" : "poor",
      details: `${domTime.toFixed(0)}ms para 1K elementos`,
    });
    setResults([...benchResults]);
    setProgress(55);

    // Test 4: JSON - Parsing
    setCurrentTest("Testando processamento JSON...");
    await new Promise((r) => setTimeout(r, 200));
    
    const testData = Array(1000).fill(null).map((_, i) => ({
      id: i,
      name: `Item ${i}`,
      data: { nested: { value: Math.random() } },
    }));
    
    const jsonStart = performance.now();
    for (let i = 0; i < 100; i++) {
      JSON.parse(JSON.stringify(testData));
    }
    const jsonTime = performance.now() - jsonStart;
    
    const jsonScore = Math.max(0, Math.min(100, Math.round(500 / jsonTime * 100)));
    benchResults.push({
      id: "json",
      name: "JSON (Serialização)",
      score: jsonScore,
      maxScore: 100,
      status: jsonScore >= 80 ? "excellent" : jsonScore >= 60 ? "good" : jsonScore >= 40 ? "moderate" : "poor",
      details: `${jsonTime.toFixed(0)}ms para 100 ciclos`,
    });
    setResults([...benchResults]);
    setProgress(70);

    // Test 5: Canvas - Gráficos
    setCurrentTest("Testando gráficos...");
    await new Promise((r) => setTimeout(r, 200));
    
    const canvas = document.createElement("canvas");
    canvas.width = 500;
    canvas.height = 500;
    const ctx = canvas.getContext("2d");
    
    const canvasStart = performance.now();
    if (ctx) {
      for (let i = 0; i < 10000; i++) {
        ctx.fillStyle = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`;
        ctx.fillRect(
          Math.random() * 500,
          Math.random() * 500,
          10,
          10
        );
      }
    }
    const canvasTime = performance.now() - canvasStart;
    
    const canvasScore = Math.max(0, Math.min(100, Math.round(200 / canvasTime * 100)));
    benchResults.push({
      id: "canvas",
      name: "Canvas (Gráficos)",
      score: canvasScore,
      maxScore: 100,
      status: canvasScore >= 80 ? "excellent" : canvasScore >= 60 ? "good" : canvasScore >= 40 ? "moderate" : "poor",
      details: `${canvasTime.toFixed(0)}ms para 10K retângulos`,
    });
    setResults([...benchResults]);
    setProgress(85);

    // Test 6: Crypto - Hashing
    setCurrentTest("Testando criptografia...");
    await new Promise((r) => setTimeout(r, 200));
    
    const cryptoStart = performance.now();
    const encoder = new TextEncoder();
    for (let i = 0; i < 100; i++) {
      const data = encoder.encode(`Test data ${i} ${Math.random()}`);
      await crypto.subtle.digest("SHA-256", data);
    }
    const cryptoTime = performance.now() - cryptoStart;
    
    const cryptoScore = Math.max(0, Math.min(100, Math.round(200 / cryptoTime * 100)));
    benchResults.push({
      id: "crypto",
      name: "Crypto (SHA-256)",
      score: cryptoScore,
      maxScore: 100,
      status: cryptoScore >= 80 ? "excellent" : cryptoScore >= 60 ? "good" : cryptoScore >= 40 ? "moderate" : "poor",
      details: `${cryptoTime.toFixed(0)}ms para 100 hashes`,
    });
    setResults([...benchResults]);
    setProgress(100);

    // Calcular resumo
    const totalScore = benchResults.reduce((sum, r) => sum + r.score, 0);
    const maxScore = benchResults.length * 100;
    const percentage = Math.round((totalScore / maxScore) * 100);
    
    let rating = "Básico";
    if (percentage >= 85) rating = "Excelente";
    else if (percentage >= 70) rating = "Muito Bom";
    else if (percentage >= 55) rating = "Bom";
    else if (percentage >= 40) rating = "Moderado";

    setSummary({
      totalScore,
      maxScore,
      percentage,
      rating,
      timestamp: new Date(),
    });

    setCurrentTest("");
    setIsRunning(false);

    return { results: benchResults, summary: { totalScore, maxScore, percentage, rating } };
  };

  return {
    results,
    summary,
    isRunning,
    progress,
    currentTest,
    runBenchmark,
  };
}
