export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-950 text-white pb-32">

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-purple-500/10" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />
        <div className="relative text-center px-6 pt-16 pb-12">
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-yellow-400 text-sm font-medium">Live on Stellar Mainnet</span>
          </div>
          <div className="text-7xl mb-4">⚡</div>
          <h1 className="text-5xl font-black mb-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
              ZENITH
            </span>
          </h1>
          <p className="text-xl text-gray-300 font-medium mb-2">Africa's Financial Gateway</p>
          <p className="text-gray-500 text-sm max-w-xs mx-auto mb-8 leading-relaxed">
            أول token على Stellar يربط صادرات أفريقيا بأسواق أوروبا والخليج عبر blockchain فوري
          </p>
          <div className="flex flex-col gap-3 max-w-xs mx-auto">
            <a href="https://stellar.expert/explorer/public/asset/ZENITH-GA3T3OZ5V2JAZR5RCH3NII7JBNUMDPBSSXF6N6HKZGLTM5JSZCX7OTFQ"
              target="_blank" rel="noreferrer"
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-6 py-3 rounded-xl font-bold text-sm">
              🔍 عرض على StellarExpert
            </a>
            <a href="https://github.com/marwahamdi301-png/Zenith-Empire-Platform"
              target="_blank" rel="noreferrer"
              className="border border-gray-700 text-gray-300 px-6 py-3 rounded-xl font-bold text-sm hover:border-yellow-500/50 transition-colors">
              📄 GitHub — Open Source
            </a>
          </div>
        </div>
      </section>

      {/* Live Stats */}
      <section className="px-4 py-6">
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Total Supply", value: "1,000,000,000", sub: "ZENITH — Fixed", icon: "🪙" },
            { label: "Settlement", value: "3 ثوانٍ", sub: "Stellar Network", icon: "⚡" },
            { label: "Token Holders", value: "6+", sub: "On Stellar Mainnet", icon: "👥" },
            { label: "Markets", value: "54", sub: "African Countries", icon: "🌍" },
          ].map(s => (
            <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="text-yellow-400 text-lg font-black">{s.value}</div>
              <div className="text-white text-xs font-medium">{s.label}</div>
              <div className="text-gray-500 text-xs">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-6">
        <h2 className="text-xl font-black text-center mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
            ما يقدمه ZENITH
          </span>
        </h2>
        <div className="space-y-3">
          {[
            { icon: "🫒", title: "تسوية الصادرات", desc: "زيت زيتون تونسي، تمور، زعفران — تسوية فورية بـ ZENITH", color: "from-green-500/20 to-emerald-500/20", border: "border-green-500/20" },
            { icon: "π", title: "Pi Network Bridge", desc: "حوّل Pi إلى ZENITH وادخل أسواق التداول الحقيقية عبر Pi Sign-in 2026", color: "from-purple-500/20 to-pink-500/20", border: "border-purple-500/20" },
            { icon: "🛡️", title: "PiVerify KYC", desc: "تحقق من هويتك كـ Pioneer موثّق للوصول للميزات المتقدمة", color: "from-blue-500/20 to-cyan-500/20", border: "border-blue-500/20" },
            { icon: "💎", title: "Staking حتى 100%", desc: "استثمر ZENITH واكسب حتى 100% APY على مدى 365 يوم", color: "from-yellow-500/20 to-orange-500/20", border: "border-yellow-500/20" },
            { icon: "🛒", title: "Marketplace أفريقي", desc: "32+ منتج من 6 دول — زيوت، بهارات، تمور، سجاد بربري", color: "from-red-500/20 to-orange-500/20", border: "border-red-500/20" },
          ].map(f => (
            <div key={f.title} className={`bg-gradient-to-r ${f.color} border ${f.border} rounded-2xl p-4 flex gap-4 items-start`}>
              <span className="text-3xl shrink-0">{f.icon}</span>
              <div>
                <p className="text-white font-bold text-sm">{f.title}</p>
                <p className="text-gray-400 text-xs mt-1 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Roadmap */}
      <section className="px-4 py-6">
        <h2 className="text-xl font-black text-center mb-4 text-white">Roadmap 🗺️</h2>
        <div className="space-y-3">
          {[
            { q: "Q2 2026", title: "Token Launch", done: true,
              items: ["✅ ZENITH on Stellar Mainnet", "✅ DEX Trading Live", "✅ Pi Sign-in 2026", "✅ PiVerify KYC"] },
            { q: "Q3 2026", title: "Export Marketplace", done: false,
              items: ["🔄 Olive Oil Export Portal", "🔄 Smart Invoicing", "🔄 GCC Partners"] },
            { q: "Q4 2026", title: "Exchange Listings", done: false,
              items: ["⏳ LOBSTR Official Listing", "⏳ CoinGecko Listing", "⏳ StellarX Integration"] },
            { q: "Q1 2027", title: "Mobile App", done: false,
              items: ["⏳ iOS & Android App", "⏳ M-Pesa Integration", "⏳ African Mobile Money"] },
          ].map(phase => (
            <div key={phase.q} className={`rounded-2xl p-4 border ${
              phase.done
                ? 'border-yellow-500/40 bg-yellow-500/10'
                : 'border-gray-800 bg-gray-900'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  phase.done ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-800 text-gray-400'
                }`}>{phase.q}</span>
                <span className="text-white font-bold text-sm">{phase.title}</span>
                {phase.done && <span className="text-green-400 text-xs ml-auto">✅ مكتمل</span>}
              </div>
              <ul className="space-y-1">
                {phase.items.map(item => (
                  <li key={item} className="text-gray-400 text-xs">{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Trust */}
      <section className="px-4 py-6">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-5 text-center">
          <p className="text-2xl mb-2">🔐</p>
          <p className="text-white font-bold mb-1">100% Transparent</p>
          <p className="text-gray-400 text-xs mb-4">كل معاملة قابلة للتحقق على Stellar blockchain</p>
          <div className="flex justify-center gap-6 text-xs text-gray-400">
            <span>✅ Open Source</span>
            <span>✅ On-Chain</span>
            <span>✅ No Admin Keys</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center px-4 py-6 border-t border-gray-800">
        <p className="text-yellow-400 font-bold">⚡ ZENITH Empire</p>
        <p className="text-gray-600 text-xs mt-1">© 2026 · Stellar Mainnet · Pi Network · Africa 🌍</p>
      </footer>

    </div>
  );
}
