// api/admin.js
// ✅ Admin API — محمية بـ ADMIN_TOKEN سري على الخادم

import * as StellarSdk from '@stellar/stellar-sdk';

const HORIZON_URL        = 'https://horizon.stellar.org';
const NETWORK_PASSPHRASE = StellarSdk.Networks.PUBLIC;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://zenith-empire-cyan.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // ── حماية بـ Token سري ────────────────────────────────────────────
  const authHeader = req.headers.authorization;
  const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

  if (!ADMIN_TOKEN || authHeader !== `Bearer ${ADMIN_TOKEN}`) {
    return res.status(401).json({ error: 'غير مصرح — Admin token مطلوب' });
  }

  try {
    const { action, amount, destination } = req.body;

    if (!action || !amount) {
      return res.status(400).json({ error: 'action و amount مطلوبان' });
    }

    const ISSUER_SECRET      = process.env.ISSUER_SECRET;
    const DISTRIBUTOR_SECRET = process.env.DISTRIBUTOR_SECRET;
    const ZENITH_ISSUER      = process.env.ZENITH_ISSUER;

    if (!ISSUER_SECRET || !DISTRIBUTOR_SECRET || !ZENITH_ISSUER) {
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const server      = new StellarSdk.Horizon.Server(HORIZON_URL);
    const issuer      = StellarSdk.Keypair.fromSecret(ISSUER_SECRET);
    const distributor = StellarSdk.Keypair.fromSecret(DISTRIBUTOR_SECRET);
    const asset       = new StellarSdk.Asset('ZENITH', issuer.publicKey());

    let account, tx, result;

    if (action === 'mint') {
      // إصدار ZENITH جديد للموزع
      account = await server.loadAccount(issuer.publicKey());
      tx = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE, networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(StellarSdk.Operation.payment({
          destination: distributor.publicKey(),
          asset,
          amount: parseFloat(amount).toFixed(7),
        }))
        .addMemo(StellarSdk.Memo.text('ZE:admin:mint'))
        .setTimeout(30).build();
      tx.sign(issuer);

    } else if (action === 'burn') {
      // حرق — إعادة للمصدر
      account = await server.loadAccount(distributor.publicKey());
      tx = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE, networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(StellarSdk.Operation.payment({
          destination: issuer.publicKey(),
          asset,
          amount: parseFloat(amount).toFixed(7),
        }))
        .addMemo(StellarSdk.Memo.text('ZE:admin:burn'))
        .setTimeout(30).build();
      tx.sign(distributor);

    } else if (action === 'distribute') {
      if (!destination) return res.status(400).json({ error: 'destination مطلوب للتوزيع' });
      try { StellarSdk.Keypair.fromPublicKey(destination); }
      catch { return res.status(400).json({ error: 'عنوان غير صحيح' }); }

      account = await server.loadAccount(distributor.publicKey());
      tx = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE, networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(StellarSdk.Operation.payment({
          destination,
          asset,
          amount: parseFloat(amount).toFixed(7),
        }))
        .addMemo(StellarSdk.Memo.text('ZE:admin:dist'))
        .setTimeout(30).build();
      tx.sign(distributor);

    } else {
      return res.status(400).json({ error: `action غير معروف: ${action}` });
    }

    result = await server.submitTransaction(tx);

    return res.status(200).json({
      success: true,
      action,
      amount,
      hash: result.hash,
      explorerUrl: `https://stellar.expert/explorer/public/tx/${result.hash}`,
    });

  } catch (err) {
    const stellarError = err?.response?.data?.extras?.result_codes;
    return res.status(500).json({
      error: 'فشل العملية',
      details: stellarError ? JSON.stringify(stellarError) : err.message,
    });
  }
}
