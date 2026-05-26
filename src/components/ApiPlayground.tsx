import { useState } from "react";
import { Terminal, Play, Copy, Check, FileCode2 } from "lucide-react";

export default function ApiPlayground() {
  const [activeTab, setActiveTab] = useState<"presets" | "logs" | "analyze">("presets");
  const [responseJson, setResponseJson] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Snippets definitions
  const snippets = {
    presets: {
      url: "/api/presets",
      method: "GET",
      curl: `curl -X GET "${window.location.protocol}//${window.location.host}/api/presets" \\
  -H "Accept: application/json"`,
      js: `fetch('/api/presets')
  .then(res => res.json())
  .then(data => console.log(data));`
    },
    logs: {
      url: "/api/logs",
      method: "GET",
      curl: `curl -X GET "${window.location.protocol}//${window.location.host}/api/logs" \\
  -H "Accept: application/json"`,
      js: `fetch('/api/logs')
  .then(res => res.json())
  .then(data => console.log(data));`
    },
    analyze: {
      url: "/api/analyze",
      method: "POST",
      curl: `curl -X POST "${window.location.protocol}//${window.location.host}/api/analyze" \\
  -H "Content-Type: application/json" \\
  -d '{"collectionName": "Milady Maker", "blockchain": "Ethereum"}'`,
      js: `fetch('/api/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    collectionName: "Milady Maker",
    blockchain: "Ethereum"
  })
})
.then(res => res.json())
.then(data => console.log(data));`
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippets[activeTab].curl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const executeApi = async () => {
    setIsLoading(true);
    setResponseJson("");
    try {
      let res;
      if (activeTab === "analyze") {
        res = await fetch(snippets.analyze.url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ collectionName: "Milady Maker", blockchain: "Ethereum" })
        });
      } else {
        res = await fetch(snippets[activeTab].url);
      }
      const data = await res.json();
      setResponseJson(JSON.stringify(data, null, 2));
    } catch (e: any) {
      setResponseJson(`// Error execution: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="developer-api-sandbox" className="bg-[#111111] border border-[#222222] rounded-2xl p-6 flex flex-col gap-5">
      
      {/* Sandbox Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222222] pb-4">
        <div>
          <h3 className="text-lg font-display font-semibold text-white flex items-center gap-2">
            <Terminal className="h-4.5 text-emerald-400" />
            Developer REST API Sandbox
          </h3>
          <p className="text-xs text-zinc-400 font-sans">
            Query our risk intelligence endpoints. Run mock operations and access structured audits directly.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Endpoint Config Column */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-mono text-zinc-500 uppercase">Select Target Endpoint</span>
            
            <div className="flex flex-col gap-2">
              <button
                onClick={() => { setActiveTab("presets"); setResponseJson(""); }}
                className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${activeTab === "presets" ? "bg-emerald-500/10 border-emerald-500/40 text-white" : "bg-[#0A0A0A] border-[#222222] text-zinc-400 hover:border-zinc-700 hover:text-white"}`}
              >
                <div className="flex flex-col font-mono">
                  <span className="text-xs font-bold text-white uppercase">presets list</span>
                  <span className="text-[10px] text-zinc-505 mt-0.5">GET /api/presets</span>
                </div>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-mono px-1.5 py-0.5 rounded leading-none">GET</span>
              </button>

              <button
                onClick={() => { setActiveTab("logs"); setResponseJson(""); }}
                className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${activeTab === "logs" ? "bg-emerald-500/10 border-emerald-500/40 text-white" : "bg-[#0A0A0A] border-[#222222] text-zinc-400 hover:border-zinc-700 hover:text-white"}`}
              >
                <div className="flex flex-col font-mono font-medium">
                  <span className="text-xs font-bold text-white uppercase">threat logs</span>
                  <span className="text-[10px] text-zinc-500 mt-0.5">GET /api/logs</span>
                </div>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-mono px-1.5 py-0.5 rounded leading-none">GET</span>
              </button>

              <button
                onClick={() => { setActiveTab("analyze"); setResponseJson(""); }}
                className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${activeTab === "analyze" ? "bg-emerald-500/10 border-emerald-500/40 text-white" : "bg-[#0A0A0A] border-[#222222] text-zinc-404 bg-zinc-900/40 border-zinc-800/60 text-zinc-400 hover:border-zinc-700 hover:text-white"}`}
              >
                <div className="flex flex-col font-mono font-medium">
                  <span className="text-xs font-bold text-white uppercase">Collection Audit</span>
                  <span className="text-[10px] text-zinc-500 mt-0.5">POST /api/analyze</span>
                </div>
                <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[9px] font-mono px-1.5 py-0.5 rounded leading-none">POST</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <button
              onClick={executeApi}
              disabled={isLoading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 py-3.5 px-4 rounded-xl text-black font-display font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
            >
              <Play className="h-3.5 w-3.5 fill-black text-black" />
              {isLoading ? "Executing Request..." : "Query Live REST Endpoint"}
            </button>
          </div>
        </div>

        {/* Code Terminal Display Column */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          {/* Syntax Code Block */}
          <div className="bg-[#0A0A0A] border border-[#222222] rounded-xl flex flex-col flex-1 min-h-[220px]">
            <div className="flex items-center justify-between bg-[#111111]/60 px-4 py-2 border-b border-[#222222] text-[10px] font-mono text-zinc-400">
              <span className="flex items-center gap-1"><FileCode2 className="h-3.5 text-zinc-400" /> cURL Request Template</span>
              <button
                onClick={handleCopy}
                className="hover:text-white flex items-center gap-1 transition-all cursor-pointer font-bold"
              >
                {copied ? <Check className="h-3.5 text-emerald-400" /> : <Copy className="h-3.5" />}
                <span>{copied ? "Copied!" : "Copy code"}</span>
              </button>
            </div>
            
            <pre className="p-4 text-[11px] font-mono text-[#E5E5E5] leading-relaxed overflow-x-auto whitespace-pre overflow-y-auto">
              <code>{snippets[activeTab].curl}</code>
            </pre>
          </div>

          {/* Execution Output Console Box */}
          <div className="bg-[#0A0A0A] border border-[#222222] rounded-xl flex flex-col flex-1 min-h-[250px]">
            <div className="bg-[#111111]/60 px-4 py-2 border-b border-[#222222] text-[10px] font-mono text-emerald-400 flex items-center gap-1.5 justify-between font-bold">
              <span className="text-zinc-400">❮ Server JSON Response Console ❯</span>
              {isLoading && <span className="text-emerald-500 animate-pulse font-normal">Waiting for server responses...</span>}
            </div>
            
            <pre className="p-4 text-[11px] font-mono text-emerald-400 leading-relaxed overflow-x-auto overflow-y-auto max-h-[220px] font-bold">
              <code>
                {responseJson ? responseJson : `// Console is ready. Click "Query Live REST Endpoint" to output response packet.`}
              </code>
            </pre>
          </div>

        </div>

      </div>

    </div>
  );
}
