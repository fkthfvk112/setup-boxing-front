'use client';

import React, { useState } from 'react';
import { Provider as JotaiProvider } from 'jotai';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nProvider } from '../hooks/useI18n';
import { EntitlementProvider } from '../context/EntitlementContext';
import BottomNav from '../components/layout/BottomNav';
import GlobalWorkoutOverlay from '../components/layout/GlobalWorkoutOverlay';
import PaywallModal from '../components/PaywallModal';
import FastAuthModal from '../components/auth/FastAuthModal';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <JotaiProvider>
      <QueryClientProvider client={queryClient}>
        <I18nProvider>
          <EntitlementProvider>
            <div className="w-full max-w-[1024px] min-h-screen bg-[#0B0C10] flex flex-col relative shadow-2xl md:border-x md:border-[#282C3A]/50">
              <main className="flex-1 flex flex-col pb-[60px]">
                {children}
              </main>
              <BottomNav />
              <GlobalWorkoutOverlay />
              <PaywallModal />
              <FastAuthModal />
            </div>
          </EntitlementProvider>
        </I18nProvider>
      </QueryClientProvider>
    </JotaiProvider>
  );
}
