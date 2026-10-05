'use client';

import React, { useMemo } from 'react';
import { Clock, Play, Square, Trash2 } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';
import { SkillInterface } from '../../types/combo';
import { calculateComboDuration, DEFAULT_STEP_DURATION_MS } from '../../utils/comboParser';

interface VideoTimelineBarProps {
  items: SkillInterface[];
  selectedIndex: number | null;
  onSelectIndex: (index: number) => void;
  onBackgroundPress?: () => void;
  onRemoveIndex?: (index: number) => void;
  isPlaying: boolean;
  activeItemIndex?: number;
  stepDurationMs?: number;
  onPlayFull?: () => void;
}

export const VideoTimelineBar: React.FC<VideoTimelineBarProps> = ({
  items,
  selectedIndex,
  onSelectIndex,
  onBackgroundPress,
  onRemoveIndex,
  isPlaying,
  activeItemIndex = 0,
  stepDurationMs = DEFAULT_STEP_DURATION_MS,
  onPlayFull,
}) => {
  const { t, language } = useI18n();

  const timelineData = useMemo(() => {
    let accumulatedMs = 0;
    let totalStrikesCount = 0;

    const segments = items.map((item, idx) => {
      const patternStr = item.sequence.join('.');
      const comboInfo = calculateComboDuration(patternStr, stepDurationMs);

      const startMs = accumulatedMs;
      accumulatedMs += comboInfo.totalDurationMs;
      totalStrikesCount += comboInfo.strikeCount;

      return {
        item,
        index: idx,
        startMs,
        endMs: accumulatedMs,
        durationMs: comboInfo.totalDurationMs,
        durationSec: comboInfo.totalSeconds,
        tokenCount: comboInfo.tokenCount,
        color: item.color || '#38bdf8',
      };
    });

    return {
      segments,
      totalMs: accumulatedMs,
      totalSec: Number((accumulatedMs / 1000).toFixed(1)),
      totalStrikesCount,
      totalBeatsCount: items.reduce((acc, it) => acc + it.sequence.length, 0),
    };
  }, [items, stepDurationMs]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div
      onClick={onBackgroundPress}
      className="w-full bg-[#15171E] rounded-xl p-3 border border-[#282C3A] select-none"
    >
      {/* 1. Header Bar: Duration & Play Button */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-white" />
          <div className="bg-[#0B0C10] px-2 py-0.5 rounded text-[11px] font-bold text-white border border-[#282C3A]">
            {timelineData.totalSec}s
          </div>
        </div>

        {onPlayFull && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPlayFull();
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              isPlaying
                ? 'bg-red-500 text-white'
                : 'bg-[#FF2E54] text-white hover:bg-red-600 shadow-md shadow-red-500/20'
            }`}
          >
            {isPlaying ? (
              <>
                <Square className="w-3 h-3 fill-current" />
                <span>{t('stopPreview')}</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current" />
                <span>{t('playAllCombo')}</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* 2. Track Container */}
      <div className="bg-[#0B0C10] rounded-lg p-2 border border-[#282C3A]">
        {/* Ruler ticks */}
        <div className="flex items-center gap-2 overflow-x-hidden text-[9px] text-[#64748B] mb-1 pl-1">
          <span>0.0s</span>
          {timelineData.segments.map((seg) => (
            <span key={seg.index} className="ml-auto">
              {(seg.endMs / 1000).toFixed(1)}s
            </span>
          ))}
        </div>

        {/* Segments Row */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-1">
          {timelineData.segments.map((seg) => {
            const isSelected = selectedIndex === seg.index;
            const isActivePlaying = isPlaying && activeItemIndex === seg.index;
            const segmentDisplayName =
              language === 'en' && seg.item.nameEn ? seg.item.nameEn : seg.item.name;
            const calculatedWidth = Math.max(65, seg.tokenCount * 28);

            return (
              <div
                key={seg.index}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectIndex(seg.index);
                }}
                style={{
                  width: `${calculatedWidth}px`,
                  backgroundColor: `${seg.color}28`,
                  borderColor: isSelected || isActivePlaying ? '#ffffff' : seg.color,
                  borderWidth: isSelected || isActivePlaying ? '2px' : '1.5px',
                }}
                className={`h-9 rounded-md px-1.5 py-0.5 flex flex-col justify-between shrink-0 cursor-pointer transition-all ${
                  isSelected || isActivePlaying ? 'ring-2 ring-white/50' : 'opacity-85 hover:opacity-100'
                }`}
              >
                <div className="text-[10px] font-bold text-white truncate max-w-full">
                  {segmentDisplayName}
                </div>
                <div className="text-[9px] font-semibold text-[#94a3b8] self-end">
                  {seg.durationSec}s
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VideoTimelineBar;
