export type NetworkType = 'stellar-testnet' | 'stellar-mainnet' | 'pi-network' | 'bridge';

export interface NetworkConfig {
  name: string;
  type: NetworkType;
  rpcUrl: string;
  explorerUrl: string;
  isActive: boolean;
}

export const NETWORKS: NetworkConfig[] = [
  {
    name: 'Stellar Testnet',
    type: 'stellar-testnet',
    rpcUrl: 'https://horizon-testnet.stellar.org',
    explorerUrl: 'https://stellar.expert/explorer/testnet',
    isActive: true,
  },
  {
    name: 'Stellar Mainnet',
    type: 'stellar-mainnet',
    rpcUrl: 'https://horizon.stellar.org',
    explorerUrl: 'https://stellar.expert/explorer/public',
    isActive: false, // فعّلها بعد المراجعة الأمنية
  },
  {
    name: 'Pi Network',
    type: 'pi-network',
    rpcUrl: 'https://api.minepi.com/v2',
    explorerUrl: 'https://blockexplorer.minepi.com',
    isActive: true,
  },
];

export class NetworkBridge {
  static async switchNetwork(type: NetworkType) {
    const network = NETWORKS.find(n => n.type === type);
    if (!network) throw new Error('Network not supported');
    
    localStorage.setItem('zenith_active_network', type);
    console.log(`🌐 Switched to ${network.name}`);
    return network;
  }

  static getActiveNetwork(): NetworkConfig {
    const stored = localStorage.getItem('zenith_active_network') as NetworkType;
    return NETWORKS.find(n => n.type === stored) || NETWORKS[0];
  }

  static async getBalance(address: string) {
    const network = this.getActiveNetwork();
    if (network.type.includes('stellar')) {
      const { Horizon } = await import('@stellar/stellar-sdk');
      const server = new Horizon.Server(network.rpcUrl);
      const account = await server.loadAccount(address);
      return account.balances;
    }
    // Pi Network & Bridge logic here
    return [];
  }
}
