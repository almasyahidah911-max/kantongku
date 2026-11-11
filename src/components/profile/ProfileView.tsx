import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../common/Logo';
import {
  User,
  GraduationCap,
  HeartHandshake,
  ShieldCheck,
  RefreshCw,
  RotateCcw,
  Sparkles,
  HelpCircle,
  LogOut,
  ChevronRight,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface ProfileViewProps {
  onOpenOnboarding: () => void;
  onOpenSplash: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  onOpenOnboarding,
  onOpenSplash,
}) => {
  const {
    currentUser,
    activeRole,
    loginAsDemo,
    resetDemoData,
    logout,
    parentLink,
  } = useApp();

  const [resetFeedback, setResetFeedback] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleResetData = () => {
    resetDemoData();
    setResetFeedback(true);
    setTimeout(() => setResetFeedback(false), 3000);
  };

  const handleSwitchDemoRole = () => {
    if (activeRole === 'student') {
      loginAsDemo('parent');
    } else {
      loginAsDemo('student');
    }
  };

  const faqs = [
    {
      q: 'Apa itu evaluasi otomatis HEMAT, TERATUR, dan MELEBIHI ANGGARAN?',
      a: 'KantongKu menghitung rasio pengeluaran terhadap total anggaran. Jika pengeluaran ≤ 80%, statusmu HEMAT. Jika 80%–100%, statusmu TERATUR. Jika > 100%, statusmu MELEBIHI ANGGARAN beserta saran konkret perbaikan.',
    },
    {
      q: 'Bagaimana rumus rekomendasi pengeluaran harian dihitung?',
      a: 'Rumus: Batas Harian = Sisa Anggaran ÷ Jumlah Hari Tersisa dalam periode berjalan. Sistem langsung memperbarui batas ini setiap kali kamu mencatat transaksi baru.',
    },
    {
      q: 'Apakah tabungan di KantongKu adalah uang di bank?',
      a: 'Tidak. Tabungan di KantongKu merupakan pencatatan saldo virtual untuk membantu pelajar dan mahasiswa melatih kedisiplinan serta melihat progres impian secara visual.',
    },
    {
      q: 'Bagaimana privasi anak terlindungi saat terhubung dengan orang tua?',
      a: 'Koneksi membutuhkan persetujuan kedua pihak dengan kode unik. Anak memiliki kendali privasi penuh untuk memilih rincian apa yang dibagikan dan dapat memutuskan koneksi sewaktu-waktu.',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div>
        <h1 className="text-2xl font-extrabold text-[#1F4130] tracking-tight">
          Profil & Pengaturan
        </h1>
        <p className="text-xs text-[#52796F] mt-0.5">
          Kelola akun pengguna, peran pendampingan, dan preferensi aplikasi
        </p>
      </div>

      {resetFeedback && (
        <div className="p-4 rounded-2xl bg-[#EBF4EE] border border-[#2D5A43] text-xs font-bold text-[#1F4130] flex items-center gap-2 shadow-sm animate-slide-up">
          <CheckCircle2 className="w-5 h-5 text-[#2D5A43]" />
          <span>Data demonstrasi berhasil direset ke kondisi awal (Amelia - Uang saku Rp 200.000).</span>
        </div>
      )}

      {/* User Card */}
      <div className="p-6 rounded-3xl bg-white border border-[#E9ECEF] shadow-xs flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
        <div className="relative">
          {currentUser?.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-20 h-20 rounded-full object-cover ring-4 ring-[#84A98C]"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-[#84A98C] text-white flex items-center justify-center font-extrabold text-2xl">
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
          )}
          {currentUser?.isDemo && (
            <span className="absolute -bottom-1 -right-1 px-2 py-0.5 bg-[#F4D06F] text-[#4A3800] text-[9px] font-black rounded-md uppercase tracking-wider shadow-xs">
              DEMO
            </span>
          )}
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-lg font-bold text-[#1F4130]">
              {currentUser?.name || 'Pengguna KantongKu'}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#EBF4EE] text-[#2D5A43] text-[10px] font-black uppercase">
              {currentUser?.role === 'student' ? 'Pelajar / Mahasiswa' : 'Orang Tua'}
            </span>
          </div>
          <p className="text-xs text-[#6C757D] mt-0.5">{currentUser?.email}</p>
          <p className="text-xs text-[#52796F] font-semibold mt-1">
            {currentUser?.gradeOrCampus || 'Mahasiswa S1'}
          </p>
        </div>

        {currentUser?.isDemo && (
          <button
            onClick={handleSwitchDemoRole}
            className="px-4 py-2.5 rounded-2xl bg-[#F7F5EC] border border-[#D5E1D9] hover:bg-[#EBE7D8] text-xs font-bold text-[#1F4130] transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4 text-[#52796F]" />
            <span>
              Ganti ke Akun {activeRole === 'student' ? 'Bunda' : 'Amelia'}
            </span>
          </button>
        )}
      </div>

      {/* Account Settings & Testing Tools */}
      <div className="p-6 rounded-3xl bg-white border border-[#E9ECEF] shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[#1F4130]">
          Pengaturan Aplikasi & Mode Demo
        </h3>

        <div className="space-y-2">
          <button
            onClick={handleResetData}
            className="w-full p-3.5 rounded-2xl bg-[#F8F9FA] hover:bg-[#F1F3F5] text-left flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-3">
              <RotateCcw className="w-5 h-5 text-[#52796F]" />
              <div>
                <span className="text-xs font-bold text-[#1F4130] block">
                  Reset Data Demonstrasi
                </span>
                <span className="text-[11px] text-[#6C757D]">
                  Kembalikan saldo Amelia Rp 200.000, pengeluaran Rp 150.000, dan tabungan Rp 350.000
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#ADB5BD]" />
          </button>

          <button
            onClick={onOpenOnboarding}
            className="w-full p-3.5 rounded-2xl bg-[#F8F9FA] hover:bg-[#F1F3F5] text-left flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-[#2D5A43]" />
              <div>
                <span className="text-xs font-bold text-[#1F4130] block">
                  Buka Panduan Onboarding
                </span>
                <span className="text-[11px] text-[#6C757D]">
                  Lihat 3 langkah perkenalan fitur KantongKu
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#ADB5BD]" />
          </button>

          <button
            onClick={onOpenSplash}
            className="w-full p-3.5 rounded-2xl bg-[#F8F9FA] hover:bg-[#F1F3F5] text-left flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-3">
              <Logo size="sm" showText={false} />
              <div>
                <span className="text-xs font-bold text-[#1F4130] block">
                  Tampilkan Splash Screen
                </span>
                <span className="text-[11px] text-[#6C757D]">
                  Lihat layar pembuka dan slogan aplikasi
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#ADB5BD]" />
          </button>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="p-6 rounded-3xl bg-white border border-[#E9ECEF] shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[#1F4130] flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-[#2D5A43]" />
          <span>Pertanyaan Umum (FAQ)</span>
        </h3>

        <div className="space-y-2">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-[#F1F3F5] overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-3.5 text-left text-xs font-bold text-[#1F4130] bg-[#FAF8F5] hover:bg-[#F1F3F5] flex items-center justify-between transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronRight
                  className={`w-4 h-4 text-[#868E96] transition-transform ${
                    openFaq === idx ? 'rotate-90' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="p-3.5 bg-white text-xs text-[#52796F] leading-relaxed border-t border-[#F1F3F5]">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* About KantongKu Branding */}
      <div className="text-center py-4 space-y-2">
        <Logo size="md" showText={true} showSlogan={true} className="justify-center" />
        <p className="text-[11px] text-[#868E96]">
          KantongKu – Versi 1.0 (Mobile Web Application / PWA Ready)
        </p>
        <p className="text-[10px] text-[#ADB5BD]">
          Dibangun khusus untuk generasi muda yang melek finansial & masa depan gemilang.
        </p>
      </div>
    </div>
  );
};
