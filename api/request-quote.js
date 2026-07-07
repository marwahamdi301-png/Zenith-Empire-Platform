const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TG_API = `https://api.telegram.org/bot${TOKEN}`;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { product, seller, quantity, shippingCountry, contact } = req.body;

  if (!product || !quantity || !shippingCountry || !contact) {
    return res.status(400).json({ success: false, error: 'بيانات ناقصة' });
  }

  try {
    if (ADMIN_CHAT_ID && TOKEN) {
      const message = `🆕 طلب عرض سعر جديد\n\nالمنتج: ${product}\nالمورّد: ${seller}\nالكمية: ${quantity}\nبلد الشحن: ${shippingCountry}\nالتواصل: ${contact}`;
      const tgResponse = await fetch(`${TG_API}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: ADMIN_CHAT_ID, text: message })
      });
      const tgData = await tgResponse.json();
      console.log('TELEGRAM_RESPONSE:', JSON.stringify(tgData));
      console.log('TOKEN_LENGTH:', TOKEN ? TOKEN.length : 0);
      console.log('CHAT_ID:', ADMIN_CHAT_ID);
    } else {
      console.log('MISSING_ENV_VARS:', { hasToken: !!TOKEN, hasChatId: !!ADMIN_CHAT_ID });
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Quote request error:', error.message);
    return res.status(500).json({ success: false, error: 'حدث خطأ، حاول مرة أخرى' });
  }
}
