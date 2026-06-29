import { useState, useEffect } from 'react';
import { Copy, ExternalLink, RefreshCw, CheckCircle2, Shield, AlertTriangle } from 'lucide-react';

const WALLETS = [
  { key: 'primary',   label: 'المحفظة الرئيسية',  address: 'GCMRPF2KNTNFSNB7LIX6KDWKLVGMGNZT2ACHCMF2R3OX5YZFSQPYTEP6', color: 'from-blue-500 to-cyan-500',     icon: '💎', showUser: true  },
  { key: 'secondary', label: 'المحفظة الثانوية',   address: 'GDPMNWGH6XOT2FEF7KR7TQO3K2IRQOTX4ONZBOCRD6QY73OXDLEDPKEX',  color: 'from-purple-500 to-pink-500',   icon: '💼', showUser: true  },
  { key: 'rewards',   label: 'محفظة المكافآت',     address: 'GCPPXIL53RYAJDL7XVNOBPCXFKVUJB6WT4KYUKPDMHWBZUMF5JDMY2WP',  color: 'from-green-500 to-emerald-500', icon: '🎁', showUser: true  },
  { key: 'dist',      label: 'ZENITH Distributor', address: 'GB6TK6UPBQAIHYLPYGJDLCLXB2HLP452DPDNRNR2JETEDPSXKWOCXLZB',  color: 'from-yellow-500 to-orange-500', icon: '🪙', showUser: false },
];

const HORIZON = 'https://horizon.stellar.org';
const ZENITH_ISSUER = 'GA3T3OZ5V2JAZR5RCH3NII7JBNUMDPBSSXF6N6HKZGLTM5JSZCX7OTFQ';
const XLM_WARNING = 5;

async function fetchBal(address: string) {
  if (!address?.startsWith('G')) return { xlm: '—', zenith: '—', xlmRaw: 0 };
  try {
    const res = await fetch(`${HORIZON}/accounts/${address}`);
    if (!res.ok) return { xlm: '0', zenith: '0', xlmRaw: 0 };
    const data = await res.json();
    let xlm = '0', zenith = '0', xlmRaw = 0;
    for (const b of data.balances) {
      if (b.asset_type === 'native') {
        xlmRaw = parseFloat(b.balance);
        xlm = xlmRaw.toLocaleString('en', { maximumFractionDigits: 2 });
      }
      if (b.asset_code === 'ZENITH' && b.asset_issuer === ZENITH_ISSUER)
        zenith = parseFloat(b.balance).toLocaleString('en', { maximumFractionDigits: 2 });
    }
    return { xlm, zenith, xlmRaw };
  } catch { return { xlm: '—', zenith: '—', xlmRaw: 0 }; }
}

export function WalletPage() {
  const [bals, setBals] = useState<Record<string, { xlm: string; zenith: string; xlmRaw: number; loading: boolean }>>({});
  const [copied, setCopied] = useState<string | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);

  const load = async (key: string, address: string) => {
    setBals(p => ({ ...p, [key]: { xlm: '—', zenith: '—', xlmRaw: 0, loading: true } }));
    const b = await fetchBal(address);
    setBals(p => ({ ...p, [key]: { ...b, loading: false } }));
  };

  useEffect(() => { WALLETS.forEach(w => load(w.key, w.address)); }, []);

  const copy = (addr: string) => {
    navigator.clipboard.writeText(addr);
    setCopied(addr);
    setTimeout(() => setCopied(null), 2000);
  };

  const distBal = bals['dist'];
  const visibleWallets = WALLETS.filter(w => w.showUser || showAdmin);

  return (
    <div className="space-y-4 p-4 pb-24">

      {/* تحذير أمني */}
      <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
        <Shield className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-400/80">لا تشارك مفاتيحك السرية أبداً. هذه عناوين عامة فقط.</p>
      </div>

      {/* تحذير XLM منخفض للـ Distributor */}
      {distBal && !distBal.loading && distBal.xlmRaw < XLM_WARNING && distBal.xlmRaw > 0 && (
        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <p className="text-xs text-red-400">⚠️ تحذير: رصيد XLM في Distributor منخفض ({distBal.xlm} XLM). يرجى الشحن لضمان استمرار العمليات.</p>
        </div>
      )}

      {/* زر تحديث */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowAdmin(p => !p)}
          className="text-xs text-gray-500 hover:text-gray-300 px-3 py-1.5 bg-gray-800/50 rounded-lg transition-colors">
          {showAdmin ? '🔒 إخفاء Admin' : '⚙️ Admin'}
        </button>
        <button
          onClick={() => WALLETS.forEach(w => load(w.key, w.address))}
          className="flex items-center gap-2 text-xs text-gray-400 hover:text-white px-3 py-1.5 bg-gray-800 rounded-lg transition-colors">
          <RefreshCw className="w-3.5 h-3.5" /> تحديث الأرصدة
        </button>
      </div>

      {/* المحافظ */}
      {visibleWallets.map(w => {
        const b = bals[w.key] || { xlm: '—', zenith: '—', xlmRaw: 0, loading: false };
        const lowXlm = w.key === 'dist' && !b.loading && b.xlmRaw > 0 && b.xlmRaw < XLM_WARNING;
        return (
          <div key={w.key} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className={`bg-gradient-to-r ${w.color} p-0.5`}>
              <div className="bg-gray-900 rounded-2xl m-0.5 flex items-center gap-3 p-4">
                <span className="text-2xl">{w.icon}</span>
                <div>
                  <p className="text-sm font-bold text-white">{w.label}</p>
                  <p className="text-xs text-gray-400">Stellar Mainnet</p>
                </div>
                {lowXlm && <AlertTriangle className="w-4 h-4 text-red-400 ml-auto" />}
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className={`rounded-xl p-3 ${lowXlm ? 'bg-red-500/10 border border-red-500/20' : 'bg-gray-800/50'}`}>
                  <p className="text-xs text-gray-500 mb-1">XLM</p>
                  {b.loading
                    ? <div className="h-5 bg-gray-700 rounded animate-pulse" />
                    : <p className={`text-base font-bold ${lowXlm ? 'text-red-400' : 'text-white'}`}>{b.xlm}</p>}
                </div>
                <div className="bg-gray-800/50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">ZENITH</p>
                  {b.loading
                    ? <div className="h-5 bg-gray-700 rounded animate-pulse" />
                    : <p className="text-base font-bold text-yellow-400">{b.zenith}</p>}
                </div>
              </div>
              <div className="bg-gray-800 rounded-xl p-3 font-mono text-xs text-gray-300 break-all">
                {w.address.slice(0, 10)}...{w.address.slice(-6)}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => copy(w.address)}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white text-sm py-2.5 rounded-xl transition-colors">
                  {copied === w.address
                    ? <><CheckCircle2 className="w-4 h-4 text-green-400" />تم النسخ</>
                    : <><Copy className="w-4 h-4" />نسخ</>}
                </button>
                <a href={`https://stellar.expert/explorer/public/account/${w.address}`}
                  target="_blank" rel="noreferrer"
                  className="p-2.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-xl transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
