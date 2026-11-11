import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar,
  CheckCircle,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';

export const FinancialAnalytics: React.FC = () => {
  const { transactions, budget, categorySpending, totalExpense } = useApp();
  const [chartView, setChartView] = useState<'daily' | 'category'>('daily');

  // Calculate daily spending over the last 7 days
  const dailyData = useMemo(() => {
    const days: { label: string; dateStr: string; amount: number }[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' });

      const dayTotal = transactions
        .filter((t) => t.type === 'expense' && t.date === dateStr)
        .reduce((sum, t) => sum + t.amount, 0);

      days.push({ label: dayLabel, dateStr, amount: dayTotal });
    }
    return days;
  }, [transactions]);

  const maxDaily = useMemo(() => {
    const max = Math.max(...dailyData.map((d) => d.amount), 10000);
    return max;
  }, [dailyData]);

  // Compare recent 3 days vs prior 3 days for authentic comparison
  const periodComparison = useMemo(() => {
    const today = new Date();
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(today.getDate() - 3);
    const sixDaysAgo = new Date(today);
    sixDaysAgo.setDate(today.getDate() - 6);

    const dTodayStr = today.toISOString().split('T')[0];
    const d3Str = threeDaysAgo.toISOString().split('T')[0];
    const d6Str = sixDaysAgo.toISOString().split('T')[0];

    const currentPeriodExpense = transactions
      .filter((t) => t.type === 'expense' && t.date >= d3Str && t.date <= dTodayStr)
      .reduce((s, t) => s + t.amount, 0);

    const prevPeriodExpense = transactions
      .filter((t) => t.type === 'expense' && t.date >= d6Str && t.date < d3Str)
      .reduce((s, t) => s + t.amount, 0);

    let diffPercent = 0;
    let isLower = false;

    if (prevPeriodExpense > 0) {
      diffPercent = Math.round(((currentPeriodExpense - prevPeriodExpense) / prevPeriodExpense) * 100);
      isLower = diffPercent < 0;
    } else if (currentPeriodExpense > 0) {
      diffPercent = 100;
      isLower = false;
    }

    return {
      current: currentPeriodExpense,
      previous: prevPeriodExpense,
      diffPercent: Math.abs(diffPercent),
      isLower,
    };
  }, [transactions]);

  // Sort categories by expenditure
  const sortedCategories = useMemo(() => {
    return Object.entries(categorySpending).sort((a, b) => b[1] - a[1]);
  }, [categorySpending]);

  return (
    <div className="space-y-5 animate-fade-in pb-20">
      <div>
        <h1 className="text-2xl font-extrabold text-[#1F4130] tracking-tight">
          Analisis Keuangan
        </h1>
        <p className="text-xs text-[#52796F] mt-0.5">
          Visualisasi data transaksi nyata dan tren pengeluaran uang saku
        </p>
      </div>

      {/* Period Comparison Insight Banner (Accurate Real-Data Conclusion) */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-[#F7F5EC] to-[#EBF4EE] border border-[#D5E1D9] flex items-start gap-3.5 shadow-xs">
        <div
          className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
            periodComparison.isLower
              ? 'bg-[#EBF4EE] text-[#2D5A43]'
              : 'bg-[#FFF5F5] text-[#E63946]'
          }`}
        >
          {periodComparison.isLower ? (
            <TrendingDown className="w-5 h-5 stroke-[2.5]" />
          ) : (
            <TrendingUp className="w-5 h-5 stroke-[2.5]" />
          )}
        </div>
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#52796F]">
            Kesimpulan Otomatis KantongKu
          </span>
          <p className="text-sm font-bold text-[#1F4130] mt-0.5">
            {periodComparison.previous > 0
              ? periodComparison.isLower
                ? `Pengeluaranmu periode ini turun ${periodComparison.diffPercent}% dibandingkan periode sebelumnya.`
                : `Pengeluaranmu periode ini naik ${periodComparison.diffPercent}% dibandingkan periode sebelumnya.`
              : 'Pengeluaran stabil dan terkontrol sesuai pencatatan awal periode.'}
          </p>
          <p className="text-xs text-[#6C757D] mt-1">
            Realisasi 3 hari terakhir: <b>Rp {periodComparison.current.toLocaleString('id-ID')}</b> vs periode sebelumnya: <b>Rp {periodComparison.previous.toLocaleString('id-ID')}</b>.
          </p>
        </div>
      </div>

      {/* Chart View Toggle */}
      <div className="p-5 rounded-3xl bg-white border border-[#E9ECEF] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F1F3F5]">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#2D5A43]" />
            <h3 className="text-sm font-bold text-[#1F4130]">
              Grafik Pengeluaran Riil
            </h3>
          </div>
          <div className="flex items-center gap-1.5 bg-[#F1F3F5] p-1 rounded-2xl">
            <button
              onClick={() => setChartView('daily')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                chartView === 'daily'
                  ? 'bg-white text-[#2D5A43] shadow-xs'
                  : 'text-[#6C757D] hover:text-[#1F4130]'
              }`}
            >
              Harian (7 Hari)
            </button>
            <button
              onClick={() => setChartView('category')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                chartView === 'category'
                  ? 'bg-white text-[#2D5A43] shadow-xs'
                  : 'text-[#6C757D] hover:text-[#1F4130]'
              }`}
            >
              Per Kategori
            </button>
          </div>
        </div>

        {/* View 1: Daily Bar Chart */}
        {chartView === 'daily' && (
          <div className="space-y-4 pt-2">
            <div className="flex items-end justify-between gap-2 h-44 px-2 pt-6 pb-2 border-b border-[#E9ECEF]">
              {dailyData.map((d, idx) => {
                const heightPercent = Math.max(8, (d.amount / maxDaily) * 100);
                const isToday = idx === dailyData.length - 1;
                return (
                  <div key={d.dateStr} className="flex-1 flex flex-col items-center h-full justify-end group">
                    {/* Tooltip on hover */}
                    <span className="text-[10px] font-extrabold text-[#2D5A43] opacity-0 group-hover:opacity-100 transition-opacity mb-1 whitespace-nowrap">
                      Rp {(d.amount / 1000).toFixed(0)}k
                    </span>

                    {/* Bar */}
                    <div
                      className={`w-full max-w-[36px] rounded-t-xl transition-all duration-500 ${
                        isToday
                          ? 'bg-[#2D5A43]'
                          : d.amount > 0
                          ? 'bg-[#84A98C] hover:bg-[#52796F]'
                          : 'bg-[#E9ECEF]'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />

                    {/* X-axis label */}
                    <span className="text-[10px] font-semibold text-[#868E96] mt-2 text-center truncate max-w-full">
                      {d.label}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between items-center text-xs text-[#6C757D] px-2">
              <span>Rata-rata: Rp {Math.round(totalExpense / 7).toLocaleString('id-ID')} / hari</span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#2D5A43]" /> Hari Ini
              </span>
            </div>
          </div>
        )}

        {/* View 2: Category Breakdown */}
        {chartView === 'category' && (
          <div className="space-y-3 pt-2">
            {sortedCategories.length === 0 ? (
              <p className="text-xs text-[#868E96] text-center py-6">
                Belum ada pengeluaran yang tercatat.
              </p>
            ) : (
              sortedCategories.map(([cat, amt]) => {
                const percent = totalExpense > 0 ? (amt / totalExpense) * 100 : 0;
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-[#1F4130]">{cat}</span>
                      <span className="text-[#2D5A43] font-bold">
                        Rp {amt.toLocaleString('id-ID')}{' '}
                        <span className="text-[#6C757D] text-[10px]">
                          ({percent.toFixed(1)}%)
                        </span>
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-[#F1F3F5] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#84A98C] to-[#2D5A43] rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};
