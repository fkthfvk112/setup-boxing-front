'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  EntitlementTier,
  getTierLimits,
  TierLimits,
} from '../constants/Entitlements';
import { getUserProfile, UserProfileData, getUserTier, saveUserTier } from '../utils/webDb';

interface EntitlementContextValue {
  tier: EntitlementTier;
  user: UserProfileData | null;
  isAuthenticated: boolean;
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
}

const EntitlementContext = createContext<EntitlementContextValue | null>(null);

export function EntitlementProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfileData | null>(null);
  const [tier, setTierState] = useState<EntitlementTier>('FREE');
  const [isPaywallVisible, setIsPaywallVisible] = useState(false);
  const [paywallReason, setPaywallReason] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalReason, setAuthModalReason] = useState<string | null>(null);

  const refreshUser = useCallback(async () => {
    try {
      const userProf = await getUserProfile();
      if (userProf) {
        setUser(userProf);
        setTierState(userProf.tier);
        return;
      }
    } catch {}

    setUser(null);
    const savedTier = await getUserTier();
    setTierState(savedTier);
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

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
    setTierState(newTier);
    await saveUserTier(newTier);
    await refreshUser();
  }, [refreshUser]);

  const isAuthenticated = user !== null;
  const isGuest = !isAuthenticated;
  const isPro = tier === 'PRO' || tier === 'ULTIMATE';
  const isUltimate = tier === 'ULTIMATE';
  const limits = getTierLimits(tier, isGuest);

  return (
    <EntitlementContext.Provider
      value={{
        tier,
        user,
        isAuthenticated,
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
