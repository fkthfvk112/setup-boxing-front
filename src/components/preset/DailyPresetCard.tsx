'use client';

import React, { useEffect, useState } from 'react';
import { Flame, Play, Sparkles, ChevronRight, Calendar, Dumbbell, Target } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';
import { presetApi, DailyPresetDto } from '../../lib/api/presetApi';
import { SkillInterface, ComboBlock } from '../../types/combo';
import { resolveActionDef } from '../../constants/BoxingActions';
import { workoutGlobal } from '../../utils/workoutGlobal';
import ActionBadge from '../combo/ActionBadge';

const DAYS_ORDER = [
  { key: 'MONDAY', ko: '월', en: 'Mon' },
  { key: 'TUESDAY', ko: '화', en: 'Tue' },
  { key: 'WEDNESDAY', ko: '수', en: 'Wed' },
  { key: 'THURSDAY', ko: '목', en: 'Thu' },
  { key: 'FRIDAY', ko: '금', en: 'Fri' },
  { key: 'SATURDAY', ko: '토', en: 'Sat' },
  { key: 'SUNDAY', ko: '일', en: 'Sun' },
];

const JS_DAY_INDEX_TO_KEY = [
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
];

const getClientLocalDayKey = () => {
  if (typeof window === 'undefined') return 'MONDAY';
  const dayIndex = new Date().getDay(); // 0: Sun, 1: Mon, ... 6: Sat in user's local timezone
  return JS_DAY_INDEX_TO_KEY[dayIndex];
};

export default function DailyPresetCard() {
  const { t, language } = useI18n();
  const isKo = language === 'ko';

  const [weeklyPresets, setWeeklyPresets] = useState<DailyPresetDto[]>([]);
  const [selectedDayKey, setSelectedDayKey] = useState<string>(() => getClientLocalDayKey());
  const [localTodayKey, setLocalTodayKey] = useState<string>(() => getClientLocalDayKey());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const localDay = getClientLocalDayKey();
    setLocalTodayKey(localDay);
    setSelectedDayKey(localDay);

    async function fetchPresets() {
      try {
        setLoading(true);
        const res = await presetApi.getWeeklyPresets();
        if (res.data && res.data.length > 0) {
          setWeeklyPresets(res.data);
        }
      } catch (err) {
        console.error('Failed to load daily presets:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPresets();
  }, []);

  const currentPreset = weeklyPresets.find((p) => p.dayOfWeek === selectedDayKey) || weeklyPresets[0];

  const parsedItems: SkillInterface[] = React.useMemo(() => {
    if (!currentPreset || !currentPreset.comboItemsJson) return [];
    try {
      return JSON.parse(currentPreset.comboItemsJson);
    } catch {
      return [];
    }
  }, [currentPreset]);

  const handleStartWorkout = () => {
    if (!currentPreset || parsedItems.length === 0) return;

    const comboBlocks: ComboBlock[] = parsedItems.map((s, idx) => ({
      id: `${s.id}-${idx}`,
      name: isKo ? s.name : s.nameEn || s.name,
      category: s.category === 'basic' ? 'basic' : 'combination',
      pattern: s.sequence.join('.'),
      actionIds: s.sequence.map((step) => resolveActionDef(step).id),
      defaultStepDurationMs:
        s.durationMs && s.sequence.length > 0
          ? Math.max(300, Math.round(s.durationMs / s.sequence.length))
          : 700,
    }));

    workoutGlobal.start({
      badgeId: currentPreset.id,
      badgeName: isKo ? currentPreset.title : currentPreset.titleEn,
      workoutTime: currentPreset.roundTimeSeconds || 180,
      restTime: currentPreset.restTimeSeconds || 30,
      setsCount: currentPreset.recommendedSets || 5,
      blocks: comboBlocks,
      playMode: 'sequential',
      stepDurationMs: 700,
    });
  };

  if (loading) {
    return (
      <div className="w-full bg-[#15171E] border border-[#232734] rounded-2xl p-6 text-center animate-pulse">
        <div className="h-6 bg-[#232734] rounded-lg w-1/3 mx-auto mb-4" />
        <div className="h-20 bg-[#1A1D26] rounded-xl" />
      </div>
    );
  }

  if (!currentPreset) return null;

  return (
    <div className="w-full bg-gradient-to-br from-[#15171E] via-[#12141A] to-[#0D0E12] border border-[#232734] hover:border-[#FF2E54]/40 transition-all duration-300 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden mb-6">
      {/* Top ambient glow */}
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ backgroundColor: currentPreset.colorTheme || '#FF2E54' }}
      />

      {/* Header Bar */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs text-white shadow-md"
            style={{ backgroundColor: currentPreset.colorTheme || '#FF2E54' }}
          >
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#94A3B8]">
                {t('dailyCourseTitle')}
              </span>
              {currentPreset.dayOfWeek === localTodayKey && (
                <span className="px-1.5 py-0.5 text-[10px] font-black bg-[#FF2E54] text-white rounded-full animate-pulse">
                  TODAY
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-black text-white leading-tight">
              {isKo ? currentPreset.title : currentPreset.titleEn}
            </h3>
          </div>
        </div>
      </div>

      {/* Day Selector Pills */}
      <div className="flex items-center justify-between gap-1.5 bg-[#0A0B0E] p-1.5 rounded-xl border border-[#232734] mb-4">
        {DAYS_ORDER.map((day) => {
          const isSelected = selectedDayKey === day.key;
          const isTodayDay = day.key === localTodayKey;

          return (
            <button
              key={day.key}
              type="button"
              onClick={() => setSelectedDayKey(day.key)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all flex flex-col items-center justify-center relative ${
                isSelected
                  ? 'bg-[#FF2E54] text-white shadow-md scale-[1.02]'
                  : 'text-[#94A3B8] hover:text-white hover:bg-[#1A1D26]'
              }`}
            >
              <span>{isKo ? day.ko : day.en}</span>
              {isTodayDay && (
                <span
                  className={`w-1 h-1 rounded-full mt-0.5 ${
                    isSelected ? 'bg-white' : 'bg-[#FF2E54]'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Focus & Meta Info */}
      <div className="bg-[#1A1D26]/70 rounded-xl p-3.5 border border-[#2A2E3D] mb-4 space-y-2">
        <div className="flex items-start gap-2">
          <Target className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
          <div>
            <span className="text-[11px] font-bold text-[#94A3B8] block">
              {t('coreFocusArea')}
            </span>
            <span className="text-xs sm:text-sm font-bold text-white">
              {isKo ? currentPreset.focusArea : currentPreset.focusAreaEn}
            </span>
          </div>
        </div>

        <p className="text-xs text-[#94A3B8] leading-relaxed pl-6">
          {isKo ? currentPreset.description : currentPreset.descriptionEn}
        </p>

        {/* Round Specs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#2A2E3D] text-[11px] text-[#64748B]">
          <span className="flex items-center gap-1 font-semibold text-[#CBD5E1]">
            <Dumbbell className="w-3.5 h-3.5 text-[#FF2E54]" />
            {currentPreset.recommendedSets} {t('roundsUnit')} ({Math.floor(currentPreset.roundTimeSeconds / 60)}m / {currentPreset.restTimeSeconds}s Rest)
          </span>
          <span className="text-[#475569]">•</span>
          <span className="text-[#94A3B8] font-medium">{currentPreset.tagList}</span>
        </div>
      </div>

      {/* Sequence Preview Badges */}
      <div className="mb-5">
        <span className="text-[11px] font-bold text-[#64748B] block mb-2 uppercase tracking-wide">
          {t('routineSequence')}
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {parsedItems.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="flex items-center gap-1.5 bg-[#0F1117] border border-[#232734] px-2.5 py-1.5 rounded-lg shadow-sm"
            >
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: item.color || '#FF2E54' }}
              />
              <span className="text-xs font-bold text-white whitespace-nowrap">
                {isKo ? item.name : item.nameEn || item.name}
              </span>
              <div className="flex items-center gap-0.5 ml-1">
                {item.sequence.slice(0, 3).map((token, tIdx) => (
                  <ActionBadge key={tIdx} action={resolveActionDef(token)} size="sm" />
                ))}
                {item.sequence.length > 3 && (
                  <span className="text-[10px] text-[#64748B] font-bold">+{item.sequence.length - 3}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Start Button */}
      <button
        type="button"
        onClick={handleStartWorkout}
        className="w-full py-3.5 px-4 bg-gradient-to-r from-[#FF2E54] to-[#E11D48] hover:from-[#FF4567] hover:to-[#F43F5E] active:scale-[0.99] text-white font-black text-sm sm:text-base rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#FF2E54]/25 transition-all"
      >
        <Play className="w-5 h-5 fill-white" />
        <span>
          {t('startDayCourse', {
            dayName: isKo ? currentPreset.dayNameKo : currentPreset.dayNameEn,
            mins: Math.floor(currentPreset.roundTimeSeconds / 60),
            sets: currentPreset.recommendedSets,
          })}
        </span>
      </button>
    </div>
  );
}
