import { useEffect, useState } from 'react';

const initialPrices = [
  { symbol: 'BTC', price: 42100, change: 2.3 },
  { symbol: 'ETH', price: 2340, change: -1.2 },
  { symbol: 'XLM', price: 0.1234, change: 5.8 },
  { symbol: 'ADA', price: 0.452, change: 3.1 },
  { symbol: 'DOT', price: 6.78, change: -0.8 },
  { symbol: 'USDC', price: 1.00, change: 0.0 },
];

export function PriceTicker() {
  const [prices, setPrices] = useState(initialPrices);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => prev.map(p => ({
        ...p,
        price: p.price * (1 + (Math.random() - 0.5) * 0.001),
        change: p.change + (Math.random() - 0.5) * 0.1,
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm border-b border-gray-700 overflow-hidden">
      <div className="flex animate-scroll">
        {[...prices, ...prices].map((item, i) => (
          <div key={i} className="flex items-center gap-2 px-6 py-2 whitespace-nowrap">
            <span className="font-bold text-white">{item.symbol}</span>
            <span className="text-gray-300">${item.price.toFixed(item.price < 1 ? 4 : 2)}</span>
            <span className={`text-sm ${item.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
