'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Lock, Shield } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';

export default function PrivacyPage() {
  const { language } = useI18n();
  const isKo = language === 'ko';

  return (
    <div className="flex-1 flex flex-col bg-[#0B0C10] text-white select-none min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-3.5 border-b border-[#282C3A] sticky top-0 bg-[#0B0C10]/95 backdrop-blur z-20">
        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            className="p-1.5 -ml-1.5 rounded-xl bg-[#15171E] border border-[#282C3A] text-[#94A3B8] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-400" />
            <h1 className="text-base font-black text-[#F8FAFC] tracking-tight">
              {isKo ? '개인정보 처리방침' : 'Privacy Policy'}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher compact />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full text-xs text-[#CBD5E1] space-y-6 leading-relaxed">
        {isKo ? (
          /* ================= Korean Privacy Policy ================= */
          <div className="space-y-6 bg-[#15171E] border border-[#282C3A] rounded-2xl p-5 md:p-7 text-[#CBD5E1]">
            <div className="border-b border-[#282C3A] pb-4">
              <h2 className="text-lg font-black text-white">셋업 복싱 개인정보 처리방침</h2>
              <div className="flex items-center gap-3 text-[11px] text-[#94A3B8] mt-1">
                <span>발행 기준일: 2026년 10월 5일</span>
                <span>•</span>
                <span>시행일자: 2026년 10월 5일</span>
              </div>
            </div>

            <p>
              셋업 복싱(이하 &quot;운영자&quot;)은 이용자의 개인정보를 중요하게 생각하며 「개인정보 보호법」 등 관련 법령을 준수합니다. 본 개인정보 처리방침은 운영자가 제공하는 셋업 복싱(Setup Boxing) 서비스에서 처리하는 개인정보에 관한 사항을 안내합니다.
            </p>

            <section className="space-y-2">
              <h3 className="text-sm font-extrabold text-white">제1조 (개인정보의 처리 목적)</h3>
              <p>운영자는 다음의 목적으로 개인정보를 처리하며, 명시된 목적 이외의 용도로는 사용하지 않습니다.</p>
              <ol className="list-decimal list-inside space-y-1 pl-1">
                <li>회원 식별 및 계정 관리 (회원가입, 로그인, 게스트 모드 지원)</li>
                <li>복싱 콤보 빌더, 맞춤 루틴, 인터벌 타이머 및 운동 기록(시간, 세트 수, 펀치 수, 칼로리) 저장/동기화</li>
                <li>이용자 거주 지역에 맞춘 언어(Language), 타임존(Timezone) 기반 서비스 제공 및 통계 분석</li>
                <li>서비스 오류 및 시스템 충돌 분석을 통한 서비스 안정성 개선</li>
                <li>1:1 문의 접수 및 이용자 피드백 대응</li>
                <li>관계 법령에 따른 법적 의무 이행</li>
              </ol>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-extrabold text-white">제2조 (처리하는 개인정보의 항목)</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-bold text-white">1. 회원 식별 및 로그인</h4>
                  <ul className="list-disc list-inside pl-1 text-[#94A3B8] space-y-0.5 mt-0.5">
                    <li><strong className="text-white">Google 로그인:</strong> 구글 고유 식별자(sub), 이메일, 프로필 이름/사진, 언어 설정(locale)</li>
                    <li><strong className="text-white">로컬 계정:</strong> 아이디, 이메일, 단방향 암호화(Hash)된 비밀번호</li>
                    <li><strong className="text-white">게스트 로그인:</strong> 기기 식별용 임의 생성 고유 식별자(guestId)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-white">2. 서비스 이용 과정에서 생성/저장되는 정보</h4>
                  <ul className="list-disc list-inside pl-1 text-[#94A3B8] space-y-0.5 mt-0.5">
                    <li>생성한 커스텀 복싱 콤보 목록 및 플레이리스트 설정</li>
                    <li>운동 완료 기록(완료 일자, 운동 시간, 세트 수, 타격 수, 소모 칼로리)</li>
                    <li>브라우저 환경 정보: IANA 타임존 식별자(예: Asia/Seoul), 접속 언어, 국가 코드, 브라우저 종류</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-extrabold text-white">제3조 (개인정보의 처리 및 보유기간)</h3>
              <ol className="list-decimal list-inside space-y-1.5 pl-1">
                <li>운영자는 원칙적으로 개인정보의 처리 목적이 달성될 때까지 보유·이용합니다.</li>
                <li>회원 탈퇴 시 이용자의 계정 정보, 커스텀 콤보, 운동 기록은 복구할 수 없는 방식으로 지체 없이 파기됩니다.</li>
                <li>관계 법령의 규정에 의하여 보존할 필요가 있는 경우 해당 법령에 명시된 기간 동안 보관합니다. (예: 통신비밀보호법에 따른 접속 로그: 3개월)</li>
              </ol>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-extrabold text-white">제4조 (개인정보의 파기)</h3>
              <ol className="list-decimal list-inside space-y-1 pl-1">
                <li>보유기간 경과 또는 처리 목적 달성 시 복구 또는 재생이 불가능하도록 안전하게 영구 삭제합니다.</li>
                <li>전자적 파일 형태의 정보는 기술적 방법을 사용하여 영구 파기합니다.</li>
              </ol>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-extrabold text-white">제5조 (개인정보의 제3자 제공 및 위탁)</h3>
              <p>운영자는 원활한 인프라 운영 및 기술 지원을 위해 다음과 같이 업무를 위탁하여 운영하고 있습니다.</p>
              <ul className="list-disc list-inside pl-1 space-y-1 text-[#94A3B8]">
                <li><strong className="text-white">Amazon Web Services (AWS Lightsail):</strong> 클라우드 서버 인프라 및 DB 보관 (서울 리전 운영)</li>
                <li><strong className="text-white">Google LLC:</strong> 구글 소셜 로그인 인증 연동 및 통계 분석</li>
              </ul>
              <p className="text-[11px] text-[#94A3B8] mt-1">
                운영자는 이용자의 개인정보를 제3자에게 판매, 대여 또는 무단 제공하지 않습니다.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-extrabold text-white">제6조 (정보주체의 권리 및 행사방법)</h3>
              <ol className="list-decimal list-inside space-y-1.5 pl-1">
                <li>이용자는 언제든지 자신의 개인정보에 대해 열람, 정정, 삭제 및 처리 정지를 요청할 수 있습니다.</li>
                <li>앱 내 프로필 메뉴 또는 계정 삭제 기능을 통해 직접 탈퇴를 진행하거나, 아래의 개인정보 보호책임자 이메일로 요청하실 수 있습니다.</li>
              </ol>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-extrabold text-white">제7조 (개인정보의 안전성 확보조치)</h3>
              <ul className="list-disc list-inside space-y-1 pl-1">
                <li>비밀번호의 단방향 암호화(Hash) 저장</li>
                <li>전송 구간 보호를 위한 HTTPS(SSL/TLS) 암호화 통신 적용</li>
                <li>데이터베이스 접근 통제 및 최신 보안 패치 적용</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-extrabold text-white">제8조 (개인정보 보호책임자 및 문의처)</h3>
              <p>개인정보 처리 및 관련 문의사항은 아래의 책임자에게 연락 주시면 신속하게 답변드리겠습니다.</p>
              <ul className="list-disc list-inside space-y-1 text-[#94A3B8] pl-1">
                <li><strong className="text-white">개인정보 보호책임자:</strong> 정진성 (대표)</li>
                <li><strong className="text-white">이메일 문의:</strong> wlstjd545@gmail.com</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-extrabold text-white">제9조 (개인정보 처리방침의 변경)</h3>
              <p>
                본 방침은 법령, 정책 또는 서비스 변경에 따라 수정될 수 있으며, 개정 시 서비스 내 공지사항 또는 연결 화면을 통해 사전 안내합니다.
              </p>
            </section>
          </div>
        ) : (
          /* ================= English Privacy Policy ================= */
          <div className="space-y-6 bg-[#15171E] border border-[#282C3A] rounded-2xl p-5 md:p-7 text-[#CBD5E1]">
            <div className="border-b border-[#282C3A] pb-4">
              <h2 className="text-lg font-black text-white">Setup Boxing Privacy Policy</h2>
              <div className="flex items-center gap-3 text-[11px] text-[#94A3B8] mt-1">
                <span>Published Date: October 5, 2026</span>
                <span>•</span>
                <span>Effective Date: October 5, 2026</span>
              </div>
            </div>

            <p>
              Setup Boxing (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy describes how we collect, use, and safeguard your personal information when you use the Setup Boxing web application and services (&quot;Service&quot;), aligned with global privacy standards including GDPR and CCPA.
            </p>

            <section className="space-y-2">
              <h3 className="text-sm font-extrabold text-white">Article 1 (Information We Collect)</h3>
              <ol className="list-decimal list-inside space-y-2 pl-1">
                <li>
                  <strong className="text-white">Account & Authentication:</strong> Email address, Google OAuth unique identifier, profile display name, and avatar URL.
                </li>
                <li>
                  <strong className="text-white">Workout & Training Data:</strong> Custom boxing combos, routine playlists, completed workout logs (exercise duration, sets completed, punch counts, estimated calories burned).
                </li>
                <li>
                  <strong className="text-white">Technical & Regional Meta:</strong> IANA timezone (e.g., America/New_York, Asia/Seoul), country code, language preference, and device/browser technical diagnostics.
                </li>
              </ol>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-extrabold text-white">Article 2 (Purpose of Data Processing)</h3>
              <ul className="list-disc list-inside space-y-1 text-[#94A3B8] pl-1">
                <li>To deliver interactive audio boxing combo coaching and cadence timing.</li>
                <li>To synchronize and save your custom routines and workout progress.</li>
                <li>To adapt language and timezone preferences for global users.</li>
                <li>To maintain system reliability, security, and address user support inquiries.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-extrabold text-white">Article 3 (Third-Party Sub-processors)</h3>
              <p>We work with trusted infrastructure providers:</p>
              <ul className="list-disc list-inside space-y-1 text-[#94A3B8] pl-1">
                <li><strong className="text-white">Amazon Web Services (AWS):</strong> Cloud infrastructure and database hosting.</li>
                <li><strong className="text-white">Google LLC:</strong> OAuth sign-in and aggregated usage analytics.</li>
              </ul>
              <p className="font-bold text-emerald-400 text-[11px] pt-1">
                WE DO NOT SELL, RENT, OR TRADE YOUR PERSONAL INFORMATION TO ADVERTISERS OR THIRD PARTIES.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-extrabold text-white">Article 4 (Data Retention & Deletion)</h3>
              <p>
                Your personal and workout data is retained only while your account is active. You may request immediate deletion of your account and all associated workout logs at any time via App Profile Settings or by emailing our Data Protection Officer.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-extrabold text-white">Article 5 (Your Privacy Rights - GDPR / CCPA)</h3>
              <p>You have the right to access, rectify, port, or request the erasure of your personal data at any time without discrimination.</p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-extrabold text-white">Article 6 (Contact & Data Protection Officer)</h3>
              <p>For questions or privacy inquiries, please contact:</p>
              <ul className="list-disc list-inside space-y-1 text-[#94A3B8] pl-1">
                <li><strong className="text-white">Data Protection Officer:</strong> Jinseong Jung</li>
                <li><strong className="text-white">Email:</strong> <a href="mailto:wlstjd545@gmail.com" className="text-emerald-400 hover:underline">wlstjd545@gmail.com</a></li>
              </ul>
            </section>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="flex items-center justify-between text-xs text-[#64748B] pt-2 pb-8 border-t border-[#282C3A]">
          <Link href="/terms" className="hover:text-emerald-400 transition-colors">
            {isKo ? '서비스 이용약관 보기 →' : 'View Terms of Service →'}
          </Link>
          <Link href="/" className="hover:text-white transition-colors">
            {isKo ? '홈으로 돌아가기' : 'Return Home'}
          </Link>
        </div>
      </div>
    </div>
  );
}
