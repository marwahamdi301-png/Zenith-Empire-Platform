// src/components/mining/MobileMining.tsx
// ✅ النسخة الآمنة — تستدعي /api/send-zenith بدلاً من Stellar SDK مباشرة

import { useState, useEffect } from 'react';
import { Cpu, Zap, Clock, CheckCircle, Wallet, AlertCircle, ExternalLink } from 'lucide-react';
import { claimMiningReward } from '../../services/zenith-api';

const MINING_DURATION_MS = 20_000; // 20 ثانية
const COOLDOWN_MS        = 24 * 60 * 60 * 1000;

export function MobileMining() {
  const [walletAddress, setWalletAddress] = useState(
    localStorage.getItem('zenith_wallet') || ''
  );
  const [progress,    setProgress]    = useState(0);
  const [isActive,    setIsActive]    = useState(false);
  const [sending,     setSending]     = useState(false);
  const [totalMined,  setTotalMined]  = useState(
    parseFloat(localStorage.getItem('zenith_mined') || '0')
  );
  const [lastClaim,   setLastClaim]   = useState(
    parseInt(localStorage.getItem('zenith_last_claim') || '0')
  );
  const [txHash,      setTxHash]      = useState<string | null>(null);
  const [error,       setError]       = useState<string | null>(null);

  const inCooldown = Date.now() - lastClaim < COOLDOWN_MS;
  const hoursLeft  = Math.max(0, (COOLDOWN_MS - (Date.now() - lastClaim)) / 3_600_000);

  // ── تقدم شريط التعدين ─────────────────────────────────────────
  useEffect(() => {
    if (!isActive) return;
    const start   = Date.now();
    const interval = setInterval(() => {
      const pct = Math.min(100, ((Date.now() - start) / MINING_DURATION_MS) * 100);
      setProgress(pct);
      if (pct >= 100) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, [isActive]);

  const startMining = () => {
    if (!walletAddress.startsWith('G') || walletAddress.length < 56) {
      setError('أدخل عنوان Stellar صحيح (يبدأ بـ G)');
      return;
    }
    if (inCooldown) {
      setError(`انتظر ${hoursLeft.toFixed(1)} ساعة`);
      return;
    }
    setError(null); setTxHash(null);
    setProgress(0); setIsActive(true);
  };

  const claimReward = async () => {
    const reward = (0.5 + Math.random() * 0.2).toFixed(7);
    setSending(true); setError(null);
    try {
      // ← هنا الاستدعاء الآمن للـ API
      const result = await claimMiningReward(walletAddress, reward);

      const newTotal = totalMined + parseFloat(reward);
      localStorage.setItem('zenith_mined',      newTotal.toString());
      localStorage.setItem('zenith_last_claim', Date.now().toString());

      setTotalMined(newTotal);
      setLastClaim(Date.now());
      setTxHash(result.hash);
      setIsActive(false);
      setProgress(0);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'خطأ في الإرسال');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-gray-900/80 backdrop-blur border border-yellow-500/20 rounded-2xl p-6 space-y-5 shadow-2xl">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-lg shadow-orange-500/30">
            <Cpu className="w-6 h-6 text-black" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Mobile Mining</h3>
            <p className="text-xs text-yellow-400/70">Proof-of-Activity · Stellar Mainnet</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-yellow-400">{totalMined.toFixed(2)}</p>
          <p className="text-xs text-gray-400">ZENITH Mined</p>
        </div>
      </div>

      {/* Wallet */}
      <div className="space-y-1">
        <label className="text-xs text-gray-400 flex items-center gap-1">
          <Wallet className="w-3 h-3" /> عنوان محفظتك Stellar
        </label>
        <input
          value={walletAddress}
          onChange={e => {
            setWalletAddress(e.target.value);
            localStorage.setItem('zenith_wallet', e.target.value);
            setError(null);
          }}
          placeholder="G..."
          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white
                     placeholder:text-gray-600 focus:outline-none focus:border-yellow-500 transition-colors"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="flex gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />{error}
        </div>
      )}

      {/* TX Success */}
      {txHash && (
        <a href={`https://stellar.expert/explorer/public/tx/${txHash}`}
           target="_blank" rel="noreferrer"
           className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 text-sm text-green-400 hover:bg-green-500/20 transition-colors">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span className="truncate">✅ {txHash.slice(0, 24)}...</span>
          <ExternalLink className="w-3 h-3 ml-auto shrink-0" />
        </a>
      )}

      {/* Actions */}
      {!isActive && !inCooldown && (
        <button onClick={startMining}
          className="w-full py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-xl
                     hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
          <Zap className="w-5 h-5" /> ابدأ جلسة التعدين
        </button>
      )}

      {isActive && (
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-gray-300">
            <span>جارٍ التعدين...</span>
            <span className="text-yellow-400 font-mono">{progress.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full transition-all duration-200 rounded-full"
                 style={{ width: `${progress}%` }} />
          </div>
          {progress >= 100 && (
            <button onClick={claimReward} disabled={sending}
              className="w-full py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all
                         flex items-center justify-center gap-2 disabled:opacity-60">
              {sending
                ? <><span className="animate-spin">⟳</span> جاري الإرسال على Stellar...</>
                : <><CheckCircle className="w-5 h-5" /> اطلب مكافأتك</>}
            </button>
          )}
        </div>
      )}

      {inCooldown && !isActive && (
        <div className="bg-gray-800/50 rounded-xl p-4 text-center space-y-1">
          <Clock className="w-6 h-6 text-gray-400 mx-auto" />
          <p className="text-sm text-gray-400">الجلسة القادمة بعد</p>
          <p className="text-2xl font-bold text-yellow-400">{hoursLeft.toFixed(1)}h</p>
        </div>
      )}

      <p className="text-xs text-gray-600 text-center">
        🔒 المعاملات تُعالَج بأمان عبر خادم Vercel · Stellar Mainnet
      </p>
    </div>
  );
}
