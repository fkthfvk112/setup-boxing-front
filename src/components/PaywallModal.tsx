'use client';

import React from 'react';
import { Check, Crown, Flame, X, Zap } from 'lucide-react';
import { useEntitlements } from '../context/EntitlementContext';
import { useI18n } from '../hooks/useI18n';
import { EntitlementTier } from '../constants/Entitlements';
import { paymentApi } from '../lib/api';
import { showAlert } from '../utils/swal';

export default function PaywallModal() {
  const { tier, setTier, isPaywallVisible, closePaywall } = useEntitlements();
  const { t, language } = useI18n();

  if (!isPaywallVisible) {
    return null;
  }

  const isKo = language === 'ko';

  const benefitsPro = [
    { title: isKo ? '콤보당 최대 40토큰 확장' : 'Up to 40 Tokens Per Combo', desc: isKo ? '기본 20토큰 ➔ 40토큰 대형 연타 구성' : 'Expand from 20 to 40 tokens' },
    { title: isKo ? '나만의 콤보 20개 저장' : 'Save Up to 20 Custom Combos', desc: isKo ? '기본 5개 ➔ 20개 콤보 보관' : 'Expand from 5 to 20 saved combos' },
    { title: isKo ? '100% 광고 없는 쾌적한 훈련' : '100% Ad-Free Workouts', desc: isKo ? '모든 배너 및 팝업 광고 영구 제거' : 'Permanently remove all ads' },
    { title: isKo ? '모든 시그니처 콤보 해금' : 'All Signature Combos Unlocked', desc: isKo ? '챔피언 콤보 및 프리셋 전체 해금' : 'Unlock all signature combo presets' },
  ];

  const benefitsUltimate = [
    ...benefitsPro,
    { title: isKo ? '🔥 [VIP] 펀치 수 & 회피 수 카운터' : '🔥 [VIP] Punch & Evasion Counters', desc: isKo ? '잽, 훅, 어퍼 및 더킹, 위빙, 슬립 개별 집계' : 'Real-time strike & evasion breakdown' },
    { title: isKo ? '♾️ [VIP] 콤보 60토큰 & 콤보 무제한' : '♾️ [VIP] 60 Tokens & Unlimited Combos', desc: isKo ? '초대형 콤보 구성 & 무제한 콤보 저장' : 'Build mega combos & save unlimited routines' },
    { title: isKo ? '💖 [VIP] 개발자의 큰행복' : "💖 [VIP] Developer's Great Happiness", desc: isKo ? '지속적인 앱 업데이트와 개발자에게 큰 행복 선물' : 'Support independent development & bring great joy' },
  ];

  const handlePurchase = async (plan: 'pro' | 'ultimate') => {
    try {
      const targetPlan = plan.toUpperCase() as 'PRO' | 'ULTIMATE';
      const res = await paymentApi.processEventPayment({ plan: targetPlan });
      if (res && res.data) {
        await setTier(res.data.updatedUser.tier);
        closePaywall();
        await showAlert(
          t('promoUnlockTitle'),
          t('promoUnlockDesc'),
          'success'
        );
        return;
      }
    } catch (err) {
      console.warn('[PaywallModal] paymentApi.processEventPayment failed, falling back:', err);
    }

    closePaywall();
    await setTier('ULTIMATE');
    await showAlert(
      t('promoUnlockTitle'),
      t('promoUnlockDesc'),
      'success'
    );
  };

  return (
    <div className="fixed inset-0 z-[100000] bg-black/80 flex items-end md:items-center justify-center animate-fade-in p-0 md:p-4">
      <div className="bg-[#15171E] w-full max-w-lg rounded-t-3xl md:rounded-3xl border border-[#282C3A] max-h-[90vh] overflow-y-auto p-5 pb-8 space-y-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 bg-[#F59E0B]/15 px-2.5 py-1 rounded-full border border-[#F59E0B]/30">
            <Crown className="w-4 h-4 text-[#FFD700] fill-[#FFD700]" />
            <span className="text-xs font-black text-[#F59E0B] tracking-wide">MEMBERSHIP PASS</span>
          </div>

          <button
            type="button"
            onClick={closePaywall}
            className="p-1.5 rounded-full bg-[#1E222D] text-[#94A3B8] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Title */}
        <div className="text-center space-y-1">
          <h2 className="text-xl font-black text-white">
            {t('paywallTitle')}
          </h2>
          <p className="text-xs text-[#94A3B8]">
            {t('paywallSubtitle')}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="space-y-3">
          {/* Option 1: PRO PASS */}
          <div
            onClick={() => {
              if (tier === 'FREE') {
                handlePurchase('pro');
              }
            }}
            className={`rounded-2xl p-4 bg-[#1E222D] relative transition-all ${
              tier === 'PRO' || tier === 'ULTIMATE'
                ? 'border border-[#282C3A] cursor-default opacity-80'
                : 'border-2 border-[#FF2E54] cursor-pointer hover:border-red-400 shadow-lg shadow-red-500/10'
            }`}
          >
            <div className="absolute -top-3 left-4 bg-[#FF2E54] text-white px-2 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1">
              <Flame className="w-3 h-3 fill-white" />
              <span>
                {tier === 'PRO'
                  ? t('currentPlan')
                  : t('mostPopular')}
              </span>
            </div>

            <div className="flex items-center justify-between mb-3 mt-1">
              <div>
                <h3 className="text-sm font-black text-white">
                  {t('proPassTitle')}
                </h3>
                <span className="text-[11px] text-[#94A3B8]">
                  {tier === 'PRO'
                    ? t('activeNow')
                    : tier === 'ULTIMATE'
                    ? t('includedInUltimate')
                    : t('proPassDesc')}
                </span>
              </div>
              <span className="text-lg font-black text-white">
                {t('proPassPrice')}
              </span>
            </div>

            <div className="h-[1px] bg-[#282C3A] mb-3" />

            <div className="space-y-1.5">
              {benefitsPro.map((b, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-[#F8FAFC]">
                  <Check className="w-3.5 h-3.5 text-[#10B981] stroke-[3]" />
                  <span>{b.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Option 2: ULTIMATE VIP PASS */}
          <div
            onClick={() => {
              if (tier !== 'ULTIMATE') {
                handlePurchase('ultimate');
              }
            }}
            className={`rounded-2xl p-4 bg-[#1E222D] relative transition-all ${
              tier === 'ULTIMATE'
                ? 'border border-[#282C3A] cursor-default opacity-80'
                : 'border-2 border-[#FFD700] cursor-pointer hover:border-yellow-300 shadow-lg shadow-yellow-500/15'
            }`}
          >
            <div className="absolute -top-3 left-4 bg-[#FFD700] text-[#0B0C10] px-2 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1">
              <Crown className="w-3 h-3 fill-[#0B0C10]" />
              <span>
                {tier === 'ULTIMATE'
                  ? t('activeVipBadge')
                  : t('vipBestBenefit')}
              </span>
            </div>

            <div className="flex items-center justify-between mb-3 mt-1">
              <div>
                <h3 className="text-sm font-black text-[#FFD700]">
                  {t('ultimatePassTitle')}
                </h3>
                <span className="text-[11px] text-[#94A3B8]">
                  {tier === 'ULTIMATE'
                    ? t('highestTierActive')
                    : t('ultimatePassDesc')}
                </span>
              </div>
              <span className="text-lg font-black text-[#FFD700]">
                {t('ultimatePassPrice')}
              </span>
            </div>

            <div className="h-[1px] bg-[#282C3A] mb-3" />

            <div className="space-y-1.5">
              {benefitsUltimate.map((b, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2 text-xs ${
                    idx >= 4 ? 'text-[#FFD700] font-bold' : 'text-[#F8FAFC]'
                  }`}
                >
                  <Zap
                    className={`w-3.5 h-3.5 stroke-[3] ${
                      idx >= 4 ? 'text-[#FFD700]' : 'text-[#10B981]'
                    }`}
                  />
                  <span>{b.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
