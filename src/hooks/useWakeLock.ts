import { useEffect, useRef } from 'react';

export function useWakeLock(isActive: boolean) {
  const wakeLockRef = useRef<any>(null);

  useEffect(() => {
    async function requestWakeLock() {
      if (typeof window !== 'undefined' && 'wakeLock' in navigator && isActive) {
        try {
          wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
        } catch (err) {
          console.warn('Wake Lock request failed:', err);
        }
      }
    }

    if (isActive) {
      requestWakeLock();
    } else if (wakeLockRef.current) {
      wakeLockRef.current.release().catch(() => {});
      wakeLockRef.current = null;
    }

    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {});
        wakeLockRef.current = null;
      }
    };
  }, [isActive]);
}
