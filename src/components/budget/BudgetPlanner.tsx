import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BudgetPeriodType, TransactionCategory } from '../../types';
import {
  PieChart,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Edit3,
  DollarSign,
  ShieldCheck,
  Info,
} from 'lucide-react';

const DEFAULT_CATEGORIES: TransactionCategory[] = [
  'Makan',
  'Transportasi',
  'Kebutuhan Kuliah',
  'Jajan',
  'Hadiah & Lain-lain',
];

export const BudgetPlanner: React.FC = () => {
  const {
    budget,
    updateBudget,
    totalExpense,
    remainingBudget,
    usagePercentage,
    categorySpending,
    evaluation,
    dailyRecommendation,
    daysRemaining,
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [tempTotalAmount, setTempTotalAmount] = useState(budget.totalAmount.toString());
  const [tempPeriod, setTempPeriod] = useState<BudgetPeriodType>(budget.period);
  const [tempStartDate, setTempStartDate] = useState(budget.startDate);
  const [tempEndDate, setTempEndDate] = useState(budget.endDate);
  const [tempCategories, setTempCategories] = useState(budget.categoryBudgets);

  const handleCategoryAmountChange = (cat: TransactionCategory, value: string) => {
    const num = parseFloat(value.replace(/[^0-9]/g, '')) || 0;
    setTempCategories((prev) =>
      prev.map((c) => (c.category === cat ? { ...c, allocatedAmount: num } : c))
    );
  };

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const total = parseFloat(tempTotalAmount.replace(/[^0-9]/g, '')) || 0;
    updateBudget({
      totalAmount: total,
      period: tempPeriod,
      startDate: tempStartDate,
      endDate: tempEndDate,
      categoryBudgets: tempCategories,
    });
    setIsEditing(false);
  };

  const totalAllocatedCategories = tempCategories.reduce(
    (sum, c) => sum + c.allocatedAmount,
    0
  );

  return (
    <div className="space-y-5 animate-fade-in pb-20">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1F4130] tracking-tight">
            Pengaturan Anggaran
          </h1>
          <p className="text-xs text-[#52796F] mt-0.5">
            Tentukan target batas pengeluaran agar uang sakumu selalu cukup
          </p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            isEditing
              ? 'bg-[#F1F3F5] text-[#495057] hover:bg-[#E9ECEF]'
              : 'bg-[#2D5A43] text-white hover:bg-[#234835] shadow-xs'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>{isEditing ? 'Batal Mengubah' : 'Ubah Anggaran'}</span>
        </button>
      </div>

      {/* Main Budget Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#2D5A43] via-[#35674E] to-[#1E3E2E] text-white shadow-xl shadow-[#2D5A43]/15 relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-44 h-44 rounded-full bg-white/5 pointer-events-none blur-2xl" />
        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-36 h-36 rounded-full bg-[#84A98C]/10 pointer-events-none blur-xl" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span className="px-3 py-1 rounded-full bg-white/15 text-[11px] font-bold tracking-wide uppercase backdrop-blur-xs">
              Anggaran {budget.period === 'weekly' ? 'Mingguan' : 'Bulanan'}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-[#E8F0EA]">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {new Date(budget.startDate).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                })}{' '}
                -{' '}
                {new Date(budget.endDate).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 pb-4">
            <div>
              <p className="text-xs text-[#CDE3D5] font-medium">Total Uang Saku</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-0.5">
                Rp {budget.totalAmount.toLocaleString('id-ID')}
              </h3>
            </div>
            <div>
              <p className="text-xs text-[#CDE3D5] font-medium">Sudah Terpakai</p>
              <h3 className="text-xl sm:text-2xl font-bold mt-0.5 text-[#FFD166]">
                Rp {totalExpense.toLocaleString('id-ID')}
              </h3>
            </div>
            <div>
              <p className="text-xs text-[#CDE3D5] font-medium">Sisa Uang Saku</p>
              <h3 className="text-xl sm:text-2xl font-bold mt-0.5 text-[#A3E635]">
                Rp {remainingBudget.toLocaleString('id-ID')}
              </h3>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs font-semibold">
              <span>Penggunaan Anggaran</span>
              <span>{usagePercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full h-3 bg-black/25 rounded-full overflow-hidden p-0.5 backdrop-blur-xs">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
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

          {/* Daily Recommendation Pill */}
          <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-[#E8F0EA]">
            <span>
              💡 Rekomendasi harian: <b>Rp {dailyRecommendation.toLocaleString('id-ID')} / hari</b>
            </span>
            <span className="text-[11px] opacity-90">{daysRemaining} hari tersisa di periode ini</span>
          </div>
        </div>
      </div>

      {/* Editing Mode Form */}
      {isEditing && (
        <form
          onSubmit={handleSaveBudget}
          className="p-5 sm:p-6 rounded-3xl bg-white border border-[#84A98C] shadow-lg space-y-4 animate-scale-in"
        >
          <div className="flex items-center gap-2 pb-2 border-b border-[#F1F3F5]">
            <Edit3 className="w-5 h-5 text-[#2D5A43]" />
            <h3 className="text-sm font-bold text-[#1F4130]">Form Perubahan Anggaran</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1F4130] mb-1">
                Total Uang Saku (Rp)
              </label>
              <input
                type="number"
                min="10000"
                step="5000"
                required
                value={tempTotalAmount}
                onChange={(e) => setTempTotalAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-[#CED4DA] focus:border-[#2D5A43] text-sm font-bold text-[#1F4130]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1F4130] mb-1">
                Pilihan Periode
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTempPeriod('weekly')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    tempPeriod === 'weekly'
                      ? 'bg-[#2D5A43] text-white border-[#2D5A43]'
                      : 'bg-[#F8F9FA] text-[#6C757D] border-[#CED4DA]'
                  }`}
                >
                  Mingguan
                </button>
                <button
                  type="button"
                  onClick={() => setTempPeriod('monthly')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    tempPeriod === 'monthly'
                      ? 'bg-[#2D5A43] text-white border-[#2D5A43]'
                      : 'bg-[#F8F9FA] text-[#6C757D] border-[#CED4DA]'
                  }`}
                >
                  Bulanan
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#495057] mb-1">
                Tanggal Mulai
              </label>
              <input
                type="date"
                required
                value={tempStartDate}
                onChange={(e) => setTempStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#CED4DA] text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#495057] mb-1">
                Tanggal Berakhir
              </label>
              <input
                type="date"
                required
                value={tempEndDate}
                onChange={(e) => setTempEndDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#CED4DA] text-xs"
              />
            </div>
          </div>

          {/* Category Budget Allocation Inputs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-[#1F4130]">
                Alokasi Berdasarkan Kategori
              </label>
              <span className="text-[11px] font-semibold text-[#52796F]">
                Total: Rp {totalAllocatedCategories.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {DEFAULT_CATEGORIES.map((cat) => {
                const item = tempCategories.find((c) => c.category === cat) || {
                  category: cat,
                  allocatedAmount: 0,
                };
                return (
                  <div
                    key={cat}
                    className="p-3 rounded-2xl bg-[#F8F9FA] border border-[#E9ECEF] flex items-center justify-between gap-2"
                  >
                    <span className="text-xs font-semibold text-[#1F4130]">{cat}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-[#6C757D]">Rp</span>
                      <input
                        type="number"
                        min="0"
                        step="1000"
                        value={item.allocatedAmount}
                        onChange={(e) => handleCategoryAmountChange(cat, e.target.value)}
                        className="w-28 px-2 py-1 text-right text-xs font-bold text-[#1F4130] rounded-lg border border-[#CED4DA] focus:border-[#2D5A43] bg-white"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex-1 py-2.5 rounded-xl border border-[#CED4DA] text-xs font-bold text-[#6C757D]"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-[#2D5A43] text-white text-xs font-bold hover:bg-[#234835] shadow-xs"
            >
              Simpan Anggaran
            </button>
          </div>
        </form>
      )}

      {/* Category Breakdown Progress List */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E9ECEF] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#1F4130] flex items-center gap-2">
            <PieChart className="w-5 h-5 text-[#2D5A43]" />
            <span>Penggunaan Anggaran per Kategori</span>
          </h3>
          <span className="text-[11px] font-semibold text-[#52796F]">
            Realisasi vs Alokasi
          </span>
        </div>

        <div className="space-y-3.5">
          {budget.categoryBudgets.map((catItem) => {
            const spent = categorySpending[catItem.category] || 0;
            const allocated = catItem.allocatedAmount || 1;
            const percent = (spent / allocated) * 100;
            const isExceeded = spent > allocated;

            return (
              <div key={catItem.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-[#1F4130]">
                    <span>{catItem.category}</span>
                    {isExceeded && (
                      <span className="px-1.5 py-0.2 rounded-full bg-red-100 text-red-600 text-[9px] font-extrabold flex items-center gap-0.5">
                        <AlertTriangle className="w-2.5 h-2.5" /> Lewat Batas
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-[#1F4130]">
                      Rp {spent.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[#6C757D] text-[11px]">
                      {' '}
                      / Rp {allocated.toLocaleString('id-ID')} ({percent.toFixed(0)}%)
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2.5 bg-[#F1F3F5] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isExceeded
                        ? 'bg-[#E63946]'
                        : percent > 80
                        ? 'bg-[#F4C430]'
                        : 'bg-[#84A98C]'
                    }`}
                    style={{ width: `${Math.min(100, percent)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
