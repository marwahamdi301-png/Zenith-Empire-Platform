import { ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import Marketplace    from '../../pages/Marketplace';
import SellerRegister from '../../pages/SellerRegister';
import AboutUs         from '../../pages/AboutUs';
import PartnersPage    from '../../pages/PartnersPage';

type TabType = 'market' | 'seller' | 'partners' | 'about';

export function TabNavigation() {
  const [activeTab, setActiveTab] = useState<TabType>('market');

  const tabs = [
    { id: 'market',   label: 'السوق',    icon: ShoppingBag, color: 'text-green-400' },
    { id: 'seller',   label: 'بائع',     icon: () => <span className="text-lg">🌾</span>, color: 'text-green-400' },
    { id: 'partners', label: 'الشركاء',  icon: () => <span className="text-lg">🤝</span>, color: 'text-yellow-400' },
    { id: 'about',    label: 'من نحن',   icon: () => <span className="text-lg">👤</span>, color: 'text-orange-400' },
  ] as const;

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white">
      <main className="flex-1 pb-24">
        {activeTab === 'market'   && <Marketplace />}
        {activeTab === 'seller'   && <SellerRegister />}
        {activeTab === 'partners' && <PartnersPage />}
        {activeTab === 'about'    && <AboutUs />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-md border-t border-gray-800 px-2 py-2 z-50">
        <div className="flex items-center justify-around gap-1">
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
