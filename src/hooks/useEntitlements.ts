import { useAtom } from 'jotai';
import { isPaywallVisibleAtom, limitsAtom, paywallReasonAtom, tierAtom } from '../stores/entitlementAtom';
import { EntitlementTier } from '../constants/Entitlements';
import { authApi } from '../lib/api/authApi';
import { useAtomValue } from 'jotai';
import { isAuthenticatedAtom } from '../stores/authAtom';

export function useEntitlements() {
  const [tier, setTierState] = useAtom(tierAtom);
  const [isPaywallVisible, setIsPaywallVisible] = useAtom(isPaywallVisibleAtom);
  const [paywallReason, setPaywallReason] = useAtom(paywallReasonAtom);
  const limits = useAtomValue(limitsAtom);
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);

  const setTier = async (newTier: EntitlementTier) => {
    setTierState(newTier);
    if (typeof window !== 'undefined') {
      localStorage.setItem('boxing_user_tier', newTier);
    }
    if (isAuthenticated) {
      try {
        await authApi.updateTier(newTier);
      } catch (e) {
        console.warn('Failed to sync tier to backend:', e);
      }
    }
  };

  const openPaywall = (reason?: string) => {
    setPaywallReason(reason || null);
    setIsPaywallVisible(true);
  };

  const closePaywall = () => {
    setIsPaywallVisible(false);
    setPaywallReason(null);
  };

  const isPro = tier === 'PRO' || tier === 'ULTIMATE';
  const isUltimate = tier === 'ULTIMATE';

  return {
    tier,
    isPro,
    isUltimate,
    limits,
    setTier,
    isPaywallVisible,
    paywallReason,
    openPaywall,
    closePaywall,
    isAuthenticated,
  };
}
