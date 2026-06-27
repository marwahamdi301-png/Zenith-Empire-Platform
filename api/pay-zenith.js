import StellarSdk from '@stellar/stellar-sdk';

const DISTRIBUTOR = 'GB6TK6UPBQAIHYLPYGJDLCLXB2HLP452DPDNRNR2JETEDPSXKWOCXLZB';
const ZENITH_ISSUER = 'GA3T3OZ5V2JAZR5RCH3NII7JBNUMDPBSSXF6N6HKZGLTM5JSZCX7OTFQ';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  const { from, amount, memo } = req.body;
  
  if (!from || !amount) {
    return res.status(400).json({ error: 'Missing from or amount' });
  }

  try {
    const server = new StellarSdk.Horizon.Server('https://horizon.stellar.org');
    const ZENITH = new StellarSdk.Asset('ZENITH', ZENITH_ISSUER);
    
    const account = await server.loadAccount(DISTRIBUTOR);
    
    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.PUBLIC
    })
      .addOperation(StellarSdk.Operation.payment({
        destination: from,
        asset: ZENITH,
        amount: amount.toString()
      }))
      .addMemo(StellarSdk.Memo.text(memo?.slice(0, 28) || 'ZENITH Order'))
      .setTimeout(30)
      .build();

    return res.json({ 
      success: true, 
      xdr: transaction.toXDR(),
      message: 'Sign and submit this transaction'
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
