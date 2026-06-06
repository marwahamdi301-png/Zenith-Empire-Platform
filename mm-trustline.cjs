const StellarSdk = require('@stellar/stellar-sdk');
const server = new StellarSdk.Horizon.Server('https://horizon.stellar.org');

const ZENITH_ISSUER = 'GA3T3OZ5V2JAZR5RCH3NII7JBNUMDPBSSXF6N6HKZGLTM5JSZCX7OTFQ';

async function addTrustline() {
  const keypair = StellarSdk.Keypair.fromSecret(process.env.MM_SECRET);
  const account = await server.loadAccount(keypair.publicKey());

  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: StellarSdk.Networks.PUBLIC
  })
  .addOperation(StellarSdk.Operation.changeTrust({
    asset: new StellarSdk.Asset('ZENITH', ZENITH_ISSUER),
    limit: '1000000000'
  }))
  .setTimeout(30)
  .build();

  tx.sign(keypair);
  const result = await server.submitTransaction(tx);
  console.log('✅ Trustline added:', result.hash);
}

addTrustline().catch(console.error);
