'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ko">
      <body className="bg-[#0B0C10] text-white min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#15171E] border border-[#282C3A] rounded-2xl p-6 text-center shadow-xl">
          <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            !
          </div>
          <h2 className="text-lg font-bold text-white mb-2">오류가 발생했습니다</h2>
          <p className="text-xs text-[#94A3B8] mb-6 leading-relaxed">
            {error?.message || '일시적인 네트워크 또는 렌더링 오류가 발생했습니다.'}
          </p>
          <button
            onClick={() => reset()}
            className="w-full py-3 bg-[#FF2E54] hover:bg-[#E02646] text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-[#FF2E54]/20"
          >
            다시 시도하기
          </button>
        </div>
      </body>
    </html>
  );
}
