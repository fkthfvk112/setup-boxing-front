import { BoxingActionDef, BoxingActionId } from '../types/combo';

/**
 * Standard Boxing Action Registry
 * Standard 1~8 Punches + Defenses (l-slip, r-slip, duck, l-weave, r-weave, back) + Rest (-)
 * All audio voice callouts in English ("One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "L Slip", "R Slip", "Duck", "L Weave", "R Weave", "Back").
 */
export const BOXING_ACTIONS: Record<string, BoxingActionDef> = {
  // --- Punches (Standard 1 ~ 8) ---
  '1': {
    id: '1',
    code: '1',
    nameKo: '1 (잽)',
    nameEn: '1 (Jab)',
    spokenText: 'One',
    category: 'punch',
    hand: 'left',
    isRest: false,
    badgeColor: '#38bdf8', // Light blue
    durationMs: 350,
  },
  '2': {
    id: '2',
    code: '2',
    nameKo: '2 (스트레이트)',
    nameEn: '2 (Cross)',
    spokenText: 'Two',
    category: 'punch',
    hand: 'right',
    isRest: false,
    badgeColor: '#f87171', // Red
    durationMs: 350,
  },
  '3': {
    id: '3',
    code: '3',
    nameKo: '3 (왼손 훅)',
    nameEn: '3 (L-Hook)',
    spokenText: 'Three',
    category: 'punch',
    hand: 'left',
    isRest: false,
    badgeColor: '#60a5fa', // Blue
    durationMs: 450,
  },
  '4': {
    id: '4',
    code: '4',
    nameKo: '4 (오른손 훅)',
    nameEn: '4 (R-Hook)',
    spokenText: 'Four',
    category: 'punch',
    hand: 'right',
    isRest: false,
    badgeColor: '#fb923c', // Orange
    durationMs: 450,
  },
  '5': {
    id: '5',
    code: '5',
    nameKo: '5 (왼손 어퍼)',
    nameEn: '5 (L-Upper)',
    spokenText: 'Five',
    category: 'punch',
    hand: 'left',
    isRest: false,
    badgeColor: '#818cf8', // Indigo
    durationMs: 450,
  },
  '6': {
    id: '6',
    code: '6',
    nameKo: '6 (오른손 어퍼)',
    nameEn: '6 (R-Upper)',
    spokenText: 'Six',
    category: 'punch',
    hand: 'right',
    isRest: false,
    badgeColor: '#f43f5e', // Rose
    durationMs: 450,
  },
  '7': {
    id: '7',
    code: '7',
    nameKo: '7 (왼손 바디)',
    nameEn: '7 (L-Body)',
    spokenText: 'Seven',
    category: 'punch',
    hand: 'left',
    isRest: false,
    badgeColor: '#06b6d4', // Cyan
    durationMs: 450,
  },
  '8': {
    id: '8',
    code: '8',
    nameKo: '8 (오른손 바디)',
    nameEn: '8 (R-Body)',
    spokenText: 'Eight',
    category: 'punch',
    hand: 'right',
    isRest: false,
    badgeColor: '#f97316', // Dark Orange
    durationMs: 450,
  },

  // --- Evasions, Defenses & Footwork ---
  'l-slip': {
    id: 'l-slip',
    code: 'l-slip',
    nameKo: 'L슬립',
    nameEn: 'L-Slip',
    spokenText: 'L Slip',
    category: 'defense',
    hand: 'left',
    isRest: false,
    badgeColor: '#34d399', // Emerald
    durationMs: 700,
  },
  'r-slip': {
    id: 'r-slip',
    code: 'r-slip',
    nameKo: 'R슬립',
    nameEn: 'R-Slip',
    spokenText: 'R Slip',
    category: 'defense',
    hand: 'right',
    isRest: false,
    badgeColor: '#10b981', // Dark Emerald
    durationMs: 700,
  },
  'duck': {
    id: 'duck',
    code: 'duck',
    nameKo: '더킹',
    nameEn: 'Duck',
    spokenText: 'Duck',
    category: 'defense',
    hand: 'none',
    isRest: false,
    badgeColor: '#a78bfa', // Purple
    durationMs: 700,
  },
  'l-weave': {
    id: 'l-weave',
    code: 'l-weave',
    nameKo: 'L위빙',
    nameEn: 'L-Weave',
    spokenText: 'L Weave',
    category: 'defense',
    hand: 'left',
    isRest: false,
    badgeColor: '#c084fc', // Violet
    durationMs: 700,
  },
  'r-weave': {
    id: 'r-weave',
    code: 'r-weave',
    nameKo: 'R위빙',
    nameEn: 'R-Weave',
    spokenText: 'R Weave',
    category: 'defense',
    hand: 'right',
    isRest: false,
    badgeColor: '#c084fc',
    durationMs: 700,
  },
  'back': {
    id: 'back',
    code: 'back',
    nameKo: '백 (스텝)',
    nameEn: 'Back',
    spokenText: 'Back',
    category: 'defense',
    hand: 'none',
    isRest: false,
    badgeColor: '#e879f9', // Fuchsia
    durationMs: 700,
  },

  // --- Rest / Pause / Execute (Silent slot) ---
  '-': {
    id: '-',
    code: '-',
    nameKo: '실행',
    nameEn: 'Do',
    spokenText: null,
    category: 'rest',
    hand: 'none',
    isRest: true,
    badgeColor: '#64748b', // Slate
    durationMs: 700,
  },
  'rest': {
    id: '-',
    code: '-',
    nameKo: '실행',
    nameEn: 'Do',
    spokenText: null,
    category: 'rest',
    hand: 'none',
    isRest: true,
    badgeColor: '#64748b',
    durationMs: 700,
  },
};

// In-memory runtime cache for duration overrides loaded from SQLite DB
const actionDurationOverrides: Record<string, number> = {};

export function setActionDurationOverrides(overrides: Record<string, number>) {
  Object.assign(actionDurationOverrides, overrides);
}

export function setActionDurationOverride(actionId: string, durationMs: number) {
  actionDurationOverrides[actionId.toLowerCase()] = durationMs;
}

// Canonical migration map for legacy Korean / English tokens stored in existing databases or states
const LEGACY_TOKEN_MAP: Record<string, string> = {
  'l-jab': '1',
  'l잽': '1',
  '잽': '1',
  '원': '1',
  'jab': '1',
  'r-straight': '2',
  'r잽': '2',
  '투': '2',
  '스트레이트': '2',
  'straight': '2',
  'cross': '2',
  'l-hook': '3',
  'l훅': '3',
  '왼훅': '3',
  'hook-l': '3',
  'r-hook': '4',
  'r훅': '4',
  '오른훅': '4',
  'hook-r': '4',
  'l-uppercut': '5',
  'l어퍼': '5',
  '왼어퍼': '5',
  'r-uppercut': '6',
  'r어퍼': '6',
  '오른어퍼': '6',
  'l-body': '7',
  'l바디': '7',
  '왼바디': '7',
  'r-body': '8',
  'r바디': '8',
  '오른바디': '8',
  'l-slip': 'l-slip',
  'l슬립': 'l-slip',
  '왼슬립': 'l-slip',
  'lslip': 'l-slip',
  'r-slip': 'r-slip',
  'r슬립': 'r-slip',
  '오른슬립': 'r-slip',
  'rslip': 'r-slip',
  '더킹': 'duck',
  'ducking': 'duck',
  'l-weave': 'l-weave',
  'l위빙': 'l-weave',
  '왼위빙': 'l-weave',
  'lweave': 'l-weave',
  'r-weave': 'r-weave',
  'r위빙': 'r-weave',
  '오른위빙': 'r-weave',
  'rweave': 'r-weave',
  '위빙': 'l-weave',
  'weaving': 'l-weave',
  '스텝백': 'back',
  '백': 'back',
  'stepback': 'back',
  'backstep': 'back',
  '쉼': '-',
  '휴식': '-',
};

/**
 * Resolves any token string ('1' ~ '8', 'l-slip', 'r-slip', 'duck', 'l-weave', 'r-weave', 'back', '-')
 * directly to its BoxingActionDef.
 */
export function resolveActionDef(token: string): BoxingActionDef {
  const normalized = token.trim().toLowerCase();

  // 1. Direct canonical match
  if (BOXING_ACTIONS[normalized]) {
    const actionDef = BOXING_ACTIONS[normalized];
    const overrideMs = actionDurationOverrides[actionDef.id] ?? actionDurationOverrides[actionDef.code];
    if (overrideMs !== undefined) {
      return { ...actionDef, durationMs: overrideMs };
    }
    return actionDef;
  }

  // 2. Legacy token fallback (e.g. 'L잽', 'R잽', '더킹' saved in older DB state)
  const canonicalId = LEGACY_TOKEN_MAP[normalized];
  if (canonicalId && BOXING_ACTIONS[canonicalId]) {
    const actionDef = BOXING_ACTIONS[canonicalId];
    const overrideMs = actionDurationOverrides[actionDef.id] ?? actionDurationOverrides[actionDef.code];
    if (overrideMs !== undefined) {
      return { ...actionDef, durationMs: overrideMs };
    }
    return actionDef;
  }

  // 3. Fallback for custom spoken action
  return {
    id: normalized as BoxingActionId,
    code: normalized,
    nameKo: token,
    spokenText: token,
    category: 'punch',
    hand: 'none',
    isRest: token === '-',
    badgeColor: '#94a3b8',
    durationMs: 400,
  };
}
