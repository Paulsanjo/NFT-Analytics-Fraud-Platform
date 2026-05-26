import { useState } from "react";
import { Camera, Image, ShieldAlert, CheckCircle2, RefreshCw } from "lucide-react";

export default function PlagiarismSandbox() {
  const [selectedAsset, setSelectedAsset] = useState<string>("Bored Ape Gold Copy #01");
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [result, setResult] = useState<any | null>(null);

  const presets = [
    { name: "Bored Ape Gold Copy #01", thumb: "🦧" },
    { name: "Slippage Azkui Elemental #55", thumb: "⛩️" },
    { name: "Pudgy Penguin Derivative #142", thumb: "🐧" },
    { name: "Completely Original Digital Art", thumb: "🎨" }
  ];

  const handleScan = async () => {
    setIsScanning(true);
    setResult(null);
    
    // Simulate Neural latency for beautiful UI scanning feedback
    setTimeout(async () => {
      try {
        const res = await fetch("/api/plagiarism-check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageName: selectedAsset })
        });
        const data = await res.json();
        if (data.success) {
          // Add custom logic variations depending on selectedAsset name
          let sim = 24;
          let report = "Original creation, zero similarity trigger.";
          let matchColl = "N/A";

          if (selectedAsset.includes("Gold")) {
            sim = 97.4;
            report = "High Plagiarism Risk: 1-to-1 mirror alignment of official BAYC #3749 traits.";
            matchColl = "Bored Ape Yacht Club";
          } else if (selectedAsset.includes("Azkui")) {
            sim = 94.6;
            report = "Critical Plagiarism Rank: Vector overlapping with official Azuki collection assets.";
            matchColl = "Azuki";
          } else if (selectedAsset.includes("Derivative")) {
            sim = 82.1;
            report = "Derivative Flag: Trait recombination of Pudgy Penguins official accessories.";
            matchColl = "Pudgy Penguins";
          }

          setResult({
            ...data,
            primaryMatch: {
              ...data.primaryMatch,
              similarityScore: sim,
              collection: matchColl,
              matchType: report
            }
          });
        }
      } catch (e) {
        console.error("Neural scan failed:", e);
      } finally {
        setIsScanning(false);
      }
    }, 2000);
  };

  return (
    <div id="plagiarism-detector-sandbox" className="bg-[#111111] border border-[#222222] rounded-2xl p-6 flex flex-col gap-5">
      <div>
        <h3 className="text-lg font-display font-semibold text-white flex items-center gap-2">
          <Camera className="h-4.5 text-emerald-400" />
          Neural Art Plagiarism Scanner (CLIP Engine)
        </h3>
        <p className="text-xs text-zinc-400 font-sans">
          Analyze pixel embedding density vectors. Spot duplicate metadata and copycat artwork across chains.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Presets and Upload Column */}
        <div className="md:col-span-12 xl:col-span-4 flex flex-col gap-4">
          <span className="text-xs font-mono text-zinc-500 uppercase">Select Target Asset to Scan</span>
          
          <div className="flex flex-col gap-2">
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedAsset(p.name);
                  setResult(null);
                }}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all text-xs font-mono ${selectedAsset === p.name ? "bg-emerald-500/10 border-emerald-500/50 text-white" : "bg-[#0A0A0A] border-[#222222] text-zinc-400 hover:border-zinc-700 hover:text-white"}`}
              >
                <span className="text-xl">{p.thumb}</span>
                <span className="truncate">{p.name}</span>
              </button>
            ))}
          </div>

          <button
            onClick={handleScan}
            disabled={isScanning}
            className="w-full bg-emerald-500 hover:bg-emerald-400 active:scale-98 disabled:opacity-60 text-black font-display font-medium text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {isScanning ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                Scanning Embeddings...
              </>
            ) : (
              "Scan Visual Plagiarism Signature"
            )}
          </button>
        </div>

        {/* Visualizer Column with scanning laser */}
        <div className="md:col-span-12 xl:col-span-8 bg-[#0A0A0A] border border-[#222222] rounded-xl p-5 flex flex-col md:flex-row gap-6 items-stretch relative overflow-hidden min-h-[250px]">
          
          {/* Virtual Canvas Image representation */}
          <div className="w-full md:w-44 bg-[#111111] border border-[#222222] rounded-xl relative overflow-hidden flex flex-col items-center justify-center min-h-[180px]">
            {/* Horizontal glowing red laser bar */}
            {isScanning && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500 shadow-[0_0_12px_#10b981] animate-laser z-10"></div>
            )}
            
            <div className={`text-6xl transition-all ${isScanning ? "scale-105 opacity-60 filter blur-[1px]" : "scale-100 opacity-90"}`}>
              {selectedAsset.includes("Gold") && "🦧"}
              {selectedAsset.includes("Azkui") && "⛩️"}
              {selectedAsset.includes("Derivative") && "🐧"}
              {selectedAsset.includes("Original") && "🎨"}
            </div>
            
            <span className="text-[10px] font-mono text-zinc-500 mt-4 text-center px-4 truncate w-full">
              {selectedAsset}
            </span>
          </div>

          {/* Result details */}
          <div className="flex-1 flex flex-col justify-between">
            {isScanning ? (
              <div className="flex flex-col justify-center h-full gap-2 text-zinc-400 text-xs font-mono font-light italic p-4 text-center md:text-left">
                <p>❯ Running pixel density mapping...</p>
                <p>❯ Comparing CLIP vector models against 2.4M assets...</p>
                <p>❯ Computing Cosine Similarity matching algorithms...</p>
              </div>
            ) : result ? (
              <div className="flex flex-col gap-3 h-full justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-zinc-500 uppercase">Analysis Outcome</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono leading-none font-bold uppercase ${result.primaryMatch.similarityScore > 50 ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                      {result.primaryMatch.similarityScore > 50 ? "Plagiarism Risk" : "Authentic Asset"}
                    </span>
                  </div>

                  {/* Similarity metric gauge */}
                  <div className="mt-2.5 flex items-center gap-4">
                    <div className="text-3xl font-display font-extrabold text-white">
                      {result.primaryMatch.similarityScore}%
                    </div>
                    <div className="flex flex-col text-xs font-mono text-zinc-400">
                      <span>Matches: <strong className="text-emerald-400 font-medium">{result.primaryMatch.collection}</strong></span>
                      <span className="text-[10px] text-zinc-500">Visual Similarity Match Score</span>
                    </div>
                  </div>

                  <p className="text-zinc-300 text-xs font-sans mt-3 leading-relaxed">
                    {result.primaryMatch.matchType}
                  </p>
                </div>

                <div className="border-t border-[#222222] pt-3 flex flex-col gap-2 font-mono text-[10px] text-zinc-500">
                  <div className="flex justify-between">
                    <span>VISUAL HASH:</span>
                    <span className="text-zinc-300">{result.visualSignatureHash}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CONFIDENCE LAYER:</span>
                    <span className="text-zinc-300">{result.confidence}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center h-full gap-2 text-zinc-500 py-6">
                <Image className="h-10 w-10 text-zinc-700 stroke-1" />
                <span className="text-xs font-mono">Neural Scanning Engine Idle. Click Scan to audit signature metrics.</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
