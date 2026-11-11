import React from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../common/Logo';
import {
  Bell,
  Sparkles,
  RefreshCw,
  UserCheck,
  Users,
  LogOut,
  HelpCircle,
} from 'lucide-react';

interface NavbarProps {
  onOpenNotifications: () => void;
  onOpenAiAssistant: () => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenNotifications,
  onOpenAiAssistant,
  onOpenAuth,
}) => {
  const {
    currentUser,
    activeRole,
    loginAsDemo,
    logout,
    unreadNotificationsCount,
    parentLink,
  } = useApp();

  const handleToggleDemoRole = () => {
    if (activeRole === 'student') {
      loginAsDemo('parent');
    } else {
      loginAsDemo('student');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EBEBEB] px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Slogan */}
        <div className="flex items-center gap-3">
          <Logo size="md" showText={true} showSlogan={false} />
          {/* Subtle Connection Status pill */}
          {parentLink?.status === 'connected' && (
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EBF4EE] border border-[#CDE3D5] text-[11px] font-semibold text-[#2D5A43]">
              <span className="w-2 h-2 rounded-full bg-[#3FB950] animate-pulse" />
              <span>
                {activeRole === 'student'
                  ? `Terhubung: ${parentLink.parentName}`
                  : `Mendampingi: ${parentLink.childName}`}
              </span>
            </div>
          )}
        </div>

        {/* Right: Actions, Demo Switcher, Notifications, User Badge */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Assistant Quick Pill */}
          <button
            onClick={onOpenAiAssistant}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#2D5A43] to-[#467A5E] text-white text-xs font-semibold shadow-sm shadow-[#2D5A43]/20 hover:brightness-110 active:scale-95 transition-all"
            title="Buka KantongKu AI Assistant"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FFE066] animate-spin" style={{ animationDuration: '6s' }} />
            <span className="hidden sm:inline">KantongKu</span> AI
          </button>

          {/* Quick Demo Role Switcher Toggle */}
          {currentUser?.isDemo && (
            <button
              onClick={handleToggleDemoRole}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full border border-[#D5E1D9] bg-[#F7F5EC] hover:bg-[#EBE7D8] text-[11px] sm:text-xs font-semibold text-[#1F4130] transition-colors active:scale-95"
              title="Beralih peran demo untuk menguji akun anak vs akun orang tua"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#52796F]" />
              <span className="hidden md:inline">Beralih ke:</span>
              <span className="font-bold text-[#2D5A43]">
                {activeRole === 'student' ? 'Orang Tua (Bunda)' : 'Pelajar (Amelia)'}
              </span>
            </button>
          )}

          {/* Notification Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-full text-[#495057] hover:text-[#1F4130] hover:bg-[#F1F3F5] transition-colors focus:outline-none"
            title="Notifikasi"
            aria-label="Lihat Notifikasi"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-[#E63946] rounded-full ring-2 ring-white">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Active User Avatar / Login */}
          {currentUser ? (
            <div className="flex items-center gap-2 pl-1 border-l border-[#E9ECEF]">
              <div
                className="flex items-center gap-2 cursor-pointer p-1 rounded-xl hover:bg-[#F8F9FA] transition-colors"
                onClick={onOpenAuth}
                title="Kelola Akun"
              >
                <div className="relative">
                  {currentUser.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-[#84A98C]"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#84A98C] text-white flex items-center justify-center font-bold text-xs">
                      {currentUser.name.charAt(0)}
                    </div>
                  )}
                  {currentUser.isDemo && (
                    <span className="absolute -bottom-1 -right-1 px-1 py-0.2 bg-[#F4D06F] text-[#4A3800] text-[8px] font-extrabold rounded-xs uppercase tracking-tighter shadow-xs">
                      DEMO
                    </span>
                  )}
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-bold text-[#1F4130] leading-tight">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-[#52796F] font-medium">
                    {currentUser.role === 'student' ? 'Pelajar/Mahasiswa' : 'Orang Tua'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-1.5 rounded-xl bg-[#2D5A43] text-white text-xs font-semibold hover:bg-[#234835] transition-colors"
            >
              Masuk
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
