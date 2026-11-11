import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
  ReceiptText,
  PieChart,
  PiggyBank,
  User,
  Users,
  FileSpreadsheet,
  MessageSquare,
} from 'lucide-react';

export type NavTab =
  | 'home'
  | 'transactions'
  | 'budget'
  | 'savings'
  | 'child_account'
  | 'reports'
  | 'messages'
  | 'profile';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const { activeRole, messages } = useApp();

  // Child / Student navigation
  const studentNavItems: NavItem[] = [
    { id: 'home', label: 'Beranda', icon: Home },
    { id: 'transactions', label: 'Transaksi', icon: ReceiptText },
    { id: 'budget', label: 'Anggaran', icon: PieChart },
    { id: 'savings', label: 'Tabungan', icon: PiggyBank },
    { id: 'profile', label: 'Profil', icon: User },
  ];

  // Parent navigation
  const parentNavItems: NavItem[] = [
    { id: 'home', label: 'Beranda', icon: Home },
    { id: 'child_account', label: 'Akun Anak', icon: Users },
    { id: 'reports', label: 'Laporan', icon: FileSpreadsheet },
    {
      id: 'messages',
      label: 'Pesan',
      icon: MessageSquare,
      badge: messages.length > 0 ? messages.length : undefined,
    },
    { id: 'profile', label: 'Profil', icon: User },
  ];

  const items = activeRole === 'student' ? studentNavItems : parentNavItems;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EAEAEA] px-2 py-1 shadow-lg sm:hidden safe-area-bottom"
      aria-label="Navigasi Bawah"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl relative transition-all duration-200 ${
                isActive
                  ? 'text-[#2D5A43] font-bold scale-105'
                  : 'text-[#6C757D] font-medium hover:text-[#2D5A43]'
              }`}
            >
              {/* Active pill background */}
              {isActive && (
                <span className="absolute inset-0 bg-[#EBF4EE] rounded-2xl -z-10" />
              )}
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'stroke-[2.5px]' : 'stroke-2'
                  }`}
                />
                {item.badge && (
                  <span className="absolute -top-1 -right-2.5 px-1 min-w-[14px] h-[14px] rounded-full bg-[#2D5A43] text-white text-[9px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 leading-none">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
