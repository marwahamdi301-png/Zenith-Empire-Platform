export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-950 text-white pb-24" dir="rtl">
      <div className="bg-gradient-to-r from-yellow-900/40 via-orange-900/30 to-gray-950 px-6 pt-12 pb-10">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-3xl font-black text-black mb-4">
          ج
        </div>
        <h1 className="text-3xl font-black mb-1">جمال شعباني</h1>
        <p className="text-yellow-400 text-sm font-medium">مؤسس Zenith Trade Hub</p>
      </div>

      <div className="px-6 py-8 space-y-6 max-w-lg">
        <div>
          <h2 className="text-lg font-bold text-yellow-400 mb-2">قصتنا</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            بدأت هذه الرحلة من ملاحظة بسيطة: منتجات زراعية تونسية ومغربية
            وجزائرية عالية الجودة — زيت زيتون، تمور، زعفران — تصل أوروبا
            عبر سلسلة طويلة من الوسطاء، وكل وسيط ياخذ هامشه، والمورّد
            الأصلي يبقى بأقل نصيب من قيمة منتجه الحقيقية.
          </p>
          <p className="text-gray-300 text-sm leading-relaxed mt-3">
            Zenith Trade Hub بُني عشان يقصّر هذه السلسلة — يربط المورّد
            مباشرة بالمشتري، بشفافية كاملة عن السعر والجودة والمصدر.
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <h3 className="text-sm font-bold text-white mb-2">🌍 مشروع ناشئ وصادق</h3>
          <p className="text-gray-400 text-xs leading-relaxed">
            نحن في بدايتنا. أول عشرات الصفقات على هذه المنصة تُتابَع يدوياً
            وشخصياً لضمان وصول المنتج بالجودة المتفق عليها. نفضّل الصدق
            عن حجمنا الحقيقي الصغير على الادعاء بحجم وهمي.
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <h3 className="text-sm font-bold text-white mb-2">🤝 التزامنا للموردين والمشترين</h3>
          <ul className="text-gray-400 text-xs space-y-2 leading-relaxed">
            <li>✅ لا وسطاء خفيين — السعر والهامش واضحان دائماً</li>
            <li>✅ تحقق شخصي من كل مورّد جديد قبل عرض منتجاته</li>
            <li>✅ نربطك مباشرة بالطرف الآخر — الدفع والشحن يتفق عليهما الطرفان مباشرة، بلا وسطاء خفيين في العملية</li>
            <li>✅ دعم مباشر بالعربية والفرنسية والإنجليزية</li>
          </ul>
        </div>

        <div className="bg-gray-900 border border-green-800/50 rounded-2xl p-4">
          <h3 className="text-sm font-bold text-green-400 mb-2">🌾 Baya Farms — أول مورّد على المنصة</h3>
          <p className="text-gray-400 text-xs leading-relaxed">
            نبدأ بأنفسنا: Baya Farms يوفر زيت زيتون من سليانة، تمور، زبيب،
            زيت إكليل الجبل، منتجات الخروب، وعصائر طبيعية — إضافة لقدرة
            توفير مجموعة واسعة من المنتجات الزراعية والحرفية من تونس وليبيا
            حسب الطلب.
          </p>
        </div>

        <div className="text-center pt-4">
          <p className="text-gray-500 text-xs mb-3">تحبوا تتواصلوا معايا مباشرة؟</p>
          <a
            href="https://t.me/BayaEmpireOfficial"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold px-6 py-3 rounded-xl text-sm"
          >
            💬 تواصل معي على تيليجرام
          </a>
        </div>
      </div>
    </div>
  );
}
