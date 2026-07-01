const StellarSdk = require('@stellar/stellar-sdk');
const fs = require('fs');

const server = new StellarSdk.Horizon.Server('https://horizon.stellar.org');
const oldSecret = fs.readFileSync(process.env.HOME + '/.old_amm_secret.txt', 'utf8').trim();
const oldKp = StellarSdk.Keypair.fromSecret(oldSecret);
const newPublic = 'GCM756DV5SGGXM77Y5TYHWR5JO3LVLLKGIWN6STEPB25C7BVYQK7VUV3';

async function main() {
  const account = await server.loadAccount(oldKp.publicKey());
  const zBalance = account.balances.find(b => b.asset_code === 'ZENITH');
  console.log('ZENITH to send:', zBalance.balance);

  const asset = new StellarSdk.Asset('ZENITH', zBalance.asset_issuer);
  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: await server.fetchBaseFee().then(f => (f * 2).toString()),
    networkPassphrase: StellarSdk.Networks.PUBLIC,
  })
    .addOperation(StellarSdk.Operation.payment({
      destination: newPublic,
      asset: asset,
      amount: zBalance.balance,
    }))
    .setTimeout(30)
    .build();
  tx.sign(oldKp);
  try {
    const res = await server.submitTransaction(tx);
    console.log('ZENITH transfer success:', res.hash);
  } catch (e) {
    console.log('ZENITH transfer failed:', JSON.stringify(e.response?.data?.extras?.result_codes || e.message));
  }
}
main().catch(e => console.error('FATAL:', e));
