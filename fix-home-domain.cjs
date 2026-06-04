const StellarSdk = require('@stellar/stellar-sdk');
const server = new StellarSdk.Horizon.Server('https://horizon.stellar.org');

async function setHomeDomain() {
  const keypair = StellarSdk.Keypair.fromSecret(process.env.ISSUER_SECRET);
  const account = await server.loadAccount(keypair.publicKey());

  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: StellarSdk.Networks.PUBLIC
  })
  .addOperation(StellarSdk.Operation.setOptions({
    homeDomain: 'zenith-empire-cyan.vercel.app'
  }))
  .setTimeout(30)
  .build();

  tx.sign(keypair);
  const result = await server.submitTransaction(tx);
  console.log('✅ Home domain set:', result.hash);
}

setHomeDomain().catch(console.error);
