import { useEffect, useState } from 'react';

const ZENITH_ISSUER = 'GA3T3OZ5V2JAZR5RCH3NII7JBNUMDPBSSXF6N6HKZGLTM5JSZCX7OTFQ';

export default function Analytics() {
  const [price, setPrice] = useState(0.0001783);
  const [holders, setHolders] = useState(6);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch(`https://horizon.stellar.org/assets?asset_code=ZENITH&asset_issuer=${ZENITH_ISSUER}`)
      .then(r => r.json())
      .then(d => setHolders(d._embedded?.records[0]?.num_accounts || 6))
      .catch(() => {});
  }, []);

  const leaderboard = [
    { rank: 1, address: 'GB6TK6UP...XLZB', balance: '994,965,000', pct: '99.5%', badge: '👑' },
    { rank: 2, address: 'GDHT7NMO...I4TR', balance: '2,051,496', pct: '0.2%', badge: '🥈' },
    { rank: 3, address: 'GD5EACNT...T2P', balance: '10,000', pct: '0.001%', badge: '🥉' },
    { rank: 4, address: 'GCMRPF2K...P6', balance: '11,000', pct: '0.001%', badge: '⭐' },
    { rank: 5, address: 'GDPMNWGH...EX', balance: '1,000', pct: '0.0001%', badge: '⭐' },
  ];

  const chats = [
    { user: 'Ahmed_TN', msg: '⚡ ZENITH to the moon!', time: '2m' },
    { user: 'Marwa_DZ', msg: 'Airdrop received 🎉', time: '5m' },
    { user: 'Karim_MA', msg: 'When CoinGecko listing?', time: '8m' },
    { user: 'Sara_EU', msg: 'Bought olive oil with ZENITH!', time: '12m' },
  ];

  return (
    <div className="space-y-4 pb-20">
      <div className="bg-gradient-to-r from-purple-900 to-blue-900 p-5">
        <h2 className="text-white font-bold text-xl">📊 ZENITH Analytics</h2>
        <p className="text-purple-300 text-sm">Real-time market data</p>
      </div>

      <div className="grid grid-cols-2 gap-3 px-4">
        {[
          { label: 'Price', value: `$${price.toFixed(7)}`, icon: '💰' },
          { label: 'Market Cap', value: '$178K', icon: '📈' },
          { label: 'Holders', value: holders.toString(), icon: '👥' },
          { label: 'Supply', value: '1B ZENITH', icon: '🪙' },
          { label: 'Network', value: 'Stellar', icon: '⭐' },
          { label: 'Status', value: 'Live ✅', icon: '🟢' },
        ].map((s, i) => (
          <div key={i} className="bg-gray-900 border border-gray-700 rounded-xl p-3">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-gray-400 text-xs">{s.label}</div>
            <div className="text-white font-bold text-sm">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="mx-4 bg-gray-900 border border-gray-700 rounded-xl p-4">
        <h3 className="text-white font-bold text-lg mb-4">🏆 Top Holders Leaderboard</h3>
        {leaderboard.map((h, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <span className="text-xl">{h.badge}</span>
              <div>
                <div className="text-white text-xs font-mono">{h.address}</div>
                <div className="text-gray-500 text-xs">{h.pct}</div>
              </div>
            </div>
            <div className="text-cyan-400 font-bold text-xs">{h.balance}</div>
          </div>
        ))}
      </div>

      <div className="mx-4 bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-500/30 rounded-xl p-4">
        <h3 className="text-white font-bold mb-3">🤖 AI Trading Signal</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Signal:</span>
            <span className="text-green-400 font-bold">🟢 ACCUMULATE</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Confidence:</span>
            <span className="text-white">72%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Target:</span>
            <span className="text-cyan-400">$0.001 (+5x)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Reason:</span>
            <span className="text-gray-300 text-xs">Low cap + High utility + Growing</span>
          </div>
        </div>
        <p className="text-gray-600 text-xs mt-2">⚠️ Not financial advice. DYOR.</p>
      </div>

      <div className="mx-4 bg-gray-900 border border-gray-700 rounded-xl p-4">
        <h3 className="text-white font-bold mb-3">💬 Community Chat</h3>
        <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
          {chats.map((c, i) => (
            <div key={i} className="flex gap-2 text-sm">
              <span className="text-cyan-400 font-bold flex-shrink-0">{c.user}:</span>
              <span className="text-gray-300 flex-1">{c.msg}</span>
              <span className="text-gray-600 text-xs">{c.time}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={msg}
            onChange={e => setMsg(e.target.value)}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none"
          />
          <button className="px-3 py-2 bg-purple-500 text-white rounded-lg text-sm font-bold">
            Send
          </button>
        </div>
        <p className="text-gray-600 text-xs mt-2 text-center">
          Live chat → t.me/BayaEmpireOfficial
        </p>
      </div>
    </div>
  );
}
