const StellarSdk = require('@stellar/stellar-sdk');
const fs = require('fs');

const server = new StellarSdk.Horizon.Server('https://horizon.stellar.org');
const oldSecret = fs.readFileSync(process.env.HOME + '/.old_amm_secret.txt', 'utf8').trim();
const oldKp = StellarSdk.Keypair.fromSecret(oldSecret);
const newPublic = 'GCM756DV5SGGXM77Y5TYHWR5JO3LVLLKGIWN6STEPB25C7BVYQK7VUV3';

async function main() {
  const account = await server.loadAccount(oldKp.publicKey());
  const xlmBalance = account.balances.find(b => b.asset_type === 'native');
  const current = parseFloat(xlmBalance.balance);
  const reserve = 3.0; // هامش أمان فوق الحد الأدنى
  const sendAmount = (current - reserve).toFixed(7);

  if (parseFloat(sendAmount) <= 0) {
    console.log('لا يوجد فائض كافٍ للتحويل. الرصيد الحالي:', current);
    return;
  }

  console.log('Current XLM:', current, '| Sending:', sendAmount, '| Leaving:', reserve);

  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: await server.fetchBaseFee().then(f => (f * 2).toString()),
    networkPassphrase: StellarSdk.Networks.PUBLIC,
  })
    .addOperation(StellarSdk.Operation.payment({
      destination: newPublic,
      asset: StellarSdk.Asset.native(),
      amount: sendAmount,
    }))
    .setTimeout(30)
    .build();
  tx.sign(oldKp);
  try {
    const res = await server.submitTransaction(tx);
    console.log('XLM transfer success:', res.hash);
  } catch (e) {
    console.log('XLM transfer failed:', JSON.stringify(e.response?.data?.extras?.result_codes || e.message));
  }
}
main().catch(e => console.error('FATAL:', e));
