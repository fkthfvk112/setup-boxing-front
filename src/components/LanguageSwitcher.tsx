'use client';

import React from 'react';
import { Globe } from 'lucide-react';
import { useI18n } from '../hooks/useI18n';

interface LanguageSwitcherProps {
  compact?: boolean;
  variant?: 'button' | 'segmented';
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  compact = false,
  variant = 'button',
}) => {
  const { language, setLanguage, toggleLanguage } = useI18n();

  if (variant === 'segmented') {
    return (
      <div className="flex bg-[#15171E] rounded-xl p-1 border border-[#282C3A] gap-1 select-none">
        <button
          type="button"
          onClick={() => setLanguage('ko')}
          className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
            language === 'ko'
              ? 'bg-white/10 text-white border border-white'
              : 'text-[#94A3B8] hover:text-white'
          }`}
        >
          🇰🇷 한국어
        </button>
        <button
          type="button"
          onClick={() => setLanguage('en')}
          className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
            language === 'en'
              ? 'bg-white/10 text-white border border-white'
              : 'text-[#94A3B8] hover:text-white'
          }`}
        >
          🇺🇸 English
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className={`inline-flex items-center bg-[#1D202A] border border-[#2A2F40] text-[#F8FAFC] rounded-2xl transition-all hover:border-white/40 ${
        compact ? 'px-2 py-1 text-[11px]' : 'px-2.5 py-1.5 text-xs font-bold'
      }`}
    >
      <Globe className={compact ? 'w-3.5 h-3.5 mr-1 text-white' : 'w-4 h-4 mr-1.5 text-white'} />
      <span>{language === 'ko' ? 'KO 🇰🇷' : 'EN 🇺🇸'}</span>
    </button>
  );
};

export default LanguageSwitcher;
