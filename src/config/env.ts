export const ENV = {
  WALLETS: {
    PRIMARY: import.meta.env.VITE_WALLET_PRIMARY || '',
    SECONDARY: import.meta.env.VITE_WALLET_SECONDARY || '',
    REWARDS: import.meta.env.VITE_WALLET_REWARDS || '',
  },
  STELLAR: {
    NETWORK: import.meta.env.VITE_STELLAR_NETWORK || 'testnet',
    HORIZON_URL: import.meta.env.VITE_HORIZON_URL || 'https://horizon-testnet.stellar.org',
  },
  API: {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  },
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const;

// Validation
const validateWallet = (address: string, name: string): void => {
  if (!address || address.length !== 56) {
    console.warn(`⚠️ Invalid ${name} wallet address`);
  }
};

validateWallet(ENV.WALLETS.PRIMARY, 'PRIMARY');
validateWallet(ENV.WALLETS.SECONDARY, 'SECONDARY');
validateWallet(ENV.WALLETS.REWARDS, 'REWARDS');
