export interface WalletConfig {
  primary: string;
  secondary: string;
  rewards: string;
}

export interface StellarBalance {
  asset_type: string;
  balance: string;
  asset_code?: string;
  asset_issuer?: string;
}

export interface WalletState {
  address: string | null;
  balance: string;
  balances: StellarBalance[];
  connected: boolean;
  loading: boolean;
  error: string | null;
}

export interface Transaction {
  id: string;
  hash: string;
  source: string;
  destination: string;
  amount: string;
  asset: string;
  type: 'send' | 'receive';
  timestamp: string;
  status: 'pending' | 'confirmed' | 'failed';
}
