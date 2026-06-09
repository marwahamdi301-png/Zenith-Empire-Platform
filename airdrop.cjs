const StellarSdk = require('@stellar/stellar-sdk');
const fs = require('fs');

const server = new StellarSdk.Horizon.Server('https://horizon.stellar.org');
const ZENITH_ISSUER = 'GA3T3OZ5V2JAZR5RCH3NII7JBNUMDPBSSXF6N6HKZGLTM5JSZCX7OTFQ';
const RECIPIENTS = JSON.parse(fs.readFileSync('./recipients.json', 'utf8'));

async function runAirdrop() {
  const keypair = StellarSdk.Keypair.fromSecret(process.env.DIST_SECRET);
  console.log(`🎁 Starting Airdrop for ${RECIPIENTS.length} wallets`);

  for (const r of RECIPIENTS) {
    try {
      const account = await server.loadAccount(keypair.publicKey());
      const tx = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: StellarSdk.Networks.PUBLIC
      })
      .addOperation(StellarSdk.Operation.payment({
        destination: r.address,
        asset: new StellarSdk.Asset('ZENITH', ZENITH_ISSUER),
        amount: r.amount
      }))
      .setTimeout(30)
      .build();

      tx.sign(keypair);
      await server.submitTransaction(tx);
      console.log(`✅ Sent ${r.amount} ZENITH to ${r.address.substring(0,10)}...`);
    } catch(e) {
      console.error(`❌ Failed for ${r.address.substring(0,10)}:`, e.message);
    }
    await new Promise(r => setTimeout(r, 1000));
  }
  console.log('🎉 Airdrop complete!');
}

runAirdrop();
