'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Award, Flame, Pause, Play, SkipForward, Square } from 'lucide-react';
import { useComboPlayer } from '../hooks/useComboPlayer';
import { useI18n } from '../hooks/useI18n';
import { useWakeLock } from '../hooks/useWakeLock';
import { ComboBlock } from '../types/combo';
import { parsePatternToActions } from '../utils/comboParser';
import { playBellSound } from '../services/audio/ComboSpeechEngine';
import { showConfirmDialog } from '../utils/swal';

interface ActiveWorkoutProps {
  badgeId?: string | null;
  badgeName?: string | null;
  workoutTime: number; // seconds
  restTime: number; // seconds
  setsCount: number;
  blocks?: ComboBlock[];
  playMode?: 'sequential' | 'random';
  stepDurationMs?: number;
  onClose: () => void;
  onComplete: (setsCompleted: number, durationSeconds: number) => Promise<any>;
}

type WorkoutState = 'PREPARE' | 'WORK' | 'REST' | 'FINISHED';

export default function ActiveWorkout({
  badgeId,
  badgeName,
  workoutTime,
  restTime,
  setsCount,
  blocks = [],
  playMode = 'sequential',
  stepDurationMs = 700,
  onClose,
  onComplete,
}: ActiveWorkoutProps) {
  const { t, language } = useI18n();
  const [currentState, setCurrentState] = useState<WorkoutState>('PREPARE');
  const [currentSet, setCurrentSet] = useState(1);
  const [actualCompletedSets, setActualCompletedSets] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [totalTimeLeft, setTotalTimeLeft] = useState(5);
  const [isPaused, setIsPaused] = useState(false);
  const [totalDurationSeconds, setTotalDurationSeconds] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const isComboWorkout = blocks && blocks.length > 0;
  const isSessionActive = currentState !== 'FINISHED';
  useWakeLock(isSessionActive);

  const currentStateRef = useRef<WorkoutState>(currentState);
  currentStateRef.current = currentState;
  const handleStateTransitionRef = useRef<() => void>(() => {});

  const comboScrollRef = useRef<HTMLDivElement>(null);

  const {
    currentBlockIndex,
    currentStepIndex,
    currentAction,
    currentToken,
    totalStrikesCount,
    startRoutineLoop,
    pause: pauseComboSpeech,
    resume: resumeComboSpeech,
    stop: stopComboSpeech,
  } = useComboPlayer({
    defaultStepDurationMs: stepDurationMs,
    onWorkoutComplete: () => {
      if (currentStateRef.current === 'WORK') {
        handleStateTransitionRef.current();
      }
    },
  });

  const timerRef = useRef<any>(null);
  const endTimeRef = useRef<number>(0);
  const pausedTimeLeftRef = useRef<number | null>(null);
  const sessionStartTimestampRef = useRef<number>(0);
  const totalPausedDurationRef = useRef<number>(0);
  const pauseStartTimestampRef = useRef<number>(0);
  const isPausedRef = useRef(isPaused);
  isPausedRef.current = isPaused;
  const silentAudioRef = useRef<HTMLAudioElement | null>(null);

  const handlePauseResumeRef = useRef<() => void>(() => {});
  const handleSkipRef = useRef<() => void>(() => {});
  const handleQuitRef = useRef<() => void>(() => {});

  // Auto-scroll active combo card in sequence
  useEffect(() => {
    if (comboScrollRef.current && currentBlockIndex >= 0) {
      comboScrollRef.current.scrollTo({
        left: Math.max(0, currentBlockIndex * 90 - 30),
        behavior: 'smooth',
      });
    }
  }, [currentBlockIndex]);

  // Mount prepare bell and initialize 5s countdown + Silent Audio anchor for earphone gestures
  useEffect(() => {
    playBellSound('prepare');
    endTimeRef.current = Date.now() + 5 * 1000;
    setTimeLeft(5);
    setTotalTimeLeft(5);

    // Maintain audio session focus on mobile so Bluetooth earphone taps trigger mediaSession actions
    try {
      const silentAudio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA');
      silentAudio.loop = true;
      silentAudioRef.current = silentAudio;
      silentAudio.play().catch(() => {});
    } catch {}

    return () => {
      stopComboSpeech();
      if (silentAudioRef.current) {
        silentAudioRef.current.pause();
        silentAudioRef.current = null;
      }
      if (typeof window !== 'undefined' && 'mediaSession' in navigator) {
        try {
          navigator.mediaSession.playbackState = 'none';
          navigator.mediaSession.setActionHandler('play', null);
          navigator.mediaSession.setActionHandler('pause', null);
          navigator.mediaSession.setActionHandler('nexttrack', null);
          navigator.mediaSession.setActionHandler('stop', null);
        } catch {}
      }
    };
  }, [stopComboSpeech]);

  const getPreciseDuration = () => {
    if (sessionStartTimestampRef.current === 0) return 0;
    let pausedDuration = totalPausedDurationRef.current;
    if (isPaused && pauseStartTimestampRef.current > 0) {
      pausedDuration += Date.now() - pauseStartTimestampRef.current;
    }
    return Math.max(1, Math.floor((Date.now() - sessionStartTimestampRef.current - pausedDuration) / 1000));
  };

  const saveWorkoutResults = async (sets: number, seconds: number) => {
    setIsSaving(true);
    try {
      await onComplete(sets, seconds);
    } catch (e) {
      console.error('[ActiveWorkout] Failed to save workout log:', e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleStateTransition = useCallback(() => {
    if (currentState === 'PREPARE') {
      playBellSound('start');
      setCurrentState('WORK');
      setTimeLeft(workoutTime);
      setTotalTimeLeft(workoutTime);
      endTimeRef.current = Date.now() + workoutTime * 1000;
      pausedTimeLeftRef.current = null;
      if (sessionStartTimestampRef.current === 0) {
        sessionStartTimestampRef.current = Date.now();
      }
      if (isComboWorkout) {
        setTimeout(() => {
          if (currentStateRef.current === 'WORK') {
            startRoutineLoop(blocks, workoutTime, stepDurationMs, undefined, playMode);
          }
        }, 700);
      }
    } else if (currentState === 'WORK') {
      if (isComboWorkout) {
        stopComboSpeech();
      }
      const nextCompletedSets = actualCompletedSets + 1;
      setActualCompletedSets(nextCompletedSets);

      if (currentSet < setsCount) {
        playBellSound('rest');
        setCurrentState('REST');
        setTimeLeft(restTime);
        setTotalTimeLeft(restTime);
        endTimeRef.current = Date.now() + restTime * 1000;
        pausedTimeLeftRef.current = null;
      } else {
        playBellSound('finish');
        setCurrentState('FINISHED');
        setTimeLeft(0);
        const finalDuration = getPreciseDuration();
        setTotalDurationSeconds(finalDuration);
        saveWorkoutResults(nextCompletedSets, finalDuration);
      }
    } else if (currentState === 'REST') {
      playBellSound('start');
      setCurrentSet((prev) => prev + 1);
      setCurrentState('WORK');
      setTimeLeft(workoutTime);
      setTotalTimeLeft(workoutTime);
      endTimeRef.current = Date.now() + workoutTime * 1000;
      pausedTimeLeftRef.current = null;
      if (isComboWorkout) {
        setTimeout(() => {
          if (currentStateRef.current === 'WORK') {
            startRoutineLoop(blocks, workoutTime, stepDurationMs, undefined, playMode);
          }
        }, 700);
      }
    }
  }, [
    currentState,
    currentSet,
    setsCount,
    workoutTime,
    restTime,
    isComboWorkout,
    blocks,
    stepDurationMs,
    playMode,
    actualCompletedSets,
    startRoutineLoop,
    stopComboSpeech,
  ]);

  handleStateTransitionRef.current = handleStateTransition;

  // Countdown timer interval
  useEffect(() => {
    if (isPaused || currentState === 'FINISHED') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000));
      setTimeLeft(remaining);

      if (remaining <= 0) {
        if (!isComboWorkout || currentState !== 'WORK') {
          if (timerRef.current) clearInterval(timerRef.current);
          handleStateTransition();
        }
      }
    }, 400);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentState, currentSet, isPaused, handleStateTransition, isComboWorkout]);

  const handlePauseResume = () => {
    if (!isPaused) {
      pausedTimeLeftRef.current = timeLeft;
      pauseStartTimestampRef.current = Date.now();
      if (silentAudioRef.current) {
        silentAudioRef.current.pause();
      }
      if (isComboWorkout) {
        pauseComboSpeech();
      }
    } else {
      const remaining = pausedTimeLeftRef.current !== null ? pausedTimeLeftRef.current : timeLeft;
      endTimeRef.current = Date.now() + remaining * 1000;
      pausedTimeLeftRef.current = null;
      if (pauseStartTimestampRef.current > 0) {
        totalPausedDurationRef.current += Date.now() - pauseStartTimestampRef.current;
        pauseStartTimestampRef.current = 0;
      }
      if (silentAudioRef.current) {
        silentAudioRef.current.play().catch(() => {});
      }
      if (isComboWorkout && currentState === 'WORK') {
        resumeComboSpeech();
      }
    }
    setIsPaused(!isPaused);
  };

  const handleSkip = () => {
    if (isComboWorkout) {
      stopComboSpeech();
    }
    if (currentState === 'PREPARE') {
      playBellSound('start');
      setCurrentState('WORK');
      setTimeLeft(workoutTime);
      setTotalTimeLeft(workoutTime);
      endTimeRef.current = Date.now() + workoutTime * 1000;
      pausedTimeLeftRef.current = null;
      if (sessionStartTimestampRef.current === 0) {
        sessionStartTimestampRef.current = Date.now();
      }
      if (isComboWorkout) {
        setTimeout(() => {
          if (currentStateRef.current === 'WORK') {
            startRoutineLoop(blocks, workoutTime, stepDurationMs, undefined, playMode);
          }
        }, 700);
      }
    } else if (currentState === 'WORK') {
      const nextCompletedSets = actualCompletedSets + 1;
      setActualCompletedSets(nextCompletedSets);

      if (currentSet < setsCount) {
        playBellSound('rest');
        setCurrentState('REST');
        setTimeLeft(restTime);
        setTotalTimeLeft(restTime);
        endTimeRef.current = Date.now() + restTime * 1000;
        pausedTimeLeftRef.current = null;
      } else {
        playBellSound('finish');
        setCurrentState('FINISHED');
        setTimeLeft(0);
        const finalDuration = getPreciseDuration();
        setTotalDurationSeconds(finalDuration);
        saveWorkoutResults(nextCompletedSets, finalDuration);
      }
    } else if (currentState === 'REST') {
      playBellSound('start');
      setCurrentSet((prev) => prev + 1);
      setCurrentState('WORK');
      setTimeLeft(workoutTime);
      setTotalTimeLeft(workoutTime);
      endTimeRef.current = Date.now() + workoutTime * 1000;
      pausedTimeLeftRef.current = null;
      if (isComboWorkout) {
        setTimeout(() => {
          if (currentStateRef.current === 'WORK') {
            startRoutineLoop(blocks, workoutTime, stepDurationMs, undefined, playMode);
          }
        }, 700);
      }
    }
  };

  handlePauseResumeRef.current = handlePauseResume;
  handleSkipRef.current = handleSkip;

  // MediaSession API integration for Earphone (AirPods, Galaxy Buds) touch controls & Lock screen display
  useEffect(() => {
    if (typeof window === 'undefined' || !('mediaSession' in navigator)) return;

    if (currentState === 'FINISHED') {
      navigator.mediaSession.playbackState = 'none';
      return;
    }

    navigator.mediaSession.playbackState = isPaused ? 'paused' : 'playing';

    const currentSetText = `라운드 ${currentSet}/${setsCount}`;
    const statusText = isPaused
      ? `⏸️ [일시정지] ${currentSetText}`
      : currentState === 'WORK'
      ? `🥊 ${currentSetText} 훈련 중`
      : currentState === 'REST'
      ? `🥤 ${currentSetText} 휴식 중`
      : '🥊 준비 중...';

    navigator.mediaSession.metadata = new MediaMetadata({
      title: statusText,
      artist: '셋업복싱 (Setup Boxing)',
      album: isComboWorkout ? '콤보 트레이닝' : '복싱 라운드 타이머',
      artwork: [
        { src: '/icon.png', sizes: '512x512', type: 'image/png' },
        { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
    });

    const onMediaPlay = () => {
      if (isPausedRef.current) {
        handlePauseResumeRef.current();
      }
    };

    const onMediaPause = () => {
      if (!isPausedRef.current) {
        handlePauseResumeRef.current();
      }
    };

    const onMediaNext = () => {
      handleSkipRef.current();
    };

    const onMediaStop = () => {
      handleQuitRef.current();
    };

    try {
      navigator.mediaSession.setActionHandler('play', onMediaPlay);
      navigator.mediaSession.setActionHandler('pause', onMediaPause);
      navigator.mediaSession.setActionHandler('nexttrack', onMediaNext);
      navigator.mediaSession.setActionHandler('stop', onMediaStop);
    } catch {}

    return () => {
      if ('mediaSession' in navigator) {
        try {
          navigator.mediaSession.setActionHandler('play', null);
          navigator.mediaSession.setActionHandler('pause', null);
          navigator.mediaSession.setActionHandler('nexttrack', null);
          navigator.mediaSession.setActionHandler('stop', null);
        } catch {}
      }
    };
  }, [currentState, currentSet, setsCount, isPaused, isComboWorkout]);

  // Handle browser back button (popstate)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.history.pushState({ inWorkout: true }, '');

    const handlePopState = async (e: PopStateEvent) => {
      if (currentStateRef.current === 'FINISHED') return;
      // Re-push state so user doesn't immediately navigate away before confirmation
      window.history.pushState({ inWorkout: true }, '');

      const confirmed = await showConfirmDialog({
        title: t('quitConfirmTitle') || '운동 중단',
        text: t('quitConfirmMessage') || '운동을 중단하시겠습니까?',
        confirmButtonText: t('quitConfirmQuit') || '중단하기',
        cancelButtonText: t('cancel') || '계속하기',
        isDestructive: true,
      });

      if (confirmed) {
        if (isComboWorkout) {
          stopComboSpeech();
        }
        if (actualCompletedSets > 0) {
          const finalDuration = getPreciseDuration();
          onComplete(actualCompletedSets, finalDuration).catch(() => {});
        }
        onClose();
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isComboWorkout, actualCompletedSets, onClose, onComplete, stopComboSpeech, t]);

  const handleQuit = async () => {
    const confirmed = await showConfirmDialog({
      title: t('quitConfirmTitle') || '운동 중단',
      text: t('quitConfirmMessage') || '운동을 중단하시겠습니까?',
      confirmButtonText: t('quitConfirmQuit') || '중단하기',
      cancelButtonText: t('cancel') || '계속하기',
      isDestructive: true,
    });

    if (confirmed) {
      if (isComboWorkout) {
        stopComboSpeech();
      }
      if (actualCompletedSets > 0) {
        const finalDuration = getPreciseDuration();
        onComplete(actualCompletedSets, finalDuration).catch(() => {});
      }
      onClose();
    }
  };

  handleQuitRef.current = handleQuit;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStateColor = () => {
    switch (currentState) {
      case 'PREPARE':
        return '#F59E0B'; // Amber Warning
      case 'WORK':
        return '#FF2E54'; // Fire Crimson Red
      case 'REST':
        return '#10B981'; // Cooling Emerald
      case 'FINISHED':
        return '#F59E0B'; // Gold
    }
  };

  const getStateLabel = () => {
    switch (currentState) {
      case 'PREPARE':
        return t('statePrepare');
      case 'WORK':
        return t('stateWork');
      case 'REST':
        return t('stateRest');
      case 'FINISHED':
        return t('stateFinished');
    }
  };

  const stateColor = getStateColor();

  // SVG progress
  const radius = 100;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = totalTimeLeft > 0 ? timeLeft / totalTimeLeft : 0;
  const strokeDashoffset = circumference * (1 - progressRatio);

  const activeComboBlock = blocks[currentBlockIndex] || blocks[0];
  const activeBlockActions = activeComboBlock ? parsePatternToActions(activeComboBlock.pattern) : [];

  return (
    <div className="fixed inset-0 z-[99999] bg-[#0B0C10] flex flex-col justify-between max-w-[1024px] mx-auto text-white select-none shadow-2xl md:border-x md:border-[#282C3A]">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#282C3A] flex flex-col items-center">
        <div className="text-base font-extrabold text-white truncate max-w-full">
          {badgeName
            ? `${badgeName} ${t('workoutLabel')}`
            : isComboWorkout
            ? t('comboRoutineWorkout')
            : t('freeWorkoutTimer')}
        </div>
        {currentState !== 'FINISHED' && (
          <div className="flex items-center gap-3 mt-1 text-xs text-[#94A3B8]">
            <span className="font-bold">
              {currentSet} / {setsCount} {t('setUnit')}
            </span>
            {currentState === 'WORK' && (
              <span className="font-extrabold text-white">{formatTime(timeLeft)}</span>
            )}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {currentState === 'FINISHED' ? (
          <div className="flex flex-col items-center justify-center text-center space-y-4 w-full animate-fade-in">
            <div className="w-24 h-24 rounded-full bg-[#F59E0B]/20 flex items-center justify-center">
              <Award className="w-16 h-16 text-[#F59E0B]" />
            </div>
            <h2 className="text-2xl font-black text-white">{t('workoutFinishedTitle')}</h2>
            <p className="text-xs text-[#94A3B8]">{t('workoutFinishedSubtitle')}</p>

            <div className="bg-[#15171E] rounded-2xl p-5 border border-[#282C3A] w-full max-w-xs flex items-center justify-around">
              <div className="flex flex-col items-center">
                <span className="text-[11px] text-[#94A3B8]">{t('completedSets')}</span>
                <span className="text-lg font-black text-white mt-0.5">
                  {actualCompletedSets} {t('setUnit')}
                </span>
              </div>
              <div className="w-[1px] h-10 bg-[#282C3A]" />
              <div className="flex flex-col items-center">
                <span className="text-[11px] text-[#94A3B8]">{t('totalWorkoutTime')}</span>
                <span className="text-lg font-black text-white mt-0.5">
                  {formatTime(totalDurationSeconds)}
                </span>
              </div>
            </div>

            {isSaving && (
              <p className="text-xs text-yellow-400 animate-pulse">{t('savingLogStatus')}</p>
            )}
          </div>
        ) : (
          <div className="relative w-64 h-64 flex items-center justify-center">
            <svg width="220" height="220" viewBox="0 0 220 220" className="transform -rotate-90">
              <circle
                cx="110"
                cy="110"
                r={radius}
                stroke="#222634"
                strokeWidth={strokeWidth}
                fill="none"
              />
              <circle
                cx="110"
                cy="110"
                r={radius}
                stroke={stateColor}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-300"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span
                style={{ color: stateColor }}
                className="text-sm font-black tracking-wider uppercase mb-1"
              >
                {getStateLabel()}
              </span>
              <span className="text-6xl font-black text-white tracking-tighter">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        )}

        {/* Combo Routine Coaching Display */}
        {currentState === 'WORK' && isComboWorkout && (
          <div className="w-full max-w-sm mt-6 space-y-3">
            {/* Header: All Combos + Strikes */}
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-1.5">
                <span className="text-base">🥊</span>
                <span className="text-xs font-bold text-white">{t('allCombos')}</span>
              </div>
              <div className="flex items-center gap-1 bg-[#15171E] px-2 py-0.5 rounded-full border border-[#282C3A]">
                <Flame className="w-3.5 h-3.5 text-[#f97316]" />
                <span className="text-xs font-extrabold text-white">
                  {totalStrikesCount} {t('strikesUnit')}
                </span>
              </div>
            </div>

            {/* Horizontal Combo Cards */}
            <div
              ref={comboScrollRef}
              className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-1"
            >
              {blocks.map((block, bIdx) => {
                const isBlockActive = bIdx === currentBlockIndex;
                return (
                  <React.Fragment key={`${block.id}-${bIdx}`}>
                    <div
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold whitespace-nowrap transition-all ${
                        isBlockActive
                          ? 'bg-[#FF2E54] border-white text-white shadow-lg shadow-[#FF2E54]/30 scale-105'
                          : 'bg-[#15171E] border-[#282C3A] text-[#94A3B8]'
                      }`}
                    >
                      {block.name}
                    </div>
                    {bIdx < blocks.length - 1 && (
                      <span className="text-xs text-[#64748B]">➔</span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Active Combo Composition moves */}
            <div className="bg-[#15171E] rounded-xl p-3 border border-[#282C3A] flex flex-wrap items-center justify-center gap-2">
              {activeBlockActions.map((action, idx) => {
                const isCurrentAction = idx === currentStepIndex;
                const stepDisplayName = action.isRest
                  ? '-'
                  : /^[1-8]$/.test(action.code)
                  ? action.code
                  : language === 'en'
                  ? action.nameEn?.split(' ')[0] || action.code
                  : action.nameKo?.replace(/^[0-9]\s*\((.*)\)$/, '$1').split(' ')[0] || action.code;

                return (
                  <React.Fragment key={`${action.id}-${idx}`}>
                    <span
                      className={`text-base font-black transition-all ${
                        isCurrentAction
                          ? 'text-[#FF2E54] scale-125'
                          : action.isRest
                          ? 'text-[#64748B]'
                          : 'text-white'
                      }`}
                    >
                      {stepDisplayName}
                    </span>
                    {idx < activeBlockActions.length - 1 && (
                      <span className="text-xs text-[#64748B]">➔</span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}

        {/* Display when Resting */}
        {currentState === 'REST' && (
          <div className="bg-[#15171E] rounded-2xl p-5 border border-[#282C3A] max-w-xs text-center mt-6 space-y-1">
            <div className="text-base font-extrabold text-[#10B981]">{t('restTitle')}</div>
            <p className="text-xs text-[#94A3B8]">{t('restDesc')}</p>
          </div>
        )}

        {/* Display when Preparing */}
        {currentState === 'PREPARE' && (
          <div className="bg-[#15171E] rounded-2xl p-5 border border-[#282C3A] max-w-xs text-center mt-6 space-y-1">
            <div className="text-base font-extrabold text-[#F59E0B]">{t('prepareTitle')}</div>
            <p className="text-xs text-[#94A3B8]">
              {isComboWorkout ? t('prepareDescCombo') : t('prepareDescFree')}
            </p>
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="p-6 border-t border-[#282C3A] w-full flex items-center justify-center">
        {currentState !== 'FINISHED' ? (
          <div className="grid grid-cols-3 items-center justify-items-center w-full max-w-sm mx-auto">
            {/* Quit */}
            <button
              type="button"
              onClick={handleQuit}
              className="flex flex-col items-center text-[#F8FAFC] hover:text-red-400 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#15171E] border border-[#282C3A] flex items-center justify-center group-hover:border-red-400 transition-colors shadow-md">
                <Square className="w-5 h-5 fill-current" />
              </div>
              <span className="text-[11px] font-bold text-[#94A3B8] mt-1.5">{t('btnQuit')}</span>
            </button>

            {/* Play/Pause */}
            <button
              type="button"
              onClick={handlePauseResume}
              style={{ backgroundColor: stateColor }}
              className="w-16 h-16 rounded-full flex items-center justify-center text-[#0B0F19] shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              {isPaused ? (
                <Play className="w-8 h-8 fill-current ml-1" />
              ) : (
                <Pause className="w-8 h-8 fill-current" />
              )}
            </button>

            {/* Skip */}
            <button
              type="button"
              onClick={handleSkip}
              className="flex flex-col items-center text-[#F8FAFC] hover:text-cyan-400 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#15171E] border border-[#282C3A] flex items-center justify-center group-hover:border-cyan-400 transition-colors shadow-md">
                <SkipForward className="w-5 h-5 fill-current" />
              </div>
              <span className="text-[11px] font-bold text-[#94A3B8] mt-1.5">{t('btnSkip')}</span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onClose}
            className="w-full max-w-sm py-4 rounded-xl bg-[#FF2E54] text-white font-extrabold text-base hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 cursor-pointer"
          >
            {t('returnToDashboard')}
          </button>
        )}
      </div>
    </div>
  );
}
