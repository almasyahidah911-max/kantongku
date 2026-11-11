import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  PiggyBank,
  ArrowRight,
  TrendingUp,
  Calendar,
  Award,
} from 'lucide-react';

interface EvaluationViewProps {
  onGoToSavings?: () => void;
}

export const EvaluationView: React.FC<EvaluationViewProps> = ({ onGoToSavings }) => {
  const {
    evaluation,
    budget,
    totalExpense,
    remainingBudget,
    usagePercentage,
    savingGoals,
    allocateBudgetToSavings,
  } = useApp();

  const getEvaluationTheme = () => {
    switch (evaluation.category) {
      case 'HEMAT':
        return {
          badgeBg: 'bg-[#EBF4EE] text-[#2D5A43] border-[#A3B18A]',
          accentColor: '#2D5A43',
          icon: Award,
          title: 'LUAR BIASA! HEMAT ⭐',
          gradient: 'from-[#EBF4EE] via-[#F7F5EC] to-white',
        };
      case 'TERATUR':
        return {
          badgeBg: 'bg-[#FFF9DB] text-[#B07D14] border-[#FFE066]',
          accentColor: '#B07D14',
          icon: CheckCircle,
          title: 'TERATUR & CUKUP BAIK 👍',
          gradient: 'from-[#FFF9DB] via-[#F7F5EC] to-white',
        };
      case 'MELEBIHI ANGGARAN':
        return {
          badgeBg: 'bg-[#FFF5F5] text-[#E63946] border-[#FFA8A8]',
          accentColor: '#E63946',
          icon: AlertTriangle,
          title: 'PERHATIAN! MELEBIHI ANGGARAN ⚠️',
          gradient: 'from-[#FFF5F5] via-[#FAF8F5] to-white',
        };
    }
  };

  const theme = getEvaluationTheme();
  const IconComponent = theme.icon;

  return (
    <div className="space-y-5 animate-fade-in pb-20">
      <div>
        <h1 className="text-2xl font-extrabold text-[#1F4130] tracking-tight">
          Evaluasi Keuangan Otomatis
        </h1>
        <p className="text-xs text-[#52796F] mt-0.5">
          Tinjauan cerdas penggunaan uang saku periode {budget.period === 'weekly' ? 'Mingguan' : 'Bulanan'}
        </p>
      </div>

      {/* Main Big Evaluation Hero Card */}
      <div
        className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-b ${theme.gradient} border border-[#D5E1D9] shadow-md relative overflow-hidden`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-xs border border-[#E9ECEF] flex items-center justify-center">
              <IconComponent className="w-8 h-8" style={{ color: theme.accentColor }} />
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#6C757D] uppercase tracking-wider">
                Kategori Evaluasi
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#1F4130] tracking-tight">
                {theme.title}
              </h2>
            </div>
          </div>

          <div
            className={`px-4 py-2 rounded-2xl border font-black text-xs sm:text-sm tracking-wide self-start sm:self-auto ${theme.badgeBg}`}
          >
            STATUS: {evaluation.category}
          </div>
        </div>

        {/* Financial Numbers Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-[#E9ECEF]">
          <div className="p-3 bg-white/80 rounded-2xl border border-[#E9ECEF]">
            <p className="text-[11px] font-semibold text-[#6C757D]">Total Anggaran</p>
            <p className="text-sm sm:text-base font-extrabold text-[#1F4130] mt-0.5">
              Rp {evaluation.totalBudget.toLocaleString('id-ID')}
            </p>
          </div>
          <div className="p-3 bg-white/80 rounded-2xl border border-[#E9ECEF]">
            <p className="text-[11px] font-semibold text-[#6C757D]">Total Pengeluaran</p>
            <p className="text-sm sm:text-base font-extrabold text-[#E63946] mt-0.5">
              Rp {evaluation.totalExpense.toLocaleString('id-ID')}
            </p>
          </div>
          <div className="p-3 bg-white/80 rounded-2xl border border-[#E9ECEF]">
            <p className="text-[11px] font-semibold text-[#6C757D]">Sisa Uang Saku</p>
            <p className="text-sm sm:text-base font-extrabold text-[#2D5A43] mt-0.5">
              Rp {evaluation.remainingAmount.toLocaleString('id-ID')}
            </p>
          </div>
          <div className="p-3 bg-white/80 rounded-2xl border border-[#E9ECEF]">
            <p className="text-[11px] font-semibold text-[#6C757D]">Persentase Terpakai</p>
            <p className="text-sm sm:text-base font-extrabold text-[#1F4130] mt-0.5">
              {evaluation.usagePercentage.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Explanation and Advice */}
        <div className="mt-5 space-y-3">
          <div className="p-4 rounded-2xl bg-white border border-[#E9ECEF] shadow-2xs">
            <h4 className="text-xs font-bold text-[#1F4130] mb-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#2D5A43]" /> Penjelasan Hasil Evaluasi:
            </h4>
            <p className="text-xs text-[#495057] leading-relaxed">
              "{evaluation.message}"
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F7F5EC] border border-[#E5E0CE]">
            <h4 className="text-xs font-bold text-[#2D5A43] mb-1 flex items-center gap-1.5">
              💡 Rekomendasi & Saran Periode Berikutnya:
            </h4>
            <p className="text-xs text-[#52796F] leading-relaxed">
              {evaluation.advice}
            </p>
          </div>
        </div>

        {/* Action Button: Allocate Remaining to Savings if HEMAT */}
        {evaluation.category === 'HEMAT' && evaluation.remainingAmount > 0 && onGoToSavings && (
          <div className="mt-5 pt-4 border-t border-[#D5E1D9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-[#1F4130]">
                Ada sisa Rp {evaluation.remainingAmount.toLocaleString('id-ID')} dari anggaranmu!
              </p>
              <p className="text-[11px] text-[#52796F]">
                Kunci keberhasilan finansial adalah segera menyisihkan sisa uang ke tabungan.
              </p>
            </div>
            <button
              onClick={onGoToSavings}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-[#2D5A43] text-white text-xs font-bold hover:bg-[#234835] shadow-xs active:scale-95 transition-all"
            >
              <PiggyBank className="w-4 h-4" />
              <span>Alokasikan ke Tabungan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Evaluation Rubric / Criteria Guide */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E9ECEF] shadow-xs">
        <h3 className="text-sm font-bold text-[#1F4130] mb-3">
          Pedoman Kriteria Evaluasi KantongKu:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-[#EBF4EE] border border-[#CDE3D5]">
            <div className="flex items-center gap-1.5 font-bold text-xs text-[#2D5A43] mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2D5A43]" />
              <span>HEMAT</span>
            </div>
            <p className="text-[11px] text-[#52796F]">
              Penggunaan anggaran maksimal <b>≤ 80%</b>. Berhasil menjaga pengeluaran dan memiliki ruang menabung.
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#FFF9DB] border border-[#FFE066]">
            <div className="flex items-center gap-1.5 font-bold text-xs text-[#B07D14] mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F4C430]" />
              <span>TERATUR</span>
            </div>
            <p className="text-[11px] text-[#7A5B0B]">
              Penggunaan anggaran <b>&gt; 80% sampai 100%</b>. Masih sesuai rencana, waspadai pengeluaran dadakan.
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#FFF5F5] border border-[#FFA8A8]">
            <div className="flex items-center gap-1.5 font-bold text-xs text-[#E63946] mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E63946]" />
              <span>MELEBIHI ANGGARAN</span>
            </div>
            <p className="text-[11px] text-[#C92A2A]">
              Penggunaan anggaran <b>&gt; 100%</b>. Memerlukan penyesuaian gaya belanja pada periode mendatang.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
