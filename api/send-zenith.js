import * as StellarSdk from '@stellar/stellar-sdk';

const HORIZON_URL        = 'https://horizon-testnet.stellar.org';
const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;
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
