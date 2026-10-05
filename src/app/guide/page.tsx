'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Sparkles } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';
import OnboardingGuide from '../../components/OnboardingGuide';

export default function GuidePage() {
  const { t, language } = useI18n();
  const isKo = language === 'ko';

  return (
    <div className="flex-1 flex flex-col bg-[#0B0C10] text-white select-none">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-3.5 border-b border-[#282C3A] sticky top-0 bg-[#0B0C10]/95 backdrop-blur-md z-30">
        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            className="p-1.5 -ml-1.5 rounded-xl bg-[#15171E] border border-[#282C3A] text-[#94A3B8] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#FF2E54]" />
            <h1 className="text-base sm:text-lg font-black text-[#F8FAFC] tracking-tight">
              {t('appGuideFaq')}
            </h1>
          </div>
        </div>

        <Link
          href="/"
          className="px-3 py-1.5 rounded-xl bg-[#FF2E54] hover:bg-red-600 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-red-500/20"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{t('startComboWorkout')}</span>
        </Link>
      </header>

      {/* Content */}
      <div className="flex-1 px-4 py-4 overflow-y-auto max-w-4xl mx-auto w-full space-y-6">
        <OnboardingGuide />
      </div>
    </div>
  );
}
