import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { BottomNav, NavTab } from './components/layout/BottomNav';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { ParentDashboard } from './components/dashboard/ParentDashboard';
import { TransactionList } from './components/transactions/TransactionList';
import { BudgetPlanner } from './components/budget/BudgetPlanner';
import { SavingsGoals } from './components/savings/SavingsGoals';
import { EvaluationView } from './components/evaluation/EvaluationView';
import { FinancialAnalytics } from './components/analytics/FinancialAnalytics';
import { FinancialReport } from './components/reports/FinancialReport';
import { ParentChildConnection } from './components/parent/ParentChildConnection';
import { ParentMessagesView } from './components/parent/ParentMessagesView';
import { ProfileView } from './components/profile/ProfileView';
import { KantongKuAssistant } from './components/ai/KantongKuAssistant';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';
import { AuthModal } from './components/auth/AuthModal';
import {
  Sparkles,
  BarChart3,
  Award,
  Users,
  PieChart,
  Home,
  ReceiptText,
  PiggyBank,
  FileSpreadsheet,
  MessageSquare,
  User,
  ArrowRight,
} from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeRole, currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<NavTab | 'evaluation' | 'analytics' | 'parent_link'>('home');

  // Modals
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [authModalConfig, setAuthModalConfig] = useState<{
    isOpen: boolean;
    initialView: 'login' | 'register' | 'onboarding' | 'splash';
  }>({
    isOpen: false,
    initialView: 'login',
  });

  // Render appropriate view based on role and tab
  const renderCurrentView = () => {
    if (activeRole === 'student') {
      switch (activeTab) {
        case 'home':
          return (
            <StudentDashboard
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenAiAssistant={() => setIsAiOpen(true)}
              onOpenParentLink={() => setActiveTab('parent_link')}
            />
          );
        case 'transactions':
          return <TransactionList />;
        case 'budget':
          return <BudgetPlanner />;
        case 'savings':
          return <SavingsGoals />;
        case 'evaluation':
          return <EvaluationView onGoToSavings={() => setActiveTab('savings')} />;
        case 'analytics':
          return <FinancialAnalytics />;
        case 'reports':
          return <FinancialReport />;
        case 'parent_link':
          return <ParentChildConnection />;
        case 'messages':
          return <ParentMessagesView />;
        case 'profile':
          return (
            <ProfileView
              onOpenOnboarding={() =>
                setAuthModalConfig({ isOpen: true, initialView: 'onboarding' })
              }
              onOpenSplash={() =>
                setAuthModalConfig({ isOpen: true, initialView: 'splash' })
              }
            />
          );
        default:
          return (
            <StudentDashboard
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenAiAssistant={() => setIsAiOpen(true)}
              onOpenParentLink={() => setActiveTab('parent_link')}
            />
          );
      }
    } else {
      // Parent role
      switch (activeTab) {
        case 'home':
          return (
            <ParentDashboard
              onGoToMessages={() => setActiveTab('messages')}
              onGoToReports={() => setActiveTab('reports')}
            />
          );
        case 'child_account':
          return <ParentChildConnection />;
        case 'reports':
          return <FinancialReport />;
        case 'messages':
          return <ParentMessagesView />;
        case 'profile':
          return (
            <ProfileView
              onOpenOnboarding={() =>
                setAuthModalConfig({ isOpen: true, initialView: 'onboarding' })
              }
              onOpenSplash={() =>
                setAuthModalConfig({ isOpen: true, initialView: 'splash' })
              }
            />
          );
        default:
          return (
            <ParentDashboard
              onGoToMessages={() => setActiveTab('messages')}
              onGoToReports={() => setActiveTab('reports')}
            />
          );
      }
    }
  };

  // Student sub-navigation tabs for desktop view
  const studentSubNavItems = [
    { id: 'home', label: 'Beranda', icon: Home },
    { id: 'transactions', label: 'Transaksi', icon: ReceiptText },
    { id: 'budget', label: 'Anggaran', icon: PieChart },
    { id: 'savings', label: 'Tabungan', icon: PiggyBank },
    { id: 'evaluation', label: 'Evaluasi Otomatis', icon: Award },
    { id: 'analytics', label: 'Analisis & Grafik', icon: BarChart3 },
    { id: 'reports', label: 'Laporan PDF', icon: FileSpreadsheet },
    { id: 'parent_link', label: 'Koneksi Orang Tua', icon: Users },
    { id: 'profile', label: 'Profil', icon: User },
  ];

  // Parent sub-navigation tabs for desktop view
  const parentSubNavItems = [
    { id: 'home', label: 'Beranda Pendamping', icon: Home },
    { id: 'child_account', label: 'Akun Anak & Privasi', icon: Users },
    { id: 'reports', label: 'Laporan Keuangan', icon: FileSpreadsheet },
    { id: 'messages', label: 'Pesan & Saran', icon: MessageSquare },
    { id: 'profile', label: 'Profil', icon: User },
  ];

  const subNavs = activeRole === 'student' ? studentSubNavItems : parentSubNavItems;

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans text-[#1F4130]">
      {/* Top Navbar */}
      <Navbar
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenAiAssistant={() => setIsAiOpen(true)}
        onOpenAuth={() => setAuthModalConfig({ isOpen: true, initialView: 'login' })}
      />

      {/* Desktop Category / Feature Subnav Header */}
      <div className="hidden sm:block bg-white border-b border-[#EBEBEB] px-4 lg:px-8 py-2 sticky top-[57px] z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto scrollbar-none">
          {subNavs.map((nav) => {
            const Icon = nav.icon;
            const isActive = activeTab === nav.id;
            return (
              <button
                key={nav.id}
                onClick={() => setActiveTab(nav.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                  isActive
                    ? 'bg-[#2D5A43] text-white shadow-xs'
                    : 'text-[#52796F] hover:bg-[#F1F3F5] hover:text-[#1F4130]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{nav.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Page Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-10">
        {renderCurrentView()}
      </main>

      {/* Floating KantongKu AI Assistant Trigger Button (Mobile & Desktop) */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40">
        <button
          onClick={() => setIsAiOpen(true)}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-[#2D5A43] via-[#35674E] to-[#1E3E2E] text-white font-extrabold text-xs shadow-xl shadow-[#2D5A43]/30 hover:scale-105 active:scale-95 transition-all group border border-white/20"
          title="Tanya KantongKu AI Assistant"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-[#FFE066] animate-spin" style={{ animationDuration: '6s' }} />
            <span className="w-2 h-2 rounded-full bg-[#A3E635] absolute -top-0.5 -right-0.5 animate-ping" />
          </div>
          <span className="tracking-wide">Tanya AI</span>
        </button>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        activeTab={(activeTab as NavTab) || 'home'}
        onTabChange={(tab) => setActiveTab(tab)}
      />

      {/* KantongKu AI Assistant Modal */}
      <KantongKuAssistant isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onSelectAction={(url) => {
          if (url?.includes('savings')) setActiveTab('savings');
          else if (url?.includes('budget')) setActiveTab('budget');
          else if (url?.includes('evaluation')) setActiveTab('evaluation');
        }}
      />

      {/* Authentication / Onboarding / Splash Modal */}
      <AuthModal
        isOpen={authModalConfig.isOpen}
        onClose={() => setAuthModalConfig({ isOpen: false, initialView: 'login' })}
        initialView={authModalConfig.initialView}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
