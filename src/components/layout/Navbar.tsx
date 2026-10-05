'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Flame, Layers, Calendar, Crown, User, LogOut } from 'lucide-react';
import { useEntitlements } from '../../context/EntitlementContext';
import { useI18n } from '../../hooks/useI18n';

export default function Navbar() {
  const pathname = usePathname();
  const { t, language, setLanguage } = useI18n();
  const { tier, openPaywall, isAuthenticated, user, logout } = useEntitlements();

  const navItems = [
    { href: '/', label: t('tabHome'), icon: Flame },
    { href: '/routine-builder', label: t('tabRoutine'), icon: Layers },
    { href: '/history', label: t('tabHistory'), icon: Calendar },
  ];

  return (
    <header className="sticky top-0 z-40 bg-dark-card/90 backdrop-blur-md border-b border-dark-border px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-red to-brand-orange flex items-center justify-center shadow-lg shadow-brand-red/20 group-hover:scale-105 transition-transform">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white tracking-tight leading-none">
              BOXING<span className="text-brand-red">COACH</span>
            </h1>
            <p className="text-[10px] font-semibold text-slate-400 leading-tight">
              {t('appSubtitle')}
            </p>
          </div>
        </Link>

        {/* Navigation Links (Desktop/Tablet) */}
        <nav className="hidden md:flex items-center gap-1 bg-dark-bg p-1 rounded-xl border border-dark-border">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-brand-red text-white shadow-md shadow-brand-red/30'
                    : 'text-slate-400 hover:text-white hover:bg-dark-card'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions (PRO badge, Language switcher, Auth) */}
        <div className="flex items-center gap-2">
          {/* PRO / Upgrade Badge */}
          <button
            onClick={() => openPaywall('navbar_header')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black border transition-all ${
              tier === 'ULTIMATE'
                ? 'bg-brand-gold/15 border-brand-gold/40 text-brand-gold hover:bg-brand-gold/25'
                : tier === 'PRO'
                ? 'bg-brand-red/15 border-brand-red/40 text-brand-red hover:bg-brand-red/25'
                : 'bg-dark-cardElevated border-dark-border text-slate-300 hover:border-brand-gold/50'
            }`}
          >
            <Crown
              className={`w-3.5 h-3.5 ${
                tier === 'ULTIMATE'
                  ? 'text-brand-gold fill-brand-gold'
                  : tier === 'PRO'
                  ? 'text-brand-red fill-brand-red'
                  : 'text-slate-400'
              }`}
            />
            {tier === 'ULTIMATE' ? 'ULTIMATE' : tier === 'PRO' ? 'PRO' : t('upgradeToPro')}
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'ko' ? 'en' : 'ko')}
            className="px-2 py-1 rounded-lg bg-dark-cardElevated border border-dark-border text-xs font-bold text-slate-300 hover:text-white transition-colors"
          >
            {language === 'ko' ? '🇰🇷 KO' : '🇺🇸 EN'}
          </button>

          {/* User Auth Menu */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-dark-border">
              <span className="hidden sm:inline-block text-xs font-semibold text-slate-300">
                {user.userName || user.userId}
              </span>
              <button
                onClick={() => logout()}
                title={t('logout')}
                className="p-1.5 rounded-lg bg-dark-cardElevated border border-dark-border text-slate-400 hover:text-brand-red transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-red text-white text-xs font-bold hover:bg-brand-red/90 transition-colors shadow-md shadow-brand-red/20"
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('loginTitle').split(' ')[0]}</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
