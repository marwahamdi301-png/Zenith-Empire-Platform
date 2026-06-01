import * as S from '@stellar/stellar-sdk';

const fs    = await import('fs');
const lines = fs.default.readFileSync('/data/data/com.termux/files/home/keys.txt','utf8').trim().split('\n');
const keys  = {};
lines.forEach(l => { const [k,v] = l.split('='); keys[k] = v; });

const server = new S.Horizon.Server('https://api.mainnet.minepi.com');
const NET    = 'Pi Network';
const iss    = S.Keypair.fromSecret(keys.ISS_SEC);
const dist   = S.Keypair.fromSecret(keys.DIS_SEC);
const ZEN    = new S.Asset('ZENITH', iss.publicKey());

console.log('ISSUER:', iss.publicKey());
console.log('DIST:  ', dist.publicKey());

try {
  const acc = await server.loadAccount(dist.publicKey());
  console.log('✅ DIST موجود على Pi Network');
  acc.balances.forEach(b =>
    console.log(b.asset_type === 'native' ? 'Pi: ' + b.balance : b.asset_code + ': ' + b.balance)
  );
} catch(e) {
  console.log('❌ DIST غير موجود على Pi Network');
  console.log('أرسل 1 Pi لهذا العنوان:', dist.publicKey());
  console.log('GB6TK6UPBQAIHYLPYGJDLCLXB2HLP452DPDNRNR2JETEDPSXKWOCXLZB');
}
