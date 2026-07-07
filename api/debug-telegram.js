export default async function handler(req, res) {
  const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;

  if (!TOKEN || !ADMIN_CHAT_ID) {
    return res.status(200).json({ hasToken: !!TOKEN, hasChatId: !!ADMIN_CHAT_ID });
  }

  try {
    const tgResponse = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: ADMIN_CHAT_ID, text: 'اختبار تشخيصي مباشر' })
    });
    const data = await tgResponse.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(200).json({ error: error.message });
  }
}
