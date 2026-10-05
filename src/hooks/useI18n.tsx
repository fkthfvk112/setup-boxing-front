'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Language, translations, Translations } from '../i18n/translations';
import { getSavedLanguage, saveLanguageSetting } from '../utils/webDb';

export interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: keyof Translations, params?: Record<string, string | number>) => string;
  formatNumber: (value: number) => string;
  formatDate: (timestamp: number) => string;
  formatDuration: (seconds: number) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function detectDeviceLanguage(): Language {
  if (typeof window === 'undefined') return 'ko';
  try {
    const locale =
      Intl.DateTimeFormat().resolvedOptions().locale || navigator.language || '';
    if (locale.toLowerCase().startsWith('ko')) {
      return 'ko';
    }
  } catch {}
  return 'en';
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ko');

  useEffect(() => {
    getSavedLanguage().then((saved) => {
      if (saved) {
        setLanguageState(saved);
      } else {
        setLanguageState(detectDeviceLanguage());
      }
    });
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    void saveLanguageSetting(lang);
  }, []);

  const toggleLanguage = useCallback(() => {
    const next: Language = language === 'en' ? 'ko' : 'en';
    setLanguage(next);
  }, [language, setLanguage]);

  const t = useCallback(
    (key: keyof Translations, params?: Record<string, string | number>): string => {
      const dict = translations[language] || translations.ko;
      let text = (dict[key] ?? translations.ko[key] ?? key) as string;

      if (params) {
        Object.entries(params).forEach(([pKey, pVal]) => {
          text = text.replace(new RegExp(`\\{${pKey}\\}`, 'g'), String(pVal));
        });
      }
      return text;
    },
    [language]
  );

  const formatNumber = useCallback(
    (value: number): string => {
      try {
        return new Intl.NumberFormat(language === 'ko' ? 'ko-KR' : 'en-US').format(value);
      } catch {
        return value.toString();
      }
    },
    [language]
  );

  const formatDate = useCallback(
    (timestamp: number): string => {
      try {
        const date = new Date(timestamp);
        return new Intl.DateTimeFormat(language === 'ko' ? 'ko-KR' : 'en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).format(date);
      } catch {
        return new Date(timestamp).toLocaleString();
      }
    },
    [language]
  );

  const formatDuration = useCallback(
    (seconds: number): string => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      if (language === 'en') {
        if (mins === 0) return `${secs}s`;
        return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
      } else {
        if (mins === 0) return `${secs}초`;
        return secs > 0 ? `${mins}분 ${secs}초` : `${mins}분`;
      }
    },
    [language]
  );

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        formatNumber,
        formatDate,
        formatDuration,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextType {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return ctx;
}
