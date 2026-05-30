import { Wallet, Copy, ExternalLink, AlertTriangle } from 'lucide-react';
import { ENV } from '../../config/env';
import { truncateAddress } from '../../utils/format';

const wallets = [
  { name: 'Primary Wallet', address: ENV.WALLETS.PRIMARY, color: 'primary' },
  { name: 'Secondary Wallet', address: ENV.WALLETS.SECONDARY, color: 'secondary' },
  { name: 'Rewards Wallet', address: ENV.WALLETS.REWARDS, color: 'success' },
];

export function SecurityView() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Security Warning */}
      <div className="bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/30 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-[var(--color-warning)] flex-shrink-0 mt-1" />
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
        {wallets.map((wallet) => (
          <div
            key={wallet.address}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-[var(--color-primary)]/50 transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 bg-[var(--color-${wallet.color})]/10 rounded-lg`}>
                <Wallet className={`w-6 h-6 text-[var(--color-${wallet.color})]`} />
              </div>
              <div>
                <h3 className="font-bold text-white">{wallet.name}</h3>
                <p className="text-sm text-gray-400">Stellar Network</p>
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-3 mb-4">
              <p className="text-xs text-gray-400 mb-1">Public Address</p>
              <p className="text-sm text-white font-mono break-all">
                {truncateAddress(wallet.address, 8)}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => copyToClipboard(wallet.address)}
                className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-white transition-all"
              >
                <Copy className="w-4 h-4" />
                Copy
              </button>
              <a
                href={`${ENV.STELLAR.HORIZON_URL.replace('api', 'www')}/accounts/${wallet.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-[var(--color-primary)] hover:bg-blue-500 rounded-lg text-sm text-white transition-all"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
