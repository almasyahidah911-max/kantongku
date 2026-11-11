import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SavingGoal } from '../../types';
import { Modal } from '../common/Modal';
import confetti from 'canvas-confetti';
import {
  PiggyBank,
  Plus,
  Target,
  Calendar,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  History,
  Info,
  DollarSign,
  Laptop,
  BookOpen,
  Smartphone,
  Compass,
  Gift,
} from 'lucide-react';

export const SavingsGoals: React.FC = () => {
  const {
    savingGoals,
    totalSavings,
    remainingBudget,
    addSavingGoal,
    addSavingDeposit,
    allocateBudgetToSavings,
  } = useApp();

  // Modals
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  const [depositGoal, setDepositGoal] = useState<SavingGoal | null>(null);
  const [allocateGoal, setAllocateGoal] = useState<SavingGoal | null>(null);

  // Form states for New Goal
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [category, setCategory] = useState('Pendidikan');
  const [iconName, setIconName] = useState('Laptop');

  // Form state for Deposit
  const [depositAmount, setDepositAmount] = useState('');
  const [depositNote, setDepositNote] = useState('');

  // Form state for Allocation from Budget
  const [allocatedAmount, setAllocatedAmount] = useState('');
  const [allocateError, setAllocateError] = useState('');

  const triggerCelebration = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#2D5A43', '#84A98C', '#F4D06F', '#52796F'],
    });
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(targetAmount.replace(/[^0-9]/g, ''));
    if (!name.trim() || isNaN(target) || target <= 0) return;

    addSavingGoal({
      name: name.trim(),
      targetAmount: target,
      targetDate: targetDate || '2027-12-31',
      category,
      iconName,
    });

    setName('');
    setTargetAmount('');
    setTargetDate('');
    setIsAddGoalModalOpen(false);
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositGoal) return;
    const amount = parseFloat(depositAmount.replace(/[^0-9]/g, ''));
    if (isNaN(amount) || amount <= 0) return;

    addSavingDeposit(depositGoal.id, amount, depositNote);

    // If goal completed
    if (depositGoal.currentAmount + amount >= depositGoal.targetAmount) {
      triggerCelebration();
    }

    setDepositGoal(null);
    setDepositAmount('');
    setDepositNote('');
  };

  const handleAllocateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allocateGoal) return;
    const amount = parseFloat(allocatedAmount.replace(/[^0-9]/g, ''));
    if (isNaN(amount) || amount <= 0) {
      setAllocateError('Masukkan nominal yang valid.');
      return;
    }
    if (amount > remainingBudget) {
      setAllocateError(`Nominal melebihi sisa anggaran (Rp ${remainingBudget.toLocaleString('id-ID')}).`);
      return;
    }

    const success = allocateBudgetToSavings(allocateGoal.id, amount);
    if (success) {
      if (allocateGoal.currentAmount + amount >= allocateGoal.targetAmount) {
        triggerCelebration();
      }
      setAllocateGoal(null);
      setAllocatedAmount('');
      setAllocateError('');
    }
  };

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'Laptop':
        return Laptop;
      case 'BookOpen':
        return BookOpen;
      case 'Smartphone':
        return Smartphone;
      case 'Compass':
        return Compass;
      default:
        return Gift;
    }
  };

  return (
    <div className="space-y-5 animate-fade-in pb-20">
      {/* Header and Add button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1F4130] tracking-tight">
            Target Tabungan
          </h1>
          <p className="text-xs text-[#52796F] mt-0.5">
            Wujudkan impian dengan menyisihkan uang saku secara konsisten
          </p>
        </div>
        <button
          onClick={() => setIsAddGoalModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#2D5A43] hover:bg-[#234835] text-white font-bold text-xs shadow-md shadow-[#2D5A43]/20 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Target Baru</span>
        </button>
      </div>

      {/* Summary Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#2D5A43] via-[#3E7056] to-[#52796F] text-white shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="text-xs font-semibold text-[#CDE3D5] flex items-center gap-1.5">
              <PiggyBank className="w-4 h-4" />
              Total Tabungan Terkumpul (Virtual)
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-1 tracking-tight">
              Rp {totalSavings.toLocaleString('id-ID')}
            </h2>
            <p className="text-[11px] text-[#E8F0EA] mt-1">
              Tersebar di {savingGoals.length} target impian aktif
            </p>
          </div>

          {remainingBudget > 0 && (
            <div className="bg-white/15 backdrop-blur-xs p-3.5 rounded-2xl border border-white/20 sm:max-w-xs text-xs">
              <p className="font-bold flex items-center gap-1 text-[#FFE066]">
                <Sparkles className="w-3.5 h-3.5" /> Ada Sisa Anggaran!
              </p>
              <p className="text-[11px] text-[#E8F0EA] mt-0.5">
                Tersedia Rp {remainingBudget.toLocaleString('id-ID')} yang bisa kamu alokasikan ke tabungan hari ini.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Virtual Note Disclaimer */}
      <div className="p-3 rounded-2xl bg-[#F7F5EC] border border-[#E9ECEF] flex items-start gap-2 text-xs text-[#6C757D]">
        <Info className="w-4 h-4 text-[#52796F] shrink-0 mt-0.5" />
        <span>
          <b>Catatan:</b> Tabungan dalam aplikasi ini merupakan pencatatan virtual untuk disiplin keuangan pribadi, bukan rekening bank sungguhan.
        </span>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {savingGoals.map((goal) => {
          const progress = Math.min(
            100,
            (goal.currentAmount / (goal.targetAmount || 1)) * 100
          );
          const isFinished = goal.currentAmount >= goal.targetAmount;
          const IconComp = getIcon(goal.iconName);

          return (
            <div
              key={goal.id}
              className={`p-5 rounded-3xl bg-white border transition-all shadow-xs flex flex-col justify-between ${
                isFinished ? 'border-[#3FB950] bg-[#FBFCFB]' : 'border-[#E9ECEF] hover:border-[#84A98C]'
              }`}
            >
              <div>
                {/* Header item */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                        isFinished
                          ? 'bg-[#EBF4EE] text-[#2D5A43]'
                          : 'bg-[#F7F5EC] text-[#52796F]'
                      }`}
                    >
                      <IconComp className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#1F4130] leading-snug">
                        {goal.name}
                      </h3>
                      <span className="text-[10px] font-semibold text-[#868E96]">
                        {goal.category}
                      </span>
                    </div>
                  </div>

                  {isFinished ? (
                    <span className="px-2.5 py-1 rounded-full bg-[#EBF4EE] text-[#2D5A43] text-[10px] font-extrabold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> TERCAPAI!
                    </span>
                  ) : (
                    <span className="text-xs font-black text-[#2D5A43]">
                      {progress.toFixed(0)}%
                    </span>
                  )}
                </div>

                {/* Amount Progress */}
                <div className="space-y-1.5 my-3">
                  <div className="flex justify-between items-end text-xs">
                    <div>
                      <span className="text-[10px] text-[#6C757D]">Terkumpul</span>
                      <p className="font-extrabold text-[#1F4130]">
                        Rp {goal.currentAmount.toLocaleString('id-ID')}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-[#6C757D]">Target</span>
                      <p className="font-bold text-[#52796F]">
                        Rp {goal.targetAmount.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>

                  <div className="w-full h-3 bg-[#F1F3F5] rounded-full overflow-hidden p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isFinished
                          ? 'bg-gradient-to-r from-[#2D5A43] to-[#3FB950]'
                          : 'bg-gradient-to-r from-[#84A98C] to-[#2D5A43]'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Target Date */}
                <div className="flex items-center gap-1.5 text-[11px] text-[#868E96] mb-3">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    Tenggat waktu:{' '}
                    {new Date(goal.targetDate).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                {/* History preview */}
                {goal.history && goal.history.length > 0 && (
                  <div className="mb-4 pt-2 border-t border-[#F1F3F5]">
                    <span className="text-[10px] font-bold text-[#6C757D] flex items-center gap-1 mb-1">
                      <History className="w-3 h-3" /> Setoran Terakhir:
                    </span>
                    <div className="space-y-1 max-h-20 overflow-y-auto pr-1">
                      {goal.history.slice(0, 2).map((h) => (
                        <div
                          key={h.id}
                          className="flex items-center justify-between text-[10px] text-[#495057]"
                        >
                          <span className="truncate max-w-[150px]">{h.note || 'Setoran'}</span>
                          <span className="font-bold text-[#2D5A43]">
                            +Rp {h.amount.toLocaleString('id-ID')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#F1F3F5]">
                <button
                  onClick={() => setDepositGoal(goal)}
                  className="py-2.5 px-3 rounded-xl bg-[#2D5A43] text-white text-xs font-bold hover:bg-[#234835] transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Uang</span>
                </button>
                <button
                  onClick={() => {
                    setAllocateGoal(goal);
                    setAllocatedAmount('');
                    setAllocateError('');
                  }}
                  className="py-2.5 px-3 rounded-xl bg-[#F7F5EC] border border-[#D5E1D9] text-[#1F4130] text-xs font-bold hover:bg-[#EBE7D8] transition-colors flex items-center justify-center gap-1.5"
                >
                  <PiggyBank className="w-3.5 h-3.5 text-[#52796F]" />
                  <span>Alokasi Sisa</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Create New Goal */}
      <Modal
        isOpen={isAddGoalModalOpen}
        onClose={() => setIsAddGoalModalOpen(false)}
        title="Buat Target Tabungan Baru"
        description="Tetapkan nominal dan tenggat waktu impianmu."
      >
        <form onSubmit={handleCreateGoal} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-[#495057] mb-1">
              Nama Target
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Membeli Laptop / Tiket Seminar"
              className="w-full px-3.5 py-2.5 rounded-2xl border border-[#CED4DA] focus:border-[#2D5A43] text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#495057] mb-1">
              Nominal Target (Rp)
            </label>
            <input
              type="number"
              required
              min="10000"
              step="10000"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder="Contoh: 5000000"
              className="w-full px-3.5 py-2.5 rounded-2xl border border-[#CED4DA] focus:border-[#2D5A43] text-xs font-bold text-[#1F4130]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#495057] mb-1">
                Tenggat Waktu
              </label>
              <input
                type="date"
                required
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl border border-[#CED4DA] focus:border-[#2D5A43] text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#495057] mb-1">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl border border-[#CED4DA] text-xs bg-white"
              >
                <option value="Pendidikan">Pendidikan</option>
                <option value="Teknologi & Belajar">Teknologi</option>
                <option value="Liburan">Liburan</option>
                <option value="Dana Darurat">Dana Darurat</option>
                <option value="Lain-lain">Lain-lain</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#495057] mb-1">
              Pilih Ikon
            </label>
            <div className="flex gap-2">
              {['Laptop', 'BookOpen', 'Smartphone', 'Compass', 'Gift'].map((ico) => {
                const IcoComponent = getIcon(ico);
                return (
                  <button
                    key={ico}
                    type="button"
                    onClick={() => setIconName(ico)}
                    className={`p-2.5 rounded-xl border transition-all ${
                      iconName === ico
                        ? 'border-[#2D5A43] bg-[#EBF4EE] text-[#2D5A43]'
                        : 'border-[#E9ECEF] text-[#6C757D]'
                    }`}
                  >
                    <IcoComponent className="w-5 h-5" />
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-[#2D5A43] hover:bg-[#234835] text-white font-bold text-xs shadow-md mt-2"
          >
            Simpan Target Tabungan
          </button>
        </form>
      </Modal>

      {/* Modal: Deposit Money */}
      <Modal
        isOpen={!!depositGoal}
        onClose={() => setDepositGoal(null)}
        title={`Tambah Uang Tabungan`}
        description={`Setoran untuk target: ${depositGoal?.name}`}
      >
        <form onSubmit={handleDepositSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-[#495057] mb-1">
              Nominal Setoran (Rp)
            </label>
            <input
              type="number"
              required
              min="1000"
              step="1000"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="Contoh: 50000"
              className="w-full px-3.5 py-2.5 rounded-2xl border border-[#CED4DA] focus:border-[#2D5A43] text-sm font-bold text-[#1F4130]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#495057] mb-1">
              Catatan / Sumber Uang
            </label>
            <input
              type="text"
              value={depositNote}
              onChange={(e) => setDepositNote(e.target.value)}
              placeholder="Contoh: Sisa jajan minggu ini / Hadiah kuis"
              className="w-full px-3.5 py-2.5 rounded-2xl border border-[#CED4DA] text-xs"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-[#2D5A43] hover:bg-[#234835] text-white font-bold text-xs shadow-md"
          >
            Konfirmasi Tambah Tabungan
          </button>
        </form>
      </Modal>

      {/* Modal: Allocate Remaining Budget to Savings */}
      <Modal
        isOpen={!!allocateGoal}
        onClose={() => setAllocateGoal(null)}
        title="Alokasi Sisa Anggaran ke Tabungan"
        description={`Sisihkan sisa uang sakumu langsung ke target ${allocateGoal?.name}`}
      >
        <form onSubmit={handleAllocateSubmit} className="space-y-3.5">
          <div className="p-3 rounded-2xl bg-[#EBF4EE] border border-[#CDE3D5] text-xs">
            <span className="text-[#52796F]">Sisa Anggaran Tersedia:</span>
            <p className="text-base font-extrabold text-[#2D5A43]">
              Rp {remainingBudget.toLocaleString('id-ID')}
            </p>
          </div>

          {allocateError && (
            <div className="p-2.5 rounded-xl bg-red-50 text-red-600 text-xs font-medium">
              {allocateError}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#495057] mb-1">
              Jumlah yang Ingin Disisihkan (Rp)
            </label>
            <input
              type="number"
              required
              min="1000"
              max={remainingBudget}
              step="1000"
              value={allocatedAmount}
              onChange={(e) => setAllocatedAmount(e.target.value)}
              placeholder="Ketik jumlah yang ingin disisihkan..."
              className="w-full px-3.5 py-2.5 rounded-2xl border border-[#CED4DA] focus:border-[#2D5A43] text-sm font-bold text-[#1F4130]"
            />
            {remainingBudget > 0 && (
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setAllocatedAmount(Math.round(remainingBudget * 0.25).toString())}
                  className="px-2.5 py-1 rounded-lg bg-[#F1F3F5] text-[10px] font-bold text-[#495057]"
                >
                  25%
                </button>
                <button
                  type="button"
                  onClick={() => setAllocatedAmount(Math.round(remainingBudget * 0.5).toString())}
                  className="px-2.5 py-1 rounded-lg bg-[#F1F3F5] text-[10px] font-bold text-[#495057]"
                >
                  50%
                </button>
                <button
                  type="button"
                  onClick={() => setAllocatedAmount(remainingBudget.toString())}
                  className="px-2.5 py-1 rounded-lg bg-[#F1F3F5] text-[10px] font-bold text-[#495057]"
                >
                  Semua (100%)
                </button>
              </div>
            )}
          </div>

          <p className="text-[11px] text-[#6C757D]">
            Sistem akan otomatis mencatat pemindahan ini sebagai alokasi tabungan dan menambah saldo target impianmu.
          </p>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-[#2D5A43] hover:bg-[#234835] text-white font-bold text-xs shadow-md"
          >
            Alokasikan Sekarang
          </button>
        </form>
      </Modal>
    </div>
  );
};
