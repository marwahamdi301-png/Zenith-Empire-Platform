import { Bell } from 'lucide-react';
import { useState } from 'react';

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all"
      >
        <Bell className="w-5 h-5 text-white" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-80 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-50">
          <div className="p-4 border-b border-gray-700">
            <h3 className="font-bold text-white">الإشعارات</h3>
          </div>
          <div className="p-8 text-center text-gray-400 text-sm">
            لا توجد إشعارات جديدة
          </div>
        </div>
      )}
    </div>
  );
}
