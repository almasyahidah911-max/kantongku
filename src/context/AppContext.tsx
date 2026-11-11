import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  UserProfile,
  UserRole,
  Transaction,
  BudgetConfig,
  SavingGoal,
  ParentChildLink,
  ParentMessage,
  NotificationItem,
  EvaluationResult,
  EvaluationCategory,
  TransactionCategory,
} from '../types';
import {
  DEMO_STUDENT,
  DEMO_PARENT,
  DEMO_BUDGET,
  DEMO_TRANSACTIONS,
  DEMO_SAVING_GOALS,
  DEMO_PARENT_LINK,
  DEMO_MESSAGES,
  DEMO_NOTIFICATIONS,
} from '../data/mockDemoData';

interface AppContextType {
  currentUser: UserProfile | null;
  activeRole: UserRole;
  showSplash: boolean;
  setShowSplash: (show: boolean) => void;
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
  transactions: Transaction[];
  budget: BudgetConfig;
  savingGoals: SavingGoal[];
  parentLink: ParentChildLink | null;
  messages: ParentMessage[];
  notifications: NotificationItem[];
  // Computed values
  totalIncome: number;
  totalExpense: number;
  currentBalance: number;
  remainingBudget: number;
  usagePercentage: number;
  daysRemaining: number;
  dailyRecommendation: number;
  evaluation: EvaluationResult;
  categorySpending: Record<string, number>;
  totalSavings: number;
  unreadNotificationsCount: number;
  // Actions
  addTransaction: (data: Omit<Transaction, 'id' | 'userId' | 'createdAt'>) => void;
  updateTransaction: (id: string, data: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  updateBudget: (config: Partial<BudgetConfig>) => void;
  addSavingGoal: (goal: Omit<SavingGoal, 'id' | 'userId' | 'currentAmount' | 'createdAt' | 'history'>) => void;
  addSavingDeposit: (goalId: string, amount: number, note?: string) => void;
  allocateBudgetToSavings: (goalId: string, amount: number) => boolean;
  givePocketMoneyAsParent: (amount: number, note?: string) => void;
  sendAdviceAsParent: (content: string) => void;
  sendReplyAsChild: (content: string) => void;
  connectParentChild: (code: string) => boolean;
  disconnectParentChild: () => void;
  updateSharePermissions: (perms: ParentChildLink['permissions']) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  loginAsDemo: (role: UserRole) => void;
  login: (email: string, role: UserRole, name?: string) => void;
  register: (name: string, email: string, role: UserRole, gradeOrCampus?: string) => void;
  logout: () => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'kantongku_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication & Session
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}user`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEMO_STUDENT;
      }
    }
    // Default to Demo Student (Amelia) for instant, out-of-the-box exploration
    return DEMO_STUDENT;
  });

  const [showSplash, setShowSplash] = useState<boolean>(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);

  const isDemo = currentUser?.isDemo !== false;
  const storagePrefix = isDemo ? `${STORAGE_KEY_PREFIX}demo_` : `${STORAGE_KEY_PREFIX}user_${currentUser?.id}_`;

  // Persistent States
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(`${storagePrefix}transactions`);
    return saved ? JSON.parse(saved) : DEMO_TRANSACTIONS;
  });

  const [budget, setBudget] = useState<BudgetConfig>(() => {
    const saved = localStorage.getItem(`${storagePrefix}budget`);
    return saved ? JSON.parse(saved) : DEMO_BUDGET;
  });

  const [savingGoals, setSavingGoals] = useState<SavingGoal[]>(() => {
    const saved = localStorage.getItem(`${storagePrefix}savings`);
    return saved ? JSON.parse(saved) : DEMO_SAVING_GOALS;
  });

  const [parentLink, setParentLink] = useState<ParentChildLink | null>(() => {
    const saved = localStorage.getItem(`${storagePrefix}parentlink`);
    return saved ? JSON.parse(saved) : DEMO_PARENT_LINK;
  });

  const [messages, setMessages] = useState<ParentMessage[]>(() => {
    const saved = localStorage.getItem(`${storagePrefix}messages`);
    return saved ? JSON.parse(saved) : DEMO_MESSAGES;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(`${storagePrefix}notifs`);
    return saved ? JSON.parse(saved) : DEMO_NOTIFICATIONS;
  });

  // Sync state when active user changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}user`, JSON.stringify(currentUser));
      const prefix = currentUser.isDemo ? `${STORAGE_KEY_PREFIX}demo_` : `${STORAGE_KEY_PREFIX}user_${currentUser.id}_`;
      
      const sT = localStorage.getItem(`${prefix}transactions`);
      setTransactions(sT ? JSON.parse(sT) : (currentUser.isDemo ? DEMO_TRANSACTIONS : []));

      const sB = localStorage.getItem(`${prefix}budget`);
      setBudget(sB ? JSON.parse(sB) : (currentUser.isDemo ? DEMO_BUDGET : {
        id: `budget-${currentUser.id}`,
        userId: currentUser.id,
        period: 'weekly',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        totalAmount: 200000,
        categoryBudgets: [
          { category: 'Makan', allocatedAmount: 80000 },
          { category: 'Transportasi', allocatedAmount: 40000 },
          { category: 'Kebutuhan Kuliah', allocatedAmount: 30000 },
          { category: 'Jajan', allocatedAmount: 30000 },
          { category: 'Hadiah & Lain-lain', allocatedAmount: 20000 },
        ],
      }));

      const sG = localStorage.getItem(`${prefix}savings`);
      setSavingGoals(sG ? JSON.parse(sG) : (currentUser.isDemo ? DEMO_SAVING_GOALS : []));

      const sL = localStorage.getItem(`${prefix}parentlink`);
      setParentLink(sL ? JSON.parse(sL) : (currentUser.isDemo ? DEMO_PARENT_LINK : null));

      const sM = localStorage.getItem(`${prefix}messages`);
      setMessages(sM ? JSON.parse(sM) : (currentUser.isDemo ? DEMO_MESSAGES : []));

      const sN = localStorage.getItem(`${prefix}notifs`);
      setNotifications(sN ? JSON.parse(sN) : (currentUser.isDemo ? DEMO_NOTIFICATIONS : []));
    } else {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}user`);
    }
  }, [currentUser?.id, currentUser?.role]);

  // Persist data updates to local storage
  useEffect(() => {
    localStorage.setItem(`${storagePrefix}transactions`, JSON.stringify(transactions));
  }, [transactions, storagePrefix]);

  useEffect(() => {
    localStorage.setItem(`${storagePrefix}budget`, JSON.stringify(budget));
  }, [budget, storagePrefix]);

  useEffect(() => {
    localStorage.setItem(`${storagePrefix}savings`, JSON.stringify(savingGoals));
  }, [savingGoals, storagePrefix]);

  useEffect(() => {
    localStorage.setItem(`${storagePrefix}parentlink`, JSON.stringify(parentLink));
  }, [parentLink, storagePrefix]);

  useEffect(() => {
    localStorage.setItem(`${storagePrefix}messages`, JSON.stringify(messages));
  }, [messages, storagePrefix]);

  useEffect(() => {
    localStorage.setItem(`${storagePrefix}notifs`, JSON.stringify(notifications));
  }, [notifications, storagePrefix]);

  // Calculations
  const totalIncome = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const totalExpense = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const currentBalance = useMemo(() => {
    return totalIncome - totalExpense;
  }, [totalIncome, totalExpense]);

  const remainingBudget = useMemo(() => {
    return Math.max(0, budget.totalAmount - totalExpense);
  }, [budget.totalAmount, totalExpense]);

  const usagePercentage = useMemo(() => {
    if (budget.totalAmount <= 0) return 0;
    return (totalExpense / budget.totalAmount) * 100;
  }, [totalExpense, budget.totalAmount]);

  const categorySpending = useMemo(() => {
    const map: Record<string, number> = {};
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });
    return map;
  }, [transactions]);

  const totalSavings = useMemo(() => {
    return savingGoals.reduce((sum, g) => sum + g.currentAmount, 0);
  }, [savingGoals]);

  // Days remaining calculation in current budget period
  const daysRemaining = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(budget.endDate);
    end.setHours(0, 0, 0, 0);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays <= 0 ? 1 : diffDays);
  }, [budget.endDate]);

  // Formula: Batas pengeluaran harian = Sisa anggaran / Jumlah hari tersisa
  const dailyRecommendation = useMemo(() => {
    if (remainingBudget <= 0) return 0;
    return Math.round(remainingBudget / daysRemaining);
  }, [remainingBudget, daysRemaining]);

  // Automated Evaluation Calculation
  const evaluation = useMemo<EvaluationResult>(() => {
    let category: EvaluationCategory = 'HEMAT';
    let message = '';
    let advice = '';

    if (usagePercentage <= 80) {
      category = 'HEMAT';
      message = 'Kamu berhasil menggunakan uang di bawah anggaran. Pertahankan kebiasaan baik ini!';
      advice = 'Pertimbangkan untuk menyisihkan sebagian sisa uang ini langsung ke target tabunganmu sebelum periode berakhir.';
    } else if (usagePercentage <= 100) {
      category = 'TERATUR';
      message = 'Pengeluaranmu terencana dengan cukup baik dan masih dalam batas anggaran yang ditentukan.';
      advice = 'Perhatikan pengeluaran harian kecil (kopi/jajan) agar saldo tetap aman hingga akhir periode.';
    } else {
      category = 'MELEBIHI ANGGARAN';
      message = 'Pengeluaranmu telah melampaui batas anggaran yang direncanakan.';
      advice = 'Kurangi pengeluaran non-primer di sisa hari ini dan prioritaskan hanya kebutuhan pokok (makan & transportasi).';
    }

    return {
      periodType: budget.period,
      totalBudget: budget.totalAmount,
      totalExpense,
      remainingAmount: remainingBudget,
      usagePercentage,
      category,
      message,
      advice,
      daysRemaining,
      dailyRecommendation,
    };
  }, [usagePercentage, budget.period, budget.totalAmount, totalExpense, remainingBudget, daysRemaining, dailyRecommendation]);

  // Auto trigger budget alert notification if >= 80%
  useEffect(() => {
    if (usagePercentage >= 80 && usagePercentage < 100) {
      const existing = notifications.find((n) => n.title.includes('80%'));
      if (!existing && currentUser?.role === 'student') {
        const newNotif: NotificationItem = {
          id: `alert-80-${Date.now()}`,
          userId: currentUser.id,
          title: 'Pengeluaran Mencapai 80% ⚠️',
          message: 'Pengeluaranmu sudah mencapai 80% dari anggaran mingguan. Perhatikan sisa anggaranmu!',
          type: 'warning',
          timestamp: new Date().toISOString(),
          read: false,
        };
        setNotifications((prev) => [newNotif, ...prev]);
      }
    } else if (usagePercentage > 100) {
      const existing = notifications.find((n) => n.title.includes('Melebihi Batas'));
      if (!existing && currentUser?.role === 'student') {
        const newNotif: NotificationItem = {
          id: `alert-over-${Date.now()}`,
          userId: currentUser.id,
          title: 'Pengeluaran Melebihi Batas Anggaran! 🚨',
          message: 'Total pengeluaranmu telah melewati batas anggaran. Segera tinjau pengeluaranmu.',
          type: 'alert',
          timestamp: new Date().toISOString(),
          read: false,
        };
        setNotifications((prev) => [newNotif, ...prev]);
      }
    }
  }, [usagePercentage, currentUser?.id, currentUser?.role]);

  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  // Actions
  const addTransaction = (data: Omit<Transaction, 'id' | 'userId' | 'createdAt'>) => {
    if (!currentUser) return;
    const newTx: Transaction = {
      ...data,
      id: `tx-${Date.now()}`,
      userId: currentUser.id,
      createdAt: new Date().toISOString(),
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const updateTransaction = (id: string, data: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...data } : t))
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const updateBudget = (config: Partial<BudgetConfig>) => {
    setBudget((prev) => ({ ...prev, ...config }));
  };

  const addSavingGoal = (
    goal: Omit<SavingGoal, 'id' | 'userId' | 'currentAmount' | 'createdAt' | 'history'>
  ) => {
    if (!currentUser) return;
    const newGoal: SavingGoal = {
      ...goal,
      id: `goal-${Date.now()}`,
      userId: currentUser.id,
      currentAmount: 0,
      createdAt: new Date().toISOString(),
      history: [],
    };
    setSavingGoals((prev) => [newGoal, ...prev]);
  };

  const addSavingDeposit = (goalId: string, amount: number, note?: string) => {
    setSavingGoals((prev) =>
      prev.map((g) => {
        if (g.id === goalId) {
          const newCurrent = g.currentAmount + amount;
          const newEntry = {
            id: `sh-${Date.now()}`,
            amount,
            date: new Date().toISOString().split('T')[0],
            note: note || 'Setoran Tabungan',
          };
          return {
            ...g,
            currentAmount: newCurrent,
            history: [newEntry, ...g.history],
          };
        }
        return g;
      })
    );
  };

  const allocateBudgetToSavings = (goalId: string, amount: number): boolean => {
    if (amount <= 0 || amount > remainingBudget) return false;

    // Deduct as a savings expense or add to goal
    addSavingDeposit(goalId, amount, 'Alokasi sisa anggaran');
    addTransaction({
      title: `Alokasi Tabungan: ${savingGoals.find((g) => g.id === goalId)?.name || 'Target'}`,
      amount,
      type: 'expense',
      category: 'Tabungan',
      date: new Date().toISOString().split('T')[0],
      note: 'Disisihkan dari sisa anggaran',
      source: 'savings_allocation',
    });

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: currentUser?.id || 'demo',
      title: 'Berhasil Menabung! 💰',
      message: `Rp ${amount.toLocaleString('id-ID')} berhasil dialokasikan ke tabunganmu.`,
      type: 'success',
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);
    return true;
  };

  const givePocketMoneyAsParent = (amount: number, note?: string) => {
    if (amount <= 0) return;
    const todayStr = new Date().toISOString().split('T')[0];

    // 1. Add income transaction to child
    const newTx: Transaction = {
      id: `tx-pm-${Date.now()}`,
      userId: DEMO_STUDENT.id,
      title: 'Uang Saku dari Orang Tua',
      amount,
      type: 'income',
      category: 'Uang Saku Orang Tua',
      date: todayStr,
      note: note || 'Pemberian uang saku tambahan',
      source: 'parent',
      createdAt: new Date().toISOString(),
    };
    setTransactions((prev) => [newTx, ...prev]);

    // 2. Add message to chat feed
    const newMsg: ParentMessage = {
      id: `msg-${Date.now()}`,
      senderId: DEMO_PARENT.id,
      senderName: DEMO_PARENT.name,
      senderRole: 'parent',
      recipientId: DEMO_STUDENT.id,
      content: note
        ? `${note} (Telah dikirim uang saku Rp ${amount.toLocaleString('id-ID')})`
        : `Telah mengirimkan uang saku sebesar Rp ${amount.toLocaleString('id-ID')}. Gunakan dengan bijak ya!`,
      createdAt: new Date().toISOString(),
      type: 'pocket_money_alert',
      amountAttached: amount,
    };
    setMessages((prev) => [newMsg, ...prev]);

    // 3. Add notification to child
    const notif: NotificationItem = {
      id: `notif-pm-${Date.now()}`,
      userId: DEMO_STUDENT.id,
      title: 'Uang Saku Baru Diterima! 💵',
      message: `${DEMO_PARENT.name} telah mengirimkan uang saku sebesar Rp ${amount.toLocaleString('id-ID')}.`,
      type: 'success',
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const sendAdviceAsParent = (content: string) => {
    if (!content.trim()) return;
    const newMsg: ParentMessage = {
      id: `msg-${Date.now()}`,
      senderId: DEMO_PARENT.id,
      senderName: DEMO_PARENT.name,
      senderRole: 'parent',
      recipientId: DEMO_STUDENT.id,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      type: 'advice',
    };
    setMessages((prev) => [newMsg, ...prev]);

    const notif: NotificationItem = {
      id: `notif-advice-${Date.now()}`,
      userId: DEMO_STUDENT.id,
      title: `Pesan Nasihat dari ${DEMO_PARENT.name} 💬`,
      message: `"${content.trim()}"`,
      type: 'info',
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const sendReplyAsChild = (content: string) => {
    if (!content.trim()) return;
    const newMsg: ParentMessage = {
      id: `msg-${Date.now()}`,
      senderId: DEMO_STUDENT.id,
      senderName: DEMO_STUDENT.name,
      senderRole: 'student',
      recipientId: DEMO_PARENT.id,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      type: 'general',
    };
    setMessages((prev) => [newMsg, ...prev]);
  };

  const connectParentChild = (code: string): boolean => {
    if (code.trim().toUpperCase() === 'KTK-AME-8921' || code.trim().length >= 6) {
      setParentLink({
        id: `link-${Date.now()}`,
        childId: DEMO_STUDENT.id,
        childName: DEMO_STUDENT.name,
        parentId: DEMO_PARENT.id,
        parentName: DEMO_PARENT.name,
        inviteCode: code.toUpperCase(),
        status: 'connected',
        connectedAt: new Date().toISOString(),
        permissions: {
          shareBudgetSummary: true,
          shareTransactionDetails: true,
          shareSavingsGoals: true,
          shareAiEvaluation: true,
        },
      });
      return true;
    }
    return false;
  };

  const disconnectParentChild = () => {
    setParentLink(null);
  };

  const updateSharePermissions = (perms: ParentChildLink['permissions']) => {
    if (parentLink) {
      setParentLink({
        ...parentLink,
        permissions: perms,
      });
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const loginAsDemo = (role: UserRole) => {
    if (role === 'student') {
      setCurrentUser(DEMO_STUDENT);
    } else {
      setCurrentUser(DEMO_PARENT);
    }
  };

  const login = (email: string, role: UserRole, name?: string) => {
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: name || (role === 'student' ? 'Pelajar KantongKu' : 'Orang Tua'),
      email,
      role,
      gradeOrCampus: role === 'student' ? 'Pelajar / Mahasiswa' : 'Orang Tua Pendamping',
      isDemo: false,
    };
    setCurrentUser(newUser);
  };

  const register = (name: string, email: string, role: UserRole, gradeOrCampus?: string) => {
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name,
      email,
      role,
      gradeOrCampus: gradeOrCampus || (role === 'student' ? 'Pelajar / Mahasiswa' : 'Orang Tua Pendamping'),
      isDemo: false,
    };
    setCurrentUser(newUser);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const resetDemoData = () => {
    setTransactions(DEMO_TRANSACTIONS);
    setBudget(DEMO_BUDGET);
    setSavingGoals(DEMO_SAVING_GOALS);
    setParentLink(DEMO_PARENT_LINK);
    setMessages(DEMO_MESSAGES);
    setNotifications(DEMO_NOTIFICATIONS);
    localStorage.removeItem(`${storagePrefix}transactions`);
    localStorage.removeItem(`${storagePrefix}budget`);
    localStorage.removeItem(`${storagePrefix}savings`);
    localStorage.removeItem(`${storagePrefix}parentlink`);
    localStorage.removeItem(`${storagePrefix}messages`);
    localStorage.removeItem(`${storagePrefix}notifs`);
  };

  const activeRole: UserRole = currentUser?.role || 'student';

  return (
    <AppContext.Provider
      value={{
        currentUser,
        activeRole,
        showSplash,
        setShowSplash,
        showOnboarding,
        setShowOnboarding,
        transactions,
        budget,
        savingGoals,
        parentLink,
        messages,
        notifications,
        totalIncome,
        totalExpense,
        currentBalance,
        remainingBudget,
        usagePercentage,
        daysRemaining,
        dailyRecommendation,
        evaluation,
        categorySpending,
        totalSavings,
        unreadNotificationsCount,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        updateBudget,
        addSavingGoal,
        addSavingDeposit,
        allocateBudgetToSavings,
        givePocketMoneyAsParent,
        sendAdviceAsParent,
        sendReplyAsChild,
        connectParentChild,
        disconnectParentChild,
        updateSharePermissions,
        markNotificationRead,
        markAllNotificationsRead,
        loginAsDemo,
        login,
        register,
        logout,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
