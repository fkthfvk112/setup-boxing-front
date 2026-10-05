import type { Metadata, Viewport } from 'next';
import React from 'react';
import './globals.css';
import Providers from './providers';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#0B0C10',
};

export const metadata: Metadata = {
  title: '복싱 코치 - 무료 라운드 타이머 & 커스텀 콤보 트레이닝',
  description:
    '샌드백과 쉐도우 복싱을 위한 맞춤형 음성 코칭 타이머. 나만의 콤보 루틴을 만들고 라운드별 훈련 기록을 무료로 관리하세요.',
  keywords: [
    '복싱',
    '복싱 타이머',
    '라운드 타이머',
    '샌드백 트레이닝',
    '쉐도우 복싱',
    '복싱 콤보',
    '복싱 코치',
    '홈트 복싱',
    'boxing timer',
    'round timer',
    'boxing coach',
    'boxing workout',
  ],
  authors: [{ name: 'Boxing Coach App' }],
  robots: 'index, follow',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.png', type: 'image/png' },
      { url: '/icon.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    title: '복싱 코치 - 무료 라운드 타이머 & 커스텀 콤보 트레이닝',
    description:
      '혼자서도 프로처럼! 샌드백과 쉐도우 복싱을 위한 음성 코칭 라운드 타이머 & 콤보 루틴 제작기',
    siteName: '복싱 코치 (Boxing Coach)',
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary_large_image',
    title: '복싱 코치 - 무료 라운드 타이머 & 콤보 트레이너',
    description:
      '샌드백 & 쉐도우 복싱을 위한 맞춤형 음성 코칭 타이머 및 콤보 제작소',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: '복싱 코치 - 무료 라운드 타이머 & 콤보 트레이너',
    alternateName: 'Boxing Coach - Round Timer & Combo Trainer',
    description:
      '샌드백, 쉐도우 복싱, 미트 트레이닝을 위한 스마트 음성 코칭 라운드 타이머 & 맞춤형 콤보 제작 서비스',
    applicationCategory: 'SportsApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'KRW',
    },
    featureList: [
      '스마트 라운드 타이머 (운동/휴식 시간 설정, 링 벨 사운드)',
      '실시간 복싱 콤보 음성 코칭',
      '나만의 커스텀 콤보 루틴 제작소',
      '운동 분석 및 칼로리 소모량 리포트',
      '화면 꺼짐 방지(Wake Lock) 지원',
    ],
  };

  return (
    <html lang="ko">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#050608] text-white min-h-screen flex justify-center selection:bg-[#FF2E54] selection:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
