import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../common/Logo';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  Trash2,
  HelpCircle,
  TrendingUp,
  DollarSign,
  PiggyBank,
  CheckCircle2,
} from 'lucide-react';

interface KantongKuAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  'Bagaimana cara menghemat uang saku minggu ini?',
  'Mengapa pengeluaranku meningkat?',
  'Berapa batas uang jajan yang sebaiknya aku gunakan?',
  'Bagaimana cara mencapai target tabunganku?',
];

export const KantongKuAssistant: React.FC<KantongKuAssistantProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    currentUser,
    budget,
    totalIncome,
    totalExpense,
    remainingBudget,
    usagePercentage,
    evaluation,
    dailyRecommendation,
    daysRemaining,
    totalSavings,
    savingGoals,
    categorySpending,
    transactions,
  } = useApp();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Halo ${currentUser?.name || 'teman'}! 👋 Saya **KantongKu Assistant**, asisten keuangan cerdasmu.

Saya telah menganalisis uang sakumu:
• Sisa Uang Saku: **Rp ${remainingBudget.toLocaleString('id-ID')}**
• Status Evaluasi: **${evaluation.category}**
• Batas Harian Aman: **Rp ${dailyRecommendation.toLocaleString('id-ID')}/hari**

Ada yang ingin kamu tanyakan seputar tips hemat atau alokasi tabungan hari ini?`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (userPrompt: string) => {
    const trimmed = userPrompt.trim();
    if (!trimmed || loading) return;

    const userMessage: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Prepare real financial context
    const financialContext = {
      userName: currentUser?.name || 'Pelajar',
      budgetPeriod: budget.period,
      periodRange: `${budget.startDate} s/d ${budget.endDate}`,
      totalBudget: budget.totalAmount,
      totalIncome,
      totalExpense,
      remainingBudget,
      usagePercentage,
      evaluationCategory: evaluation.category,
      dailyRecommendation,
      daysRemaining,
      totalSavings,
      savingGoals: savingGoals.map((g) => ({
        name: g.name,
        target: g.targetAmount,
        collected: g.currentAmount,
        progress: `${((g.currentAmount / (g.targetAmount || 1)) * 100).toFixed(0)}%`,
      })),
      categoryBreakdown: categorySpending,
      recentTransactions: transactions.slice(0, 5).map((t) => ({
        title: t.title,
        amount: t.amount,
        type: t.type,
        category: t.category,
      })),
    };

    try {
      const response = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: trimmed,
          financialContext,
          conversationHistory: messages.slice(-4),
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal menghubungi asisten AI');
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'Maaf, saya tidak dapat merespons saat ini.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const fallbackMessage: Message = {
        id: `ai-err-${Date.now()}`,
        sender: 'assistant',
        text: `Berdasarkan data keuanganmu saat ini, sisa anggaranmu adalah **Rp ${remainingBudget.toLocaleString('id-ID')}** dengan batas harian **Rp ${dailyRecommendation.toLocaleString('id-ID')}/hari**. Prioritaskan kebutuhan pokok makan dan transportasi kampus terlebih dahulu!`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'reset',
        sender: 'assistant',
        text: `Percakapan telah direset. Silakan tanyakan hal apa pun mengenai kondisi keuanganmu!`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Simple formatting helper for markdown-like text
  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Bold handling
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={i} className={line.trim() === '' ? 'h-2' : 'my-1'}>
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={pIdx} className="font-bold text-[#1F4130]">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-lg h-full sm:h-[640px] bg-white sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#D5E1D9]">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#2D5A43] to-[#40745A] text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#FFE066]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm tracking-tight">
                  KantongKu Assistant
                </h3>
                <span className="px-1.5 py-0.2 rounded-xs bg-[#FFE066] text-[#2D5A43] text-[9px] font-black uppercase">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-[#CDE3D5]">
                Analisis & Rekomendasi Keuangan Pelajar
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={clearChat}
              className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors"
              title="Bersihkan Percakapan"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors"
              aria-label="Tutup Asisten"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message feed */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FAF8F5]">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex gap-2.5 max-w-[88%] ${
                  isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                    isUser
                      ? 'bg-[#2D5A43] text-white'
                      : 'bg-[#84A98C] text-white'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                    isUser
                      ? 'bg-[#2D5A43] text-white rounded-tr-xs'
                      : 'bg-white text-[#1F4130] border border-[#E9ECEF] rounded-tl-xs shadow-2xs'
                  }`}
                >
                  {renderFormattedText(m.text)}
                  <span
                    className={`block text-[9px] mt-1.5 ${
                      isUser ? 'text-[#CDE3D5] text-right' : 'text-[#868E96]'
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-2.5 max-w-[85%] mr-auto items-center">
              <div className="w-7 h-7 rounded-xl bg-[#84A98C] text-white flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 rounded-2xl bg-white border border-[#E9ECEF] text-xs text-[#52796F] flex items-center gap-2 shadow-2xs">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#84A98C] animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-[#84A98C] animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <span className="w-2 h-2 rounded-full bg-[#84A98C] animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
                <span>Menganalisis data keuanganmu...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompt chips */}
        <div className="px-4 py-2 border-t border-[#EBEBEB] bg-white overflow-x-auto whitespace-nowrap flex gap-1.5 scrollbar-none">
          {QUICK_PROMPTS.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              disabled={loading}
              className="text-[11px] px-3 py-1.5 rounded-full bg-[#F7F5EC] hover:bg-[#EBE7D8] text-[#1F4130] font-semibold border border-[#D5E1D9] transition-colors shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input box */}
        <div className="p-3 bg-white border-t border-[#EBEBEB]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanyakan apa saja seputar keuanganmu..."
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-2xl border border-[#CED4DA] focus:border-[#2D5A43] text-xs font-medium text-[#1F4130] transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 rounded-2xl bg-[#2D5A43] hover:bg-[#234835] disabled:opacity-50 text-white font-bold transition-all shrink-0"
              aria-label="Kirim Pesan"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
