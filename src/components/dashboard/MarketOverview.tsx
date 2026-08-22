import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function MarketOverview() {
  const [markets, setMarkets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMarkets();
    const interval = setInterval(fetchMarkets, 60000);
    return () => clearInterval(interval);
  }, []);

  async function fetchMarkets() {
    try {
      const res = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,stellar,cardano,polkadot,dogecoin&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true'
      );
      const data = await res.json();
      setMarkets([
        { symbol: 'XLM', name: 'Stellar', id: 'stellar', price: data.stellar?.usd, change: data.stellar?.usd_24h_change },
        { symbol: 'BTC', name: 'Bitcoin', id: 'bitcoin', price: data.bitcoin?.usd, change: data.bitcoin?.usd_24h_change },
        { symbol: 'ETH', name: 'Ethereum', id: 'ethereum', price: data.ethereum?.usd, change: data.ethereum?.usd_24h_change },
        { symbol: 'ADA', name: 'Cardano', id: 'cardano', price: data.cardano?.usd, change: data.cardano?.usd_24h_change },
        { symbol: 'DOT', name: 'Polkadot', id: 'polkadot', price: data.polkadot?.usd, change: data.polkadot?.usd_24h_change },
        { symbol: 'DOGE', name: 'Dogecoin', id: 'dogecoin', price: data.dogecoin?.usd, change: data.dogecoin?.usd_24h_change },
      ]);
    } catch {}
    setLoading(false);
  }

  const gainers = markets.filter(m => m.change > 0).sort((a,b) => b.change - a.change).slice(0,3);
  const losers = markets.filter(m => m.change < 0).sort((a,b) => a.change - b.change).slice(0,2);

  if (loading) return (
    <div className="mx-4 text-gray-500 text-sm text-center py-4">Loading market data...</div>
  );

  return (
    <div className="space-y-4 mx-4">
      {/* Top Gainers */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <h3 className="text-white font-semibold">Top Gainers (24h)</h3>
        </div>
        <div className="space-y-2">
          {gainers.map((m, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                  <span className="text-green-400 font-bold text-xs">{m.symbol[0]}</span>
                </div>
                <div>
                  <div className="text-white font-medium text-sm">{m.symbol}</div>
                  <div className="text-gray-500 text-xs">{m.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-medium text-sm">
                  ${m.price > 100 ? m.price?.toLocaleString() : m.price?.toFixed(4)}
                </div>
                <div className="text-green-400 text-xs">+{m.change?.toFixed(2)}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Losers */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingDown className="w-4 h-4 text-red-400" />
          <h3 className="text-white font-semibold">Top Losers (24h)</h3>
        </div>
        <div className="space-y-2">
          {losers.map((m, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                  <span className="text-red-400 font-bold text-xs">{m.symbol[0]}</span>
                </div>
                <div>
                  <div className="text-white font-medium text-sm">{m.symbol}</div>
                  <div className="text-gray-500 text-xs">{m.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-medium text-sm">
                  ${m.price > 100 ? m.price?.toLocaleString() : m.price?.toFixed(4)}
                </div>
                <div className="text-red-400 text-xs">{m.change?.toFixed(2)}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-gray-600 text-xs text-center">
        Live data from CoinGecko API • Updates every 60s
      </p>
    </div>
  );
}
