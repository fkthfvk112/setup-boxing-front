'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { useEntitlements } from '../context/EntitlementContext';
import { useI18n } from '../hooks/useI18n';

export default function BannerAd() {
  const { limits, openPaywall } = useEntitlements();
  const { t } = useI18n();

  if (!limits.showBannerAds) {
    return null;
  }

  return (
    <div className="w-full px-4 py-1.5 bg-[#0B0C10] select-none">
      <div
        onClick={() => openPaywall('banner_ad')}
        className="flex items-center bg-[#15171E] rounded-xl px-3 py-2 border border-[#282C3A] cursor-pointer hover:border-amber-400/50 transition-all"
      >
        <div className="bg-[#282C3A] px-1.5 py-0.5 rounded text-[9px] font-extrabold text-[#94A3B8] mr-2">
          AD
        </div>
        <div className="flex-1 min-w-0 mr-2">
          <p className="text-[11px] font-bold text-white truncate">
            {t('bannerAdTitle')}
          </p>
          <p className="text-[10px] text-[#94A3B8] truncate mt-0.5">
            {t('bannerAdDesc')}
          </p>
        </div>
        <div className="flex items-center gap-1 bg-[#F59E0B] px-2 py-1 rounded-md text-[10px] font-black text-[#0B0C10] shrink-0">
          <Sparkles className="w-3 h-3 fill-current" />
          <span>PRO</span>
        </div>
      </div>
    </div>
  );
}
