import { useState } from 'react';

const countries = [
  '🇹🇳 Tunisia', '🇲🇦 Morocco', '🇩🇿 Algeria', '🇱🇾 Libya',
  '🇪🇬 Egypt', '🇸🇳 Senegal', '🇨🇮 Ivory Coast', '🇳🇬 Nigeria',
  '🇷🇸 Serbia', '🇧🇦 Bosnia', '🇭🇷 Croatia', '🇸🇮 Slovenia',
  '🇫🇷 France', '🇩🇪 Germany', '🇮🇹 Italy', '🇪🇸 Spain',
];

const productCategories = [
  '🫒 Olive Oil', '🌵 Prickly Pear Oil', '🌰 Argan Oil',
  '🌶️ Spices & Harissa', '🌴 Dates', '🧵 Textiles & Carpets',
  '👜 Leather Goods', '🏺 Ceramics & Pottery', '💄 Cosmetics',
  '🍯 Honey', '🐟 Seafood', '🌾 Grains & Couscous',
  '🌿 Herbs & Tea', '🎨 Handicrafts', '🪨 Marble & Stone',
  '🚜 Agricultural Equipment', '📱 Electronics', '🛖 Other',
];

export default function SellerRegister() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    whatsapp: '',
    country: '',
    city: '',
    categories: [] as string[],
    description: '',
    walletAddress: '',
    monthlyVolume: '',
    website: '',
  });

  function updateForm(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function toggleCategory(cat: string) {
    setForm(prev => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat]
    }));
  }

  function handleSubmit() {
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-white font-bold text-2xl mb-2">Application Submitted!</h2>
          <p className="text-gray-400 mb-4">
            Thank you <span className="text-cyan-400">{form.businessName}</span>!
            We will review your application and contact you within 48 hours.
          </p>
          <div className="bg-gray-900 border border-green-500/30 rounded-xl p-4 text-left mb-6">
            <div className="text-green-400 font-bold mb-2">✅ What happens next:</div>
            <div className="space-y-2 text-gray-400 text-sm">
              <div>1. Our team reviews your application</div>
              <div>2. We verify your products</div>
              <div>3. Your store goes live on ZENITH Marketplace</div>
              <div>4. Start receiving ZENITH payments instantly!</div>
            </div>
          </div>
          <div className="text-gray-500 text-sm">
            📧 Check {form.email} for confirmation
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-900 to-teal-900 p-5">
        <h2 className="text-white font-bold text-xl mb-1">🌾 Become a Seller</h2>
        <p className="text-green-300 text-sm">
          Sell your products across Maghreb · Africa · Balkans · Europe
        </p>
        <div className="flex gap-2 mt-3">
          {[1,2,3].map(s => (
            <div key={s} className={`flex-1 h-1.5 rounded-full ${step >= s ? 'bg-green-400' : 'bg-gray-700'}`} />
          ))}
        </div>
        <div className="text-gray-400 text-xs mt-2">Step {step} of 3</div>
      </div>

      <div className="p-4 space-y-4">

        {/* Step 1 — Business Info */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg">📋 Business Information</h3>

            <div>
              <label className="text-gray-400 text-sm mb-1 block">Business Name *</label>
              <input
                type="text"
                placeholder="e.g. Hamdi Farm, Atlas Crafts..."
                value={form.businessName}
                onChange={e => updateForm('businessName', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-white text-sm focus:border-green-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1 block">Owner Name *</label>
              <input
                type="text"
                placeholder="Your full name"
                value={form.ownerName}
                onChange={e => updateForm('ownerName', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-white text-sm focus:border-green-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1 block">Email *</label>
              <input
                type="email"
                placeholder="business@email.com"
                value={form.email}
                onChange={e => updateForm('email', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-white text-sm focus:border-green-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1 block">WhatsApp Number</label>
              <input
                type="tel"
                placeholder="+216 XX XXX XXX"
                value={form.whatsapp}
                onChange={e => updateForm('whatsapp', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-white text-sm focus:border-green-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1 block">Country *</label>
              <select
                value={form.country}
                onChange={e => updateForm('country', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-white text-sm focus:border-green-500 focus:outline-none"
              >
                <option value="">Select country...</option>
                {countries.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1 block">City</label>
              <input
                type="text"
                placeholder="e.g. Sfax, Marrakech, Algiers..."
                value={form.city}
                onChange={e => updateForm('city', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-white text-sm focus:border-green-500 focus:outline-none"
              />
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!form.businessName || !form.email || !form.country}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold rounded-lg disabled:opacity-50"
            >
              Next →
            </button>
          </div>
        )}

        {/* Step 2 — Products */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg">🛒 Your Products</h3>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                Product Categories * (select all that apply)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {productCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`p-2 rounded-lg text-xs text-left transition-all border ${
                      form.categories.includes(cat)
                        ? 'bg-green-500/20 border-green-500 text-white'
                        : 'bg-gray-800 border-gray-700 text-gray-400'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1 block">Business Description</label>
              <textarea
                placeholder="Tell us about your business, products, and experience..."
                value={form.description}
                onChange={e => updateForm('description', e.target.value)}
                rows={4}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-white text-sm focus:border-green-500 focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1 block">Monthly Export Volume</label>
              <select
                value={form.monthlyVolume}
                onChange={e => updateForm('monthlyVolume', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-white text-sm focus:border-green-500 focus:outline-none"
              >
                <option value="">Select volume...</option>
                <option>Under $1,000/month</option>
                <option>$1,000 - $5,000/month</option>
                <option>$5,000 - $20,000/month</option>
                <option>$20,000 - $100,000/month</option>
                <option>Over $100,000/month</option>
              </select>
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1 block">Website (optional)</label>
              <input
                type="url"
                placeholder="https://your-business.com"
                value={form.website}
                onChange={e => updateForm('website', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-white text-sm focus:border-green-500 focus:outline-none"
              />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)}
                className="flex-1 py-3 bg-gray-800 text-white font-bold rounded-lg">
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={form.categories.length === 0}
                className="flex-1 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold rounded-lg disabled:opacity-50"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Wallet & Submit */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg">⚡ Payment Setup</h3>

            <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-xl p-4">
              <div className="text-yellow-400 font-bold mb-2">💡 Why Stellar Wallet?</div>
              <div className="text-gray-400 text-sm">
                You will receive payments in ZENITH tokens directly to your Stellar wallet.
                No banks, no delays, instant settlement!
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1 block">
                Stellar Wallet Address *
              </label>
              <input
                type="text"
                placeholder="G... (56 characters)"
                value={form.walletAddress}
                onChange={e => updateForm('walletAddress', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-white text-sm font-mono focus:border-green-500 focus:outline-none"
              />
              <p className="text-gray-600 text-xs mt-1">
                Don't have one? Download Lobstr app and create free wallet
              </p>
            </div>

            {/* Summary */}
            <div className="bg-gray-800 rounded-xl p-4 space-y-2">
              <div className="text-white font-bold mb-3">📋 Application Summary</div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Business:</span>
                <span className="text-white">{form.businessName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Country:</span>
                <span className="text-white">{form.country}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Categories:</span>
                <span className="text-white">{form.categories.length} selected</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Volume:</span>
                <span className="text-white">{form.monthlyVolume || 'Not specified'}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)}
                className="flex-1 py-3 bg-gray-800 text-white font-bold rounded-lg">
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!form.walletAddress}
                className="flex-1 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold rounded-lg disabled:opacity-50"
              >
                🚀 Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
