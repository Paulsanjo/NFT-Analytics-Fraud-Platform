import { useState, useEffect } from "react";
import { GraphNode, GraphLink } from "../types";
import { Sliders, RefreshCw, AlertCircle, HelpCircle } from "lucide-react";

export default function WashTradeGraph() {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [links, setLinks] = useState<GraphLink[]>([]);
  const [complexity, setComplexity] = useState<number>(8);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [selectedLayout, setSelectedLayout] = useState<"loop" | "scatter">("loop");

  const fetchGraphData = async (nodeCount: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/wallet-graph?nodesCount=${nodeCount}`);
      const data = await res.json();
      if (data.success) {
        setNodes(data.nodes);
        setLinks(data.links);
      }
    } catch (e) {
      console.error("Failed to load wash wallet graph:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGraphData(complexity);
  }, [complexity]);

  // Dimensions of SVG
  const width = 600;
  const height = 360;

  // Layout calculations
  const getNodeCoordinates = (node: GraphNode, index: number, total: number) => {
    const rx = 180;
    const ry = 110;
    const centerX = width / 2;
    const centerY = height / 2;

    if (selectedLayout === "loop") {
      // For clean wash rings: top loop suspects form a tight central circle
      if (node.type !== "noise") {
        const angle = (index / 5) * 2 * Math.PI;
        return {
          x: centerX + Math.cos(angle) * 110,
          y: centerY + Math.sin(angle) * 75
        };
      } else {
        // Noise wallets orbit in outer circles
        const noiseIndex = index - 5;
        const outerAngle = (noiseIndex / (total - 5)) * 2 * Math.PI + 0.5;
        const randomOrbit = 160 + (index % 3) * 18;
        return {
          x: centerX + Math.cos(outerAngle) * randomOrbit,
          y: centerY + Math.sin(outerAngle) * (randomOrbit * 0.65)
        };
      }
    } else {
      // Scatter layouts: using deterministic pseudo-random offsets
      const seed = index * 4921;
      const xOffset = ((seed % 340) - 170) + (width / 2);
      const yOffset = (((seed * 7) % 200) - 100) + (height / 2);
      return { x: xOffset, y: yOffset };
    }
  };

  // Pre-calculate node coordinates mapping
  const coordMap: { [key: string]: { x: number; y: number } } = {};
  nodes.forEach((node, idx) => {
    coordMap[node.id] = getNodeCoordinates(node, idx, nodes.length);
  });

  const getNodeColor = (type: string, isHovered: boolean) => {
    switch (type) {
      case "whales":
        return isHovered ? "fill-amber-300 stroke-amber-400" : "fill-amber-500 stroke-amber-500/30";
      case "sybil":
        return isHovered ? "fill-rose-400 stroke-rose-500" : "fill-rose-500 stroke-rose-500/35";
      case "creator":
        return isHovered ? "fill-sky-400 stroke-sky-500" : "fill-sky-500 stroke-sky-500/30";
      case "tornado":
        return isHovered ? "fill-purple-400 stroke-purple-500" : "fill-purple-700 stroke-purple-700/30";
      default: // noise
        return isHovered ? "fill-zinc-300 stroke-zinc-400" : "fill-zinc-700 stroke-zinc-700/40";
    }
  };

  return (
    <div id="wash-ring-visualizer" className="bg-[#111111] border border-[#222222] rounded-2xl p-6 flex flex-col gap-5 relative">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-display font-semibold text-white flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
            Wash Trading Loop Visualizer (Neural Graph)
          </h3>
          <p className="text-xs text-zinc-400 font-sans">
            Circular transactional flow detection mapping. Hover wallets to inspect wash volume routes.
          </p>
        </div>

        {/* Layout buttons */}
        <div className="flex bg-[#0A0A0A] border border-[#222222] rounded-md p-1 self-start sm:self-center font-mono text-xs">
          <button
            onClick={() => setSelectedLayout("loop")}
            className={`px-2.5 py-1 rounded transition-all ${selectedLayout === "loop" ? "bg-zinc-850 text-white font-medium" : "text-zinc-400 hover:text-white"}`}
          >
            Vortex
          </button>
          <button
            onClick={() => setSelectedLayout("scatter")}
            className={`px-2.5 py-1 rounded transition-all ${selectedLayout === "scatter" ? "bg-zinc-850 text-white font-medium" : "text-zinc-400 hover:text-white"}`}
          >
            Scatter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Graph Section */}
        <div className="lg:col-span-8 bg-[#0A0A0A] border border-[#222222] rounded-xl relative overflow-hidden flex items-center justify-center min-h-[380px]">
          {isLoading && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center gap-3 z-10 text-xs font-mono text-zinc-450">
              <RefreshCw className="h-5 w-5 animate-spin text-emerald-500" />
              Recalculating Wallet Vectors...
            </div>
          )}

          {/* Core SVG Render of loop graph */}
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none">
            {/* Draw links / lines */}
            <defs>
              <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="23"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#ef4444" />
              </marker>
              <marker
                id="arrow-gray"
                viewBox="0 0 10 10"
                refX="16"
                refY="5"
                markerWidth="4"
                markerHeight="4"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#52525b" />
              </marker>
            </defs>

            {/* Render Links */}
            {links.map((link, idx) => {
              const from = coordMap[link.source];
              const to = coordMap[link.target];
              if (!from || !to) return null;

              const isSuspicious = link.type === "circular";
              const strokeColor = isSuspicious ? "stroke-rose-500/60" : "stroke-zinc-700/40";
              const strokeWidth = isSuspicious ? "3" : "1.5";
              const dash = isSuspicious ? "5,3" : "none";
              const marker = isSuspicious ? "url(#arrow)" : "url(#arrow-gray)";

              return (
                <g key={`link-${idx}`}>
                  <line
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    className={`${strokeColor} transition-all duration-500`}
                    strokeWidth={strokeWidth}
                    strokeDasharray={dash}
                    markerEnd={marker}
                  />
                  {/* Decorative transaction path indicator dots flying */}
                  {isSuspicious && (
                    <circle r="2.5" className="fill-rose-400 animate-ping">
                      <animateMotion
                        path={`M ${from.x} ${from.y} L ${to.x} ${to.y}`}
                        dur={`${2 + (idx % 2)}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                </g>
              );
            })}

            {/* Render Nodes */}
            {nodes.map((node, idx) => {
              const coords = coordMap[node.id];
              if (!coords) return null;

              const isSuspectNode = node.type === "whales" || node.type === "sybil";
              const r = isSuspectNode ? 11 : node.type === "tornado" ? 14 : 7;
              const isHovered = hoveredNode?.id === node.id;

              return (
                <g
                  key={`node-${idx}`}
                  transform={`translate(${coords.x}, ${coords.y})`}
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className="cursor-pointer group"
                >
                  {/* Outer breathing ring for high-risk wallets */}
                  {isSuspectNode && (
                    <circle
                      r={r + 6}
                      className="fill-none stroke-rose-500/20 stroke-1 animate-pulse"
                    />
                  )}
                  {/* Core Circle */}
                  <circle
                    r={r}
                    className={`${getNodeColor(node.type, isHovered)} stroke-[2px] transition-all duration-300 font-sans`}
                  />
                  {/* Text index */}
                  {isSuspectNode && (
                    <text
                      y="4"
                      textAnchor="middle"
                      className="fill-black text-[8px] font-bold font-mono pointer-events-none"
                    >
                      !
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* SVG floating helper legends */}
          <div className="absolute top-3 left-4 flex flex-col gap-1 text-[10px] font-mono text-zinc-500 bg-zinc-950/40 p-2 rounded border border-zinc-800/40 backdrop-blur-xs select-none">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-500"></span>
              <span>Sybil Wash Attack (High risk)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500"></span>
              <span>Loop Whale Wallets</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-sky-500"></span>
              <span>Creator Funding Wallets</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-purple-700"></span>
              <span>Mixer Outflow Exit (Tornado)</span>
            </div>
          </div>
        </div>

        {/* Dashboard Controls block */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* Node detail display panel */}
          <div className="bg-[#0A0A0A] border border-[#222222] rounded-xl p-4 min-h-[170px] flex flex-col justify-between animate-fadeIn">
            {hoveredNode ? (
              <div className="flex flex-col gap-2">
                <div className="text-[10px] tracking-wider font-mono text-zinc-500 uppercase">
                  Inspected Node Details
                </div>
                <div className="text-sm font-semibold text-white break-all flex items-center gap-2">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  {hoveredNode.id}
                </div>
                <div className="grid grid-cols-2 gap-3 mt-2 font-mono text-xs">
                  <div className="bg-[#111111] border border-[#222222] p-2 rounded">
                    <div className="text-zinc-505 text-[10px] text-zinc-500">WALLET TYPE</div>
                    <div className="text-zinc-200 uppercase mt-0.5">{hoveredNode.type}</div>
                  </div>
                  <div className="bg-[#111111] border border-[#222222] p-2 rounded">
                    <div className="text-zinc-555 text-[10px] text-zinc-500">WASH INVOLVED</div>
                    <div className="text-rose-400 font-semibold mt-0.5">{hoveredNode.washInvolved ? `${hoveredNode.washInvolved} ETH` : "0.0 ETH"}</div>
                  </div>
                </div>
                <p className="text-[#A3A3A3] text-[11px] font-sans mt-2 italic">
                  {hoveredNode.type === "whales" && "Circular buy-back triggers on NFT floor to stimulate trading activity flags."}
                  {hoveredNode.type === "sybil" && "Belongs to a group of coordinate dummy wallets connected by singular creator funding origins."}
                  {hoveredNode.type === "creator" && "Master token deployer account that initially fueled gas resources to loop traders."}
                  {hoveredNode.type === "tornado" && "Privacy pool exit designed to conceal identity of wash trade funding coordinator."}
                  {hoveredNode.type === "noise" && "Ordinary buyer account swept into the collection visualization index."}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center gap-2 h-full text-zinc-500 py-6">
                <HelpCircle className="h-8 w-8 stroke-1 text-zinc-650 animate-pulse" />
                <span className="text-xs font-mono">Hover any node vector to access cryptographic audit details</span>
              </div>
            )}
          </div>

          {/* Interactive sliders for sandbox configuration */}
          <div className="bg-[#0A0A0A] border border-[#222222] rounded-xl p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between text-xs font-mono text-[#D4D4D4]">
              <span className="flex items-center gap-1.5"><Sliders className="h-3.5" /> Node Complexity</span>
              <span className="text-emerald-400 font-bold">{complexity} nodes</span>
            </div>

            <input
              type="range"
              min="4"
              max="25"
              value={complexity}
              onChange={(e) => setComplexity(parseInt(e.target.value))}
              className="w-full accent-emerald-500 h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer"
            />

            <div className="text-[10px] text-[#A3A3A3] font-sans leading-relaxed">
              Modulate complexity to simulate DBSCAN wallet density sweeps. High node volumes reveal secondary wash networks and decoy accounts.
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
