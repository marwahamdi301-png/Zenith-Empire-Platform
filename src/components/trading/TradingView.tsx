import { useState } from 'react';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

export function TradingView() {
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');

  return (
    <div className="grid lg:grid-cols-3 gap-6 animate-slide-in">
      {/* Order Book */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Order Book</h2>
          <div className="grid grid-cols-2 gap-4">
            {/* Asks */}
            <div>
              <div className="text-sm text-gray-400 mb-2">Asks</div>
              <div className="space-y-1">
                {[42100, 42095, 42090].map((price, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-[var(--color-danger)]">{price.toLocaleString()}</span>
                    <span className="text-gray-400">0.{Math.random().toString().slice(2, 6)}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Bids */}
            <div>
              <div className="text-sm text-gray-400 mb-2">Bids</div>
              <div className="space-y-1">
                {[42085, 42080, 42075].map((price, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-[var(--color-success)]">{price.toLocaleString()}</span>
                    <span className="text-gray-400">0.{Math.random().toString().slice(2, 6)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Form */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setOrderType('buy')}
            className={`flex-1 py-3 rounded-lg font-medium transition-all ${
              orderType === 'buy'
                ? 'bg-[var(--color-success)] text-white'
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
            }`}
          >
            <ArrowUpCircle className="w-5 h-5 inline mr-2" />
            Buy
          </button>
          <button
            onClick={() => setOrderType('sell')}
            className={`flex-1 py-3 rounded-lg font-medium transition-all ${
              orderType === 'sell'
                ? 'bg-[var(--color-danger)] text-white'
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
            }`}
          >
            <ArrowDownCircle className="w-5 h-5 inline mr-2" />
            Sell
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Price (USD)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[var(--color-primary)] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Amount (XLM)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-[var(--color-primary)] focus:outline-none"
            />
          </div>

          <button
            className={`w-full py-4 rounded-lg font-bold text-white transition-all ${
              orderType === 'buy'
                ? 'bg-[var(--color-success)] hover:bg-green-600'
                : 'bg-[var(--color-danger)] hover:bg-red-600'
            }`}
          >
            {orderType === 'buy' ? 'Place Buy Order' : 'Place Sell Order'}
          </button>
        </div>
      </div>
    </div>
  );
}
