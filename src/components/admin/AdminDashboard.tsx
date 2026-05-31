// src/components/admin/AdminDashboard.tsx
// ✅ النسخة الآمنة — تستدعي /api/admin مع ADMIN_TOKEN
// لا مفاتيح Stellar في الـ frontend

import { useState } from 'react';
import { Flame, Send, PlusCircle, ShieldCheck, AlertCircle, ExternalLink, Copy, CheckCircle2 } from 'lucide-react';
import { adminAction } from '../../services/zenith-api';
import type { AdminResult } from '../../services/zenith-api';

type ActionType = 'mint' | 'burn' | 'distribute';

export function AdminDashboard() {
  const [adminToken,   setAdminToken]   = useState('');
  const [action,       setAction]       = useState<ActionType>('mint');
  const [amount,       setAmount]       = useState('');
  const [destination,  setDestination]  = useState('');
  const [loading,      setLoading]      = useState(false);
  const [result,       setResult]       = useState<AdminResult | null>(null);
  const [error,        setError]        = useState<string | null>(null);
  const [copied,       setCopied]       = useState(false);
  const [showToken,    setShowToken]    = useState(false);

  const ACTION_CONFIG = {
    mint:       { label: 'إصدار ZENITH',  icon: PlusCircle, color: 'from-emerald-500 to-teal-600',  desc: 'إصدار وحدات جديدة للموزع' },
    burn:       { label: 'حرق ZENITH',    icon: Flame,      color: 'from-red-500 to-orange-600',     desc: 'تقليل العرض — إعادة للمصدر' },
    distribute: { label: 'توزيع ZENITH',  icon: Send,       color: 'from-blue-500 to-indigo-600',    desc: 'إرسال مباشر لعنوان محفظة' },
  };

  const cfg  = ACTION_CONFIG[action];
  const Icon = cfg.icon;

  const execute = async () => {
    if (!adminToken) { setError('أدخل Admin Token'); return; }
    if (!amount)     { setError('أدخل الكمية'); return; }
    if (action === 'distribute' && !destination) { setError('أدخل عنوان المستلم'); return; }

    setLoading(true); setError(null); setResult(null);
    try {
      const res = await adminAction(action, amount, adminToken, destination || undefined);
      setResult(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'خطأ غير معروف');
    } finally {
      setLoading(false);
    }
  };

  const copyHash = () => {
    if (result) {
      navigator.clipboard.writeText(result.hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      <div className="max-w-xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="p-3 bg-yellow-400/10 border border-yellow-400/20 rounded-2xl">
            <ShieldCheck className="w-8 h-8 text-yellow-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-gray-400">ZENITH Control Panel · Mainnet</p>
          </div>
        </div>

        {/* Admin Token */}
        <div className="space-y-1">
          <label className="text-xs text-gray-400">🔐 Admin Token (من Vercel Environment Variables)</label>
          <div className="relative">
            <input
              type={showToken ? 'text' : 'password'}
              value={adminToken}
              onChange={e => setAdminToken(e.target.value)}
              placeholder="••••••••••••••••"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white
                         placeholder:text-gray-600 focus:outline-none focus:border-yellow-500 pr-12"
            />
            <button onClick={() => setShowToken(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 text-xs">
              {showToken ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        {/* Action Selector */}
        <div className="grid grid-cols-3 gap-3">
          {(Object.keys(ACTION_CONFIG) as ActionType[]).map(act => {
            const c = ACTION_CONFIG[act];
            const I = c.icon;
            return (
              <button key={act} onClick={() => { setAction(act); setError(null); setResult(null); }}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                  action === act
                    ? 'border-yellow-400 bg-yellow-400/10 text-yellow-300'
                    : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-500'
                }`}>
                <I className="w-5 h-5" />
                <span className="text-xs font-medium text-center leading-tight">{c.label}</span>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-gray-500 text-center -mt-2">{cfg.desc}</p>

        {/* Form */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">

          <div className="space-y-1">
            <label className="text-xs text-gray-400">💰 الكمية (ZENITH)</label>
            <input type="number" min="0.0000001" step="0.0000001"
              value={amount} onChange={e => setAmount(e.target.value)}
              placeholder="مثال: 1000"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white
                         placeholder:text-gray-600 focus:outline-none focus:border-yellow-500" />
          </div>

          {action === 'distribute' && (
            <div className="space-y-1">
              <label className="text-xs text-gray-400">📮 عنوان المستلم (Stellar)</label>
              <input value={destination} onChange={e => setDestination(e.target.value)}
                placeholder="G..."
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white
                           placeholder:text-gray-600 focus:outline-none focus:border-yellow-500" />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-green-400 font-semibold">
                <CheckCircle2 className="w-5 h-5" /> نجحت العملية!
              </div>
              <p className="text-xs text-gray-300">
                {result.action === 'mint'       && `✅ تم إصدار ${result.amount} ZENITH`}
                {result.action === 'burn'       && `🔥 تم حرق ${result.amount} ZENITH`}
                {result.action === 'distribute' && `📤 تم إرسال ${result.amount} ZENITH`}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-mono truncate">{result.hash}</span>
                <button onClick={copyHash} className="shrink-0 text-gray-400 hover:text-white">
                  {copied ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <a href={result.explorerUrl} target="_blank" rel="noreferrer"
                  className="shrink-0 text-blue-400 hover:text-blue-300">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

          {/* Execute */}
          <button onClick={execute} disabled={loading}
            className={`w-full py-4 bg-gradient-to-r ${cfg.color} text-white font-bold rounded-xl
                        hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50
                        flex items-center justify-center gap-2`}>
            {loading
              ? <><span className="animate-spin text-xl">⟳</span> جاري التنفيذ...</>
              : <><Icon className="w-5 h-5" /> {cfg.label}</>}
          </button>
        </div>

        <p className="text-xs text-center text-gray-600">
          🔒 العمليات تُنفَّذ على الخادم فقط · لا مفاتيح في المتصفح
        </p>
      </div>
    </div>
  );
}
