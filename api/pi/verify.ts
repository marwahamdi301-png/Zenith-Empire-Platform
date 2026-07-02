import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { accessToken } = req.body;
  if (!accessToken) return res.status(400).json({ error: 'No token' });

  try {
    const piRes = await fetch('https://api.minepi.com/v2/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!piRes.ok) return res.status(401).json({ error: 'Invalid Pi token' });

    const piUser = await piRes.json();
    return res.status(200).json({ uid: piUser.uid, username: piUser.username });
  } catch {
    return res.status(500).json({ error: 'Pi API error' });
  }
}
