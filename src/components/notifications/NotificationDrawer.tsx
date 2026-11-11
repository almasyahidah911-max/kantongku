import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  X,
  CheckCheck,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction?: (actionUrl?: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onSelectAction,
}) => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    unreadNotificationsCount,
  } = useApp();

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-[#B07D14]" />;
      case 'alert':
        return <AlertCircle className="w-5 h-5 text-[#E63946]" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-[#2D5A43]" />;
      default:
        return <Info className="w-5 h-5 text-[#52796F]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      <div className="w-full max-w-sm sm:max-w-md h-full bg-white shadow-2xl flex flex-col overflow-hidden animate-slide-left">
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-[#E9ECEF] bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bell className="w-5 h-5 text-[#2D5A43]" />
              {unreadNotificationsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-[#E63946] absolute top-0 right-0" />
              )}
            </div>
            <h3 className="text-sm font-bold text-[#1F4130]">
              Notifikasi & Pengingat
            </h3>
            {unreadNotificationsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#EBF4EE] text-[#2D5A43] text-[10px] font-extrabold">
                {unreadNotificationsCount} Baru
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {unreadNotificationsCount > 0 && (
              <button
                onClick={markAllNotificationsRead}
                className="p-1.5 rounded-lg text-xs text-[#52796F] hover:text-[#1F4130] font-semibold flex items-center gap-1"
                title="Tandai semua dibaca"
              >
                <CheckCheck className="w-4 h-4" />
                <span className="text-[10px]">Semua Dibaca</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[#6C757D] hover:bg-[#E9ECEF]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-2.5 bg-[#FCFBF8]">
          {notifications.length === 0 ? (
            <div className="text-center py-16 text-[#868E96]">
              <Bell className="w-12 h-12 mx-auto text-[#CED4DA] mb-2" />
              <p className="text-xs font-semibold">Tidak ada notifikasi baru</p>
              <p className="text-[11px] mt-0.5">Semua catatan keuanganmu dalam kondisi aman.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  markNotificationRead(notif.id);
                  if (notif.actionUrl && onSelectAction) {
                    onSelectAction(notif.actionUrl);
                    onClose();
                  }
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  notif.read
                    ? 'bg-white border-[#E9ECEF] opacity-75'
                    : 'bg-[#FAF8F5] border-[#84A98C] shadow-2xs'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">{getIcon(notif.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4
                        className={`text-xs font-bold truncate ${
                          notif.read ? 'text-[#495057]' : 'text-[#1F4130]'
                        }`}
                      >
                        {notif.title}
                      </h4>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-[#2D5A43] shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-[#6C757D] mt-1 leading-relaxed">
                      {notif.message}
                    </p>
                    <span className="text-[9px] text-[#ADB5BD] mt-1.5 block">
                      {new Date(notif.timestamp).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
