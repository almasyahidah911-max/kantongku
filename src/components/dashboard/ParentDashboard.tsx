import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import {
  Users,
  Send,
  Gift,
  DollarSign,
  TrendingDown,
  PieChart,
  PiggyBank,
  CheckCircle2,
  AlertTriangle,
  HeartHandshake,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

interface ParentDashboardProps {
  onGoToMessages: () => void;
  onGoToReports: () => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  onGoToMessages,
  onGoToReports,
}) => {
  const {
    currentUser,
    parentLink,
    budget,
    totalExpense,
    remainingBudget,
    usagePercentage,
    evaluation,
    categorySpending,
    totalSavings,
    savingGoals,
    givePocketMoneyAsParent,
    sendAdviceAsParent,
  } = useApp();

  // Modals
  const [isPocketMoneyModalOpen, setIsPocketMoneyModalOpen] = useState(false);
  const [pocketMoneyAmount, setPocketMoneyAmount] = useState('');
  const [pocketMoneyNote, setPocketMoneyNote] = useState('Uang saku mingguan');

  const [isAdviceModalOpen, setIsAdviceModalOpen] = useState(false);
  const [adviceText, setAdviceText] = useState('');

  const [successToast, setSuccessToast] = useState('');

  const childName = parentLink?.childName || 'Amelia';

  const handleSendPocketMoney = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(pocketMoneyAmount.replace(/[^0-9]/g, ''));
    if (isNaN(amount) || amount <= 0) return;

    givePocketMoneyAsParent(amount, pocketMoneyNote);
    setIsPocketMoneyModalOpen(false);
    setPocketMoneyAmount('');
    setSuccessToast(`Berhasil mencatat pemberian uang saku Rp ${amount.toLocaleString('id-ID')} untuk ${childName}!`);
    setTimeout(() => setSuccessToast(''), 3500);
  };

  const handleSendAdvice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adviceText.trim()) return;

    sendAdviceAsParent(adviceText.trim());
    setIsAdviceModalOpen(false);
    setAdviceText('');
    setSuccessToast(`Saran keuangan berhasil dikirimkan ke HP ${childName}!`);
    setTimeout(() => setSuccessToast(''), 3500);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Toast Notification */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-[#EBF4EE] border border-[#2D5A43] text-xs font-bold text-[#1F4130] flex items-center gap-2 shadow-md animate-slide-up">
          <CheckCircle2 className="w-5 h-5 text-[#2D5A43]" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Parent Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#EBF4EE] text-[#2D5A43] text-[10px] font-extrabold uppercase tracking-wider">
              Dashboard Orang Tua Pendamping
            </span>
            <span className="flex items-center gap-1 text-[11px] text-[#52796F] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2D5A43]" /> Terhubung Aman
            </span>
          </div>
          <h1 className="text-2xl font-black text-[#1F4130] tracking-tight mt-1">
            Mendampingi Keuangan {childName}
          </h1>
          <p className="text-xs text-[#6C757D]">
            Pantau kebiasaan keuangan anak secara bijak, suportif, dan edukatif.
          </p>
        </div>

        {/* Quick Action Buttons for Parents */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPocketMoneyModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#2D5A43] hover:bg-[#234835] text-white text-xs font-bold shadow-md shadow-[#2D5A43]/20 active:scale-95 transition-all"
          >
            <Gift className="w-4 h-4" />
            <span>Kirim Uang Saku</span>
          </button>
          <button
            onClick={() => setIsAdviceModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white border border-[#CED4DA] hover:border-[#2D5A43] text-xs font-bold text-[#1F4130] transition-colors"
          >
            <Send className="w-3.5 h-3.5 text-[#52796F]" />
            <span>Beri Saran</span>
          </button>
        </div>
      </div>

      {/* Main Monitoring Summary Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1F4130] via-[#2D5A43] to-[#3B6E54] text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#FFE066]" />
            <span className="text-xs font-bold text-[#E8F0EA]">
              Kondisi Keuangan {childName} (Periode {budget.period === 'weekly' ? 'Mingguan' : 'Bulanan'})
            </span>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-[11px] font-black uppercase ${
              evaluation.category === 'HEMAT'
                ? 'bg-[#A3E635] text-[#143306]'
                : evaluation.category === 'TERATUR'
                ? 'bg-[#FFE066] text-[#4A3800]'
                : 'bg-[#FF6B6B] text-white'
            }`}
          >
            Evaluasi: {evaluation.category}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xs">
            <p className="text-[10px] text-[#CDE3D5] uppercase font-bold">Uang Saku Diberikan</p>
            <p className="text-base sm:text-lg font-extrabold mt-0.5">
              Rp {budget.totalAmount.toLocaleString('id-ID')}
            </p>
          </div>
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xs">
            <p className="text-[10px] text-[#CDE3D5] uppercase font-bold">Total Pengeluaran</p>
            <p className="text-base sm:text-lg font-extrabold text-[#FFD166] mt-0.5">
              Rp {totalExpense.toLocaleString('id-ID')}
            </p>
          </div>
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xs">
            <p className="text-[10px] text-[#CDE3D5] uppercase font-bold">Sisa Anggaran Anak</p>
            <p className="text-base sm:text-lg font-extrabold text-[#A3E635] mt-0.5">
              Rp {remainingBudget.toLocaleString('id-ID')}
            </p>
          </div>
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xs">
            <p className="text-[10px] text-[#CDE3D5] uppercase font-bold">Tabungan Mandiri</p>
            <p className="text-base sm:text-lg font-extrabold mt-0.5">
              Rp {totalSavings.toLocaleString('id-ID')}
            </p>
          </div>
        </div>

        {/* Progress Bar of Budget Usage */}
        <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span>Tingkat Penyerapan Anggaran</span>
            <span>{usagePercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full h-2.5 bg-black/20 rounded-full overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                usagePercentage <= 80
                  ? 'bg-[#A3E635]'
                  : usagePercentage <= 100
                  ? 'bg-[#FFE066]'
                  : 'bg-[#FF6B6B]'
              }`}
              style={{ width: `${Math.min(100, usagePercentage)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Child Category Spending & Savings Progress Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Category Breakdown */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E9ECEF] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#1F4130] flex items-center gap-2">
              <PieChart className="w-4 h-4 text-[#2D5A43]" />
              <span>Rincian Pengeluaran {childName}</span>
            </h3>
            <span className="text-[10px] text-[#868E96]">Sesuai Izin Anak</span>
          </div>

          <div className="space-y-3">
            {Object.entries(categorySpending).map(([cat, amt]) => {
              const percent = totalExpense > 0 ? (amt / totalExpense) * 100 : 0;
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-[#1F4130]">{cat}</span>
                    <span className="font-extrabold text-[#2D5A43]">
                      Rp {amt.toLocaleString('id-ID')}{' '}
                      <span className="text-[#868E96] text-[10px] font-normal">
                        ({percent.toFixed(0)}%)
                      </span>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#F1F3F5] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#84A98C] rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Child Savings Progress */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E9ECEF] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#1F4130] flex items-center gap-2">
              <PiggyBank className="w-4 h-4 text-[#2D5A43]" />
              <span>Perkembangan Tabungan {childName}</span>
            </h3>
            <span className="text-[11px] font-bold text-[#2D5A43]">
              Total: Rp {totalSavings.toLocaleString('id-ID')}
            </span>
          </div>

          <div className="space-y-3">
            {savingGoals.map((goal) => {
              const progress = Math.min(
                100,
                (goal.currentAmount / (goal.targetAmount || 1)) * 100
              );
              return (
                <div key={goal.id} className="p-3 rounded-2xl bg-[#F8F9FA] border border-[#E9ECEF]">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-bold text-[#1F4130]">{goal.name}</span>
                    <span className="text-[11px] font-extrabold text-[#2D5A43]">
                      {progress.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#E9ECEF] rounded-full overflow-hidden mb-1.5">
                    <div
                      className="h-full bg-gradient-to-r from-[#84A98C] to-[#2D5A43] rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-[#6C757D]">
                    <span>Terkumpul: Rp {goal.currentAmount.toLocaleString('id-ID')}</span>
                    <span>Target: Rp {goal.targetAmount.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal: Give Pocket Money */}
      <Modal
        isOpen={isPocketMoneyModalOpen}
        onClose={() => setIsPocketMoneyModalOpen(false)}
        title={`Catat Pemberian Uang Saku`}
        description={`Kirimkan uang saku untuk ${childName}. Ini akan otomatis tercatat sebagai Pemasukan di akunnya.`}
      >
        <form onSubmit={handleSendPocketMoney} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#495057] mb-1">
              Nominal Uang Saku (Rp)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-sm font-bold text-[#52796F]">
                Rp
              </span>
              <input
                type="number"
                required
                min="10000"
                step="10000"
                value={pocketMoneyAmount}
                onChange={(e) => setPocketMoneyAmount(e.target.value)}
                placeholder="200000"
                className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-[#CED4DA] focus:border-[#2D5A43] text-sm font-bold text-[#1F4130]"
              />
            </div>
            <div className="flex gap-2 mt-2">
              {[100000, 200000, 300000, 500000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setPocketMoneyAmount(val.toString())}
                  className="px-2.5 py-1 rounded-lg bg-[#F1F3F5] text-[10px] font-bold text-[#495057] hover:bg-[#E9ECEF]"
                >
                  Rp {(val / 1000).toFixed(0)}k
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#495057] mb-1">
              Catatan / Pesan untuk Anak
            </label>
            <input
              type="text"
              value={pocketMoneyNote}
              onChange={(e) => setPocketMoneyNote(e.target.value)}
              placeholder="Contoh: Uang saku minggu ke-2 bulan ini"
              className="w-full px-3.5 py-2.5 rounded-2xl border border-[#CED4DA] text-xs font-medium"
            />
          </div>

          <p className="text-[11px] text-[#6C757D]">
            *Catatan: Fitur ini mencatat uang saku di aplikasi KantongKu untuk pembukuan digital bersama, bukan transfer antarbank sungguhan.
          </p>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-[#2D5A43] hover:bg-[#234835] text-white font-bold text-xs shadow-md"
          >
            Kirim dan Catat Uang Saku
          </button>
        </form>
      </Modal>

      {/* Modal: Send Advice */}
      <Modal
        isOpen={isAdviceModalOpen}
        onClose={() => setIsAdviceModalOpen(false)}
        title={`Beri Saran Finansial untuk ${childName}`}
        description="Nasihat hangat dari orang tua sangat membantu kebiasaan baik anak."
      >
        <form onSubmit={handleSendAdvice} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#495057] mb-1">
              Isi Saran / Catatan
            </label>
            <textarea
              required
              rows={3}
              value={adviceText}
              onChange={(e) => setAdviceText(e.target.value)}
              placeholder="Contoh: Jangan lupa sisihkan sebagian uang sakumu untuk ditabung ya nak."
              className="w-full px-3.5 py-2.5 rounded-2xl border border-[#CED4DA] text-xs font-medium"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              'Jangan lupa sisihkan sebagian uang saku untuk ditabung!',
              'Bunda bangga kamu bisa hemat minggu ini.',
              'Prioritaskan dulu kebutuhan kuliah sebelum jajan.',
            ].map((tmpl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setAdviceText(tmpl)}
                className="text-[10px] px-2.5 py-1 rounded-full bg-[#F7F5EC] text-[#1F4130] border border-[#D5E1D9]"
              >
                {tmpl}
              </button>
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-[#2D5A43] hover:bg-[#234835] text-white font-bold text-xs shadow-md"
          >
            Kirim Nasihat Sekarang
          </button>
        </form>
      </Modal>
    </div>
  );
};
