'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Calendar,
  Clock,
  Crown,
  Flame,
  Shield,
  Trash2,
  Trophy,
  X,
  Zap,
} from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';
import { useEntitlements } from '../../context/EntitlementContext';
import BannerAd from '../../components/BannerAd';
import {
  deleteWorkoutLog,
  getWorkoutLogs,
  resetProgress,
  WorkoutLog,
} from '../../utils/webDb';
import { showConfirmDialog, showAlert } from '../../utils/swal';
import AuthGuard from '../../components/auth/AuthGuard';

export default function HistoryPage() {
  const { t, language, formatNumber, formatDate, formatDuration } = useI18n();
  const { limits, openPaywall } = useEntitlements();
  const isKo = language === 'ko';

  const [logs, setLogs] = useState<WorkoutLog[]>([]);

  const getDisplayRoutineName = useCallback(
    (routineName?: string | null) => {
      if (!routineName) return t('workoutLabel');
      if (routineName === '순차 반복' || routineName === 'Sequential') return t('modeSequential');
      if (
        routineName === '랜덤' ||
        routineName === '랜덤 반복' ||
        routineName === 'Random'
      )
        return t('modeRandom');
      if (
        routineName === '자유 복싱' ||
        routineName === '타이머 시작' ||
        routineName === '자유 복싱 타이머' ||
        routineName === 'Free Workout' ||
        routineName === 'Start Timer' ||
        routineName === 'Free Boxing Timer'
      )
        return t('freeWorkoutStart');
      if (
        routineName === '콤보 루틴 훈련' ||
        routineName === '콤보 루틴' ||
        routineName === 'Combo Routine' ||
        routineName === 'Combo Routine Workout'
      )
        return t('comboRoutineWorkout');
      if (routineName === '복싱 훈련' || routineName === 'Boxing Workout')
        return t('workoutLabel');
      return routineName;
    },
    [t]
  );

  const loadHistoryData = useCallback(async () => {
    try {
      const dbLogs = await getWorkoutLogs();
      setLogs(dbLogs);
    } catch (e) {
      console.error('[History] Error loading stats history data:', e);
    }
  }, []);

  useEffect(() => {
    loadHistoryData();
  }, [loadHistoryData]);

  const handleDeleteLog = async (id: number) => {
    const confirmed = await showConfirmDialog({
      title: t('deleteLogConfirmTitle'),
      text: t('deleteLogConfirmText'),
      confirmButtonText: t('delete'),
      cancelButtonText: t('cancel'),
      isDestructive: true,
    });

    if (confirmed) {
      await deleteWorkoutLog(id);
      await loadHistoryData();
    }
  };

  const handleResetData = async () => {
    const confirmed = await showConfirmDialog({
      title: t('clearHistoryConfirmTitle'),
      text: t('clearHistoryConfirmDesc'),
      confirmButtonText: t('clearAll'),
      cancelButtonText: t('cancel'),
      isDestructive: true,
    });

    if (confirmed) {
      await resetProgress();
      await loadHistoryData();
      await showAlert(t('clearDone'), undefined, 'success');
    }
  };

  const totalSessions = logs.length;
  const totalSets = logs.reduce((sum, log) => sum + (log.sets_completed || 0), 0);
  const totalSeconds = logs.reduce((sum, log) => sum + (log.duration_seconds || 0), 0);
  const totalPunches = logs.reduce((sum, log) => sum + (log.total_punches || 0), 0);
  const totalEvasions = logs.reduce((sum, log) => sum + (log.total_evasions || 0), 0);
  const totalCalories = logs.reduce((sum, log) => sum + (log.calories_burned || 0), 0);

  return (
    <AuthGuard
      title={t('historyTitle')}
      description={t('historyGuardDesc')}
    >
      <div className="flex-1 flex flex-col bg-[#0B0C10] text-white select-none">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-3.5 border-b border-[#282C3A]">
        <h1 className="text-[20px] font-black text-[#F8FAFC]">
          {t('historyTitle')}
        </h1>

        {logs.length > 0 && (
          <button
            type="button"
            onClick={handleResetData}
            className="p-2 rounded-xl bg-red-500/15 text-[#EF4444] hover:bg-red-500 hover:text-white transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </header>

      {/* Main Content */}
      <div className="flex-1 px-4 py-3 space-y-4 overflow-y-auto">
        {/* Total Summary 3 Cards */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="bg-[#15171E] rounded-2xl p-3.5 flex flex-col items-center border border-[#282C3A] text-center">
            <Flame className="w-6 h-6 text-[#ff4949] mb-1" />
            <span className="text-base font-black text-[#F8FAFC]">{formatNumber(totalSessions)}</span>
            <span className="text-[10px] text-[#64748B] font-semibold mt-0.5">{t('totalSessions')}</span>
          </div>

          <div className="bg-[#15171E] rounded-2xl p-3.5 flex flex-col items-center border border-[#282C3A] text-center">
            <Trophy className="w-6 h-6 text-[#ff9f0e] mb-1" />
            <span className="text-base font-black text-[#F8FAFC]">{formatNumber(totalSets)}</span>
            <span className="text-[10px] text-[#64748B] font-semibold mt-0.5">{t('totalSetsCompleted')}</span>
          </div>

          <div className="bg-[#15171E] rounded-2xl p-3.5 flex flex-col items-center border border-[#282C3A] text-center">
            <Clock className="w-6 h-6 text-[#8dfd25] mb-1" />
            <span className="text-base font-black text-[#F8FAFC] truncate max-w-full">
              {formatDuration(totalSeconds)}
            </span>
            <span className="text-[10px] text-[#64748B] font-semibold mt-0.5">{t('totalTrainingTime')}</span>
          </div>
        </div>

        {/* ULTIMATE Tier VIP Analytics Section */}
        {limits.showAdvancedStats ? (
          <div className="bg-[#15171E] rounded-2xl p-4 border border-[#FFD700]/40 space-y-3">
            <div className="flex items-center gap-1.5">
              <Crown className="w-4 h-4 text-[#FFD700] fill-[#FFD700]" />
              <span className="text-xs font-black text-[#FFD700]">
                {t('vipAnalyticsHeader')}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center bg-[#0B0C10] p-2.5 rounded-xl border border-[#282C3A]">
                <Flame className="w-4 h-4 text-[#FF2E54] mb-1" />
                <span className="text-sm font-black text-white">{formatNumber(totalPunches)}</span>
                <span className="text-[10px] text-[#94A3B8] font-semibold mt-0.5">
                  {t('totalPunches')}
                </span>
              </div>

              <div className="flex flex-col items-center bg-[#0B0C10] p-2.5 rounded-xl border border-[#282C3A]">
                <Shield className="w-4 h-4 text-[#3B82F6] mb-1" />
                <span className="text-sm font-black text-white">{formatNumber(totalEvasions)}</span>
                <span className="text-[10px] text-[#94A3B8] font-semibold mt-0.5">
                  {t('totalEvasions')}
                </span>
              </div>

              <div className="flex flex-col items-center bg-[#0B0C10] p-2.5 rounded-xl border border-[#282C3A]">
                <Zap className="w-4 h-4 text-[#FFD700] mb-1" />
                <span className="text-sm font-black text-white">{formatNumber(totalCalories)} kcal</span>
                <span className="text-[10px] text-[#94A3B8] font-semibold mt-0.5">
                  {t('caloriesBurned')}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div
            onClick={() => openPaywall('explore_vip_analytics')}
            className="flex items-center justify-between bg-[#15171E] rounded-2xl p-4 border border-[#282C3A] cursor-pointer hover:border-yellow-400/50 transition-all shadow-md group"
          >
            <div>
              <div className="flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-[#FFD700] fill-[#FFD700]" />
                <span className="text-xs font-bold text-white group-hover:text-yellow-400 transition-colors">
                  {t('unlockVipAnalyticsCTA')}
                </span>
              </div>
              <p className="text-[11px] text-[#94A3B8] mt-0.5">
                {t('vipAnalyticsUnlocked')}
              </p>
            </div>
            <div className="bg-[#FFD700] text-black text-[11px] font-black px-2.5 py-1 rounded-lg">
              VIP
            </div>
          </div>
        )}

        {/* Workout Log List */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 pt-2">
            <Calendar className="w-4 h-4 text-white" />
            <h2 className="text-base font-bold text-[#F8FAFC]">{t('workoutLogs')}</h2>
          </div>

          {logs.length === 0 ? (
            <div className="bg-[#15171E] rounded-2xl p-6 border border-dashed border-[#282C3A] text-center text-xs text-[#64748B]">
              {t('noWorkoutLogs')}
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="bg-[#15171E] rounded-2xl p-3.5 border border-[#282C3A] space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 flex-1 min-w-0 mr-2">
                    <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Flame className="w-4 h-4 text-[#ff4949]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-[#F8FAFC] truncate">
                        {getDisplayRoutineName(log.routine_name)}
                      </div>
                      <div className="text-[11px] text-[#64748B]">
                        {formatDate(log.timestamp)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="bg-[#1D202A] px-2 py-0.5 rounded-md text-[11px] font-bold text-white border border-[#282C3A]">
                      {formatNumber(log.sets_completed)} {t('configSets')}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteLog(log.id)}
                      className="p-1 rounded-md bg-[#1D202A] text-[#64748B] hover:text-red-400"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="border-t border-[#282C3A] pt-2 flex flex-col gap-1.5">
                  <span className="text-xs text-[#94A3B8]">
                    {t('workoutTime')}: {formatDuration(log.duration_seconds)}
                  </span>

                  {((log.total_punches ?? 0) > 0 || (log.calories_burned ?? 0) > 0) && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-[#FF2E54]/12 text-[#FF2E54] text-[10px] font-bold px-2 py-0.5 rounded-md">
                        🥊 {log.total_punches ?? 0} {t('punchUnit')}
                      </span>
                      <span className="bg-[#3B82F6]/12 text-[#60A5FA] text-[10px] font-bold px-2 py-0.5 rounded-md">
                        🛡️ {log.total_evasions ?? 0} {t('evasionUnit')}
                      </span>
                      <span className="bg-yellow-400/12 text-[#FFD700] text-[10px] font-bold px-2 py-0.5 rounded-md">
                        ⚡ {log.calories_burned ?? 0} kcal
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Banner Ad */}
      <BannerAd />
    </div>
    </AuthGuard>
  );
}
