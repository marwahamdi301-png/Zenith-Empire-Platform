const StellarSdk = require('@stellar/stellar-sdk');
const fs = require('fs');

const server = new StellarSdk.Horizon.Server('https://horizon.stellar.org');
const content = fs.readFileSync(process.env.HOME + '/.new_amm_key.txt', 'utf8');
const newSecret = content.match(/SECRET=(.+)/)[1].trim();
const newKp = StellarSdk.Keypair.fromSecret(newSecret);

const ZENITH_ISSUER = 'GA3T3OZ5V2JAZR5RCH3NII7JBNUMDPBSSXF6N6HKZGLTM5JSZCX7OTFQ';

async function main() {
  const account = await server.loadAccount(newKp.publicKey());
  const zenithAsset = new StellarSdk.Asset('ZENITH', ZENITH_ISSUER);
  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: await server.fetchBaseFee().then(f => (f * 2).toString()),
    networkPassphrase: StellarSdk.Networks.PUBLIC,
  })
    .addOperation(StellarSdk.Operation.changeTrust({ asset: zenithAsset }))
    .setTimeout(30)
    .build();
  tx.sign(newKp);
  try {
    const res = await server.submitTransaction(tx);
    console.log('Trustline created:', res.hash);
  } catch (e) {
    console.log('Trustline failed:', JSON.stringify(e.response?.data?.extras?.result_codes || e.message));
  }
}
main().catch(e => console.error('FATAL:', e));
