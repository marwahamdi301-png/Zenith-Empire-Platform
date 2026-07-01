const StellarSdk = require('@stellar/stellar-sdk');
const fs = require('fs');

const server = new StellarSdk.Horizon.Server('https://horizon.stellar.org');
const oldSecret = fs.readFileSync(process.env.HOME + '/.old_amm_secret.txt', 'utf8').trim();
const oldKp = StellarSdk.Keypair.fromSecret(oldSecret);
const newPublic = 'GCM756DV5SGGXM77Y5TYHWR5JO3LVLLKGIWN6STEPB25C7BVYQK7VUV3';

async function main() {
  const account = await server.loadAccount(oldKp.publicKey());
  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: await server.fetchBaseFee().then(f => (f * 2).toString()),
    networkPassphrase: StellarSdk.Networks.PUBLIC,
  })
    .addOperation(StellarSdk.Operation.createAccount({
      destination: newPublic,
      startingBalance: '3',
    }))
    .setTimeout(30)
    .build();
  tx.sign(oldKp);
  try {
    const res = await server.submitTransaction(tx);
    console.log('Account funded:', res.hash);
  } catch (e) {
    console.log('Funding failed:', JSON.stringify(e.response?.data?.extras?.result_codes || e.message));
  }
}
main().catch(e => console.error('FATAL:', e));
