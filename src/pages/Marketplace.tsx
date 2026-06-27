import { useState } from 'react';

const categories = [
  { id: 'all', label: 'All', emoji: '🌍' },
  { id: 'oils', label: 'Oils', emoji: '🫒' },
  { id: 'spices', label: 'Spices', emoji: '🌶️' },
  { id: 'dates', label: 'Dates', emoji: '🌴' },
  { id: 'textiles', label: 'Textiles', emoji: '🧵' },
  { id: 'leather', label: 'Leather', emoji: '👜' },
  { id: 'ceramics', label: 'Ceramics', emoji: '🏺' },
  { id: 'cosmetics', label: 'Cosmetics', emoji: '💄' },
  { id: 'honey', label: 'Honey', emoji: '🍯' },
  { id: 'seafood', label: 'Seafood', emoji: '🐟' },
  { id: 'grains', label: 'Grains', emoji: '🌾' },
  { id: 'herbs', label: 'Herbs', emoji: '🌿' },
  { id: 'crafts', label: 'Crafts', emoji: '🎨' },
  { id: 'marble', label: 'Marble', emoji: '🪨' },
  { id: 'electronics', label: 'Electronics', emoji: '📱' },
  { id: 'agriculture', label: 'Agriculture', emoji: '🚜' },
];

const products = [
  // 🫒 OILS
  { id: 1, name: 'Extra Virgin Olive Oil', nameAr: 'زيت زيتون بكر ممتاز', seller: 'Hamdi Farm', country: '🇹🇳 Tunisia', price: 50000, priceUSD: 9.5, unit: '5L bottle', stock: 500, rating: 4.9, image: '🫒', category: 'oils', route: 'Tunisia → EU/GCC' },
  { id: 2, name: 'Prickly Pear Seed Oil', nameAr: 'زيت بذور التين الشوكي', seller: 'Baya Natural', country: '🇲🇦 Morocco', price: 200000, priceUSD: 38, unit: '30ml', stock: 100, rating: 5.0, image: '🌵', category: 'oils', route: 'Morocco → France/Italy' },
  { id: 3, name: 'Argan Oil Premium', nameAr: 'زيت أركان فاخر', seller: 'Atlas Gold', country: '🇲🇦 Morocco', price: 180000, priceUSD: 34, unit: '100ml', stock: 200, rating: 4.9, image: '🌰', category: 'oils', route: 'Morocco → EU' },
  { id: 4, name: 'Black Seed Oil', nameAr: 'زيت الحبة السوداء', seller: 'Sahara Herbs', country: '🇩🇿 Algeria', price: 80000, priceUSD: 15, unit: '250ml', stock: 300, rating: 4.8, image: '🖤', category: 'oils', route: 'Algeria → Balkans/EU' },

  // 🌶️ SPICES
  { id: 5, name: 'Organic Harissa', nameAr: 'هريسة عضوية', seller: 'Carthage Foods', country: '🇹🇳 Tunisia', price: 15000, priceUSD: 2.85, unit: '200g jar', stock: 1000, rating: 4.8, image: '🌶️', category: 'spices', route: 'Tunisia → EU' },
  { id: 6, name: 'Ras el Hanout', nameAr: 'رأس الحانوت', seller: 'Marrakech Spices', country: '🇲🇦 Morocco', price: 20000, priceUSD: 3.8, unit: '100g', stock: 500, rating: 4.9, image: '🫙', category: 'spices', route: 'Morocco → Balkans' },
  { id: 7, name: 'Saffron Premium', nameAr: 'زعفران فاخر', seller: 'Atlas Saffron', country: '🇲🇦 Morocco', price: 500000, priceUSD: 95, unit: '1g', stock: 50, rating: 5.0, image: '🌸', category: 'spices', route: 'Morocco → EU/GCC' },
  { id: 8, name: 'Smoked Paprika', nameAr: 'فلفل مدخن', seller: 'Annaba Farms', country: '🇩🇿 Algeria', price: 12000, priceUSD: 2.3, unit: '150g', stock: 800, rating: 4.7, image: '🫑', category: 'spices', route: 'Algeria → Balkans' },

  // 🌴 DATES
  { id: 9, name: 'Deglet Nour Dates', nameAr: 'تمر دقلة نور', seller: 'Sahara Gold', country: '🇹🇳 Tunisia', price: 25000, priceUSD: 4.75, unit: '1kg box', stock: 2000, rating: 4.9, image: '🌴', category: 'dates', route: 'Tunisia → EU/Africa' },
  { id: 10, name: 'Medjool Dates Premium', nameAr: 'تمر مجهول فاخر', seller: 'Draa Valley', country: '🇲🇦 Morocco', price: 45000, priceUSD: 8.5, unit: '1kg', stock: 500, rating: 5.0, image: '🍯', category: 'dates', route: 'Morocco → EU/GCC' },
  { id: 11, name: 'Algerian Degla Baida', nameAr: 'دقلة البيضاء الجزائرية', seller: 'Biskra Dates', country: '🇩🇿 Algeria', price: 20000, priceUSD: 3.8, unit: '1kg', stock: 1000, rating: 4.8, image: '🤍', category: 'dates', route: 'Algeria → Balkans/EU' },

  // 🧵 TEXTILES
  { id: 12, name: 'Handwoven Berber Carpet', nameAr: 'سجادة أمازيغية يدوية', seller: 'Atlas Crafts', country: '🇲🇦 Morocco', price: 2000000, priceUSD: 380, unit: '2x3m', stock: 20, rating: 5.0, image: '🧵', category: 'textiles', route: 'Morocco → EU' },
  { id: 13, name: 'Fouta Tunisienne', nameAr: 'الفوطة التونسية', seller: 'Nabeul Textiles', country: '🇹🇳 Tunisia', price: 30000, priceUSD: 5.7, unit: 'piece', stock: 500, rating: 4.8, image: '🏖️', category: 'textiles', route: 'Tunisia → EU/Balkans' },
  { id: 14, name: 'Libyan Ghadames Leather', nameAr: 'جلد غدامس الليبي', seller: 'Ghadames Craft', country: '🇱🇾 Libya', price: 500000, priceUSD: 95, unit: 'piece', stock: 30, rating: 4.9, image: '🪡', category: 'textiles', route: 'Libya → EU' },

  // 👜 LEATHER
  { id: 15, name: 'Moroccan Babouche', nameAr: 'بلغة مغربية', seller: 'Fes Leather', country: '🇲🇦 Morocco', price: 80000, priceUSD: 15, unit: 'pair', stock: 200, rating: 4.9, image: '👟', category: 'leather', route: 'Morocco → EU/Balkans' },
  { id: 16, name: 'Tunis Leather Bag', nameAr: 'حقيبة جلدية تونسية', seller: 'Medina Leather', country: '🇹🇳 Tunisia', price: 300000, priceUSD: 57, unit: 'piece', stock: 50, rating: 4.8, image: '👜', category: 'leather', route: 'Tunisia → EU' },

  // 🏺 CERAMICS
  { id: 17, name: 'Nabeul Blue Pottery', nameAr: 'فخار نابل الأزرق', seller: 'Nabeul Artisans', country: '🇹🇳 Tunisia', price: 100000, priceUSD: 19, unit: 'set 6 pieces', stock: 100, rating: 4.9, image: '🏺', category: 'ceramics', route: 'Tunisia → EU' },
  { id: 18, name: 'Fes Zellige Tiles', nameAr: 'زليج فاسي', seller: 'Fes Ceramics', country: '🇲🇦 Morocco', price: 200000, priceUSD: 38, unit: 'm²', stock: 200, rating: 5.0, image: '🔷', category: 'ceramics', route: 'Morocco → Balkans/EU' },

  // 💄 COSMETICS
  { id: 19, name: 'Ghassoul Clay', nameAr: 'طين الغاسول', seller: 'Atlas Beauty', country: '🇲🇦 Morocco', price: 25000, priceUSD: 4.75, unit: '500g', stock: 400, rating: 4.8, image: '🪨', category: 'cosmetics', route: 'Morocco → EU' },
  { id: 20, name: 'Rose Water Premium', nameAr: 'ماء الورد الفاخر', seller: 'Kairouan Roses', country: '🇹🇳 Tunisia', price: 20000, priceUSD: 3.8, unit: '200ml', stock: 600, rating: 4.9, image: '🌹', category: 'cosmetics', route: 'Tunisia → EU/GCC' },

  // 🍯 HONEY
  { id: 21, name: 'Sidr Honey', nameAr: 'عسل السدر', seller: 'Jebel Honey', country: '🇹🇳 Tunisia', price: 150000, priceUSD: 28.5, unit: '500g', stock: 100, rating: 5.0, image: '🍯', category: 'honey', route: 'Tunisia → EU/GCC' },
  { id: 22, name: 'Thyme Honey', nameAr: 'عسل الزعتر', seller: 'Kabylie Honey', country: '🇩🇿 Algeria', price: 100000, priceUSD: 19, unit: '500g', stock: 200, rating: 4.9, image: '🐝', category: 'honey', route: 'Algeria → Balkans' },

  // 🐟 SEAFOOD
  { id: 23, name: 'Dried Octopus', nameAr: 'أخطبوط مجفف', seller: 'Sfax Fisheries', country: '🇹🇳 Tunisia', price: 200000, priceUSD: 38, unit: '1kg', stock: 50, rating: 4.8, image: '🐙', category: 'seafood', route: 'Tunisia → EU/Balkans' },
  { id: 24, name: 'Sardines in Olive Oil', nameAr: 'سردين في زيت الزيتون', seller: 'Bizerte Canning', country: '🇹🇳 Tunisia', price: 10000, priceUSD: 1.9, unit: '125g can', stock: 5000, rating: 4.7, image: '🐟', category: 'seafood', route: 'Tunisia → EU/Africa' },

  // 🌾 GRAINS
  { id: 25, name: 'Durum Wheat Semolina', nameAr: 'سميد القمح الصلب', seller: 'Setif Grains', country: '🇩🇿 Algeria', price: 5000, priceUSD: 0.95, unit: '1kg', stock: 10000, rating: 4.8, image: '🌾', category: 'grains', route: 'Algeria → Africa/EU' },
  { id: 26, name: 'Organic Couscous', nameAr: 'كسكس عضوي', seller: 'Berber Foods', country: '🇲🇦 Morocco', price: 15000, priceUSD: 2.85, unit: '1kg', stock: 2000, rating: 4.9, image: '🫘', category: 'grains', route: 'Morocco → EU/Balkans' },

  // 🌿 HERBS
  { id: 27, name: 'Dried Mint', nameAr: 'نعناع مجفف', seller: 'Meknes Herbs', country: '🇲🇦 Morocco', price: 8000, priceUSD: 1.5, unit: '100g', stock: 1000, rating: 4.8, image: '🌿', category: 'herbs', route: 'Morocco → EU' },
  { id: 28, name: 'Verbena Leaves', nameAr: 'أوراق الليمون', seller: 'Kabyle Herbs', country: '🇩🇿 Algeria', price: 10000, priceUSD: 1.9, unit: '100g', stock: 500, rating: 4.7, image: '🍃', category: 'herbs', route: 'Algeria → Balkans' },

  // 🎨 CRAFTS
  { id: 29, name: 'Hand-painted Tray', nameAr: 'صينية مطلية يدوياً', seller: 'Tunis Artisans', country: '🇹🇳 Tunisia', price: 120000, priceUSD: 22.8, unit: 'piece', stock: 80, rating: 4.9, image: '🎨', category: 'crafts', route: 'Tunisia → EU' },
  { id: 30, name: 'Berber Silver Jewelry', nameAr: 'مجوهرات أمازيغية فضية', seller: 'Tiznit Silver', country: '🇲🇦 Morocco', price: 400000, priceUSD: 76, unit: 'set', stock: 30, rating: 5.0, image: '💍', category: 'crafts', route: 'Morocco → EU/GCC' },

  // 🪨 MARBLE
  { id: 31, name: 'White Marble Tiles', nameAr: 'بلاط رخام أبيض', seller: 'Skikda Marble', country: '🇩🇿 Algeria', price: 300000, priceUSD: 57, unit: 'm²', stock: 500, rating: 4.8, image: '🪨', category: 'marble', route: 'Algeria → Balkans/EU' },

  // 🚜 AGRICULTURE
  { id: 32, name: 'Rose Water Distiller', nameAr: 'جهاز تقطير ماء الورد', seller: 'Tunis AgriTech', country: '🇹🇳 Tunisia', price: 5000000, priceUSD: 950, unit: 'unit', stock: 10, rating: 4.9, image: '🏭', category: 'agriculture', route: 'Tunisia → Africa' },
];

export default function Marketplace() {
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [showOrder, setShowOrder] = useState<any>(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [orderStatus, setOrderStatus] = useState('');
  const [sortBy, setSortBy] = useState('default');

  const filtered = products
    .filter(p =>
      (category === 'all' || p.category === category) &&
      (p.name.toLowerCase().includes(search.toLowerCase()) ||
       p.nameAr.includes(search) ||
       p.country.includes(search))
    )
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  async function handleOrder(product: any) {
    if (!walletAddress) {
      setOrderStatus('❌ Enter your Stellar wallet address');
      return;
    }
    setOrderStatus('⏳ Processing payment on Stellar...');
    try {
      const response = await fetch('/api/pay-zenith', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: walletAddress,
          amount: product.price.toString(),
          memo: product.name
        })
      });
      const data = await response.json();
      if (data.success) {
        setOrderStatus(`✅ Payment sent! TX: ${data.txHash?.slice(0,16)}... Seller will contact you within 24h.`);
      } else {
        setOrderStatus(`❌ Error: ${data.error}`);
      }
    } catch (err) {
      setOrderStatus('❌ Payment failed. Check your wallet balance.');
    }
  }

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-900 via-teal-900 to-blue-900 p-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-3xl">🌍</span>
          <div>
            <h2 className="text-white font-bold text-xl">ZENITH Marketplace</h2>
            <p className="text-green-300 text-xs">Maghreb · Africa · Balkans · Europe</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-3">
          <div className="bg-black/30 rounded-lg p-2 text-center">
            <div className="text-white font-bold">{products.length}+</div>
            <div className="text-gray-400 text-xs">Products</div>
          </div>
          <div className="bg-black/30 rounded-lg p-2 text-center">
            <div className="text-white font-bold">6</div>
            <div className="text-gray-400 text-xs">Countries</div>
          </div>
          <div className="bg-black/30 rounded-lg p-2 text-center">
            <div className="text-white font-bold">⚡</div>
            <div className="text-gray-400 text-xs">Pay ZENITH</div>
          </div>
        </div>
      </div>

      {/* Search + Sort */}
      <div className="px-4 flex gap-2">
        <input
          type="text"
          placeholder="🔍 Search products, countries..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-green-500 focus:outline-none"
        />
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-2 text-white text-xs focus:outline-none"
        >
          <option value="default">Sort</option>
          <option value="price-low">Price ↑</option>
          <option value="price-high">Price ↓</option>
          <option value="rating">Rating</option>
        </select>
      </div>

      {/* Categories */}
      <div className="flex gap-2 px-4 overflow-x-auto pb-1 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              category === cat.id
                ? 'bg-green-500 text-white'
                : 'bg-gray-800 text-gray-400 border border-gray-700'
            }`}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div className="px-4 text-gray-500 text-xs">
        {filtered.length} products found
      </div>

      {/* Products Grid */}
      <div className="px-4 grid grid-cols-1 gap-3">
        {filtered.map(product => (
          <div key={product.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-green-500/30 transition-all">
            <div className="flex items-start gap-3">
              <div className="text-4xl w-12 text-center">{product.image}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-white font-bold text-sm leading-tight">{product.name}</h3>
                  <span className="text-yellow-400 text-xs flex-shrink-0">★{product.rating}</span>
                </div>
                <p className="text-gray-500 text-xs">{product.nameAr}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-xs">{product.country}</span>
                  <span className="text-gray-600 text-xs">·</span>
                  <span className="text-gray-500 text-xs">🏪 {product.seller}</span>
                </div>
                <div className="text-green-400 text-xs mt-1">🚚 {product.route}</div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-800">
              <div>
                <div className="text-cyan-400 font-bold text-sm">
                  ⚡ {product.price.toLocaleString()} ZENITH
                </div>
                <div className="text-gray-500 text-xs">≈ ${product.priceUSD} · {product.unit}</div>
              </div>
              <button
                onClick={() => { setShowOrder(product); setOrderStatus(''); }}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold rounded-lg text-xs hover:opacity-90"
              >
                Buy ⚡
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Seller CTA */}
      <div className="mx-4 bg-gradient-to-r from-yellow-900/40 to-orange-900/40 border border-yellow-600/30 rounded-xl p-4">
        <h3 className="text-yellow-400 font-bold mb-1">🌾 Sell Your Products</h3>
        <p className="text-gray-400 text-xs mb-3">
          Tunisia · Morocco · Algeria · Libya · Africa · Balkans
          Receive instant ZENITH payments. No banks. No delays.
        </p>
        <button className="w-full py-2 bg-yellow-500 text-black font-bold rounded-lg text-sm">
          📋 Apply to Sell — Coming Soon
        </button>
      </div>

      {/* Order Modal */}
      {showOrder && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end">
          <div className="bg-gray-900 border-t border-gray-700 rounded-t-2xl p-5 w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold">{showOrder.image} Place Order</h3>
              <button onClick={() => setShowOrder(null)} className="text-gray-500 text-xl">✕</button>
            </div>

            <div className="bg-gray-800 rounded-lg p-3 mb-4 space-y-1">
              <div className="text-white font-bold">{showOrder.name}</div>
              <div className="text-gray-400 text-xs">{showOrder.country} · {showOrder.seller}</div>
              <div className="text-cyan-400 font-bold">⚡ {showOrder.price.toLocaleString()} ZENITH</div>
              <div className="text-gray-500 text-xs">≈ ${showOrder.priceUSD} per {showOrder.unit}</div>
              <div className="text-green-400 text-xs">🚚 {showOrder.route}</div>
            </div>

            <div className="mb-4">
              <label className="text-gray-400 text-sm mb-2 block">Your Stellar Address</label>
              <input
                type="text"
                placeholder="G..."
                value={walletAddress}
                onChange={e => setWalletAddress(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-green-500 focus:outline-none"
              />
            </div>

            {orderStatus && (
              <div className="bg-gray-800 rounded-lg p-3 mb-4 text-sm text-gray-300">{orderStatus}</div>
            )}

            <button
              onClick={() => handleOrder(showOrder)}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold rounded-lg mb-3"
            >
              ⚡ Confirm Order with ZENITH
            </button>

            <button
              onClick={() => {
                if (window.Pi) {
                  const payment = window.Pi.createPayment({
                    amount: (showOrder.priceUSD || 1),
                    memo: `ZENITH Order: ${showOrder.name}`,
                    metadata: { orderId: showOrder.id, product: showOrder.name }
                  }, {
                    onReadyForServerApproval: (paymentId) => {
                      setOrderStatus('✅ Pi Payment initiated: ' + paymentId);
                    },
                    onReadyForServerCompletion: (paymentId, txid) => {
                      setOrderStatus('🎉 Pi Payment complete! TX: ' + txid);
                    },
                    onCancel: (paymentId) => {
                      setOrderStatus('❌ Payment cancelled');
                    },
                    onError: (error) => {
                      setOrderStatus('❌ Error: ' + error.message);
                    }
                  });
                } else {
                  setOrderStatus('⚠️ Please open in Pi Browser to pay with Pi');
                }
              }}
              className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-lg"
            >
              π Pay with Pi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
