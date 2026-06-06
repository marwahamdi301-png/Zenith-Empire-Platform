const StellarSdk = require('@stellar/stellar-sdk');
const server = new StellarSdk.Horizon.Server('https://horizon.stellar.org');

const ZENITH_ISSUER = 'GA3T3OZ5V2JAZR5RCH3NII7JBNUMDPBSSXF6N6HKZGLTM5JSZCX7OTFQ';
const ZENITH = new StellarSdk.Asset('ZENITH', ZENITH_ISSUER);
const XLM = StellarSdk.Asset.native();

const CONFIG = {
  spread: 0.02,
  basePrice: 0.001,
  orderSize: 100,
  levels: 3,
  refreshInterval: 300000
};

async function cancelAllOffers(keypair) {
  const offers = await server.offers().forAccount(keypair.publicKey()).call();
  if (offers.records.length === 0) return;

  const account = await server.loadAccount(keypair.publicKey());
  const builder = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: StellarSdk.Networks.PUBLIC
  });

  for (const offer of offers.records) {
    builder.addOperation(StellarSdk.Operation.manageSellOffer({
      selling: offer.selling.asset_type === 'native' ? XLM :
        new StellarSdk.Asset(offer.selling.asset_code, offer.selling.asset_issuer),
      buying: offer.buying.asset_type === 'native' ? XLM :
        new StellarSdk.Asset(offer.buying.asset_code, offer.buying.asset_issuer),
      amount: '0',
      price: offer.price,
      offerId: offer.id
    }));
  }

  const tx = builder.setTimeout(30).build();
  tx.sign(keypair);
  await server.submitTransaction(tx);
  console.log('✅ Cleared old offers');
}

async function placeOrders(keypair) {
  const account = await server.loadAccount(keypair.publicKey());
  const builder = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: StellarSdk.Networks.PUBLIC
  });

  for (let i = 1; i <= CONFIG.levels; i++) {
    const price = (CONFIG.basePrice * (1 + CONFIG.spread * i)).toFixed(7);
    builder.addOperation(StellarSdk.Operation.manageSellOffer({
      selling: ZENITH,
      buying: XLM,
      amount: String(CONFIG.orderSize),
      price: price,
      offerId: 0
    }));
  }

  for (let i = 1; i <= CONFIG.levels; i++) {
    const price = (CONFIG.basePrice * (1 - CONFIG.spread * i)).toFixed(7);
    builder.addOperation(StellarSdk.Operation.manageBuyOffer({
      selling: XLM,
      buying: ZENITH,
      buyAmount: String(CONFIG.orderSize),
      price: price,
      offerId: 0
    }));
  }

  const tx = builder.setTimeout(30).build();
  tx.sign(keypair);

  try {
    const result = await server.submitTransaction(tx);
    console.log('✅ Orders placed:', result.hash);
  } catch(e) {
    console.error('❌ result_codes:', e.response?.data?.extras?.result_codes);
  }
}

async function runMarketMaker() {
  const keypair = StellarSdk.Keypair.fromSecret(process.env.MM_SECRET);
  console.log('🚀 Market Maker started for:', keypair.publicKey());

  while (true) {
    try {
      await cancelAllOffers(keypair);
      await placeOrders(keypair);
      console.log(`⏰ Next refresh in ${CONFIG.refreshInterval/1000}s`);
      await new Promise(r => setTimeout(r, CONFIG.refreshInterval));
    } catch(e) {
      console.error('❌ Error:', e.message);
      await new Promise(r => setTimeout(r, 30000));
    }
  }
}

runMarketMaker();
