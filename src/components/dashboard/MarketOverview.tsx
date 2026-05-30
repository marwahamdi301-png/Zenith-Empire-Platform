import { TrendingUp, TrendingDown, Zap } from 'lucide-react';

const topGainers = [
  { symbol: 'XLM', name: 'Stellar', price: 0.1234, change: '+15.3%', volume: '$1.2M' },
  { symbol: 'ADA', name: 'Cardano', price: 0.4521, change: '+12.8%', volume: '$842K' },
  { symbol: 'DOT', name: 'Polkadot', price: 6.78, change: '+9.2%', volume: '$523K' },
];

const topLosers = [
  { symbol: 'DOGE', name: 'Dogecoin', price: 0.0821, change: '-8.4%', volume: '$412K' },
  { symbol: 'SHIB', name: 'Shiba Inu', price: 0.000012, change: '-6.2%', volume: '$321K' },
];

export function MarketOverview() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Top Gainers */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-bold text-white">Top Gainers (24h)</h3>
        </div>
        <div className="space-y-3">
          {topGainers.map((coin, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg hover:bg-gray-900/80 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center font-bold text-white">
                  {coin.symbol[0]}
                </div>
                <div>
                  <div className="font-bold text-white">{coin.symbol}</div>
                  <div className="text-xs text-gray-400">{coin.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-white">${coin.price}</div>
                <div className="text-sm text-green-400">{coin.change}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Losers */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingDown className="w-5 h-5 text-red-400" />
          <h3 className="text-lg font-bold text-white">Top Losers (24h)</h3>
        </div>
        <div className="space-y-3">
          {topLosers.map((coin, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg hover:bg-gray-900/80 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center font-bold text-white">
                  {coin.symbol[0]}
                </div>
                <div>
                  <div className="font-bold text-white">{coin.symbol}</div>
                  <div className="text-xs text-gray-400">{coin.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-white">${coin.price}</div>
                <div className="text-sm text-red-400">{coin.change}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
