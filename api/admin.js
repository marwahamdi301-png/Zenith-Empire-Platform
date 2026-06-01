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
