
import * as S from '@stellar/stellar-sdk';

const server = new S.Horizon.Server('https://horizon.stellar.org');
const net    = S.Networks.PUBLIC;
const iss    = S.Keypair.fromSecret('SCXZGZKLSYRBWR4BRZ7STTVEJZ22ZVEG5U2443RWYLRLSYOOMUUUA2P7');
const dist   = S.Keypair.fromSecret('SAE6O6SGYV3WDO6NUDTI3CRQIBR655FNF35RZRR4GR7KWYNS6D46J6OX');
const ZEN    = new S.Asset('ZENITH', iss.publicKey());

console.log('ISSUER:', iss.publicKey());
console.log('DIST:  ', dist.publicKey());

// Trustline
let acc = await server.loadAccount(dist.publicKey());
let tx  = new S.TransactionBuilder(acc, { fee: S.BASE_FEE, networkPassphrase: net })
  .addOperation(S.Operation.changeTrust({ asset: ZEN, limit: '1000000000' }))
  .setTimeout(30).build();
tx.sign(dist);
await server.submitTransaction(tx);
console.log('✅ Trustline OK');

// إصدار ZENITH
acc = await server.loadAccount(iss.publicKey());
tx  = new S.TransactionBuilder(acc, { fee: S.BASE_FEE, networkPassphrase: net })
  .addOperation(S.Operation.payment({
    destination: dist.publicKey(),
    asset: ZEN,
    amount: '1000000000'
  }))
  .setTimeout(30).build();
tx.sign(iss);
const r = await server.submitTransaction(tx);
console.log('🚀 ZENITH Mainnet issued!');
console.log('Hash:', r.hash);
console.log('🌐 https://stellar.expert/explorer/public/asset/ZENITH-' + iss.publicKey());
