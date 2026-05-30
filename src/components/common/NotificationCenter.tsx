import { Bell, X, Check, AlertCircle, Info } from 'lucide-react';
import { useState } from 'react';

const notifications = [
  {
    id: 1,
    type: 'success' as const,
    title: 'Trade Executed',
    message: 'Your buy order for 1000 XLM was filled at $0.1234',
    time: '2 min ago',
  },
  {
    id: 2,
    type: 'warning' as const,
    title: 'Price Alert',
    message: 'BTC reached your target price of $42,000',
    time: '15 min ago',
  },
  {
    id: 3,
    type: 'info' as const,
    title: 'New Feature',
    message: 'Check out our new portfolio analytics dashboard',
    time: '1 hour ago',
  },
];

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState(notifications);

  const removeNotification = (id: number) => {
    setItems(items.filter(n => n.id !== id));
  };

  const iconMap = {
    success: Check,
    warning: AlertCircle,
    info: Info,
  };

  const colorMap = {
    success: 'text-green-400 bg-green-500/10',
    warning: 'text-yellow-400 bg-yellow-500/10',
    info: 'text-blue-400 bg-blue-500/10',
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all"
      >
        <Bell className="w-5 h-5 text-white" />
        {items.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
            {items.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-80 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-50">
          <div className="p-4 border-b border-gray-700">
            <h3 className="font-bold text-white">Notifications</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {items.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                No new notifications
              </div>
            ) : (
              items.map((notif) => {
                const Icon = iconMap[notif.type];
                return (
                  <div
                    key={notif.id}
                    className="p-4 border-b border-gray-700 hover:bg-gray-700/50 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${colorMap[notif.type]}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-white text-sm mb-1">{notif.title}</h4>
                        <p className="text-xs text-gray-400 mb-2">{notif.message}</p>
                        <span className="text-xs text-gray-500">{notif.time}</span>
                      </div>
                      <button
                        onClick={() => removeNotification(notif.id)}
                        className="text-gray-400 hover:text-white transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
