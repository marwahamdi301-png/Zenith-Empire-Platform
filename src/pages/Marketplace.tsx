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
  { id: 'agriculture', label: 'Agriculture', emoji: '🚜' },  { id: 33, name: 'Dried Raisins', nameAr: 'زبيب (عنب مجفف)', seller: 'Baya Farms', country: '🇹🇳 Tunisia', priceUSD: 5.5, unit: '1kg', minOrder: '20 units', stock: 100, rating: 5.0, image: '🍇', category: 'dates', route: 'Tunisia → EU/GCC', isDemo: false },  { id: 34, name: 'Rosemary Essential Oil', nameAr: 'زيت إكليل الجبل', seller: 'Baya Farms', country: '🇹🇳 Tunisia', priceUSD: 18, unit: '100ml', minOrder: '20 units', stock: 80, rating: 5.0, image: '🌿', category: 'oils', route: 'Tunisia → EU/GCC', isDemo: false },
  { id: 35, name: 'Carob Powder', nameAr: 'مسحوق الخروب', seller: 'Baya Farms', country: '🇹🇳 Tunisia', priceUSD: 4.5, unit: '1kg', minOrder: '30 units', stock: 100, rating: 5.0, image: '🍫', category: 'spices', route: 'Tunisia → EU/GCC', isDemo: false },
  { id: 36, name: 'Carob Seeds (Gum)', nameAr: 'لب الخروب', seller: 'Baya Farms', country: '🇹🇳 Tunisia', priceUSD: 9, unit: '1kg', minOrder: '20 units', stock: 60, rating: 5.0, image: '🌰', category: 'spices', route: 'Tunisia → EU/GCC', isDemo: false },
  { id: 37, name: 'Natural Fruit Juice', nameAr: 'عصير فواكه طبيعي', seller: 'Baya Farms', country: '🇹🇳 Tunisia', priceUSD: 3.5, unit: '1L bottle', minOrder: '50 units', stock: 150, rating: 5.0, image: '🧃', category: 'honey', route: 'Tunisia → EU/GCC', isDemo: false },
];

const products = [
  { id: 1, name: 'Extra Virgin Olive Oil', nameAr: 'زيت زيتون بكر ممتاز - سليانة', seller: 'Baya Farms', country: '🇹🇳 Tunisia', priceUSD: 32, unit: '5L bottle', minOrder: '10 units', stock: 60, rating: 5.0, image: '🫒', category: 'oils', route: 'Tunisia → EU/GCC', isDemo: false },
  { id: 2, name: 'Prickly Pear Seed Oil', nameAr: 'زيت بذور التين الشوكي', seller: 'Baya Natural', country: '🇲🇦 Morocco', priceUSD: 38, unit: '30ml', minOrder: '50 units', stock: 100, rating: 5.0, image: '🌵', category: 'oils', route: 'Morocco → France/Italy' },
  { id: 3, name: 'Argan Oil Premium', nameAr: 'زيت أركان فاخر', seller: 'Atlas Gold', country: '🇲🇦 Morocco', priceUSD: 34, unit: '100ml', minOrder: '50 units', stock: 200, rating: 4.9, image: '🌰', category: 'oils', route: 'Morocco → EU' },
  { id: 4, name: 'Black Seed Oil', nameAr: 'زيت الحبة السوداء', seller: 'Sahara Herbs', country: '🇩🇿 Algeria', priceUSD: 15, unit: '250ml', minOrder: '30 units', stock: 300, rating: 4.8, image: '🖤', category: 'oils', route: 'Algeria → Balkans/EU' },
  { id: 5, name: 'Organic Harissa', nameAr: 'هريسة عضوية', seller: 'Carthage Foods', country: '🇹🇳 Tunisia', priceUSD: 2.85, unit: '200g jar', minOrder: '100 units', stock: 1000, rating: 4.8, image: '🌶️', category: 'spices', route: 'Tunisia → EU' },
  { id: 6, name: 'Ras el Hanout', nameAr: 'رأس الحانوت', seller: 'Marrakech Spices', country: '🇲🇦 Morocco', priceUSD: 3.8, unit: '100g', minOrder: '100 units', stock: 500, rating: 4.9, image: '🫙', category: 'spices', route: 'Morocco → Balkans' },
  { id: 7, name: 'Saffron Premium', nameAr: 'زعفران فاخر', seller: 'Atlas Saffron', country: '🇲🇦 Morocco', priceUSD: 14, unit: '1g', minOrder: '10 units', stock: 50, rating: 5.0, image: '🌸', category: 'spices', route: 'Morocco → EU/GCC' },
  { id: 8, name: 'Smoked Paprika', nameAr: 'فلفل مدخن', seller: 'Annaba Farms', country: '🇩🇿 Algeria', priceUSD: 2.3, unit: '150g', minOrder: '100 units', stock: 800, rating: 4.7, image: '🫑', category: 'spices', route: 'Algeria → Balkans' },
  { id: 9, name: 'Deglet Nour Dates', nameAr: 'تمر دقلة نور', seller: 'Baya Farms', country: '🇹🇳 Tunisia', priceUSD: 4.75, unit: '1kg box', minOrder: '20 units', stock: 200, rating: 5.0, image: '🌴', category: 'dates', route: 'Tunisia → EU/Africa', isDemo: false },
  { id: 10, name: 'Medjool Dates Premium', nameAr: 'تمر مجهول فاخر', seller: 'Draa Valley', country: '🇲🇦 Morocco', priceUSD: 8.5, unit: '1kg', minOrder: '30 units', stock: 500, rating: 5.0, image: '🍯', category: 'dates', route: 'Morocco → EU/GCC' },
  { id: 11, name: 'Algerian Degla Baida', nameAr: 'دقلة البيضاء الجزائرية', seller: 'Biskra Dates', country: '🇩🇿 Algeria', priceUSD: 3.8, unit: '1kg', minOrder: '50 units', stock: 1000, rating: 4.8, image: '🤍', category: 'dates', route: 'Algeria → Balkans/EU' },
  { id: 12, name: 'Handwoven Berber Carpet', nameAr: 'سجادة أمازيغية يدوية', seller: 'Atlas Crafts', country: '🇲🇦 Morocco', priceUSD: 380, unit: '2x3m', minOrder: '5 units', stock: 20, rating: 5.0, image: '🧵', category: 'textiles', route: 'Morocco → EU' },
  { id: 13, name: 'Fouta Tunisienne', nameAr: 'الفوطة التونسية', seller: 'Nabeul Textiles', country: '🇹🇳 Tunisia', priceUSD: 5.7, unit: 'piece', minOrder: '100 units', stock: 500, rating: 4.8, image: '🏖️', category: 'textiles', route: 'Tunisia → EU/Balkans' },
  { id: 14, name: 'Libyan Ghadames Leather', nameAr: 'جلد غدامس الليبي', seller: 'Ghadames Craft', country: '🇱🇾 Libya', priceUSD: 95, unit: 'piece', minOrder: '10 units', stock: 30, rating: 4.9, image: '🪡', category: 'textiles', route: 'Libya → EU' },
  { id: 15, name: 'Moroccan Babouche', nameAr: 'بلغة مغربية', seller: 'Fes Leather', country: '🇲🇦 Morocco', priceUSD: 15, unit: 'pair', minOrder: '50 units', stock: 200, rating: 4.9, image: '👟', category: 'leather', route: 'Morocco → EU/Balkans' },
  { id: 16, name: 'Tunis Leather Bag', nameAr: 'حقيبة جلدية تونسية', seller: 'Medina Leather', country: '🇹🇳 Tunisia', priceUSD: 57, unit: 'piece', minOrder: '20 units', stock: 50, rating: 4.8, image: '👜', category: 'leather', route: 'Tunisia → EU' },
  { id: 17, name: 'Nabeul Blue Pottery', nameAr: 'فخار نابل الأزرق', seller: 'Nabeul Artisans', country: '🇹🇳 Tunisia', priceUSD: 19, unit: 'set 6 pieces', minOrder: '20 units', stock: 100, rating: 4.9, image: '🏺', category: 'ceramics', route: 'Tunisia → EU' },
  { id: 18, name: 'Fes Zellige Tiles', nameAr: 'زليج فاسي', seller: 'Fes Ceramics', country: '🇲🇦 Morocco', priceUSD: 38, unit: 'm²', minOrder: '20 units', stock: 200, rating: 5.0, image: '🔷', category: 'ceramics', route: 'Morocco → Balkans/EU' },
  { id: 19, name: 'Ghassoul Clay', nameAr: 'طين الغاسول', seller: 'Atlas Beauty', country: '🇲🇦 Morocco', priceUSD: 4.75, unit: '500g', minOrder: '100 units', stock: 400, rating: 4.8, image: '🪨', category: 'cosmetics', route: 'Morocco → EU' },
  { id: 20, name: 'Rose Water Premium', nameAr: 'ماء الورد الفاخر', seller: 'Kairouan Roses', country: '🇹🇳 Tunisia', priceUSD: 3.8, unit: '200ml', minOrder: '100 units', stock: 600, rating: 4.9, image: '🌹', category: 'cosmetics', route: 'Tunisia → EU/GCC' },
  { id: 21, name: 'Sidr Honey', nameAr: 'عسل السدر', seller: 'Jebel Honey', country: '🇹🇳 Tunisia', priceUSD: 28.5, unit: '500g', minOrder: '30 units', stock: 100, rating: 5.0, image: '🍯', category: 'honey', route: 'Tunisia → EU/GCC' },
  { id: 22, name: 'Thyme Honey', nameAr: 'عسل الزعتر', seller: 'Kabylie Honey', country: '🇩🇿 Algeria', priceUSD: 19, unit: '500g', minOrder: '30 units', stock: 200, rating: 4.9, image: '🐝', category: 'honey', route: 'Algeria → Balkans' },
  { id: 23, name: 'Dried Octopus', nameAr: 'أخطبوط مجفف', seller: 'Sfax Fisheries', country: '🇹🇳 Tunisia', priceUSD: 38, unit: '1kg', minOrder: '20 units', stock: 50, rating: 4.8, image: '🐙', category: 'seafood', route: 'Tunisia → EU/Balkans' },
  { id: 24, name: 'Sardines in Olive Oil', nameAr: 'سردين في زيت الزيتون', seller: 'Bizerte Canning', country: '🇹🇳 Tunisia', priceUSD: 1.9, unit: '125g can', minOrder: '500 units', stock: 5000, rating: 4.7, image: '🐟', category: 'seafood', route: 'Tunisia → EU/Africa' },
  { id: 25, name: 'Durum Wheat Semolina', nameAr: 'سميد القمح الصلب', seller: 'Setif Grains', country: '🇩🇿 Algeria', priceUSD: 0.95, unit: '1kg', minOrder: '1000 units', stock: 10000, rating: 4.8, image: '🌾', category: 'grains', route: 'Algeria → Africa/EU' },
  { id: 26, name: 'Organic Couscous', nameAr: 'كسكس عضوي', seller: 'Berber Foods', country: '🇲🇦 Morocco', priceUSD: 2.85, unit: '1kg', minOrder: '200 units', stock: 2000, rating: 4.9, image: '🫘', category: 'grains', route: 'Morocco → EU/Balkans' },
  { id: 27, name: 'Dried Mint', nameAr: 'نعناع مجفف', seller: 'Meknes Herbs', country: '🇲🇦 Morocco', priceUSD: 1.5, unit: '100g', minOrder: '100 units', stock: 1000, rating: 4.8, image: '🌿', category: 'herbs', route: 'Morocco → EU' },
  { id: 28, name: 'Verbena Leaves', nameAr: 'أوراق الليمون', seller: 'Kabyle Herbs', country: '🇩🇿 Algeria', priceUSD: 1.9, unit: '100g', minOrder: '100 units', stock: 500, rating: 4.7, image: '🍃', category: 'herbs', route: 'Algeria → Balkans' },
  { id: 29, name: 'Hand-painted Tray', nameAr: 'صينية مطلية يدوياً', seller: 'Tunis Artisans', country: '🇹🇳 Tunisia', priceUSD: 22.8, unit: 'piece', minOrder: '20 units', stock: 80, rating: 4.9, image: '🎨', category: 'crafts', route: 'Tunisia → EU' },
  { id: 30, name: 'Berber Silver Jewelry', nameAr: 'مجوهرات أمازيغية فضية', seller: 'Tiznit Silver', country: '🇲🇦 Morocco', priceUSD: 76, unit: 'set', minOrder: '10 units', stock: 30, rating: 5.0, image: '💍', category: 'crafts', route: 'Morocco → EU/GCC' },
  { id: 31, name: 'White Marble Tiles', nameAr: 'بلاط رخام أبيض', seller: 'Skikda Marble', country: '🇩🇿 Algeria', priceUSD: 57, unit: 'm²', minOrder: '50 units', stock: 500, rating: 4.8, image: '🪨', category: 'marble', route: 'Algeria → Balkans/EU' },
  { id: 32, name: 'Rose Water Distiller', nameAr: 'جهاز تقطير ماء الورد', seller: 'Tunis AgriTech', country: '🇹🇳 Tunisia', priceUSD: 950, unit: 'unit', minOrder: '1 unit', stock: 10, rating: 4.9, image: '🏭', category: 'agriculture', route: 'Tunisia → Africa' },
];

export default function Marketplace() {
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [showOrder, setShowOrder] = useState<any>(null);
  const [quantity, setQuantity] = useState('');
  const [shippingCountry, setShippingCountry] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [orderMode, setOrderMode] = useState<'quote' | 'sample'>('quote');
  const [interestProduct, setInterestProduct] = useState<any>(null);
  const [interestContact, setInterestContact] = useState('');
  const [interestStatus, setInterestStatus] = useState('');
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
      if (sortBy === 'price-low') return a.priceUSD - b.priceUSD;
      if (sortBy === 'price-high') return b.priceUSD - a.priceUSD;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  async function handleQuoteRequest(product: any) {
    if (orderMode === 'quote' && (!quantity || !shippingCountry || !contact)) {
      setOrderStatus('❌ الرجاء ملء كل الحقول');
      return;
    }
    if (orderMode === 'sample' && (!address || !shippingCountry || !contact)) {
      setOrderStatus('❌ الرجاء ملء كل الحقول');
      return;
    }
    setOrderStatus('⏳ جاري إرسال طلبك...');
    try {
      const response = await fetch('/api/request-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: product.name,
          seller: product.seller,
          quantity,
          shippingCountry,
          contact,
          requestType: orderMode,
          address,
        })
      });
      const data = await response.json();
      if (data.success) {
        setOrderStatus('✅ تم إرسال طلبك! سنتواصل معك خلال 24-48 ساعة.');
      } else {
        setOrderStatus(`❌ خطأ: ${data.error}`);
      }
    } catch (err) {
      setOrderStatus('❌ فشل الإرسال. حاول مرة أخرى.');
    }
  }

  async function handleInterest() {
    if (!interestContact) {
      setInterestStatus('❌ الرجاء إدخال وسيلة تواصل');
      return;
    }
    setInterestStatus('⏳ جاري الإرسال...');
    try {
      const response = await fetch('/api/request-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: interestProduct.name,
          contact: interestContact,
          requestType: 'interest',
        })
      });
      const data = await response.json();
      if (data.success) {
        setInterestStatus('✅ تم التسجيل! سنعلمك فور توفر مورّد حقيقي لهذا المنتج.');
      } else {
        setInterestStatus(`❌ خطأ: ${data.error}`);
      }
    } catch (err) {
      setInterestStatus('❌ فشل الإرسال. حاول مرة أخرى.');
    }
  }

  return (
    <div className="space-y-4 pb-20">
      <div className="bg-gradient-to-r from-green-900 via-teal-900 to-blue-900 p-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-3xl">🌍</span>
          <div>
            <h2 className="text-white font-bold text-xl">Zenith Trade Hub — السوق</h2>
            <p className="text-green-300 text-xs">تونس · المغرب · الجزائر → أوروبا · الخليج</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-3">
          <div className="bg-black/30 rounded-lg p-2 text-center">
            <div className="text-white font-bold">{products.length}+</div>
            <div className="text-gray-400 text-xs">منتج</div>
          </div>
          <div className="bg-black/30 rounded-lg p-2 text-center">
            <div className="text-white font-bold">3</div>
            <div className="text-gray-400 text-xs">دول</div>
          </div>
          <div className="bg-black/30 rounded-lg p-2 text-center">
            <div className="text-white font-bold">📋</div>
            <div className="text-gray-400 text-xs">اطلب عرض سعر</div>
          </div>
        </div>
      </div>

      <div className="mx-4 bg-orange-900/30 border border-orange-500/40 rounded-xl p-3">
        <p className="text-orange-300 text-xs font-bold">🚧 المنصة في مرحلة تجميع الموردين</p>
        <p className="text-orange-200/80 text-xs mt-1">المنتجات أدناه أمثلة توضيحية لأنواع المنتجات المستهدفة. سجل كمورّد لتكون أول عرض حقيقي على المنصة.</p>
      </div>

      <div className="px-4 flex gap-2">
        <input
          type="text"
          placeholder="🔍 ابحث عن منتج أو دولة..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-green-500 focus:outline-none"
        />
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-2 text-white text-xs focus:outline-none"
        >
          <option value="default">ترتيب</option>
          <option value="price-low">السعر ↑</option>
          <option value="price-high">السعر ↓</option>
          <option value="rating">التقييم</option>
        </select>
      </div>

      <div className="flex gap-2 px-4 overflow-x-auto pb-1 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              category === cat.id ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-400 border border-gray-700'
            }`}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      <div className="px-4 text-gray-500 text-xs">{filtered.length} منتج</div>

      <div className="px-4 grid grid-cols-1 gap-3">
        {filtered.map(product => (
          <div key={product.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-green-500/30 transition-all">
            <div className="flex items-start gap-3">
              <div className="text-4xl w-12 text-center">{product.image}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-white font-bold text-sm leading-tight">{product.name}</h3>
                  {product.isDemo === false ? (
                    <span className="text-green-400 text-[10px] flex-shrink-0 bg-green-900/40 px-1.5 py-0.5 rounded">✅ مورّد حقيقي</span>
                  ) : (
                    <span className="text-orange-400 text-[10px] flex-shrink-0 bg-orange-900/40 px-1.5 py-0.5 rounded">🔸 مثال توضيحي</span>
                  )}
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
                <div className="text-cyan-400 font-bold text-sm">${product.priceUSD} / {product.unit}</div>
                <div className="text-gray-500 text-xs">الحد الأدنى: {product.minOrder}</div>
              </div>
              {product.isDemo === false ? (
                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={() => { setShowOrder(product); setOrderMode('quote'); setOrderStatus(''); setQuantity(''); setShippingCountry(''); setContact(''); setAddress(''); }}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold rounded-lg text-xs hover:opacity-90"
                  >
                    📋 اطلب عرض سعر
                  </button>
                  <button
                    onClick={() => { setShowOrder(product); setOrderMode('sample'); setOrderStatus(''); setQuantity(''); setShippingCountry(''); setContact(''); setAddress(''); }}
                    className="px-4 py-2 bg-gray-800 border border-orange-500/40 text-orange-400 font-bold rounded-lg text-xs hover:bg-gray-700"
                  >
                    🎁 اطلب عينة
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setInterestProduct(product); setInterestContact(''); setInterestStatus(''); }}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold rounded-lg text-xs hover:opacity-90"
                >
                  🔔 أعلمني لما يتوفر
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mx-4 bg-gradient-to-r from-yellow-900/40 to-orange-900/40 border border-yellow-600/30 rounded-xl p-4">
        <h3 className="text-yellow-400 font-bold mb-1">🌾 عندك منتج تحب تبيعه؟</h3>
        <p className="text-gray-400 text-xs mb-3">
          تونس · المغرب · الجزائر · ليبيا — سجل كمورّد وابدأ الوصول لمشترين حقيقيين.
        </p>
        <a href="https://t.me/Baya_tradingbot" target="_blank" rel="noreferrer" className="block w-full text-center py-2 bg-yellow-500 text-black font-bold rounded-lg text-sm">
          📋 سجل كمورّد عبر البوت
        </a>
      </div>

      {showOrder && (
        <div className="fixed inset-0 bg-black/80 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="bg-gray-900 border-t border-gray-700 rounded-2xl p-5 w-full max-w-md max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold">{showOrder.image} {orderMode === 'sample' ? 'اطلب عينة' : 'اطلب عرض سعر'}</h3>
              <button onClick={() => setShowOrder(null)} className="text-gray-500 text-xl">✕</button>
            </div>

            <div className="bg-gray-800 rounded-lg p-3 mb-4 space-y-1">
              <div className="text-white font-bold">{showOrder.name}</div>
              <div className="text-gray-400 text-xs">{showOrder.country} · {showOrder.seller}</div>
              <div className="text-cyan-400 font-bold">${showOrder.priceUSD} / {showOrder.unit}</div>
              <div className="text-gray-500 text-xs">الحد الأدنى: {showOrder.minOrder}</div>
              <div className="text-green-400 text-xs">🚚 {showOrder.route}</div>
            </div>

            {orderMode === 'quote' ? (
              <div className="mb-3">
                <label className="text-gray-400 text-sm mb-1 block">الكمية المطلوبة</label>
                <input
                  type="text"
                  placeholder="مثال: 100 وحدة"
                  value={quantity}
                  onChange={e => setQuantity(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-green-500 focus:outline-none"
                />
              </div>
            ) : (
              <div className="mb-3">
                <label className="text-gray-400 text-sm mb-1 block">عنوان الشحن الكامل</label>
                <input
                  type="text"
                  placeholder="الشارع، المدينة، الرمز البريدي"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-green-500 focus:outline-none"
                />
                <p className="text-orange-400 text-xs mt-1">⚠️ المشتري يدفع تكلفة الشحن فقط</p>
              </div>
            )}

            <div className="mb-3">
              <label className="text-gray-400 text-sm mb-1 block">بلد الشحن</label>
              <input
                type="text"
                placeholder="مثال: ألمانيا"
                value={shippingCountry}
                onChange={e => setShippingCountry(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-green-500 focus:outline-none"
              />
            </div>

            <div className="mb-4">
              <label className="text-gray-400 text-sm mb-1 block">وسيلة التواصل (واتساب/إيميل)</label>
              <input
                type="text"
                placeholder="+49... أو email@example.com"
                value={contact}
                onChange={e => setContact(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-green-500 focus:outline-none"
              />
            </div>

            {orderStatus && (
              <div className="bg-gray-800 rounded-lg p-3 mb-4 text-sm text-gray-300">{orderStatus}</div>
            )}

            <button
              onClick={() => handleQuoteRequest(showOrder)}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold rounded-lg"
            >
              📩 إرسال الطلب
            </button>
          </div>
        </div>
      )}

      {interestProduct && (
        <div className="fixed inset-0 bg-black/80 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold">🔔 أعلمني لما يتوفر</h3>
              <button onClick={() => setInterestProduct(null)} className="text-gray-500 text-xl">✕</button>
            </div>
            <div className="bg-gray-800 rounded-lg p-3 mb-4">
              <div className="text-white font-bold text-sm">{interestProduct.name}</div>
              <p className="text-orange-300 text-xs mt-1">🔸 منتج توضيحي — لا يوجد مورّد حقيقي بعد. سجل تواصلك وسنعلمك فور توفره.</p>
            </div>
            <div className="mb-4">
              <label className="text-gray-400 text-sm mb-1 block">وسيلة التواصل (واتساب/إيميل)</label>
              <input
                type="text"
                placeholder="+49... أو email@example.com"
                value={interestContact}
                onChange={e => setInterestContact(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-orange-500 focus:outline-none"
              />
            </div>
            {interestStatus && (
              <div className="bg-gray-800 rounded-lg p-3 mb-4 text-sm text-gray-300">{interestStatus}</div>
            )}
            <button
              onClick={handleInterest}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold rounded-lg"
            >
              📩 سجّل اهتمامي
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
