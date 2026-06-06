export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Hero */}
      <section className="text-center py-20 px-6">
        <div className="text-6xl mb-4">⚡</div>
        <h1 className="text-5xl font-bold text-yellow-400 mb-4">
          ZENITH
        </h1>
        <p className="text-2xl text-gray-300 mb-2">
          Africa's Financial Gateway
        </p>
        <p className="text-gray-400 max-w-2xl mx-auto mb-8">
          The first Stellar-based token bridging African premium exports
          to European and GCC markets via instant blockchain settlement
        </p>
        <div className="flex gap-4 justify-center">
          <a href="https://stellar.expert/explorer/public/asset/ZENITH-GA3T3OZ5V2JAZR5RCH3NII7JBNUMDPBSSXF6N6HKZGLTM5JSZCX7OTFQ"
            className="bg-yellow-500 text-black px-8 py-3 rounded-xl font-bold">
            View on StellarExpert
          </a>
          <a href="#whitepaper"
            className="border border-yellow-500 text-yellow-400 px-8 py-3 rounded-xl font-bold">
            Read Whitepaper
          </a>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6 py-12 max-w-4xl mx-auto">
        {[
          { label: "Total Supply", value: "1B ZENITH" },
          { label: "Price", value: "$0.0002" },
          { label: "Network", value: "Stellar" },
          { label: "Settlement", value: "3 Seconds" }
        ].map(stat => (
          <div key={stat.label} className="bg-gray-800 rounded-xl p-4 text-center">
            <div className="text-yellow-400 text-2xl font-bold">{stat.value}</div>
            <div className="text-gray-400 text-sm">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Use Cases */}
      <section className="py-12 px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-yellow-400">
          Real World Utility
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: "🫒",
              title: "Export Settlement",
              desc: "Tunisian Olive Oil & Prickly Pear exports settled instantly in ZENITH"
            },
            {
              icon: "π",
              title: "Pi Network Bridge",
              desc: "Convert Pi to ZENITH and access real trading markets"
            },
            {
              icon: "🌍",
              title: "African Finance",
              desc: "Cross-border payments for Africa at near-zero cost"
            }
          ].map(item => (
            <div key={item.title} className="bg-gray-800 rounded-xl p-6 text-center">
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className="text-yellow-400 font-bold text-xl mb-2">{item.title}</h3>
              <p className="text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-12 px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-yellow-400">
          Roadmap
        </h2>
        <div className="space-y-4">
          {[
            { q: "Q2 2026", title: "Token Launch", done: true,
              items: ["ZENITH on Stellar Mainnet", "DEX Trading Live", "Pi Network Integration"] },
            { q: "Q3 2026", title: "Export Marketplace", done: false,
              items: ["Olive Oil Export Portal", "Smart Invoicing", "GCC Partners"] },
            { q: "Q4 2026", title: "Exchange Listings", done: false,
              items: ["LOBSTR Official Listing", "StellarX Integration", "CoinGecko Listing"] },
            { q: "Q1 2027", title: "Mobile App", done: false,
              items: ["iOS & Android App", "African Mobile Money", "M-Pesa Integration"] }
          ].map(phase => (
            <div key={phase.q}
              className={`rounded-xl p-6 border ${phase.done ? 'border-yellow-500 bg-yellow-500/10' : 'border-gray-700 bg-gray-800'}`}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-yellow-400 font-bold">{phase.q}</span>
                <span className="text-white font-bold">{phase.title}</span>
                {phase.done && <span className="text-green-400">✅</span>}
              </div>
              <ul className="text-gray-400 space-y-1">
                {phase.items.map(item => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-500 border-t border-gray-800">
        <p>© 2026 Baya-Empire-Digital | ZENITH Token</p>
        <p className="text-sm mt-2">
          Stellar Mainnet • Pi Network • African Markets
        </p>
      </footer>
    </div>
  );
}
