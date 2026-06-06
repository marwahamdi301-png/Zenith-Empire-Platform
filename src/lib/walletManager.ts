import * as StellarSdk from "@stellar/stellar-sdk";

const ZENITH_ISSUER = 'GA3T3OZ5V2JAZR5RCH3NII7JBNUMDPBSSXF6N6HKZGLTM5JSZCX7OTFQ';
const HORIZON = 'https://horizon.stellar.org';
const server = new StellarSdk.Horizon.Server(HORIZON);

export type WalletType = 'freighter' | 'albedo' | 'lobstr';

// Freighter Wallet
export const connectFreighter = async () => {
  const freighter = (window as any).freighter;
  if (!freighter) throw new Error('Freighter not installed');

  await freighter.setAllowed();
  const publicKey = await freighter.getPublicKey();
  const network = await freighter.getNetwork();

  if (network !== 'PUBLIC') {
    throw new Error('Switch Freighter to Mainnet');
  }
  return publicKey;
};

// Albedo Wallet
export const connectAlbedo = async () => {
  const albedo = (window as any).albedo;
  if (!albedo) throw new Error('Albedo not installed');

  const result = await albedo.publicKey({
    token: 'zenith-empire-auth'
  });
  return result.pubkey;
};

// جلب رصيد ZENITH
export const getZenithBalance = async (publicKey: string) => {
  try {
    const account = await server.loadAccount(publicKey);
    const zenithBalance = account.balances.find(
      (b: any) =>
        b.asset_type !== 'native' &&
        b.asset_code === 'ZENITH' &&
        b.asset_issuer === ZENITH_ISSUER
    );
    return zenithBalance ? parseFloat(zenithBalance.balance) : 0;
  } catch {
    return 0;
  }
};

// جلب Order Book
export const getOrderBook = async () => {
  const ZENITH = new StellarSdk.Asset('ZENITH', ZENITH_ISSUER);
  const XLM = StellarSdk.Asset.native();

  const orderbook = await server.orderbook(ZENITH, XLM).call();
  return {
    bids: orderbook.bids.slice(0, 10),
    asks: orderbook.asks.slice(0, 10)
  };
};

// Swap XLM → ZENITH
export const swapXLMtoZENITH = async (
  publicKey: string,
  xlmAmount: number,
  signTransaction: (tx: string) => Promise<string>
) => {
  const account = await server.loadAccount(publicKey);
  const ZENITH = new StellarSdk.Asset('ZENITH', ZENITH_ISSUER);

  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: StellarSdk.Networks.PUBLIC
  })
  .addOperation(StellarSdk.Operation.pathPaymentStrictSend({
    sendAsset: StellarSdk.Asset.native(),
    sendAmount: xlmAmount.toFixed(7),
    destination: publicKey,
    destAsset: ZENITH,
    destMin: '1',
    path: []
  }))
  .setTimeout(30)
  .build();

  const xdr = tx.toXDR();
  const signedXDR = await signTransaction(xdr);
  const signedTx = StellarSdk.TransactionBuilder.fromXDR(
    signedXDR,
    StellarSdk.Networks.PUBLIC
  );

  const result = await server.submitTransaction(signedTx);
  return result.hash;
};
