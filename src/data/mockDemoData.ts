import {
  UserProfile,
  Transaction,
  BudgetConfig,
  SavingGoal,
  ParentChildLink,
  ParentMessage,
  NotificationItem,
} from '../types';

export const DEMO_STUDENT: UserProfile = {
  id: 'demo-student-amelia',
  name: 'Amelia',
  email: 'amelia.demo@kantongku.id',
  role: 'student',
  gradeOrCampus: 'Mahasiswa S1 Universitas Indonesia',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  isDemo: true,
};

export const DEMO_PARENT: UserProfile = {
  id: 'demo-parent-amelia',
  name: 'Bunda Amelia',
  email: 'bunda.amelia@kantongku.id',
  role: 'parent',
  gradeOrCampus: 'Orang Tua Pendamping',
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  isDemo: true,
};

// Calculate dates relative to today
const today = new Date();
const formatDate = (d: Date) => d.toISOString().split('T')[0];

const dStart = new Date(today);
dStart.setDate(today.getDate() - 3); // Started 3 days ago

const dEnd = new Date(today);
dEnd.setDate(today.getDate() + 4); // Ends in 4 days (7 day weekly period)

export const DEMO_BUDGET: BudgetConfig = {
  id: 'budget-amelia-weekly-1',
  userId: 'demo-student-amelia',
  period: 'weekly',
  startDate: formatDate(dStart),
  endDate: formatDate(dEnd),
  totalAmount: 200000,
  categoryBudgets: [
    { category: 'Makan', allocatedAmount: 80000 },
    { category: 'Transportasi', allocatedAmount: 40000 },
    { category: 'Kebutuhan Kuliah', allocatedAmount: 30000 },
    { category: 'Jajan', allocatedAmount: 30000 },
    { category: 'Hadiah & Lain-lain', allocatedAmount: 20000 },
  ],
};

const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);

const twoDaysAgo = new Date(today);
twoDaysAgo.setDate(today.getDate() - 2);

const threeDaysAgo = new Date(today);
threeDaysAgo.setDate(today.getDate() - 3);

export const DEMO_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-income-1',
    userId: 'demo-student-amelia',
    title: 'Uang Saku Mingguan dari Bunda',
    amount: 200000,
    type: 'income',
    category: 'Uang Saku Orang Tua',
    date: formatDate(threeDaysAgo),
    note: 'Uang saku minggu ke-2 bulan ini',
    source: 'parent',
    createdAt: new Date(threeDaysAgo.getTime() + 1000 * 60 * 60 * 8).toISOString(),
  },
  {
    id: 'tx-exp-1',
    userId: 'demo-student-amelia',
    title: 'Makan Siang Kantin Kampus',
    amount: 35000,
    type: 'expense',
    category: 'Makan',
    date: formatDate(threeDaysAgo),
    note: 'Nasi ayam + es teh manis',
    createdAt: new Date(threeDaysAgo.getTime() + 1000 * 60 * 60 * 13).toISOString(),
  },
  {
    id: 'tx-exp-2',
    userId: 'demo-student-amelia',
    title: 'Ongkos KRL & Ojek Online',
    amount: 20000,
    type: 'expense',
    category: 'Transportasi',
    date: formatDate(twoDaysAgo),
    note: 'Perjalanan pulang pergi kampus',
    createdAt: new Date(twoDaysAgo.getTime() + 1000 * 60 * 60 * 9).toISOString(),
  },
  {
    id: 'tx-exp-3',
    userId: 'demo-student-amelia',
    title: 'Fotokopi Diktat Kuliah & Map',
    amount: 25000,
    type: 'expense',
    category: 'Kebutuhan Kuliah',
    date: formatDate(twoDaysAgo),
    note: 'Materi kuliah semester baru',
    createdAt: new Date(twoDaysAgo.getTime() + 1000 * 60 * 60 * 15).toISOString(),
  },
  {
    id: 'tx-exp-4',
    userId: 'demo-student-amelia',
    title: 'Makan Siang & Air Mineral',
    amount: 30000,
    type: 'expense',
    category: 'Makan',
    date: formatDate(yesterday),
    note: 'Soto ayam kampus',
    createdAt: new Date(yesterday.getTime() + 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: 'tx-exp-5',
    userId: 'demo-student-amelia',
    title: 'Kopi & Roti Sore',
    amount: 25000,
    type: 'expense',
    category: 'Jajan',
    date: formatDate(yesterday),
    note: 'Nugas bareng teman kelompok',
    createdAt: new Date(yesterday.getTime() + 1000 * 60 * 60 * 16).toISOString(),
  },
  {
    id: 'tx-exp-6',
    userId: 'demo-student-amelia',
    title: 'Bensin Motor / Angkutan Feeder',
    amount: 15000,
    type: 'expense',
    category: 'Transportasi',
    date: formatDate(today),
    note: 'Isi pertalite motor',
    createdAt: new Date(today.getTime() + 1000 * 60 * 60 * 9).toISOString(),
  },
];
// Total Expense in demo = 35000 + 20000 + 25000 + 30000 + 25000 + 15000 = Rp 150.000!
// Total Income = Rp 200.000.
// Sisa Anggaran = Rp 50.000.
// Persentase Terpakai = 75% -> Kategori Evaluasi: HEMAT (<= 80%)!

export const DEMO_SAVING_GOALS: SavingGoal[] = [
  {
    id: 'goal-laptop',
    userId: 'demo-student-amelia',
    name: 'Membeli Laptop',
    targetAmount: 5000000,
    currentAmount: 250000,
    targetDate: '2027-06-30',
    category: 'Teknologi & Belajar',
    iconName: 'Laptop',
    createdAt: '2026-09-01T00:00:00.000Z',
    history: [
      {
        id: 'sh-1',
        amount: 150000,
        date: '2026-10-15',
        note: 'Tabungan awal dari sisa uang saku',
      },
      {
        id: 'sh-2',
        amount: 100000,
        date: '2026-11-01',
        note: 'Alokasi sisa evaluasi HEMAT bulan lalu',
      },
    ],
  },
  {
    id: 'goal-books',
    userId: 'demo-student-amelia',
    name: 'Buku Referensi Kuliah & Kursus',
    targetAmount: 500000,
    currentAmount: 100000,
    targetDate: '2026-12-25',
    category: 'Pendidikan',
    iconName: 'BookOpen',
    createdAt: '2026-10-01T00:00:00.000Z',
    history: [
      {
        id: 'sh-3',
        amount: 100000,
        date: '2026-10-28',
        note: 'Tabungan bonus tugas',
      },
    ],
  },
];
// Total savings = 250.000 + 100.000 = Rp 350.000! (Matches prompt requirement)

export const DEMO_PARENT_LINK: ParentChildLink = {
  id: 'link-amelia-bunda',
  childId: 'demo-student-amelia',
  childName: 'Amelia',
  parentId: 'demo-parent-amelia',
  parentName: 'Bunda Amelia',
  inviteCode: 'KTK-AME-8921',
  status: 'connected',
  connectedAt: '2026-10-01T10:00:00.000Z',
  permissions: {
    shareBudgetSummary: true,
    shareTransactionDetails: true,
    shareSavingsGoals: true,
    shareAiEvaluation: true,
  },
};

export const DEMO_MESSAGES: ParentMessage[] = [
  {
    id: 'msg-1',
    senderId: 'demo-parent-amelia',
    senderName: 'Bunda Amelia',
    senderRole: 'parent',
    recipientId: 'demo-student-amelia',
    content: 'Bunda sudah transfer uang saku mingguan Rp 200.000 ya sayang. Jangan lupa sisihkan sebagian uang sakumu untuk ditabung!',
    createdAt: new Date(threeDaysAgo.getTime() + 1000 * 60 * 60 * 8).toISOString(),
    type: 'pocket_money_alert',
    amountAttached: 200000,
  },
  {
    id: 'msg-2',
    senderId: 'demo-parent-amelia',
    senderName: 'Bunda Amelia',
    senderRole: 'parent',
    recipientId: 'demo-student-amelia',
    content: 'Hebat Amelia! Bunda lihat status keuanganmu minggu ini HEMAT. Pertahankan terus ya nak.',
    createdAt: new Date(yesterday.getTime() + 1000 * 60 * 60 * 18).toISOString(),
    type: 'advice',
  },
];

export const DEMO_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'demo-student-amelia',
    title: 'Evaluasi Mingguan: HEMAT 🌟',
    message: 'Pengeluaranmu saat ini 75% dari anggaran mingguan. Kamu berhasil menghemat uang saku dengan sangat baik!',
    type: 'success',
    timestamp: new Date(yesterday.getTime() + 1000 * 60 * 60 * 17).toISOString(),
    read: false,
  },
  {
    id: 'notif-2',
    userId: 'demo-student-amelia',
    title: 'Pesan dari Bunda Amelia',
    message: '"Jangan lupa sisihkan sebagian uang sakumu untuk ditabung ya nak!"',
    type: 'info',
    timestamp: new Date(threeDaysAgo.getTime() + 1000 * 60 * 60 * 8).toISOString(),
    read: true,
  },
  {
    id: 'notif-3',
    userId: 'demo-student-amelia',
    title: 'Batas Pengeluaran Harian',
    message: 'Rekomendasi penggunaan uang hari ini adalah Rp 12.500 agar uang sakumu cukup sampai akhir periode.',
    type: 'info',
    timestamp: new Date(today.getTime() + 1000 * 60 * 60 * 7).toISOString(),
    read: false,
  },
];
