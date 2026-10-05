'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Bookmark,
  Check,
  ChevronDown,
  Flame,
  Info,
  Layers,
  Lock,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  Undo2,
  Volume2,
  Zap,
  Square,
} from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';
import { useEntitlements } from '../../context/EntitlementContext';
import { useComboPlayer } from '../../hooks/useComboPlayer';
import { SkillInterface } from '../../types/combo';
import {
  BASIC_SKILL_PRESETS,
  COMBO_SKILL_PRESETS,
} from '../../constants/ComboPresets';
import { calculateSkillTokens, ENTITLEMENT_TIERS } from '../../constants/Entitlements';
import { calculateComboDuration, parsePatternToActions } from '../../utils/comboParser';
import {
  deleteCustomCombo,
  getCustomCombos,
  saveCustomCombo,
} from '../../utils/webDb';
import { showConfirmDialog, showAlert } from '../../utils/swal';
import { AnimatePresence } from 'framer-motion';
import WorkbenchCard from '../../components/combo/WorkbenchCard';
import VideoTimelineBar from '../../components/combo/VideoTimelineBar';
import ActionBadge from '../../components/combo/ActionBadge';
import AuthGuard from '../../components/auth/AuthGuard';
import { useAtom } from 'jotai';
import {
  workbenchItemsAtom,
  workbenchUndoHistoryAtom,
  workbenchSelectedIndexAtom,
} from '../../stores/routineAtom';

const COMBO_COLOR_PALETTE = [
  '#a855f7', // Purple
  '#38bdf8', // Sky Blue
  '#f87171', // Red
  '#fb923c', // Orange
  '#34d399', // Emerald
  '#f43f5e', // Rose
  '#eab308', // Gold
  '#818cf8', // Indigo
  '#06b6d4', // Cyan
  '#e879f9', // Fuchsia
];

const UNLOCKED_GUEST_PRESET_IDS = ['preset-one-two', 'preset-1-1-2'];

type BottomTab = 'basic' | 'preset-combo' | 'my-combo';

export default function RoutineBuilderPage() {
  const { t, language } = useI18n();
  const isKo = language === 'ko';
  const { isPro, isUltimate, limits, openPaywall, isAuthenticated, openAuthModal } = useEntitlements();

  // 1. Workbench state (Jotai Atom with persistence)
  const [workbenchItems, setWorkbenchItems] = useAtom(workbenchItemsAtom);

  // Undo history stack
  const [undoHistory, setUndoHistory] = useAtom(workbenchUndoHistoryAtom);

  // Selected item on workbench
  const [selectedIndex, setSelectedIndex] = useAtom(workbenchSelectedIndexAtom);

  // Sync to localStorage on update
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('boxing_workbench_items', JSON.stringify(workbenchItems));
      } catch (e) {
        console.warn('Failed to persist workbench items:', e);
      }
    }
  }, [workbenchItems]);

  // Bottom Drawer Modal & Active Tab
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerTab, setDrawerTab] = useState<BottomTab>('basic');

  // DB My Combos
  const [myCombos, setMyCombos] = useState<SkillInterface[]>([]);

  // Save Modal state
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [saveComboName, setSaveComboName] = useState('');
  const [saveComboColor, setSaveComboColor] = useState<string>(COMBO_COLOR_PALETTE[0]);

  // Audio player hook
  const {
    isPlaying,
    playSkillItems,
    stop,
    currentToken,
    currentBlockIndex,
  } = useComboPlayer();

  // Playback scope: 'full' | index of selected card | null
  const [playingScope, setPlayingScope] = useState<'full' | number | null>(null);

  useEffect(() => {
    if (!isPlaying) {
      setPlayingScope(null);
    }
  }, [isPlaying]);

  const activePlayingIndex = useMemo(() => {
    if (!isPlaying) return null;
    if (playingScope === 'full') return currentBlockIndex;
    if (typeof playingScope === 'number') return playingScope;
    return null;
  }, [isPlaying, playingScope, currentBlockIndex]);

  // Load custom combos
  const loadMyCombos = useCallback(async () => {
    try {
      const dbCombos = await getCustomCombos();
      setMyCombos(dbCombos);
    } catch (e) {
      console.warn('[RoutineBuilder] Error loading custom combos:', e);
    }
  }, []);

  useEffect(() => {
    loadMyCombos();
  }, [loadMyCombos]);

  // Current total action tokens in workbench
  const currentWorkbenchTokens = useMemo(() => {
    return workbenchItems.reduce(
      (sum, item) => sum + calculateSkillTokens(item),
      0
    );
  }, [workbenchItems]);

  const updateWorkbenchWithHistory = useCallback(
    (newItems: SkillInterface[]) => {
      setUndoHistory((prev) => [...prev, workbenchItems]);
      setWorkbenchItems(newItems);
    },
    [workbenchItems]
  );

  const handleUndo = useCallback(() => {
    if (undoHistory.length === 0) return;
    const previousState = undoHistory[undoHistory.length - 1];
    setUndoHistory((prev) => prev.slice(0, -1));
    setWorkbenchItems(previousState);
    setSelectedIndex((prev) =>
      prev !== null && prev >= previousState.length
        ? Math.max(0, previousState.length - 1)
        : prev
    );
  }, [undoHistory]);

  const handleAppendItem = useCallback(
    (item: SkillInterface) => {
      const itemTokens = calculateSkillTokens(item);
      if (currentWorkbenchTokens + itemTokens > limits.maxComboTokens) {
        if (isUltimate) {
          showAlert(
            t('tokenLimitTitle'),
            t('tokenLimitUltimateMessage', { max: limits.maxComboTokens }),
            'warning'
          );
          return;
        }

        const messageText = isPro
          ? t('tokenLimitProMessage', {
              max: limits.maxComboTokens,
              ultMax: ENTITLEMENT_TIERS.ULTIMATE.maxComboTokens,
            })
          : t('tokenLimitMessage', {
              max: limits.maxComboTokens,
              proMax: ENTITLEMENT_TIERS.PRO.maxComboTokens,
              ultMax: ENTITLEMENT_TIERS.ULTIMATE.maxComboTokens,
            });

        showConfirmDialog({
          title: t('tokenLimitTitle'),
          text: messageText,
          confirmButtonText: t('upgrade'),
          cancelButtonText: t('cancel'),
        }).then((confirmed) => {
          if (confirmed) {
            openPaywall('tokens');
          }
        });
        return;
      }

      const newItem: SkillInterface = {
        ...item,
        presetId: item.presetId || item.id,
        id: `${item.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        tokenCount: itemTokens,
      };
      const updated = [...workbenchItems, newItem];
      updateWorkbenchWithHistory(updated);
      setSelectedIndex(updated.length - 1);
    },
    [
      workbenchItems,
      currentWorkbenchTokens,
      limits.maxComboTokens,
      isPro,
      openPaywall,
      t,
      updateWorkbenchWithHistory,
    ]
  );

  const handleToggleSelectIndex = useCallback((idx: number) => {
    setSelectedIndex((prev) => (prev === idx ? null : idx));
  }, []);

  const clearCardSelection = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const handleRemoveFromWorkbench = useCallback(
    (index: number) => {
      const updated = workbenchItems.filter((_, i) => i !== index);
      updateWorkbenchWithHistory(updated);
      if (selectedIndex === index) {
        setSelectedIndex(updated.length > 0 ? Math.max(0, index - 1) : null);
      } else if (selectedIndex !== null && selectedIndex > index) {
        setSelectedIndex(selectedIndex - 1);
      }
    },
    [workbenchItems, selectedIndex, updateWorkbenchWithHistory]
  );

  const handleMoveLeft = useCallback(
    (index: number) => {
      if (index <= 0) return;
      const updated = [...workbenchItems];
      const temp = updated[index];
      updated[index] = updated[index - 1];
      updated[index - 1] = temp;
      updateWorkbenchWithHistory(updated);
      setSelectedIndex(index - 1);
    },
    [workbenchItems, updateWorkbenchWithHistory]
  );

  const handleMoveRight = useCallback(
    (index: number) => {
      if (index >= workbenchItems.length - 1) return;
      const updated = [...workbenchItems];
      const temp = updated[index];
      updated[index] = updated[index + 1];
      updated[index + 1] = temp;
      updateWorkbenchWithHistory(updated);
      setSelectedIndex(index + 1);
    },
    [workbenchItems, updateWorkbenchWithHistory]
  );

  const handleReset = useCallback(async () => {
    const confirmed = await showConfirmDialog({
      title: t('resetRoutineTitle'),
      text: t('resetRoutineConfirm'),
      confirmButtonText: t('reset'),
      cancelButtonText: t('cancel'),
      isDestructive: true,
    });
    if (confirmed) {
      updateWorkbenchWithHistory([]);
      setSelectedIndex(null);
    }
  }, [t, updateWorkbenchWithHistory]);

  const handlePlaySelectedAudio = useCallback(async () => {
    if (isPlaying) {
      stop();
      setPlayingScope(null);
      return;
    }

    if (selectedIndex !== null && workbenchItems[selectedIndex]) {
      const targetIndex = selectedIndex;
      const selectedItem = workbenchItems[targetIndex];
      setPlayingScope(targetIndex);
      await playSkillItems([selectedItem]);
    } else if (workbenchItems.length > 0) {
      setPlayingScope('full');
      await playSkillItems(workbenchItems);
    }
  }, [isPlaying, selectedIndex, workbenchItems, playSkillItems, stop]);

  const handlePlayFullAudio = useCallback(async () => {
    if (isPlaying) {
      stop();
      setPlayingScope(null);
      return;
    }
    if (workbenchItems.length > 0) {
      setPlayingScope('full');
      await playSkillItems(workbenchItems);
    }
  }, [isPlaying, workbenchItems, playSkillItems, stop]);

  const handleSaveToMyCombos = useCallback(async () => {
    if (workbenchItems.length === 0) {
      await showAlert(t('emptyTimeline'), undefined, 'warning');
      return;
    }

    if (myCombos.length >= limits.maxCustomCombos) {
      if (isUltimate) {
        await showAlert(
          t('maxCombosLimitTitle'),
          undefined,
          'warning'
        );
        return;
      }

      const confirmed = await showConfirmDialog({
        title: t('maxCombosLimitTitle'),
        text: t('maxCombosLimitMessage', { max: limits.maxCustomCombos }),
        confirmButtonText: t('upgrade'),
        cancelButtonText: t('cancel'),
      });
      if (confirmed) {
        openPaywall('combos');
      }
      return;
    }

    const nextIndex = myCombos.length + 1;
    const defaultName = language === 'en' ? `My Combo ${nextIndex}` : `내 콤보 ${nextIndex}`;
    setSaveComboName(defaultName);
    setSaveComboColor(COMBO_COLOR_PALETTE[0]);
    setSaveModalVisible(true);
  }, [workbenchItems.length, myCombos.length, limits.maxCustomCombos, isPro, openPaywall, t, language]);

  const confirmSaveCombo = useCallback(async () => {
    if (!saveComboName.trim()) {
      await showAlert(t('comboNamePlaceholder'), undefined, 'warning');
      return;
    }

    const allTokens: string[] = [];
    workbenchItems.forEach((item) => {
      item.sequence.forEach((seq) => allTokens.push(seq));
    });

    const durationStats = calculateComboDuration(allTokens.join('.'));
    const totalTokenCount = workbenchItems.reduce(
      (sum, item) => sum + calculateSkillTokens(item),
      0
    );

    const newSkill: SkillInterface = {
      id: `my-combo-${Date.now()}`,
      name: saveComboName.trim(),
      sequence: allTokens,
      isPreset: false,
      isCombo: true,
      category: 'my-combo',
      color: saveComboColor,
      durationMs: durationStats.totalDurationMs,
      tokenCount: totalTokenCount,
      description: `${durationStats.totalSeconds}s (${totalTokenCount} ${t('tokensUnit')})`,
      subItems: workbenchItems.map((item) => ({ ...item })),
      createdAt: Date.now(),
    };

    try {
      await saveCustomCombo(newSkill);
      await loadMyCombos();
      setSaveModalVisible(false);
      setDrawerTab('my-combo');
      setDrawerVisible(true);
      await showAlert(t('success'), undefined, 'success');
    } catch (e) {
      await showAlert(t('failedSaveCombo'), undefined, 'error');
    }
  }, [saveComboName, saveComboColor, workbenchItems, loadMyCombos, t]);

  const handleDeleteMyCombo = useCallback(
    async (id: string) => {
      const confirmed = await showConfirmDialog({
        title: t('deleteComboTitle'),
        text: t('deleteComboConfirm'),
        confirmButtonText: t('delete'),
        cancelButtonText: t('cancel'),
        isDestructive: true,
      });
      if (confirmed) {
        await deleteCustomCombo(id);
        await loadMyCombos();
      }
    },
    [loadMyCombos, t]
  );

  const activeSelectedItem = selectedIndex !== null ? workbenchItems[selectedIndex] : null;

  const openDrawerTab = (tab: BottomTab) => {
    setDrawerTab(tab);
    setDrawerVisible(true);
    clearCardSelection();
  };

  return (
    <AuthGuard
      title={t('builderTitle')}
      description={t('authRequiredDesc')}
    >
      <div className="flex-1 flex flex-col bg-[#0B0C10] text-white select-none">
      {/* 1. Header */}
      <header className="flex items-center justify-between px-5 py-3.5 border-b border-[#282C3A]">
        <div>
          <h1 className="text-[20px] font-black text-[#F8FAFC] tracking-tight">
            {t('builderTitle')}
          </h1>
          <p className="text-[12px] text-[#94A3B8] font-semibold mt-0.5">
            {t('builderSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Undo */}
          <button
            type="button"
            disabled={undoHistory.length === 0}
            onClick={handleUndo}
            className={`p-2 rounded-xl bg-[#15171E] border border-[#282C3A] transition-colors ${
              undoHistory.length > 0
                ? 'text-white hover:border-white/50'
                : 'text-[#475569] opacity-40 cursor-not-allowed'
            }`}
          >
            <Undo2 className="w-4 h-4" />
          </button>

          {/* Reset */}
          <button
            type="button"
            onClick={handleReset}
            className="p-2 rounded-xl bg-[#15171E] border border-[#282C3A] text-[#94A3B8] hover:text-white hover:border-white/50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Workspace Scroll Area */}
      <div
        className="flex-1 px-4 py-3 space-y-3 overflow-y-auto"
        onClick={clearCardSelection}
      >
        {/* 2. Top Workbench Header Row */}
        <div className="flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-white" />
              <span className="text-xs font-black text-white">
                {t('timelineTitle')} ({workbenchItems.length})
              </span>
            </div>

            {/* Token limit counter badge */}
            <button
              type="button"
              onClick={() => !isPro && openPaywall('tokens')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-extrabold border transition-all ${
                currentWorkbenchTokens >= limits.maxComboTokens
                  ? 'bg-red-500/15 border-red-500 text-red-400'
                  : 'bg-[#15171E] border-[#282C3A] text-white'
              }`}
            >
              <span>
                {currentWorkbenchTokens}/{limits.maxComboTokens}
              </span>
              {!isPro && (
                <span className="bg-yellow-400 text-black text-[9px] font-black px-1 rounded-sm ml-0.5">
                  PRO 40
                </span>
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={handleSaveToMyCombos}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#FF2E54] text-white text-xs font-extrabold hover:bg-red-600 transition-colors shadow-md shadow-red-500/20"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{t('saveToMyCombos')}</span>
          </button>
        </div>

        {/* 1. Workbench Cards Horizontal Canvas (Detailed Block Sequence) */}
        <div
          className="bg-[#15171E] rounded-2xl p-3 border border-[#282C3A] min-h-[148px] flex items-center cursor-default"
          onClick={clearCardSelection}
        >
          {workbenchItems.length === 0 ? (
            <div
              onClick={() => openDrawerTab('basic')}
              className="w-full py-8 flex flex-col items-center justify-center gap-1.5 text-center cursor-pointer text-[#94A3B8] hover:text-white transition-colors"
            >
              <Plus className="w-5 h-5 text-[#64748B]" />
              <p className="text-xs font-bold">
                {t('emptyTimeline')}
              </p>
            </div>
          ) : (
            <div
              className="flex items-center overflow-x-auto no-scrollbar py-2 px-1 w-full"
              onClick={clearCardSelection}
            >
              <AnimatePresence mode="popLayout">
                {workbenchItems.map((item, idx) => (
                  <WorkbenchCard
                    key={item.id}
                    item={item}
                    index={idx}
                    totalItems={workbenchItems.length}
                    isSelected={selectedIndex === idx}
                    isCurrentlyPlaying={isPlaying && activePlayingIndex === idx}
                    onSelect={() => handleToggleSelectIndex(idx)}
                    onRemove={() => handleRemoveFromWorkbench(idx)}
                    onMoveLeft={() => handleMoveLeft(idx)}
                    onMoveRight={() => handleMoveRight(idx)}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* 2. Selected Item Detail Breakdown (콤보 구성 Inspector - 바로 아래 결합) */}
        <div
          className="bg-[#15171E] rounded-xl p-3 border border-[#282C3A] min-h-[96px] flex flex-col justify-between"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between min-h-[28px]">
            <div className="flex items-center gap-1.5 flex-1 min-w-0 mr-2">
              <Info className="w-4 h-4 text-[#94A3B8] shrink-0" />
              <span className="text-xs font-bold text-[#F8FAFC] truncate">
                {activeSelectedItem
                  ? `${language === 'en' && activeSelectedItem.nameEn ? activeSelectedItem.nameEn : activeSelectedItem.name} (${activeSelectedItem.isCombo ? t('comboBadgeCombo') : t('comboBadgeBasic')}) - ${t('selectedDetailBreakdown')}`
                  : t('selectedDetailBreakdown')}
              </span>
            </div>

            <button
              type="button"
              onClick={handlePlaySelectedAudio}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#282C3A] text-white text-xs font-bold hover:bg-[#343a4c] transition-colors shrink-0"
            >
              {isPlaying ? (
                <>
                  <Square className="w-3 h-3 fill-current" />
                  <span>
                    {t('stopPreview')} ({currentToken})
                  </span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{t('previewComboAudio')}</span>
                </>
              )}
            </button>
          </div>

          {/* Badges breakdown with fixed height to prevent layout shift */}
          <div className="h-8 flex items-center overflow-x-auto no-scrollbar py-0.5">
            {activeSelectedItem ? (
              <div className="flex items-center">
                {activeSelectedItem.sequence.map((seqToken, idx) => {
                  const actionDef = parsePatternToActions(seqToken)[0];
                  return (
                    <React.Fragment key={idx}>
                      {idx > 0 && <span className="text-xs text-[#64748B] mx-1">➔</span>}
                      {actionDef ? (
                        <ActionBadge action={actionDef} size="sm" />
                      ) : (
                        <div className="bg-[#1D202A] px-2 py-0.5 rounded text-xs font-bold text-white border border-[#282C3A]">
                          {seqToken}
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            ) : (
              <span className="text-xs text-[#64748B] flex items-center">{t('noSelectionGuide')}</span>
            )}
          </div>
        </div>

        {/* 3. Multi-Color Video Timeline Bar (Bottom Summary & Full Play) */}
        <VideoTimelineBar
          items={workbenchItems}
          selectedIndex={selectedIndex}
          activeItemIndex={activePlayingIndex ?? -1}
          onSelectIndex={handleToggleSelectIndex}
          onBackgroundPress={clearCardSelection}
          isPlaying={isPlaying}
          onPlayFull={handlePlayFullAudio}
        />
      </div>

      {/* 4. Secondary Bottom Action Bar (CapCut style) */}
      <div className="grid grid-cols-3 gap-2 px-4 py-2.5 bg-[#15171E] border-t border-[#222634]">
        <button
          type="button"
          onClick={() => openDrawerTab('basic')}
          className={`flex flex-col items-center justify-center py-1.5 rounded-xl border transition-all ${
            drawerVisible && drawerTab === 'basic'
              ? 'bg-[#1D202A] border-[#FF2E54] text-white'
              : 'bg-[#0B0C10] border-[#282C3A] text-[#94A3B8] hover:text-white'
          }`}
        >
          <Zap className="w-4 h-4 mb-0.5 text-yellow-400" />
          <span className="text-[11px] font-bold">{t('tabBasics')}</span>
        </button>

        <button
          type="button"
          onClick={() => openDrawerTab('preset-combo')}
          className={`flex flex-col items-center justify-center py-1.5 rounded-xl border transition-all ${
            drawerVisible && drawerTab === 'preset-combo'
              ? 'bg-[#1D202A] border-[#FF2E54] text-white'
              : 'bg-[#0B0C10] border-[#282C3A] text-[#94A3B8] hover:text-white'
          }`}
        >
          <Flame className="w-4 h-4 mb-0.5 text-[#FF2E54]" />
          <span className="text-[11px] font-bold">{t('tabPresetCombos')}</span>
        </button>

        <button
          type="button"
          onClick={() => openDrawerTab('my-combo')}
          className={`flex flex-col items-center justify-center py-1.5 rounded-xl border transition-all relative ${
            drawerVisible && drawerTab === 'my-combo'
              ? 'bg-[#1D202A] border-[#FF2E54] text-white'
              : 'bg-[#0B0C10] border-[#282C3A] text-[#94A3B8] hover:text-white'
          }`}
        >
          <Bookmark className="w-4 h-4 mb-0.5 text-cyan-400" />
          <span className="text-[11px] font-bold">{t('tabMyCombos')}</span>
          {myCombos.length > 0 && (
            <span className="absolute top-1 right-3 bg-[#FF2E54] text-white text-[9px] font-extrabold px-1 rounded-full">
              {myCombos.length}
            </span>
          )}
        </button>
      </div>

      {/* 5. Bottom Drawer Sheet Modal */}
      {drawerVisible && (
        <div
          onClick={() => setDrawerVisible(false)}
          className="fixed inset-0 z-50 bg-black/80 flex items-end justify-center animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#15171E] w-full max-w-[1024px] mx-auto rounded-t-3xl border-t border-x border-[#282C3A] max-h-[65vh] flex flex-col p-4 pb-6 space-y-3 shadow-2xl"
          >
            {/* Handle bar */}
            <div className="w-12 h-1 bg-[#282C3A] rounded-full mx-auto" />

            {/* Header: Tabs + Close */}
            <div className="flex items-center justify-between pb-2 border-b border-[#282C3A]">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setDrawerTab('basic')}
                  className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all ${
                    drawerTab === 'basic'
                      ? 'bg-white text-black'
                      : 'bg-[#1D202A] text-[#94A3B8] hover:text-white'
                  }`}
                >
                  {t('tabBasics')}
                </button>
                <button
                  type="button"
                  onClick={() => setDrawerTab('preset-combo')}
                  className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all ${
                    drawerTab === 'preset-combo'
                      ? 'bg-white text-black'
                      : 'bg-[#1D202A] text-[#94A3B8] hover:text-white'
                  }`}
                >
                  {t('tabPresetCombos')}
                </button>
                <button
                  type="button"
                  onClick={() => setDrawerTab('my-combo')}
                  className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all ${
                    drawerTab === 'my-combo'
                      ? 'bg-white text-black'
                      : 'bg-[#1D202A] text-[#94A3B8] hover:text-white'
                  }`}
                >
                  {t('tabMyCombos')} ({myCombos.length})
                </button>
              </div>

              <button
                type="button"
                onClick={() => setDrawerVisible(false)}
                className="p-1 text-[#94A3B8] hover:text-white"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>

            {/* Item Grid */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {drawerTab === 'basic' && (
                <div className="grid grid-cols-2 gap-2">
                  {BASIC_SKILL_PRESETS.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleAppendItem(item)}
                      style={{ borderLeftColor: item.color || '#FFFFFF' }}
                      className="flex items-center justify-between bg-[#1D202A] border border-[#282C3A] border-l-4 rounded-xl p-2.5 cursor-pointer hover:border-white/50 transition-all"
                    >
                      <span className="text-xs font-bold text-white truncate mr-2">
                        {language === 'en' && item.nameEn ? item.nameEn : item.name}
                      </span>
                      <div className="w-5 h-5 rounded-full bg-[#282C3A] flex items-center justify-center shrink-0">
                        <Plus className="w-3.5 h-3.5 text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {drawerTab === 'preset-combo' && (
                <div className="space-y-2">
                  {COMBO_SKILL_PRESETS.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleAppendItem(item)}
                      style={{ borderLeftColor: item.color || '#FFFFFF' }}
                      className="flex items-center justify-between bg-[#1D202A] border border-[#282C3A] border-l-4 rounded-xl p-2.5 cursor-pointer hover:border-white/50 transition-all"
                    >
                      <div className="flex-1 min-w-0 mr-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white truncate">
                            {language === 'en' && item.nameEn ? item.nameEn : item.name}
                          </span>
                          {!!item.durationMs && (
                            <span className="text-[10px] text-[#94A3B8] font-bold">
                              {(item.durationMs / 1000).toFixed(1)}s
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-[#64748B] truncate mt-0.5">
                          {item.sequence.join('-')}
                        </p>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-[#282C3A] flex items-center justify-center shrink-0">
                        <Plus className="w-3.5 h-3.5 text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {drawerTab === 'my-combo' && (
                myCombos.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[#94A3B8]">
                    {t('emptyMyCombos')}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {myCombos.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleAppendItem(item)}
                        style={{ borderLeftColor: item.color || '#FF2E54' }}
                        className="flex items-center justify-between bg-[#1D202A] border border-[#282C3A] border-l-4 rounded-xl p-2.5 cursor-pointer hover:border-white/50 transition-all"
                      >
                        <div className="flex-1 min-w-0 mr-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white truncate">
                              {item.name}
                            </span>
                            {!!item.durationMs && (
                              <span
                                style={{ color: item.color || '#FF2E54' }}
                                className="text-[10px] font-bold"
                              >
                                {(item.durationMs / 1000).toFixed(1)}s
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-[#64748B] truncate mt-0.5">
                            {item.sequence.join('-')}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteMyCombo(item.id);
                          }}
                          className="p-1 text-[#f87171] hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. Save Combo Modal */}
      {saveModalVisible && (
        <div
          onClick={() => setSaveModalVisible(false)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#15171E] w-full max-w-sm rounded-2xl border border-[#282C3A] p-5 space-y-4 shadow-2xl"
          >
            <h3 className="text-base font-black text-white">{t('saveComboModalTitle')}</h3>
            <p className="text-xs text-[#94A3B8]">{t('saveComboModalDesc')}</p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#CBD5E1]">{t('comboNamePlaceholder')}</label>
              <input
                type="text"
                value={saveComboName}
                onChange={(e) => setSaveComboName(e.target.value)}
                placeholder={t('comboNamePlaceholder')}
                className="w-full bg-[#0B0C10] border border-[#282C3A] rounded-xl px-3.5 py-3 text-sm text-white font-bold outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            {/* Color Swatches Box */}
            <div className="bg-[#0B0C10] border border-[#282C3A] rounded-xl p-3 space-y-2">
              <label className="text-xs font-bold text-[#CBD5E1] block">{t('selectComboColor')}</label>
              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar px-3 py-2">
                {COMBO_COLOR_PALETTE.map((c) => {
                  const isSelected = saveComboColor === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      style={{ backgroundColor: c }}
                      onClick={() => setSaveComboColor(c)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all ${
                        isSelected
                          ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0B0C10] scale-110'
                          : 'opacity-80 hover:opacity-100 hover:scale-105'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3.5]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSaveModalVisible(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#1E222D] text-[#94A3B8] font-bold text-xs hover:text-white"
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                style={{ backgroundColor: saveComboColor || '#FF2E54' }}
                onClick={confirmSaveCombo}
                className="flex-1 py-2.5 rounded-xl text-white font-extrabold text-xs shadow-md transition-opacity hover:opacity-90"
              >
                {t('save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </AuthGuard>
  );
}
