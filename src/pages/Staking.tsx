import { useState } from 'react';

export default function Staking() {
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedDays, setSelectedDays] = useState(30);

  const plans = [
    { days: 30, apy: 12, icon: '🥉', color: 'from-orange-800 to-yellow-800' },
    { days: 90, apy: 25, icon: '🥈', color: 'from-gray-700 to-gray-500' },
    { days: 180, apy: 50, icon: '🥇', color: 'from-yellow-700 to-yellow-500' },
    { days: 365, apy: 100, icon: '💎', color: 'from-cyan-800 to-blue-700' },
  ];

  const selected = plans.find(p => p.days === selectedDays) || plans[0];
  const totalReward = amount ? (parseFloat(amount) * selected.apy / 100).toFixed(0) : '0';
  const dailyReward = amount ? (parseFloat(amount) * selected.apy / 100 / selected.days).toFixed(2) : '0';

  return (
    <div className="min-h-screen bg-gray-950 pb-20">
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-5 text-center">
        <div className="text-5xl mb-2">💎</div>
        <h2 className="text-white font-bold text-2xl">ZENITH Staking</h2>
        <p className="text-blue-300 text-sm">Hold ZENITH — Earn Rewards</p>
        <div className="bg-yellow-900/40 border border-yellow-500/30 rounded-xl p-3 mt-3">
          <p className="text-yellow-400 text-xs font-bold">
            🚧 Staking smart contract under development.
            Sign up to be notified at launch.
          </p>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {/* Plans */}
        <h3 className="text-white font-bold text-lg">📊 Planned Staking Tiers</h3>
        <div className="grid grid-cols-2 gap-3">
          {plans.map((plan) => (
            <button
              key={plan.days}
              onClick={() => setSelectedDays(plan.days)}
              className={`bg-gradient-to-br ${plan.color} rounded-xl p-4 text-left border-2 transition-all ${selectedDays === plan.days ? 'border-white' : 'border-transparent'}`}
            >
              <div className="text-3xl mb-1">{plan.icon}</div>
              <div className="text-white font-bold">{plan.days} Days</div>
              <div className="text-yellow-300 font-bold text-xl">{plan.apy}% APY</div>
              <div className="text-white/70 text-xs">+{plan.apy * 10} per 1K ZENITH</div>
            </button>
          ))}
        </div>

        {/* Calculator */}
        <div className="bg-gray-900 border border-blue-500/30 rounded-xl p-4">
          <h3 className="text-white font-bold mb-3">🧮 Reward Calculator</h3>
          <input
            type="number"
            placeholder="Enter ZENITH amount..."
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white mb-3 focus:outline-none focus:border-blue-500"
          />
          {amount && (
            <div className="bg-gray-800 rounded-lg p-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Plan:</span>
                <span className="text-white">{selected.days} Days @ {selected.apy}% APY</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Daily reward:</span>
                <span className="text-green-400">+{dailyReward} ZENITH/day</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total reward:</span>
                <span className="text-yellow-400 font-bold">+{totalReward} ZENITH</span>
              </div>
            </div>
          )}
        </div>

        {/* Waitlist */}
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
          <h3 className="text-white font-bold mb-3">🔔 Join Staking Waitlist</h3>
          <p className="text-gray-400 text-sm mb-3">
            Enter your Stellar address to be notified when staking goes live.
            Early stakers get 10% bonus rewards.
          </p>
          <input
            type="text"
            placeholder="Your Stellar address (G...)"
            value={address}
            onChange={e => setAddress(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm mb-3 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={() => window.open('https://t.me/BayaEmpirePro', '_blank')}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl"
          >
            🔔 Join Waitlist on Telegram
          </button>
        </div>

        {/* Referral */}
        <div className="bg-gradient-to-r from-green-900/40 to-teal-900/40 border border-green-500/30 rounded-xl p-4">
          <h3 className="text-white font-bold mb-2">🔗 Referral Program</h3>
          <p className="text-gray-400 text-xs mb-3">
            Refer friends to ZENITH and earn bonus tokens when staking launches.
          </p>
          <div className="space-y-2 text-sm mb-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Per referral:</span>
              <span className="text-green-400 font-bold">+500 ZENITH</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Monthly top referrer:</span>
              <span className="text-yellow-400 font-bold">+10,000 ZENITH</span>
            </div>
          </div>
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
