/**
 * Boxing Combo & Audio Coaching Types & Interfaces
 */

/**
 * Standard identifier for boxing actions.
 * Covers left/right jabs, straights, hooks, uppercuts, body punches,
 * slips, ducking, weaving, and rests.
 */
export type BoxingActionId =
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | 'l-slip'
  | 'r-slip'
  | 'duck'
  | 'l-weave'
  | 'r-weave'
  | 'back'
  | 'rest'
  | '-';

export type ActionCategory = 'punch' | 'defense' | 'rest';

export type HandType = 'left' | 'right' | 'none';

/**
 * Metadata definition for a single boxing action.
 */
export interface BoxingActionDef {
  /** Canonical ID (e.g. 'l-hook', 'jab', 'rest') */
  id: BoxingActionId;
  /** Primary identifier tag for easy matching */
  code: string;
  /** Full Korean label for UI display (e.g. '왼손 훅', '잽', '한 박자 휴식') */
  nameKo: string;
  /** English label for UI display (e.g. 'Left Hook', 'Jab', 'Rest') */
  nameEn?: string;
  /** Short text spoken by TTS (e.g. '왼훅', '잽', '슬립') */
  spokenText: string | null;
  /** Category */
  category: ActionCategory;
  /** Hand used */
  hand: HandType;
  /** Whether this action is a silent rest/pause */
  isRest: boolean;
  /** Color theme for visual badges / UI */
  badgeColor?: string;
  /** Action execution duration in milliseconds (e.g. 350ms for jab, 700ms for slip/rest) */
  durationMs?: number;
}

/**
 * Unified Common Data Interface for Basic skills, Preset combos, and My combos
 */
export interface SkillInterface {
  /** Unique ID / SeqNo (e.g. 'basic-l-jab', 'preset-one-two', 'my-combo-171239') */
  id: string;
  /** Original preset ID if cloned/instantiated on workbench */
  presetId?: string;
  /** Sub-items if assembled from multiple skills/presets */
  subItems?: SkillInterface[];
  /** Display name (e.g. "L잽", "원-투-왼훅", "나만의 카운터 콤보") */
  name: string;
  /** English display name (e.g. "L-Jab", "One-Two-Lead Hook") */
  nameEn?: string;
  /**
   * Sequence composition array.
   * Basic move example: ["L잽"]
   * Combo example: ["L잽", "-", "R잽", "L훅"]
   */
  sequence: string[];
  /** Whether provided by system (true) or user-created (false) */
  isPreset: boolean;
  /** Whether single basic move (false) or combo (true) */
  isCombo: boolean;
  /** Classification category for bottom panel tabs */
  category: 'basic' | 'preset-combo' | 'my-combo';
  /** Color code for badges and UI cards */
  color: string;
  /** Optional description */
  description?: string;
  /** Optional English description */
  descriptionEn?: string;
  /** Total combo duration in milliseconds */
  durationMs?: number;
  /** Number of action tokens in this skill/combo */
  tokenCount?: number;
  /** Creation timestamp */
  createdAt?: number;
}

/**
 * A reusable combo building block (legacy compatibility)
 */
export interface ComboBlock {
  id: string;
  name: string;
  category: 'basic' | 'combination' | 'counter' | 'defense' | 'rest' | 'custom';
  pattern: string;
  actionIds: BoxingActionId[];
  defaultStepDurationMs?: number;
  description?: string;
  isCustom?: boolean;
}

/**
 * A block item positioned in a user's workout routine.
 */
export interface RoutineItem {
  instanceId: string;
  blockId: string;
  customPattern?: string;
  stepDurationMs?: number;
}

/**
 * Complete workout routine configured by the user.
 */
export interface WorkoutRoutine {
  id: string;
  name: string;
  description?: string;
  items: RoutineItem[];
  targetWorkoutSeconds: number;
  stepDurationMs: number;
  restBetweenLoopsMs: number;
  createdAt: number;
  updatedAt: number;
}

/**
 * Result of calculating duration for a combo or routine.
 */
export interface ComboDurationResult {
  totalDurationMs: number;
  totalSeconds: number;
  tokenCount: number;
  restCount: number;
  strikeCount: number;
}

/**
 * Player state during audio workout playback.
 */
export interface ComboPlayerState {
  isPlaying: boolean;
  isPaused: boolean;
  currentBlockIndex: number;
  currentStepIndex: number;
  currentToken: string | null;
  currentAction: BoxingActionDef | null;
  currentLoopCount: number;
  totalWorkoutSeconds: number;
  elapsedSeconds: number;
  remainingSeconds: number;
}

export interface UserProfile {
  id: number;
  userId?: string | number;
  userName?: string;
  email?: string;
  nickname?: string;
  profileImageUrl?: string;
  provider?: string;
  tier: 'FREE' | 'PRO' | 'ULTIMATE';
  language?: string;
  country?: string;
  timezone?: string;
}

export interface WorkoutLog {
  id: number;
  date: string;
  sets_completed: number;
  duration_seconds: number;
  timestamp: number;
  routine_name?: string;
  total_punches?: number;
  total_evasions?: number;
  calories_burned?: number;
}
