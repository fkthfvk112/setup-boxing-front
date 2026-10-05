'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Calendar,
  CheckSquare,
  Crown,
  Layers,
  Lock,
  Minus,
  Play,
  Plus,
  Repeat,
  RotateCcw,
  Settings,
  Shuffle,
  Sparkles,
  Square as SquareIcon,
  Trash2,
  X,
} from 'lucide-react';
import { useI18n } from '../hooks/useI18n';
import { useEntitlements } from '../context/EntitlementContext';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import BannerAd from '../components/BannerAd';
import ActionBadge from '../components/combo/ActionBadge';
import LegalModal, { LegalModalType } from '../components/legal/LegalModal';
import { resolveActionDef } from '../constants/BoxingActions';
import { COMBO_SKILL_PRESETS } from '../constants/ComboPresets';
import {
  DAILY_PRESETS,
  DailyPresetItem,
  getTodayPresetConstant,
  getPresetByDayIndex,
} from '../constants/DailyPresets';
import { ComboBlock, SkillInterface } from '../types/combo';
import {
  AppSettings,
  getAppSettings,
  getCustomCombos,
  getLastPlaylist,
  saveAppSettings,
  saveLastPlaylist,
} from '../utils/webDb';
import { showAlert } from '../utils/swal';
import { workoutGlobal, useGlobalWorkout } from '../utils/workoutGlobal';

const UNLOCKED_GUEST_PRESET_IDS = ['preset-one-two', 'preset-1-1-2'];

export default function HomeScreen() {
  const { t, language } = useI18n();
  const isKo = language === 'ko';
  const { tier, isPro, isUltimate, openPaywall, isAuthenticated, openAuthModal } = useEntitlements();
  const globalWorkout = useGlobalWorkout();
  const [legalModal, setLegalModal] = useState<{ isOpen: boolean; type: LegalModalType }>({
    isOpen: false,
    type: 'terms',
  });

  // Settings state
  const [settings, setSettings] = useState<AppSettings>({
    workoutTime: 180,
    restTime: 30,
    setsCount: 3,
    demoSpeed: 1.0,
  });

  // Settings modal state
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [editWorkMin, setEditWorkMin] = useState('3');
  const [editWorkSec, setEditWorkSec] = useState('0');
  const [editRestMin, setEditRestMin] = useState('0');
  const [editRestSec, setEditRestSec] = useState('30');
  const [editSets, setEditSets] = useState(3);

  // Playlist state
  const [playlistItems, setPlaylistItems] = useState<SkillInterface[]>([]);
  const [playMode, setPlayMode] = useState<'sequential' | 'random'>('sequential');

  // Combo Selector Modal state
  const [comboModalVisible, setComboModalVisible] = useState(false);
  const [comboModalTab, setComboModalTab] = useState<'daily' | 'combo' | 'my'>('daily');
  const [modalSelectedDayIndex, setModalSelectedDayIndex] = useState<number>(() => new Date().getDay());
  const [myCombos, setMyCombos] = useState<SkillInterface[]>([]);

  // Current client local today preset
  const todayPreset = React.useMemo(() => getTodayPresetConstant(new Date()), []);
  const modalDayPreset = React.useMemo(
    () => getPresetByDayIndex(modalSelectedDayIndex),
    [modalSelectedDayIndex]
  );

  // Load data & set default daily preset if not configured
  const loadData = useCallback(async () => {
    try {
      const dbSettings = await getAppSettings();
      setSettings(dbSettings);

      const lastPlaylist = await getLastPlaylist();
      if (lastPlaylist && lastPlaylist.items && lastPlaylist.items.length > 0) {
        setPlayMode(lastPlaylist.mode || 'sequential');
        setPlaylistItems(lastPlaylist.items);
      } else {
        // Default: If user has not picked a playlist, select today's local daily preset!
        const defaultToday = getTodayPresetConstant(new Date());
        setPlayMode('sequential');
        setPlaylistItems(defaultToday.comboItems);
        await saveLastPlaylist({ mode: 'sequential', items: defaultToday.comboItems });
      }

      const customs = await getCustomCombos();
      setMyCombos(customs);
    } catch (e) {
      console.error('[HomeScreen] Error loading data:', e);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Reload when workout closes
  useEffect(() => {
    if (!globalWorkout.isActive) {
      loadData();
    }
  }, [globalWorkout.isActive, loadData]);

  // Playlist handlers
  const handleToggleMode = async (mode: 'sequential' | 'random') => {
    setPlayMode(mode);
    await saveLastPlaylist({ mode, items: playlistItems });
  };

  const handleRemovePlaylistItem = async (index: number) => {
    const updated = playlistItems.filter((_, i) => i !== index);
    setPlaylistItems(updated);
    await saveLastPlaylist({ mode: playMode, items: updated });
  };

  const handleClearPlaylist = async () => {
    setPlaylistItems([]);
    await saveLastPlaylist({ mode: playMode, items: [] });
  };

  const handleApplyTodayPreset = async () => {
    const target = getTodayPresetConstant(new Date());
    setPlaylistItems(target.comboItems);
    setPlayMode('sequential');
    await saveLastPlaylist({ mode: 'sequential', items: target.comboItems });
    await showAlert(
      t('dayPresetApplied', { dayName: isKo ? target.dayNameKo : target.dayNameEn }),
      isKo
        ? `${target.title} 루틴이 플레이리스트에 설정되었습니다.`
        : `${target.titleEn} has been loaded into your playlist.`,
      'success'
    );
  };

  const handleApplyDayPresetToPlaylist = async (preset: DailyPresetItem) => {
    setPlaylistItems(preset.comboItems);
    setPlayMode('sequential');
    await saveLastPlaylist({ mode: 'sequential', items: preset.comboItems });
    setComboModalVisible(false);
    await showAlert(
      t('dayPresetApplied', { dayName: isKo ? preset.dayNameKo : preset.dayNameEn }),
      isKo
        ? `${preset.title} 루틴이 플레이리스트에 설정되었습니다.`
        : `${preset.titleEn} has been loaded into your playlist.`,
      'success'
    );
  };

  const handleToggleSkillSelection = async (skill: SkillInterface) => {
    if (!isAuthenticated && skill.isCombo && !UNLOCKED_GUEST_PRESET_IDS.includes(skill.id)) {
      openAuthModal(
        isKo
          ? '원투, 더블잽 이외의 프리셋 콤보는 로그인 후 이용하실 수 있습니다.'
          : 'Sign in to unlock all combo presets.'
      );
      return;
    }

    const exists = playlistItems.some((item) => item.id === skill.id);
    let updated: SkillInterface[];
    if (exists) {
      updated = playlistItems.filter((item) => item.id !== skill.id);
    } else {
      updated = [...playlistItems, skill];
    }
    setPlaylistItems(updated);
    await saveLastPlaylist({ mode: playMode, items: updated });
  };

  const startFreeWorkout = () => {
    workoutGlobal.start({
      badgeId: null,
      badgeName: t('freeWorkoutStart'),
      workoutTime: settings.workoutTime,
      restTime: settings.restTime,
      setsCount: settings.setsCount,
    });
  };

  const handleStartComboWorkout = () => {
    if (playlistItems.length === 0) {
      startFreeWorkout();
      return;
    }

    const blocks: ComboBlock[] = playlistItems.map((s, idx) => ({
      id: `${s.presetId || s.id}-${idx}`,
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
      badgeId: null,
      badgeName: playMode === 'random' ? t('modeRandom') : t('modeSequential'),
      workoutTime: settings.workoutTime,
      restTime: settings.restTime,
      setsCount: settings.setsCount,
      blocks: blocks,
      playMode: playMode,
      stepDurationMs: 700,
    });
  };

  const handleOpenSettings = () => {
    setEditWorkMin(Math.floor(settings.workoutTime / 60).toString());
    setEditWorkSec((settings.workoutTime % 60).toString());
    setEditRestMin(Math.floor(settings.restTime / 60).toString());
    setEditRestSec((settings.restTime % 60).toString());
    setEditSets(settings.setsCount);
    setSettingsModalVisible(true);
  };

  const handleSaveSettings = async () => {
    const workTime = parseInt(editWorkMin, 10) * 60 + (parseInt(editWorkSec, 10) || 0);
    const restTime = parseInt(editRestMin, 10) * 60 + (parseInt(editRestSec, 10) || 0);

    if (isNaN(workTime) || workTime <= 0) {
      await showAlert(t('invalidWorkoutTime'), undefined, 'warning');
      return;
    }
    if (isNaN(restTime) || restTime < 0) {
      await showAlert(t('invalidRestTime'), undefined, 'warning');
      return;
    }

    const newSettings: AppSettings = {
      workoutTime: workTime,
      restTime: restTime,
      setsCount: editSets,
      demoSpeed: settings.demoSpeed,
    };

    await saveAppSettings(newSettings);
    setSettings(newSettings);
    setSettingsModalVisible(false);
  };

  const formatMinutesLabel = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return s > 0 ? `${m}m ${s}s` : `${m}m`;
  };

  // Check if current playlist exactly matches today's preset
  const isTodayPresetActive =
    playlistItems.length > 0 &&
    todayPreset.comboItems.length === playlistItems.length &&
    todayPreset.comboItems.every((item, idx) => item.id === playlistItems[idx]?.id);

  return (
    <div className="flex-1 flex flex-col bg-[#0B0C10] text-white select-none">
      {/* App Header */}
      <header className="flex items-center justify-between px-5 py-3.5 border-b border-[#282C3A]">
        <div className="flex items-center gap-3">
          <img
            src="/icon.png"
            alt="Setup Boxing"
            className="w-10 h-10 rounded-xl shadow-md border border-[#282C3A] object-cover"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-[20px] font-black text-[#F8FAFC] tracking-tight leading-none">
                {t('appTitle')}
              </h1>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-[#FF2E54]/15 border border-[#FF2E54]/30 text-[#FF2E54] leading-none">
                beta
              </span>
            </div>
            <p className="text-[11px] text-[#94A3B8] font-semibold mt-1">
              {t('appSubtitle')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated && (
            <button
              type="button"
              onClick={() => openPaywall('home_header')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-extrabold transition-all active:scale-95 ${
                tier === 'ULTIMATE'
                  ? 'bg-[#FFD700]/15 border-[#FFD700]/50 text-[#FFD700] hover:bg-[#FFD700]/25'
                  : tier === 'PRO'
                  ? 'bg-[#FF2E54]/15 border-[#FF2E54]/50 text-[#FF2E54] hover:bg-[#FF2E54]/25'
                  : 'bg-gradient-to-r from-[#FF2E54] to-[#FF5E7E] border-[#FF2E54] text-white shadow-md shadow-[#FF2E54]/30 hover:shadow-lg hover:shadow-[#FF2E54]/50 hover:brightness-110'
              }`}
            >
              {tier === 'FREE' ? (
                <Sparkles className="w-3.5 h-3.5 fill-white text-white animate-pulse" />
              ) : (
                <Crown
                  className={`w-3.5 h-3.5 ${
                    tier === 'ULTIMATE'
                      ? 'text-[#FFD700] fill-[#FFD700]'
                      : 'text-[#FF2E54] fill-[#FF2E54]'
                  }`}
                />
              )}
              <span>
                {tier === 'ULTIMATE'
                  ? 'ULTIMATE'
                  : tier === 'PRO'
                  ? 'PRO'
                  : t('upgradeToPro')}
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={handleOpenSettings}
            className="p-2 rounded-xl bg-[#15171E] border border-[#282C3A] text-white hover:border-white/50 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Scroll Content */}
      <div className="flex-1 px-4 py-3 space-y-3.5 overflow-y-auto">
        {/* Workout Configuration Summary */}
        <div className="flex items-center justify-around bg-[#15171E] rounded-xl p-3 border border-[#282C3A]">
          <div className="flex flex-col items-center flex-1">
            <span className="text-[11px] text-[#94A3B8] mb-0.5">{t('configWorkout')}</span>
            <span className="text-[13px] font-bold text-[#F8FAFC]">
              {formatMinutesLabel(settings.workoutTime)}
            </span>
          </div>
          <div className="w-[1px] h-6 bg-[#282C3A]" />
          <div className="flex flex-col items-center flex-1">
            <span className="text-[11px] text-[#94A3B8] mb-0.5">{t('configRest')}</span>
            <span className="text-[13px] font-bold text-[#F8FAFC]">
              {formatMinutesLabel(settings.restTime)}
            </span>
          </div>
          <div className="w-[1px] h-6 bg-[#282C3A]" />
          <div className="flex flex-col items-center flex-1">
            <span className="text-[11px] text-[#94A3B8] mb-0.5">{t('configSets')}</span>
            <span className="text-[13px] font-bold text-[#F8FAFC]">{settings.setsCount}</span>
          </div>
        </div>

        {/* Workout Playlist Section (Original Design with Daily Preset Integration) */}
        <div className="bg-[#15171E] rounded-2xl p-4 border border-[#282C3A] space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#F8FAFC]">{t('workoutPlaylist')}</span>
              {playlistItems.length > 0 && (
                <span className="bg-[#282C3A] text-[#94A3B8] text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
                  {t('selectedCount', { count: playlistItems.length })}
                </span>
              )}
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center bg-[#0B0C10] p-1 rounded-xl border border-[#282C3A] gap-1">
              <button
                type="button"
                onClick={() => handleToggleMode('sequential')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  playMode === 'sequential'
                    ? 'bg-[#1E222D] text-white shadow-sm'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                <Repeat className="w-3 h-3" />
                <span>{t('modeSequential')}</span>
              </button>

              <button
                type="button"
                onClick={() => handleToggleMode('random')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  playMode === 'random'
                    ? 'bg-[#1E222D] text-white shadow-sm'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                <Shuffle className="w-3 h-3" />
                <span>{t('modeRandom')}</span>
              </button>
            </div>
          </div>

          {/* Daily Preset Status & Quick Action Bar */}
          <div className="flex items-center justify-between bg-[#0B0C10] px-3 py-2 rounded-xl border border-[#282C3A] text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-[#FF2E54] text-white shrink-0">
                {isKo ? todayPreset.dayNameKo : todayPreset.dayNameEn}
              </span>
              <span className="text-[#94A3B8] font-medium truncate">
                {isTodayPresetActive
                  ? isKo
                    ? `오늘 추천: ${todayPreset.title}`
                    : `Today's: ${todayPreset.titleEn}`
                  : isKo
                  ? '커스텀 콤보 설정됨'
                  : 'Custom Playlist Active'}
              </span>
            </div>

            {!isTodayPresetActive && (
              <button
                type="button"
                onClick={handleApplyTodayPreset}
                className="flex items-center gap-1 text-[11px] font-bold text-[#FF6B00] hover:text-[#ff8533] ml-2 shrink-0 transition-colors"
              >
                <RotateCcw className="w-3 h-3 text-[#FF6B00]" />
                <span>{t('loadTodayPreset')}</span>
              </button>
            )}
          </div>

          {/* Playlist Items / Empty state */}
          {playlistItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 border border-dashed border-[#282C3A] rounded-xl space-y-2.5">
              <span className="text-xs text-[#94A3B8]">{t('emptyPlaylist')}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setComboModalVisible(true)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#282C3A] text-white text-xs font-bold hover:bg-[#343a4c] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('addCombo')}</span>
                </button>
                <button
                  type="button"
                  onClick={handleApplyTodayPreset}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#FF6B00]/15 border border-[#FF6B00]/40 text-[#FF6B00] text-xs font-bold hover:bg-[#FF6B00]/25 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
                  <span>{t('loadTodayPreset')}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                {playlistItems.map((item, index) => {
                  const displayName = isKo ? item.name : item.nameEn || item.name;
                  return (
                    <div
                      key={`${item.id}-${index}`}
                      className="flex items-center bg-[#1D202A] border border-[#2A303F] rounded-xl px-2.5 py-1.5 shrink-0 gap-1.5"
                    >
                      <div
                        style={{ backgroundColor: item.color || '#FFFFFF' }}
                        className="w-2 h-2 rounded-full"
                      />
                      <span className="text-xs font-bold text-white truncate max-w-[100px]">
                        {displayName}
                      </span>
                      {item.durationMs && (
                        <span className="text-[10px] text-[#94A3B8] font-semibold">
                          {(item.durationMs / 1000).toFixed(1)}s
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemovePlaylistItem(index)}
                        className="p-0.5 text-[#94A3B8] hover:text-white ml-0.5"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setComboModalVisible(true)}
                  className="flex items-center gap-1 text-xs font-bold text-white hover:text-[#FF6B00] transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t('addCombo')}</span>
                </button>

                <button
                  type="button"
                  onClick={handleClearPlaylist}
                  className="flex items-center gap-1 text-xs font-bold text-[#94A3B8] hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{t('clearPlaylist')}</span>
                </button>
              </div>
            </div>
          )}

          {/* Workout Launch Buttons */}
          {playlistItems.length > 0 ? (
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleStartComboWorkout}
                className="w-full py-3.5 rounded-xl bg-[#FF2E54] text-white font-extrabold text-[15px] flex items-center justify-center gap-2 hover:bg-red-600 transition-all shadow-lg shadow-red-500/25 active:scale-[0.98]"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>
                  {t('startComboWorkout')} ({playMode === 'random' ? t('modeRandom') : t('modeSequential')})
                </span>
              </button>

              <button
                type="button"
                onClick={startFreeWorkout}
                className="w-full text-center text-xs text-[#94A3B8] hover:text-white py-1 transition-colors"
              >
                {t('freeWorkoutOnly')}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={startFreeWorkout}
              className="w-full py-3.5 rounded-xl bg-[#FF2E54] text-white font-extrabold text-[15px] flex items-center justify-center gap-2 hover:bg-red-600 transition-all shadow-lg shadow-red-500/25 active:scale-[0.98]"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>{t('freeWorkoutStart')}</span>
            </button>
          )}
        </div>
        
        {/* Combo Routine Banner (Link to Routine Builder) */}
        <Link
          href="/routine-builder"
          className="flex items-center bg-[#15171E] rounded-2xl p-4 border-[1.5px] border-[#282C3A] hover:border-[#FF6B00]/50 transition-all shadow-md group"
        >
          <div className="w-12 h-12 rounded-full bg-[#FF6B00]/10 flex items-center justify-center mr-3 shrink-0 group-hover:scale-105 transition-transform">
            <Layers className="w-6 h-6 text-[#FF6B00]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[15px] font-extrabold text-[#F8FAFC]">
                {t('comboRoutineTitle')}
              </span>
              <span className="bg-gradient-to-r from-[#FF2E54] to-[#FF6B00] text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm">
                NEW
              </span>
            </div>
            <p className="text-[12px] text-[#94A3B8] mt-0.5 line-clamp-1">
              {t('comboRoutineDesc')}
            </p>
          </div>
        </Link>

      </div>

      {/* Banner Ad */}
      <BannerAd />

      {/* Settings Modal */}
      {settingsModalVisible && (
        <div
          onClick={() => setSettingsModalVisible(false)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#15171E] w-full max-w-sm rounded-2xl border border-[#282C3A] p-5 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#282C3A]">
              <h3 className="text-base font-extrabold text-white">{t('settingsTitle')}</h3>
              <button
                type="button"
                onClick={() => setSettingsModalVisible(false)}
                className="p-1 text-[#94A3B8] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Workout time */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#94A3B8]">{t('workoutTime')}</label>
              <div className="flex items-center gap-2 bg-[#0B0C10] p-2 rounded-xl border border-[#282C3A]">
                <input
                  type="number"
                  value={editWorkMin}
                  onChange={(e) => setEditWorkMin(e.target.value)}
                  className="w-12 bg-transparent text-center font-bold text-white outline-none"
                />
                <span className="text-xs text-[#64748B]">m</span>
                <input
                  type="number"
                  value={editWorkSec}
                  onChange={(e) => setEditWorkSec(e.target.value)}
                  className="w-12 bg-transparent text-center font-bold text-white outline-none"
                />
                <span className="text-xs text-[#64748B]">s</span>
              </div>
            </div>

            {/* Rest time */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#94A3B8]">{t('restTime')}</label>
              <div className="flex items-center gap-2 bg-[#0B0C10] p-2 rounded-xl border border-[#282C3A]">
                <input
                  type="number"
                  value={editRestMin}
                  onChange={(e) => setEditRestMin(e.target.value)}
                  className="w-12 bg-transparent text-center font-bold text-white outline-none"
                />
                <span className="text-xs text-[#64748B]">m</span>
                <input
                  type="number"
                  value={editRestSec}
                  onChange={(e) => setEditRestSec(e.target.value)}
                  className="w-12 bg-transparent text-center font-bold text-white outline-none"
                />
                <span className="text-xs text-[#64748B]">s</span>
              </div>
            </div>

            {/* Sets Count Stepper */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#94A3B8]">{t('setsCount')}</label>
              <div className="flex items-center justify-between bg-[#0B0C10] p-2 rounded-xl border border-[#282C3A]">
                <button
                  type="button"
                  onClick={() => setEditSets(Math.max(1, editSets - 1))}
                  className="p-1 rounded-lg bg-[#1E222D] text-white hover:bg-[#282C3A]"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-base font-black text-white">{editSets}</span>
                <button
                  type="button"
                  onClick={() => setEditSets(Math.min(20, editSets + 1))}
                  className="p-1 rounded-lg bg-[#1E222D] text-white hover:bg-[#282C3A]"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Language */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#94A3B8]">{t('language')}</label>
              <LanguageSwitcher variant="segmented" />
            </div>

            {/* Guide & Inquiry & Legal Links */}
            <div className="pt-2 border-t border-[#282C3A] space-y-1.5">
              <Link
                href="/guide"
                onClick={() => setSettingsModalVisible(false)}
                className="w-full py-2.5 px-3 rounded-xl bg-[#0B0C10] border border-[#282C3A] hover:border-white/30 text-xs font-bold text-[#94A3B8] hover:text-white flex items-center justify-between transition-colors"
              >
                <span>{t('appGuideFaq')}</span>
                <span className="text-[10px] text-[#64748B]">&rarr;</span>
              </Link>
              <Link
                href="/inquiry"
                onClick={() => setSettingsModalVisible(false)}
                className="w-full py-2.5 px-3 rounded-xl bg-[#0B0C10] border border-[#282C3A] hover:border-white/30 text-xs font-bold text-[#94A3B8] hover:text-white flex items-center justify-between transition-colors"
              >
                <span>{t('inquiryTitle')}</span>
                <span className="text-[10px] text-[#64748B]">1:1 Support &rarr;</span>
              </Link>
              <div className="flex items-center justify-between px-1 pt-1 text-[11px] text-[#64748B]">
                <button
                  type="button"
                  onClick={() => setLegalModal({ isOpen: true, type: 'terms' })}
                  className="hover:text-[#94A3B8] underline transition-colors cursor-pointer"
                >
                  {isKo ? '서비스 이용약관' : 'Terms of Service'}
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => setLegalModal({ isOpen: true, type: 'privacy' })}
                  className="hover:text-[#94A3B8] underline transition-colors cursor-pointer"
                >
                  {isKo ? '개인정보 처리방침' : 'Privacy Policy'}
                </button>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSettingsModalVisible(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#1E222D] text-[#94A3B8] font-bold text-xs hover:text-white"
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                onClick={handleSaveSettings}
                className="flex-1 py-2.5 rounded-xl bg-[#FF2E54] text-white font-extrabold text-xs hover:bg-red-600 transition-colors"
              >
                {t('save')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Combo Selector Modal with Daily Presets, Basic Combos & My Combos */}
      {comboModalVisible && (
        <div
          onClick={() => setComboModalVisible(false)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#15171E] w-full max-w-sm rounded-2xl border border-[#282C3A] flex flex-col max-h-[85vh] shadow-2xl"
          >
            <div className="flex items-center justify-between p-4 border-b border-[#282C3A]">
              <h3 className="text-sm font-extrabold text-white">
                {t('selectCombosModalTitle')}
              </h3>
              <button
                type="button"
                onClick={() => setComboModalVisible(false)}
                className="p-1 text-[#94A3B8] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 3 Tabs: 요일별 프리셋 / 기본 콤보 / 내 콤보 */}
            <div className="flex border-b border-[#282C3A] bg-[#0E1015]">
              <button
                type="button"
                onClick={() => setComboModalTab('daily')}
                className={`flex-1 py-2.5 text-xs font-extrabold text-center border-b-2 transition-all ${
                  comboModalTab === 'daily'
                    ? 'border-[#FF2E54] text-white bg-[#15171E]'
                    : 'border-transparent text-[#94A3B8] hover:text-white'
                }`}
              >
                {t('tabDailyPresets')}
              </button>
              <button
                type="button"
                onClick={() => setComboModalTab('combo')}
                className={`flex-1 py-2.5 text-xs font-extrabold text-center border-b-2 transition-all ${
                  comboModalTab === 'combo'
                    ? 'border-[#FF2E54] text-white bg-[#15171E]'
                    : 'border-transparent text-[#94A3B8] hover:text-white'
                }`}
              >
                {t('tabPresetCombos')}
              </button>
              <button
                type="button"
                onClick={() => setComboModalTab('my')}
                className={`flex-1 py-2.5 text-xs font-extrabold text-center border-b-2 transition-all ${
                  comboModalTab === 'my'
                    ? 'border-[#FF2E54] text-white bg-[#15171E]'
                    : 'border-transparent text-[#94A3B8] hover:text-white'
                }`}
              >
                {t('tabMyCombos')} ({myCombos.length})
              </button>
            </div>

            {/* Tab 1: Daily Presets View */}
            {comboModalTab === 'daily' && (
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {/* 7 Days selector bar */}
                <div className="flex items-center justify-between gap-1 bg-[#0A0B0E] p-1.5 rounded-xl border border-[#232734]">
                  {DAILY_PRESETS.map((day) => {
                    const isSelected = modalSelectedDayIndex === day.dayIndex;
                    const isToday = todayPreset.dayIndex === day.dayIndex;
                    return (
                      <button
                        key={day.id}
                        type="button"
                        onClick={() => setModalSelectedDayIndex(day.dayIndex)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all flex flex-col items-center justify-center ${
                          isSelected
                            ? 'bg-[#FF2E54] text-white shadow-md'
                            : 'text-[#94A3B8] hover:text-white hover:bg-[#1A1D26]'
                        }`}
                      >
                        <span>{isKo ? day.dayShortKo : day.dayShortEn}</span>
                        {isToday && (
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

                {/* Day Routine Card & Apply All Button */}
                <div className="bg-[#0B0C10] rounded-xl p-3 border border-[#282C3A] space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-white">
                          {isKo ? modalDayPreset.title : modalDayPreset.titleEn}
                        </span>
                        {modalDayPreset.dayIndex === todayPreset.dayIndex && (
                          <span className="px-1.5 py-0.2 text-[9px] font-black bg-[#FF2E54] text-white rounded-full">
                            TODAY
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#94A3B8] mt-0.5">
                        {isKo ? modalDayPreset.focusArea : modalDayPreset.focusAreaEn}
                      </p>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#64748B] leading-relaxed">
                    {isKo ? modalDayPreset.description : modalDayPreset.descriptionEn}
                  </p>

                  <button
                    type="button"
                    onClick={() => handleApplyDayPresetToPlaylist(modalDayPreset)}
                    className="w-full py-2.5 bg-gradient-to-r from-[#FF2E54] to-[#FF6B00] hover:from-[#e02647] hover:to-[#e65c00] text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md shadow-[#FF2E54]/20 transition-all active:scale-[0.98]"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>
                      {isKo
                        ? `${modalDayPreset.dayNameKo} 루틴 전체 플레이리스트에 담기`
                        : `Apply ${modalDayPreset.dayNameEn} Routine to Playlist`}
                    </span>
                  </button>
                </div>

                {/* Included Combos (Read-only sequence preview - whole routine package) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] font-bold text-[#94A3B8]">
                      {t('routineCombosCount')}
                    </span>
                    <span className="text-[10px] text-[#64748B] font-semibold">
                      {t('totalCombosCount', { count: modalDayPreset.comboItems.length })}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {modalDayPreset.comboItems.map((skill, sIdx) => {
                      const displayName = isKo ? skill.name : skill.nameEn || skill.name;
                      const displayDesc = isKo
                        ? skill.description
                        : skill.descriptionEn || skill.description;

                      return (
                        <div
                          key={`${skill.id}-${sIdx}`}
                          className="flex items-center p-2.5 rounded-xl border border-[#232734] bg-[#0A0B0E] justify-between shadow-sm"
                        >
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <div
                              style={{ backgroundColor: skill.color || '#FF2E54' }}
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                            />

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-white truncate mr-2">
                                  {displayName}
                                </span>
                              </div>
                              <p className="text-[10px] text-[#64748B] truncate mt-0.5">
                                {displayDesc ||
                                  skill.sequence
                                    .map((step) => {
                                      const def = resolveActionDef(step);
                                      return isKo ? def.nameKo : def.nameEn || def.nameKo;
                                    })
                                    .join(' · ')}
                              </p>
                            </div>
                          </div>

                          {skill.durationMs && (
                            <span className="text-[10px] text-[#94A3B8] font-bold shrink-0 ml-2 bg-[#15171E] px-1.5 py-0.5 rounded border border-[#282C3A]">
                              {(skill.durationMs / 1000).toFixed(1)}s
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Standard Preset Combos View */}
            {comboModalTab === 'combo' && (
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {COMBO_SKILL_PRESETS.map((skill) => {
                  const isSelected = playlistItems.some((p) => p.id === skill.id);
                  const isLocked = !isAuthenticated && !UNLOCKED_GUEST_PRESET_IDS.includes(skill.id);
                  const displayName = isKo ? skill.name : skill.nameEn || skill.name;
                  const displayDesc = isKo
                    ? skill.description
                    : skill.descriptionEn || skill.description;

                  if (isLocked) {
                    return (
                      <div
                        key={skill.id}
                        onClick={() =>
                          openAuthModal(
                            isKo
                              ? '원투, 더블잽 이외의 프리셋 콤보는 로그인 후 이용하실 수 있습니다.'
                              : 'Sign in to unlock all combo presets.'
                          )
                        }
                        className="relative overflow-hidden flex items-center p-3 rounded-xl border border-[#282C3A] bg-[#0E1015] cursor-pointer hover:border-[#475569] transition-all group"
                      >
                        {/* Blurred background content */}
                        <div className="flex items-center w-full filter blur-[2px] opacity-25 select-none pointer-events-none">
                          <div className="mr-3">
                            <SquareIcon className="w-5 h-5 text-[#334155]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-[#94A3B8] truncate mr-2">
                                {displayName}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#475569] truncate mt-0.5">
                              {displayDesc || skill.sequence.join(' · ')}
                            </p>
                          </div>
                        </div>

                        {/* Lock Overlay (Sleek Grey / Slate Theme) */}
                        <div className="absolute inset-0 bg-[#0E1015]/75 backdrop-blur-[1px] flex items-center justify-between px-3.5 z-10">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-[#1E222D] border border-[#33394B] flex items-center justify-center text-[#94A3B8] shrink-0 group-hover:text-white transition-colors">
                              <Lock className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-[#E2E8F0]">
                                {displayName}
                              </div>
                              <p className="text-[10px] text-[#64748B]">
                                {t('authRequiredTitle')}
                              </p>
                            </div>
                          </div>

                          <span className="text-[11px] font-medium text-[#CBD5E1] group-hover:text-white bg-[#1E222D] group-hover:bg-[#282C3A] px-2.5 py-1 rounded-lg border border-[#374151] group-hover:border-[#4B5563] transition-all shadow-sm shrink-0">
                            {t('fastAuthTitle')}
                          </span>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={skill.id}
                      onClick={() => handleToggleSkillSelection(skill)}
                      className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#1D202A] border-[#FF2E54]'
                          : 'bg-[#0B0C10] border-[#282C3A] hover:border-white/30'
                      }`}
                    >
                      <div className="mr-3">
                        {isSelected ? (
                          <CheckSquare className="w-5 h-5 text-[#FF2E54]" />
                        ) : (
                          <SquareIcon className="w-5 h-5 text-[#475569]" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white truncate mr-2">
                            {displayName}
                          </span>
                          {skill.durationMs && (
                            <span className="text-[10px] text-[#94A3B8] font-semibold">
                              {(skill.durationMs / 1000).toFixed(1)}s
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#64748B] truncate mt-0.5">
                          {displayDesc ||
                            skill.sequence
                              .map((step) => {
                                const def = resolveActionDef(step);
                                return isKo ? def.nameKo : def.nameEn || def.nameKo;
                              })
                              .join(' · ')}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Tab 3: My Combos View */}
            {comboModalTab === 'my' && (
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {myCombos.length === 0 ? (
                  <div className="py-12 text-center text-xs text-[#94A3B8] space-y-2">
                    <p>{t('emptyMyCombos')}</p>
                    <Link
                      href="/routine-builder"
                      onClick={() => setComboModalVisible(false)}
                      className="inline-block px-3 py-1.5 rounded-lg bg-[#282C3A] text-white font-bold text-xs hover:bg-[#343a4c]"
                    >
                      {t('comboRoutineTitle')} &rarr;
                    </Link>
                  </div>
                ) : (
                  myCombos.map((skill) => {
                    const isSelected = playlistItems.some((p) => p.id === skill.id);
                    const displayName = isKo ? skill.name : skill.nameEn || skill.name;
                    const displayDesc = isKo
                      ? skill.description
                      : skill.descriptionEn || skill.description;

                    return (
                      <div
                        key={skill.id}
                        onClick={() => handleToggleSkillSelection(skill)}
                        className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#1D202A] border-[#FF2E54]'
                            : 'bg-[#0B0C10] border-[#282C3A] hover:border-white/30'
                        }`}
                      >
                        <div className="mr-3">
                          {isSelected ? (
                            <CheckSquare className="w-5 h-5 text-[#FF2E54]" />
                          ) : (
                            <SquareIcon className="w-5 h-5 text-[#475569]" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white truncate mr-2">
                              {displayName}
                            </span>
                            {skill.durationMs && (
                              <span className="text-[10px] text-[#94A3B8] font-semibold">
                                {(skill.durationMs / 1000).toFixed(1)}s
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#64748B] truncate mt-0.5">
                            {displayDesc ||
                              skill.sequence
                                .map((step) => {
                                  const def = resolveActionDef(step);
                                  return isKo ? def.nameKo : def.nameEn || def.nameKo;
                                })
                                .join(' · ')}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Modal Footer */}
            <div className="p-3 border-t border-[#282C3A] flex items-center justify-between bg-[#15171E] rounded-b-2xl">
              <span className="text-xs font-bold text-[#94A3B8]">
                {t('selectedCount', { count: playlistItems.length })}
              </span>
              <button
                type="button"
                onClick={() => setComboModalVisible(false)}
                className="px-5 py-2 rounded-xl bg-[#FF2E54] text-white font-extrabold text-xs hover:bg-red-600 transition-colors"
              >
                {t('done')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Legal Modal Popup */}
      <LegalModal
        isOpen={legalModal.isOpen}
        type={legalModal.type}
        onClose={() => setLegalModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
