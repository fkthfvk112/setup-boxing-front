/**
 * Entitlement policy configuration for Free vs PRO monetization tiers
 */
export interface EntitlementLimits {
  /** Maximum number of action tokens allowed per single combo */
  maxComboTokens: number;
  /** Maximum number of custom combos allowed to be saved in My Combos */
  maxCustomCombos: number;
  /** Whether banner advertisements are visible */
  showBannerAds: boolean;
  /** Whether advanced analytics (Punch & Evasion counters, calorie estimation) are unlocked */
  showAdvancedStats: boolean;
}

export type EntitlementTier = 'FREE' | 'PRO' | 'ULTIMATE';
export type TierLimits = EntitlementLimits;

export const ENTITLEMENT_TIERS: Record<EntitlementTier, EntitlementLimits> = {
  FREE: {
    maxComboTokens: 20,
    maxCustomCombos: 5, // Registered member: 5 custom combos
    showBannerAds: true,
    showAdvancedStats: false,
  },
  PRO: {
    maxComboTokens: 40,
    maxCustomCombos: 20,
    showBannerAds: false,
    showAdvancedStats: false,
  },
  ULTIMATE: {
    maxComboTokens: 60,
    maxCustomCombos: 9999, // Unlimited
    showBannerAds: false,
    showAdvancedStats: true,
  },
};

/**
 * Resolves entitlement limits based on tier and guest status.
 * Guest (non-member) on FREE tier gets 1 custom combo.
 * Registered member on FREE tier gets 5 custom combos.
 */
export function getTierLimits(tier: EntitlementTier, isGuest: boolean = false): TierLimits {
  const base = ENTITLEMENT_TIERS[tier];
  if (tier === 'FREE' && isGuest) {
    return {
      ...base,
      maxCustomCombos: 1,
    };
  }
  return base;
}

/**
 * Calculates action token count for a skill or sequence.
 * Rest tokens ('-') do not count as strike action tokens.
 */
export function calculateSkillTokens(skill?: { sequence?: string[]; tokenCount?: number } | null): number {
  if (!skill) return 0;
  if (typeof skill.tokenCount === 'number' && skill.tokenCount > 0) {
    return skill.tokenCount;
  }
  if (!skill.sequence || skill.sequence.length === 0) return 1;
  const actionsOnly = skill.sequence.filter((item) => item !== '-' && item !== 'rest');
  return Math.max(1, actionsOnly.length);
}
