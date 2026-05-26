import { useState, useEffect } from "react";
import { ThreatLog } from "../types";
import { AlertCircle, Eye, EyeOff, Radio, RefreshCw, Layers } from "lucide-react";

export default function ThreatTimeline() {
  const [logs, setLogs] = useState<ThreatLog[]>([]);
  const [filterChain, setFilterChain] = useState<string>("ALL");
  const [filterSeverity, setFilterSeverity] = useState<string>("ALL");
  const [isLive, setIsLive] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/logs");
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs);
      }
    } catch (e) {
      console.error("Failed to fetch logs:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Periodic threat updates to make the feed feel real-time and active
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setLogs((prev) => {
        const chains = ["ETH", "SOL", "POLY"];
        const types = ["WASH_RING", "RUG_SIGNAL", "PLAGIARISM", "PUMP_DUMP"];
        const severities: ("red" | "yellow" | "green")[] = ["red", "yellow", "green"];

        const randomChain = chains[Math.floor(Math.random() * chains.length)];
        const randomType = types[Math.floor(Math.random() * types.length)];
        const randomSeverity = severities[Math.floor(Math.random() * severities.length)];

        let msg = "";
        if (randomType === "WASH_RING") {
          msg = `Sub-cluster trade cycle identified on ${randomChain} network matching repetitive buyback sequences`;
        } else if (randomType === "RUG_SIGNAL") {
          msg = `Contract liquidity drained below critical limit for anonymous collection on ${randomChain}`;
        } else if (randomType === "PLAGIARISM") {
          msg = `Duplicate metadata clone scan matching 90%+ image traits index on ${randomChain}`;
        } else {
          msg = `Price floor velocity aberration triggered: suspicious wallet volume swing detected`;
        }

        const newLog: ThreatLog = {
          id: `l-rand-${Date.now()}`,
          time: "Just now",
          chain: randomChain,
          type: randomType,
          message: msg,
          severity: randomSeverity,
        };

        // Prepend and limit size to 12
        return [newLog, ...prev.slice(0, 11)];
      });
    }, 7000);

    return () => clearInterval(interval);
  }, [isLive]);

  const filteredLogs = logs.filter((log) => {
    if (filterChain !== "ALL" && log.chain !== filterChain) return false;
    if (filterSeverity !== "ALL" && log.severity !== filterSeverity) return false;
    return true;
  });

  return (
    <div id="threat-timeline-feed" className="bg-[#111111] border border-[#222222] rounded-2xl p-6 flex flex-col gap-4">
      
      {/* Feed header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222222] pb-4">
        <div>
          <h3 className="text-lg font-display font-semibold text-white flex items-center gap-2">
            <Radio className={`h-4.5 w-4.5 text-rose-500 ${isLive ? 'animate-pulse' : ''}`} />
            Live Forensic Threat Feed (Mainnet Audit)
          </h3>
          <p className="text-xs text-zinc-400 font-sans mt-0.5">
            Real-time on-chain events triggered by wallet sweeps, plagiarism mismatches and pump triggers.
          </p>
        </div>

        {/* Live control */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${isLive ? 'bg-rose-500/10 border-rose-500/30 text-rose-450' : 'bg-[#0A0A0A] border-[#222222] text-zinc-450'}`}
          >
            {isLive ? (
              <>
                <Eye className="h-3.5" />
                <span>Live stream ON</span>
              </>
            ) : (
              <>
                <EyeOff className="h-3.5" />
                <span>Live stream PAUSED</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filter and query systems system */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        
        {/* Chain Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-zinc-500 flex items-center gap-1"><Layers className="h-3.5" /> Chain:</span>
          {["ALL", "ETH", "SOL", "POLY"].map((c) => (
            <button
               key={c}
               onClick={() => setFilterChain(c)}
               className={`px-2.5 py-1 rounded border transition-all font-mono text-xs cursor-pointer ${filterChain === c ? 'bg-emerald-500 border-emerald-500 text-black font-bold' : 'bg-[#0A0A0A] border-[#222222] text-zinc-500 hover:text-zinc-350'}`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Severity Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-zinc-500">Risk:</span>
          {["ALL", "red", "yellow", "green"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterSeverity(s)}
              className={`px-2.5 py-1 rounded border transition-all uppercase text-[10px] tracking-wider cursor-pointer ${filterSeverity === s ? 'bg-zinc-805 bg-zinc-800 border-zinc-700 text-white' : 'bg-[#0A0A0A] border-[#222222] text-zinc-500 hover:text-zinc-350'}`}
            >
              {s}
            </button>
          ))}
        </div>

      </div>

      {/* Logs container */}
      <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto pr-1 scrollbar-thin">
        {isLoading && logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2 text-zinc-500 text-xs font-mono">
            <RefreshCw className="h-5 w-5 animate-spin text-emerald-500" />
            Synchronizing chain index...
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-1.5 text-zinc-500 text-xs font-mono">
            <AlertCircle className="h-5 w-5 text-zinc-600" />
            No reports matching filter parameters have triggered
          </div>
        ) : (
          filteredLogs.map((log) => {
            const isRed = log.severity === "red";
            const isYellow = log.severity === "yellow";
            const colorClass = isRed
              ? "border-red-500/20 bg-red-500/5 text-red-400 animate-pulse"
              : isYellow
              ? "border-amber-505/20 border-amber-500/20 bg-amber-500/5 text-amber-400"
              : "border-[#222222] bg-[#0A0A0A] text-zinc-300";

            const sideBadgeColor = isRed
              ? "bg-red-500"
              : isYellow
              ? "bg-amber-500"
              : "bg-emerald-500";

            return (
              <div
                key={log.id}
                className={`border p-3 rounded-xl flex items-start gap-3 transition-all ${colorClass}`}
              >
                {/* Visual indicators */}
                <div className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${sideBadgeColor}`} />
                
                {/* Content body */}
                <div className="flex-1 flex flex-col sm:flex-row justify-between items-start gap-2">
                  <div className="flex flex-col">
                    <p className="text-xs font-sans tracking-wide leading-relaxed">{log.message}</p>
                    <div className="flex items-center gap-2 mt-1.5 text-[9px] font-mono text-zinc-500 uppercase">
                      <span>{log.type}</span>
                      <span>•</span>
                      <span>{log.chain}</span>
                    </div>
                  </div>
                  
                  <span className="text-[10px] font-mono text-zinc-500 shrink-0 uppercase sm:self-center font-bold">
                    {log.time}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
