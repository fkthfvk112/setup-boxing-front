'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  User,
  Crown,
  Flame,
  Shield,
  Zap,
  Globe,
  MessageCircle,
  HelpCircle,
  LogOut,
  ChevronRight,
  Receipt,
  Settings,
  Activity,
  CheckCircle2,
  Clock,
  Sparkles,
  Lock,
} from 'lucide-react';
import { useEntitlements } from '../../context/EntitlementContext';
import { useI18n } from '../../hooks/useI18n';
import {
  getUserProfile,
  UserProfileData,
  getWorkoutLogs,
  WorkoutLog,
  getAppSettings,
  saveAppSettings,
  AppSettings,
  saveLanguageSetting,
} from '../../utils/webDb';
import { paymentApi } from '../../lib/api';
import { showAlert, showConfirmDialog } from '../../utils/swal';
import AuthGuard from '../../components/auth/AuthGuard';
import LegalModal, { LegalModalType } from '../../components/legal/LegalModal';

export default function ProfilePage() {
  const { t, language, setLanguage } = useI18n();
  const { tier, isPro, isUltimate, limits, openPaywall, setTier, refreshUser } = useEntitlements();
  const isKo = language === 'ko';
  const [legalModal, setLegalModal] = useState<{ isOpen: boolean; type: LegalModalType }>({
    isOpen: false,
    type: 'terms',
  });

  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [settings, setSettings] = useState<AppSettings>({
    workoutTime: 180,
    restTime: 30,
    setsCount: 3,
    demoSpeed: 1.0,
  });

  const loadData = useCallback(async () => {
    try {
      const prof = await getUserProfile();
      setUserProfile(prof);
    } catch {}

    try {
      const workoutLogs = await getWorkoutLogs();
      setLogs(workoutLogs);
    } catch {}

    try {
      const appSets = await getAppSettings();
      setSettings(appSets);
    } catch {}

    try {
      setLoadingPayments(true);
      const res = await paymentApi.getMyPayments();
      if (res && res.data) {
        setPayments(res.data);
      }
    } catch {
      // payments error is non-blocking
    } finally {
      setLoadingPayments(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Aggregate stats
  const totalSets = logs.reduce((sum, l) => sum + l.sets_completed, 0);
  const totalSeconds = logs.reduce((sum, l) => sum + l.duration_seconds, 0);
  const totalMinutes = Math.round(totalSeconds / 60);
  const totalCalories = logs.reduce((sum, l) => sum + (l.calories_burned || 0), 0);
  const totalPunches = logs.reduce((sum, l) => sum + (l.total_punches || 0), 0);

  const handleLogout = async () => {
    const confirmed = await showConfirmDialog({
      title: t('logoutConfirmTitle'),
      text: t('logoutConfirmText'),
      confirmButtonText: t('logoutConfirmTitle'),
      cancelButtonText: t('cancel'),
    });

    if (confirmed) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('boxing_access_token');
        localStorage.removeItem('boxing_user');
      }
      await refreshUser();
      await loadData();
      await showAlert(
        t('logoutSuccessTitle'),
        t('logoutSuccessMessage'),
        'success'
      );
    }
  };

  const handleLanguageChange = async (lang: 'ko' | 'en') => {
    setLanguage(lang);
    await saveLanguageSetting(lang);
  };

  const handleSettingChange = async (field: keyof AppSettings, val: number) => {
    const updated = { ...settings, [field]: val };
    setSettings(updated);
    await saveAppSettings(updated);
  };

  const providerName = userProfile?.provider === 'KAKAO'
    ? '카카오 계정'
    : userProfile?.provider === 'GOOGLE'
    ? 'Google 계정'
    : userProfile?.provider === 'EMAIL'
    ? '이메일 계정'
    : '정회원 계정';

  const tierBadgeColor = isUltimate
    ? 'bg-[#FFD700]/15 text-[#FFD700] border-[#FFD700]/40'
    : isPro
    ? 'bg-[#FF2E54]/15 text-[#FF2E54] border-[#FF2E54]/40'
    : 'bg-[#64748B]/15 text-[#94A3B8] border-[#64748B]/30';

  const tierTitle = isUltimate
    ? t('tierTitleUltimate')
    : isPro
    ? t('tierTitlePro')
    : t('tierTitleFree');

  return (
    <AuthGuard
      title={t('tabProfile')}
      description={t('profileGuardDesc')}
    >
      <div className="flex-1 flex flex-col bg-[#0B0C10] text-white select-none">
      {/* 1. Header */}
      <header className="flex items-center justify-between px-5 py-3.5 border-b border-[#282C3A]">
        <div>
          <h1 className="text-[20px] font-black text-[#F8FAFC] tracking-tight">
            {t('tabProfile')}
          </h1>
          <p className="text-[12px] text-[#94A3B8] font-semibold mt-0.5">
            {t('profileHeaderSubtitle')}
          </p>
        </div>

        {userProfile && (
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#15171E] border border-[#282C3A] text-xs font-bold text-[#94A3B8] hover:text-white transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t('logout')}</span>
          </button>
        )}
      </header>

      {/* Main Content Area */}
      <div className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
        {/* 2. User Profile Card */}
        <div className="bg-[#15171E] rounded-2xl p-4 border border-[#282C3A] shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF2E54] to-[#fb923c] p-0.5 flex items-center justify-center shadow-md shadow-red-500/20 shrink-0">
                <div className="w-full h-full bg-[#0B0C10] rounded-[14px] flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-black text-white">
                    {userProfile?.userName || t('defaultMasterName')}
                  </h2>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${tierBadgeColor}`}>
                    {tier}
                  </span>
                </div>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  {userProfile?.email || providerName}
                </p>
              </div>
            </div>

            {(!userProfile || userProfile.provider === 'GUEST') && (
              <Link
                href="/login"
                className="px-3.5 py-1.5 rounded-xl bg-[#FF2E54] text-white text-xs font-black hover:bg-red-600 transition-colors shadow-md shadow-red-500/20"
              >
                {t('fastAuthTitle')}
              </Link>
            )}
          </div>
        </div>

        {/* 3. Membership Pass Status Card */}
        <div
          className={`rounded-2xl p-4 space-y-3 relative overflow-hidden transition-all ${
            isUltimate
              ? 'bg-[#15171E] border border-[#FFD700]'
              : isPro
              ? 'bg-[#15171E] border border-[#282C3A]'
              : 'bg-[#15171E] border border-[#282C3A]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div>
                <span
                  className={`text-[11px] font-black tracking-wider uppercase ${
                    isUltimate ? 'text-[#FFD700]' : isPro ? 'text-[#FF2E54]' : 'text-[#F59E0B]'
                  }`}
                >
                  MEMBERSHIP PASS
                </span>
                <h3 className={`text-sm font-black ${isUltimate ? 'text-[#FFD700]' : 'text-white'}`}>
                  {tierTitle}
                </h3>
              </div>
            </div>

            {/* If Ultimate: No button or badge needed */}
            {isUltimate ? null : isPro ? (
              <button
                type="button"
                onClick={() => openPaywall('profile_upgrade_ultimate')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#FFD700] to-[#F59E0B] text-black text-xs font-black hover:opacity-90 transition-all shadow-md shadow-yellow-500/25"
              >
                <Sparkles className="w-3.5 h-3.5 fill-black" />
                <span>{t('upgradeVip')}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => openPaywall('profile_unlock')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#FF2E54] to-[#f43f5e] text-white text-xs font-black hover:opacity-90 transition-all shadow-md shadow-red-500/25"
              >
                <span>{t('unlockPass')}</span>
              </button>
            )}
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
            <div className="bg-[#0B0C10]/70 rounded-xl p-2.5 border border-[#282C3A]/60">
              <span className="text-[11px] text-[#94A3B8] font-bold block">{t('maxTokensPerCombo')}</span>
              <span className="text-sm font-black text-white mt-0.5 block">{limits.maxComboTokens} {t('tokensUnit')}</span>
            </div>
            <div className="bg-[#0B0C10]/70 rounded-xl p-2.5 border border-[#282C3A]/60">
              <span className="text-[11px] text-[#94A3B8] font-bold block">{t('customCombosStorage')}</span>
              <span className="text-sm font-black text-white mt-0.5 block">{limits.maxCustomCombos >= 999 ? t('unlimited') : (isKo ? `${limits.maxCustomCombos}개` : `${limits.maxCustomCombos} Combos`)}</span>
            </div>
            <div className="bg-[#0B0C10]/70 rounded-xl p-2.5 border border-[#282C3A]/60">
              <span className="text-[11px] text-[#94A3B8] font-bold block">{t('adFreeFeature')}</span>
              <span className={`text-xs font-black mt-0.5 block ${!limits.showBannerAds ? 'text-[#10B981]' : 'text-[#64748B]'}`}>
                {!limits.showBannerAds ? t('adFree100') : t('adFreeEnabled')}
              </span>
            </div>
            <div className="bg-[#0B0C10]/70 rounded-xl p-2.5 border border-[#282C3A]/60">
              <span className="text-[11px] text-[#94A3B8] font-bold block">{t('vipAnalytics')}</span>
              <span className={`text-xs font-black mt-0.5 block ${limits.showAdvancedStats ? 'text-[#FFD700]' : 'text-[#64748B]'}`}>
                {limits.showAdvancedStats ? t('vipAnalyticsUnlocked') : t('vipOnly')}
              </span>
            </div>
          </div>
        </div>

        {/* 5. App Timer Settings */}
        <div className="bg-[#15171E] rounded-2xl p-4 border border-[#282C3A] space-y-3">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#38bdf8]" />
            <h3 className="text-xs font-black text-white">{t('settingsTitle')}</h3>
          </div>

          <div className="space-y-2.5">
            {/* Workout time */}
            <div className="flex items-center justify-between bg-[#0B0C10] p-2.5 rounded-xl border border-[#282C3A]">
              <span className="text-xs font-bold text-[#F8FAFC]">{t('workoutTime')}</span>
              <div className="flex items-center gap-1.5">
                {[120, 180, 300].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => handleSettingChange('workoutTime', sec)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      settings.workoutTime === sec
                        ? 'bg-[#FF2E54] text-white shadow-sm'
                        : 'bg-[#15171E] text-[#94A3B8] hover:text-white border border-[#282C3A]'
                    }`}
                  >
                    {Math.floor(sec / 60)}{t('minutesShort')}
                  </button>
                ))}
              </div>
            </div>

            {/* Rest time */}
            <div className="flex items-center justify-between bg-[#0B0C10] p-2.5 rounded-xl border border-[#282C3A]">
              <span className="text-xs font-bold text-[#F8FAFC]">{t('restTime')}</span>
              <div className="flex items-center gap-1.5">
                {[15, 30, 60].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => handleSettingChange('restTime', sec)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      settings.restTime === sec
                        ? 'bg-[#FF2E54] text-white shadow-sm'
                        : 'bg-[#15171E] text-[#94A3B8] hover:text-white border border-[#282C3A]'
                    }`}
                  >
                    {sec}{t('secondsShort')}
                  </button>
                ))}
              </div>
            </div>

            {/* Language Selector */}
            <div className="flex items-center justify-between bg-[#0B0C10] p-2.5 rounded-xl border border-[#282C3A]">
              <span className="text-xs font-bold text-[#F8FAFC]">{t('language')}</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleLanguageChange('ko')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    language === 'ko'
                      ? 'bg-[#FF2E54] text-white shadow-sm'
                      : 'bg-[#15171E] text-[#94A3B8] hover:text-white border border-[#282C3A]'
                  }`}
                >
                  한국어
                </button>
                <button
                  type="button"
                  onClick={() => handleLanguageChange('en')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    language === 'en'
                      ? 'bg-[#FF2E54] text-white shadow-sm'
                      : 'bg-[#15171E] text-[#94A3B8] hover:text-white border border-[#282C3A]'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            {/* Dev / Test Switcher (Only visible in Development mode) */}
            {process.env.NODE_ENV !== 'production' && (
              <div className="bg-[#0B0C10] p-2.5 rounded-xl border border-dashed border-[#FF2E54]/40 space-y-1.5 mt-2">
                <span className="text-[11px] font-bold text-[#FF2E54] block">
                  {t('devSwitchTier')}
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setTier('FREE')}
                    className={`py-1.5 rounded-lg text-xs font-bold border transition-all ${
                      tier === 'FREE'
                        ? 'bg-white text-black border-white'
                        : 'bg-[#15171E] text-[#94A3B8] border-[#282C3A]'
                    }`}
                  >
                    FREE
                  </button>
                  <button
                    type="button"
                    onClick={() => setTier('PRO')}
                    className={`py-1.5 rounded-lg text-xs font-bold border transition-all ${
                      tier === 'PRO'
                        ? 'bg-[#FF2E54] text-white border-[#FF2E54]'
                        : 'bg-[#15171E] text-[#94A3B8] border-[#282C3A]'
                    }`}
                  >
                    PRO ($2.99)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTier('ULTIMATE')}
                    className={`py-1.5 rounded-lg text-xs font-bold border transition-all ${
                      tier === 'ULTIMATE'
                        ? 'bg-[#FFD700] text-black border-[#FFD700]'
                        : 'bg-[#15171E] text-[#94A3B8] border-[#282C3A]'
                    }`}
                  >
                    ULTIMATE ($6.99)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 6. Support & Inquiry & Guide Links */}
        <div className="bg-[#15171E] rounded-2xl p-2 border border-[#282C3A] divide-y divide-[#282C3A]/50">
          <Link
            href="/inquiry"
            className="flex items-center justify-between p-3 hover:bg-[#1E222D] rounded-xl transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <MessageCircle className="w-4 h-4 text-[#38bdf8]" />
              <span className="text-xs font-bold text-white">{t('inquiryTitle')}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#64748B]" />
          </Link>

          <Link
            href="/guide"
            className="flex items-center justify-between p-3 hover:bg-[#1E222D] rounded-xl transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <HelpCircle className="w-4 h-4 text-yellow-400" />
              <span className="text-xs font-bold text-white">
                {t('guideWorkoutTips')}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#64748B]" />
          </Link>

          <button
            type="button"
            onClick={() => setLegalModal({ isOpen: true, type: 'terms' })}
            className="w-full flex items-center justify-between p-3 hover:bg-[#1E222D] rounded-xl transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-white">
                {isKo ? '서비스 이용약관' : 'Terms of Service'}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#64748B]" />
          </button>

          <button
            type="button"
            onClick={() => setLegalModal({ isOpen: true, type: 'privacy' })}
            className="w-full flex items-center justify-between p-3 hover:bg-[#1E222D] rounded-xl transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-white">
                {isKo ? '개인정보 처리방침' : 'Privacy Policy'}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#64748B]" />
          </button>
        </div>

        {/* Footer Version */}
        <div className="text-center py-3 text-[11px] text-[#64748B] space-y-1">
          <p>Setup Boxing v2.0 (Web Edition)</p>
          <p>© 2026 Setup Boxing. All rights reserved.</p>
        </div>
      </div>
    </div>

    {/* Legal Modal Popup */}
    <LegalModal
      isOpen={legalModal.isOpen}
      type={legalModal.type}
      onClose={() => setLegalModal((prev) => ({ ...prev, isOpen: false }))}
    />
    </AuthGuard>
  );
}
