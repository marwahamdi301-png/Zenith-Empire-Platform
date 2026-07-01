const StellarSdk = require('@stellar/stellar-sdk');
const fs = require('fs');

const server = new StellarSdk.Horizon.Server('https://horizon.stellar.org');
const oldSecret = fs.readFileSync(process.env.HOME + '/.old_amm_secret.txt', 'utf8').trim();
const oldKp = StellarSdk.Keypair.fromSecret(oldSecret);
const newPublic = 'GCM756DV5SGGXM77Y5TYHWR5JO3LVLLKGIWN6STEPB25C7BVYQK7VUV3';

async function main() {
  const account = await server.loadAccount(oldKp.publicKey());
  console.log('Balances found:', account.balances.length);
  account.balances.forEach(b => console.log(b.asset_type, b.asset_code || 'XLM', b.balance, b.liquidity_pool_id || ''));

  const poolBalance = account.balances.find(b => b.liquidity_pool_id);
  if (poolBalance) {
    console.log('Withdrawing from pool:', poolBalance.liquidity_pool_id);
    const freshAccount = await server.loadAccount(oldKp.publicKey());
    const tx = new StellarSdk.TransactionBuilder(freshAccount, {
      fee: await server.fetchBaseFee().then(f => (f * 3).toString()),
      networkPassphrase: StellarSdk.Networks.PUBLIC,
    })
      .addOperation(StellarSdk.Operation.liquidityPoolWithdraw({
        liquidityPoolId: poolBalance.liquidity_pool_id,
        amount: poolBalance.balance,
        minAmountA: '0',
        minAmountB: '0',
      }))
      .setTimeout(30)
      .build();
    tx.sign(oldKp);
    try {
      const res = await server.submitTransaction(tx);
      console.log('Pool withdraw success:', res.hash);
    } catch (e) {
      console.log('Pool withdraw failed:', JSON.stringify(e.response?.data?.extras?.result_codes || e.message));
    }
  }

  const account2 = await server.loadAccount(oldKp.publicKey());
  for (const b of account2.balances) {
    if (b.asset_type !== 'native' && !b.liquidity_pool_id && parseFloat(b.balance) > 0) {
      console.log('Sending', b.balance, b.asset_code, 'to new wallet');
      const asset = new StellarSdk.Asset(b.asset_code, b.asset_issuer);
      const freshAcc = await server.loadAccount(oldKp.publicKey());
      const tx = new StellarSdk.TransactionBuilder(freshAcc, {
        fee: await server.fetchBaseFee().then(f => (f * 2).toString()),
        networkPassphrase: StellarSdk.Networks.PUBLIC,
      })
        .addOperation(StellarSdk.Operation.payment({
          destination: newPublic,
          asset: asset,
          amount: b.balance,
        }))
        .setTimeout(30)
        .build();
      tx.sign(oldKp);
      try {
        const res = await server.submitTransaction(tx);
        console.log('Asset transfer success:', res.hash);
      } catch (e) {
        console.log('Asset transfer failed:', JSON.stringify(e.response?.data?.extras?.result_codes || e.message));
      }
    }
  }

  console.log('DONE. Check final balances manually before sending XLM remainder.');
}

main().catch(e => console.error('FATAL:', e));
