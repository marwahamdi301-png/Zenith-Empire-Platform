import { TrendingUp, TrendingDown, DollarSign, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import PriceChart from "../PriceChart";
import { MarketOverview } from './MarketOverview';
import { PortfolioManager } from './PortfolioManager';

const stats = [
  {
    label: 'Total Portfolio',
    value: '$12,458.50',
    change: '+12.5%',
    changeValue: '+$1,385.20',
    trend: 'up' as const,
    icon: DollarSign,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    label: '24h Volume',
    value: '$842,391',
    change: '+8.2%',
    changeValue: '+$63,892',
    trend: 'up' as const,
    icon: Activity,
    color: 'from-purple-500 to-pink-500',
  },
  {
    label: 'Active Trades',
    value: '23',
    change: '-3.1%',
    changeValue: '-1 trade',
    trend: 'down' as const,
    icon: TrendingUp,
    color: 'from-orange-500 to-red-500',
  },
  {
    label: 'Win Rate',
    value: '67.8%',
    change: '+2.4%',
    changeValue: '+1.6%',
    trend: 'up' as const,
    icon: TrendingDown,
    color: 'from-green-500 to-emerald-500',
  },
];

const recentTrades = [
  { pair: 'XLM/USDC', type: 'buy', amount: '1,250', price: '$0.1234', time: '2 min ago', profit: '+$12.50' },
  { pair: 'BTC/USDC', type: 'sell', amount: '0.05', price: '$42,100', time: '15 min ago', profit: '+$215.00' },
  { pair: 'ETH/USDC', type: 'buy', amount: '2.5', price: '$2,340', time: '1 hour ago', profit: '-$8.20' },
];

export function DashboardView() {
  return (
    <div className="space-y-6 animate-slide-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const isPositive = stat.trend === 'up';
          const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight;
          
          return (
            <div
              key={stat.label}
              className="relative overflow-hidden bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-primary/50 transition-all group"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`}></div>
              
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                    isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    <TrendIcon className="w-4 h-4" />
                    <span className="text-sm font-bold">{stat.change}</span>
                  </div>
                </div>
                
                <h3 className="text-3xl font-bold text-white mb-2">{stat.value}</h3>
                <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                <p className={`text-xs font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {stat.changeValue}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Portfolio Chart */}
        <div className="lg:col-span-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Portfolio Performance</h2>
            <div className="flex gap-2">
              {['1D', '1W', '1M', '1Y'].map((period) => (
                <button
                  key={period}
                  className="px-3 py-1 text-sm rounded-lg bg-gray-700 text-gray-300 hover:bg-primary hover:text-white transition-all"
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-64 bg-gray-900/50 rounded-lg p-4 flex items-end justify-between gap-2">
            {[65, 78, 45, 89, 67, 92, 54, 88, 76, 95, 68, 82].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end group">
                <div
                  className="bg-gradient-to-t from-primary to-purple-500 rounded-t transition-all hover:opacity-80 group-hover:scale-105"
                  style={{ height: `${height}%` }}
                ></div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Trades */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Recent Trades</h2>
          <div className="space-y-3">
            {recentTrades.map((trade, i) => (
              <div key={i} className="bg-gray-900/50 rounded-lg p-4 hover:bg-gray-900/80 transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white">{trade.pair}</span>
                  <span className={`text-xs px-2 py-1 rounded font-medium ${
                    trade.type === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {trade.type.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-400 mb-1">
                  <span>{trade.amount}</span>
                  <span>{trade.price}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">{trade.time}</span>
                  <span className={`font-medium ${trade.profit.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {trade.profit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live ZENITH Price */}
      <PriceChart />

      {/* Market Overview */}
      <MarketOverview />

      {/* Portfolio Manager */}
      <PortfolioManager />
    </div>
  );
}
