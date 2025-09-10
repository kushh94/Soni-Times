import { Settings, Shield, HelpCircle, LogOut, ChevronRight } from "lucide-react";
import { APP_INFO, CONTACT_INFO } from "../utils/constants";

interface CustomerProfileProps {
  onAdminLogin: () => void;
  onContactSupport: () => void;
}

export function CustomerProfile({ onAdminLogin, onContactSupport }: CustomerProfileProps) {
  const menuItems = [
   
    
    {
      icon: HelpCircle,
      title: "Help & Support",
      subtitle: "Get help and contact us",
      onClick: onContactSupport
    },
    {
      icon: LogOut,
      title: "Admin Login",
      subtitle: "Access admin dashboard",
      onClick: onAdminLogin
    }
  ];

  return (
    <div className="flex-1 bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-100">
        <h1 className="text-2xl text-gray-900 mb-1">Profile</h1>
        <p className="text-sm text-gray-500">Manage your account and preferences</p>
      </div>

      {/* Profile Content */}
      <div className="p-6 pb-24">
        {/* User Info */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center mr-4">
              <span className="text-white text-xl">ST</span>
            </div>
            <div>
              <h3 className="text-lg text-gray-900">{CONTACT_INFO.STORE_NAME} Customer</h3>
             
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-3">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className="w-full bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                  <item.icon size={18} className="text-gray-600" />
                </div>
                <div className="text-left">
                  <h4 className="text-gray-900">{item.title}</h4>
                  <p className="text-xs text-gray-500">{item.subtitle}</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </button>
          ))}
        </div>

        {/* App Info */}
        <div className="mt-8 text-center text-xs text-gray-400">
          {APP_INFO.NAME} v{APP_INFO.VERSION}
        </div>
      </div>
    </div>
  );
}