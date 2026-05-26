import { CollectionData } from "../types";
import { AlertTriangle, ShieldCheck, ShieldAlert, Award, Hash, TrendingDown, TrendingUp, Users, DollarSign, ExternalLink } from "lucide-react";

interface CollectionCardProps {
  data: CollectionData;
  isLoading?: boolean;
}

export default function CollectionCard({ data, isLoading = false }: CollectionCardProps) {
  if (isLoading) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 animate-pulse flex flex-col gap-6">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-3 w-1/2">
            <div className="h-6 bg-zinc-800 rounded-md w-3/4"></div>
            <div className="h-4 bg-zinc-800 rounded-md w-1/3"></div>
          </div>
          <div className="h-10 bg-zinc-800 rounded-full w-24"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-40 bg-zinc-800 rounded-xl col-span-1"></div>
          <div className="h-40 bg-zinc-800 rounded-xl col-span-2"></div>
        </div>
      </div>
    );
  }

  const {
    name, chain, symbol, floorPrice, floorPriceUsd, velocity24h,
    realVolume, washVolume, holderCount, totalSupply, giniCoefficient,
    riskScore, riskRating, auditStatus, plagiarismReport, teamCredibility,
    socialManipulationScore, liquidityDepth, breakdown, description
  } = data;

  const getRiskColor = (rating: string) => {
    switch (rating) {
      case "Green": return { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", progress: "bg-emerald-500" };
      case "Yellow": return { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", progress: "bg-amber-500" };
      case "Red": default: return { text: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20", progress: "bg-rose-500" };
    }
  };

  const colors = getRiskColor(riskRating);
  const realVolRatio = realVolume / (realVolume + washVolume || 1);

  return (
    <div id="collection-audit-card" className="bg-[#111111] border border-[#222222] rounded-2xl p-6 md:p-8 flex flex-col gap-6 md:gap-8 transition-all hover:border-[#333333]">
      
      {/* Name and Basic Headers */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h2 id="card-collection-title" className="text-2xl md:text-3xl font-display font-semibold tracking-tight text-white mb-1">{name}</h2>
            <span id="badge-chain" className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#0A0A0A] text-zinc-350 border border-[#222222] uppercase tracking-widest font-mono">
              {chain}
            </span>
          </div>
          <p className="text-zinc-400 text-sm font-mono flex items-center gap-2 mt-1">
            <span>Symbol: {symbol}</span>
            <span className="text-zinc-650">•</span>
            <span>Contract verified</span>
          </p>
        </div>

        {/* Global Security Rating Badge */}
        <div id="indicator-rating-badge" className={`flex items-center gap-2.5 px-4 py-2 rounded-xl border ${colors.bg} ${colors.border}`}>
          {riskRating === "Green" && <ShieldCheck className="h-5 py-0.5 text-emerald-400" />}
          {riskRating === "Yellow" && <AlertTriangle className="h-5 py-0.5 text-amber-400" />}
          {riskRating === "Red" && <ShieldAlert className="h-5 py-0.5 text-rose-500" />}
          <span className={`text-base font-display font-semibold tracking-wide ${colors.text}`}>
            {riskRating.toUpperCase()} RISK
          </span>
        </div>
      </div>

      {/* Main Stats Block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Risk Score circle visualization */}
        <div className="lg:col-span-4 bg-[#0A0A0A] border border-[#222222] rounded-xl p-6 flex flex-col items-center justify-center text-center gap-4 relative overflow-hidden">
          <span className="text-xs uppercase font-mono tracking-wider text-zinc-500">Security Index</span>
          
          <div className="relative flex items-center justify-center w-36 h-36">
            {/* Round Progress circle */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#18181b"
                strokeWidth="7"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke={riskRating === "Green" ? "#10b981" : riskRating === "Yellow" ? "#f59e0b" : "#ef4444"}
                strokeWidth="8"
                fill="transparent"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * riskScore) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-display font-bold text-white">{riskScore}</span>
              <span className="text-[10px] font-mono tracking-wider text-zinc-500">FRAUD INDEX</span>
            </div>
          </div>

          <div className="text-xs text-zinc-400 font-sans tracking-wide">
            {riskScore < 35 ? (
              <span className="text-emerald-400">Excellent smart contract signals</span>
            ) : riskScore < 70 ? (
              <span className="text-amber-400">Moderate anomalies detected</span>
            ) : (
              <span className="text-rose-400">Severe malicious patterns identified</span>
            )}
          </div>
        </div>

        {/* Core market indicators grid */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          
          {/* Floor Price */}
          <div className="bg-[#0A0A0A] border border-[#222222] rounded-xl p-4 flex flex-col justify-between">
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider flex items-center justify-between">
              Floor Price
              <DollarSign className="h-3 text-zinc-650" />
            </span>
            <div className="mt-2">
              <div className="text-xl md:text-2xl font-display font-semibold text-white">
                {floorPrice} {chain === "Solana" ? "SOL" : "ETH"}
              </div>
              <div className="text-xs text-zinc-400 mt-1">${floorPriceUsd.toLocaleString()}</div>
            </div>
          </div>

          {/* Floor price velocity */}
          <div className="bg-[#0A0A0A] border border-[#222222] rounded-xl p-4 flex flex-col justify-between">
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider flex items-center justify-between">
              24h Velocity
              {velocity24h >= 0 ? <TrendingUp className="h-3.5 text-emerald-400" /> : <TrendingDown className="h-3.5 text-rose-400" />}
            </span>
            <div className="mt-2">
              <div className={`text-xl md:text-2xl font-display font-semibold ${velocity24h >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {velocity24h >= 0 ? "+" : ""}{velocity24h}%
              </div>
              <div className="text-xs text-zinc-400 mt-1">Floor Price trend speed</div>
            </div>
          </div>

          {/* Holder Count / Gini */}
          <div className="bg-[#0A0A0A] border border-[#222222] rounded-xl p-4 flex flex-col justify-between">
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider flex items-center justify-between">
              Holders density
              <Users className="h-3.5 text-zinc-650" />
            </span>
            <div className="mt-2">
              <div className="text-xl md:text-2xl font-display font-semibold text-white">
                {holderCount.toLocaleString()}
              </div>
              <div className="text-xs text-zinc-400 mt-1 font-mono">Gini Index: {giniCoefficient}</div>
            </div>
          </div>

          {/* Total Supply */}
          <div className="bg-[#0A0A0A] border border-[#222222] rounded-xl p-4 flex flex-col justify-between">
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider flex items-center justify-between">
              Token Supply
              <Hash className="h-3.5 text-zinc-650" />
            </span>
            <div className="mt-2">
              <div className="text-xl md:text-2xl font-display font-semibold text-white">
                {totalSupply.toLocaleString()}
              </div>
              <div className="text-xs text-zinc-400 mt-1">Unique tokens minted</div>
            </div>
          </div>

          {/* Wash vs Regular Volume Split */}
          <div className="bg-[#0A0A0A] border border-[#222222] rounded-xl p-4 flex flex-col justify-between sm:col-span-2">
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider flex items-center justify-between">
              Organic vs Wash trade share
              <Award className="h-3.5 text-zinc-650" />
            </span>
            <div className="mt-2">
              <div className="flex justify-between text-xs text-zinc-400 mb-1.5 font-mono">
                <span>Organic: {Math.round(realVolRatio * 100)}%</span>
                <span>Wash: {Math.round((1 - realVolRatio) * 100)}%</span>
              </div>
              <div className="w-full h-2 bg-[#111111] border border-[#222222] rounded-full overflow-hidden flex">
                <div className="h-full bg-emerald-500" style={{ width: `${realVolRatio * 100}%` }}></div>
                <div className="h-full bg-rose-500 animate-pulse" style={{ width: `${(1 - realVolRatio) * 100}%` }}></div>
              </div>
              <div className="text-[10px] text-zinc-500 mt-1.5 font-mono">
                Real Vol: {realVolume} • Wash Vol: {washVolume} {chain === "Solana" ? "SOL" : "ETH"}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Narrative AI Description */}
      <div className="bg-[#0A0A0A] border border-[#222222] rounded-xl p-5">
        <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 text-emerald-400" />
          AI Security Auditor Assessment
        </h3>
        <p className="text-zinc-300 text-sm md:text-base leading-relaxed font-sans">{description}</p>
      </div>

      {/* Forensic Intelligence Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Smart Contract audit */}
        <div className="bg-[#0A0A0A] border border-[#222222] rounded-xl p-4 flex flex-col gap-1.5">
          <span className="text-xs font-mono text-zinc-500 uppercase">Smart Contract Audit</span>
          <span className="text-sm font-medium text-white">{auditStatus}</span>
          <div className="w-full bg-[#111111] h-1.5 rounded-full overflow-hidden mt-1">
            <div className={`h-full ${breakdown.contractAudit > 70 ? 'bg-rose-500' : breakdown.contractAudit > 35 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${100 - breakdown.contractAudit}%` }}></div>
          </div>
        </div>

        {/* Visual Plagiarism */}
        <div className="bg-[#0A0A0A] border border-[#222222] rounded-xl p-4 flex flex-col gap-1.5">
          <span className="text-xs font-mono text-zinc-500 uppercase">Visual Originality</span>
          <span className="text-sm font-medium text-white truncate" title={plagiarismReport}>{plagiarismReport}</span>
          <div className="w-full bg-[#111111] h-1.5 rounded-full overflow-hidden mt-1">
            <div className={`h-full ${breakdown.holderConcentration > 70 ? 'bg-rose-500' : breakdown.holderConcentration > 35 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${breakdown.holderConcentration}%` }}></div>
          </div>
        </div>

        {/* Creator credibility */}
        <div className="bg-[#0A0A0A] border border-[#222222] rounded-xl p-4 flex flex-col gap-1.5">
          <span className="text-xs font-mono text-zinc-500 uppercase">Creator Security Tracker</span>
          <span className="text-sm font-medium text-white truncate" title={teamCredibility}>{teamCredibility}</span>
          <div className="w-full bg-[#111111] h-1.5 rounded-full overflow-hidden mt-1">
            <div className={`h-full ${breakdown.teamCredibility > 70 ? 'bg-rose-500' : breakdown.teamCredibility > 35 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${100 - breakdown.teamCredibility}%` }}></div>
          </div>
        </div>

        {/* Social safety */}
        <div className="bg-[#0A0A0A] border border-[#222222] rounded-xl p-4 flex flex-col gap-1.5">
          <span className="text-xs font-mono text-zinc-500 uppercase">Social Safety Index</span>
          <span className="text-sm font-medium text-white">Bot score: {socialManipulationScore}/100</span>
          <div className="w-full bg-[#111111] h-1.5 rounded-full overflow-hidden mt-1">
            <div className={`h-full ${breakdown.socialManipulation > 70 ? 'bg-rose-500' : breakdown.socialManipulation > 35 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${100 - breakdown.socialManipulation}%` }}></div>
          </div>
        </div>

      </div>

    </div>
  );
}
