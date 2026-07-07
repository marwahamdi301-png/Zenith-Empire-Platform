import { LayoutDashboard, ArrowLeftRight, Cpu, Wallet, ShoppingBag, LogIn } from 'lucide-react';
import { useState } from 'react';
import { DashboardView }  from '../dashboard/DashboardView';
import { TradingView }    from '../trading/TradingView';
import { MobileMining }   from '../mining/MobileMining';
import { AdminDashboard } from '../admin/AdminDashboard';
import { WalletPage }     from '../wallet/WalletPage';
import { TrustlineGuide } from '../wallet/TrustlineGuide';
import Marketplace        from '../../pages/Marketplace';
import SellerRegister     from '../../pages/SellerRegister';
import Landing            from '../../pages/Landing';
import AboutUs            from '../../pages/AboutUs';

type TabType = 'landing' | 'dashboard' | 'trading' | 'mining' | 'wallet' | 'market' | 'guide' | 'seller' | 'about' | 'admin';

export function TabNavigation() {
  const [activeTab, setActiveTab] = useState<TabType>('landing');
  const [entered, setEntered] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'الرئيسية', icon: LayoutDashboard, color: 'text-yellow-400' },
    { id: 'trading',   label: 'التداول',  icon: ArrowLeftRight,  color: 'text-yellow-400' },
    { id: 'mining',    label: 'التعدين',  icon: Cpu,             color: 'text-yellow-400' },
    { id: 'wallet',    label: 'المحافظ',  icon: Wallet,          color: 'text-yellow-400' },
    { id: 'market',    label: 'السوق',    icon: ShoppingBag,     color: 'text-green-400'  },
    { id: 'guide',     label: 'ZENITH',   icon: () => <span className="text-lg">📘</span>, color: 'text-yellow-400' },
    { id: 'seller',    label: 'بائع',     icon: () => <span className="text-lg">🌾</span>, color: 'text-green-400'  },
    { id: 'about',     label: 'من نحن',   icon: () => <span className="text-lg">👤</span>, color: 'text-orange-400' },
  ] as const;

  if (!entered) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col">
        <Landing />
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-950 via-gray-950/90 to-transparent pt-12">
          <button
            onClick={() => { setEntered(true); setActiveTab('dashboard'); }}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold py-4 rounded-2xl text-lg shadow-lg shadow-yellow-500/20 transition-all">
            <LogIn className="w-5 h-5" />
            ادخل إلى المنصة
          </button>
          <p className="text-center text-xs text-gray-500 mt-2">منصة تجارة زراعية — تونس · المغرب · الجزائر 🌍</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white">
      <main className="flex-1 pb-24">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'trading'   && <TradingView />}
        {activeTab === 'mining'    && <MobileMining />}
        {activeTab === 'wallet'    && <WalletPage />}
        {activeTab === 'market'    && <Marketplace />}
        {activeTab === 'seller'    && <SellerRegister />}
        {activeTab === 'about'     && <AboutUs />}
        {activeTab === 'guide'     && <TrustlineGuide />}
        {activeTab === 'admin'     && <AdminDashboard />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-md border-t border-gray-800 px-2 py-2 z-50">
        <div className="flex items-center overflow-x-auto gap-1 scrollbar-hide">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex flex-col items-center gap-1 px-2 py-1 text-xs font-medium transition-colors shrink-0 ${
                  isActive ? tab.color : 'text-gray-500 hover:text-gray-300'
                }`}>
                <Icon className="w-5 h-5" />
                <span className="text-[10px]">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
