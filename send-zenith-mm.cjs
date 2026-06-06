const StellarSdk = require('@stellar/stellar-sdk');
const server = new StellarSdk.Horizon.Server('https://horizon.stellar.org');

const ZENITH_ISSUER = 'GA3T3OZ5V2JAZR5RCH3NII7JBNUMDPBSSXF6N6HKZGLTM5JSZCX7OTFQ';

async function sendZenith() {
  const keypair = StellarSdk.Keypair.fromSecret(process.env.DIST_SECRET);
  const account = await server.loadAccount(keypair.publicKey());

  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: StellarSdk.Networks.PUBLIC
  })
  .addOperation(StellarSdk.Operation.payment({
    destination: process.env.MM_PUBLIC,
    asset: new StellarSdk.Asset('ZENITH', ZENITH_ISSUER),
    amount: '50000'
  }))
  .setTimeout(30)
  .build();

  tx.sign(keypair);

  try {
    const result = await server.submitTransaction(tx);
    console.log('✅ ZENITH sent to MM:', result.hash);
  } catch(e) {
    console.error('❌ Error:', JSON.stringify(e.response?.data?.extras, null, 2));
  }
}

sendZenith();
