import * as StellarSdk from '@stellar/stellar-sdk';

const ISSUER_SECRET      = 'SDSTJ4V0YQFYL5NDC5WY54WXQAYQNKVKYDBA7NFLEIJUXYIVP2ASS2N3';
const DISTRIBUTOR_SECRET = 'DISTRIBUTOR_SECRET_HERE';

const server  = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
const network = StellarSdk.Networks.TESTNET;

const issuer      = StellarSdk.Keypair.fromSecret(ISSUER_SECRET);
const distributor = StellarSdk.Keypair.fromSecret(DISTRIBUTOR_SECRET);
const ZENITH      = new StellarSdk.Asset('ZENITH', issuer.publicKey());

console.log('🔑 ISSUER:     ', issuer.publicKey());
console.log('📦 DISTRIBUTOR:', distributor.publicKey());

try {
  let acc = await server.loadAccount(distributor.publicKey());
  let tx  = new StellarSdk.TransactionBuilder(acc, {
    fee: StellarSdk.BASE_FEE, networkPassphrase: network
  })
    .addOperation(StellarSdk.Operation.changeTrust({ asset: ZENITH, limit: '1000000000' }))
    .setTimeout(30).build();
  tx.sign(distributor);
  await server.submitTransaction(tx);
  console.log('✅ Trustline OK');

  acc = await server.loadAccount(issuer.publicKey());
  tx  = new StellarSdk.TransactionBuilder(acc, {
    fee: StellarSdk.BASE_FEE, networkPassphrase: network
  })
    .addOperation(StellarSdk.Operation.payment({
      destination: distributor.publicKey(),
      asset: ZENITH,
      amount: '1000000000'
    }))
    .setTimeout(30).build();
  tx.sign(issuer);
  const result = await server.submitTransaction(tx);
  console.log('🚀 ZENITH مُصدَر!');
  console.log('📊 Hash:', result.hash);
  console.log('🌐 Explorer: https://stellar.expert/explorer/testnet/asset/ZENITH-' + issuer.publicKey());
} catch(e) {
  console.error('❌ خطأ:', e.response?.data?.extras?.result_codes || e.message);
}
