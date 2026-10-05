import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex-1 min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#15171E] border border-[#282C3A] rounded-2xl p-6 text-center shadow-xl">
        <h2 className="text-3xl font-black text-[#FF2E54] mb-2">404</h2>
        <p className="text-base font-bold text-white mb-2">페이지를 찾을 수 없습니다</p>
        <p className="text-xs text-[#94A3B8] mb-6">
          요청하신 페이지가 삭제되었거나 주소가 잘못되었습니다.
        </p>
        <Link
          href="/"
          className="inline-block w-full py-3 bg-[#FF2E54] hover:bg-[#E02646] text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-[#FF2E54]/20"
        >
          홈으로 이동
        </Link>
      </div>
    </div>
  );
}
