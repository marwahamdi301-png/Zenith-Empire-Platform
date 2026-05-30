import * as StellarSdk from '@stellar/stellar-sdk';

export class TradingService {
  private server: StellarSdk.Horizon.Server;

  constructor() {
    const horizonUrl = process.env.VITE_HORIZON_URL || 'https://horizon-testnet.stellar.org';
    this.server = new StellarSdk.Horizon.Server(horizonUrl);
  }

  async getOrderBook(pair: string) {
    // Parse pair (e.g., "XLM/USDC")
    const [base, counter] = pair.split('/');
    
    const selling = base === 'XLM' 
      ? StellarSdk.Asset.native() 
      : new StellarSdk.Asset(base, process.env.ASSET_ISSUER || '');
    
    const buying = counter === 'XLM'
      ? StellarSdk.Asset.native()
      : new StellarSdk.Asset(counter, process.env.ASSET_ISSUER || '');

    const orderBook = await this.server.orderbook(selling, buying).call();
    
    return {
      bids: orderBook.bids.slice(0, 10).map(bid => ({
        price: parseFloat(bid.price),
        amount: parseFloat(bid.amount),
        total: parseFloat(bid.price) * parseFloat(bid.amount),
      })),
      asks: orderBook.asks.slice(0, 10).map(ask => ({
        price: parseFloat(ask.price),
        amount: parseFloat(ask.amount),
        total: parseFloat(ask.price) * parseFloat(ask.amount),
      })),
    };
  }

  async getRecentTrades(pair: string, limit: number = 20) {
    // Mock data for now - يمكن ربطها بـ Stellar DEX
    return Array.from({ length: limit }, (_, i) => ({
      id: `trade_${i}`,
      pair,
      price: 0.1234 * (1 + (Math.random() - 0.5) * 0.1),
      amount: Math.random() * 1000,
      side: Math.random() > 0.5 ? 'buy' : 'sell',
      timestamp: new Date(Date.now() - i * 60000).toISOString(),
    }));
  }

  async placeOrder(params: any) {
    // This will be implemented with actual Stellar DEX integration
    return {
      id: `order_${Date.now()}`,
      ...params,
      status: 'pending',
      timestamp: new Date().toISOString(),
    };
  }
}
