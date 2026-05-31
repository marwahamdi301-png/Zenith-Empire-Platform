// api/send-zenith.js
// ✅ Vercel Serverless Function — DISTRIBUTOR_SECRET يبقى على الخادم فقط
// المفتاح السري لا يصل للمتصفح أبداً

import * as StellarSdk from '@stellar/stellar-sdk';

// ─── إعداد الشبكة (Mainnet) ────────────────────────────────────────
const HORIZON_URL        = 'https://horizon.stellar.org';
const NETWORK_PASSPHRASE = StellarSdk.Networks.PUBLIC; // ← Mainnet

// ─── حدود الأمان ────────────────────────────────────────────────────
const MAX_ZENITH_PER_CLAIM = 1.0;   // الحد الأقصى لكل مطالبة
const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 ساعة
const claimLog = new Map(); // في الإنتاج: استخدم Redis أو KV

export default async function handler(req, res) {

  // ── CORS ──────────────────────────────────────────────────────────
  res.setHeader('Access-Control-Allow-Origin', 'https://zenith-empire-cyan.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { destination, amount, action = 'mining' } = req.body;

    // ── التحقق من المدخلات ─────────────────────────────────────────
    if (!destination || !amount) {
      return res.status(400).json({ error: 'destination و amount مطلوبان' });
    }

    // التحقق من صحة عنوان Stellar
    try {
      StellarSdk.Keypair.fromPublicKey(destination);
    } catch {
      return res.status(400).json({ error: 'عنوان Stellar غير صحيح' });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0 || parsedAmount > MAX_ZENITH_PER_CLAIM) {
      return res.status(400).json({
        error: `الكمية يجب أن تكون بين 0.0000001 و ${MAX_ZENITH_PER_CLAIM} ZENITH`,
      });
    }

    // ── Rate Limiting (24h per wallet) ────────────────────────────
    if (action === 'mining') {
      const lastClaim = claimLog.get(destination);
      if (lastClaim && Date.now() - lastClaim < RATE_LIMIT_WINDOW_MS) {
        const hoursLeft = ((RATE_LIMIT_WINDOW_MS - (Date.now() - lastClaim)) / 3_600_000).toFixed(1);
        return res.status(429).json({
          error: `انتظر ${hoursLeft} ساعة حتى المطالبة القادمة`,
          retryAfter: hoursLeft,
        });
      }
    }

    // ── المفاتيح من بيئة الخادم فقط ─────────────────────────────
    const DISTRIBUTOR_SECRET = process.env.DISTRIBUTOR_SECRET;
    const ZENITH_ISSUER      = process.env.ZENITH_ISSUER;

    if (!DISTRIBUTOR_SECRET || !ZENITH_ISSUER) {
      console.error('❌ متغيرات البيئة ناقصة على الخادم');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // ── إرسال ZENITH على Stellar Mainnet ─────────────────────────
    const server      = new StellarSdk.Horizon.Server(HORIZON_URL);
    const distributor = StellarSdk.Keypair.fromSecret(DISTRIBUTOR_SECRET);
    const asset       = new StellarSdk.Asset('ZENITH', ZENITH_ISSUER);

    // التحقق من رصيد الموزع أولاً
    const distAccount = await server.loadAccount(distributor.publicKey());
    const zenithBalance = distAccount.balances.find(
      b => b.asset_type !== 'native' && b.asset_code === 'ZENITH' && b.asset_issuer === ZENITH_ISSUER
    );

    if (!zenithBalance || parseFloat(zenithBalance.balance) < parsedAmount) {
      return res.status(503).json({ error: 'رصيد الموزع غير كافٍ مؤقتاً' });
    }

    // بناء وإرسال المعاملة
    const tx = new StellarSdk.TransactionBuilder(distAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(StellarSdk.Operation.payment({
        destination,
        asset,
        amount: parsedAmount.toFixed(7),
      }))
      .addMemo(StellarSdk.Memo.text(`ZE:${action}:${Date.now().toString(36)}`))
      .setTimeout(30)
      .build();

    tx.sign(distributor);
    const result = await server.submitTransaction(tx);

    // تسجيل الـ Rate Limit بعد النجاح
    if (action === 'mining') {
      claimLog.set(destination, Date.now());
    }

    console.log(`✅ ZENITH sent: ${parsedAmount} → ${destination} | tx: ${result.hash}`);

    return res.status(200).json({
      success: true,
      hash: result.hash,
      amount: parsedAmount.toFixed(7),
      destination,
      explorerUrl: `https://stellar.expert/explorer/public/tx/${result.hash}`,
    });

  } catch (err) {
    // Stellar error details
    const stellarError = err?.response?.data?.extras?.result_codes;
    console.error('❌ Stellar error:', stellarError || err.message);

    return res.status(500).json({
      error: 'فشل إرسال ZENITH',
      details: stellarError
        ? `Stellar: ${JSON.stringify(stellarError)}`
        : err.message,
    });
  }
}
