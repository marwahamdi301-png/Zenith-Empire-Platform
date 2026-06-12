import { useState, useEffect } from 'react';
import { ArrowUpCircle, ArrowDownCircle, TrendingUp, Zap } from 'lucide-react';
import { TradingChart } from './TradingChart';
import { OrderBook } from './OrderBook';

const ZENITH_ISSUER = 'GA3T3OZ5V2JAZR5RCH3NII7JBNUMDPBSSXF6N6HKZGLTM5JSZCX7OTFQ';

const staticPairs = [
  { pair: 'XLM/USDC', price: 0.1234, change: '+5.2%', volume: '1.2M', tvSymbol: 'BINANCE:XLMUSDT', isZenith: false },
  { pair: 'BTC/USDC', price: 42100, change: '+2.8%', volume: '842K', tvSymbol: 'BINANCE:BTCUSDT', isZenith: false },
  { pair: 'ETH/USDC', price: 2340, change: '-1.3%', volume: '523K', tvSymbol: 'BINANCE:ETHUSDT', isZenith: false },
];

export function TradingView() {
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [xlmAmount, setXlmAmount] = useState('');
  const [selectedPair, setSelectedPair] = useState(staticPairs[0]);
  const [zenithPrice, setZenithPrice] = useState('0.0000001');
  const [zenithVolume, setZenithVolume] = useState('0');
  const [swapStatus, setSwapStatus] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [showSwap, setShowSwap] = useState(false);

  useEffect(() => {
    fetchZenithPrice();
  }, []);

  async function fetchZenithPrice() {
    try {
      const res = await fetch(
        `https://horizon.stellar.org/order_book?selling_asset_type=credit_alphanum12&selling_asset_code=ZENITH&selling_asset_issuer=${ZENITH_ISSUER}&buying_asset_type=native&limit=1`
      );
      const data = await res.json();
      if (data.asks?.length > 0) {
        setZenithPrice(parseFloat(data.asks[0].price).toFixed(7));
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function handleSwap() {
    if (!walletAddress || !amount) {
      setSwapStatus('❌ Enter wallet address and amount');
      return;
    }
    setSwapStatus('⏳ Opening Stellar DEX...');
    const stellarUrl = `https://stellarterm.com/#exchange/ZENITH-${ZENITH_ISSUER}/XLM-native`;
    window.open(stellarUrl, '_blank');
    setSwapStatus('✅ Opened StellarTerm DEX!');
  }

  const zenithPair = {
    pair: 'ZENITH/XLM',
    price: parseFloat(zenithPrice),
    change: '+0.0%',
    volume: zenithVolume,
    tvSymbol: 'BINANCE:XLMUSDT',
    isZenith: true,
  };

  const allPairs = [zenithPair, ...staticPairs];

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Trading Pairs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-4">
        {allPairs.map((pair) => {
          const isPositive = pair.change.startsWith('+');
          const isSelected = selectedPair.pair === pair.pair;
          return (
            <button
              key={pair.pair}
              onClick={() => { setSelectedPair(pair); setShowSwap(pair.isZenith); }}
              className={`backdrop-blur-sm border rounded-xl p-3 text-left transition-all ${
                isSelected
                  ? 'border-cyan-500 shadow-lg shadow-cyan-500/20 bg-gray-800'
                  : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
              } ${pair.isZenith ? 'border-yellow-500/50' : ''}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-white text-xs">
                  {pair.isZenith && '⚡'} {pair.pair}
                </span>
                <TrendingUp className={`w-3 h-3 ${isPositive ? 'text-green-400' : 'text-red-400'}`} />
              </div>
              <div className="text-lg font-bold text-white">
                {pair.isZenith ? `${pair.price.toFixed(7)}` : `$${pair.price.toLocaleString()}`}
              </div>
              <div className="flex items-center justify-between text-xs mt-1">
                <span className={isPositive ? 'text-green-400' : 'text-red-400'}>
                  {pair.change}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ZENITH Swap Panel */}
      {showSwap && (
        <div className="mx-4 bg-gray-900 border border-yellow-500/30 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="text-yellow-400 w-5 h-5" />
            <h3 className="text-white font-bold text-lg">Swap ZENITH / XLM</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Your Stellar Address</label>
              <input
                type="text"
                placeholder="G..."
                value={walletAddress}
                onChange={e => setWalletAddress(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setOrderType('buy')}
                className={`py-2 rounded-lg font-bold text-sm transition-all ${orderType === 'buy' ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-400'}`}
              >
                BUY ZENITH
              </button>
              <button
                onClick={() => setOrderType('sell')}
                className={`py-2 rounded-lg font-bold text-sm transition-all ${orderType === 'sell' ? 'bg-red-500 text-white' : 'bg-gray-800 text-gray-400'}`}
              >
                SELL ZENITH
              </button>
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1 block">
                {orderType === 'buy' ? 'ZENITH Amount' : 'ZENITH to Sell'}
              </label>
              <input
                type="number"
                placeholder="1000"
                value={amount}
                onChange={e => {
                  setAmount(e.target.value);
                  setXlmAmount((parseFloat(e.target.value) * parseFloat(zenithPrice)).toFixed(4));
                }}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none"
              />
            </div>

            {amount && (
              <div className="bg-gray-800 rounded-lg p-3 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>XLM {orderType === 'buy' ? 'needed' : 'received'}:</span>
                  <span className="text-cyan-400 font-bold">{xlmAmount} XLM</span>
                </div>
                <div className="flex justify-between text-gray-400 mt-1">
                  <span>Price per ZENITH:</span>
                  <span className="text-white">{zenithPrice} XLM</span>
                </div>
              </div>
            )}

            <button
              onClick={handleSwap}
              className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-lg hover:opacity-90 transition-all"
            >
              {orderType === 'buy' ? '⚡ Buy ZENITH' : '💸 Sell ZENITH'} on Stellar DEX
            </button>

            {swapStatus && (
              <div className="text-center text-sm text-gray-400">{swapStatus}</div>
            )}

            <p className="text-xs text-gray-600 text-center">
              Powered by Stellar DEX — Non-custodial trading
            </p>
          </div>
        </div>
      )}

      {/* Trading Chart */}
      {!showSwap && (
        <div className="mx-4">
          <TradingChart tvSymbol={selectedPair.tvSymbol} />
        </div>
      )}

      {/* Order Book placeholder */}
      <div className="mx-4 bg-gray-800/50 border border-gray-700 rounded-xl p-4">
        <h3 className="text-white font-bold mb-3">📊 Order Book — ZENITH/XLM</h3>
        <div className="text-center text-gray-500 text-sm py-4">
          <OrderBook />
        </div>
      </div>
    </div>
  );
}
