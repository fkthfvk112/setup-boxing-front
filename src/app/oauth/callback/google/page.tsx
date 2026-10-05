'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAtom } from 'jotai';
import { loginActionAtom } from '../../../../stores/authAtom';
import { authApi } from '../../../../lib/api/authApi';
import { Loader2 } from 'lucide-react';
import { showAlert } from '../../../../utils/swal';

import { useI18n } from '../../../../hooks/useI18n';

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, loginAction] = useAtom(loginActionAtom);
  const { t, language } = useI18n();
  const isKo = language === 'ko';
  const isHandlingRef = React.useRef(false);

  useEffect(() => {
    async function handleCallback() {
      if (typeof window === 'undefined') return;
      if (isHandlingRef.current) return;

      const code = searchParams.get('code');
      const error = searchParams.get('error');
      const hash = window.location.hash;
      const hashParams = new URLSearchParams(hash.replace('#', '?'));
      const idToken = hashParams.get('id_token') || hashParams.get('access_token') || searchParams.get('id_token');

      if (error) {
        console.error('Google OAuth error param:', error, searchParams.get('error_description'));
        await showAlert(isKo ? '오류' : 'Error', isKo ? '에러가 발생하였습니다.' : 'An error occurred.', 'error');
        router.push('/');
        return;
      }

      if (!code && !idToken) {
        await showAlert(isKo ? '오류' : 'Error', isKo ? '에러가 발생하였습니다.' : 'An error occurred.', 'error');
        router.push('/');
        return;
      }

      isHandlingRef.current = true;

      try {
        const redirectUri = `${window.location.origin}/oauth/callback/google`;
        const res = await authApi.loginWithGoogle({
          code: code || undefined,
          idToken: idToken || undefined,
          redirectUri,
        });

        if (res.data && res.data.accessToken) {
          localStorage.setItem('boxing_access_token', res.data.accessToken);
          if (res.data.user) {
            localStorage.setItem('boxing_user', JSON.stringify(res.data.user));
          }
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
        console.error('Google Login error:', err);
        const errorMsg = err?.response?.data?.message || err?.message || (isKo ? '에러가 발생하였습니다.' : 'An error occurred.');
        await showAlert(t('error'), errorMsg, 'error');
        router.push('/');
      }
    }
    handleCallback();
  }, [isKo, loginAction, router, searchParams, t]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center">
      <Loader2 className="w-10 h-10 text-[#FF2E54] animate-spin" />
      <h3 className="text-base font-bold text-white">
        {t('processingGoogleLogin')}
      </h3>
      <p className="text-xs text-[#94A3B8]">
        {t('pleaseWait')}
      </p>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <React.Suspense fallback={<div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center"><Loader2 className="w-10 h-10 text-[#FF2E54] animate-spin" /></div>}>
      <GoogleCallbackContent />
    </React.Suspense>
  );
}
