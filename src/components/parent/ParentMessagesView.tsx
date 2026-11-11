import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  Send,
  Sparkles,
  Heart,
  DollarSign,
  Gift,
  CheckCheck,
  User,
  ShieldCheck,
} from 'lucide-react';

const PARENT_ADVICE_TEMPLATES = [
  'Jangan lupa sisihkan sebagian uang sakumu untuk ditabung ya nak.',
  'Bunda bangga minggu ini pengelolaan uang sakumu statusnya HEMAT!',
  'Coba kurangi jajan kopi harian dan fokus ke kebutuhan kuliah.',
  'Uang saku tambahan sudah Bunda transfer, pergunakan dengan bijak ya.',
];

const CHILD_REPLY_TEMPLATES = [
  'Terima kasih banyak Bunda! ❤️',
  'Siap laksanakan, uangnya sudah Amelia sisihkan ke tabungan.',
  'Amelia akan lebih hemat minggu ini!',
];

export const ParentMessagesView: React.FC = () => {
  const {
    activeRole,
    messages,
    sendAdviceAsParent,
    sendReplyAsChild,
    parentLink,
    currentUser,
  } = useApp();

  const [inputContent, setInputContent] = useState('');

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputContent.trim()) return;

    if (activeRole === 'parent') {
      sendAdviceAsParent(inputContent);
    } else {
      sendReplyAsChild(inputContent);
    }
    setInputContent('');
  };

  const isConnected = parentLink?.status === 'connected';

  return (
    <div className="space-y-5 animate-fade-in pb-20">
      <div>
        <h1 className="text-2xl font-extrabold text-[#1F4130] tracking-tight">
          Pesan & Saran Pendampingan
        </h1>
        <p className="text-xs text-[#52796F] mt-0.5">
          Komunikasi hangat dan edukatif seputar pengelolaan uang saku
        </p>
      </div>

      {/* Main Conversation Container */}
      <div className="rounded-3xl bg-white border border-[#E9ECEF] shadow-xs overflow-hidden flex flex-col h-[520px]">
        {/* Top Info Banner */}
        <div className="px-5 py-3.5 bg-[#FAF8F5] border-b border-[#F1F3F5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3FB950] animate-pulse" />
            <span className="text-xs font-bold text-[#1F4130]">
              {activeRole === 'student'
                ? `Pendamping: ${parentLink?.parentName || 'Bunda Amelia'}`
                : `Anak Asuh: ${parentLink?.childName || 'Amelia'}`}
            </span>
          </div>
          <span className="text-[10px] text-[#868E96] font-medium flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#2D5A43]" /> Jalur Terenkripsi
          </span>
        </div>

        {/* Message Feed */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FCFBF8]">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-[#868E96]">
              <MessageSquare className="w-10 h-10 mx-auto text-[#CED4DA] mb-2" />
              <p className="text-xs font-semibold">Belum ada pesan pendampingan</p>
              <p className="text-[11px] mt-0.5">
                Kirim pesan atau nasihat pertama untuk saling mendukung!
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMyMessage = msg.senderRole === activeRole;
              const isPocketMoney = msg.type === 'pocket_money_alert';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[85%] ${
                    isMyMessage ? 'ml-auto items-end' : 'mr-auto items-start'
                  }`}
                >
                  <div
                    className={`p-4 rounded-3xl text-xs ${
                      isMyMessage
                        ? 'bg-[#2D5A43] text-white rounded-tr-xs shadow-xs'
                        : isPocketMoney
                        ? 'bg-[#EBF4EE] border border-[#CDE3D5] text-[#1F4130] rounded-tl-xs shadow-2xs'
                        : 'bg-white border border-[#E9ECEF] text-[#1F4130] rounded-tl-xs shadow-2xs'
                    }`}
                  >
                    {isPocketMoney && (
                      <div className="flex items-center gap-1.5 font-bold text-[11px] text-[#2D5A43] mb-1.5 pb-1 border-b border-[#CDE3D5]">
                        <Gift className="w-3.5 h-3.5 text-[#2D5A43]" />
                        <span>Pemberian Uang Saku</span>
                      </div>
                    )}
                    <p className="leading-relaxed font-medium">{msg.content}</p>
                    <div className="flex items-center justify-between gap-3 mt-1.5 pt-1 text-[9px] opacity-80">
                      <span>{msg.senderName}</span>
                      <span>
                        {new Date(msg.createdAt).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 border-t border-[#F1F3F5] bg-white overflow-x-auto whitespace-nowrap flex gap-1.5 scrollbar-none">
          {(activeRole === 'parent' ? PARENT_ADVICE_TEMPLATES : CHILD_REPLY_TEMPLATES).map(
            (t, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setInputContent(t)}
                className="text-[11px] px-3 py-1 rounded-full bg-[#F7F5EC] hover:bg-[#EBE7D8] text-[#1F4130] font-medium border border-[#D5E1D9] transition-colors shrink-0"
              >
                {t}
              </button>
            )
          )}
        </div>

        {/* Input box */}
        <form
          onSubmit={handleSend}
          className="p-3 bg-white border-t border-[#EAEAEA] flex items-center gap-2"
        >
          <input
            type="text"
            value={inputContent}
            onChange={(e) => setInputContent(e.target.value)}
            placeholder={
              activeRole === 'parent'
                ? 'Tulis saran atau catatan keuangan untuk anak...'
                : 'Balas pesan atau ucapkan terima kasih...'
            }
            className="flex-1 px-4 py-2.5 rounded-2xl border border-[#CED4DA] focus:border-[#2D5A43] text-xs font-medium text-[#1F4130]"
          />
          <button
            type="submit"
            disabled={!inputContent.trim()}
            className="p-2.5 rounded-2xl bg-[#2D5A43] hover:bg-[#234835] disabled:opacity-50 text-white font-bold transition-all shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
