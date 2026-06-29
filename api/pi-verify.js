export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { accessToken, uid } = req.body;
  if (!accessToken || !uid) return res.status(400).json({ error: 'accessToken and uid required' });

  try {
    // التحقق من المستخدم عبر Pi Platform API
    const piRes = await fetch(`https://api.minepi.com/v2/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!piRes.ok) {
      return res.status(401).json({ error: 'Invalid Pi token', verified: false });
    }

    const piUser = await piRes.json();

    // التحقق أن الـ uid يطابق
    if (piUser.uid !== uid) {
      return res.status(401).json({ error: 'UID mismatch', verified: false });
    }

    return res.status(200).json({
      verified: true,
      username: piUser.username,
      uid: piUser.uid,
      kyc_verified: piUser.kyc_verified || false,
      credentials: piUser.credentials || []
    });

  } catch (err) {
    return res.status(500).json({ error: 'Verification failed', details: err.message });
  }
}
