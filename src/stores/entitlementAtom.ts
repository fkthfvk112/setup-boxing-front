import { atom } from 'jotai';
import { ENTITLEMENT_TIERS, EntitlementLimits, EntitlementTier } from '../constants/Entitlements';

const getInitialTier = (): EntitlementTier => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('boxing_user_tier');
    if (saved === 'PRO' || saved === 'ULTIMATE' || saved === 'FREE') {
      return saved;
    }
  }
  return 'FREE';
};

export const tierAtom = atom<EntitlementTier>(getInitialTier());
export const isPaywallVisibleAtom = atom<boolean>(false);
export const paywallReasonAtom = atom<string | null>(null);

export const limitsAtom = atom<EntitlementLimits>((get) => {
  const tier = get(tierAtom);
  return ENTITLEMENT_TIERS[tier] || ENTITLEMENT_TIERS.FREE;
});
