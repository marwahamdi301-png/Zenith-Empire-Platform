const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TG_API = `https://api.telegram.org/bot${TOKEN}`;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { product, seller, quantity, shippingCountry, contact, requestType, address } = req.body;
  const type = requestType === 'sample' ? 'sample' : requestType === 'interest' ? 'interest' : 'quote';

  if (type === 'interest') {
    if (!product || !contact) {
      return res.status(400).json({ success: false, error: 'بيانات ناقصة' });
    }
  } else {
    if (!product || !shippingCountry || !contact) {
      return res.status(400).json({ success: false, error: 'بيانات ناقصة' });
    }
    if (type === 'quote' && !quantity) {
      return res.status(400).json({ success: false, error: 'بيانات ناقصة' });
    }
    if (type === 'sample' && !address) {
      return res.status(400).json({ success: false, error: 'العنوان مطلوب لطلب العينة' });
    }
  }

  try {
    if (ADMIN_CHAT_ID && TOKEN) {
      const message = type === 'sample'
        ? `📦 طلب عينة جديد\n\nالمنتج: ${product}\nالمورّد: ${seller}\nعنوان الشحن: ${address}\nبلد الشحن: ${shippingCountry}\nالتواصل: ${contact}\n\n⚠️ المشتري يدفع تكلفة الشحن فقط`
        : type === 'interest'
        ? `🔔 اهتمام مشترٍ بمنتج تجريبي\n\nالمنتج: ${product}\nالتواصل: ${contact}\n\n⚠️ هذا المنتج تجريبي، لا يوجد مورّد حقيقي بعد — تواصل مع المشتري لإعلامه عند توفر مورّد.`
        : `🆕 طلب عرض سعر جديد\n\nالمنتج: ${product}\nالمورّد: ${seller}\nالكمية: ${quantity}\nبلد الشحن: ${shippingCountry}\nالتواصل: ${contact}`;

      const tgResponse = await fetch(`${TG_API}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: ADMIN_CHAT_ID, text: message })
      });
      const tgData = await tgResponse.json();
      console.log('TELEGRAM_RESPONSE:', JSON.stringify(tgData));
    } else {
      console.log('MISSING_ENV_VARS:', { hasToken: !!TOKEN, hasChatId: !!ADMIN_CHAT_ID });
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Quote request error:', error.message);
    return res.status(500).json({ success: false, error: 'حدث خطأ، حاول مرة أخرى' });
  }
}
