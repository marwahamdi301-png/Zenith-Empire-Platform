import React, { useState } from 'react';
import { LayoutDashboard, ArrowUpDown, Shield, Layers, Globe, TrendingUp, Wallet } from 'lucide-react';

const WALLET_CONFIG = {
  incomingMultisig1: "GCMRPF2KNTNFSNB7LIX6KDWKLVGMGNZT2ACHCMF2R3OX5YZFSQPYTEP6",
  incomingMultisig2: "GDPMNWGH6XOT2FEF7KR7TQO3K2IRQOTX4ONZBOCRD6QY73OXDLEDPKEX",
  outgoingAddress: "GD5TKVTXMHRL3FP66YGRR4FXNKIP35QAG72S652LCDOSDVCARYRWTMNG",
  network: "mainnet",
  platformName: "ZENITH EMPIRE"
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [piAmount, setPiAmount] = useState('100');
  const zntOutput = (parseFloat(piAmount) || 0) * 12.5;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <nav className="border-b border-slate-900 bg-slate-900/50 backdrop-blur sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-cyan-500 to-blue-600 p-2 rounded-xl text-white">
            <Layers className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="font-black text-xl tracking-wider bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
              {WALLET_CONFIG.platformName}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-full text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="text-slate-400">Pi Mainnet:</span>
          <span className="text-slate-200 text-[10px] font-bold">
            {WALLET_CONFIG.outgoingAddress.slice(0,6)}...{WALLET_CONFIG.outgoingAddress.slice(-6)}
          </span>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="space-y-2 lg:col-span-1">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'dashboard' ? 'bg-cyan-600/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-400 hover:bg-slate-900'}`}>
            <LayoutDashboard className="w-4 h-4" /> لوحة التحكم الإحصائية
          </button>
          <button onClick={() => setActiveTab('trading')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'trading' ? 'bg-cyan-600/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-400 hover:bg-slate-900'}`}>
            <ArrowUpDown className="w-4 h-4" /> محرك تداول ZNT / PI
          </button>
          <button onClick={() => setActiveTab('security')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'security' ? 'bg-cyan-600/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-400 hover:bg-slate-900'}`}>
            <Shield className="w-4 h-4" /> إعدادات الأمان والمحافظ
          </button>
        </div>

        <div className="lg:col-span-3">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900/50 border border-slate-900 p-5 rounded-2xl">
                  <div className="text-slate-500 text-xs font-medium">معدل العائد لـ Staking</div>
                  <div className="text-2xl font-bold text-emerald-400">up to 24% APY</div>
                </div>
                <div className="bg-slate-900/50 border border-slate-900 p-5 rounded-2xl">
                  <div className="text-slate-500 text-xs font-medium">التغطية الإقليمية</div>
                  <div className="text-2xl font-bold text-cyan-400">54 دولة أفريقية</div>
                </div>
                <div className="bg-slate-900/50 border border-slate-900 p-5 rounded-2xl">
                  <div className="text-slate-500 text-xs font-medium">حالة الجدار الناري المالي</div>
                  <div className="text-sm font-mono text-slate-300">Mainnet Protected</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-6 rounded-2xl">
                <h2 className="text-xl font-bold mb-3 flex items-center gap-2 text-white">
                  <Globe className="w-5 h-5 text-cyan-400" /> الرؤية الاجتماعية والبيئية لمنصة Baya Empire
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  تأسست المنصة لدمج حلول تداول العملات الرقمية المتقدمة مع الأنظمة البيئية والاجتماعية المستدامة في القارة الأفريقية وتوفير سيولة ومبادلات حقيقية لعملة Pi عبر شبكة المايننت الرسمية.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'trading' && (
            <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" /> محرك المبادلة الفوري اللحظي (ZNT / PI)
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-2">أدخل كمية PI المراد مبادلتها:</label>
                  <input type="number" value={piAmount} onChange={(e) => setPiAmount(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 text-white" />
                </div>
                <div className="bg-slate-950 border border-slate-900 p-4 rounded-xl flex justify-between items-center">
                  <div>
                    <span className="block text-xs text-slate-500">الكمية المقدرة من توكن Zenith الممنوحة:</span>
                    <span className="text-lg font-bold text-cyan-400">{zntOutput.toLocaleString()} ZNT</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Wallet className="w-5 h-5 text-cyan-400" /> المعمارية الأمنية وعناوين محافظ المايننت المربوطة
              </h3>
              <div className="space-y-3 font-mono text-xs">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-900">
                  <span className="text-slate-500 block">Incoming Multisig 1:</span>
                  <span className="text-slate-300 break-all">{WALLET_CONFIG.incomingMultisig1}</span>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-900">
                  <span className="text-slate-500 block">Incoming Multisig 2:</span>
                  <span className="text-slate-300 break-all">{WALLET_CONFIG.incomingMultisig2}</span>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 border-l-2 border-l-cyan-500">
                  <span className="text-cyan-400 block font-bold">Active Outgoing User-Payout:</span>
                  <span className="text-slate-200 break-all font-bold">{WALLET_CONFIG.outgoingAddress}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
