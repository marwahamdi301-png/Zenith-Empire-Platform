import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { accessToken } = req.body;
  if (!accessToken) return res.status(400).json({ valid: false });

  try {
    // التحقق من Pi Network مباشرة - لا يحتاج API Key
    const response = await fetch("https://api.minepi.com/v2/me", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!response.ok) return res.status(200).json({ valid: false });

    const userData = await response.json();
    res.status(200).json({
      valid: true,
      uid: userData.uid,
      username: userData.username
    });

  } catch (error) {
    res.status(200).json({ valid: false });
  }
}
