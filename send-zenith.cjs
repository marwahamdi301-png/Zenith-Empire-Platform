const StellarSdk = require('@stellar/stellar-sdk');
const server = new StellarSdk.Horizon.Server('https://horizon.stellar.org');

const ZENITH_ISSUER = 'GA3T3OZ5V2JAZR5RCH3NII7JBNUMDPBSSXF6N6HKZGLTM5JSZCX7OTFQ';
const DIST_SECRET = process.env.DIST_SECRET;

const RECIPIENTS = [
  { address: 'GCMRPF2KNTNFSNB7LIX6KDWKLVGMGNZT2ACHCMF2R3OX5YZFSQPYTEP6', amount: '10000' },
  { address: 'GDPMNWGH6XOT2FEF7KR7TQO3K2IRQOTX4ONZBOCRD6QY73OXDLEDPKEX', amount: '10000' }
];

async function sendZenith() {
  const keypair = StellarSdk.Keypair.fromSecret(DIST_SECRET);
  const account = await server.loadAccount(keypair.publicKey());

  let builder = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: StellarSdk.Networks.PUBLIC
  });

  for (const r of RECIPIENTS) {
    builder.addOperation(StellarSdk.Operation.payment({
      destination: r.address,
      asset: new StellarSdk.Asset('ZENITH', ZENITH_ISSUER),
      amount: r.amount
    }));
  }

  const tx = builder.setTimeout(30).build();
  tx.sign(keypair);
  const result = await server.submitTransaction(tx);
  console.log('✅ ZENITH sent:', result.hash);
}

sendZenith().catch(console.error);
