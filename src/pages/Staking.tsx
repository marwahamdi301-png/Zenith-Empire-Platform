import { useState } from 'react';

export default function Staking() {
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [staked, setStaked] = useState(false);

  const plans = [
    { days: 30, apy: '12%', reward: '120', icon: '🥉', color: 'from-orange-700 to-yellow-700' },
    { days: 90, apy: '25%', reward: '250', icon: '🥈', color: 'from-gray-600 to-gray-400' },
    { days: 180, apy: '50%', reward: '500', icon: '🥇', color: 'from-yellow-600 to-yellow-400' },
    { days: 365, apy: '100%', reward: '1000', icon: '💎', color: 'from-cyan-600 to-blue-400' },
  ];

  const [selectedPlan, setSelectedPlan] = useState(plans[0]);

  const dailyReward = amount ? (parseFloat(amount) * parseFloat(selectedPlan.apy) / 100 / 365).toFixed(2) : '0';
  const totalReward = amount ? (parseFloat(amount) * parseFloat(selectedPlan.apy) / 100).toFixed(0) : '0';

  return (
    <div className="min-h-screen bg-gray-950 pb-20">
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-5 text-center">
        <div className="text-5xl mb-2">💎</div>
        <h2 className="text-white font-bold text-2xl">ZENITH Staking</h2>
        <p className="text-blue-300 text-sm">Stake ZENITH — Earn Daily Rewards</p>
        <div className="grid grid-cols-3 gap-2 mt-3">
          <div className="bg-black/30 rounded-lg p-2">
            <div className="text-white font-bold">$178K</div>
            <div className="text-gray-400 text-xs">Total Value</div>
          </div>
          <div className="bg-black/30 rounded-lg p-2">
            <div className="text-white font-bold">100%</div>
            <div className="text-gray-400 text-xs">Max APY</div>
          </div>
          <div className="bg-black/30 rounded-lg p-2">
            <div className="text-white font-bold">6</div>
            <div className="text-gray-400 text-xs">Stakers</div>
          </div>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {/* Plans */}
        <h3 className="text-white font-bold text-lg">📊 Staking Plans</h3>
        <div className="grid grid-cols-2 gap-3">
          {plans.map((plan, i) => (
            <button
              key={i}
              onClick={() => setSelectedPlan(plan)}
              className={`bg-gradient-to-br ${plan.color} rounded-xl p-4 text-left transition-all border-2 ${selectedPlan.days === plan.days ? 'border-white' : 'border-transparent'}`}
            >
              <div className="text-3xl mb-1">{plan.icon}</div>
              <div className="text-white font-bold">{plan.days} Days</div>
              <div className="text-yellow-300 font-bold text-xl">{plan.apy} APY</div>
              <div className="text-white/70 text-xs">+{plan.reward} per 1K ZENITH</div>
            </button>
          ))}
        </div>

        {/* Calculator */}
        <div className="bg-gray-900 border border-blue-500/30 rounded-xl p-4">
          <h3 className="text-white font-bold mb-3">🧮 Reward Calculator</h3>
          <div className="mb-3">
            <label className="text-gray-400 text-sm mb-1 block">Amount to Stake</label>
            <input
              type="number"
              placeholder="1000"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          {amount && (
            <div className="space-y-2 bg-gray-800 rounded-lg p-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Plan:</span>
                <span className="text-white">{selectedPlan.days} Days @ {selectedPlan.apy}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Daily Reward:</span>
                <span className="text-green-400">+{dailyReward} ZENITH/day</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total Reward:</span>
                <span className="text-yellow-400 font-bold">+{totalReward} ZENITH</span>
              </div>
            </div>
          )}
        </div>

        {/* Stake Form */}
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
          <h3 className="text-white font-bold mb-3">⚡ Start Staking</h3>
          <input
            type="text"
            placeholder="Your Stellar address (G...)"
            value={address}
            onChange={e => setAddress(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm mb-3 focus:outline-none focus:border-blue-500"
          />
          <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3 mb-3 text-xs text-yellow-400">
            ⚠️ Staking coming soon! Join our Telegram to be notified first.
          </div>
          <button
            onClick={() => window.open('https://t.me/BayaEmpireOfficial', '_blank')}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl"
          >
            🔔 Notify Me When Live
          </button>
        </div>

        {/* Referral */}
        <div className="bg-gradient-to-r from-green-900/40 to-teal-900/40 border border-green-500/30 rounded-xl p-4">
          <h3 className="text-white font-bold mb-2">🔗 Referral Program</h3>
          <div className="space-y-2 text-sm text-gray-400 mb-3">
            <div>👥 Refer a friend → <span className="text-green-400 font-bold">+500 ZENITH</span></div>
            <div>🏆 Top referrer this month wins <span className="text-yellow-400 font-bold">10,000 ZENITH</span></div>
          </div>
          <input
            type="text"
            placeholder="Your address to generate referral link..."
            value={address}
            onChange={e => setAddress(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm mb-2 focus:outline-none"
          />
          {address.length === 56 && (
            <button
              onClick={() => navigator.clipboard?.writeText(`https://zenith-empire-cyan.vercel.app?ref=${address.substring(0,8)}`)}
              className="w-full py-2 bg-green-500 text-white font-bold rounded-lg text-sm"
            >
              📋 Copy My Referral Link
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
