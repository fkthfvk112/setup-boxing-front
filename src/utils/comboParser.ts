import { resolveActionDef } from '../constants/BoxingActions';
import { BoxingActionDef, ComboBlock, ComboDurationResult } from '../types/combo';

export const DEFAULT_STEP_DURATION_MS = 700;
export const DEFAULT_LOOP_REST_MS = 1500;

/**
 * Splits a combo pattern string by '.' into individual token strings.
 * E.g. "잽.잽.-.l훅.r훅" -> ["잽", "잽", "-", "l훅", "r훅"]
 * E.g. "jab.straight.-" -> ["jab", "straight", "-"]
 */
export function parsePatternToTokens(pattern: string): string[] {
  if (!pattern || typeof pattern !== 'string') return [];
  return pattern
    .split('.')
    .map((token) => token.trim())
    .filter((token) => token.length > 0);
}

/**
 * Parses a pattern string into an array of BoxingActionDef objects.
 */
export function parsePatternToActions(pattern: string): BoxingActionDef[] {
  const tokens = parsePatternToTokens(pattern);
  return tokens.map((t) => resolveActionDef(t));
}

/**
 * Calculates duration and metrics for a combo pattern.
 * Sums the durationMs of each individual action/rest token.
 */
export function calculateComboDuration(
  pattern: string,
  stepDurationMs?: number
): ComboDurationResult {
  const actions = parsePatternToActions(pattern);
  const tokenCount = actions.length;
  const restCount = actions.filter((a) => a.isRest).length;
  const strikeCount = tokenCount - restCount;

  const totalDurationMs = actions.reduce((sum, action) => {
    return sum + (action.durationMs ?? stepDurationMs ?? DEFAULT_STEP_DURATION_MS);
  }, 0);
  const totalSeconds = Number((totalDurationMs / 1000).toFixed(1));

  return {
    totalDurationMs,
    totalSeconds,
    tokenCount,
    restCount,
    strikeCount,
  };
}

/**
 * Calculates duration metrics for an entire routine (multiple blocks).
 */
export function calculateRoutineDuration(
  blocks: ComboBlock[],
  defaultStepDurationMs: number = DEFAULT_STEP_DURATION_MS,
  restBetweenLoopsMs: number = DEFAULT_LOOP_REST_MS
): {
  singleLoopMs: number;
  singleLoopSeconds: number;
  totalBeats: number;
  totalStrikes: number;
  estimatedLoopsForDuration: (workoutSeconds: number) => number;
} {
  let singleLoopMs = 0;
  let totalBeats = 0;
  let totalStrikes = 0;

  for (const block of blocks) {
    const stepDuration = block.defaultStepDurationMs ?? defaultStepDurationMs;
    const durationInfo = calculateComboDuration(block.pattern, stepDuration);
    singleLoopMs += durationInfo.totalDurationMs;
    totalBeats += durationInfo.tokenCount;
    totalStrikes += durationInfo.strikeCount;
  }

  // Add the pause at the end of the loop
  const totalLoopCycleMs = singleLoopMs + (blocks.length > 0 ? restBetweenLoopsMs : 0);
  const singleLoopSeconds = Number((singleLoopMs / 1000).toFixed(1));

  const estimatedLoopsForDuration = (workoutSeconds: number) => {
    if (totalLoopCycleMs <= 0) return 0;
    const workoutMs = workoutSeconds * 1000;
    return Math.max(1, Math.floor(workoutMs / totalLoopCycleMs));
  };

  return {
    singleLoopMs,
    singleLoopSeconds,
    totalBeats,
    totalStrikes,
    estimatedLoopsForDuration,
  };
}

/**
 * Normalizes a pattern string into canonical form.
 * E.g. "잽.투.-.l훅" -> "jab.straight.-.l-hook"
 */
export function normalizePatternToCodes(pattern: string): string {
  const actions = parsePatternToActions(pattern);
  return actions.map((a) => a.code).join('.');
}

export const KNOWN_COMBO_PRESETS: Array<{
  presetId: string;
  name: string;
  nameEn: string;
  pattern: string;
  tokens: string[];
  durationMs: number;
}> = [
  {
    presetId: 'preset-1-2-weave-4-5',
    name: '1-2-R위빙-4-3-L위빙-3-4',
    nameEn: '1-2-R Weave-4-3-L Weave-3-4',
    pattern: '1.2.r-weave.4.3.l-weave.3.4.-.-.-.-',
    tokens: ['1', '2', 'r-weave', '4', '3', 'l-weave', '3', '4', '-', '-', '-', '-'],
    durationMs: 4200,
  },
  {
    presetId: 'preset-1-2-weave-4-5',
    name: '1-2-R위빙-4-3-L위빙-3-4',
    nameEn: '1-2-R Weave-4-3-L Weave-3-4',
    pattern: '1.2.r-weave.4.3.l-weave.3.4',
    tokens: ['1', '2', 'r-weave', '4', '3', 'l-weave', '3', '4'],
    durationMs: 3800,
  },
  {
    presetId: 'preset-1-2-back-1-2',
    name: '1-2-백-1-2',
    nameEn: '1-2-Back-1-2',
    pattern: '1.2.back.1.2.-.-',
    tokens: ['1', '2', 'back', '1', '2', '-', '-'],
    durationMs: 2200,
  },
  {
    presetId: 'preset-1-2-back-1-2',
    name: '1-2-백-1-2',
    nameEn: '1-2-Back-1-2',
    pattern: '1.2.back.1.2',
    tokens: ['1', '2', 'back', '1', '2'],
    durationMs: 2000,
  },
  {
    presetId: 'preset-duck-5-4-weave',
    name: '더킹-5-4-R위빙',
    nameEn: 'Duck-5-4-R Weave',
    pattern: 'duck.5.4.r-weave.-.-',
    tokens: ['duck', '5', '4', 'r-weave', '-', '-'],
    durationMs: 2600,
  },
  {
    presetId: 'preset-duck-5-4-weave',
    name: '더킹-5-4-R위빙',
    nameEn: 'Duck-5-4-R Weave',
    pattern: 'duck.5.4.r-weave',
    tokens: ['duck', '5', '4', 'r-weave'],
    durationMs: 2400,
  },
  {
    presetId: 'preset-1-2-slip-2',
    name: '1-2-R슬립-2',
    nameEn: '1-2-R Slip-2',
    pattern: '1.2.r-slip.2.-.-',
    tokens: ['1', '2', 'r-slip', '2', '-', '-'],
    durationMs: 1800,
  },
  {
    presetId: 'preset-1-2-slip-2',
    name: '1-2-R슬립-2',
    nameEn: '1-2-R Slip-2',
    pattern: '1.2.r-slip.2',
    tokens: ['1', '2', 'r-slip', '2'],
    durationMs: 1800,
  },
  {
    presetId: 'preset-1-2-7-3',
    name: '1-2-7-3 (원-투-바디-훅)',
    nameEn: '1-2-7-3 (Jab-Cross-Body-Hook)',
    pattern: '1.2.7.3.-',
    tokens: ['1', '2', '7', '3', '-'],
    durationMs: 1800,
  },
  {
    presetId: 'preset-1-2-7-3',
    name: '1-2-7-3 (원-투-바디-훅)',
    nameEn: '1-2-7-3 (Jab-Cross-Body-Hook)',
    pattern: '1.2.7.3',
    tokens: ['1', '2', '7', '3'],
    durationMs: 1800,
  },
  {
    presetId: 'preset-1-2-3-2',
    name: '1-2-3-2 (원-투-훅-투)',
    nameEn: '1-2-3-2 (Jab-Cross-Hook-Cross)',
    pattern: '1.2.3.2.-.-',
    tokens: ['1', '2', '3', '2', '-', '-'],
    durationMs: 1800,
  },
  {
    presetId: 'preset-1-2-3-2',
    name: '1-2-3-2 (원-투-훅-투)',
    nameEn: '1-2-3-2 (Jab-Cross-Hook-Cross)',
    pattern: '1.2.3.2',
    tokens: ['1', '2', '3', '2'],
    durationMs: 1800,
  },
  {
    presetId: 'preset-1-1-2',
    name: '1-1-2 (더블잽-투)',
    nameEn: '1-1-2 (Double Jab-Cross)',
    pattern: '1.1.2.-',
    tokens: ['1', '1', '2', '-'],
    durationMs: 1400,
  },
  {
    presetId: 'preset-1-1-2',
    name: '1-1-2 (더블잽-투)',
    nameEn: '1-1-2 (Double Jab-Cross)',
    pattern: '1.1.2',
    tokens: ['1', '1', '2'],
    durationMs: 1400,
  },
  {
    presetId: 'preset-one-two',
    name: '1-2 (원-투)',
    nameEn: '1-2 (One-Two)',
    pattern: '1.2.-',
    tokens: ['1', '2', '-'],
    durationMs: 1400,
  },
  {
    presetId: 'preset-one-two',
    name: '1-2 (원-투)',
    nameEn: '1-2 (One-Two)',
    pattern: '1.2',
    tokens: ['1', '2'],
    durationMs: 1400,
  },
];

/**
 * Decomposes an arbitrary tokens sequence or pattern into recognized preset blocks
 * and individual punch blocks, ensuring that each preset segment can trigger its
 * dedicated chunk audio file.
 */
export function decomposePatternIntoBlocks(pattern: string, parentIdPrefix: string = 'sub'): ComboBlock[] {
  const tokens = parsePatternToTokens(pattern);
  if (tokens.length === 0) return [];

  const blocks: ComboBlock[] = [];
  let i = 0;
  let subIndex = 0;

  while (i < tokens.length) {
    let matched = false;
    for (const preset of KNOWN_COMBO_PRESETS) {
      const len = preset.tokens.length;
      if (i + len <= tokens.length) {
        const slice = tokens.slice(i, i + len);
        if (slice.every((tok, idx) => tok === preset.tokens[idx])) {
          const blockActions = parsePatternToActions(preset.pattern);
          blocks.push({
            id: `${preset.presetId}-${parentIdPrefix}-${subIndex++}`,
            name: preset.name,
            category: 'combination',
            pattern: preset.pattern,
            actionIds: blockActions.map((a) => a.id),
            defaultStepDurationMs: Math.max(300, Math.round(preset.durationMs / Math.max(1, blockActions.length))),
            description: preset.name,
          });
          i += len;
          matched = true;
          break;
        }
      }
    }

    if (!matched) {
      const singleToken = tokens[i];
      const action = resolveActionDef(singleToken);
      blocks.push({
        id: `${action.id}-${parentIdPrefix}-${subIndex++}`,
        name: action.nameKo,
        category: 'basic',
        pattern: singleToken,
        actionIds: [action.id],
        defaultStepDurationMs: action.durationMs ?? DEFAULT_STEP_DURATION_MS,
      });
      i += 1;
    }
  }

  return blocks;
}
