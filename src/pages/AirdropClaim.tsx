import { useState } from 'react';

const ZENITH_ISSUER = 'GA3T3OZ5V2JAZR5RCH3NII7JBNUMDPBSSXF6N6HKZGLTM5JSZCX7OTFQ';

export default function AirdropClaim() {
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState('');
  const [claimed, setClaimed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  async function checkTrustline() {
    if (!address.startsWith('G') || address.length !== 56) {
      setStatus('❌ Invalid Stellar address');
      return;
    }
    setLoading(true);
    setStatus('⏳ Checking trustline...');
    try {
      const res = await fetch(`https://horizon.stellar.org/accounts/${address}`);
      const data = await res.json();
      const hasTrustline = data.balances?.some(
        (b: any) => b.asset_code === 'ZENITH' && b.asset_issuer === ZENITH_ISSUER
      );
      if (hasTrustline) {
        setStep(3);
        setStatus('✅ Trustline found! Ready to claim!');
      } else {
        setStep(2);
        setStatus('⚠️ Please add ZENITH trustline first');
      }
    } catch {
      setStatus('❌ Address not found on Stellar network');
    }
    setLoading(false);
  }

  async function claimAirdrop() {
    setLoading(true);
    setStatus('⏳ Processing your claim on Stellar...');
    try {
      const response = await fetch('/api/airdrop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, referral })
      });
      const data = await response.json();
      if (data.success) {
        setClaimed(true);
        setStatus(`🎉 1,000 ZENITH sent! TX: ${data.txHash?.slice(0,20)}...`);
      } else {
        setStatus(`❌ Error: ${data.error}`);
      }
    } catch (err) {
      setStatus('❌ Network error. Try again.');
    } finally {
      setLoading(false);
    }
  }

  if (claimed) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-white font-bold text-2xl mb-2">Claim Submitted!</h2>
          <div className="bg-gray-900 border border-green-500/30 rounded-xl p-4 mb-4">
            <div className="text-cyan-400 font-bold text-xl mb-1">⚡ 1,000 ZENITH</div>
            <div className="text-gray-400 text-sm">Will be sent to:</div>
            <div className="text-white text-xs font-mono mt-1">
              {address.substring(0,20)}...{address.substring(52)}
            </div>
          </div>
          <div className="text-gray-500 text-sm mb-4">⏰ Processing within 24 hours</div>
          <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-xl p-4">
            <div className="text-yellow-400 font-bold mb-2">🚀 Earn More ZENITH!</div>
            <div className="text-gray-400 text-sm">Share your referral link and earn 500 ZENITH per friend!</div>
            <button
              onClick={() => navigator.clipboard?.writeText(`https://zenith-empire-cyan.vercel.app?ref=${address.substring(0,8)}`)}
              className="mt-3 w-full py-2 bg-yellow-500 text-black font-bold rounded-lg text-sm"
            >
              📋 Copy Referral Link
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-900 via-orange-900 to-red-900 p-5 text-center">
        <div className="text-5xl mb-2">🎁</div>
        <h2 className="text-white font-bold text-2xl">ZENITH Airdrop</h2>
        <p className="text-yellow-300 text-sm mt-1">Get 1,000 FREE ZENITH tokens!</p>
        <div className="bg-black/30 rounded-xl p-3 mt-3">
          <div className="text-yellow-400 font-bold text-lg">⏰ Limited: First 500 wallets only!</div>
          <div className="text-gray-400 text-xs mt-1">Already claimed: 6/500</div>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
            <div className="bg-yellow-400 h-2 rounded-full" style={{width: '1.2%'}}></div>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="px-4 mt-4">
        <div className="flex justify-between mb-6">
          {['Check Address', 'Add Trustline', 'Claim!'].map((s, i) => (
            <div key={i} className={`flex-1 text-center ${i < 2 ? 'border-r border-gray-700' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1 font-bold text-sm ${step > i+1 ? 'bg-green-500 text-white' : step === i+1 ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-500'}`}>
                {step > i+1 ? '✓' : i+1}
              </div>
              <div className={`text-xs ${step === i+1 ? 'text-yellow-400' : 'text-gray-500'}`}>{s}</div>
            </div>
          ))}
        </div>

        {/* Step 1 */}
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 mb-4">
          <h3 className="text-white font-bold mb-3">1. Enter Your Stellar Address</h3>
          <input
            type="text"
            placeholder="G... (56 characters)"
            value={address}
            onChange={e => setAddress(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-white text-sm font-mono focus:border-yellow-500 focus:outline-none mb-3"
          />
          {status && (
            <div className={`text-sm mb-3 p-2 rounded-lg ${status.includes('❌') ? 'bg-red-900/30 text-red-400' : status.includes('✅') ? 'bg-green-900/30 text-green-400' : 'bg-gray-800 text-gray-400'}`}>
              {status}
            </div>
          )}
          <button
            onClick={checkTrustline}
            disabled={loading || !address}
            className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-lg disabled:opacity-50"
          >
            {loading ? '⏳ Checking...' : '🔍 Check Eligibility'}
          </button>
        </div>

        {/* Step 2 — Add Trustline */}
        {step >= 2 && (
          <div className="bg-gray-900 border border-yellow-500/30 rounded-xl p-4 mb-4">
            <h3 className="text-white font-bold mb-3">2. Add ZENITH Trustline</h3>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex gap-2"><span>1️⃣</span><span>Download <strong className="text-white">Lobstr</strong> wallet app</span></div>
              <div className="flex gap-2"><span>2️⃣</span><span>Go to Assets → Add Asset</span></div>
              <div className="flex gap-2"><span>3️⃣</span><span>Search <strong className="text-yellow-400">ZENITH</strong> or paste issuer:</span></div>
            </div>
            <div className="bg-gray-800 rounded-lg p-2 mt-2 mb-3">
              <div className="text-xs font-mono text-cyan-400 break-all">{ZENITH_ISSUER}</div>
            </div>
            <button
              onClick={checkTrustline}
              disabled={loading}
              className="w-full py-2 bg-blue-500 text-white font-bold rounded-lg text-sm"
            >
              ✅ I Added Trustline — Check Again
            </button>
          </div>
        )}

        {/* Step 3 — Claim */}
        {step >= 3 && (
          <div className="bg-gray-900 border border-green-500/30 rounded-xl p-4 mb-4">
            <h3 className="text-white font-bold mb-3">3. 🎁 Claim Your ZENITH!</h3>
            <div className="bg-green-900/20 rounded-xl p-4 text-center mb-4">
              <div className="text-4xl font-bold text-yellow-400">1,000</div>
              <div className="text-white font-bold">ZENITH Tokens</div>
              <div className="text-gray-500 text-xs mt-1">≈ $0.18 USD</div>
            </div>
            <button
              onClick={claimAirdrop}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold rounded-xl text-lg disabled:opacity-50"
            >
              {loading ? '⏳ Processing...' : '⚡ CLAIM 1,000 ZENITH FREE!'}
            </button>
          </div>
        )}

        {/* Rules */}
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
          <h3 className="text-white font-bold mb-2">📋 Airdrop Rules</h3>
          <div className="space-y-1 text-gray-400 text-xs">
            <div>✅ One claim per wallet address</div>
            <div>✅ Must have ZENITH trustline</div>
            <div>✅ First 500 wallets only</div>
            <div>✅ Tokens sent within 24 hours</div>
            <div>✅ Refer friends = 500 ZENITH bonus each</div>
          </div>
        </div>
      </div>
    </div>
  );
}
