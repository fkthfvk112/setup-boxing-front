'use client';

import React from 'react';
import { Volume2, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { ComboBlock } from '../../types/combo';
import { parsePatternToActions, calculateComboDuration } from '../../utils/comboParser';
import { ActionBadge } from './ActionBadge';

interface ComboBlockCardProps {
  block: ComboBlock;
  isActive?: boolean;
  activeStepIndex?: number;
  onPreview?: () => void;
  onAdd?: () => void;
  onDelete?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  mode?: 'palette' | 'routine-item';
}

export const ComboBlockCard: React.FC<ComboBlockCardProps> = ({
  block,
  isActive = false,
  activeStepIndex = -1,
  onPreview,
  onAdd,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst = false,
  isLast = false,
  mode = 'routine-item',
}) => {
  const actions = parsePatternToActions(block.pattern);
  const duration = calculateComboDuration(block.pattern, block.defaultStepDurationMs);

  return (
    <div
      className={`rounded-xl p-3 mb-2.5 border transition-all ${
        isActive
          ? 'bg-[#1D202A] border-[#FF2E54] shadow-lg shadow-[#FF2E54]/20'
          : 'bg-[#15171E] border-[#282C3A]'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center flex-1 mr-2">
          <span
            className={`text-[15px] font-bold mr-2 ${
              isActive ? 'text-white' : 'text-[#f8fafc]'
            }`}
          >
            {block.name}
          </span>
          <div className="bg-[#0B0C10] px-1.5 py-0.5 rounded-md border border-[#282C3A] text-[11px] font-semibold text-[#94a3b8]">
            {duration.totalSeconds}초
          </div>
        </div>

        <div className="flex items-center gap-1">
          {onPreview && (
            <button
              type="button"
              onClick={onPreview}
              className="p-1.5 rounded-lg bg-[#1D202A] text-white hover:text-cyan-400"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          )}

          {mode === 'palette' && onAdd && (
            <button
              type="button"
              onClick={onAdd}
              className="p-1.5 rounded-lg bg-[#282C3A] text-white hover:bg-white hover:text-black transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}

          {mode === 'routine-item' && (
            <div className="flex items-center gap-1">
              {onMoveUp && !isFirst && (
                <button
                  type="button"
                  onClick={onMoveUp}
                  className="p-1 rounded-md bg-[#1D202A] text-[#94a3b8] hover:text-white"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
              )}
              {onMoveDown && !isLast && (
                <button
                  type="button"
                  onClick={onMoveDown}
                  className="p-1 rounded-md bg-[#1D202A] text-[#94a3b8] hover:text-white"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={onDelete}
                  className="p-1 rounded-md bg-red-500/15 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sequence Badges */}
      <div className="flex flex-wrap items-center mt-1">
        {actions.map((action, idx) => (
          <ActionBadge
            key={`${action.id}-${idx}`}
            action={action}
            isActive={isActive && activeStepIndex === idx}
            size="sm"
          />
        ))}
      </div>

      {block.description ? (
        <p className="text-[#64748b] text-[11px] mt-1.5 truncate">
          {block.description}
        </p>
      ) : null}
    </div>
  );
};

export default ComboBlockCard;
