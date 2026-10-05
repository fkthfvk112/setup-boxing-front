'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Calendar, Flame, Layers, User } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useI18n();

  const navItems = [
    {
      href: '/',
      label: t('tabHome'),
      icon: Flame,
      isActive: pathname === '/',
    },
    {
      href: '/routine-builder',
      label: t('tabRoutine'),
      icon: Layers,
      isActive: pathname === '/routine-builder',
    },
    {
      href: '/history',
      label: t('tabHistory'),
      icon: Calendar,
      isActive: pathname === '/history' || pathname === '/explore',
    },
    {
      href: '/profile',
      label: t('tabProfile'),
      icon: User,
      isActive: pathname === '/profile' || pathname === '/login',
    },
  ];

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    if (pathname === href) return;
    router.push(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#15171E] border-t border-[#222634] max-w-[1024px] mx-auto h-[60px] flex items-center justify-around select-none md:border-x md:border-[#222634]">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={(e) => handleNavClick(e, item.href)}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors cursor-pointer ${
              item.isActive ? 'text-white' : 'text-[#64748B] hover:text-slate-300'
            }`}
          >
            <Icon className={`w-5 h-5 ${item.isActive ? 'text-white stroke-[2.2]' : 'text-[#64748B]'}`} />
            <span
              className={`text-[12px] mt-1 font-bold tracking-tight ${
                item.isActive ? 'text-white' : 'text-[#64748B]'
              }`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
