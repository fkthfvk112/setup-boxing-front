import { useState, useRef, useEffect, useCallback } from 'react';
import {
  BoxingActionDef,
  ComboBlock,
  ComboDurationResult,
  SkillInterface,
} from '../types/combo';
import {
  parsePatternToActions,
  calculateComboDuration,
  decomposePatternIntoBlocks,
  DEFAULT_STEP_DURATION_MS,
  DEFAULT_LOOP_REST_MS,
} from '../utils/comboParser';
import {
  speakAction,
  stopSpeech,
  hasComboSound,
  playComboSound,
  DEFAULT_SPEECH_RATE,
  DEFAULT_SPEECH_PITCH,
} from '../services/audio/ComboSpeechEngine';

export interface UseComboPlayerOptions {
  defaultStepDurationMs?: number;
  speechRate?: number;
  speechPitch?: number;
  onWorkoutComplete?: (summary: { totalStrikes: number; totalSeconds: number }) => void;
}

const PRESET_MIN_DURATIONS: Record<string, number> = {
  'preset-one-two': 1300,
  '1-2': 1300,
  '1.2': 1300,
  '1.2.-': 1300,

  'preset-1-1-2': 1700,
  '1-1-2': 1700,
  '1.1.2': 1700,
  '1.1.2.-': 1700,

  'preset-1-2-3-2': 2000,
  '1-2-3-2': 2000,
  '1.2.3.2': 2000,
  '1.2.3.2.-': 2000,
  '1.2.3.2.-.-': 2000,

  'preset-1-2-7-3': 1900,
  '1-2-7-3': 1900,
  '1.2.7.3': 1900,
  '1.2.7.3.-': 1900,

  'preset-1-2-slip-2': 2000,
  '1-2-slip-2': 2000,
  '1.2.r-slip.2': 2000,
  '1.2.r-slip.2.-': 2000,
  '1.2.r-slip.2.-.-': 2000,

  'preset-1-2-back-1-2': 2200,
  '1-2-back-1-2': 2200,
  '1.2.back.1.2': 2200,
  '1.2.back.1.2.-.-': 2200,

  'preset-1-2-weave-4-5': 4200,
  '1-2-weave-4-5': 4200,
  '1.2.r-weave.4.3.l-weave.3.4': 4200,
  '1.2.r-weave.4.3.l-weave.3.4.-.-.-.-': 4200,

  'preset-duck-5-4-weave': 2600,
  'duck-5-4-weave': 2600,
  'duck.5.4.r-weave.-.-': 2600,
};

function getPresetMinDuration(id?: string | null, pattern?: string | null): number {
  if (id && PRESET_MIN_DURATIONS[id.toLowerCase()]) {
    return PRESET_MIN_DURATIONS[id.toLowerCase()];
  }
  if (pattern && PRESET_MIN_DURATIONS[pattern.toLowerCase()]) {
    return PRESET_MIN_DURATIONS[pattern.toLowerCase()];
  }
  return 0;
}

export function useComboPlayer(options: UseComboPlayerOptions = {}) {
  const {
    defaultStepDurationMs = DEFAULT_STEP_DURATION_MS,
    speechRate = DEFAULT_SPEECH_RATE,
    speechPitch = DEFAULT_SPEECH_PITCH,
    onWorkoutComplete,
  } = options;

  // Playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [currentBlockIndex, setCurrentBlockIndex] = useState<number>(0);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [currentAction, setCurrentAction] = useState<BoxingActionDef | null>(null);
  const [currentToken, setCurrentToken] = useState<string | null>(null);
  const [currentLoopCount, setCurrentLoopCount] = useState<number>(0);

  // Timer state
  const [totalWorkoutSeconds, setTotalWorkoutSeconds] = useState<number>(180);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(180);
  const [totalStrikesCount, setTotalStrikesCount] = useState<number>(0);

  // Internal cancellation / state refs
  const abortRef = useRef<boolean>(false);
  const isPausedRef = useRef<boolean>(false);
  const timerIntervalRef = useRef<any>(null);
  const activeRoutineRef = useRef<ComboBlock[]>([]);
  const skipBlockSignalRef = useRef<boolean>(false);
  const sessionIdRef = useRef<number>(0);
  const onWorkoutCompleteRef = useRef(onWorkoutComplete);
  onWorkoutCompleteRef.current = onWorkoutComplete;

  /**
   * Helper that waits for `ms` milliseconds, but can be paused or aborted.
   */
  const waitDelay = useCallback((ms: number, sessionId: number): Promise<boolean> => {
    return new Promise((resolve) => {
      let elapsed = 0;
      const interval = 50;

      const check = setInterval(() => {
        if (abortRef.current || sessionIdRef.current !== sessionId) {
          clearInterval(check);
          resolve(false);
          return;
        }

        if (skipBlockSignalRef.current) {
          clearInterval(check);
          resolve(true);
          return;
        }

        if (!isPausedRef.current) {
          elapsed += interval;
        }

        if (elapsed >= ms) {
          clearInterval(check);
          resolve(true);
        }
      }, interval);
    });
  }, []);

  /**
   * Stops playback completely and resets indicators
   */
  const stop = useCallback(() => {
    sessionIdRef.current += 1;
    abortRef.current = true;
    isPausedRef.current = false;
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    stopSpeech();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentAction(null);
    setCurrentToken(null);
    setCurrentStepIndex(0);
  }, []);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  /**
   * Plays a single combo pattern once (for preview in routine builder)
   */
  const playPattern = useCallback(
    async (
      pattern: string,
      stepDurationMs: number = defaultStepDurationMs,
      presetId?: string
    ) => {
      stop();
      const currentSessionId = ++sessionIdRef.current;
      abortRef.current = false;
      setIsPlaying(true);
      setIsPaused(false);

      const isPresetAudio = hasComboSound(presetId, pattern);
      if (isPresetAudio) {
        playComboSound(presetId || pattern, true, pattern);
      }

      const actions = parsePatternToActions(pattern);

      for (let i = 0; i < actions.length; i++) {
        if (abortRef.current || sessionIdRef.current !== currentSessionId) break;

        const action = actions[i];
        setCurrentStepIndex(i);
        setCurrentAction(action);
        setCurrentToken(action.spokenText || '-');

        if (!isPresetAudio) {
          speakAction(action, { rate: speechRate, pitch: speechPitch });
        }

        const stepMs = action.durationMs ?? stepDurationMs;
        const completed = await waitDelay(stepMs, currentSessionId);
        if (!completed || abortRef.current || sessionIdRef.current !== currentSessionId) break;
      }

      if (sessionIdRef.current === currentSessionId) {
        setIsPlaying(false);
        setCurrentAction(null);
        setCurrentToken(null);
        setCurrentStepIndex(0);
      }
    },
    [defaultStepDurationMs, speechRate, speechPitch, waitDelay, stop]
  );

  /**
   * Plays a list of SkillInterface items sequentially
   */
  const playSkillItems = useCallback(
    async (
      items: SkillInterface[],
      stepDurationMs: number = defaultStepDurationMs
    ) => {
      stop();
      const currentSessionId = ++sessionIdRef.current;
      abortRef.current = false;
      setIsPlaying(true);
      setIsPaused(false);

      for (let itemIdx = 0; itemIdx < items.length; itemIdx++) {
        if (abortRef.current || sessionIdRef.current !== currentSessionId) break;
        setCurrentBlockIndex(itemIdx);
        const item = items[itemIdx];
        const soundKey = item.presetId || item.id;
        const pattern = item.sequence.join('.');
        const isPresetAudio = hasComboSound(soundKey, pattern);
        if (isPresetAudio) {
          playComboSound(soundKey, true, pattern);
        }

        const actions = parsePatternToActions(pattern);
        for (let sIdx = 0; sIdx < actions.length; sIdx++) {
          if (abortRef.current || sessionIdRef.current !== currentSessionId) break;
          const action = actions[sIdx];
          setCurrentStepIndex(sIdx);
          setCurrentAction(action);
          setCurrentToken(action.spokenText || '-');

          if (!isPresetAudio) {
            speakAction(action, { rate: speechRate, pitch: speechPitch });
          }

          const stepMs =
            item.durationMs && actions.length > 0
              ? Math.max(250, Math.round(item.durationMs / actions.length))
              : (action.durationMs ?? stepDurationMs);
          const completed = await waitDelay(stepMs, currentSessionId);
          if (!completed || abortRef.current || sessionIdRef.current !== currentSessionId) break;
        }
      }

      if (sessionIdRef.current === currentSessionId) {
        setIsPlaying(false);
        setCurrentAction(null);
        setCurrentToken(null);
        setCurrentStepIndex(0);
        setCurrentBlockIndex(0);
      }
    },
    [defaultStepDurationMs, speechRate, speechPitch, waitDelay, stop]
  );

  /**
   * Starts workout routine loop for target duration
   */
  const startRoutineLoop = useCallback(
    async (
      blocks: ComboBlock[],
      targetSeconds: number = 180,
      customStepDurationMs: number = defaultStepDurationMs,
      restBetweenLoopsMs: number = DEFAULT_LOOP_REST_MS,
      playMode: 'sequential' | 'random' = 'sequential'
    ) => {
      if (!blocks || blocks.length === 0) return;

      stop();
      const currentSessionId = ++sessionIdRef.current;

      abortRef.current = false;
      isPausedRef.current = false;
      skipBlockSignalRef.current = false;
      activeRoutineRef.current = blocks;

      setIsPlaying(true);
      setIsPaused(false);
      setTotalWorkoutSeconds(targetSeconds);
      setRemainingSeconds(targetSeconds);
      setElapsedSeconds(0);
      setTotalStrikesCount(0);
      setCurrentLoopCount(1);

      let accumulatedStrikes = 0;
      let secondsLeft = targetSeconds;

      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = setInterval(() => {
        if (sessionIdRef.current !== currentSessionId) {
          if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
          return;
        }

        if (!isPausedRef.current) {
          secondsLeft -= 1;
          setRemainingSeconds(Math.max(0, secondsLeft));
          setElapsedSeconds((prev) => prev + 1);

          if (secondsLeft <= 0) {
            if (timerIntervalRef.current) {
              clearInterval(timerIntervalRef.current);
              timerIntervalRef.current = null;
            }
          }
        }
      }, 1000);

      let loopNum = 1;
      let lastBlockIndex = -1;

      const executeBlock = async (block: ComboBlock, bIdx: number): Promise<boolean> => {
        setCurrentBlockIndex(bIdx);
        skipBlockSignalRef.current = false;

        const isPresetAudio = hasComboSound(block.id, block.pattern);
        if (isPresetAudio) {
          playComboSound(block.id, true, block.pattern);
          const actions = parsePatternToActions(block.pattern);
          const minDur = getPresetMinDuration(block.id, block.pattern);
          const stepMs = Math.max(
            minDur > 0 ? Math.round(minDur / Math.max(1, actions.length)) : 300,
            block.defaultStepDurationMs ?? customStepDurationMs
          );

          for (let sIdx = 0; sIdx < actions.length; sIdx++) {
            if (abortRef.current || sessionIdRef.current !== currentSessionId || skipBlockSignalRef.current) {
              return false;
            }

            const action = actions[sIdx];
            setCurrentStepIndex(sIdx);
            setCurrentAction(action);
            setCurrentToken(action.spokenText || '-');

            if (!action.isRest) {
              accumulatedStrikes += 1;
              setTotalStrikesCount(accumulatedStrikes);
            }

            const completed = await waitDelay(stepMs, currentSessionId);
            if (!completed || abortRef.current || sessionIdRef.current !== currentSessionId) return false;
          }

          return true;
        }

        const subSegments = decomposePatternIntoBlocks(block.pattern, block.id);
        const segmentsToPlay = subSegments.length > 0 ? subSegments : [block];

        let overallStepIndex = 0;
        for (const seg of segmentsToPlay) {
          if (abortRef.current || sessionIdRef.current !== currentSessionId || skipBlockSignalRef.current) {
            return false;
          }

          const segActions = parsePatternToActions(seg.pattern);
          const isSegPreset = hasComboSound(seg.id, seg.pattern);

          if (isSegPreset) {
            playComboSound(seg.id, true, seg.pattern);
            const minDur = getPresetMinDuration(seg.id, seg.pattern);
            const stepMs = Math.max(
              minDur > 0 ? Math.round(minDur / Math.max(1, segActions.length)) : 300,
              seg.defaultStepDurationMs ?? customStepDurationMs
            );

            for (let sIdx = 0; sIdx < segActions.length; sIdx++) {
              if (abortRef.current || sessionIdRef.current !== currentSessionId || skipBlockSignalRef.current) {
                return false;
              }
              const action = segActions[sIdx];
              setCurrentStepIndex(overallStepIndex++);
              setCurrentAction(action);
              setCurrentToken(action.spokenText || '-');

              if (!action.isRest) {
                accumulatedStrikes += 1;
                setTotalStrikesCount(accumulatedStrikes);
              }

              const completed = await waitDelay(stepMs, currentSessionId);
              if (!completed || abortRef.current || sessionIdRef.current !== currentSessionId) return false;
            }
          } else {
            for (let sIdx = 0; sIdx < segActions.length; sIdx++) {
              if (abortRef.current || sessionIdRef.current !== currentSessionId || skipBlockSignalRef.current) {
                return false;
              }
              const action = segActions[sIdx];
              setCurrentStepIndex(overallStepIndex++);
              setCurrentAction(action);
              setCurrentToken(action.spokenText || '-');

              if (!action.isRest) {
                accumulatedStrikes += 1;
                setTotalStrikesCount(accumulatedStrikes);
              }

              if (!action.isRest) {
                speakAction(action, { rate: speechRate, pitch: speechPitch });
              }

              const stepMs = action.isRest
                ? (action.durationMs ?? 700)
                : Math.max(650, seg.defaultStepDurationMs ?? action.durationMs ?? customStepDurationMs);
              const completed = await waitDelay(stepMs, currentSessionId);
              if (!completed || abortRef.current || sessionIdRef.current !== currentSessionId) return false;
            }
          }
        }

        return true;
      };

      while (!abortRef.current && sessionIdRef.current === currentSessionId && secondsLeft > 0) {
        if (playMode === 'random') {
          let bIdx = 0;
          if (blocks.length > 1) {
            do {
              bIdx = Math.floor(Math.random() * blocks.length);
            } while (bIdx === lastBlockIndex);
          }
          lastBlockIndex = bIdx;

          const ok = await executeBlock(blocks[bIdx], bIdx);
          if (!ok || abortRef.current || sessionIdRef.current !== currentSessionId || secondsLeft <= 0) break;

          loopNum += 1;
          setCurrentLoopCount(loopNum);
        } else {
          for (let bIdx = 0; bIdx < blocks.length; bIdx++) {
            if (abortRef.current || sessionIdRef.current !== currentSessionId || secondsLeft <= 0) break;

            const ok = await executeBlock(blocks[bIdx], bIdx);
            if (!ok || abortRef.current || sessionIdRef.current !== currentSessionId) break;

            if (skipBlockSignalRef.current) {
              skipBlockSignalRef.current = false;
            }

            if (secondsLeft <= 0) break;
          }

          if (abortRef.current || sessionIdRef.current !== currentSessionId || secondsLeft <= 0) break;

          loopNum += 1;
          setCurrentLoopCount(loopNum);
        }
      }

      if (sessionIdRef.current === currentSessionId) {
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
        }
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentAction(null);
        setCurrentToken(null);
        await stopSpeech();

        onWorkoutCompleteRef.current?.({
          totalStrikes: accumulatedStrikes,
          totalSeconds: targetSeconds - Math.max(0, secondsLeft),
        });
      }
    },
    [defaultStepDurationMs, speechRate, speechPitch, waitDelay, stop]
  );

  const pause = useCallback(() => {
    isPausedRef.current = true;
    setIsPaused(true);
    stopSpeech();
  }, []);

  const resume = useCallback(() => {
    isPausedRef.current = false;
    setIsPaused(false);
  }, []);

  const skipToNextBlock = useCallback(() => {
    skipBlockSignalRef.current = true;
    stopSpeech();
  }, []);

  const calculateDuration = useCallback(
    (pattern: string, stepDurationMs: number = defaultStepDurationMs): ComboDurationResult => {
      return calculateComboDuration(pattern, stepDurationMs);
    },
    [defaultStepDurationMs]
  );

  return {
    isPlaying,
    isPaused,
    currentBlockIndex,
    currentStepIndex,
    currentAction,
    currentToken,
    currentLoopCount,
    totalWorkoutSeconds,
    elapsedSeconds,
    remainingSeconds,
    totalStrikesCount,
    playPattern,
    playSkillItems,
    startRoutineLoop,
    pause,
    resume,
    stop,
    skipToNextBlock,
    calculateDuration,
  };
}
