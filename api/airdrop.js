import StellarSdk from '@stellar/stellar-sdk';

const DISTRIBUTOR_SECRET = process.env.DISTRIBUTOR_SECRET;
const ZENITH_ISSUER = 'GA3T3OZ5V2JAZR5RCH3NII7JBNUMDPBSSXF6N6HKZGLTM5JSZCX7OTFQ';
const AIRDROP_AMOUNT = '1000';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  const { address } = req.body;
  
  if (!address || !address.startsWith('G')) {
    return res.status(400).json({ error: 'Invalid Stellar address' });
  }

  if (!DISTRIBUTOR_SECRET) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const server = new StellarSdk.Horizon.Server('https://horizon.stellar.org');
    const ZENITH = new StellarSdk.Asset('ZENITH', ZENITH_ISSUER);
    const keypair = StellarSdk.Keypair.fromSecret(DISTRIBUTOR_SECRET);
    const account = await server.loadAccount(keypair.publicKey());

    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.PUBLIC
    })
      .addOperation(StellarSdk.Operation.payment({
        destination: address,
        asset: ZENITH,
        amount: AIRDROP_AMOUNT
      }))
      .addMemo(StellarSdk.Memo.text('ZENITH Airdrop'))
      .setTimeout(30)
      .build();

    transaction.sign(keypair);
    const result = await server.submitTransaction(transaction);
    
    return res.json({ 
      success: true, 
      txHash: result.hash
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
