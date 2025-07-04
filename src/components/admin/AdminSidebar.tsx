
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileVideo, 
  Users, 
  Settings, 
  CreditCard, 
  Key, 
  Server, 
  Gift,
  Wallet,
  Shield,
  Activity,
  User
} from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Content', href: '/admin/content', icon: FileVideo },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Plans', href: '/admin/plans', icon: CreditCard },
    { name: 'Guest Passes', href: '/admin/guest-passes', icon: Gift },
    { name: 'Payment Gateways', href: '/admin/payment-gateways', icon: Wallet },
    { name: 'Content Moderation', href: '/admin/moderation', icon: Shield },
    { name: 'API Management', href: '/admin/api-management', icon: Activity },
    { name: 'API Keys', href: '/admin/api-keys', icon: Key },
    { name: 'System', href: '/admin/system', icon: Server },
    { name: 'Profile', href: '/admin/profile', icon: User },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg border-r border-gray-200">
      <div className="flex flex-col h-full pt-20">
        <div className="flex-1 px-4 py-4">
          <nav className="space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-red-100 text-red-600'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
