// src/components/common/TabNavigation.tsx
import { useState } from 'react';
import { LayoutDashboard, ArrowLeftRight, ShieldAlert, Cpu, ShieldCheck } from 'lucide-react';
import { DashboardView } from '../dashboard/DashboardView';
import { TradingView } from '../trading/TradingView';
import { SecurityView } from '../wallet/SecurityView';
import { MobileMining } from '../mining/MobileMining';
import { AdminDashboard } from '../admin/AdminDashboard';

type TabType = 'dashboard' | 'trading' | 'security' | 'mining' | 'admin';

export function TabNavigation() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white">
      {/* المحتوى المتغير بناءً على التبويب النشط */}
      <main className="flex-1 pb-24">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'trading'   && <TradingView />}
        {activeTab === 'security'  && <SecurityView />}
        {activeTab === 'mining'    && <MobileMining />}
        {activeTab === 'admin'     && <AdminDashboard />}
      </main>

      {/* شريط التنقل السفلي المثبت - Mobile First */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-md border-t border-gray-800 px-2 py-2 z-50">
        <div className="max-w-lg mx-auto flex justify-around items-center">
          
          <button onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-1 p-2 text-xs font-medium transition-colors ${
              activeTab === 'dashboard' ? 'text-yellow-400' : 'text-gray-400 hover:text-gray-200'
            }`}>
            <LayoutDashboard className="w-5 h-5" />
            <span>الرئيسية</span>
          </button>

          <button onClick={() => setActiveTab('trading')}
            className={`flex flex-col items-center gap-1 p-2 text-xs font-medium transition-colors ${
              activeTab === 'trading' ? 'text-yellow-400' : 'text-gray-400 hover:text-gray-200'
            }`}>
            <ArrowLeftRight className="w-5 h-5" />
            <span>التداول</span>
          </button>

          <button onClick={() => setActiveTab('mining')}
            className={`flex flex-col items-center gap-1 p-2 text-xs font-medium transition-colors ${
              activeTab === 'mining' ? 'text-yellow-400' : 'text-gray-400 hover:text-gray-200'
            }`}>
            <Cpu className="w-5 h-5" />
            <span>التعدين</span>
          </button>

          <button onClick={() => setActiveTab('security')}
            className={`flex flex-col items-center gap-1 p-2 text-xs font-medium transition-colors ${
              activeTab === 'security' ? 'text-yellow-400' : 'text-gray-400 hover:text-gray-200'
            }`}>
            <ShieldAlert className="w-5 h-5" />
            <span>الأمان</span>
          </button>

          {/* تبويب الإدارة - يفضل برمجته لاحقاً ليظهر فقط عند شروط معينة */}
          <button onClick={() => setActiveTab('admin')}
            className={`flex flex-col items-center gap-1 p-2 text-xs font-medium transition-colors ${
              activeTab === 'admin' ? 'text-orange-400' : 'text-gray-500 hover:text-gray-300'
            }`}>
            <ShieldCheck className="w-5 h-5" />
            <span>الإدارة</span>
          </button>

        </div>
      </nav>
    </div>
  );
}
