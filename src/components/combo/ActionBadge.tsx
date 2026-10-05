'use client';

import React from 'react';
import { BoxingActionDef } from '../../types/combo';
import { useI18n } from '../../hooks/useI18n';

interface ActionBadgeProps {
  action: BoxingActionDef;
  isActive?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ActionBadge: React.FC<ActionBadgeProps> = ({
  action,
  isActive = false,
  size = 'md',
}) => {
  const { t, language } = useI18n();
  const isRest = action.isRest;
  const badgeColor = action.badgeColor || '#94a3b8';

  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-[11px] min-w-[32px]',
    md: 'px-2.5 py-1 text-[13px] min-w-[44px]',
    lg: 'px-4 py-2 text-[18px] min-w-[64px]',
  }[size];

  const displayText = isRest
    ? t('restBeat')
    : language === 'en'
    ? action.nameEn || action.code
    : action.spokenText || action.nameKo;

  return (
    <div
      style={{
        borderColor: isActive ? '#FF2E54' : isRest ? '#282C3A' : badgeColor,
        backgroundColor: isActive
          ? '#FF2E54'
          : isRest
          ? '#1D202A'
          : `${badgeColor}22`,
        boxShadow: isActive ? '0 0 10px #FF2E54' : 'none',
      }}
      className={`inline-flex items-center justify-center rounded-lg border-[1.5px] mr-1.5 my-0.5 select-none transition-all duration-150 ${sizeClasses}`}
    >
      <span
        style={{
          color: isActive ? '#ffffff' : isRest ? '#64748b' : '#f8fafc',
          fontWeight: isActive ? 700 : 600,
        }}
        className="tracking-tight whitespace-nowrap"
      >
        {displayText}
      </span>
    </div>
  );
};

export default ActionBadge;
