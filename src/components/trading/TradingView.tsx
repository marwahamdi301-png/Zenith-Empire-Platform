import { useState } from 'react';
import { ArrowUpCircle, ArrowDownCircle, TrendingUp } from 'lucide-react';

const tradingPairs = [
  { pair: 'XLM/USDC', price: 0.1234, change: '+5.2%', volume: '1.2M' },
  { pair: 'BTC/USDC', price: 42100, change: '+2.8%', volume: '842K' },
  { pair: 'ETH/USDC', price: 2340, change: '-1.3%', volume: '523K' },
];

export function TradingView() {
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [selectedPair, setSelectedPair] = useState('XLM/USDC');

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Trading Pairs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {tradingPairs.map((pair) => {
          const isPositive = pair.change.startsWith('+');
          const isSelected = selectedPair === pair.pair;
          
          return (
            <button
              key={pair.pair}
              onClick={() => setSelectedPair(pair.pair)}
              className={`bg-gray-800/50 backdrop-blur-sm border rounded-xl p-4 text-left transition-all ${
                isSelected 
                  ? 'border-primary shadow-lg shadow-primary/20' 
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-white">{pair.pair}</span>
                <TrendingUp className={`w-4 h-4 ${isPositive ? 'text-green-400' : 'text-red-400'}`} />
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                ${pair.price.toLocaleString()}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className={isPositive ? 'text-green-400' : 'text-red-400'}>
                  {pair.change}
                </span>
                <span className="text-gray-400">Vol: {pair.volume}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Order Book */}
        <div className="lg:col-span-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Order Book - {selectedPair}</h2>
          <div className="grid grid-cols-2 gap-6">
            {/* Asks */}
            <div>
              <div className="flex items-center justify-between text-xs text-gray-400 mb-2 px-2">
                <span>Price (USDC)</span>
                <span>Amount</span>
              </div>
              <div className="space-y-1">
                {[0.1240, 0.1238, 0.1236, 0.1235, 0.1234].map((askPrice, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-sm px-2 py-1 rounded hover:bg-red-500/10 transition-all"
                  >
                    <span className="text-red-400 font-medium">{askPrice.toFixed(4)}</span>
                    <span className="text-gray-400">{(Math.random() * 10000).toFixed(0)}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Bids */}
            <div>
              <div className="flex items-center justify-between text-xs text-gray-400 mb-2 px-2">
                <span>Price (USDC)</span>
                <span>Amount</span>
              </div>
              <div className="space-y-1">
                {[0.1233, 0.1232, 0.1230, 0.1228, 0.1226].map((bidPrice, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-sm px-2 py-1 rounded hover:bg-green-500/10 transition-all"
                  >
                    <span className="text-green-400 font-medium">{bidPrice.toFixed(4)}</span>
                    <span className="text-gray-400">{(Math.random() * 10000).toFixed(0)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Order Form */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Place Order</h2>
          
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setOrderType('buy')}
              className={`flex-1 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                orderType === 'buy'
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              <ArrowUpCircle className="w-5 h-5" />
              Buy
            </button>
            <button
              onClick={() => setOrderType('sell')}
              className={`flex-1 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                orderType === 'sell'
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              <ArrowDownCircle className="w-5 h-5" />
              Sell
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Price (USDC)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.1234"
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Amount (XLM)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="1000"
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div className="bg-gray-900/50 rounded-lg p-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Total</span>
                <span className="text-white font-bold">
                  {price && amount ? `$${(parseFloat(price) * parseFloat(amount)).toFixed(2)}` : '$0.00'}
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Fee (0.1%)</span>
                <span>{price && amount ? `$${(parseFloat(price) * parseFloat(amount) * 0.001).toFixed(2)}` : '$0.00'}</span>
              </div>
            </div>

            <button
              className={`w-full py-4 rounded-lg font-bold text-white transition-all shadow-lg ${
                orderType === 'buy'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-green-500/30'
                  : 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-red-500/30'
              }`}
            >
              {orderType === 'buy' ? 'Place Buy Order' : 'Place Sell Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
