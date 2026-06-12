const StellarSdk = require('@stellar/stellar-sdk');
const server = new StellarSdk.Horizon.Server('https://horizon.stellar.org');

const ZENITH_ISSUER = 'GA3T3OZ5V2JAZR5RCH3NII7JBNUMDPBSSXF6N6HKZGLTM5JSZCX7OTFQ';
const ZENITH = new StellarSdk.Asset('ZENITH', ZENITH_ISSUER);
const XLM = StellarSdk.Asset.native();

async function createPool() {
  const keypair = StellarSdk.Keypair.fromSecret(process.env.WALLET_SECRET);
  const account = await server.loadAccount(keypair.publicKey());
  const poolAsset = new StellarSdk.LiquidityPoolAsset(XLM, ZENITH, 30);
  const poolId = StellarSdk.getLiquidityPoolId(
    'constant_product',
    poolAsset.getLiquidityPoolParameters()
  ).toString('hex');

  console.log('Pool ID:', poolId);

  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: StellarSdk.Networks.PUBLIC
  })
  .addOperation(StellarSdk.Operation.changeTrust({ asset: poolAsset }))
  .addOperation(StellarSdk.Operation.liquidityPoolDeposit({
    liquidityPoolId: poolId,
    maxAmountA: '3',
    maxAmountB: '3000000',
    minPrice: '0.000001',
    maxPrice: '1000000'
  }))
  .setTimeout(30)
  .build();

  tx.sign(keypair);
  const result = await server.submitTransaction(tx);
  console.log('✅ AMM Pool created!', result.hash);
}

createPool().catch(e => {
  if (e.response && e.response.data) {
    console.error('❌ Details:', JSON.stringify(e.response.data.extras?.result_codes));
  } else {
    console.error('❌', e.message);
  }
});
