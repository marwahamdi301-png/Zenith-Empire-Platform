export default async function handler(req, res) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const webhookUrl = 'https://zenithempire.online/api/academy-bot';
  const r = await fetch(`https://api.telegram.org/bot${token}/setWebhook?url=${encodeURIComponent(webhookUrl)}`);
  const data = await r.json();
  res.status(200).json(data);
}
