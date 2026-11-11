import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showSlogan?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  showSlogan = false,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Wallet Illustration with Coin */}
      <div
        className={`${iconSizes[size]} relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#2D5A43] via-[#3B6E54] to-[#1F4130] p-1.5 shadow-md shadow-[#2D5A43]/20 transition-transform hover:scale-105`}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Dompet Utama (Main Wallet Body) */}
          <rect
            x="4"
            y="12"
            width="38"
            height="28"
            rx="7"
            fill="#84A98C"
            stroke="#F7F5EC"
            strokeWidth="2"
          />
          {/* Lipatan Atas Dompet */}
          <path
            d="M4 19C4 15.134 7.13401 12 11 12H35C38.866 12 42 15.134 42 19V21H4V19Z"
            fill="#52796F"
          />
          {/* Jahitan Pinggir Dompet */}
          <path
            d="M8 15H38"
            stroke="#FAF8F2"
            strokeWidth="1.2"
            strokeDasharray="2 2"
            strokeOpacity="0.8"
          />
          {/* Klip Dompet Kanan */}
          <rect
            x="28"
            y="22"
            width="15"
            height="12"
            rx="4"
            fill="#2D5A43"
            stroke="#F7F5EC"
            strokeWidth="1.5"
          />
          {/* Kancing Klip Emas */}
          <circle cx="38" cy="28" r="2.5" fill="#F4D06F" />
          <circle cx="38" cy="28" r="1.2" fill="#E0A926" />

          {/* Koin Mengilap Muncul dari Atas Dompet */}
          <g className="animate-bounce" style={{ animationDuration: '3s' }}>
            <circle
              cx="22"
              cy="11"
              r="7"
              fill="url(#coinGrad)"
              stroke="#D49B18"
              strokeWidth="1.2"
            />
            {/* Simbol K pada Koin */}
            <path
              d="M19.5 8V14M19.5 11L23.5 8M20.5 11.5L24 14"
              stroke="#6B4B03"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="19.5" cy="8.8" r="0.8" fill="#FFF8DC" />
          </g>

          <defs>
            <linearGradient id="coinGrad" x1="16" y1="5" x2="28" y2="17" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFE066" />
              <stop offset="0.6" stopColor="#F4C430" />
              <stop offset="1" stopColor="#D49B18" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1">
            <span
              className={`font-extrabold tracking-tight text-[#1F4130] font-sans ${textSizes[size]}`}
            >
              Kantong<span className="text-[#4E876A]">Ku</span>
            </span>
            <span className="rounded-full bg-[#E8EFEA] px-1.5 py-0.5 text-[9px] font-bold text-[#2D5A43] uppercase tracking-wider">
              Smart
            </span>
          </div>
          {showSlogan && (
            <span className="text-[11px] font-medium text-[#52796F]">
              Kelola Uangmu, Atur Masa Depanmu!
            </span>
          )}
        </div>
      )}
    </div>
  );
};
