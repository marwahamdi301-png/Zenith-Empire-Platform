const sdk = require('@stellar/stellar-sdk');
const s = new sdk.Horizon.Server('https://horizon.stellar.org');
const kp = sdk.Keypair.fromSecret(process.env.DIST_SECRET);

s.loadAccount(kp.publicKey()).then(async a => {
  console.log('Sending from:', kp.publicKey());
  const tx = new sdk.TransactionBuilder(a, {
    fee: sdk.BASE_FEE,
    networkPassphrase: sdk.Networks.PUBLIC
  })
  .addOperation(sdk.Operation.payment({
    destination: 'GDHT7NMOFE6SLJOOBFH5IDZVMGH3GSJIYK2DHJ7KLUQ64UAATA5AI4TR',
    asset: sdk.Asset.native(),
    amount: '3'
  }))
  .setTimeout(30).build();
  tx.sign(kp);
  const r = await s.submitTransaction(tx);
  console.log('✅ Sent 3 XLM to AMM!', r.hash);
}).catch(e => {
  console.error('❌', e.response?.data?.extras?.result_codes || e.message);
});
