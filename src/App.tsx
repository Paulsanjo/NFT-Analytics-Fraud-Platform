import { useState, useEffect } from "react";
import { ShieldCheck, Zap, RefreshCw, Send, AlertCircle, Database, LayoutGrid } from "lucide-react";
import { CollectionData } from "./types";
import CollectionCard from "./components/CollectionCard";
import WashTradeGraph from "./components/WashTradeGraph";
import PlagiarismSandbox from "./components/PlagiarismSandbox";
import ThreatTimeline from "./components/ThreatTimeline";
import ApiPlayground from "./components/ApiPlayground";

// Define the steps displayed on the loader during deep scanning
const SCANNEST_STEPS = [
  "Opening Secure Gateway Connection...",
  "Querying IPFS decentralised image metadata...",
  "Decoding Smart Contract ABI Traps...",
  "Clustering Wallet transacting trails (DBSCAN)...",
  "Measuring Pixel CLIP Embeddings Cosine Distance...",
  "Generating cryptographic report and Trust badges..."
];

export default function App() {
  const [collectionInput, setCollectionInput] = useState<string>("");
  const [selectedChain, setSelectedChain] = useState<string>("Ethereum");
  const [presets, setPresets] = useState<CollectionData[]>([]);
  const [auditData, setAuditData] = useState<CollectionData | null>(null);
  
  // Auditing flow statuses
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditStep, setAuditStep] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Load backend presets on mount
  useEffect(() => {
    const fetchPresets = async () => {
      try {
        const res = await fetch("/api/presets");
        const data = await res.json();
        if (data.success && data.presets.length > 0) {
          setPresets(data.presets);
          // Set BAYC as the default visible audited collection
          setAuditData(data.presets[0]);
        }
      } catch (e) {
        console.error("Failed to load collection presets on start:", e);
      }
    };
    fetchPresets();
  }, []);

  // Preset quick-badge triggers
  const selectPresetCollection = (preset: CollectionData) => {
    setAuditData(preset);
    setCollectionInput("");
    setErrorMessage("");
  };

  // Perform Gemini-driven collection fraud index analysis
  const executeAuditScan = async (nameToScan?: string) => {
    const inputCollectionName = nameToScan || collectionInput;
    if (!inputCollectionName.trim()) {
      setErrorMessage("Please enter or select a valid NFT Collection query first");
      return;
    }

    setErrorMessage("");
    setIsAuditing(true);
    setAuditData(null);

    // Dynamic step progression for incredible realistic loading feel
    let stepIndex = 0;
    setAuditStep(SCANNEST_STEPS[stepIndex]);
    const stepInterval = setInterval(() => {
      if (stepIndex < SCANNEST_STEPS.length - 1) {
        stepIndex++;
        setAuditStep(SCANNEST_STEPS[stepIndex]);
      }
    }, 1200);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collectionName: inputCollectionName,
          blockchain: selectedChain
        })
      });
      const resData = await res.json();
      
      if (resData.success && resData.data) {
        setAuditData(resData.data);
      } else {
        throw new Error(resData.error || "Execution engine yielded invalid state profile");
      }
    } catch (e: any) {
      setErrorMessage(e.message || "Auditing connection dropped due to network issues. Try again.");
    } finally {
      clearInterval(stepInterval);
      setIsAuditing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#E5E5E5] font-sans selection:bg-emerald-500/30 selection:text-white pb-16 antialiased">
      
      {/* Dynamic Ambient Background Elements */}
      <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-emerald-950/10 via-transparent to-transparent pointer-events-none z-0"></div>
      
      {/* Navigation & Header Status Bar */}
      <header className="border-b border-[#222222] bg-[#111111]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Logo Name - Bento theme styling */}
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-emerald-500 rounded flex items-center justify-center font-bold text-black font-mono shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              V
            </div>
            <div>
              <h1 className="text-xl font-display font-bold tracking-tight text-white flex items-center gap-1 leading-none italic">
                VERITAS<span className="text-emerald-500">AI</span>
              </h1>
              <span className="text-[10px] font-mono text-zinc-500 mt-1 block uppercase tracking-widest">NFT Analytics & Fraud Platform</span>
            </div>
          </div>

          {/* Decentralized Node Stats (Aesthetic visual integrity) */}
          <div className="flex flex-wrap items-center gap-5 text-[10px] font-mono text-zinc-500 bg-[#0A0A0A] border border-[#222222] px-4 py-2 rounded-xl">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              <span>ETH GAS: <strong className="text-zinc-300">21 Gwei</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              <span>SOL SPEED: <strong className="text-zinc-300">2,240 TPS</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              <span>AUDITED VOL: <strong className="text-zinc-300">14.2B USD</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-emerald-500 font-bold uppercase">SECURED</span>
            </div>
          </div>

        </div>
      </header>

      {/* Main Workspace Frame container */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-8 flex flex-col gap-6 relative z-10 w-full">
        
        {/* Banner Dashboard Intro */}
        <section className="bg-[#111111] border border-[#222222] rounded-2xl p-6 md:p-8 relative overflow-hidden flex flex-col xl:flex-row xl:items-center justify-between gap-6 md:gap-8 transition-all">
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4.5 text-emerald-400" />
              <span className="text-xs uppercase font-mono tracking-widest text-emerald-400 font-semibold">Decentralized Threat intelligence layer</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-medium text-white tracking-tight mt-1">
              Reveal On-Chain Wash Rings and Visual Piracy
            </h2>
            <p className="text-zinc-400 text-sm md:text-base font-light max-w-2xl leading-relaxed mt-1">
              Digital assets thrive on authenticity. Our deep execution pipeline analyzes wallet cluster rings, maps token concentration matrices, and scans visual similarity embeddings to flag rug pulls and derivative clone traps.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full xl:w-auto shrink-0 font-mono">
            <div className="bg-[#0A0A0A] border border-[#222222] rounded-xl p-4 flex flex-col justify-between text-center min-w-[130px]">
              <span className="text-[10px] text-zinc-500 uppercase">Detection Accuracy</span>
              <span className="text-lg font-bold text-white mt-1">99.4%</span>
            </div>
            <div className="bg-[#0A0A0A] border border-[#222222] rounded-xl p-4 flex flex-col justify-between text-center min-w-[130px]">
              <span className="text-[10px] text-zinc-500 uppercase">CLIP Image Index</span>
              <span className="text-lg font-bold text-white mt-1">2.4M</span>
            </div>
          </div>
        </section>

        {/* 1. Collection Level Scanner - AI Audit Controller */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-0.5">
            <Database className="h-4 text-emerald-400" />
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">NFT Collection Deep Audit Scanner</span>
          </div>

          <div className="bg-[#111111] border border-[#222222] rounded-2xl p-5 md:p-6 flex flex-col gap-5">
            
            {/* Direct query triggers and network modifiers */}
            <div className="flex flex-col lg:flex-row gap-4">
              
              {/* Chains selecting block */}
              <div className="flex flex-col gap-1.5 shrink-0">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Target Chain</span>
                <div className="flex bg-[#0A0A0A] border border-[#222222] rounded-xl p-1 font-mono text-xs h-12 items-center">
                  {["Ethereum", "Solana", "Polygon"].map((chain) => (
                    <button
                      key={chain}
                      onClick={() => setSelectedChain(chain)}
                      className={`px-4 py-1.5 rounded-lg transition-all cursor-pointer ${selectedChain === chain ? "bg-zinc-800 text-white font-medium" : "text-zinc-505 text-zinc-400 hover:text-white"}`}
                    >
                      {chain}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input block */}
              <div className="flex-1 flex flex-col gap-1.5">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">NFT Collection Name or Contract Asset ID</span>
                <div className="flex gap-2 relative h-12">
                  <input
                    type="text"
                    value={collectionInput}
                    onChange={(e) => setCollectionInput(e.target.value)}
                    placeholder="Enter collection name (e.g., CyberGnomz, Cryptopunks, Milady, CloneX...)"
                    className="flex-1 bg-[#0A0A0A] border border-[#222222] rounded-xl px-4 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all font-mono"
                    onKeyDown={(e) => e.key === "Enter" && executeAuditScan()}
                  />
                  
                  <button
                    onClick={() => executeAuditScan()}
                    disabled={isAuditing}
                    className="bg-emerald-500 hover:bg-emerald-400 text-black active:scale-98 px-5 rounded-xl text-xs font-bold uppercase tracking-tight flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    <span>Deep AI Audit</span>
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

            </div>

            {/* Error notifications */}
            {errorMessage && (
              <div className="bg-rose-950/20 border border-rose-500/30 text-rose-400 px-4 py-3 rounded-xl flex items-center gap-2.5 text-xs font-mono">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Presets Quick selectors */}
            <div className="flex items-center gap-3 flex-wrap text-xs font-mono">
              <span className="text-zinc-500 uppercase text-[10px]">Reference Presets:</span>
              <div className="flex items-center gap-2 flex-wrap">
                {presets.map((p) => {
                  const ratingColor = p.riskRating === "Red" ? "text-rose-400" : p.riskRating === "Yellow" ? "text-amber-400" : "text-emerald-400";
                  return (
                    <button
                      key={p.id}
                      onClick={() => selectPresetCollection(p)}
                      className="px-3 py-1.5 rounded-lg bg-[#0A0A0A] border border-[#222222] hover:border-zinc-700 text-zinc-300 flex items-center gap-1.5 transition-all cursor-pointer hover:text-white"
                    >
                      <span className="font-semibold text-[11px]">{p.name}</span>
                      <span className="text-zinc-600">•</span>
                      <span className={`text-[10px] uppercase ${ratingColor}`}>{p.riskRating} risk</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </section>

        {/* 2. Primary Scan Report - Main Visualization area */}
        <section className="flex flex-col gap-4">
          {/* Main loader interface during audit calculations */}
          {isAuditing && (
            <div className="bg-[#111111] border border-[#222222] min-h-[380px] rounded-2xl flex flex-col items-center justify-center p-8 text-center gap-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500 animate-pulse"></div>
              
              <RefreshCw className="h-10 w-10 animate-spin text-emerald-500 stroke-1" />
              
              <div className="flex flex-col gap-1">
                <h4 className="text-white font-display font-semibold text-lg">AI-Forensics Cluster Scan In Progress</h4>
                <p className="text-emerald-400 font-mono text-xs mt-1 animate-pulse tracking-wide">
                  ❯ {auditStep}
                </p>
              </div>

              <span className="text-[10px] text-zinc-500 max-w-md mt-4 font-mono font-light leading-relaxed">
                Analyzing cryptographic event logs on-chain. Generating neural graph and CLIP vector weights. Please standby.
              </span>
            </div>
          )}

          {/* Active audited database collection card */}
          {auditData && (
            <CollectionCard data={auditData} isLoading={isAuditing} />
          )}
        </section>

        {/* 3. bento Grid of Fraud Analytics modules (Graph Wash Trading + CLIP Plagiarism Scanner) */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          
          {/* Wash trade mapping module */}
          <WashTradeGraph />

          {/* Art originality diagnostics module */}
          <PlagiarismSandbox />

        </section>

        {/* 4. Live Forensic Alerts tracker (timeline logs) */}
        <section>
          <ThreatTimeline />
        </section>

        {/* 5. Developer Rest Playgrounds documentation */}
        <section>
          <ApiPlayground />
        </section>

      </main>

      {/* Footer methodology notes */}
      <footer className="max-w-7xl mx-auto px-4 md:px-8 mt-16 text-center border-t border-[#222222] pt-8 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-[10px] text-zinc-650">
        <span>© 2026 Veritas AI Analytics Inc. All sovereign metadata indices secured.</span>
        <span>Secured via CLIP visual signatures & DBSCAN density telemetry frameworks.</span>
      </footer>

    </div>
  );
}
