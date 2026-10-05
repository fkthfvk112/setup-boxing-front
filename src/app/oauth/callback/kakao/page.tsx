'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAtom } from 'jotai';
import { loginActionAtom } from '../../../../stores/authAtom';
import { authApi } from '../../../../lib/api/authApi';
import { Loader2 } from 'lucide-react';

import { showAlert } from '../../../../utils/swal';

import { useI18n } from '../../../../hooks/useI18n';

function KakaoCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const [, loginAction] = useAtom(loginActionAtom);
  const { t, language } = useI18n();
  const isKo = language === 'ko';
  const isHandlingRef = React.useRef(false);

  useEffect(() => {
    async function handleCallback() {
      if (!code || isHandlingRef.current) return;
      isHandlingRef.current = true;
      try {
        const redirectUri = window.location.origin + '/oauth/callback/kakao';
        const res = await authApi.loginWithKakao(code, redirectUri);
        if (res.data && res.data.accessToken) {
          loginAction({
            accessToken: res.data.accessToken,
            refreshToken: res.data.refreshToken,
            user: res.data.user,
          });
          await showAlert(
            t('loginSuccess'),
            t('welcomeUser', { name: res.data.user.userName || t('userMember') }),
            'success'
          );
          router.push('/');
        }
      } catch (err: any) {
        console.error('Kakao Login error:', err);
        await showAlert(t('error'), err?.message || (isKo ? '카카오 로그인 처리에 실패했습니다.' : 'Failed to process Kakao login.'), 'error');
        router.push('/login');
      }
    }
    handleCallback();
  }, [code, isKo, loginAction, router, t]);

  return (
    <div className="flex flex-col items-center justify-center my-24 space-y-4 text-center">
      <Loader2 className="w-10 h-10 text-brand-red animate-spin" />
      <h3 className="text-base font-bold text-white">
        {t('processingKakaoLogin')}
      </h3>
      <p className="text-xs text-[#94A3B8]">
        {t('pleaseWait')}
      </p>
    </div>
  );
}

export default function KakaoCallbackPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Processing Kakao login...</div>}>
      <KakaoCallbackContent />
    </Suspense>
  );
}
