'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { SkillInterface } from '../../types/combo';
import { useI18n } from '../../hooks/useI18n';

interface WorkbenchCardProps {
  item: SkillInterface;
  index: number;
  totalItems: number;
  isSelected: boolean;
  isCurrentlyPlaying?: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
}

export const WorkbenchCard: React.FC<WorkbenchCardProps> = ({
  item,
  index,
  totalItems,
  isSelected,
  isCurrentlyPlaying = false,
  onSelect,
  onRemove,
  onMoveLeft,
  onMoveRight,
}) => {
  const { t, language } = useI18n();
  const displayName = language === 'en' && item.nameEn ? item.nameEn : item.name;
  const isHighlighted = isSelected || isCurrentlyPlaying;
  const itemColor = item.color || '#FF2E54';

  return (
    <motion.div
      layout
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.85, opacity: 0 }}
      transition={{
        layout: { type: 'spring', stiffness: 450, damping: 30 },
        duration: 0.25,
      }}
      className="mr-3 my-1 w-[118px] shrink-0 select-none"
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        style={{
          borderColor: isHighlighted ? '#ffffff' : itemColor,
          backgroundColor: isHighlighted ? '#1D202A' : '#15171E',
          boxShadow: isHighlighted ? '0 4px 15px rgba(0,0,0,0.5)' : 'none',
        }}
        className={`w-[118px] h-[128px] rounded-xl p-2 border-2 flex flex-col justify-between cursor-pointer transition-all ${
          isHighlighted ? 'scale-105 z-10 border-[2.5px]' : 'hover:border-white/50'
        }`}
      >
        {/* Top Row: Type Badge + Slot Number + Delete */}
        <div className="flex items-center justify-between">
          <div
            style={{
              backgroundColor: isHighlighted ? 'rgba(255, 255, 255, 0.2)' : `${itemColor}26`,
              color: isHighlighted ? '#ffffff' : itemColor,
            }}
            className="px-1 py-0.5 rounded text-[9px] font-extrabold"
          >
            {item.isCombo ? t('comboBadgeCombo') : t('comboBadgeBasic')}
          </div>

          <div
            className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${
              isHighlighted
                ? 'border-white bg-white/20 text-white'
                : 'border-[#282C3A] bg-[#0B0C10] text-[#94a3b8]'
            }`}
          >
            #{index + 1}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="p-1 text-[#f87171] hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Center Area: Title & Sequence */}
        <div className="flex flex-col items-center justify-center my-1 text-center">
          <div
            className={`text-xs font-bold truncate max-w-[100px] mb-1 ${
              isHighlighted ? 'text-white font-extrabold' : 'text-[#f8fafc]'
            }`}
          >
            {displayName}
          </div>

          <div className="flex items-center justify-center flex-wrap gap-0.5">
            {item.sequence.slice(0, 4).map((seqToken, sIdx) => (
              <span
                key={sIdx}
                className={`px-1 py-0.5 rounded text-[10px] font-semibold ${
                  seqToken === '-'
                    ? 'bg-[#282C3A] text-[#94a3b8]'
                    : isHighlighted
                    ? 'bg-white/20 text-white'
                    : 'bg-[#1D202A] text-white'
                }`}
              >
                {seqToken}
              </span>
            ))}
            {item.sequence.length > 4 && (
              <span className={`text-[10px] ${isHighlighted ? 'text-white' : 'text-[#94a3b8]'}`}>...</span>
            )}
          </div>
        </div>

        {/* Bottom Row: Arrow Reorder Controls without text, clear divider */}
        <div
          className={`flex items-center justify-between rounded-lg py-1 px-1.5 border ${
            isHighlighted
              ? 'border-white/40 bg-[#1D202A]'
              : 'border-[#282C3A] bg-[#0B0C10]'
          }`}
        >
          <button
            type="button"
            disabled={index === 0}
            onClick={(e) => {
              e.stopPropagation();
              onMoveLeft();
            }}
            className={`flex-1 flex items-center justify-center py-0.5 rounded transition-colors ${
              index === 0
                ? 'opacity-20 cursor-not-allowed text-[#475569]'
                : 'text-[#94A3B8] hover:text-white hover:bg-white/10 active:scale-90'
            }`}
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          </button>

          <div className="w-[1.5px] h-3.5 bg-[#475569] mx-1 shrink-0" />

          <button
            type="button"
            disabled={index === totalItems - 1}
            onClick={(e) => {
              e.stopPropagation();
              onMoveRight();
            }}
            className={`flex-1 flex items-center justify-center py-0.5 rounded transition-colors ${
              index === totalItems - 1
                ? 'opacity-20 cursor-not-allowed text-[#475569]'
                : 'text-[#94A3B8] hover:text-white hover:bg-white/10 active:scale-90'
            }`}
          >
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default WorkbenchCard;
