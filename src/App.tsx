import { Zap, Settings } from 'lucide-react';
import { TabNavigation } from './components/common/TabNavigation';
import { NotificationCenter } from './components/common/NotificationCenter';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg animate-pulse-glow">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Zenith Trade Hub</h1>
                <p className="text-xs text-gray-400">منصة تجارة زراعية</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
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

      <TabNavigation />

      <footer className="border-t border-gray-800 bg-gray-900/50 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              © 2026 Zenith Trade Hub · تونس · المغرب · الجزائر  🌍
            </p>
            <div className="flex items-center gap-6">
              <a href="https://github.com/marwahamdi301-png/Zenith-Empire-Platform" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-primary transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
