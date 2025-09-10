import { Home, User, Settings } from "lucide-react";

interface BottomNavigationProps {
  activeTab: 'home' | 'profile' | 'admin';
  onTabChange: (tab: 'home' | 'profile' | 'admin') => void;
  isAdmin?: boolean;
}

export function BottomNavigation({ activeTab, onTabChange, isAdmin = false }: BottomNavigationProps) {
  if (isAdmin) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 safe-area-pb">
        <div className="flex justify-center">
          <button
            onClick={() => onTabChange('admin')}
            className={`flex flex-col items-center px-6 py-2 rounded-xl transition-colors ${
              activeTab === 'admin' 
                ? 'text-navy-600 bg-navy-50' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Settings size={24} />
            <span className="text-xs mt-1">Dashboard</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 safe-area-pb">
      <div className="flex justify-around">
        <button
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center px-6 py-2 rounded-xl transition-colors ${
            activeTab === 'home' 
              ? 'text-gray-900 bg-gray-100' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Home size={24} />
          <span className="text-xs mt-1">Home</span>
        </button>
        
        <button
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center px-6 py-2 rounded-xl transition-colors ${
            activeTab === 'profile' 
              ? 'text-gray-900 bg-gray-100' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <User size={24} />
          <span className="text-xs mt-1">Profile</span>
        </button>
      </div>
    </div>
  );
}