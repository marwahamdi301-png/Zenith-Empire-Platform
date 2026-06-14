import { LayoutDashboard, ArrowLeftRight, Cpu, ShieldCheck, BookOpen, Wallet, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { DashboardView }  from '../dashboard/DashboardView';
import { TradingView }    from '../trading/TradingView';
import { MobileMining }   from '../mining/MobileMining';
import { AdminDashboard } from '../admin/AdminDashboard';
import { WalletPage }     from '../wallet/WalletPage';
import { TrustlineGuide } from '../wallet/TrustlineGuide';
import PiExchange         from '../../pages/PiExchange';
import Marketplace        from '../../pages/Marketplace';
import SellerRegister     from '../../pages/SellerRegister';
import Analytics          from '../../pages/Analytics';
import AirdropClaim       from '../../pages/AirdropClaim';
import Staking            from '../../pages/Staking';
import Transparency       from '../../pages/Transparency';

type TabType = 'dashboard' | 'trading' | 'mining' | 'wallet' | 'market' | 'guide' | 'pi' | 'admin';

export function TabNavigation() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'الرئيسية', icon: LayoutDashboard,  color: 'text-yellow-400' },
    { id: 'trading',   label: 'التداول',  icon: ArrowLeftRight,   color: 'text-yellow-400' },
    { id: 'mining',    label: 'التعدين',  icon: Cpu,              color: 'text-yellow-400' },
    { id: 'wallet',    label: 'المحافظ',  icon: Wallet,           color: 'text-yellow-400' },
    { id: 'market',    label: 'السوق',    icon: ShoppingBag,      color: 'text-green-400'  },
    { id: 'guide',     label: 'ZENITH',   icon: BookOpen,         color: 'text-yellow-400' },
    { id: 'pi',        label: 'Pi',       icon: () => <span className="text-lg font-bold">π</span>, color: 'text-purple-400' },
    { id: 'transparency', label: 'ثقة', icon: () => <span className="text-lg">🔍</span>, color: 'text-green-400' },
    { id: 'airdrop',   label: 'Airdrop',  icon: () => <span className="text-lg">🎁</span>, color: 'text-yellow-400' },
    { id: 'staking',   label: 'Staking',  icon: () => <span className="text-lg">💎</span>, color: 'text-blue-400'   },
    { id: 'analytics', label: 'تحليل',   icon: () => <span className="text-lg">📊</span>, color: 'text-purple-400' },
    { id: 'seller',    label: 'بائع',     icon: () => <span className="text-lg">🌾</span>, color: 'text-green-400'  },
    
  ] as const;

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white">
      <main className="flex-1 pb-24">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'trading'   && <TradingView />}
        {activeTab === 'mining'    && <MobileMining />}
        {activeTab === 'wallet'    && <WalletPage />}
        {activeTab === 'market'    && <Marketplace />}
        {activeTab === 'transparency' && <Transparency />}
        {activeTab === 'airdrop'   && <AirdropClaim />}
        {activeTab === 'staking'   && <Staking />}
        {activeTab === 'analytics' && <Analytics />}
        {activeTab === 'seller'    && <SellerRegister />}
        {activeTab === 'guide'     && <TrustlineGuide />}
        {activeTab === 'pi'        && <PiExchange />}
        {activeTab === 'admin'     && <AdminDashboard />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-md border-t border-gray-800 px-1 py-2 z-50">
        <div className="max-w-lg mx-auto flex justify-around items-center">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex flex-col items-center gap-1 p-1 text-xs font-medium transition-colors ${
                  isActive ? tab.color : 'text-gray-500 hover:text-gray-300'
                }`}
              >
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
