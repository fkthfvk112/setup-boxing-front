'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import {
  EntitlementTier,
  getTierLimits,
  TierLimits,
} from '../constants/Entitlements';
import {
  accessTokenAtom,
  authStore,
  clearAuthSession,
  updateSessionUser,
  userProfileAtom,
} from '../stores/authAtom';
import { UserProfile } from '../types/combo';
import { getUserProfile, getUserTier, saveUserTier, UserProfileData } from '../utils/webDb';

interface EntitlementContextValue {
  tier: EntitlementTier;
  user: UserProfileData | null;
  isAuthenticated: boolean;
  authReady: boolean;
  isGuest: boolean;
  isPro: boolean;
  isUltimate: boolean;
  limits: TierLimits;
  isPaywallVisible: boolean;
  paywallReason: string | null;
  isAuthModalOpen: boolean;
  authModalReason: string | null;
  openPaywall: (reason?: string) => void;
  closePaywall: () => void;
  openAuthModal: (reason?: string) => void;
  closeAuthModal: () => void;
  setTier: (tier: EntitlementTier) => Promise<void>;
  refreshUser: () => Promise<void>;
  logout: () => void;
}

const EntitlementContext = createContext<EntitlementContextValue | null>(null);

function toUserProfileData(profile: UserProfile): UserProfileData {
  return {
    userId: String(profile.userId ?? profile.id ?? ''),
    email: String(profile.email ?? ''),
    userName: profile.userName || profile.nickname || '복서',
    provider: String(profile.provider || 'LOCAL'),
    tier: profile.tier || 'FREE',
  };
}

function toSessionUser(profile: UserProfileData, prev: UserProfile | null): UserProfile {
  return {
    id: prev?.id ?? (Number(profile.userId) || 0),
    userId: profile.userId,
    email: profile.email,
    userName: profile.userName,
    nickname: prev?.nickname,
    profileImageUrl: prev?.profileImageUrl,
    provider: profile.provider,
    tier: profile.tier,
    language: prev?.language,
    country: prev?.country,
    timezone: prev?.timezone,
  };
}

export function EntitlementProvider({ children }: { children: React.ReactNode }) {
  const accessToken = useAtomValue(accessTokenAtom);
  const sessionUser = useAtomValue(userProfileAtom);
  const [authReady, setAuthReady] = useState(false);
  const [guestTier, setGuestTier] = useState<EntitlementTier>('FREE');
  const [isPaywallVisible, setIsPaywallVisible] = useState(false);
  const [paywallReason, setPaywallReason] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalReason, setAuthModalReason] = useState<string | null>(null);

  const refreshUser = useCallback(async () => {
    const tokenAtStart = authStore.get(accessTokenAtom);
    if (!tokenAtStart) {
      setGuestTier(await getUserTier());
      return;
    }

    const profile = await getUserProfile();
    if (authStore.get(accessTokenAtom) !== tokenAtStart) return;
    if (!profile) return;

    updateSessionUser(toSessionUser(profile, authStore.get(userProfileAtom)));
  }, []);

  useEffect(() => {
    setAuthReady(true);
  }, []);

  useEffect(() => {
    if (!authReady) return;
    void refreshUser();
  }, [authReady, accessToken, refreshUser]);

  useEffect(() => {
    if (!accessToken) return;
    setIsAuthModalOpen(false);
    setAuthModalReason(null);
  }, [accessToken]);

  const openPaywall = useCallback((reason?: string) => {
    setPaywallReason(reason || null);
    setIsPaywallVisible(true);
  }, []);

  const closePaywall = useCallback(() => {
    setIsPaywallVisible(false);
    setPaywallReason(null);
  }, []);

  const openAuthModal = useCallback((reason?: string) => {
    setAuthModalReason(reason || null);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    setAuthModalReason(null);
  }, []);

  const setTier = useCallback(async (newTier: EntitlementTier) => {
    const token = authStore.get(accessTokenAtom);
    const current = authStore.get(userProfileAtom);
    if (token && current) {
      updateSessionUser({ ...current, tier: newTier });
    } else {
      setGuestTier(newTier);
    }
    await saveUserTier(newTier);
    await refreshUser();
  }, [refreshUser]);

  const logout = useCallback(() => {
    clearAuthSession();
    void getUserTier().then(setGuestTier);
  }, []);

  const user = useMemo(
    () => (authReady && accessToken && sessionUser ? toUserProfileData(sessionUser) : null),
    [authReady, accessToken, sessionUser]
  );
  const isAuthenticated = authReady && !!accessToken;
  const isGuest = !isAuthenticated;
  const tier: EntitlementTier = (authReady && accessToken && sessionUser?.tier) || guestTier;
  const isPro = tier === 'PRO' || tier === 'ULTIMATE';
  const isUltimate = tier === 'ULTIMATE';
  const limits = getTierLimits(tier, isGuest);

  return (
    <EntitlementContext.Provider
      value={{
        tier,
        user,
        isAuthenticated,
        authReady,
        isGuest,
        isPro,
        isUltimate,
        limits,
        isPaywallVisible,
        paywallReason,
        isAuthModalOpen,
        authModalReason,
        openPaywall,
        closePaywall,
        openAuthModal,
        closeAuthModal,
        setTier,
        refreshUser,
        logout,
      }}
    >
      {children}
    </EntitlementContext.Provider>
  );
}

export function useEntitlements() {
  const ctx = useContext(EntitlementContext);
  if (!ctx) {
    throw new Error('useEntitlements must be used within an EntitlementProvider');
  }
  return ctx;
}
