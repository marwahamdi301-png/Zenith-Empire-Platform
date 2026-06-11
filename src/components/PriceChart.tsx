import { useEffect, useState } from 'react';

const ZENITH_ISSUER = 'GA3T3OZ5V2JAZR5RCH3NII7JBNUMDPBSSXF6N6HKZGLTM5JSZCX7OTFQ';

export default function PriceChart() {
  const [price, setPrice] = useState<string>('...');
  const [priceUSD, setPriceUSD] = useState<string>('...');
  const [trades, setTrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrice();
    const interval = setInterval(fetchPrice, 30000);
    return () => clearInterval(interval);
  }, []);

  async function fetchPrice() {
    try {
      // Get ZENITH orderbook
      const res = await fetch(
        `https://horizon.stellar.org/order_book?selling_asset_type=credit_alphanum12&selling_asset_code=ZENITH&selling_asset_issuer=${ZENITH_ISSUER}&buying_asset_type=native&limit=1`
      );
      const data = await res.json();

      // Get XLM price in USD
      const xlmRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=stellar&vs_currencies=usd');
      const xlmData = await xlmRes.json();
      const xlmUSD = xlmData?.stellar?.usd || 0.12;

      if (data.asks && data.asks.length > 0) {
        const priceXLM = parseFloat(data.asks[0].price);
        setPrice(priceXLM.toFixed(7));
        setPriceUSD((priceXLM * xlmUSD).toFixed(8));
      } else if (data.bids && data.bids.length > 0) {
        const priceXLM = parseFloat(data.bids[0].price);
        setPrice(priceXLM.toFixed(7));
        setPriceUSD((priceXLM * xlmUSD).toFixed(8));
      }

      // Get recent trades
      const tradesRes = await fetch(
        `https://horizon.stellar.org/trades?base_asset_type=credit_alphanum12&base_asset_code=ZENITH&base_asset_issuer=${ZENITH_ISSUER}&counter_asset_type=native&limit=5&order=desc`
      );
      const tradesData = await tradesRes.json();
      setTrades(tradesData._embedded?.records || []);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-900 border border-cyan-500/20 rounded-xl p-6 text-white mx-4 mb-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">⚡</span>
        <h2 className="text-xl font-bold">ZENITH / XLM</h2>
        <span className="ml-auto text-xs text-gray-500 animate-pulse">● LIVE</span>
      </div>

      {loading ? (
        <div className="text-gray-400">Loading price...</div>
      ) : (
        <>
          <div className="text-3xl font-bold text-cyan-400 mb-1">
            {price} <span className="text-lg">XLM</span>
          </div>
          <div className="text-gray-400 text-sm mb-6">
            ≈ ${priceUSD} USD
          </div>
        </>
      )}

      <div>
        <h3 className="text-sm font-semibold text-gray-400 mb-3">Recent Trades</h3>
        {trades.length === 0 ? (
          <p className="text-gray-600 text-sm">No trades yet — be the first! 🚀</p>
        ) : (
          trades.map((trade, i) => (
            <div key={i} className="flex justify-between py-2 border-b border-gray-800 text-sm">
              <span className="text-green-400">
                {parseFloat(trade.base_amount).toFixed(0)} ZENITH
              </span>
              <span className="text-gray-400">
                {parseFloat(trade.counter_amount).toFixed(4)} XLM
              </span>
              <span className="text-gray-600">
                {new Date(trade.ledger_close_time).toLocaleTimeString()}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 text-xs text-gray-600 flex justify-between">
        <span>Updates every 30s</span>
        <a
          href="https://stellar.expert/explorer/public/asset/ZENITH-GA3T3OZ5V2JAZR5RCH3NII7JBNUMDPBSSXF6N6HKZGLTM5JSZCX7OTFQ"
          target="_blank"
          className="text-cyan-600 hover:text-cyan-400"
        >
          View on StellarExpert ↗
        </a>
      </div>
    </div>
  );
}
