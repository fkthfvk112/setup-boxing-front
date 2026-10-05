'use client';

import React from 'react';
import { useGlobalWorkout, workoutGlobal } from '../../utils/workoutGlobal';
import ActiveWorkout from '../ActiveWorkout';
import { addWorkoutLog } from '../../utils/webDb';
import { useI18n } from '../../hooks/useI18n';

export default function GlobalWorkoutOverlay() {
  const globalWorkout = useGlobalWorkout();
  const { t } = useI18n();

  if (!globalWorkout.isActive) {
    return null;
  }

  const handleWorkoutComplete = async (setsCompleted: number, durationSeconds: number) => {
    const routineName =
      globalWorkout.badgeName ||
      (globalWorkout.blocks && globalWorkout.blocks.length > 0 ? t('comboRoutineWorkout') : t('freeWorkoutStart'));
    return await addWorkoutLog(
      globalWorkout.badgeId || null,
      setsCompleted,
      durationSeconds,
      routineName
    );
  };

  return (
    <ActiveWorkout
      badgeId={globalWorkout.badgeId}
      badgeName={globalWorkout.badgeName}
      workoutTime={globalWorkout.workoutTime}
      restTime={globalWorkout.restTime}
      setsCount={globalWorkout.setsCount}
      blocks={globalWorkout.blocks}
      playMode={globalWorkout.playMode}
      stepDurationMs={globalWorkout.stepDurationMs}
      onClose={() => workoutGlobal.stop()}
      onComplete={handleWorkoutComplete}
    />
  );
}
