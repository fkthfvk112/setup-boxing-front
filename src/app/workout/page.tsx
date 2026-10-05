'use client';

import React, { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import ActiveWorkout from '../../components/ActiveWorkout';
import { addWorkoutLog, getAppSettings, getLastPlaylist } from '../../utils/webDb';
import { useI18n } from '../../hooks/useI18n';
import { ComboBlock } from '../../types/combo';
import { resolveActionDef } from '../../constants/BoxingActions';

function WorkoutContent() {
  const router = useRouter();
  const { t, language } = useI18n();
  const isKo = language === 'ko';

  const [blocks, setBlocks] = React.useState<ComboBlock[]>([]);
  const [playMode, setPlayMode] = React.useState<'sequential' | 'random'>('sequential');
  const [workoutTime, setWorkoutTime] = React.useState(180);
  const [restTime, setRestTime] = React.useState(30);
  const [setsCount, setSetsCount] = React.useState(3);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    async function init() {
      const settings = await getAppSettings();
      setWorkoutTime(settings.workoutTime);
      setRestTime(settings.restTime);
      setSetsCount(settings.setsCount);

      const playlist = await getLastPlaylist();
      if (playlist && playlist.items.length > 0) {
        setPlayMode(playlist.mode || 'sequential');
        const comboBlocks: ComboBlock[] = playlist.items.map((s, idx) => ({
          id: `${s.presetId || s.id}-${idx}`,
          name: isKo ? s.name : s.nameEn || s.name,
          category: s.category === 'basic' ? 'basic' : 'combination',
          pattern: s.sequence.join('.'),
          actionIds: s.sequence.map((step) => resolveActionDef(step).id),
          defaultStepDurationMs:
            s.durationMs && s.sequence.length > 0
              ? Math.max(300, Math.round(s.durationMs / s.sequence.length))
              : 700,
        }));
        setBlocks(comboBlocks);
      }
      setReady(true);
    }
    init();
  }, [isKo]);

  if (!ready) {
    return <div className="p-8 text-center text-slate-400">Loading workout...</div>;
  }

  const handleWorkoutComplete = async (setsCompleted: number, durationSeconds: number) => {
    const routineName =
      blocks.length > 0 ? t('comboRoutineWorkout') : t('freeWorkoutStart');
    return await addWorkoutLog(
      null,
      setsCompleted,
      durationSeconds,
      routineName
    );
  };

  return (
    <ActiveWorkout
      workoutTime={workoutTime}
      restTime={restTime}
      setsCount={setsCount}
      blocks={blocks}
      playMode={playMode}
      onClose={() => router.back()}
      onComplete={handleWorkoutComplete}
    />
  );
}

export default function WorkoutPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading workout session...</div>}>
      <WorkoutContent />
    </Suspense>
  );
}
