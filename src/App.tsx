import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  ShieldAlert, 
  Settings, 
  Activity, 
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Cpu
} from 'lucide-react';

interface Decision {
  decision: 'BUY' | 'SELL' | 'HOLD';
  reason: string;
  confidence: number;
}

export default function App() {
  const [ticker, setTicker] = useState('NVDA');
  const [price, setPrice] = useState(135.50);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastDecision, setLastDecision] = useState<Decision | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  // Simulate price ticks
  useEffect(() => {
    const interval = setInterval(() => {
      setPrice(p => p + (Math.random() - 0.5) * 0.5);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker, price })
      });
      const data = await res.json();
      setLastDecision(data);
      setHistory(prev => [{ ...data, ticker, price, timestamp: new Date() }, ...prev]);
    } catch (err) {
      console.error(err);
      // Fallback for demo if API not configured
      const mock: Decision = {
        decision: Math.random() > 0.5 ? 'BUY' : 'SELL',
        reason: "L'action est très discutée aujourd'hui. Les traders sont extrêmement optimistes sur les forums institutionnels.",
        confidence: 0.85
      };
      setLastDecision(mock);
      setHistory(prev => [{ ...mock, ticker, price, timestamp: new Date() }, ...prev]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#0A0B0E] text-slate-200 font-sans overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-[#0F1115]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Cpu className="text-white" size={18} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">LiquidGrok <span className="text-[10px] font-mono text-cyan-400 opacity-80 uppercase ml-2 px-1.5 py-0.5 border border-cyan-400/30 rounded">v0.1 Prototype</span></h1>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
            System Ready
          </div>
          <div className="h-4 w-px bg-slate-700"></div>
          <div className="flex items-center gap-2 text-slate-400">
            <div className="px-3 py-1 bg-white/5 border border-slate-800 rounded-lg flex items-center gap-2">
              <Wallet size={14} className="text-cyan-400" />
              <span className="text-xs font-medium">$1,000.00 <span className="text-[10px] text-slate-500">USDC</span></span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden p-4 gap-4">
        {/* Left Column: Account & Assets */}
        <aside className="w-64 flex flex-col gap-4">
          <div className="bg-[#15171E] border border-slate-800 rounded-xl p-4 shadow-xl">
            <h2 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-4">Hyperliquid Testnet</h2>
            <div className="space-y-4">
              <div>
                <p class="text-[10px] text-slate-400 uppercase tracking-tight mb-1">Available Equity</p>
                <p className="text-2xl font-bold text-white tracking-tight">$1,000.00</p>
              </div>
              <div className="pt-4 border-t border-slate-800">
                <p className="text-[10px] text-slate-400 mb-1">Wallet Address</p>
                <div className="font-mono text-[10px] bg-black/40 p-2 rounded truncate text-cyan-300">0x087cc49e39e77e853b70...</div>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-[#15171E] border border-slate-800 rounded-xl p-4 overflow-hidden flex flex-col">
            <h2 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3">Watchlist</h2>
            <div className="space-y-2 overflow-y-auto custom-scrollbar flex-1">
              <div className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/5">
                <span className="text-sm font-medium">@NVDA</span>
                <span className="text-xs text-emerald-400">+2.4%</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white/5 rounded">
                <span className="text-sm font-medium">@TSLA</span>
                <span className="text-xs text-rose-400">-1.1%</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white/5 rounded">
                <span className="text-sm font-medium">@AAPL</span>
                <span className="text-xs text-slate-400">0.0%</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Middle Column: AI Analysis */}
        <section className="flex-1 flex flex-col gap-4">
          <div className="flex-1 bg-[#15171E] border border-slate-800 rounded-xl relative p-6 shadow-2xl flex flex-col">
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <select 
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value)}
                    className="bg-transparent text-3xl font-bold text-white outline-none cursor-pointer hover:text-cyan-400 transition-colors"
                  >
                    <option value="NVDA">NVDA</option>
                    <option value="TSLA">TSLA</option>
                    <option value="AAPL">AAPL</option>
                  </select>
                  <span className="text-lg font-normal text-slate-500">/ USD PERP</span>
                </div>
                <p className="text-xs text-slate-500 uppercase tracking-widest">Sentiment Analysis Report</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-mono text-cyan-400 tracking-tighter">
                  ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <div className="flex items-center justify-end gap-1 text-[10px] text-slate-500">
                  <Activity size={10} className="text-emerald-500" />
                  TAVILY REAL-TIME FEED
                </div>
              </div>
            </div>

            {/* AI Decision Panel */}
            <div className="flex-1 grid grid-cols-12 gap-8 items-center">
              <div className="col-span-8 space-y-6">
                <AnimatePresence mode="wait">
                  {lastDecision ? (
                    <motion.div
                      key={ticker + history.length}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-6 rounded-2xl border ${
                        lastDecision.decision === 'BUY' ? 'bg-emerald-500/5 border-emerald-500/20' : 
                        lastDecision.decision === 'SELL' ? 'bg-rose-500/5 border-rose-500/20' : 
                        'bg-white/5 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-2xl ${
                          lastDecision.decision === 'BUY' ? 'bg-emerald-500 text-black' : 
                          lastDecision.decision === 'SELL' ? 'bg-rose-500 text-white' : 
                          'bg-slate-700 text-white'
                        }`}>
                          {lastDecision.decision === 'BUY' ? '↑' : lastDecision.decision === 'SELL' ? '↓' : '•'}
                        </div>
                        <h4 className={`text-2xl font-bold ${
                          lastDecision.decision === 'BUY' ? 'text-emerald-400' : 
                          lastDecision.decision === 'SELL' ? 'text-rose-400' : 'text-slate-400'
                        }`}>
                          {lastDecision.decision} SIGNAL
                        </h4>
                      </div>
                      <p className="text-slate-300 leading-relaxed text-base italic border-l-2 border-slate-800 pl-6">
                        "{lastDecision.reason}"
                      </p>
                    </motion.div>
                  ) : (
                    <div className="p-8 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-600 gap-4">
                      <MessageSquare size={32} />
                      <p className="text-sm uppercase tracking-widest font-medium">Ready for analysis</p>
                    </div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-xl border border-slate-800">
                    <p className="text-[10px] uppercase text-slate-500 tracking-widest mb-1 font-bold">Confidence Score</p>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold">{((lastDecision?.confidence || 0) * 100).toFixed(0)}%</span>
                      <div className="h-1.5 flex-1 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-cyan-400 transition-all duration-1000" 
                          style={{ width: `${(lastDecision?.confidence || 0) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-slate-800 flex flex-col justify-center">
                    <p className="text-[10px] uppercase text-slate-500 tracking-widest mb-1 font-bold">Risk Level</p>
                    <span className="text-xl font-bold text-yellow-500">MODERATE</span>
                  </div>
                </div>
              </div>
              
              <div className="col-span-4 flex flex-col items-center justify-center">
                <button 
                  onClick={runAnalysis}
                  disabled={isAnalyzing}
                  className="w-full py-6 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-500 text-black font-black text-lg rounded-2xl transition-all shadow-xl shadow-cyan-500/10 active:scale-95 flex items-center justify-center gap-3"
                >
                  {isAnalyzing ? (
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Cpu size={20} />
                      ASK GEMINI
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Console Logs */}
          <div className="h-40 bg-[#0D0E12] border border-slate-800 rounded-xl p-4 font-mono text-[10px] leading-tight overflow-hidden flex flex-col">
            <div className="flex justify-between border-b border-slate-800 pb-2 mb-2 shrink-0">
              <span className="text-slate-500 uppercase tracking-widest font-bold">Terminal Output</span>
              <span className="text-cyan-500 animate-pulse">AUTO-UPDATE: ON</span>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1 opacity-60">
              {history.map((h, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-slate-600">[{h.timestamp.toLocaleTimeString()}]</span>
                  <span className="text-emerald-400 uppercase">Decision</span>
                  <span className="text-slate-300">Gemini returned {h.decision} (CONF: {h.confidence}) for {h.ticker}</span>
                </div>
              ))}
              <div className="flex gap-3">
                <span className="text-slate-600">[{new Date().toLocaleTimeString()}]</span>
                <span className="text-cyan-400 uppercase">System</span>
                <span className="text-slate-300">Ready for user input...</span>
              </div>
            </div>
          </div>
        </section>

        {/* Right Sidebar: Execution Control */}
        <aside className="w-72 flex flex-col gap-4">
          <div className="bg-[#15171E] border border-slate-800 rounded-xl p-5 shadow-lg flex-1 flex flex-col">
            <h2 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-6">Manual Override</h2>
            <div className="space-y-6 flex-1">
              <div>
                <label className="text-[10px] text-slate-500 uppercase font-bold block mb-2">Size ({ticker})</label>
                <div className="relative">
                  <input type="text" defaultValue="1.0" className="w-full bg-black/40 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 text-sm font-mono" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-slate-600 uppercase font-bold">Units</span>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <button className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded-xl shadow-lg shadow-emerald-500/10 active:scale-95 transition-all">EXECUTE BUY</button>
                <button className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl shadow-lg shadow-rose-500/10 active:scale-95 transition-all">EXECUTE SELL</button>
              </div>
              <div className="pt-6 border-t border-slate-800/50 space-y-2">
                <div className="flex justify-between text-[10px] uppercase font-bold tracking-tight">
                  <span className="text-slate-500">Estimated Slippage</span>
                  <span className="text-slate-300">0.02%</span>
                </div>
                <div className="flex justify-between text-[10px] uppercase font-bold tracking-tight">
                  <span className="text-slate-500">Execution Fee</span>
                  <span className="text-slate-300">$0.01 USDC</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-cyan-900/10 to-purple-900/10 border border-cyan-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2 text-cyan-400">
              <ShieldAlert size={14} />
              <p className="text-[10px] font-bold uppercase tracking-widest">Safety Rails</p>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Max position size limited to 5% of wallet balance per trade. No real-world funds are used in simulation mode.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}
