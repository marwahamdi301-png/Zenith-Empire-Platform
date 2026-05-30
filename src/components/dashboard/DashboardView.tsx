import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

const stats = [
  {
    label: 'Total Portfolio',
    value: '$12,458.50',
    change: '+12.5%',
    trend: 'up' as const,
    icon: DollarSign,
  },
  {
    label: '24h Volume',
    value: '$842,391',
    change: '+8.2%',
    trend: 'up' as const,
    icon: Activity,
  },
  {
    label: 'Active Trades',
    value: '23',
    change: '-3.1%',
    trend: 'down' as const,
    icon: TrendingUp,
  },
  {
    label: 'Win Rate',
    value: '67.8%',
    change: '+2.4%',
    trend: 'up' as const,
    icon: TrendingDown,
  },
];

export function DashboardView() {
  return (
    <div className="space-y-6 animate-slide-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const isPositive = stat.trend === 'up';
          
          return (
            <div
              key={stat.label}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-[var(--color-primary)]/50 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-[var(--color-primary)]/10 rounded-lg">
                  <Icon className="w-6 h-6 text-[var(--color-primary)]" />
                </div>
                <span className={`text-sm font-medium ${isPositive ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Portfolio Chart Placeholder */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Portfolio Performance</h2>
        <div className="h-64 flex items-center justify-center text-gray-500">
          Chart visualization (integrate TradingView or Chart.js)
        </div>
      </div>
    </div>
  );
}
