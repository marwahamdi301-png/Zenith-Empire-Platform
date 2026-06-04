const StellarSdk = require('@stellar/stellar-sdk');
const server = new StellarSdk.Horizon.Server('https://horizon.stellar.org');

const ZENITH_ISSUER = 'GA3T3OZ5V2JAZR5RCH3NII7JBNUMDPBSSXF6N6HKZGLTM5JSZCX7OTFQ';
const SECRET = process.env.WALLET_SECRET;

async function createOffer() {
  const keypair = StellarSdk.Keypair.fromSecret(SECRET);
  const account = await server.loadAccount(keypair.publicKey());

  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: StellarSdk.Networks.PUBLIC
  })
  .addOperation(StellarSdk.Operation.manageSellOffer({
    selling: new StellarSdk.Asset('ZENITH', ZENITH_ISSUER),
    buying: StellarSdk.Asset.native(),
    amount: '1000',
    price: '0.001',
    offerId: 0
  }))
  .setTimeout(30)
  .build();

  tx.sign(keypair);
  const result = await server.submitTransaction(tx);
  console.log('✅ Offer created:', result.hash);
}

createOffer().catch(console.error);
