import * as StellarSdk from '@stellar/stellar-sdk';

// ⚠️ استخدم محفظة منفصلة لإصدار العملة (ليست محافظ التداول)
const ISSUER_SECRET = 'YOUR_ISSUER_SECRET_KEY_HERE'; // استبدلها بمفتاح سري جديد
const DISTRIBUTOR_SECRET = 'YOUR_DISTRIBUTOR_SECRET_KEY_HERE'; // محفظة التوزيع

const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
const network = StellarSdk.Networks.TESTNET;

async function createZenithToken() {
  const issuer = StellarSdk.Keypair.fromSecret(ISSUER_SECRET);
  const distributor = StellarSdk.Keypair.fromSecret(DISTRIBUTOR_SECRET);

  console.log('🔑 Issuer:', issuer.publicKey());
  console.log('📦 Distributor:', distributor.publicKey());

  // 1. إنشاء Trustline من الموزع للمصدر
  let account = await server.loadAccount(distributor.publicKey());
  let tx = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: network,
  })
    .addOperation(StellarSdk.Operation.changeTrust({
      asset: new StellarSdk.Asset('ZENITH', issuer.publicKey()),
      limit: '1000000000'
    }))
    .setTimeout(30)
    .build();
  tx.sign(distributor);
  await server.submitTransaction(tx);
  console.log('✅ Trustline created');

  // 2. إصدار العملة
  account = await server.loadAccount(issuer.publicKey());
  tx = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: network,
  })
    .addOperation(StellarSdk.Operation.payment({
      destination: distributor.publicKey(),
      asset: new StellarSdk.Asset('ZENITH', issuer.publicKey()),
      amount: '1000000000' // 1 مليار وحدة
    }))
    .addOperation(StellarSdk.Operation.setOptions({
      setFlags: StellarSdk.AuthRevocableFlag | StellarSdk.AuthRequiredFlag
    }))
    .setTimeout(30)
    .build();
  tx.sign(issuer);
  const result = await server.submitTransaction(tx);
  console.log('🚀 ZENITH Token Issued! Hash:', result.hash);
  console.log('🌐 View: https://stellar.expert/explorer/testnet/asset/ZENITH-' + issuer.publicKey());
}

createZenithToken().catch(console.error);
