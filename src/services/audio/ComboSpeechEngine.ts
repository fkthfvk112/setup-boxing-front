import { BoxingActionDef } from '../../types/combo';
import { parsePatternToActions, DEFAULT_STEP_DURATION_MS } from '../../utils/comboParser';

export interface PlayStepOptions {
  rate?: number;
  pitch?: number;
  language?: string;
  onStart?: () => void;
}

export interface PlayPatternOptions extends PlayStepOptions {
  stepDurationMs?: number;
  onStepStart?: (action: BoxingActionDef, index: number) => void;
  shouldAbort?: () => boolean;
  presetId?: string;
}

export const DEFAULT_SPEECH_RATE = 1.38;
export const DEFAULT_SPEECH_PITCH = 1.05;
export const DEFAULT_SPEECH_LANGUAGE = 'en-US';

// Bell sound sources
export const BELL_SOUND_MAP: Record<string, string> = {
  prepare: '/sound/bell2.mp3',
  start: '/sound/bell1.mp3',
  rest: '/sound/bell3.mp3',
  finish: '/sound/bell3.mp3',
};

// Combo sound sources
export const COMBO_SOUND_MAP: Record<string, string> = {
  // Standard 1 ~ 8 Punches
  '1': '/sound/combo/1.mp3',
  '2': '/sound/combo/2.mp3',
  '3': '/sound/combo/3.mp3',
  '4': '/sound/combo/4.mp3',
  '5': '/sound/combo/5.mp3',
  '6': '/sound/combo/6.mp3',
  '7': '/sound/combo/7.mp3',
  '8': '/sound/combo/8.mp3',

  // Evasions & Defenses & Footwork
  'back': '/sound/combo/back.mp3',
  'duck': '/sound/combo/duck.mp3',
  'ducking': '/sound/combo/duck.mp3',
  'l-slip': '/sound/combo/l-slip.mp3',
  'r-slip': '/sound/combo/r-slip.mp3',
  'l-weave': '/sound/combo/l-weave.mp3',
  'r-weave': '/sound/combo/r-weave.mp3',

  // Preset Combos from COMBO_SKILL_PRESETS & COMBO_PRESETS
  'preset-one-two': '/sound/combo/preset-one-two.mp3',
  'preset-1-1-2': '/sound/combo/preset-1-1-2.mp3',
  'preset-1-2-3-2': '/sound/combo/preset-1-2-3-2.mp3',
  'preset-1-2-7-3': '/sound/combo/preset-1-2-7-3.mp3',
  'preset-1-2-slip-2': '/sound/combo/preset-1-2-slip-2.mp3',
  'preset-1-2-weave-4-5': '/sound/combo/preset-1-2-weave-4-5.mp3',
  'preset-1-2-back-1-2': '/sound/combo/preset-1-2-back-1-2.mp3',
  'preset-duck-5-4-weave': '/sound/combo/preset-duck-5-4-weave.mp3',

  // Legacy & Starter Routine IDs
  'basic-one-two': '/sound/combo/preset-one-two.mp3',
  'basic-double-jab': '/sound/combo/preset-1-1-2.mp3',
  'combo-1-2-3-2': '/sound/combo/preset-1-2-3-2.mp3',
  'counter-slip-counter': '/sound/combo/preset-1-2-slip-2.mp3',

  // Pattern / Sequence String Aliases
  '1-2': '/sound/combo/preset-one-two.mp3',
  '1.2.-': '/sound/combo/preset-one-two.mp3',
  '1.2': '/sound/combo/preset-one-two.mp3',

  '1-1-2': '/sound/combo/preset-1-1-2.mp3',
  '1.1.2.-': '/sound/combo/preset-1-1-2.mp3',
  '1.1.2': '/sound/combo/preset-1-1-2.mp3',

  '1-2-3-2': '/sound/combo/preset-1-2-3-2.mp3',
  '1.2.3.2.-': '/sound/combo/preset-1-2-3-2.mp3',
  '1.2.3.2.-.-': '/sound/combo/preset-1-2-3-2.mp3',
  '1.2.3.2': '/sound/combo/preset-1-2-3-2.mp3',

  '1-2-7-3': '/sound/combo/preset-1-2-7-3.mp3',
  '1.2.7.3.-': '/sound/combo/preset-1-2-7-3.mp3',
  '1.2.7.3': '/sound/combo/preset-1-2-7-3.mp3',

  '1-2-slip-2': '/sound/combo/preset-1-2-slip-2.mp3',
  'preset-1-2-r-slip-2': '/sound/combo/preset-1-2-slip-2.mp3',
  '1.2.r-slip.2.-.-': '/sound/combo/preset-1-2-slip-2.mp3',
  '1.2.r-slip.2.-': '/sound/combo/preset-1-2-slip-2.mp3',
  '1.2.r-slip.2': '/sound/combo/preset-1-2-slip-2.mp3',
  '1.2.l-slip.2.-': '/sound/combo/preset-1-2-slip-2.mp3',
  '1.2.l-slip.2': '/sound/combo/preset-1-2-slip-2.mp3',

  '1-2-weave-4-5': '/sound/combo/preset-1-2-weave-4-5.mp3',
  '1.2.r-weave.4.3.l-weave.3.4.-.-.-.-': '/sound/combo/preset-1-2-weave-4-5.mp3',

  '1-2-back-1-2': '/sound/combo/preset-1-2-back-1-2.mp3',
  '1.2.back.1.2.-.-': '/sound/combo/preset-1-2-back-1-2.mp3',

  'duck-5-4-weave': '/sound/combo/preset-duck-5-4-weave.mp3',
  'duck.5.4.r-weave.-.-': '/sound/combo/preset-duck-5-4-weave.mp3',
};

// Active playing audio elements for safe cleanup
const activeAudioElements: HTMLAudioElement[] = [];
const audioPreloadCache: Record<string, HTMLAudioElement> = {};

// Preload audio files in browser environment
if (typeof window !== 'undefined') {
  // Preload bells
  Object.entries(BELL_SOUND_MAP).forEach(([k, url]) => {
    try {
      const a = new Audio(url);
      a.preload = 'auto';
      audioPreloadCache[`bell_${k}`] = a;
    } catch {}
  });

  // Preload combo sounds
  Object.entries(COMBO_SOUND_MAP).forEach(([k, url]) => {
    if (!audioPreloadCache[url]) {
      try {
        const a = new Audio(url);
        a.preload = 'auto';
        audioPreloadCache[url] = a;
      } catch {}
    }
  });
}

/**
 * Resolves ID or token/pattern to valid COMBO_SOUND_MAP key
 */
export function resolveSoundKey(key?: string | null, pattern?: string | null): string | null {
  if (key) {
    const normalized = key.trim().toLowerCase();
    if (COMBO_SOUND_MAP[normalized]) {
      return normalized;
    }
    const sortedKeys = Object.keys(COMBO_SOUND_MAP).sort((a, b) => b.length - a.length);
    for (const mapKey of sortedKeys) {
      if (normalized === mapKey || normalized.startsWith(`${mapKey}-`) || normalized.startsWith(`${mapKey}_`)) {
        return mapKey;
      }
    }
    const stripped = normalized.replace(/-\d+$/, '');
    if (COMBO_SOUND_MAP[stripped]) {
      return stripped;
    }
  }

  if (pattern) {
    const normPattern = pattern.trim().toLowerCase();
    if (COMBO_SOUND_MAP[normPattern]) {
      return normPattern;
    }
    const noRestPattern = normPattern.replace(/(\.-)+$/, '').replace(/-+$/, '');
    if (COMBO_SOUND_MAP[noRestPattern]) {
      return noRestPattern;
    }
  }

  return null;
}

/**
 * Checks whether a dedicated sound file exists for the given ID / key / pattern
 */
export function hasComboSound(key?: string | null, pattern?: string | null): boolean {
  return resolveSoundKey(key, pattern) !== null;
}

/**
 * Plays boxing bell sound (prepare, start, rest, finish) - NEVER uses TTS!
 */
export function playBellSound(soundType: 'start' | 'prepare' | 'rest' | 'finish'): void {
  if (typeof window === 'undefined') return;
  const soundUrl = BELL_SOUND_MAP[soundType];
  if (!soundUrl) return;

  try {
    const audio = new Audio(soundUrl);
    audio.play().catch((err) => {
      console.warn(`[ComboSpeechEngine] Failed to play bell sound (${soundType}):`, err);
    });
    activeAudioElements.push(audio);
    audio.onended = () => {
      const idx = activeAudioElements.indexOf(audio);
      if (idx > -1) activeAudioElements.splice(idx, 1);
    };
  } catch (err) {
    console.warn(`[ComboSpeechEngine] Audio playback error for bell:`, err);
  }
}

/**
 * Plays a recorded sound file from COMBO_SOUND_MAP by ID (e.g. '1', '2', 'duck', 'preset-1-1-2')
 */
export function playComboSound(
  key?: string | null,
  stopPrevious: boolean = true,
  pattern?: string | null
): boolean {
  if (typeof window === 'undefined') return false;
  const soundKey = resolveSoundKey(key, pattern);
  if (!soundKey) return false;
  const soundUrl = COMBO_SOUND_MAP[soundKey];
  if (!soundUrl) return false;

  if (stopPrevious) {
    stopAllAudioPlayers();
  }

  try {
    const audio = new Audio(soundUrl);
    audio.play().catch(() => {});
    activeAudioElements.push(audio);
    audio.onended = () => {
      const idx = activeAudioElements.indexOf(audio);
      if (idx > -1) activeAudioElements.splice(idx, 1);
    };
    return true;
  } catch (e) {
    console.warn(`[ComboSpeechEngine] Failed to play audio for key "${soundKey}":`, e);
    return false;
  }
}

/**
 * Stops all currently active audio players
 */
export function stopAllAudioPlayers(): void {
  while (activeAudioElements.length > 0) {
    const audio = activeAudioElements.pop();
    try {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    } catch {}
  }
}

// ---------------- TTS Engine Fallback ----------------
export function isSpeechAvailable(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export async function speakText(
  text: string,
  options: { rate?: number; pitch?: number; language?: string } = {}
): Promise<void> {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const {
    rate = DEFAULT_SPEECH_RATE,
    pitch = DEFAULT_SPEECH_PITCH,
    language = DEFAULT_SPEECH_LANGUAGE,
  } = options;

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = rate;
    utterance.pitch = pitch;
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('[ComboSpeechEngine] Web Speech API error:', e);
  }
}

/**
 * Speaks a single boxing action:
 * 1. Checks if dedicated sound file exists (1.mp3, 2.mp3, duck.mp3, etc.)
 * 2. If sound file exists -> plays audio file immediately (0ms delay)
 * 3. If no sound file and not rest -> fallback to TTS
 * 4. If rest -> silent
 */
export async function speakAction(
  action: BoxingActionDef,
  options: { rate?: number; pitch?: number; language?: string } = {}
): Promise<void> {
  if (action.isRest) {
    return;
  }

  const actionKey = action.id || action.code;
  const played = playComboSound(actionKey);
  if (played) {
    return;
  }

  // Fallback to TTS only for completely unrecorded custom tokens
  if (action.spokenText) {
    await speakText(action.spokenText, options);
  }
}

/**
 * Immediately stops any ongoing speech output or sound file playback
 */
export async function stopSpeech(): Promise<void> {
  stopAllAudioPlayers();
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
}

/**
 * Plays a single action beat and waits for the exact slotDurationMs to complete.
 */
export function playIsochronousStep(
  action: BoxingActionDef,
  slotDurationMs: number = DEFAULT_STEP_DURATION_MS,
  options: PlayStepOptions = {}
): Promise<void> {
  return new Promise((resolve) => {
    options.onStart?.();

    speakAction(action, {
      rate: options.rate ?? DEFAULT_SPEECH_RATE,
      pitch: options.pitch ?? DEFAULT_SPEECH_PITCH,
      language: options.language ?? DEFAULT_SPEECH_LANGUAGE,
    });

    setTimeout(() => {
      resolve();
    }, slotDurationMs);
  });
}

/**
 * Plays a full combo sequence pattern beat by beat.
 * If presetId is provided and has a dedicated preset audio file, plays the preset sound once.
 */
export async function playComboSequence(
  pattern: string,
  options: PlayPatternOptions = {}
): Promise<void> {
  const {
    stepDurationMs = DEFAULT_STEP_DURATION_MS,
    rate = DEFAULT_SPEECH_RATE,
    pitch = DEFAULT_SPEECH_PITCH,
    language = DEFAULT_SPEECH_LANGUAGE,
    onStepStart,
    shouldAbort,
    presetId,
  } = options;

  const isPresetAudio = presetId && hasComboSound(presetId);
  if (isPresetAudio) {
    playComboSound(presetId);
  }

  const actions = parsePatternToActions(pattern);

  for (let i = 0; i < actions.length; i++) {
    if (shouldAbort && shouldAbort()) {
      await stopSpeech();
      return;
    }

    const action = actions[i];
    onStepStart?.(action, i);

    if (!isPresetAudio) {
      speakAction(action, { rate, pitch, language });
    }

    const duration = action.durationMs ?? stepDurationMs;
    await new Promise((resolve) => setTimeout(resolve, duration));
  }
}
