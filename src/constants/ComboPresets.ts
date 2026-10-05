import { ComboBlock, SkillInterface, WorkoutRoutine } from '../types/combo';
import { parsePatternToActions } from '../utils/comboParser';

/**
 * Standard Single Basic Skill Presets (기본 탭)
 * Punches: 1 ~ 8
 * Defenses & Footwork: L-Slip, R-Slip, Duck, L-Weave, R-Weave, Back
 * Rest: -
 */
export const BASIC_SKILL_PRESETS: SkillInterface[] = [
  {
    id: '1',
    name: '1. 잽',
    nameEn: '1. Jab',
    sequence: ['1'],
    isPreset: true,
    isCombo: false,
    category: 'basic',
    color: '#38bdf8',
    durationMs: 400,
    description: '왼손 잽 (1)',
    descriptionEn: 'Lead jab (1)',
  },
  {
    id: '2',
    name: '2. 투',
    nameEn: '2. Cross',
    sequence: ['2'],
    isPreset: true,
    isCombo: false,
    category: 'basic',
    color: '#f87171', // Red
    durationMs: 400,
    description: '오른손 스트레이트 (2)',
    descriptionEn: 'Rear straight (2)',
  },
  {
    id: '3',
    name: '3. 왼훅',
    nameEn: '3. L-Hook',
    sequence: ['3'],
    isPreset: true,
    isCombo: false,
    category: 'basic',
    color: '#60a5fa', // Blue
    durationMs: 450,
    description: '왼손 훅 (3)',
    descriptionEn: 'Lead hook (3)',
  },
  {
    id: '4',
    name: '4. 오른훅',
    nameEn: '4. R-Hook',
    sequence: ['4'],
    isPreset: true,
    isCombo: false,
    category: 'basic',
    color: '#fb923c', // Orange
    durationMs: 450,
    description: '오른손 훅 (4)',
    descriptionEn: 'Rear hook (4)',
  },
  {
    id: '5',
    name: '5. 왼어퍼',
    nameEn: '5. L-Upper',
    sequence: ['5'],
    isPreset: true,
    isCombo: false,
    category: 'basic',
    color: '#818cf8', // Indigo
    durationMs: 450,
    description: '왼손 어퍼컷 (5)',
    descriptionEn: 'Lead uppercut (5)',
  },
  {
    id: '6',
    name: '6. 오른어퍼',
    nameEn: '6. R-Upper',
    sequence: ['6'],
    isPreset: true,
    isCombo: false,
    category: 'basic',
    color: '#f43f5e', // Rose
    durationMs: 450,
    description: '오른손 어퍼컷 (6)',
    descriptionEn: 'Rear uppercut (6)',
  },
  {
    id: '7',
    name: '7. 왼바디',
    nameEn: '7. L-Body',
    sequence: ['7'],
    isPreset: true,
    isCombo: false,
    category: 'basic',
    color: '#06b6d4', // Cyan
    durationMs: 450,
    description: '왼손 복부 바디샷 (7)',
    descriptionEn: 'Lead body shot (7)',
  },
  {
    id: '8',
    name: '8. 오른바디',
    nameEn: '8. R-Body',
    sequence: ['8'],
    isPreset: true,
    isCombo: false,
    category: 'basic',
    color: '#f97316', // Dark Orange
    durationMs: 450,
    description: '오른손 복부 바디샷 (8)',
    descriptionEn: 'Rear body shot (8)',
  },
  {
    id: 'l-slip',
    name: 'L슬립',
    nameEn: 'L-Slip',
    sequence: ['l-slip'],
    isPreset: true,
    isCombo: false,
    category: 'basic',
    color: '#34d399', // Emerald
    durationMs: 500,
    description: '왼쪽 상체 슬립 회피',
    descriptionEn: 'Slip head to the left',
  },
  {
    id: 'r-slip',
    name: 'R슬립',
    nameEn: 'R-Slip',
    sequence: ['r-slip'],
    isPreset: true,
    isCombo: false,
    category: 'basic',
    color: '#10b981', // Dark Emerald
    durationMs: 500,
    description: '오른쪽 상체 슬립 회피',
    descriptionEn: 'Slip head to the right',
  },
  {
    id: 'duck',
    name: '더킹',
    nameEn: 'Duck',
    sequence: ['duck'],
    isPreset: true,
    isCombo: false,
    category: 'basic',
    color: '#a78bfa', // Purple
    durationMs: 400,
    description: '상체 아래로 숙이기 (더킹)',
    descriptionEn: 'Duck under incoming punches',
  },
  {
    id: 'l-weave',
    name: 'L위빙',
    nameEn: 'L-Weave',
    sequence: ['l-weave'],
    isPreset: true,
    isCombo: false,
    category: 'basic',
    color: '#c084fc', // Violet
    durationMs: 500,
    description: '왼쪽 롤링 위빙 회피',
    descriptionEn: 'Roll & weave under to left',
  },
  {
    id: 'r-weave',
    name: 'R위빙',
    nameEn: 'R-Weave',
    sequence: ['r-weave'],
    isPreset: true,
    isCombo: false,
    category: 'basic',
    color: '#c084fc',
    durationMs: 500,
    description: '오른쪽 롤링 위빙 회피',
    descriptionEn: 'Roll & weave under to right',
  },
  {
    id: 'back',
    name: '백',
    nameEn: 'Back',
    sequence: ['back'],
    isPreset: true,
    isCombo: false,
    category: 'basic',
    color: '#e879f9', // Fuchsia
    durationMs: 400,
    description: '거리 조절 스텝백',
    descriptionEn: 'Step back to reset range',
  },
  {
    id: 'rest',
    name: '실행 (-)',
    nameEn: 'Do (-)',
    sequence: ['-'],
    isPreset: true,
    isCombo: false,
    category: 'basic',
    color: '#64748b', // Slate Gray
    durationMs: 500,
    description: '1박자 실행 (-)',
    descriptionEn: '1-beat execution (-)',
  },
];

/**
 * Standard Preset Combos Library (기본 콤보 탭)
 */
export const COMBO_SKILL_PRESETS: SkillInterface[] = [
  {
    id: 'preset-one-two',
    name: '1-2 (원-투)',
    nameEn: '1-2 (One-Two)',
    sequence: ['1', '2'],
    tokenCount: 2,
    isPreset: true,
    isCombo: true,
    category: 'preset-combo',
    color: '#1aee5a',
    durationMs: 800,
    description: '기본 원-투 (1 -> 2)',
    descriptionEn: 'Basic 1-2 (Jab -> Cross)',
  },
  {
    id: 'preset-1-1-2',
    name: '1-1-2 (더블잽-투)',
    nameEn: '1-1-2 (Double Jab-Cross)',
    sequence: ['1', '1', '2'],
    tokenCount: 3,
    isPreset: true,
    isCombo: true,
    category: 'preset-combo',
    color: '#98c02b',
    durationMs: 1200,
    description: '연속 잽 후 스트레이트 (1 -> 1 -> 2)',
    descriptionEn: 'Double jab into cross (1 -> 1 -> 2)',
  },
  {
    id: 'preset-1-2-3-2',
    name: '1-2-3-2 (원-투-훅-투)',
    nameEn: '1-2-3-2 (Jab-Cross-Hook-Cross)',
    sequence: ['1', '2', '3', '2'],
    tokenCount: 4,
    isPreset: true,
    isCombo: true,
    category: 'preset-combo',
    color: '#1529db',
    durationMs: 1600,
    description: '복싱 정석 4 연타, 원 투 훅 투 (1 -> 2 -> 3 -> 2)',
    descriptionEn: 'Classic 4-punch combination',
  },
  {
    id: 'preset-1-2-7-3',
    name: '1-2-7-3 (원-투-바디-훅)',
    nameEn: '1-2-7-3 (Jab-Cross-Body-Hook)',
    sequence: ['1', '2', '7', '3'],
    tokenCount: 4,
    isPreset: true,
    isCombo: true,
    category: 'preset-combo',
    color: '#8624b4',
    durationMs: 1600,
    description: '상단 유인 후 리버샷 바디와 훅 연타 (1 -> 2 -> 7 -> 3)',
    descriptionEn: 'High-low setup into liver body hook',
  },
  {
    id: 'preset-1-2-slip-2',
    name: '1-2-R슬립-2',
    nameEn: '1-2-R Slip-2',
    sequence: ['1', '2', 'r-slip', '2'],
    tokenCount: 4,
    isPreset: true,
    isCombo: true,
    category: 'preset-combo',
    color: '#fdb01f',
    durationMs: 1800,
    description: '원투 후 오른 슬립 회피 카운터 스트레이트 (1 -> 2 -> R슬립 -> 2)',
    descriptionEn: '1-2, slip right, counter cross',
  },
  {
    id: 'preset-1-2-weave-4-5',
    name: '1-2-R위빙-4-3-L위빙-3-4',
    nameEn: '1-2-R Weave-4-3-L Weave-3-4',
    sequence: ['1', '2', 'r-weave', '4', '3', 'l-weave', '3', '4'],
    tokenCount: 8,
    isPreset: true,
    isCombo: true,
    category: 'preset-combo',
    color: '#c084fc',
    durationMs: 3400,
    description: '원투, 우측 위빙, 4-3 훅 연타, 좌측 위빙, 3-4 훅 마무리',
    descriptionEn: '1-2, right weave, 4-3 hook, left weave, 3-4 hook',
  },
  {
    id: 'preset-1-2-back-1-2',
    name: '1-2-백-1-2',
    nameEn: '1-2-Back-1-2',
    sequence: ['1', '2', 'back', '1', '2'],
    tokenCount: 5,
    isPreset: true,
    isCombo: true,
    category: 'preset-combo',
    color: '#c23d25',
    durationMs: 2200,
    description: '원투 후 백스텝으로 상대 펀치 피하고 전진 원 투 (1 -> 2 -> 백 -> 1 -> 2)',
    descriptionEn: '1-2, step back, step in 1-2 counter',
  },
  {
    id: 'preset-duck-5-4-weave',
    name: '더킹-5-4-R위빙',
    nameEn: 'Duck-5-4-R Weave',
    sequence: ['duck', '5', '4', 'r-weave'],
    tokenCount: 4,
    isPreset: true,
    isCombo: true,
    category: 'preset-combo',
    color: '#ff2f97',
    durationMs: 1800,
    description: '더킹 회피 후 왼어퍼-오른훅 연타 및 위빙 복귀 (더킹 -> 5 -> 4 -> R위빙)',
    descriptionEn: 'Duck under, lead uppercut, rear hook, right weave',
  },
];

/**
 * Legacy ComboBlock compatibility bridge
 */
function createBlock(
  id: string,
  name: string,
  category: ComboBlock['category'],
  pattern: string,
  description?: string,
  defaultStepDurationMs: number = 700
): ComboBlock {
  const actions = parsePatternToActions(pattern);
  return {
    id,
    name,
    category,
    pattern,
    actionIds: actions.map((a) => a.id),
    defaultStepDurationMs,
    description,
  };
}

export const COMBO_PRESETS: ComboBlock[] = [
  createBlock('basic-jab', '1. 잽', 'basic', '1', '기본 왼손 잽 (1)'),
  createBlock('basic-one-two', '1-2', 'basic', '1.2', '기본 원-투 (1-2)'),
  createBlock('basic-double-jab', '1-1-2', 'basic', '1.1.2', '더블 잽 투 (1-1-2)'),
  createBlock('combo-1-2-3-2', '1-2-3-2', 'combination', '1.2.3.2', '정석 4구 연타'),
  createBlock('counter-slip-counter', '1-2-R슬립-2', 'counter', '1.2.r-slip.2', '슬립 회피 카운터'),
  createBlock('rest-1', '실행 (-)', 'rest', '-', '콤보 실행 (-)'),
];

export const PRESET_MAP = new Map<string, ComboBlock>(
  COMBO_PRESETS.map((block) => [block.id, block])
);

export function getPresetBlockById(id: string): ComboBlock | undefined {
  return PRESET_MAP.get(id);
}

export const DEFAULT_STARTER_ROUTINE: WorkoutRoutine = {
  id: 'routine-starter-1',
  name: '기본 3분 콤보 루틴',
  description: '1-2, 1-1-2, 1-2-3-2 기본기로 이루어진 섀도우복싱 훈련',
  items: [
    { instanceId: 'inst-1', blockId: 'basic-one-two' },
    { instanceId: 'inst-2', blockId: 'rest-1' },
    { instanceId: 'inst-3', blockId: 'basic-double-jab' },
    { instanceId: 'inst-4', blockId: 'combo-1-2-3-2' },
  ],
  targetWorkoutSeconds: 180,
  stepDurationMs: 700,
  restBetweenLoopsMs: 1500,
  createdAt: Date.now(),
  updatedAt: Date.now(),
};
