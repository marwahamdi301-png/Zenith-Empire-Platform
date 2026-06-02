import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { paymentId, txid } = req.body;

  try {
    const response = await fetch(
      `https://api.minepi.com/v2/payments/${paymentId}/complete`,
      {
        method: "POST",
        headers: {
          Authorization: `Key ${process.env.PI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ txid })
      }
    );
    const data = await response.json();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
}
