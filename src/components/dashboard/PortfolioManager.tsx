import { Wallet, PieChart, Download, Upload } from 'lucide-react';

const holdings = [
  { asset: 'XLM', amount: 10234.5, value: 1262.88, allocation: 35, color: 'bg-blue-500' },
  { asset: 'USDC', amount: 1500.00, value: 1500.00, allocation: 42, color: 'bg-green-500' },
  { asset: 'BTC', amount: 0.05, value: 2105.00, allocation: 15, color: 'bg-orange-500' },
  { asset: 'ETH', amount: 1.2, value: 2808.00, allocation: 8, color: 'bg-purple-500' },
];

export function PortfolioManager() {
  const totalValue = holdings.reduce((sum, h) => sum + h.value, 0);

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <PieChart className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold text-white">Asset Allocation</h3>
        </div>
        <div className="flex gap-2">
          <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all">
            <Download className="w-4 h-4 text-white" />
          </button>
          <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all">
            <Upload className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Allocation Chart */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-4 bg-gray-700 rounded-full overflow-hidden flex">
          {holdings.map((holding, i) => (
            <div
              key={i}
              className={`${holding.color} transition-all hover:opacity-80`}
              style={{ width: `${holding.allocation}%` }}
              title={`${holding.asset}: ${holding.allocation}%`}
            />
          ))}
        </div>
      </div>

      {/* Holdings List */}
      <div className="space-y-3">
        {holdings.map((holding, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 ${holding.color} rounded-full`} />
              <div>
                <div className="font-bold text-white">{holding.asset}</div>
                <div className="text-xs text-gray-400">{holding.amount.toLocaleString()} units</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-white">${holding.value.toLocaleString()}</div>
              <div className="text-xs text-gray-400">{holding.allocation}%</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Total Portfolio Value</span>
          <span className="text-2xl font-bold text-white">${totalValue.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
