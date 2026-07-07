export default async function handler(req, res) {
  const action = req.query.action;

  // CORS مطلوب لبعض العمليات (كان موجود في pi-verify.js الأصلي)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  switch (action) {
    case 'approve':
      return handleApprove(req, res);
    case 'complete':
      return handleComplete(req, res);
    case 'validate':
      return handleValidate(req, res);
    case 'testnet-a2u':
      return handleTestnetA2U(req, res);
    case 'verify':
      return handleVerify(req, res);
    default:
      return res.status(400).json({ error: 'Unknown or missing action parameter' });
  }
}

// --- من api/pi/approve.ts ---
async function handleApprove(req, res) {
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
  } catch (e) {
    console.log('PI_APPROVE_EXCEPTION:', e.message);
    res.status(500).json({ success: false, error: e.message });
  }
}

// --- من api/pi/complete.ts ---
async function handleComplete(req, res) {
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

// --- من api/pi/validate.ts ---
async function handleValidate(req, res) {
  const { accessToken } = req.body;
  if (!accessToken) return res.status(400).json({ valid: false });

  try {
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

// --- من api/pi/testnet-a2u.js ---
async function handleTestnetA2U(req, res) {
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

// --- من api/pi-verify.js ---
async function handleVerify(req, res) {
  const { accessToken, uid } = req.body;
  if (!accessToken || !uid) return res.status(400).json({ error: 'accessToken and uid required' });

  try {
    const piRes = await fetch(`https://api.minepi.com/v2/me`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!piRes.ok) {
      return res.status(401).json({ error: 'Invalid Pi token', verified: false });
    }

    const piUser = await piRes.json();

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
