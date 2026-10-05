'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '../../hooks/useI18n';
import { useEntitlements } from '../../context/EntitlementContext';
import { showAlert } from '../../utils/swal';
import LegalModal, { LegalModalType } from '../../components/legal/LegalModal';

function GoogleIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

function KakaoIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3C6.477 3 2 6.477 2 10.765c0 2.766 1.87 5.184 4.697 6.524l-1.19 4.382c-.105.388.334.698.647.492l5.215-3.453c.207.014.417.02.631.02 5.523 0 10-3.477 10-7.965C22 6.477 17.523 3 12 3z" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { t, language } = useI18n();
  const { isAuthenticated, authReady } = useEntitlements();
  const isKo = language === 'ko';
  const [legalModal, setLegalModal] = useState<{ isOpen: boolean; type: LegalModalType }>({
    isOpen: false,
    type: 'terms',
  });

  useEffect(() => {
    if (authReady && isAuthenticated) {
      router.replace('/');
    }
  }, [authReady, isAuthenticated, router]);

  const handleGoogleLogin = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) e.stopPropagation();
    const clientId =
      process.env.NEXT_PUBLIC_BOX_GOOGLE_CLIENT_ID ||
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!clientId || clientId === 'your_google_client_id') {
      showAlert(isKo ? '오류' : 'Error', isKo ? '에러가 발생하였습니다.' : 'An error occurred.', 'error');
      return;
    }

    try {
      const REDIRECT_URI =
        typeof window !== 'undefined'
          ? `${window.location.origin}/oauth/callback/google`
          : 'http://localhost:3000/oauth/callback/google';
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
        REDIRECT_URI
      )}&response_type=code&scope=openid%20email%20profile&prompt=select_account`;
      
      window.location.href = googleAuthUrl;
    } catch {
      showAlert(isKo ? '오류' : 'Error', isKo ? '에러가 발생하였습니다.' : 'An error occurred.', 'error');
    }
  };

  const handleKakaoLogin = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) e.stopPropagation();
    const clientId =
      process.env.NEXT_PUBLIC_BOX_KAKAO_CLIENT_ID ||
      process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;

    if (!clientId || clientId === 'your_kakao_client_id') {
      showAlert(isKo ? '오류' : 'Error', isKo ? '에러가 발생하였습니다.' : 'An error occurred.', 'error');
      return;
    }

    try {
      const REDIRECT_URI =
        typeof window !== 'undefined'
          ? `${window.location.origin}/oauth/callback/kakao`
          : 'http://localhost:3000/oauth/callback/kakao';
      const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
        REDIRECT_URI
      )}&response_type=code`;
      
      window.location.href = kakaoAuthUrl;
    } catch {
      showAlert(isKo ? '오류' : 'Error', isKo ? '에러가 발생하였습니다.' : 'An error occurred.', 'error');
    }
  };

  if (authReady && isAuthenticated) return null;

  return (
    <div className="max-w-md w-full mx-auto my-12 bg-[#15171E] border border-[#282C3A] rounded-3xl p-6 md:p-8 shadow-2xl text-center space-y-6">
      {/* Brand Icon */}
      <div className="w-16 h-16 mx-auto flex items-center justify-center">
        <img
          src="/icon.png"
          alt="Setup Boxing"
          className="w-14 h-14 rounded-2xl shadow-xl shadow-red-500/20 border border-[#282C3A] object-cover"
        />
      </div>

      <div>
        <h2 className="text-xl font-black text-white">{t('loginTitle')}</h2>
        <p className="text-xs text-[#94A3B8] mt-1">{t('loginSubtitle')}</p>
      </div>

      {/* Social Login Buttons */}
      <div className="space-y-3 pt-2">
        <button
          type="button"
          onClick={handleGoogleLogin}
          onTouchEnd={handleGoogleLogin}
          style={{ touchAction: 'manipulation' }}
          className="w-full py-3.5 px-4 rounded-xl bg-white text-[#1f2937] font-bold text-xs flex items-center justify-center gap-2.5 hover:bg-slate-100 active:bg-slate-200 transition-all shadow-md border border-slate-300 cursor-pointer active:scale-95 pointer-events-auto"
        >
          <GoogleIcon className="w-4 h-4 shrink-0 pointer-events-none" />
          <span className="pointer-events-none">{isKo ? '구글로 시작하기' : 'Continue with Google'}</span>
        </button>

        {/* {isKo && (
          <button
            type="button"
            onClick={handleKakaoLogin}
            onTouchEnd={handleKakaoLogin}
            style={{ touchAction: 'manipulation' }}
            className="w-full py-3.5 px-4 rounded-xl bg-[#FEE500] text-[#191919] font-black text-xs flex items-center justify-center gap-2.5 hover:bg-[#FADA0A] active:bg-[#e5cf00] transition-all shadow-md cursor-pointer active:scale-95 pointer-events-auto"
          >
            <KakaoIcon className="w-4 h-4 shrink-0 text-[#191919] pointer-events-none" />
            <span className="pointer-events-none">{isKo ? '카카오로 시작하기' : 'Continue with Kakao'}</span>
          </button>
        )} */}
      </div>

      <div className="text-[11px] text-[#64748B] pt-4 border-t border-[#282C3A] leading-relaxed">
        {isKo ? (
          <p>
            로그인 시{' '}
            <button
              type="button"
              onClick={() => setLegalModal({ isOpen: true, type: 'terms' })}
              className="text-[#94A3B8] underline hover:text-white transition-colors cursor-pointer"
            >
              서비스 이용약관
            </button>
            {' '}및{' '}
            <button
              type="button"
              onClick={() => setLegalModal({ isOpen: true, type: 'privacy' })}
              className="text-[#94A3B8] underline hover:text-white transition-colors cursor-pointer"
            >
              개인정보 처리방침
            </button>
            에 동의하게 됩니다.
          </p>
        ) : (
          <p>
            By logging in, you agree to our{' '}
            <button
              type="button"
              onClick={() => setLegalModal({ isOpen: true, type: 'terms' })}
              className="text-[#94A3B8] underline hover:text-white transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            {' '}&amp;{' '}
            <button
              type="button"
              onClick={() => setLegalModal({ isOpen: true, type: 'privacy' })}
              className="text-[#94A3B8] underline hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            .
          </p>
        )}
      </div>

      {/* Legal Modal Popup */}
      <LegalModal
        isOpen={legalModal.isOpen}
        type={legalModal.type}
        onClose={() => setLegalModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
