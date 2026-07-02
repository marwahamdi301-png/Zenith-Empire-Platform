export default async function handler(req, res) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const r = await fetch(`https://api.telegram.org/bot${token}/getWebhookInfo`);
  const data = await r.json();
  res.status(200).json(data.result);
}
