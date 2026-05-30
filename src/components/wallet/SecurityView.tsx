import { Wallet, Copy, ExternalLink, AlertTriangle, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { WalletConnect } from './WalletConnect';

const wallets = [
  { 
    name: 'Primary Wallet', 
    address: 'ILGCMRPF2KNTNFSNB7LIX6KDWKLVGMGNZT2ACHCMF2R3OX5YZFSQPYTEP6',
    color: 'from-blue-500 to-cyan-500',
    balance: '10,234.50 XLM'
  },
  { 
    name: 'Secondary Wallet', 
    address: 'GDPMNWGH6XOT2FEF7KR7TQO3K2IRQOTX4ONZBOCRD6QY73OXDLEDPKEX',
    color: 'from-purple-500 to-pink-500',
    balance: '5,120.25 XLM'
  },
  { 
    name: 'Rewards Wallet', 
    address: 'GDVTACGR5QEVND7LW56QLQAXYBWXVAZOBRUCZ3Z2ACRKKZL3VUHG4VYX',
    color: 'from-green-500 to-emerald-500',
    balance: '2,850.75 XLM'
  },
];

export function SecurityView() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Security Warning */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-white mb-2">Security Notice</h3>
            <p className="text-sm text-gray-300">
              Never share your secret keys. These are public addresses only. 
              Always verify addresses before sending transactions.
            </p>
          </div>
        </div>
      </div>

      {/* Wallet Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wallets.map((wallet, index) => (
          <div
            key={wallet.address}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-primary/50 transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 bg-gradient-to-br ${wallet.color} rounded-lg`}>
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">{wallet.name}</h3>
                <p className="text-sm text-gray-400">Stellar Network</p>
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-3 mb-3">
              <p className="text-xs text-gray-400 mb-1">Balance</p>
              <p className="text-lg font-bold text-white">{wallet.balance}</p>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-3 mb-4">
              <p className="text-xs text-gray-400 mb-1">Public Address</p>
              <p className="text-sm text-white font-mono break-all">
                {truncateAddress(wallet.address)}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => copyToClipboard(wallet.address, index)}
                className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-white transition-all"
              >
                {copiedIndex === index ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
              <a
                href={`https://stellar.expert/explorer/public/account/${wallet.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-blue-500 rounded-lg text-sm text-white transition-all"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Wallet Connect */}
      <WalletConnect />
    </div>
  );
}
