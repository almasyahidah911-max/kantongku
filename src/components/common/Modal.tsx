import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs transition-opacity animate-fade-in">
      {/* Backdrop tap to close */}
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      {/* Modal Dialog Card */}
      <div
        className={`w-full ${maxWidthClasses[maxWidth]} bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#E9ECEF] max-h-[92vh] flex flex-col overflow-hidden animate-slide-up sm:animate-scale-in`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#F1F3F5] bg-[#FAF8F5]">
          <div className="pr-4">
            {title && (
              <h3 className="text-lg font-bold text-[#1F4130] leading-snug">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-xs text-[#6C757D] mt-0.5">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#6C757D] hover:text-[#1F4130] hover:bg-[#E9ECEF] transition-colors focus:outline-none focus:ring-2 focus:ring-[#84A98C]"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
};
