const StellarSdk = require('@stellar/stellar-sdk');
const server = new StellarSdk.Horizon.Server('https://horizon.stellar.org');

async function lockIssuer() {
  const keypair = StellarSdk.Keypair.fromSecret(process.env.ISSUER_SECRET);
  const account = await server.loadAccount(keypair.publicKey());

  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: StellarSdk.Networks.PUBLIC
  })
  .addOperation(StellarSdk.Operation.setOptions({
    // منع إصدار tokens جديدة
    masterWeight: 0,
    lowThreshold: 0,
    medThreshold: 0,
    highThreshold: 0,
    setFlags: StellarSdk.AuthImmutableFlag
  }))
  .setTimeout(30)
  .build();

  tx.sign(keypair);
  const result = await server.submitTransaction(tx);
  console.log('🔒 Issuer LOCKED forever:', result.hash);
  console.log('✅ Supply is now FIXED at 1,000,000,000 ZENITH');
}

lockIssuer().catch(console.error);
