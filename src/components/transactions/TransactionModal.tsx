import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Transaction, TransactionType, TransactionCategory } from '../../types';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Calendar,
  Tag,
  FileText,
  DollarSign,
} from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Transaction, 'id' | 'userId' | 'createdAt'>) => void;
  onUpdate?: (id: string, data: Partial<Transaction>) => void;
  editingTransaction?: Transaction | null;
}

const CATEGORIES: TransactionCategory[] = [
  'Makan',
  'Transportasi',
  'Kebutuhan Kuliah',
  'Jajan',
  'Hiburan',
  'Tabungan',
  'Kesehatan',
  'Uang Saku Orang Tua',
  'Hadiah & Lain-lain',
];

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onUpdate,
  editingTransaction,
}) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState<TransactionCategory>('Makan');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingTransaction) {
      setTitle(editingTransaction.title);
      setAmount(editingTransaction.amount.toString());
      setType(editingTransaction.type);
      setCategory(editingTransaction.category);
      setDate(editingTransaction.date);
      setNote(editingTransaction.note || '');
    } else {
      setTitle('');
      setAmount('');
      setType('expense');
      setCategory('Makan');
      setDate(new Date().toISOString().split('T')[0]);
      setNote('');
      setError('');
    }
  }, [editingTransaction, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount.replace(/[^0-9]/g, ''));
    if (!title.trim()) {
      setError('Nama transaksi tidak boleh kosong.');
      return;
    }
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Nominal harus lebih besar dari Rp 0.');
      return;
    }

    if (editingTransaction && onUpdate) {
      onUpdate(editingTransaction.id, {
        title: title.trim(),
        amount: numAmount,
        type,
        category,
        date,
        note: note.trim(),
      });
    } else {
      onSubmit({
        title: title.trim(),
        amount: numAmount,
        type,
        category,
        date,
        note: note.trim(),
      });
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingTransaction ? 'Edit Catatan Transaksi' : 'Catat Transaksi Baru'}
      description="Uang saku yang tercatat rapi adalah awal masa depan cerah."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Toggle: Pengeluaran vs Pemasukan */}
        <div>
          <label className="block text-xs font-bold text-[#1F4130] mb-1.5">
            Jenis Transaksi
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setType('expense');
                if (category === 'Uang Saku Orang Tua') setCategory('Makan');
              }}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl border text-xs font-bold transition-all ${
                type === 'expense'
                  ? 'border-[#E63946] bg-[#FFF5F5] text-[#E63946] shadow-xs'
                  : 'border-[#E9ECEF] text-[#6C757D] hover:bg-[#F8F9FA]'
              }`}
            >
              <ArrowDownCircle className="w-4 h-4" />
              <span>Pengeluaran</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setType('income');
                setCategory('Uang Saku Orang Tua');
              }}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl border text-xs font-bold transition-all ${
                type === 'income'
                  ? 'border-[#2D5A43] bg-[#EBF4EE] text-[#2D5A43] shadow-xs'
                  : 'border-[#E9ECEF] text-[#6C757D] hover:bg-[#F8F9FA]'
              }`}
            >
              <ArrowUpCircle className="w-4 h-4" />
              <span>Pemasukan</span>
            </button>
          </div>
        </div>

        {/* Error notice */}
        {error && (
          <div className="p-2.5 rounded-xl bg-red-50 text-red-600 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Nominal / Amount */}
        <div>
          <label className="block text-xs font-semibold text-[#495057] mb-1">
            Nominal Uang (Rp)
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-sm font-bold text-[#52796F]">
              Rp
            </span>
            <input
              type="number"
              required
              min="1"
              step="500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-[#CED4DA] focus:border-[#2D5A43] text-sm font-bold text-[#1F4130] focus:ring-1 focus:ring-[#2D5A43] transition-colors"
            />
          </div>
          {amount && !isNaN(Number(amount)) && (
            <p className="text-[11px] text-[#52796F] mt-1 font-medium">
              Terbaca: Rp {Number(amount).toLocaleString('id-ID')}
            </p>
          )}
        </div>

        {/* Transaction Title */}
        <div>
          <label className="block text-xs font-semibold text-[#495057] mb-1">
            Nama Transaksi
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Makan Siang Nasi Padang / Beli Kuota"
            className="w-full px-3.5 py-2.5 rounded-2xl border border-[#CED4DA] focus:border-[#2D5A43] text-xs font-medium text-[#1F4130] transition-colors"
          />
        </div>

        {/* Category & Date Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#495057] mb-1">
              Kategori
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as TransactionCategory)}
              className="w-full px-3 py-2.5 rounded-2xl border border-[#CED4DA] focus:border-[#2D5A43] text-xs font-medium text-[#1F4130] bg-white transition-colors"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#495057] mb-1">
              Tanggal
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-2xl border border-[#CED4DA] focus:border-[#2D5A43] text-xs font-medium text-[#1F4130] transition-colors"
            />
          </div>
        </div>

        {/* Additional Note */}
        <div>
          <label className="block text-xs font-semibold text-[#495057] mb-1">
            Catatan Tambahan (Opsional)
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Keterangan singkat..."
            className="w-full px-3.5 py-2.5 rounded-2xl border border-[#CED4DA] focus:border-[#2D5A43] text-xs font-medium text-[#1F4130] transition-colors"
          />
        </div>

        {/* Buttons */}
        <div className="pt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl border border-[#CED4DA] text-xs font-bold text-[#6C757D] hover:bg-[#F8F9FA] transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            className="flex-1 py-3 rounded-2xl bg-[#2D5A43] hover:bg-[#234835] text-white text-xs font-bold shadow-md transition-all active:scale-98"
          >
            {editingTransaction ? 'Simpan Perubahan' : 'Catat Sekarang'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
