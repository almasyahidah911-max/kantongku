import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../common/Logo';
import { UserRole } from '../../types';
import {
  X,
  GraduationCap,
  HeartHandshake,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  Mail,
  Lock,
  User,
  School,
  ChevronLeft,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: 'login' | 'register' | 'onboarding' | 'splash';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialView = 'login',
}) => {
  const { currentUser, loginAsDemo, login, register, logout } = useApp();
  const [view, setView] = useState<'splash' | 'onboarding' | 'login' | 'register' | 'forgot_password'>(initialView);
  const [onboardingStep, setOnboardingStep] = useState(0);

  // Form states
  const [role, setRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [campus, setCampus] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Silakan isi email dan password.');
      return;
    }
    login(email, role, name || (role === 'student' ? 'Pelajar KantongKu' : 'Orang Tua Pendamping'));
    onClose();
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setErrorMessage('Semua bidang wajib diisi.');
      return;
    }
    register(name, email, role, campus);
    onClose();
  };

  const handleDemoLogin = (r: UserRole) => {
    loginAsDemo(r);
    onClose();
  };

  const onboardingSlides = [
    {
      title: 'Kelola Uang Saku dengan Cerdas',
      desc: 'Atur pemasukan, catat setiap jajan dan transportasi, serta tetapkan batas anggaran mingguan atau bulanan secara mudah.',
      icon: GraduationCap,
      color: 'bg-[#EBF4EE] text-[#2D5A43]',
    },
    {
      title: 'Evaluasi Keuangan Otomatis',
      desc: 'Dapatkan status evaluasi HEMAT, TERATUR, atau MELEBIHI ANGGARAN di setiap akhir periode plus saran praktis.',
      icon: Sparkles,
      color: 'bg-[#FFF9DB] text-[#B07D14]',
    },
    {
      title: 'Terhubung dengan Orang Tua',
      desc: 'Hubungkan akun dengan orang tua untuk transparansi, pendampingan bijak, dan pencatatan uang saku tanpa ribet.',
      icon: HeartHandshake,
      color: 'bg-[#F3E8FF] text-[#6B21A8]',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#E9ECEF] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-[#F1F3F5] text-[#495057] transition-colors"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* View 1: Splash Screen */}
        {view === 'splash' && (
          <div className="p-8 text-center flex flex-col items-center justify-center min-h-[460px] bg-gradient-to-b from-[#F7F5EC] via-white to-[#EBF4EE]">
            <Logo size="xl" showText={false} className="mb-4" />
            <h1 className="text-3xl font-extrabold text-[#1F4130] tracking-tight">
              Kantong<span className="text-[#4E876A]">Ku</span>
            </h1>
            <p className="text-sm font-semibold text-[#52796F] mt-1 mb-6">
              "Kelola Uangmu, Atur Masa Depanmu!"
            </p>
            <p className="text-xs text-[#6C757D] max-w-xs mb-8">
              Aplikasi pengelolaan uang saku pintar untuk pelajar & mahasiswa dengan pendampingan orang tua.
            </p>

            <div className="w-full space-y-2.5">
              <button
                onClick={() => setView('onboarding')}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#2D5A43] hover:bg-[#234835] text-white font-bold text-sm shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
              >
                <span>Mulai Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView('login')}
                className="w-full py-3 px-6 rounded-2xl border border-[#D5E1D9] text-[#2D5A43] hover:bg-[#F7F5EC] font-semibold text-xs transition-colors"
              >
                Sudah punya akun? Masuk
              </button>
            </div>
          </div>
        )}

        {/* View 2: Onboarding */}
        {view === 'onboarding' && (
          <div className="p-8 flex flex-col justify-between min-h-[480px]">
            <div>
              <div className="flex items-center justify-between mb-6">
                <Logo size="sm" showText={true} />
                <span className="text-xs font-bold text-[#52796F]">
                  Langkah {onboardingStep + 1} dari 3
                </span>
              </div>

              {/* Slide Content */}
              <div className="text-center py-6">
                <div
                  className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-6 shadow-sm ${onboardingSlides[onboardingStep].color}`}
                >
                  {React.createElement(onboardingSlides[onboardingStep].icon, {
                    className: 'w-10 h-10',
                  })}
                </div>
                <h2 className="text-xl font-extrabold text-[#1F4130] mb-2.5">
                  {onboardingSlides[onboardingStep].title}
                </h2>
                <p className="text-xs text-[#6C757D] leading-relaxed max-w-xs mx-auto">
                  {onboardingSlides[onboardingStep].desc}
                </p>
              </div>

              {/* Dots Indicator */}
              <div className="flex justify-center gap-2 my-4">
                {onboardingSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setOnboardingStep(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === onboardingStep
                        ? 'w-7 bg-[#2D5A43]'
                        : 'w-2 bg-[#D9D9D9]'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-4">
              {onboardingStep < 2 ? (
                <button
                  onClick={() => setOnboardingStep((s) => s + 1)}
                  className="w-full py-3.5 rounded-2xl bg-[#2D5A43] text-white font-bold text-sm shadow-sm hover:bg-[#234835] transition-all flex items-center justify-center gap-2"
                >
                  <span>Lanjutkan</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setView('login')}
                  className="w-full py-3.5 rounded-2xl bg-[#2D5A43] text-white font-bold text-sm shadow-sm hover:bg-[#234835] transition-all"
                >
                  Mulai Gunakan KantongKu
                </button>
              )}
              <button
                onClick={() => setView('login')}
                className="w-full py-2 text-xs text-[#6C757D] hover:text-[#1F4130] font-medium"
              >
                Lewati Pengenalan
              </button>
            </div>
          </div>
        )}

        {/* View 3: Login */}
        {view === 'login' && (
          <div className="p-6 sm:p-8 overflow-y-auto">
            {/* Header */}
            <div className="text-center mb-5">
              <Logo size="md" showText={true} className="justify-center mb-2" />
              <h2 className="text-xl font-bold text-[#1F4130]">Selamat Datang Kembali</h2>
              <p className="text-xs text-[#6C757D] mt-0.5">
                Kelola uang sakumu dengan lebih teratur dan bijak
              </p>
            </div>

            {/* Quick Demo Accounts Banner */}
            <div className="p-3.5 mb-5 rounded-2xl bg-gradient-to-br from-[#F7F5EC] to-[#EBF4EE] border border-[#D5E1D9]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-[#2D5A43] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#F4C430]" />
                  Akses Cepat Mode Demonstrasi:
                </span>
                <span className="text-[9px] font-extrabold uppercase bg-[#2D5A43] text-white px-1.5 py-0.5 rounded-xs">
                  DEMO
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('student')}
                  className="py-2 px-2.5 rounded-xl bg-white border border-[#CDE3D5] text-left hover:border-[#2D5A43] hover:shadow-xs transition-all"
                >
                  <p className="text-[11px] font-bold text-[#1F4130]">Amelia</p>
                  <p className="text-[9px] text-[#52796F]">Pelajar / Mahasiswa</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('parent')}
                  className="py-2 px-2.5 rounded-xl bg-white border border-[#CDE3D5] text-left hover:border-[#2D5A43] hover:shadow-xs transition-all"
                >
                  <p className="text-[11px] font-bold text-[#1F4130]">Bunda Amelia</p>
                  <p className="text-[9px] text-[#52796F]">Orang Tua Pendamping</p>
                </button>
              </div>
            </div>

            {/* Role Selector */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-[#1F4130] mb-1.5">
                Pilih Jenis Akun
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    role === 'student'
                      ? 'border-[#2D5A43] bg-[#EBF4EE] text-[#2D5A43]'
                      : 'border-[#E9ECEF] text-[#6C757D] hover:bg-[#F8F9FA]'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Pelajar/Mahasiswa</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('parent')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    role === 'parent'
                      ? 'border-[#2D5A43] bg-[#EBF4EE] text-[#2D5A43]'
                      : 'border-[#E9ECEF] text-[#6C757D] hover:bg-[#F8F9FA]'
                  }`}
                >
                  <HeartHandshake className="w-4 h-4" />
                  <span>Orang Tua</span>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-2.5 mb-3 rounded-xl bg-[#FEE2E2] text-[#991B1B] text-xs font-medium">
                {errorMessage}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#495057] mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#ADB5BD] absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#CED4DA] focus:border-[#2D5A43] focus:ring-1 focus:ring-[#2D5A43] text-xs transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-[#495057]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setView('forgot_password')}
                    className="text-[11px] font-semibold text-[#52796F] hover:underline"
                  >
                    Lupa Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#ADB5BD] absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#CED4DA] focus:border-[#2D5A43] focus:ring-1 focus:ring-[#2D5A43] text-xs transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 rounded-xl bg-[#2D5A43] hover:bg-[#234835] text-white font-bold text-xs shadow-sm transition-all"
              >
                Masuk ke KantongKu
              </button>
            </form>

            {/* Switch to Register */}
            <div className="mt-5 text-center pt-3 border-t border-[#F1F3F5]">
              <p className="text-xs text-[#6C757D]">
                Belum punya akun?{' '}
                <button
                  onClick={() => {
                    setErrorMessage('');
                    setView('register');
                  }}
                  className="font-bold text-[#2D5A43] hover:underline"
                >
                  Daftar Sekarang
                </button>
              </p>
            </div>
          </div>
        )}

        {/* View 4: Register */}
        {view === 'register' && (
          <div className="p-6 sm:p-8 overflow-y-auto">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-[#1F4130]">Buat Akun Baru</h2>
              <p className="text-xs text-[#6C757D] mt-0.5">
                Mulai kelola uang saku dan bangun masa depanmu
              </p>
            </div>

            {/* Role Selection */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-[#1F4130] mb-1.5">
                Pilih Jenis Akun
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                    role === 'student'
                      ? 'border-[#2D5A43] bg-[#EBF4EE] text-[#2D5A43]'
                      : 'border-[#E9ECEF] text-[#6C757D] hover:bg-[#F8F9FA]'
                  }`}
                >
                  <GraduationCap className="w-5 h-5 mb-1" />
                  <span className="text-xs font-bold">Pelajar / Mahasiswa</span>
                  <span className="text-[10px] text-[#52796F]">Kelola uang saku</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('parent')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                    role === 'parent'
                      ? 'border-[#2D5A43] bg-[#EBF4EE] text-[#2D5A43]'
                      : 'border-[#E9ECEF] text-[#6C757D] hover:bg-[#F8F9FA]'
                  }`}
                >
                  <HeartHandshake className="w-5 h-5 mb-1" />
                  <span className="text-xs font-bold">Orang Tua</span>
                  <span className="text-[10px] text-[#52796F]">Dampingi & pantau</span>
                </button>
              </div>
            </div>

            {/* Error */}
            {errorMessage && (
              <div className="p-2.5 mb-3 rounded-xl bg-[#FEE2E2] text-[#991B1B] text-xs font-medium">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#495057] mb-1">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#ADB5BD] absolute left-3 top-3" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#CED4DA] focus:border-[#2D5A43] text-xs transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#495057] mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#ADB5BD] absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#CED4DA] focus:border-[#2D5A43] text-xs transition-colors"
                  />
                </div>
              </div>

              {role === 'student' && (
                <div>
                  <label className="block text-xs font-medium text-[#495057] mb-1">
                    Sekolah / Universitas (Opsional)
                  </label>
                  <div className="relative">
                    <School className="w-4 h-4 text-[#ADB5BD] absolute left-3 top-3" />
                    <input
                      type="text"
                      value={campus}
                      onChange={(e) => setCampus(e.target.value)}
                      placeholder="Contoh: SMAN 1 Jakarta / UI"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#CED4DA] focus:border-[#2D5A43] text-xs transition-colors"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-[#495057] mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#ADB5BD] absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Buat password aman"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#CED4DA] focus:border-[#2D5A43] text-xs transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-3 py-3 rounded-xl bg-[#2D5A43] hover:bg-[#234835] text-white font-bold text-xs shadow-sm transition-all"
              >
                Daftar Akun
              </button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-xs text-[#6C757D]">
                Sudah punya akun?{' '}
                <button
                  onClick={() => {
                    setErrorMessage('');
                    setView('login');
                  }}
                  className="font-bold text-[#2D5A43] hover:underline"
                >
                  Masuk
                </button>
              </p>
            </div>
          </div>
        )}

        {/* View 5: Forgot Password */}
        {view === 'forgot_password' && (
          <div className="p-6 sm:p-8">
            <button
              onClick={() => setView('login')}
              className="flex items-center gap-1 text-xs font-semibold text-[#52796F] hover:text-[#1F4130] mb-4"
            >
              <ChevronLeft className="w-4 h-4" />
              Kembali ke Login
            </button>

            <h2 className="text-xl font-bold text-[#1F4130] mb-1">Reset Password</h2>
            <p className="text-xs text-[#6C757D] mb-5">
              Masukkan email yang terdaftar untuk menerima tautan pemulihan kata sandi.
            </p>

            {forgotSuccess ? (
              <div className="p-4 rounded-2xl bg-[#EBF4EE] border border-[#CDE3D5] text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-[#2D5A43] mx-auto" />
                <p className="text-xs font-bold text-[#1F4130]">Tautan Terkirim!</p>
                <p className="text-[11px] text-[#52796F]">
                  Instruksi pemulihan telah dikirimkan ke email Anda. Silakan periksa kotak masuk atau spam.
                </p>
                <button
                  onClick={() => {
                    setForgotSuccess(false);
                    setView('login');
                  }}
                  className="mt-3 w-full py-2.5 rounded-xl bg-[#2D5A43] text-white text-xs font-bold"
                >
                  Kembali ke Halaman Masuk
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email) setForgotSuccess(true);
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-xs font-medium text-[#495057] mb-1">
                    Email Terdaftar
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CED4DA] focus:border-[#2D5A43] text-xs transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#2D5A43] hover:bg-[#234835] text-white font-bold text-xs shadow-sm transition-all"
                >
                  Kirim Tautan Pemulihan
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
