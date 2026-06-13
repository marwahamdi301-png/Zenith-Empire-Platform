import { useState, useEffect } from 'react';

const ZENITH_ISSUER = 'GA3T3OZ5V2JAZR5RCH3NII7JBNUMDPBSSXF6N6HKZGLTM5JSZCX7OTFQ';

export function PortfolioManager() {
  const [address, setAddress] = useState('');
  const [input, setInput] = useState('');
  const [balances, setBalances] = useState<any>(null);
  const [txHistory, setTxHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [xlmPrice, setXlmPrice] = useState(0.12);

  useEffect(() => {
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=stellar&vs_currencies=usd')
      .then(r => r.json())
      .then(d => setXlmPrice(d?.stellar?.usd || 0.12))
      .catch(() => {});
  }, []);

  async function connectWallet() {
    if (!input.startsWith('G') || input.length !== 56) {
      setError('❌ Invalid Stellar address');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`https://horizon.stellar.org/accounts/${input}`);
      if (!res.ok) throw new Error('Not found');
      const data = await res.json();

      let xlm = '0', zenith = '0';
      for (const b of data.balances) {
        if (b.asset_type === 'native') xlm = parseFloat(b.balance).toFixed(4);
        if (b.asset_code === 'ZENITH') zenith = parseFloat(b.balance).toFixed(4);
      }
      setBalances({ xlm, zenith, raw: data.balances });
      setAddress(input);

      // Get recent transactions
      const txRes = await fetch(
        `https://horizon.stellar.org/accounts/${input}/payments?limit=5&order=desc`
      );
      const txData = await txRes.json();
      setTxHistory(txData._embedded?.records || []);
    } catch (e) {
      setError('❌ Address not found on Stellar network');
    }
    setLoading(false);
  }

  const xlmUSD = (parseFloat(balances?.xlm || '0') * xlmPrice).toFixed(2);
  const zenithUSD = (parseFloat(balances?.zenith || '0') * 0.000178).toFixed(4);
  const totalUSD = (parseFloat(xlmUSD) + parseFloat(zenithUSD)).toFixed(2);

  if (!address) {
    return (
      <div className="bg-gray-900 border border-cyan-500/20 rounded-xl p-5 mx-4 mb-4">
        <h3 className="text-white font-bold text-lg mb-1">💼 Portfolio Tracker</h3>
        <p className="text-gray-500 text-xs mb-4">Connect your Stellar wallet — read only, no private key needed</p>
        <input
          type="text"
          placeholder="Enter Stellar address (G...)"
          value={input}
          onChange={e => setInput(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-white text-sm focus:border-cyan-500 focus:outline-none mb-3"
        />
        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
        <button
          onClick={connectWallet}
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-lg disabled:opacity-50"
        >
          {loading ? '⏳ Loading...' : '🔗 Connect Wallet'}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-cyan-500/20 rounded-xl p-5 mx-4 mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold">💼 My Portfolio</h3>
        <button onClick={() => { setAddress(''); setBalances(null); }}
          className="text-gray-600 text-xs hover:text-gray-400">
          Disconnect
        </button>
      </div>

      {/* Address */}
      <div className="text-xs text-gray-600 mb-4 font-mono">
        {address.substring(0,8)}...{address.substring(48)}
      </div>

      {/* Total Value */}
      <div className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border border-cyan-500/20 rounded-xl p-4 mb-4 text-center">
        <div className="text-gray-400 text-xs mb-1">Total Portfolio Value</div>
        <div className="text-3xl font-bold text-white">${totalUSD}</div>
        <div className="text-gray-500 text-xs mt-1">USD estimated</div>
      </div>

      {/* Balances */}
      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center bg-gray-800 rounded-lg p-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center font-bold text-sm">X</div>
            <div>
              <div className="text-white font-bold text-sm">XLM</div>
              <div className="text-gray-500 text-xs">Stellar Lumens</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-white font-bold">{balances?.xlm}</div>
            <div className="text-gray-500 text-xs">${xlmUSD}</div>
          </div>
        </div>

        <div className="flex justify-between items-center bg-gray-800 rounded-lg p-3 border border-yellow-500/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-yellow-500 rounded-full flex items-center justify-center font-bold text-sm">⚡</div>
            <div>
              <div className="text-white font-bold text-sm">ZENITH</div>
              <div className="text-gray-500 text-xs">Zenith Empire Token</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-yellow-400 font-bold">{balances?.zenith}</div>
            <div className="text-gray-500 text-xs">${zenithUSD}</div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      {txHistory.length > 0 && (
        <div>
          <h4 className="text-gray-400 text-xs font-bold mb-2">Recent Transactions</h4>
          {txHistory.map((tx, i) => (
            <div key={i} className="flex justify-between py-2 border-b border-gray-800 text-xs">
              <span className="text-gray-400">
                {tx.type === 'payment' ? '💸' : '🔄'} {tx.type}
              </span>
              <span className="text-gray-500">
                {new Date(tx.created_at).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}

      <a
        href={`https://stellar.expert/explorer/public/account/${address}`}
        target="_blank"
        className="block text-center text-xs text-cyan-600 hover:text-cyan-400 mt-4"
      >
        View full history on StellarExpert ↗
      </a>
    </div>
  );
}
