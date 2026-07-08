const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TG_API = `https://api.telegram.org/bot${TOKEN}`;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { businessName, ownerName, email, whatsapp, country, city, categories, description, monthlyVolume, website } = req.body;

  if (!businessName || !ownerName || !email || !country || !categories?.length) {
    return res.status(400).json({ success: false, error: 'بيانات ناقصة' });
  }

  try {
    if (ADMIN_CHAT_ID && TOKEN) {
      const message = `🌾 طلب تسجيل مورّد جديد\n\nالنشاط: ${businessName}\nالمالك: ${ownerName}\nالإيميل: ${email}\nواتساب: ${whatsapp || 'غير محدد'}\nالدولة: ${country}\nالمدينة: ${city || 'غير محدد'}\nالمنتجات: ${categories.join(', ')}\nالحجم الشهري: ${monthlyVolume || 'غير محدد'}\nالموقع: ${website || 'لا يوجد'}\n\nالوصف: ${description || 'لا يوجد'}`;
      const tgResponse = await fetch(`${TG_API}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: ADMIN_CHAT_ID, text: message })
      });
      const tgData = await tgResponse.json();
      console.log('TELEGRAM_RESPONSE:', JSON.stringify(tgData));
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Seller register error:', error.message);
    return res.status(500).json({ success: false, error: 'حدث خطأ، حاول مرة أخرى' });
  }
}
