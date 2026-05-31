import { useState, useEffect } from 'react';
import { Copy, ExternalLink, RefreshCw, CheckCircle2, AlertCircle, Shield } from 'lucide-react';

const PRIMARY_WALLET   = 'GD5TKVTXMHRL3FP66YGRR4FXNKIP35QAG72S652LCDOSDVCARYRWTMNG';
const SECONDARY_WALLET = import.meta.env.VITE_SECONDARY_WALLET || '';
const REWARDS_WALLET   = import.meta.env.VITE_REWARDS_WALLET   || '';
const ZENITH_ISSUER    = import.meta.env.VITE_ZENITH_ISSUER    || PRIMARY_WALLET;
const HORIZON_URL      = 'https://horizon.stellar.org';

const WALLETS = [
  { key: 'primary',   label: 'Primary Wallet',   address: PRIMARY_WALLET,   color: 'from-blue-500 to-cyan-500',    icon: '💎' },
  { key: 'secondary', label: 'Secondary Wallet',  address: SECONDARY_WALLET, color: 'from-purple-500 to-pink-500',  icon: '💼' },
  { key: 'rewards',   label: 'Rewards Wallet',    address: REWARDS_WALLET,   color: 'from-green-500 to-emerald-500',icon: '🎁' },
];

interface Bal { xlm: string; zenith: string; loading: boolean; error: string | null; }

async function fetchBal(address: string): Promise<{ xlm: string; zenith: string }> {
  if (!address || !address.startsWith('G')) return { xlm: '—', zenith: '—' };
  const res = await fetch(`${HORIZON_URL}/accounts/${address}`);
  if (!res.ok) throw new Error('Account not found');
  const data = await res.json();
  let xlm = '0', zenith = '0';
  for (const b of data.balances) {
    if (b.asset_type === 'native') xlm = parseFloat(b.balance).toLocaleString('en', { maximumFractionDigits: 2 });
    if (b.asset_code === 'ZENITH' && b.asset_issuer === ZENITH_ISSUER) zenith = parseFloat(b.balance).toFixed(4);
  }
  return { xlm, zenith };
}

export function WalletPage() {
  const [bals, setBals] = useState<Record<string, Bal>>(
    Object.fromEntries(WALLETS.map(w => [w.key, { xlm: '—', zenith: '—', loading: false, error: null }]))
  );
  const [copied, setCopied] = useState<string | null>(null);

  const load = async (key: string, address: string) => {
    if (!address || !address.startsWith('G')) return;
    setBals(p => ({ ...p, [key]: { ...p[key], loading: true, error: null } }));
    try {
      const b = await fetchBal(address);
      setBals(p => ({ ...p, [key]: { ...b, loading: false, error: null } }));
    } catch {
      setBals(p => ({ ...p, [key]: { ...p[key], loading: false, error: 'تعذّر جلب الرصيد' } }));
    }
  };

  useEffect(() => { WALLETS.forEach(w => load(w.key, w.address)); }, []);

  const copy = (addr: string) => {
    navigator.clipboard.writeText(addr);
    setCopied(addr);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-4 p-4 pb-24">
      <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
        <Shield className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-400/80">Never share your secret keys. These are public addresses only. Always verify addresses before sending transactions.</p>
      </div>

      <div className="flex justify-end">
        <button onClick={() => WALLETS.forEach(w => load(w.key, w.address))}
          className="flex items-center gap-2 text-xs text-gray-400 hover:text-white px-3 py-1.5 bg-gray-800 rounded-lg transition-colors">
          <RefreshCw className="w-3.5 h-3.5" /> تحديث الأرصدة
        </button>
      </div>

      {WALLETS.map(w => {
        const b = bals[w.key];
        return (
          <div key={w.key} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className={`bg-gradient-to-r ${w.color} p-0.5`}>
              <div className="bg-gray-900 rounded-2xl m-0.5">
                <div className="flex items-center gap-3 p-4">
                  <span className="text-2xl">{w.icon}</span>
                  <div>
                    <p className="text-sm font-bold text-white">{w.label}</p>
                    <p className="text-xs text-gray-400">Stellar Network · Mainnet</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-800/50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">XLM</p>
                  {b.loading ? <div className="h-5 bg-gray-700 rounded animate-pulse" /> :
                    <p className="text-base font-bold text-white">{b.xlm}</p>}
                </div>
                <div className="bg-gray-800/50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">ZENITH</p>
                  {b.loading ? <div className="h-5 bg-gray-700 rounded animate-pulse" /> :
                    <p className="text-base font-bold text-yellow-400">{b.zenith}</p>}
                </div>
              </div>
              {b.error && <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{b.error}</p>}
              <div>
                <p className="text-xs text-gray-500 mb-2">Public Address</p>
                <div className="bg-gray-800 rounded-xl p-3 font-mono text-xs text-gray-300 break-all">
                  {w.address && w.address.startsWith('G') ? `${w.address.slice(0,10)}...${w.address.slice(-6)}` : (w.address || 'غير مُعيَّن — أضف في Vercel Variables')}
                </div>
              </div>
              <div className="flex gap-2">
                {w.address && w.address.startsWith('G') && (
                  <>
                    <button onClick={() => copy(w.address)}
                      className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white text-sm py-2.5 rounded-xl transition-colors">
                      {copied === w.address ? <><CheckCircle2 className="w-4 h-4 text-green-400" />تم النسخ</> : <><Copy className="w-4 h-4" />Copy</>}
                    </button>
                    <a href={`https://stellar.expert/explorer/public/account/${w.address}`}
                      target="_blank" rel="noreferrer"
                      className="p-2.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-xl transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <h3 className="font-bold text-white mb-3 flex items-center gap-2"><span>🔗</span> Connect Wallet</h3>
        <button onClick={() => alert('Install Freighter wallet extension on desktop browser')}
          className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:scale-[1.01] transition-all">
          Connect Freighter Wallet
        </button>
        <p className="text-xs text-gray-500 mt-3 text-center">Install Freighter wallet extension to connect your Stellar account</p>
      </div>
    </div>
  );
}
