import { useEffect, useState } from 'react';

export function PriceTicker() {
  const [prices, setPrices] = useState<any[]>([]);

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  async function fetchPrices() {
    try {
      const res = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,stellar,ripple&vs_currencies=usd&include_24hr_change=true'
      );
      const data = await res.json();
      setPrices([
        { symbol: 'BTC', price: data.bitcoin?.usd, change: data.bitcoin?.usd_24h_change },
        { symbol: 'ETH', price: data.ethereum?.usd, change: data.ethereum?.usd_24h_change },
        { symbol: 'XLM', price: data.stellar?.usd, change: data.stellar?.usd_24h_change },
        { symbol: 'XRP', price: data.ripple?.usd, change: data.ripple?.usd_24h_change },
      ]);
    } catch {}
  }

  if (!prices.length) return null;

  return (
    <div className="flex gap-6 overflow-x-auto text-xs py-1">
      {prices.map((p, i) => (
        <span key={i} className="flex gap-1 flex-shrink-0">
          <span className="text-gray-400">{p.symbol}</span>
          <span className="text-white font-medium">
            ${p.price > 100 ? p.price.toLocaleString() : p.price?.toFixed(4)}
          </span>
          <span className={p.change > 0 ? 'text-green-400' : 'text-red-400'}>
            {p.change > 0 ? '+' : ''}{p.change?.toFixed(2)}%
          </span>
        </span>
      ))}
    </div>
  );
}
