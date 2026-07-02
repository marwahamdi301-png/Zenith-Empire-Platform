import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const { paymentId } = req.body;
  try {
    const r = await fetch(
      `https://api.minepi.com/v2/payments/${paymentId}/approve`,
      {
        method: "POST",
        headers: {
          Authorization: `Key ${process.env.PI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
    const data = await r.json();
    console.log('PI_APPROVE_STATUS:', r.status, 'DATA:', JSON.stringify(data));
    if (!r.ok) {
      return res.status(502).json({ success: false, error: data });
    }
    res.status(200).json({ success: true, data });
  } catch (e: any) {
    console.log('PI_APPROVE_EXCEPTION:', e.message);
    res.status(500).json({ success: false, error: e.message });
  }
}
