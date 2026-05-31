const API_BASE = '/api';

export interface SendResult { success: boolean; hash: string; amount: string; destination: string; explorerUrl: string; }
export interface AdminResult { success: boolean; action: string; amount: string; hash: string; explorerUrl: string; }

export async function claimMiningReward(destination: string, amount: string): Promise<SendResult> {
  const res = await fetch(`${API_BASE}/send-zenith`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ destination, amount, action: 'mining' }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export async function adminAction(action: 'mint'|'burn'|'distribute', amount: string, token: string, destination?: string): Promise<AdminResult> {
  const res = await fetch(`${API_BASE}/admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ action, amount, destination }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export async function getStellarBalances(address: string) {
  const res = await fetch(`https://horizon.stellar.org/accounts/${address}`);
  if (!res.ok) throw new Error('فشل جلب الرصيد');
  const account = await res.json();
  const zenithIssuer = import.meta.env.VITE_ZENITH_ISSUER || '';
  let xlm = '0', zenith = '0';
  for (const b of account.balances) {
    if (b.asset_type === 'native') xlm = parseFloat(b.balance).toFixed(4);
    if (b.asset_code === 'ZENITH' && (!zenithIssuer || b.asset_issuer === zenithIssuer)) zenith = parseFloat(b.balance).toFixed(4);
  }
  return { xlm, zenith, address };
}
