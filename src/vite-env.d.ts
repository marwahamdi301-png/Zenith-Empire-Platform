/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WALLET_PRIMARY: string;
  readonly VITE_WALLET_SECONDARY: string;
  readonly VITE_WALLET_REWARDS: string;
  readonly VITE_STELLAR_NETWORK: string;
  readonly VITE_HORIZON_URL: string;
  readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
