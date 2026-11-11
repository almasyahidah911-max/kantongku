import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Transaction, TransactionType, TransactionCategory } from '../../types';
import { TransactionModal } from './TransactionModal';
import {
  Plus,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  Edit2,
  Trash2,
  Calendar,
  Tag,
  FileText,
  AlertCircle,
} from 'lucide-react';

export const TransactionList: React.FC = () => {
  const {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    totalIncome,
    totalExpense,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | TransactionType>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.note && t.note.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchType = selectedType === 'all' || t.type === selectedType;
      const matchCategory = selectedCategory === 'all' || t.category === selectedCategory;
      return matchSearch && matchType && matchCategory;
    });
  }, [transactions, searchQuery, selectedType, selectedCategory]);

  const handleEdit = (tx: Transaction) => {
    setEditingTransaction(tx);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteTransaction(id);
    setDeleteConfirmId(null);
  };

  const getCategoryBadgeColor = (category: TransactionCategory) => {
    switch (category) {
      case 'Makan':
        return 'bg-[#FFF3D6] text-[#B07D14]';
      case 'Transportasi':
        return 'bg-[#E3FAFC] text-[#0C8599]';
      case 'Kebutuhan Kuliah':
        return 'bg-[#EBFBEE] text-[#2B8A3E]';
      case 'Jajan':
        return 'bg-[#FFF0F6] text-[#D6336C]';
      case 'Tabungan':
        return 'bg-[#F3E8FF] text-[#6B21A8]';
      case 'Uang Saku Orang Tua':
        return 'bg-[#EBF4EE] text-[#2D5A43] font-bold';
      default:
        return 'bg-[#F1F3F5] text-[#495057]';
    }
  };

  return (
    <div className="space-y-5 animate-fade-in pb-20">
      {/* Header and Summary stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1F4130] tracking-tight">
            Daftar Transaksi
          </h1>
          <p className="text-xs text-[#52796F] mt-0.5">
            Semua catatan pemasukan dan pengeluaran uang saku
          </p>
        </div>
        <button
          onClick={() => {
            setEditingTransaction(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#2D5A43] hover:bg-[#234835] text-white font-bold text-xs shadow-md shadow-[#2D5A43]/20 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Transaksi</span>
        </button>
      </div>

      {/* Mini Financial Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-3xl bg-white border border-[#E9ECEF] shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#52796F] mb-1">
            <span className="p-1 rounded-full bg-[#EBF4EE] text-[#2D5A43]">
              <ArrowDownLeft className="w-3.5 h-3.5" />
            </span>
            <span>Total Pemasukan</span>
          </div>
          <p className="text-lg sm:text-xl font-extrabold text-[#2D5A43]">
            Rp {totalIncome.toLocaleString('id-ID')}
          </p>
        </div>
        <div className="p-4 rounded-3xl bg-white border border-[#E9ECEF] shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#6C757D] mb-1">
            <span className="p-1 rounded-full bg-[#FFF5F5] text-[#E63946]">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
            <span>Total Pengeluaran</span>
          </div>
          <p className="text-lg sm:text-xl font-extrabold text-[#E63946]">
            Rp {totalExpense.toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 rounded-3xl bg-white border border-[#E9ECEF] shadow-xs space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#ADB5BD] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari transaksi berdasarkan nama atau catatan..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#CED4DA] focus:border-[#2D5A43] text-xs font-medium text-[#1F4130] transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-semibold text-[#6C757D] flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          <button
            onClick={() => setSelectedType('all')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              selectedType === 'all'
                ? 'bg-[#2D5A43] text-white'
                : 'bg-[#F1F3F5] text-[#495057] hover:bg-[#E9ECEF]'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setSelectedType('expense')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              selectedType === 'expense'
                ? 'bg-[#E63946] text-white'
                : 'bg-[#F1F3F5] text-[#495057] hover:bg-[#E9ECEF]'
            }`}
          >
            Pengeluaran
          </button>
          <button
            onClick={() => setSelectedType('income')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              selectedType === 'income'
                ? 'bg-[#2D5A43] text-white'
                : 'bg-[#F1F3F5] text-[#495057] hover:bg-[#E9ECEF]'
            }`}
          >
            Pemasukan
          </button>

          {/* Category Dropdown Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="ml-auto px-2.5 py-1 rounded-full border border-[#CED4DA] text-xs font-medium text-[#495057] bg-white"
          >
            <option value="all">Semua Kategori</option>
            <option value="Makan">Makan</option>
            <option value="Transportasi">Transportasi</option>
            <option value="Kebutuhan Kuliah">Kebutuhan Kuliah</option>
            <option value="Jajan">Jajan</option>
            <option value="Hiburan">Hiburan</option>
            <option value="Tabungan">Tabungan</option>
            <option value="Uang Saku Orang Tua">Uang Saku Orang Tua</option>
          </select>
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-2.5">
        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-[#E9ECEF]">
            <Tag className="w-10 h-10 text-[#CED4DA] mx-auto mb-2" />
            <h3 className="text-sm font-bold text-[#495057]">
              Belum ada transaksi yang sesuai
            </h3>
            <p className="text-xs text-[#868E96] mt-1 max-w-xs mx-auto">
              Coba sesuaikan kata kunci pencarian atau catat transaksi barumu sekarang.
            </p>
          </div>
        ) : (
          filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className="group p-4 rounded-3xl bg-white border border-[#E9ECEF] hover:border-[#84A98C] hover:shadow-sm transition-all flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Icon indicator */}
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                    tx.type === 'income'
                      ? 'bg-[#EBF4EE] text-[#2D5A43]'
                      : 'bg-[#FFF5F5] text-[#E63946]'
                  }`}
                >
                  {tx.type === 'income' ? (
                    <ArrowDownLeft className="w-5 h-5 stroke-[2.5]" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
                  )}
                </div>

                {/* Details */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-[#1F4130] truncate">
                      {tx.title}
                    </h4>
                    {tx.source === 'parent' && (
                      <span className="shrink-0 px-2 py-0.5 rounded-full bg-[#EBF4EE] text-[#2D5A43] text-[9px] font-extrabold">
                        Dari Orang Tua
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getCategoryBadgeColor(
                        tx.category
                      )}`}
                    >
                      {tx.category}
                    </span>
                    <span className="text-[10px] text-[#868E96] flex items-center gap-0.5">
                      <Calendar className="w-2.5 h-2.5" />
                      {new Date(tx.date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    {tx.note && (
                      <span className="text-[10px] text-[#6C757D] italic truncate max-w-[140px]">
                        • {tx.note}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Amount and Action buttons */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <span
                    className={`text-xs sm:text-sm font-extrabold ${
                      tx.type === 'income' ? 'text-[#2D5A43]' : 'text-[#E63946]'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : '-'} Rp{' '}
                    {tx.amount.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(tx)}
                    className="p-1.5 rounded-xl hover:bg-[#F1F3F5] text-[#6C757D] hover:text-[#2D5A43] transition-colors"
                    title="Edit transaksi"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(tx.id)}
                    className="p-1.5 rounded-xl hover:bg-[#FFF5F5] text-[#6C757D] hover:text-[#E63946] transition-colors"
                    title="Hapus transaksi"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-xs bg-white rounded-3xl p-5 border border-[#E9ECEF] shadow-xl text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-[#E63946] mx-auto" />
            <h4 className="text-sm font-bold text-[#1F4130]">Hapus Transaksi?</h4>
            <p className="text-xs text-[#6C757D]">
              Tindakan ini akan menghapus catatan dan memperbarui saldo serta evaluasi anggaranmu.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 rounded-xl border border-[#CED4DA] text-xs font-semibold text-[#6C757D]"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2 rounded-xl bg-[#E63946] text-white text-xs font-bold shadow-xs hover:bg-[#D90429]"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTransaction(null);
        }}
        onSubmit={addTransaction}
        onUpdate={updateTransaction}
        editingTransaction={editingTransaction}
      />
    </div>
  );
};
