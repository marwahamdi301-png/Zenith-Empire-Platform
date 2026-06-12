const sdk = require('@stellar/stellar-sdk');
const s = new sdk.Horizon.Server('https://horizon.stellar.org');
const kp = sdk.Keypair.fromSecret(process.env.WALLET_SECRET);
const ZENITH = new sdk.Asset('ZENITH', 'GA3T3OZ5V2JAZR5RCH3NII7JBNUMDPBSSXF6N6HKZGLTM5JSZCX7OTFQ');

s.loadAccount(kp.publicKey()).then(async a => {
  const tx = new sdk.TransactionBuilder(a, {
    fee: sdk.BASE_FEE,
    networkPassphrase: sdk.Networks.PUBLIC
  })
  .addOperation(sdk.Operation.payment({
    destination: 'GDHT7NMOFE6SLJOOBFH5IDZVMGH3GSJIYK2DHJ7KLUQ64UAATA5AI4TR',
    asset: ZENITH,
    amount: '5000000'
  }))
  .setTimeout(30).build();
  tx.sign(kp);
  const r = await s.submitTransaction(tx);
  console.log('✅ Sent 5M ZENITH to AMM!', r.hash);
}).catch(e => console.error('❌', e.message));
