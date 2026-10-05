'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Flame, 
  Volume2, 
  Clock, 
  Layers, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Award,
  ArrowRight
} from 'lucide-react';
import { useI18n } from '../hooks/useI18n';

export default function OnboardingGuide() {
  const { language } = useI18n();
  const isKo = language === 'ko';

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqs = isKo
    ? [
        {
          q: '회원가입 없이도 바로 타이머와 훈련을 쓸 수 있나요?',
          a: '네! 별도의 가입이나 설치 없이 즉시 라운드 타이머, 프리셋 콤보 선택, 자유 훈련을 무료로 이용하실 수 있습니다.',
        },
        {
          q: '스마트폰으로 운동할 때 화면이 꺼지지 않나요?',
          a: '네, 화면 꺼짐 방지(Wake Lock) 기술이 기본 내장되어 있어 운동하는 동안 화면이 꺼지지 않고 타이머와 음성이 계속 유지됩니다.',
        },
        {
          q: '나만의 커스텀 콤보를 만들 수 있나요?',
          a: '[콤보 루틴 제작소]에서 잽(1), 스트레이트(2), 훅(3), 어퍼컷(5), 바디샷 등을 조합하여 나만의 시퀀스를 자유롭게 만들고 재생할 수 있습니다.',
        },
        {
          q: '소셜 로그인(카카오/구글)을 하면 어떤 점이 좋나요?',
          a: '로그인 시 내가 만든 커스텀 콤보와 매일의 운동 기록이 클라우드 DB에 안전하게 동기화되어 모바일, 태블릿, PC 어디서든 동일하게 관리할 수 있습니다.',
        },
      ]
    : [
        {
          q: 'Can I start workout immediately without signing up?',
          a: 'Yes! You can use the round timer, preset combinations, and workouts right away for free without signing up.',
        },
        {
          q: 'Does the screen stay on during workouts on mobile?',
          a: 'Yes, Screen Wake Lock is integrated so your device screen will stay awake with voice guidance during entire rounds.',
        },
        {
          q: 'Can I build custom boxing combinations?',
          a: 'Yes! In the Routine Builder, you can mix and match Jab(1), Straight(2), Hook(3), Uppercut(5), and Body shots to craft your own workout routines.',
        },
        {
          q: 'Why should I log in with Google?',
          a: 'Signing in allows your custom routines and daily workout analytics to sync safely across all your devices in real-time.',
        },
      ];

  const features = isKo
    ? [
        {
          icon: <Clock className="w-5 h-5 text-red-400" />,
          title: '스마트 라운드 타이머',
          desc: '3분 운동 / 30초 휴식 / 세트 수 자유 설정 및 실제 링 종소리 사운드 지원',
        },
        {
          icon: <Volume2 className="w-5 h-5 text-cyan-400" />,
          title: '실시간 음성 코칭',
          desc: '실제 코치가 옆에서 지시하듯 정확한 박자와 콤보 음성 콜아웃 제공',
        },
        {
          icon: <Layers className="w-5 h-5 text-amber-400" />,
          title: '맞춤형 콤보 제작소',
          desc: '기본기부터 고급 콤비네이션까지 나만의 샌드백/쉐도우 루틴 커스텀',
        },
        {
          icon: <Flame className="w-5 h-5 text-emerald-400" />,
          title: '운동 기록 & 칼로리 리포트',
          desc: '라운드 수, 소모 칼로리, 훈련 시간을 자동으로 분석하고 누적 통계 제공',
        },
      ]
    : [
        {
          icon: <Clock className="w-5 h-5 text-red-400" />,
          title: 'Smart Round Timer',
          desc: 'Customizable work/rest intervals, sets count, and authentic bell sounds.',
        },
        {
          icon: <Volume2 className="w-5 h-5 text-cyan-400" />,
          title: 'Real-time Voice Coach',
          desc: 'High-clarity audio callouts guide your strikes exactly on tempo.',
        },
        {
          icon: <Layers className="w-5 h-5 text-amber-400" />,
          title: 'Custom Combo Builder',
          desc: 'Create personalized routines combining jabs, hooks, uppercuts, and defense.',
        },
        {
          icon: <Flame className="w-5 h-5 text-emerald-400" />,
          title: 'Workout Log & Calories',
          desc: 'Track completed rounds, workout duration, and estimated calories burned.',
        },
      ];

  return (
    <article className="mt-4 pt-4 border-t border-[#282C3A]/60 space-y-6 text-[#94A3B8]">
      {/* Onboarding SEO Hero Card */}
      <section className="bg-gradient-to-br from-[#15171E] via-[#101217] to-[#1a0f14] rounded-2xl p-4 sm:p-5 border border-[#282C3A] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF2E54]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-1.5 text-[#FF2E54] text-xs font-black tracking-wider uppercase mb-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isKo ? '스마트 AI 복싱 트레이너' : 'Smart Boxing Coach'}</span>
        </div>

        <h2 className="text-lg sm:text-xl font-black text-white leading-snug">
          {isKo ? (
            <>
              혼자서도 프로처럼! <br />
              <span className="text-[#FF2E54]">음성 코칭 복싱 라운드 타이머</span>
            </>
          ) : (
            <>
              Train Like a Champion. <br />
              <span className="text-[#FF2E54]">Voice-Guided Boxing Timer</span>
            </>
          )}
        </h2>

        <p className="text-xs sm:text-sm text-[#94A3B8] mt-2 leading-relaxed">
          {isKo
            ? '샌드백, 쉐도우 복싱, 미트 트레이닝을 위한 맞춤형 음성 코칭 타이머입니다. 나만의 콤보 루틴을 만들고 라운드별 훈련 기록을 관리하세요.'
            : 'Interactive audio round timer & combination generator tailored for heavy bag, shadow boxing, and pad workouts.'}
        </p>

        {/* Quick 3-Step Guide */}
        <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-3 gap-2 text-center">
          <div className="bg-[#0B0C10]/60 rounded-xl p-2 border border-white/5">
            <span className="inline-block w-5 h-5 rounded-full bg-[#FF2E54]/20 text-[#FF2E54] font-black text-[10px] leading-5 mb-1">
              1
            </span>
            <p className="text-[11px] font-bold text-white">
              {isKo ? '타이머 설정' : 'Set Timer'}
            </p>
            <p className="text-[9px] text-[#64748B] mt-0.5">
              {isKo ? '운동/휴식시간' : 'Work & Rest'}
            </p>
          </div>

          <div className="bg-[#0B0C10]/60 rounded-xl p-2 border border-white/5">
            <span className="inline-block w-5 h-5 rounded-full bg-cyan-400/20 text-cyan-400 font-black text-[10px] leading-5 mb-1">
              2
            </span>
            <p className="text-[11px] font-bold text-white">
              {isKo ? '콤보 선택' : 'Pick Combos'}
            </p>
            <p className="text-[9px] text-[#64748B] mt-0.5">
              {isKo ? '프리셋 또는 커스텀' : 'Presets & Custom'}
            </p>
          </div>

          <div className="bg-[#0B0C10]/60 rounded-xl p-2 border border-white/5">
            <span className="inline-block w-5 h-5 rounded-full bg-emerald-400/20 text-emerald-400 font-black text-[10px] leading-5 mb-1">
              3
            </span>
            <p className="text-[11px] font-bold text-white">
              {isKo ? '음성 훈련 시작' : 'Start Workout'}
            </p>
            <p className="text-[9px] text-[#64748B] mt-0.5">
              {isKo ? '사운드에 맞춰 펀치' : 'Punch to Audio'}
            </p>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="space-y-2.5">
        <h3 className="text-xs font-extrabold text-[#CBD5E1] uppercase tracking-wider px-1">
          {isKo ? '핵심 기능 안내' : 'Core Features'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-[#15171E] rounded-xl p-3 border border-[#282C3A] flex items-start gap-3 hover:border-white/20 transition-colors"
            >
              <div className="p-2 rounded-lg bg-[#0B0C10] border border-[#282C3A] shrink-0">
                {f.icon}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-white">{f.title}</h4>
                <p className="text-[11px] text-[#94A3B8] mt-0.5 leading-snug">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Routine Builder CTA */}
      <section className="bg-gradient-to-r from-cyan-950/40 via-[#15171E] to-[#15171E] rounded-2xl p-4 border border-cyan-800/40 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black text-white flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>{isKo ? '나만의 콤보 루틴 만들기' : 'Craft Your Custom Routine'}</span>
          </h3>
          <p className="text-[11px] text-[#94A3B8] mt-0.5">
            {isKo
              ? '원투, 바디훅, 더킹 카운터 시퀀스를 직접 조립해보세요.'
              : 'Assemble unique punching sequences with custom tempo.'}
          </p>
        </div>
        <Link
          href="/routine-builder"
          className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs flex items-center gap-1 shrink-0 transition-all shadow-md shadow-cyan-500/20"
        >
          <span>{isKo ? '만들기' : 'Build'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </section>

      {/* FAQ Accordion Section (SEO Optimized) */}
      <section className="space-y-2">
        <h3 className="text-xs font-extrabold text-[#CBD5E1] uppercase tracking-wider px-1">
          {isKo ? '자주 묻는 질문 (FAQ)' : 'Frequently Asked Questions'}
        </h3>
        <div className="space-y-1.5">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-[#15171E] rounded-xl border border-[#282C3A] overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-3 flex items-center justify-between gap-2 hover:bg-white/[0.02]"
                >
                  <span className="text-xs font-bold text-white">
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#94A3B8] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#94A3B8] shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-3 pb-3 pt-0 text-[11px] text-[#94A3B8] leading-relaxed border-t border-white/5 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer Keywords & Trust Badge */}
      <footer className="pt-2 pb-4 text-center text-[10px] text-[#64748B] space-y-1.5">
        <div className="flex items-center justify-center gap-1.5 text-[#94A3B8]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>{isKo ? '무료 이용 · 설치 불필요 · 전 기기 반응형 지원' : 'Free to use · No app store install required · Cross-platform'}</span>
        </div>
        <p>
          {isKo
            ? '복싱 라운드 타이머 · 샌드백 트레이닝 · 쉐도우 복싱 콤보 루틴 · 음성 코치'
            : 'Boxing Round Timer · Heavy Bag Training · Shadow Boxing Combos · Voice Coaching'}
        </p>
        <div className="pt-1">
          <Link
            href="/inquiry"
            className="inline-flex items-center gap-1 text-[11px] text-[#94A3B8] hover:text-[#FF2E54] underline transition-colors"
          >
            <span>{isKo ? '고객 문의 및 건의사항 남기기' : 'Submit Inquiry / Feedback'}</span>
          </Link>
        </div>
      </footer>
    </article>
  );
}
