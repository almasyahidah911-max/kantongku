import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TransactionModal } from '../transactions/TransactionModal';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  PiggyBank,
  TrendingDown,
  Sparkles,
  Plus,
  Calendar,
  ChevronRight,
  Users,
  Award,
  AlertCircle,
  HelpCircle,
  Clock,
  PieChart,
} from 'lucide-react';

interface StudentDashboardProps {
  onNavigateTab: (tab: any) => void;
  onOpenAiAssistant: () => void;
  onOpenParentLink: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onNavigateTab,
  onOpenAiAssistant,
  onOpenParentLink,
}) => {
  const {
    currentUser,
    budget,
    updateBudget,
    transactions,
    addTransaction,
    totalIncome,
    totalExpense,
    currentBalance,
    remainingBudget,
    usagePercentage,
    evaluation,
    dailyRecommendation,
    daysRemaining,
    totalSavings,
    parentLink,
  } = useApp();

  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [selectedPeriodView, setSelectedPeriodView] = useState<'weekly' | 'monthly'>(budget.period);

  const handlePeriodSwitch = (period: 'weekly' | 'monthly') => {
    setSelectedPeriodView(period);
    updateBudget({ period });
  };

  const recentTransactions = transactions.slice(0, 4);

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Top Greeting & Period Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#52796F]">
              Selamat datang kembali,
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#EBF4EE] text-[#2D5A43] text-[9px] font-black uppercase">
              {currentUser?.gradeOrCampus || 'Pelajar/Mahasiswa'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1F4130] tracking-tight">
            {currentUser?.name || 'Amelia'} 👋
          </h1>
        </div>

        {/* Weekly vs Monthly Toggle */}
        <div className="flex items-center gap-1 bg-[#F1F3F5] p-1 rounded-2xl self-start sm:self-auto">
          <button
            onClick={() => handlePeriodSwitch('weekly')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedPeriodView === 'weekly'
                ? 'bg-[#2D5A43] text-white shadow-xs'
                : 'text-[#6C757D] hover:text-[#1F4130]'
            }`}
          >
            Mingguan
          </button>
          <button
            onClick={() => handlePeriodSwitch('monthly')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedPeriodView === 'monthly'
                ? 'bg-[#2D5A43] text-white shadow-xs'
                : 'text-[#6C757D] hover:text-[#1F4130]'
            }`}
          >
            Bulanan
          </button>
        </div>
      </div>

      {/* Main Pocket Money Hero Card */}
      <div className="relative p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#2D5A43] via-[#35674E] to-[#1E3E2E] text-white shadow-xl shadow-[#2D5A43]/20 overflow-hidden">
        {/* Glow circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-[#84A98C]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#CDE3D5] flex items-center gap-1.5 uppercase tracking-wider">
              <Wallet className="w-4 h-4 text-[#FFE066]" />
              Sisa Uang Saku Tersedia
            </span>
            <div className="flex items-center gap-1 text-[11px] text-[#E8F0EA] bg-white/10 px-2.5 py-1 rounded-full backdrop-blur-xs">
              <Calendar className="w-3 h-3" />
              <span>
                {budget.period === 'weekly' ? 'Mingguan' : 'Bulanan'} ({daysRemaining} hari lagi)
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 my-2">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Rp {remainingBudget.toLocaleString('id-ID')}
            </h2>
            <div className="flex items-center gap-3 text-xs text-[#E8F0EA]">
              <span>Dari total anggaran: <b>Rp {budget.totalAmount.toLocaleString('id-ID')}</b></span>
            </div>
          </div>

          {/* Budget Usage Progress Bar */}
          <div className="space-y-1.5 mt-4 pt-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-[#CDE3D5]">Terpakai: Rp {totalExpense.toLocaleString('id-ID')}</span>
              <span
                className={`font-black ${
                  usagePercentage <= 80 ? 'text-[#A3E635]' : usagePercentage <= 100 ? 'text-[#FFE066]' : 'text-[#FF8787]'
                }`}
              >
                {usagePercentage.toFixed(1)}% ({evaluation.category})
              </span>
            </div>
            <div className="w-full h-3 bg-black/25 rounded-full overflow-hidden p-0.5 backdrop-blur-xs">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  usagePercentage <= 80
                    ? 'bg-[#A3E635]'
                    : usagePercentage <= 100
                    ? 'bg-[#F4C430]'
                    : 'bg-[#EF4444]'
                }`}
                style={{ width: `${Math.min(100, usagePercentage)}%` }}
              />
            </div>
          </div>

          {/* Quick Metrics Under Card */}
          <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-white/15">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-white/15 flex items-center justify-center">
                <ArrowDownLeft className="w-3.5 h-3.5 text-[#A3E635]" />
              </div>
              <div>
                <p className="text-[10px] text-[#CDE3D5] font-semibold">Total Pemasukan</p>
                <p className="text-xs font-black">Rp {totalIncome.toLocaleString('id-ID')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-white/15 flex items-center justify-center">
                <PiggyBank className="w-3.5 h-3.5 text-[#FFE066]" />
              </div>
              <div>
                <p className="text-[10px] text-[#CDE3D5] font-semibold">Tabungan Terkumpul</p>
                <p className="text-xs font-black">Rp {totalSavings.toLocaleString('id-ID')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature 5: Rekomendasi Pengeluaran Harian Banner (Formulated Requirement) */}
      <div className="p-5 rounded-3xl bg-white border border-[#84A98C]/40 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#EBF4EE] flex items-center justify-center text-[#2D5A43] shrink-0 shadow-xs">
            <Clock className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#52796F]">
                Rekomendasi Cerdas Harian
              </span>
              <span className="px-1.5 py-0.2 rounded-xs bg-[#EBF4EE] text-[#2D5A43] text-[9px] font-bold">
                Auto-update
              </span>
            </div>
            <h3 className="text-base font-extrabold text-[#1F4130] mt-0.5">
              Batas Maksimal Pengeluaran: <span className="text-[#2D5A43]">Rp {dailyRecommendation.toLocaleString('id-ID')} / hari</span>
            </h3>
            <p className="text-xs text-[#6C757D] mt-0.5">
              Rumus: Sisa Anggaran (Rp {remainingBudget.toLocaleString('id-ID')}) ÷ {daysRemaining} hari tersisa.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddTxOpen(true)}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#2D5A43] hover:bg-[#234835] text-white text-xs font-bold shadow-md shadow-[#2D5A43]/15 active:scale-95 transition-all self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Catat Pengeluaran</span>
        </button>
      </div>

      {/* Feature 4: Automated Evaluation Preview Banner */}
      <div
        onClick={() => onNavigateTab('evaluation')}
        className={`p-5 rounded-3xl border cursor-pointer hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          evaluation.category === 'HEMAT'
            ? 'bg-[#F7FBF8] border-[#A3B18A]'
            : evaluation.category === 'TERATUR'
            ? 'bg-[#FFFDF5] border-[#FFE066]'
            : 'bg-[#FFF8F8] border-[#FFA8A8]'
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white border border-[#E9ECEF] flex items-center justify-center shrink-0">
            <Award
              className="w-5 h-5"
              style={{
                color:
                  evaluation.category === 'HEMAT'
                    ? '#2D5A43'
                    : evaluation.category === 'TERATUR'
                    ? '#B07D14'
                    : '#E63946',
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-wide uppercase text-[#1F4130]">
                Evaluasi Keuangan: {evaluation.category}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white text-[10px] font-bold border border-[#CED4DA] text-[#495057]">
                {evaluation.usagePercentage.toFixed(0)}% Anggaran
              </span>
            </div>
            <p className="text-xs text-[#52796F] mt-1 line-clamp-1">
              "{evaluation.message}"
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs font-bold text-[#2D5A43] shrink-0 self-end sm:self-auto">
          <span>Lihat Evaluasi Lengkap</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>

      {/* Quick Action Hub */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setIsAddTxOpen(true)}
          className="p-4 rounded-3xl bg-white border border-[#E9ECEF] hover:border-[#84A98C] hover:shadow-xs transition-all text-left flex flex-col justify-between h-28"
        >
          <div className="w-8 h-8 rounded-xl bg-[#EBF4EE] text-[#2D5A43] flex items-center justify-center">
            <Plus className="w-4 h-4 stroke-[3]" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#1F4130] block">Catat Transaksi</span>
            <span className="text-[10px] text-[#6C757D]">Pemasukan/Pengeluaran</span>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('savings')}
          className="p-4 rounded-3xl bg-white border border-[#E9ECEF] hover:border-[#84A98C] hover:shadow-xs transition-all text-left flex flex-col justify-between h-28"
        >
          <div className="w-8 h-8 rounded-xl bg-[#FFF9DB] text-[#B07D14] flex items-center justify-center">
            <PiggyBank className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#1F4130] block">Alokasi Tabungan</span>
            <span className="text-[10px] text-[#6C757D]">Membeli Laptop, dll</span>
          </div>
        </button>

        <button
          onClick={onOpenAiAssistant}
          className="p-4 rounded-3xl bg-gradient-to-br from-[#EBF4EE] to-[#FAF8F5] border border-[#CDE3D5] hover:border-[#2D5A43] hover:shadow-xs transition-all text-left flex flex-col justify-between h-28"
        >
          <div className="w-8 h-8 rounded-xl bg-[#2D5A43] text-white flex items-center justify-center shadow-2xs">
            <Sparkles className="w-4 h-4 text-[#FFE066]" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#1F4130] block">Tanya KantongKu AI</span>
            <span className="text-[10px] text-[#52796F]">Saran hemat cerdas</span>
          </div>
        </button>

        <button
          onClick={onOpenParentLink}
          className="p-4 rounded-3xl bg-white border border-[#E9ECEF] hover:border-[#84A98C] hover:shadow-xs transition-all text-left flex flex-col justify-between h-28"
        >
          <div className="w-8 h-8 rounded-xl bg-[#F3E8FF] text-[#6B21A8] flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#1F4130] block">Koneksi Orang Tua</span>
            <span className="text-[10px] text-[#6C757D]">
              {parentLink?.status === 'connected' ? 'Terhubung' : 'Bagikan Kode'}
            </span>
          </div>
        </button>
      </div>

      {/* Recent Transactions List */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E9ECEF] shadow-xs space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#1F4130]">Transaksi Terbaru</h3>
            <p className="text-[11px] text-[#6C757D]">Riwayat pencatatan uang saku terakhirmu</p>
          </div>
          <button
            onClick={() => onNavigateTab('transactions')}
            className="text-xs font-bold text-[#2D5A43] hover:underline flex items-center gap-1"
          >
            <span>Lihat Semua</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {recentTransactions.map((tx) => (
            <div
              key={tx.id}
              className="p-3.5 rounded-2xl bg-[#F8F9FA] hover:bg-[#F1F3F5] transition-colors flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    tx.type === 'income' ? 'bg-[#EBF4EE] text-[#2D5A43]' : 'bg-[#FFF5F5] text-[#E63946]'
                  }`}
                >
                  {tx.type === 'income' ? (
                    <ArrowDownLeft className="w-4 h-4" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4" />
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-[#1F4130] truncate">{tx.title}</h4>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] text-[#6C757D]">
                    <span className="font-semibold text-[#52796F]">{tx.category}</span>
                    <span>•</span>
                    <span>{new Date(tx.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                  </div>
                </div>
              </div>

              <span
                className={`text-xs font-black shrink-0 ${
                  tx.type === 'income' ? 'text-[#2D5A43]' : 'text-[#E63946]'
                }`}
              >
                {tx.type === 'income' ? '+' : '-'} Rp {tx.amount.toLocaleString('id-ID')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isAddTxOpen}
        onClose={() => setIsAddTxOpen(false)}
        onSubmit={addTransaction}
      />
    </div>
  );
};
