import { useState } from 'react';
import { Wallet, CheckCircle, AlertCircle } from 'lucide-react';

export function WalletConnect() {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setConnected(true);
    } catch (error) {
      alert('Freighter wallet not detected. Please install it first.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <Wallet className="w-6 h-6 text-primary" />
        <h3 className="text-lg font-bold text-white">Connect Wallet</h3>
      </div>

      {!connected ? (
        <button
          onClick={handleConnect}
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
        >
          {loading ? 'Connecting...' : 'Connect Freighter Wallet'}
        </button>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Wallet Connected</span>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Connected Address</p>
            <p className="text-sm text-white font-mono">GXXX...Demo</p>
          </div>
          <button
            onClick={() => setConnected(false)}
            className="w-full py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
          >
            Disconnect
          </button>
        </div>
      )}

      <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5" />
          <p className="text-xs text-yellow-200">
            Install Freighter wallet extension to connect your Stellar account
          </p>
        </div>
      </div>
    </div>
  );
}
