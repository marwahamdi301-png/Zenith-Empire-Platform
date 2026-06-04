const StellarSdk = require('@stellar/stellar-sdk');
const server = new StellarSdk.Horizon.Server('https://horizon.stellar.org');

const ZENITH_ISSUER = 'GA3T3OZ5V2JAZR5RCH3NII7JBNUMDPBSSXF6N6HKZGLTM5JSZCX7OTFQ';
const WALLETS = process.env.WALLET_SECRETS.split(',');

async function addTrustline(secret) {
  const keypair = StellarSdk.Keypair.fromSecret(secret.trim());
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
  console.log('✅ Trustline added for:', keypair.publicKey().substring(0,10), result.hash);
}

async function main() {
  for (const secret of WALLETS) {
    await addTrustline(secret);
  }
}

main().catch(console.error);
