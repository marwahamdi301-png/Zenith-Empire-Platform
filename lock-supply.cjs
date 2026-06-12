const sdk = require('@stellar/stellar-sdk');
const server = new sdk.Horizon.Server('https://horizon.stellar.org');

async function lockSupply() {
  const issuer = sdk.Keypair.fromSecret(process.env.ISSUER_SECRET);
  const account = await server.loadAccount(issuer.publicKey());
  
  const tx = new sdk.TransactionBuilder(account, {
    fee: sdk.BASE_FEE,
    networkPassphrase: sdk.Networks.PUBLIC
  })
  .addOperation(sdk.Operation.setOptions({
    masterWeight: 0,
    lowThreshold: 0,
    medThreshold: 0,
    highThreshold: 0
  }))
  .setTimeout(30)
  .build();
  
  tx.sign(issuer);
  const result = await server.submitTransaction(tx);
  console.log('🔒 Supply locked forever!', result.hash);
}

lockSupply().catch(e => console.error('❌', e.message));
