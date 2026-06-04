const StellarSdk = require('@stellar/stellar-sdk');

const server = new StellarSdk.Horizon.Server('https://horizon.stellar.org');
const SECRET = process.env.DIST_SECRET;

async function fund() {
  const keypair = StellarSdk.Keypair.fromSecret(SECRET);
  const account = await server.loadAccount(keypair.publicKey());

  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: StellarSdk.Networks.PUBLIC
  })
  .addOperation(StellarSdk.Operation.createAccount({
    destination: 'GDPMNWGH6XOT2FEF7KR7TQO3K2IRQOTX4ONZBOCRD6QY73OXDLEDPKEX',
    startingBalance: '2'
  }))
  .setTimeout(30)
  .build();

  tx.sign(keypair);
  const result = await server.submitTransaction(tx);
  console.log('✅ Done:', result.hash);
}

fund().catch(console.error);
