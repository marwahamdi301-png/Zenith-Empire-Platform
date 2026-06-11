import { useEffect, useState } from 'react';

const ZENITH_ISSUER = 'GA3T3OZ5V2JAZR5RCH3NII7JBNUMDPBSSXF6N6HKZGLTM5JSZCX7OTFQ';

export default function PriceChart() {
  const [price, setPrice] = useState<string>('Loading...');
  const [trades, setTrades] = useState<any[]>([]);

  useEffect(() => {
    fetchPrice();
    const interval = setInterval(fetchPrice, 30000);
    return () => clearInterval(interval);
  }, []);

  async function fetchPrice() {
    try {
      const res = await fetch(
        `https://horizon.stellar.org/order_book?selling_asset_type=native&buying_asset_type=credit_alphanum12&buying_asset_code=ZENITH&buying_asset_issuer=${ZENITH_ISSUER}`
      );
      const data = await res.json();
      if (data.bids && data.bids.length > 0) {
        setPrice(parseFloat(data.bids[0].price).toFixed(7));
      }

      const tradesRes = await fetch(
        `https://horizon.stellar.org/trades?base_asset_type=native&counter_asset_code=ZENITH&counter_asset_issuer=${ZENITH_ISSUER}&limit=10&order=desc`
      );
      const tradesData = await tradesRes.json();
      setTrades(tradesData._embedded?.records || []);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="bg-gray-900 rounded-xl p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">
        ⚡ ZENITH / XLM
      </h2>

      <div className="text-4xl font-bold text-cyan-400 mb-6">
        {price} XLM
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-3 text-gray-300">
          Latest Trades
        </h3>
        {trades.length === 0 ? (
          <p className="text-gray-500">No trades yet</p>
        ) : (
          trades.map((trade, i) => (
            <div key={i} className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-green-400">
                {parseFloat(trade.counter_amount).toFixed(0)} ZENITH
              </span>
              <span className="text-gray-400">
                {parseFloat(trade.price.d / trade.price.n).toFixed(7)} XLM
              </span>
              <span className="text-gray-500 text-sm">
                {new Date(trade.ledger_close_time).toLocaleTimeString()}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 text-xs text-gray-500">
        Updates every 30 seconds
      </div>
    </div>
  );
}
