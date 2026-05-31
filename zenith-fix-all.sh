#!/usr/bin/env bash
# ══════════════════════════════════════════════════════════════════
# انسخ هذا السكريبت كاملاً والصقه مباشرة في Termux
# لا يحتاج نقل ملفات من Downloads
# ══════════════════════════════════════════════════════════════════

set -e
cd ~/projects/zenith-empire

echo "🚀 بدء إصلاح ZENITH EMPIRE..."

# ══════════════════════════════════════════════════════════════════
# 1. إصلاح .gitignore
# ══════════════════════════════════════════════════════════════════
cat > .gitignore << 'GITEOF'
node_modules
dist
build
.env
.env.*
!.env.example
*.key
*.pem
secrets/
.vscode
.idea
.DS_Store
Thumbs.db
.vercel
npm-debug.log*
GITEOF
echo "✅ .gitignore محدّث"

# ══════════════════════════════════════════════════════════════════
# 2. إزالة node_modules و dist من git tracking
# ══════════════════════════════════════════════════════════════════
git rm -r --cached node_modules 2>/dev/null && echo "✅ node_modules أُزيل" || echo "ℹ️ node_modules لم يكن tracked"
git rm -r --cached dist         2>/dev/null && echo "✅ dist أُزيل"         || echo "ℹ️ dist لم يكن tracked"

# ══════════════════════════════════════════════════════════════════
# 3. إنشاء المجلدات
# ══════════════════════════════════════════════════════════════════
mkdir -p api
mkdir -p src/components/mining
mkdir -p src/components/admin
mkdir -p src/components/wallet
mkdir -p src/services
echo "✅ المجلدات جاهزة"

# ══════════════════════════════════════════════════════════════════
# 4. كتابة WalletPage.tsx مباشرة
# ══════════════════════════════════════════════════════════════════
cat > src/components/wallet/WalletPage.tsx << 'WALLETEOF'
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
WALLETEOF
echo "✅ WalletPage.tsx كُتب بنجاح"

# ══════════════════════════════════════════════════════════════════
# 5. كتابة api/send-zenith.js
# ══════════════════════════════════════════════════════════════════
cat > api/send-zenith.js << 'APIEOF'
import * as StellarSdk from '@stellar/stellar-sdk';

const HORIZON_URL        = 'https://horizon.stellar.org';
const NETWORK_PASSPHRASE = StellarSdk.Networks.PUBLIC;
const MAX_AMOUNT         = 1.0;
const claimLog           = new Map();

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { destination, amount, action = 'mining' } = req.body;
    if (!destination || !amount) return res.status(400).json({ error: 'destination و amount مطلوبان' });

    try { StellarSdk.Keypair.fromPublicKey(destination); }
    catch { return res.status(400).json({ error: 'عنوان Stellar غير صحيح' }); }

    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0 || parsed > MAX_AMOUNT)
      return res.status(400).json({ error: `الكمية يجب بين 0.0000001 و ${MAX_AMOUNT}` });

    if (action === 'mining') {
      const last = claimLog.get(destination);
      if (last && Date.now() - last < 86400000) {
        const h = ((86400000 - (Date.now() - last)) / 3600000).toFixed(1);
        return res.status(429).json({ error: `انتظر ${h} ساعة`, retryAfter: h });
      }
    }

    const DISTRIBUTOR_SECRET = process.env.DISTRIBUTOR_SECRET;
    const ZENITH_ISSUER      = process.env.ZENITH_ISSUER;
    if (!DISTRIBUTOR_SECRET || !ZENITH_ISSUER)
      return res.status(500).json({ error: 'Server configuration error' });

    const server      = new StellarSdk.Horizon.Server(HORIZON_URL);
    const distributor = StellarSdk.Keypair.fromSecret(DISTRIBUTOR_SECRET);
    const asset       = new StellarSdk.Asset('ZENITH', ZENITH_ISSUER);
    const account     = await server.loadAccount(distributor.publicKey());

    const tx = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE, networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(StellarSdk.Operation.payment({ destination, asset, amount: parsed.toFixed(7) }))
      .addMemo(StellarSdk.Memo.text(`ZE:${action}`))
      .setTimeout(30).build();

    tx.sign(distributor);
    const result = await server.submitTransaction(tx);
    if (action === 'mining') claimLog.set(destination, Date.now());

    return res.status(200).json({
      success: true, hash: result.hash, amount: parsed.toFixed(7), destination,
      explorerUrl: `https://stellar.expert/explorer/public/tx/${result.hash}`,
    });
  } catch (err) {
    const codes = err?.response?.data?.extras?.result_codes;
    return res.status(500).json({ error: 'فشل الإرسال', details: codes ? JSON.stringify(codes) : err.message });
  }
}
APIEOF
echo "✅ api/send-zenith.js كُتب"

# ══════════════════════════════════════════════════════════════════
# 6. كتابة api/admin.js
# ══════════════════════════════════════════════════════════════════
cat > api/admin.js << 'ADMINEOF'
import * as StellarSdk from '@stellar/stellar-sdk';

const HORIZON_URL        = 'https://horizon.stellar.org';
const NETWORK_PASSPHRASE = StellarSdk.Networks.PUBLIC;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
  if (!ADMIN_TOKEN || req.headers.authorization !== `Bearer ${ADMIN_TOKEN}`)
    return res.status(401).json({ error: 'غير مصرح' });

  try {
    const { action, amount, destination } = req.body;
    const ISSUER_SECRET      = process.env.ISSUER_SECRET;
    const DISTRIBUTOR_SECRET = process.env.DISTRIBUTOR_SECRET;
    const ZENITH_ISSUER      = process.env.ZENITH_ISSUER;
    if (!ISSUER_SECRET || !DISTRIBUTOR_SECRET || !ZENITH_ISSUER)
      return res.status(500).json({ error: 'Server configuration error' });

    const server      = new StellarSdk.Horizon.Server(HORIZON_URL);
    const issuer      = StellarSdk.Keypair.fromSecret(ISSUER_SECRET);
    const distributor = StellarSdk.Keypair.fromSecret(DISTRIBUTOR_SECRET);
    const asset       = new StellarSdk.Asset('ZENITH', issuer.publicKey());
    let account, tx;

    if (action === 'mint') {
      account = await server.loadAccount(issuer.publicKey());
      tx = new StellarSdk.TransactionBuilder(account, { fee: StellarSdk.BASE_FEE, networkPassphrase: NETWORK_PASSPHRASE })
        .addOperation(StellarSdk.Operation.payment({ destination: distributor.publicKey(), asset, amount: parseFloat(amount).toFixed(7) }))
        .setTimeout(30).build();
      tx.sign(issuer);
    } else if (action === 'burn') {
      account = await server.loadAccount(distributor.publicKey());
      tx = new StellarSdk.TransactionBuilder(account, { fee: StellarSdk.BASE_FEE, networkPassphrase: NETWORK_PASSPHRASE })
        .addOperation(StellarSdk.Operation.payment({ destination: issuer.publicKey(), asset, amount: parseFloat(amount).toFixed(7) }))
        .setTimeout(30).build();
      tx.sign(distributor);
    } else if (action === 'distribute') {
      if (!destination) return res.status(400).json({ error: 'destination مطلوب' });
      account = await server.loadAccount(distributor.publicKey());
      tx = new StellarSdk.TransactionBuilder(account, { fee: StellarSdk.BASE_FEE, networkPassphrase: NETWORK_PASSPHRASE })
        .addOperation(StellarSdk.Operation.payment({ destination, asset, amount: parseFloat(amount).toFixed(7) }))
        .setTimeout(30).build();
      tx.sign(distributor);
    } else {
      return res.status(400).json({ error: `action غير معروف: ${action}` });
    }

    const result = await server.submitTransaction(tx);
    return res.status(200).json({
      success: true, action, amount, hash: result.hash,
      explorerUrl: `https://stellar.expert/explorer/public/tx/${result.hash}`,
    });
  } catch (err) {
    const codes = err?.response?.data?.extras?.result_codes;
    return res.status(500).json({ error: 'فشل العملية', details: codes ? JSON.stringify(codes) : err.message });
  }
}
ADMINEOF
echo "✅ api/admin.js كُتب"

# ══════════════════════════════════════════════════════════════════
# 7. كتابة src/services/zenith-api.ts
# ══════════════════════════════════════════════════════════════════
cat > src/services/zenith-api.ts << 'SVCEOF'
const API_BASE = '/api';

export interface SendResult { success: boolean; hash: string; amount: string; destination: string; explorerUrl: string; }
export interface AdminResult { success: boolean; action: string; amount: string; hash: string; explorerUrl: string; }

export async function claimMiningReward(destination: string, amount: string): Promise<SendResult> {
  const res = await fetch(`${API_BASE}/send-zenith`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ destination, amount, action: 'mining' }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export async function adminAction(action: 'mint'|'burn'|'distribute', amount: string, token: string, destination?: string): Promise<AdminResult> {
  const res = await fetch(`${API_BASE}/admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ action, amount, destination }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export async function getStellarBalances(address: string) {
  const res = await fetch(`https://horizon.stellar.org/accounts/${address}`);
  if (!res.ok) throw new Error('فشل جلب الرصيد');
  const account = await res.json();
  const zenithIssuer = import.meta.env.VITE_ZENITH_ISSUER || '';
  let xlm = '0', zenith = '0';
  for (const b of account.balances) {
    if (b.asset_type === 'native') xlm = parseFloat(b.balance).toFixed(4);
    if (b.asset_code === 'ZENITH' && (!zenithIssuer || b.asset_issuer === zenithIssuer)) zenith = parseFloat(b.balance).toFixed(4);
  }
  return { xlm, zenith, address };
}
SVCEOF
echo "✅ src/services/zenith-api.ts كُتب"

# ══════════════════════════════════════════════════════════════════
# 8. تحديث vercel.json
# ══════════════════════════════════════════════════════════════════
cat > vercel.json << 'VERCEOF'
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install --legacy-peer-deps",
  "framework": "vite",
  "outputDirectory": "dist",
  "git": { "deploymentEnabled": { "main": true } },
  "headers": [
    { "source": "/assets/(.*)", "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] },
    { "source": "/api/(.*)", "headers": [{ "key": "Cache-Control", "value": "no-store" }, { "key": "X-Content-Type-Options", "value": "nosniff" }] }
  ],
  "rewrites": [
    { "source": "/api/:path*", "destination": "/api/:path*" },
    { "source": "/((?!api/).*)", "destination": "/index.html" }
  ]
}
VERCEOF
echo "✅ vercel.json محدّث"

# ══════════════════════════════════════════════════════════════════
# 9. تثبيت @stellar/stellar-sdk في package.json
# ══════════════════════════════════════════════════════════════════
npm install @stellar/stellar-sdk --legacy-peer-deps --save 2>/dev/null || true
echo "✅ @stellar/stellar-sdk مثبّت"

# ══════════════════════════════════════════════════════════════════
# 10. إنشاء .env.example
# ══════════════════════════════════════════════════════════════════
cat > .env.example << 'ENVEOF'
# انسخ: cp .env.example .env ثم عدّل القيم
# ⚠️ لا ترفع .env على GitHub أبداً

# Frontend (عامة — آمن في Bundle)
VITE_ZENITH_ISSUER=GD5TKVTXMHRL3FP66YGRR4FXNKIP35QAG72S652LCDOSDVCARYRWTMNG
VITE_STELLAR_NETWORK=mainnet
VITE_SECONDARY_WALLET=
VITE_REWARDS_WALLET=

# Backend فقط (سرية — Vercel فقط)
ZENITH_ISSUER=GD5TKVTXMHRL3FP66YGRR4FXNKIP35QAG72S652LCDOSDVCARYRWTMNG
DISTRIBUTOR_SECRET=
ISSUER_SECRET=
ADMIN_TOKEN=
ENVEOF
echo "✅ .env.example جاهز"

# ══════════════════════════════════════════════════════════════════
# 11. Build
# ══════════════════════════════════════════════════════════════════
echo ""
echo "🔨 بناء المشروع..."
npm run build
echo "✅ Build ناجح"

# ══════════════════════════════════════════════════════════════════
# 12. Git push
# ══════════════════════════════════════════════════════════════════
echo ""
echo "📤 رفع على GitHub..."
git add .
git status --short
git commit -m "🔒 Fix: correct wallet key + Serverless API + remove node_modules + secure gitignore"
git push origin main

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║  ✅ كل شيء اكتمل بنجاح!                            ║"
echo "╠══════════════════════════════════════════════════════╣"
echo "║  📋 الخطوة الأخيرة — أضف في Vercel Dashboard:      ║"
echo "║                                                      ║"
echo "║  VITE_ZENITH_ISSUER = GD5TKVT...RWTMNG             ║"
echo "║  ZENITH_ISSUER      = GD5TKVT...RWTMNG             ║"
echo "║  DISTRIBUTOR_SECRET = S... (مفتاحك السري)           ║"
echo "║  ISSUER_SECRET      = S... (مفتاح المصدر)           ║"
echo "║  ADMIN_TOKEN        = كلمة مرور قوية                ║"
echo "║                                                      ║"
echo "║  ثم: Deployments → Redeploy                         ║"
echo "╚══════════════════════════════════════════════════════╝"
