const StellarSdk = require('@stellar/stellar-sdk');
const server = new StellarSdk.Horizon.Server('https://horizon.stellar.org');

async function fund() {
  const keypair = StellarSdk.Keypair.fromSecret(process.env.DIST_SECRET);
  const account = await server.loadAccount(keypair.publicKey());

  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: StellarSdk.Networks.PUBLIC
  })
  .addOperation(StellarSdk.Operation.createAccount({
    destination: process.env.MM_PUBLIC,
    startingBalance: '5'
  }))
  .setTimeout(30)
  .build();

  tx.sign(keypair);
  const result = await server.submitTransaction(tx);
  console.log('✅ MM Wallet funded:', result.hash);
}

fund().catch(console.error);
