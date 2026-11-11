export type UserRole = 'student' | 'parent';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  gradeOrCampus?: string; // e.g. "Mahasiswa Semester 3" or "SMA Kelas 11"
  isDemo?: boolean;
}

export type TransactionType = 'income' | 'expense';

export type TransactionCategory =
  | 'Makan'
  | 'Transportasi'
  | 'Kebutuhan Kuliah'
  | 'Jajan'
  | 'Hiburan'
  | 'Tabungan'
  | 'Kesehatan'
  | 'Uang Saku Orang Tua'
  | 'Hadiah & Lain-lain';

export interface Transaction {
  id: string;
  userId: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  date: string; // ISO date YYYY-MM-DD
  note?: string;
  source?: 'manual' | 'parent' | 'savings_allocation';
  createdAt: string;
}

export type BudgetPeriodType = 'weekly' | 'monthly';

export interface CategoryBudget {
  category: TransactionCategory;
  allocatedAmount: number;
}

export interface BudgetConfig {
  id: string;
  userId: string;
  period: BudgetPeriodType;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  totalAmount: number;
  categoryBudgets: CategoryBudget[];
}

export interface SavingGoal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string; // YYYY-MM-DD
  category: string;
  iconName: string;
  createdAt: string;
  history: {
    id: string;
    amount: number;
    date: string;
    note?: string;
  }[];
}

export interface ParentChildLink {
  id: string;
  childId: string;
  childName: string;
  parentId: string;
  parentName: string;
  inviteCode: string;
  status: 'pending' | 'connected' | 'disconnected';
  connectedAt?: string;
  permissions: {
    shareBudgetSummary: boolean;
    shareTransactionDetails: boolean;
    shareSavingsGoals: boolean;
    shareAiEvaluation: boolean;
  };
}

export interface ParentMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  recipientId: string;
  content: string;
  createdAt: string;
  type: 'advice' | 'pocket_money_alert' | 'general';
  amountAttached?: number;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'warning' | 'info' | 'success' | 'alert';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export type EvaluationCategory = 'HEMAT' | 'TERATUR' | 'MELEBIHI ANGGARAN';

export interface EvaluationResult {
  periodType: BudgetPeriodType;
  totalBudget: number;
  totalExpense: number;
  remainingAmount: number;
  usagePercentage: number;
  category: EvaluationCategory;
  message: string;
  advice: string;
  daysRemaining: number;
  dailyRecommendation: number;
}
