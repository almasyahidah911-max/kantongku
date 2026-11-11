import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  QrCode,
  Copy,
  Check,
  Share2,
  ShieldCheck,
  ShieldAlert,
  Unlink,
  Link2,
  Lock,
  Eye,
  Sparkles,
} from 'lucide-react';

export const ParentChildConnection: React.FC = () => {
  const {
    activeRole,
    parentLink,
    currentUser,
    connectParentChild,
    disconnectParentChild,
    updateSharePermissions,
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [parentInputCode, setParentInputCode] = useState('');
  const [connectMessage, setConnectMessage] = useState<{ text: string; error?: boolean } | null>(null);

  const inviteCode = parentLink?.inviteCode || 'KTK-AME-8921';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConnectByParent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentInputCode.trim()) return;
    const success = connectParentChild(parentInputCode);
    if (success) {
      setConnectMessage({ text: 'Berhasil terhubung dengan akun anak!' });
      setParentInputCode('');
    } else {
      setConnectMessage({
        text: 'Kode undangan tidak valid. Gunakan kode KTK-AME-8921.',
        error: true,
      });
    }
  };

  const isConnected = parentLink?.status === 'connected';

  return (
    <div className="space-y-5 animate-fade-in pb-20">
      <div>
        <h1 className="text-2xl font-extrabold text-[#1F4130] tracking-tight">
          {activeRole === 'student' ? 'Hubungkan dengan Orang Tua' : 'Hubungkan Akun Anak'}
        </h1>
        <p className="text-xs text-[#52796F] mt-0.5">
          {activeRole === 'student'
            ? 'Bagikan kode atau QR untuk pendampingan keuangan yang aman & transparan'
            : 'Masukkan kode undangan anak untuk mulai mendampingi pengelolaan uang sakunya'}
        </p>
      </div>

      {/* Connection Status Card */}
      <div
        className={`p-5 rounded-3xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          isConnected
            ? 'bg-[#EBF4EE] border-[#CDE3D5]'
            : 'bg-[#FFF9DB] border-[#FFE066]'
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              isConnected
                ? 'bg-[#2D5A43] text-white shadow-sm'
                : 'bg-[#F4C430] text-[#4A3800]'
            }`}
          >
            {isConnected ? <ShieldCheck className="w-6 h-6" /> : <Link2 className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#1F4130]">
                {isConnected ? 'Akun Terhubung' : 'Belum Terhubung'}
              </h3>
              <span
                className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                  isConnected
                    ? 'bg-[#2D5A43] text-white'
                    : 'bg-[#F4C430] text-[#332400]'
                }`}
              >
                {isConnected ? 'Aktif' : 'Menunggu Koneksi'}
              </span>
            </div>
            <p className="text-xs text-[#52796F] mt-0.5">
              {isConnected
                ? activeRole === 'student'
                  ? `Terhubung dengan pendamping: ${parentLink.parentName}`
                  : `Mendampingi anak: ${parentLink.childName}`
                : 'Kedua belah pihak harus menyetujui koneksi akun'}
            </p>
          </div>
        </div>

        {isConnected && (
          <button
            onClick={disconnectParentChild}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/80 hover:bg-white text-xs font-bold text-[#E63946] border border-[#FFA8A8] transition-colors self-start sm:self-auto"
          >
            <Unlink className="w-3.5 h-3.5" />
            <span>Putuskan Koneksi</span>
          </button>
        )}
      </div>

      {/* Student View: Code & QR Generator */}
      {activeRole === 'student' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Invite Code & QR */}
          <div className="p-6 rounded-3xl bg-white border border-[#E9ECEF] shadow-xs flex flex-col items-center text-center">
            <h3 className="text-sm font-bold text-[#1F4130] mb-1">
              Kode Undangan Unikmu
            </h3>
            <p className="text-xs text-[#6C757D] mb-4">
              Tunjukkan QR Code ini atau salin kode undangan untuk orang tuamu
            </p>

            {/* Generated SVG QR Code */}
            <div className="p-4 rounded-3xl bg-[#FAF8F5] border-2 border-dashed border-[#84A98C] mb-4">
              <svg
                viewBox="0 0 160 160"
                className="w-36 h-36 mx-auto text-[#2D5A43]"
                fill="currentColor"
              >
                {/* QR Finder Top-Left */}
                <rect x="10" y="10" width="40" height="40" rx="6" fill="#2D5A43" />
                <rect x="16" y="16" width="28" height="28" rx="3" fill="#FAF8F5" />
                <rect x="22" y="22" width="16" height="16" rx="2" fill="#2D5A43" />

                {/* QR Finder Top-Right */}
                <rect x="110" y="10" width="40" height="40" rx="6" fill="#2D5A43" />
                <rect x="116" y="16" width="28" height="28" rx="3" fill="#FAF8F5" />
                <rect x="122" y="22" width="16" height="16" rx="2" fill="#2D5A43" />

                {/* QR Finder Bottom-Left */}
                <rect x="10" y="110" width="40" height="40" rx="6" fill="#2D5A43" />
                <rect x="16" y="116" width="28" height="28" rx="3" fill="#FAF8F5" />
                <rect x="22" y="122" width="16" height="16" rx="2" fill="#2D5A43" />

                {/* Simulated Data Matrix Bits */}
                <rect x="60" y="15" width="8" height="8" rx="1.5" />
                <rect x="75" y="15" width="8" height="8" rx="1.5" />
                <rect x="90" y="25" width="8" height="8" rx="1.5" />
                <rect x="60" y="35" width="8" height="8" rx="1.5" />
                <rect x="80" y="40" width="8" height="8" rx="1.5" />
                <rect x="15" y="60" width="8" height="8" rx="1.5" />
                <rect x="30" y="70" width="8" height="8" rx="1.5" />
                <rect x="45" y="60" width="8" height="8" rx="1.5" />
                <rect x="65" y="65" width="30" height="30" rx="4" fill="#84A98C" />
                <rect x="115" y="65" width="8" height="8" rx="1.5" />
                <rect x="135" y="75" width="8" height="8" rx="1.5" />
                <rect x="60" y="115" width="8" height="8" rx="1.5" />
                <rect x="80" y="125" width="8" height="8" rx="1.5" />
                <rect x="100" y="115" width="8" height="8" rx="1.5" />
                <rect x="125" y="125" width="8" height="8" rx="1.5" />
                <rect x="140" y="140" width="8" height="8" rx="1.5" />
              </svg>
            </div>

            {/* Code Box */}
            <div className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#F7F5EC] border border-[#D5E1D9] mb-3">
              <span className="text-base font-black tracking-widest text-[#2D5A43]">
                {inviteCode}
              </span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-[#CED4DA] text-xs font-bold text-[#1F4130] hover:bg-[#EBF4EE] transition-all"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#2D5A43]" />
                    <span>Disalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#52796F]" />
                    <span>Salin Kode</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Privacy & Permissions Config (Requirement E.5) */}
          <div className="p-6 rounded-3xl bg-white border border-[#E9ECEF] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4 text-[#2D5A43]" />
                <h3 className="text-sm font-bold text-[#1F4130]">
                  Kendali Privasi & Data Dibagikan
                </h3>
              </div>
              <p className="text-xs text-[#6C757D] mb-4">
                Kamu memiliki kendali penuh. Pilih informasi keuangan yang ingin kamu izinkan untuk dilihat oleh orang tuamu:
              </p>

              <div className="space-y-3">
                <label className="flex items-start gap-3 p-3 rounded-2xl bg-[#F8F9FA] border border-[#E9ECEF] cursor-pointer hover:bg-[#F1F3F5] transition-colors">
                  <input
                    type="checkbox"
                    checked={parentLink?.permissions.shareBudgetSummary ?? true}
                    onChange={(e) =>
                      parentLink &&
                      updateSharePermissions({
                        ...parentLink.permissions,
                        shareBudgetSummary: e.target.checked,
                      })
                    }
                    className="mt-0.5 rounded text-[#2D5A43] focus:ring-[#2D5A43]"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#1F4130]">
                      Ringkasan Anggaran & Evaluasi
                    </span>
                    <p className="text-[11px] text-[#6C757D]">
                      Memperlihatkan status hemat/teratur dan total sisa uang saku.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-2xl bg-[#F8F9FA] border border-[#E9ECEF] cursor-pointer hover:bg-[#F1F3F5] transition-colors">
                  <input
                    type="checkbox"
                    checked={parentLink?.permissions.shareTransactionDetails ?? true}
                    onChange={(e) =>
                      parentLink &&
                      updateSharePermissions({
                        ...parentLink.permissions,
                        shareTransactionDetails: e.target.checked,
                      })
                    }
                    className="mt-0.5 rounded text-[#2D5A43] focus:ring-[#2D5A43]"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#1F4130]">
                      Rincian Transaksi Pengeluaran
                    </span>
                    <p className="text-[11px] text-[#6C757D]">
                      Kategori pengeluaran (Makan, Transportasi, Kebutuhan Kuliah).
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-2xl bg-[#F8F9FA] border border-[#E9ECEF] cursor-pointer hover:bg-[#F1F3F5] transition-colors">
                  <input
                    type="checkbox"
                    checked={parentLink?.permissions.shareSavingsGoals ?? true}
                    onChange={(e) =>
                      parentLink &&
                      updateSharePermissions({
                        ...parentLink.permissions,
                        shareSavingsGoals: e.target.checked,
                      })
                    }
                    className="mt-0.5 rounded text-[#2D5A43] focus:ring-[#2D5A43]"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#1F4130]">
                      Perkembangan Target Tabungan
                    </span>
                    <p className="text-[11px] text-[#6C757D]">
                      Progres impianmu (misal: Membeli Laptop) untuk apresiasi orang tua.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-[#F1F3F5] text-[11px] text-[#52796F] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#2D5A43] shrink-0" />
              <span>
                KantongKu menjamin kerahasiaan: tidak ada pembagian lokasi atau percakapan pribadi.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Parent View: Input Code to Link Child */}
      {activeRole === 'parent' && (
        <div className="p-6 rounded-3xl bg-white border border-[#E9ECEF] shadow-xs max-w-lg mx-auto">
          <div className="text-center mb-5">
            <Users className="w-10 h-10 text-[#2D5A43] mx-auto mb-2" />
            <h3 className="text-base font-bold text-[#1F4130]">
              Masukkan Kode Undangan Anak
            </h3>
            <p className="text-xs text-[#6C757D] mt-0.5">
              Minta anakmu membuka menu "Hubungkan Orang Tua" di aplikasinya dan salin kodenya ke sini.
            </p>
          </div>

          {connectMessage && (
            <div
              className={`p-3 rounded-2xl mb-4 text-xs font-semibold ${
                connectMessage.error
                  ? 'bg-red-50 text-red-600 border border-red-200'
                  : 'bg-[#EBF4EE] text-[#2D5A43] border border-[#CDE3D5]'
              }`}
            >
              {connectMessage.text}
            </div>
          )}

          <form onSubmit={handleConnectByParent} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#1F4130] mb-1">
                Kode Undangan Anak
              </label>
              <input
                type="text"
                required
                value={parentInputCode}
                onChange={(e) => setParentInputCode(e.target.value.toUpperCase())}
                placeholder="Contoh: KTK-AME-8921"
                className="w-full px-4 py-3 rounded-2xl border border-[#CED4DA] focus:border-[#2D5A43] text-center text-sm font-black tracking-widest text-[#1F4130]"
              />
              <p className="text-[10px] text-[#52796F] mt-1 text-center">
                Tip Demo: Gunakan kode <b>KTK-AME-8921</b> untuk akun Amelia.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#2D5A43] hover:bg-[#234835] text-white font-bold text-xs shadow-md transition-all active:scale-98"
            >
              Hubungkan dan Dampingi Anak
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
