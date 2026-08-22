import { useEffect, useState } from 'react';

const ZENITH_ISSUER = 'GA3T3OZ5V2JAZR5RCH3NII7JBNUMDPBSSXF6N6HKZGLTM5JSZCX7OTFQ';

export function OrderBook() {
  const [asks, setAsks] = useState<any[]>([]);
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderBook();
    const interval = setInterval(fetchOrderBook, 15000);
    return () => clearInterval(interval);
  }, []);

  async function fetchOrderBook() {
    try {
      const res = await fetch(
        `https://horizon.stellar.org/order_book?selling_asset_type=credit_alphanum12&selling_asset_code=ZENITH&selling_asset_issuer=${ZENITH_ISSUER}&buying_asset_type=native&limit=5`
      );
      const data = await res.json();
      setAsks(data.asks || []);
      setBids(data.bids || []);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold">📊 Order Book — ZENITH/XLM</h3>
        <span className="text-xs text-gray-500 animate-pulse">● Live</span>
      </div>

      {loading ? (
        <div className="text-gray-500 text-center py-4">Loading...</div>
      ) : (
        <>
          {/* Headers */}
          <div className="grid grid-cols-3 text-xs text-gray-500 mb-2 px-1">
            <span>Price (XLM)</span>
            <span className="text-center">Amount</span>
            <span className="text-right">Total</span>
          </div>

          {/* Asks (Sell) */}
          {asks.length === 0 ? (
            <div className="text-center text-gray-600 text-sm py-2">No sell orders</div>
          ) : (
            asks.slice(0,5).reverse().map((ask, i) => (
              <div key={i} className="grid grid-cols-3 text-xs py-1 border-b border-gray-800">
                <span className="text-red-400">{parseFloat(ask.price).toFixed(7)}</span>
                <span className="text-center text-gray-300">{parseFloat(ask.amount).toFixed(0)}</span>
                <span className="text-right text-gray-500">
                  {(parseFloat(ask.price) * parseFloat(ask.amount)).toFixed(4)}
                </span>
              </div>
            ))
          )}

          {/* Spread */}
          <div className="text-center text-cyan-400 font-bold text-sm py-2 border-b border-gray-700">
            {asks[0] ? parseFloat(asks[0].price).toFixed(7) : '---'} XLM
          </div>

          {/* Bids (Buy) */}
          {bids.length === 0 ? (
            <div className="text-center text-gray-600 text-sm py-2">No buy orders</div>
          ) : (
            bids.slice(0,5).map((bid, i) => (
              <div key={i} className="grid grid-cols-3 text-xs py-1 border-b border-gray-800">
                <span className="text-green-400">{parseFloat(bid.price).toFixed(7)}</span>
                <span className="text-center text-gray-300">{parseFloat(bid.amount).toFixed(0)}</span>
                <span className="text-right text-gray-500">
                  {(parseFloat(bid.price) * parseFloat(bid.amount)).toFixed(4)}
                </span>
              </div>
            ))
          )}

          <div className="mt-3 text-xs text-gray-600 text-center">
            Updates every 15s · Stellar DEX
          </div>
        </>
      )}
    </div>
  );
}
