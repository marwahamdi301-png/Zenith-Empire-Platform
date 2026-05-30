export const ENV = {
  WALLETS: {
    PRIMARY: 'GCMRPF2KNTNFSNB7LIX6KDWKLVGMGNZT2ACHCMF2R3OX5YZFSQPYTEP6',
    SECONDARY: 'GDPMNWGH6XOT2FEF7KR7TQO3K2IRQOTX4ONZBOCRD6QY73OXDLEDPKEX',
    REWARDS: 'GDVTACGR5QEVND7LW56QLQAXYBWXVAZOBRUCZ3Z2ACRKKZL3VUHG4VYX',
  },
  STELLAR: {
    NETWORK: 'mainnet',
    HORIZON_URL: 'https://horizon.stellar.org',
  },
  API: {
    BASE_URL: 'https://zenith-empire-api.vercel.app',
  },
  PI: {
    SUBDOMAIN: 'bayota3839',
  },
  isDevelopment: false,
  isProduction: true,
} as const;
