export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { uid } = req.body;
  if (!uid) return res.status(400).json({ error: "uid required" });

  try {
    const r = await fetch("https://api.minepi.com/v2/payments", {
      method: "POST",
      headers: {
        Authorization: `Key ${process.env.PI_TESTNET_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount: 0.5,
        memo: "Zenith Dev testnet A2U test",
        metadata: { purpose: "app_studio_verification" },
        uid
      })
    });
    const data = await r.json();
    res.status(r.ok ? 200 : 502).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
