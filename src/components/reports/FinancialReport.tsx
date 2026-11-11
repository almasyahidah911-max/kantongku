import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { jsPDF } from 'jspdf';
import {
  FileSpreadsheet,
  Download,
  Calendar,
  CheckCircle2,
  TrendingDown,
  PieChart,
  User,
  ShieldCheck,
  Printer,
} from 'lucide-react';

export const FinancialReport: React.FC = () => {
  const {
    currentUser,
    budget,
    transactions,
    totalIncome,
    totalExpense,
    remainingBudget,
    usagePercentage,
    evaluation,
    categorySpending,
    parentLink,
  } = useApp();

  const [reportPeriod, setReportPeriod] = useState<'weekly' | 'monthly'>(budget.period);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleDownloadPdf = () => {
    setIsGeneratingPdf(true);
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Header Banner
      doc.setFillColor(45, 90, 67); // #2D5A43
      doc.rect(0, 0, 210, 30, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('KANTONGKU – LAPORAN PENGELOLAAN UANG SAKU', 14, 15);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text('Slogan: "Kelola Uangmu, Atur Masa Depanmu!" | www.kantongku.id', 14, 22);

      // Meta Information Box
      doc.setTextColor(31, 65, 48);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('DATA PENGGUNA & PERIODE', 14, 38);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(73, 80, 87);
      doc.text(`Nama Pelajar/Mahasiswa: ${currentUser?.name || 'Amelia'}`, 14, 44);
      doc.text(`Instansi / Tingkat: ${currentUser?.gradeOrCampus || 'Mahasiswa'}`, 14, 49);
      doc.text(`Periode Laporan: ${reportPeriod === 'weekly' ? 'Mingguan' : 'Bulanan'} (${budget.startDate} s/d ${budget.endDate})`, 14, 54);
      doc.text(`Pendamping Orang Tua: ${parentLink?.parentName || 'Bunda Amelia'} (${parentLink?.status === 'connected' ? 'Terhubung' : 'Mandiri'})`, 14, 59);

      // Divider line
      doc.setDrawColor(205, 227, 213);
      doc.setLineWidth(0.5);
      doc.line(14, 63, 196, 63);

      // Financial Summary Metrics Table
      doc.setTextColor(31, 65, 48);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('RINGKASAN KEUANGAN & EVALUASI', 14, 70);

      doc.setFillColor(247, 245, 236); // #F7F5EC
      doc.rect(14, 73, 182, 28, 'F');

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(108, 117, 125);
      doc.text('Total Uang Saku', 20, 80);
      doc.text('Total Pengeluaran', 65, 80);
      doc.text('Sisa Saldo', 110, 80);
      doc.text('Status Evaluasi', 155, 80);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(45, 90, 67);
      doc.text(`Rp ${budget.totalAmount.toLocaleString('id-ID')}`, 20, 88);

      doc.setTextColor(230, 57, 70);
      doc.text(`Rp ${totalExpense.toLocaleString('id-ID')}`, 65, 88);

      doc.setTextColor(45, 90, 67);
      doc.text(`Rp ${remainingBudget.toLocaleString('id-ID')}`, 110, 88);

      doc.setTextColor(31, 65, 48);
      doc.text(`${evaluation.category} (${usagePercentage.toFixed(1)}%)`, 155, 88);

      // Evaluation Note
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(82, 121, 111);
      doc.text(`Catatan Evaluasi: "${evaluation.message}"`, 20, 96);

      // Category Table
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(31, 65, 48);
      doc.text('RINCIAN PENGELUARAN PER KATEGORI', 14, 110);

      let curY = 117;
      doc.setFillColor(235, 244, 238);
      doc.rect(14, curY - 5, 182, 7, 'F');
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(45, 90, 67);
      doc.text('Kategori', 18, curY);
      doc.text('Realisasi Pengeluaran', 90, curY);
      doc.text('Persentase dari Total', 150, curY);

      curY += 7;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(50, 50, 50);

      Object.entries(categorySpending).forEach(([cat, amt]) => {
        const p = totalExpense > 0 ? ((amt / totalExpense) * 100).toFixed(1) : '0';
        doc.text(cat, 18, curY);
        doc.text(`Rp ${amt.toLocaleString('id-ID')}`, 90, curY);
        doc.text(`${p}%`, 150, curY);
        doc.setDrawColor(240, 240, 240);
        doc.line(14, curY + 2, 196, curY + 2);
        curY += 7;
      });

      // Transaction Table Header
      curY += 6;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(31, 65, 48);
      doc.text('DAFTAR TRANSAKSI LENGKAP', 14, curY);

      curY += 7;
      doc.setFillColor(235, 244, 238);
      doc.rect(14, curY - 5, 182, 7, 'F');
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(45, 90, 67);
      doc.text('Tanggal', 18, curY);
      doc.text('Nama Transaksi', 45, curY);
      doc.text('Kategori', 115, curY);
      doc.text('Nominal (Rp)', 160, curY);

      curY += 7;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(50, 50, 50);

      transactions.slice(0, 12).forEach((tx) => {
        if (curY > 260) return; // avoid page overflow for clean 1-page summary
        doc.text(tx.date, 18, curY);
        doc.text(tx.title.slice(0, 32), 45, curY);
        doc.text(tx.category.slice(0, 20), 115, curY);
        doc.text(`${tx.type === 'income' ? '+' : '-'} ${tx.amount.toLocaleString('id-ID')}`, 160, curY);
        doc.setDrawColor(245, 245, 245);
        doc.line(14, curY + 2, 196, curY + 2);
        curY += 6.5;
      });

      // Signatures
      curY = Math.max(curY + 12, 260);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text('Dibuat dan diverifikasi oleh:', 25, curY);
      doc.text('Mengetahui Orang Tua Pendamping:', 125, curY);

      curY += 15;
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(31, 65, 48);
      doc.text(`(${currentUser?.name || 'Amelia'})`, 25, curY);
      doc.text(`(${parentLink?.parentName || 'Bunda Amelia'})`, 125, curY);

      // Save PDF
      doc.save(`Laporan_Keuangan_KantongKu_${currentUser?.name || 'Amelia'}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in pb-20">
      {/* Header and Download Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1F4130] tracking-tight">
            Laporan Keuangan
          </h1>
          <p className="text-xs text-[#52796F] mt-0.5">
            Laporan komprehensif siap unduh dan cetak untuk evaluasi berkala
          </p>
        </div>

        <button
          onClick={handleDownloadPdf}
          disabled={isGeneratingPdf}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#2D5A43] hover:bg-[#234835] text-white font-bold text-xs shadow-md shadow-[#2D5A43]/20 active:scale-95 transition-all shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>{isGeneratingPdf ? 'Membuat PDF...' : 'Unduh Laporan PDF'}</span>
        </button>
      </div>

      {/* Period Selector Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setReportPeriod('weekly')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            reportPeriod === 'weekly'
              ? 'bg-[#2D5A43] text-white shadow-xs'
              : 'bg-white border border-[#CED4DA] text-[#6C757D]'
          }`}
        >
          Laporan Mingguan
        </button>
        <button
          onClick={() => setReportPeriod('monthly')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            reportPeriod === 'monthly'
              ? 'bg-[#2D5A43] text-white shadow-xs'
              : 'bg-white border border-[#CED4DA] text-[#6C757D]'
          }`}
        >
          Laporan Bulanan
        </button>
      </div>

      {/* Report Document Sheet Preview */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E9ECEF] shadow-sm space-y-6">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E9ECEF]">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-[#1F4130]">
                KantongKu Financial Statement
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#EBF4EE] text-[#2D5A43] text-[10px] font-bold">
                {reportPeriod === 'weekly' ? 'Mingguan' : 'Bulanan'}
              </span>
            </div>
            <p className="text-xs text-[#6C757D] mt-0.5">
              Periode: {budget.startDate} s/d {budget.endDate}
            </p>
          </div>
          <div className="text-left sm:text-right text-xs">
            <p className="font-bold text-[#1F4130]">{currentUser?.name}</p>
            <p className="text-[#6C757D]">{currentUser?.gradeOrCampus}</p>
          </div>
        </div>

        {/* Financial Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-[#F8F9FA] border border-[#E9ECEF]">
            <p className="text-[10px] text-[#6C757D] font-bold uppercase">Total Uang Saku</p>
            <p className="text-base font-extrabold text-[#1F4130] mt-0.5">
              Rp {budget.totalAmount.toLocaleString('id-ID')}
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#FFF5F5] border border-[#FFA8A8]">
            <p className="text-[10px] text-[#E63946] font-bold uppercase">Total Pengeluaran</p>
            <p className="text-base font-extrabold text-[#E63946] mt-0.5">
              Rp {totalExpense.toLocaleString('id-ID')}
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#EBF4EE] border border-[#CDE3D5]">
            <p className="text-[10px] text-[#2D5A43] font-bold uppercase">Sisa Anggaran</p>
            <p className="text-base font-extrabold text-[#2D5A43] mt-0.5">
              Rp {remainingBudget.toLocaleString('id-ID')}
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#F7F5EC] border border-[#D5E1D9]">
            <p className="text-[10px] text-[#52796F] font-bold uppercase">Hasil Evaluasi</p>
            <p className="text-base font-black text-[#1F4130] mt-0.5">
              {evaluation.category}
            </p>
          </div>
        </div>

        {/* Category Breakdown Table */}
        <div>
          <h4 className="text-xs font-bold text-[#1F4130] uppercase mb-2">
            Rincian Pengeluaran per Kategori
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] text-[#52796F] font-bold border-y border-[#E9ECEF]">
                <tr>
                  <th className="py-2.5 px-3">Kategori</th>
                  <th className="py-2.5 px-3 text-right">Pengeluaran</th>
                  <th className="py-2.5 px-3 text-right">Persentase</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F3F5]">
                {Object.entries(categorySpending).map(([cat, amt]) => {
                  const p = totalExpense > 0 ? (amt / totalExpense) * 100 : 0;
                  return (
                    <tr key={cat}>
                      <td className="py-2.5 px-3 font-semibold text-[#1F4130]">{cat}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-[#2D5A43]">
                        Rp {amt.toLocaleString('id-ID')}
                      </td>
                      <td className="py-2.5 px-3 text-right text-[#6C757D]">
                        {p.toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Verification Note */}
        <div className="pt-4 border-t border-[#F1F3F5] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#6C757D] gap-2">
          <span>
            Laporan terverifikasi oleh algoritma kecerdasan finansial KantongKu.
          </span>
          <span className="font-semibold text-[#2D5A43]">
            Status Pendampingan: Terhubung dengan {parentLink?.parentName || 'Orang Tua'}
          </span>
        </div>
      </div>
    </div>
  );
};
