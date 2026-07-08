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
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [form, setForm] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    whatsapp: '',
    country: '',
    city: '',
    categories: [] as string[],
    description: '',
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

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError('');
    try {
      const response = await fetch('/api/seller-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await response.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setSubmitError(data.error || 'حدث خطأ، حاول مرة أخرى');
      }
    } catch (err) {
      setSubmitError('فشل الإرسال. تحقق من الاتصال وحاول مرة أخرى.');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-white font-bold text-2xl mb-2">تم إرسال طلبك!</h2>
          <p className="text-gray-400 mb-4">
            شكراً <span className="text-cyan-400">{form.businessName}</span>!
            سنراجع طلبك ونتواصل معك خلال 48 ساعة.
          </p>
          <div className="bg-gray-900 border border-green-500/30 rounded-xl p-4 text-left mb-6">
            <div className="text-green-400 font-bold mb-2">✅ الخطوات القادمة:</div>
            <div className="space-y-2 text-gray-400 text-sm">
              <div>1. فريقنا يراجع طلبك</div>
              <div>2. نتحقق من منتجاتك</div>
              <div>3. يظهر متجرك على منصة Zenith</div>
              <div>4. نتفق معك على طريقة الدفع (تحويل بنكي / USD)</div>
            </div>
          </div>
          <div className="text-gray-500 text-sm">
            📧 راقب {form.email} لتأكيد الطلب
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 pb-20">
      <div className="bg-gradient-to-r from-green-900 to-teal-900 p-5">
        <h2 className="text-white font-bold text-xl mb-1">🌾 سجل كمورّد</h2>
        <p className="text-green-300 text-sm">
          بيع منتجاتك عبر المغرب العربي، أوروبا، والخليج
        </p>
        <div className="flex gap-2 mt-3">
          {[1,2,3].map(s => (
            <div key={s} className={`flex-1 h-1.5 rounded-full ${step >= s ? 'bg-green-400' : 'bg-gray-700'}`} />
          ))}
        </div>
        <div className="text-gray-400 text-xs mt-2">خطوة {step} من 3</div>
      </div>

      <div className="p-4 space-y-4">

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg">📋 معلومات النشاط التجاري</h3>

            <div>
              <label className="text-gray-400 text-sm mb-1 block">اسم النشاط التجاري *</label>
              <input
                type="text"
                placeholder="مثال: Hamdi Farm, Atlas Crafts..."
                value={form.businessName}
                onChange={e => updateForm('businessName', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-white text-sm focus:border-green-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1 block">اسم المالك *</label>
              <input
                type="text"
                placeholder="اسمك الكامل"
                value={form.ownerName}
                onChange={e => updateForm('ownerName', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-white text-sm focus:border-green-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1 block">الإيميل *</label>
              <input
                type="email"
                placeholder="business@email.com"
                value={form.email}
                onChange={e => updateForm('email', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-white text-sm focus:border-green-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1 block">رقم واتساب</label>
              <input
                type="tel"
                placeholder="+216 XX XXX XXX"
                value={form.whatsapp}
                onChange={e => updateForm('whatsapp', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-white text-sm focus:border-green-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1 block">الدولة *</label>
              <select
                value={form.country}
                onChange={e => updateForm('country', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-white text-sm focus:border-green-500 focus:outline-none"
              >
                <option value="">اختر الدولة...</option>
                {countries.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1 block">المدينة</label>
              <input
                type="text"
                placeholder="مثال: صفاقس، مراكش، الجزائر العاصمة..."
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
              التالي →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg">🛒 منتجاتك</h3>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                فئات المنتجات * (اختر كل ما ينطبق)
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
              <label className="text-gray-400 text-sm mb-1 block">وصف النشاط التجاري</label>
              <textarea
                placeholder="حدثنا عن نشاطك، منتجاتك، وخبرتك..."
                value={form.description}
                onChange={e => updateForm('description', e.target.value)}
                rows={4}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-white text-sm focus:border-green-500 focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1 block">حجم التصدير الشهري</label>
              <select
                value={form.monthlyVolume}
                onChange={e => updateForm('monthlyVolume', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-white text-sm focus:border-green-500 focus:outline-none"
              >
                <option value="">اختر الحجم...</option>
                <option>أقل من $1,000/شهر</option>
                <option>$1,000 - $5,000/شهر</option>
                <option>$5,000 - $20,000/شهر</option>
                <option>$20,000 - $100,000/شهر</option>
                <option>أكثر من $100,000/شهر</option>
              </select>
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1 block">الموقع الإلكتروني (اختياري)</label>
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
                ← رجوع
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={form.categories.length === 0}
                className="flex-1 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold rounded-lg disabled:opacity-50"
              >
                التالي →
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg">📋 مراجعة الطلب</h3>

            <div className="bg-gray-800 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">النشاط:</span>
                <span className="text-white">{form.businessName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">الدولة:</span>
                <span className="text-white">{form.country}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">الفئات:</span>
                <span className="text-white">{form.categories.length} مختارة</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">الحجم:</span>
                <span className="text-white">{form.monthlyVolume || 'غير محدد'}</span>
              </div>
            </div>

            <div className="bg-blue-900/30 border border-blue-500/30 rounded-xl p-4">
              <div className="text-blue-300 text-sm">
                💳 الدفع يتم بالدولار الأمريكي عبر تحويل بنكي أو Wise. سنتواصل معك لترتيب التفاصيل بعد المراجعة.
              </div>
            </div>

            {submitError && (
              <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3 text-red-300 text-sm">
                ❌ {submitError}
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setStep(2)}
                className="flex-1 py-3 bg-gray-800 text-white font-bold rounded-lg">
                ← رجوع
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold rounded-lg disabled:opacity-50"
              >
                {submitting ? '⏳ جاري الإرسال...' : '🚀 إرسال الطلب'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
