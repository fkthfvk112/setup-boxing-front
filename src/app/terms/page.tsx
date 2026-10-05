'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Globe } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';

export default function TermsPage() {
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
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h1 className="text-base font-black text-[#F8FAFC] tracking-tight">
              {isKo ? '서비스 이용약관' : 'Terms of Service'}
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
          /* ================= Korean Terms ================= */
          <div className="space-y-6 bg-[#15171E] border border-[#282C3A] rounded-2xl p-5 md:p-7 text-[#CBD5E1]">
            <div className="border-b border-[#282C3A] pb-4">
              <h2 className="text-lg font-black text-white">셋업 복싱 서비스 이용약관</h2>
              <div className="flex items-center gap-3 text-[11px] text-[#94A3B8] mt-1">
                <span>발행 기준일: 2026년 10월 5일</span>
                <span>•</span>
                <span>시행일자: 2026년 10월 5일</span>
              </div>
            </div>

            <section className="space-y-2">
              <h3 className="text-sm font-extrabold text-white">제1조 (목적)</h3>
              <p>
                본 약관은 셋업 복싱(이하 &quot;서비스&quot;)의 이용과 관련하여 서비스 운영자(이하 &quot;운영자&quot;)와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
              </p>
              <ul className="list-disc list-inside space-y-1 text-[#94A3B8] pl-1">
                <li>운영자: 셋업 복싱 운영팀 (대표: 정진성)</li>
                <li>문의처: wlstjd545@gmail.com</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-extrabold text-white">제2조 (용어의 정의)</h3>
              <ol className="list-decimal list-inside space-y-1 pl-1">
                <li>
                  <strong className="text-white">&quot;서비스&quot;</strong>란 운영자가 제공하는 복싱 음성 콤보 코칭, 콤보 빌더(워크벤치), 맞춤형 트레이닝 루틴, 인터벌 타이머, 운동 기록 관리 및 관련 부가 서비스를 의미합니다.
                </li>
                <li>
                  <strong className="text-white">&quot;이용자&quot;</strong>란 본 약관에 따라 서비스를 이용하는 회원(무료, PRO, ULTIMATE 등) 및 비회원(게스트)을 의미합니다.
                </li>
              </ol>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-extrabold text-white">제3조 (약관의 효력 및 변경)</h3>
              <ol className="list-decimal list-inside space-y-1.5 pl-1">
                <li>본 약관은 서비스 화면 또는 연결 화면에 게시함으로써 효력이 발생합니다.</li>
                <li>운영자는 관련 법령을 위배하지 않는 범위에서 본 약관을 개정할 수 있으며, 개정된 약관은 서비스 내에 공지함으로써 효력이 발생합니다.</li>
                <li>이용자가 변경된 약관에 동의하지 않는 경우 회원 탈퇴를 통해 이용계약을 해지할 수 있습니다. 변경된 약관의 시행일 이후에도 서비스를 계속 이용하는 경우 변경된 약관에 동의한 것으로 봅니다.</li>
              </ol>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-extrabold text-white">제4조 (서비스의 제공 및 변경·중단)</h3>
              <ol className="list-decimal list-inside space-y-1.5 pl-1">
                <li>운영자는 서비스 운영상, 기술상의 필요에 따라 서비스의 전부 또는 일부를 변경하거나 중단할 수 있습니다.</li>
                <li>서비스의 중요한 변경이나 중단이 있는 경우 사전에 공지하도록 노력합니다. 다만, 천재지변, 긴급 보안 점검, 시스템 장애 등 불가피한 사유가 있는 경우 사후에 공지할 수 있습니다.</li>
              </ol>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-extrabold text-white">제5조 (이용자의 의무 및 서비스 이용 제한)</h3>
              <ol className="list-decimal list-inside space-y-1.5 pl-1">
                <li>이용자는 타인의 정보를 도용하거나 허위 정보를 등록해서는 안 되며, 서비스의 정상적인 운영을 방해하거나 시스템에 위해를 가하는 행위를 해서는 안 됩니다.</li>
                <li>운영자는 이용자가 본 약관 또는 관계 법령을 위반하는 경우 서비스 이용을 제한하거나 계정을 삭제할 수 있습니다.</li>
                <li>불법 행위, 계정 도용, 시스템 공격 등 긴급한 조치가 필요한 경우에는 사전 통보 없이 이용을 즉시 제한할 수 있으며, 이 경우 가능한 범위 내에서 사후에 사유를 안내합니다.</li>
              </ol>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-extrabold text-white">제6조 (콘텐츠 및 데이터의 권리)</h3>
              <ol className="list-decimal list-inside space-y-1.5 pl-1">
                <li>이용자가 서비스 내에 직접 생성·편집한 나만의 콤보, 맞춤 루틴, 운동 기록 등의 데이터에 관한 권리는 관련 법령에 따라 이용자에게 귀속됩니다.</li>
                <li>운영자는 서비스의 원활한 제공, 유지·관리, 백업, 보안 및 서비스 개선에 필요한 최소한의 범위 내에서 해당 데이터를 처리 및 이용할 수 있습니다.</li>
              </ol>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-extrabold text-white">제7조 (운동 안전 및 면책 조항)</h3>
              <ol className="list-decimal list-inside space-y-1.5 pl-1">
                <li>
                  본 서비스에서 제공하는 복싱 콤보, 음성 코칭, 칼로리 추정치 및 트레이닝 가이드는 이용자의 자기 주도적 운동 편의를 위한 보조 정보이며, 전문 의료진의 진단 또는 전문 트레이너의 직접 지도를 대체하지 않습니다.
                </li>
                <li>
                  이용자는 반드시 본인의 건강 및 체력 수준에 적합한 강도로 운동을 수행해야 하며, 준비운동 및 안전한 공간 확보 후 훈련해야 합니다. 이용자의 부주의, 무리한 운동 또는 신체적 한계를 초과하여 발생한 부상이나 신체적 손상에 대해 운영자는 고의 또는 중과실이 없는 한 책임을 지지 않습니다.
                </li>
                <li>
                  운영자는 천재지변, 기간통신사업자의 회선 장애, 이용자의 귀책사유로 인한 서비스 장애 또는 데이터 손실에 대해 고의 또는 중과실이 없는 한 책임을 지지 않습니다.
                </li>
              </ol>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-extrabold text-white">제8조 (유료 서비스 및 환불)</h3>
              <p>
                PRO 및 ULTIMATE 패스 등 유료 멤버십 결제는 각 결제 대행사(PG사) 및 플랫폼의 결제/환불 정책을 따릅니다. 결제 오류 또는 미사용 디지털 상품의 환불 문의는 공식 문의처(wlstjd545@gmail.com)를 통해 접수할 수 있습니다.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-extrabold text-white">제9조 (분쟁 해결 및 관할 법원)</h3>
              <p>
                서비스 이용과 관련하여 분쟁이 발생할 경우 운영자와 이용자는 원만한 해결을 위해 성실히 협의하며, 협의가 이루어지지 않을 경우 대한민국 법령에 따른 관할 법원을 제1심 전속 관할로 합니다.
              </p>
            </section>
          </div>
        ) : (
          /* ================= English Terms ================= */
          <div className="space-y-6 bg-[#15171E] border border-[#282C3A] rounded-2xl p-5 md:p-7 text-[#CBD5E1]">
            <div className="border-b border-[#282C3A] pb-4">
              <h2 className="text-lg font-black text-white">Setup Boxing Terms of Service</h2>
              <div className="flex items-center gap-3 text-[11px] text-[#94A3B8] mt-1">
                <span>Published Date: October 5, 2026</span>
                <span>•</span>
                <span>Effective Date: October 5, 2026</span>
              </div>
            </div>

            <section className="space-y-2">
              <h3 className="text-sm font-extrabold text-white">Article 1 (Purpose & Scope)</h3>
              <p>
                These Terms of Service (&quot;Terms&quot;) govern your access to and use of the Setup Boxing web and mobile application (&quot;Service&quot;) operated by the Setup Boxing Team (&quot;Operator&quot;, &quot;we&quot;, &quot;us&quot;).
              </p>
              <ul className="list-disc list-inside space-y-1 text-[#94A3B8] pl-1">
                <li>Operator: Setup Boxing Team (Representative: Jinseong Jung)</li>
                <li>Contact: wlstjd545@gmail.com</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-extrabold text-white">Article 2 (Service Description)</h3>
              <p>
                Setup Boxing provides interactive boxing audio coaching, customizable combo builder workbench, preset workout routines, interval round timer, workout logging, and related digital training features.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-extrabold text-white">Article 3 (Eligibility & User Accounts)</h3>
              <ol className="list-decimal list-inside space-y-1.5 pl-1">
                <li>You may create an account via third-party OAuth providers (e.g., Google) or use the guest mode. You agree to safeguard your credentials and take responsibility for activities conducted through your account.</li>
                <li>You must not impersonate others or disrupt the integrity and stability of the platform.</li>
              </ol>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-extrabold text-white">Article 4 (User Data & Intellectual Property)</h3>
              <ol className="list-decimal list-inside space-y-1.5 pl-1">
                <li>All software, audio sound effects, coaching algorithms, UI designs, and trademarks are the exclusive property of Setup Boxing.</li>
                <li>Custom combos and workout routines created by you remain your property, with a limited license granted to us solely for hosting, backing up, and rendering the Service.</li>
              </ol>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-extrabold text-white">Article 5 (Fitness & Health Safety Disclaimer)</h3>
              <p className="font-semibold text-amber-300/90">
                BOXING AND HIGH-INTENSITY INTERVAL TRAINING ENTAIL PHYSICAL STRAIN AND INHERENT RISK OF INJURY.
              </p>
              <p>
                The training combos, cadence timers, and audio cues provided by Setup Boxing are for fitness self-training purposes only. They do NOT constitute medical advice or a substitute for personal training by certified instructors. You must exercise within your physical capabilities in a safe environment. To the extent permitted by applicable law, the Operator is not liable for injuries resulting from improper execution or overexertion.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-extrabold text-white">Article 6 (Disclaimer of Warranties & Limitation of Liability)</h3>
              <p>
                THE SERVICE IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS. WE DO NOT GUARANTEE UNINTERRUPTED OR ERROR-FREE PERFORMANCE. TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE OPERATOR SHALL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES ARISING OUT OF YOUR USE OF THE SERVICE.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-extrabold text-white">Article 7 (Termination & Account Deletion)</h3>
              <p>
                You may terminate your account at any time through the in-app profile settings. Upon account deletion, personal records will be purged in compliance with our Privacy Policy.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-extrabold text-white">Article 8 (Governing Law & Inquiries)</h3>
              <p>
                These Terms are governed by and construed in accordance with applicable laws. For questions or support, please contact <a href="mailto:wlstjd545@gmail.com" className="text-emerald-400 hover:underline">wlstjd545@gmail.com</a>.
              </p>
            </section>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="flex items-center justify-between text-xs text-[#64748B] pt-2 pb-8 border-t border-[#282C3A]">
          <Link href="/privacy" className="hover:text-emerald-400 transition-colors">
            {isKo ? '개인정보 처리방침 보기 →' : 'View Privacy Policy →'}
          </Link>
          <Link href="/" className="hover:text-white transition-colors">
            {isKo ? '홈으로 돌아가기' : 'Return Home'}
          </Link>
        </div>
      </div>
    </div>
  );
}
