import { useState } from 'react';
import { Zap, Settings } from 'lucide-react';
import { TabNavigation, type TabType } from './components/common/TabNavigation';
import { PriceTicker } from './components/common/PriceTicker';
import { NotificationCenter } from './components/common/NotificationCenter';
import { DashboardView } from './components/dashboard/DashboardView';
import { TradingView } from './components/trading/TradingView';
import { SecurityView } from './components/wallet/SecurityView';
import PiExchange from './pages/PiExchange';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'trading':
        return <TradingView />;
      case 'security':
        return <SecurityView />;
      case 'pi-exchange':
        return <PiExchange />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg animate-pulse-glow">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Zenith Empire</h1>
                <p className="text-xs text-gray-400">Stellar Trading Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-white">$12,458.50</p>
                <p className="text-xs text-green-400">+12.5% (24h)</p>
              </div>
              <NotificationCenter />
              <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all">
                <Settings className="w-5 h-5 text-white" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="hidden sm:inline text-xs text-gray-400">Live</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Price Ticker */}
      <PriceTicker />

      {/* Tab Navigation */}
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {renderTabContent()}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900/50 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              © 2026 Zenith Empire · Powered by Stellar + Pi Network 🌍
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-gray-400 hover:text-primary transition-colors">Docs</a>
              <a href="#" className="text-sm text-gray-400 hover:text-primary transition-colors">API</a>
              <a href="#" className="text-sm text-gray-400 hover:text-primary transition-colors">Support</a>
              <a href="https://github.com/marwahamdi301-png/Zenith-Empire-Platform" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-primary transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
