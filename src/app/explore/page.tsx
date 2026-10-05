'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ExploreRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/history');
  }, [router]);
  return null;
}
