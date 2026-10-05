'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, Lock } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';

export type LegalModalType = 'terms' | 'privacy';

interface LegalModalProps {
  isOpen: boolean;
  type: LegalModalType;
  onClose: () => void;
}

export default function LegalModal({ isOpen, type: initialType, onClose }: LegalModalProps) {
  const { language } = useI18n();
  const isKo = language === 'ko';
  const [activeTab, setActiveTab] = useState<LegalModalType>(initialType);

  // Sync active tab when initialType changes upon opening
  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialType);
    }
  }, [isOpen, initialType]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100005] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#15171E] w-full max-w-lg max-h-[85vh] rounded-3xl border border-[#282C3A] shadow-2xl flex flex-col overflow-hidden text-left"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#282C3A] bg-[#15171E] shrink-0">
          {/* Tab Switcher */}
          <div className="flex items-center gap-1.5 bg-[#0B0C10] p-1 rounded-xl border border-[#282C3A]">
            <button
              type="button"
              onClick={() => setActiveTab('terms')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'terms'
                  ? 'bg-[#1E222D] text-emerald-400 border border-emerald-500/30 shadow-sm'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isKo ? '서비스 이용약관' : 'Terms of Service'}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('privacy')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'privacy'
                  ? 'bg-[#1E222D] text-emerald-400 border border-emerald-500/30 shadow-sm'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isKo ? '개인정보 처리방침' : 'Privacy Policy'}</span>
            </button>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-[#1E222D] text-[#94A3B8] hover:text-white hover:bg-[#282C3A] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-5 text-xs text-[#CBD5E1] space-y-5 leading-relaxed select-text">
          {activeTab === 'terms' ? (
            /* ================= Terms Content ================= */
            isKo ? (
              <div className="space-y-5">
                <div className="border-b border-[#282C3A] pb-3">
                  <h3 className="text-base font-black text-white">셋업 복싱 서비스 이용약관</h3>
                  <div className="flex items-center gap-3 text-[11px] text-[#94A3B8] mt-1">
                    <span>발행 기준일: 2026년 10월 5일</span>
                    <span>•</span>
                    <span>시행일자: 2026년 10월 5일</span>
                  </div>
                </div>

                <section className="space-y-1.5">
                  <h4 className="text-xs font-extrabold text-white">제1조 (목적)</h4>
                  <p>
                    본 약관은 셋업 복싱(이하 &quot;서비스&quot;)의 이용과 관련하여 서비스 운영자(이하 &quot;운영자&quot;)와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
                  </p>
                  <p className="text-[#94A3B8] text-[11px]">
                    • 운영자: 셋업 복싱 운영팀 (대표: 정진성 / wlstjd545@gmail.com)
                  </p>
                </section>

                <section className="space-y-1.5">
                  <h4 className="text-xs font-extrabold text-white">제2조 (용어의 정의)</h4>
                  <ol className="list-decimal list-inside space-y-1 text-[#CBD5E1]">
                    <li><strong>&quot;서비스&quot;</strong>란 복싱 음성 코칭, 콤보 빌더, 맞춤 루틴, 타이머, 운동 기록 관리 및 부가 기능을 의미합니다.</li>
                    <li><strong>&quot;이용자&quot;</strong>란 본 약관에 따라 서비스를 이용하는 회원 및 게스트를 의미합니다.</li>
                  </ol>
                </section>

                <section className="space-y-1.5">
                  <h4 className="text-xs font-extrabold text-white">제3조 (약관의 효력 및 변경)</h4>
                  <p>
                    본 약관은 서비스 화면에 게시함으로써 효력이 발생합니다. 운영자는 법령에 위배되지 않는 범위에서 약관을 개정할 수 있으며 공지 후 효력이 발생합니다.
                  </p>
                </section>

                <section className="space-y-1.5">
                  <h4 className="text-xs font-extrabold text-white">제4조 (운동 안전 및 면책 조항)</h4>
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-amber-200 text-[11px] space-y-1">
                    <p className="font-bold">⚠️ 피트니스 안전 안내</p>
                    <p>
                      본 서비스에서 제공하는 복싱 콤보 및 코칭은 자기 주도적 트레이닝 편의를 위한 참고 정보이며, 의료적 조언이나 전문 트레이너의 지도를 대체하지 않습니다.
                    </p>
                    <p>
                      이용자는 본인의 신체 상태에 맞게 안전한 공간에서 운동해야 하며, 무리한 운동으로 발생한 부상에 대해 운영자는 고의 또는 중과실이 없는 한 책임을 지지 않습니다.
                    </p>
                  </div>
                </section>

                <section className="space-y-1.5">
                  <h4 className="text-xs font-extrabold text-white">제5조 (데이터 및 유료 멤버십)</h4>
                  <p>
                    이용자가 생성한 커스텀 콤보 및 기록의 권리는 이용자에게 있습니다. PRO 및 ULTIMATE 유료 멤버십 결제 및 환불은 관련 법령 및 PG사 정책에 따릅니다.
                  </p>
                </section>

                <section className="space-y-1.5">
                  <h4 className="text-xs font-extrabold text-white">제6조 (문의처)</h4>
                  <p className="text-[#94A3B8]">
                    서비스 이용 문의: <a href="mailto:wlstjd545@gmail.com" className="text-emerald-400 underline">wlstjd545@gmail.com</a>
                  </p>
                </section>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="border-b border-[#282C3A] pb-3">
                  <h3 className="text-base font-black text-white">Setup Boxing Terms of Service</h3>
                  <div className="flex items-center gap-3 text-[11px] text-[#94A3B8] mt-1">
                    <span>Published Date: October 5, 2026</span>
                    <span>•</span>
                    <span>Effective Date: October 5, 2026</span>
                  </div>
                </div>

                <section className="space-y-1.5">
                  <h4 className="text-xs font-extrabold text-white">Article 1 (Purpose & Scope)</h4>
                  <p>
                    These Terms govern your use of the Setup Boxing application operated by the Setup Boxing Team (Representative: Jinseong Jung, wlstjd545@gmail.com).
                  </p>
                </section>

                <section className="space-y-1.5">
                  <h4 className="text-xs font-extrabold text-white">Article 2 (Service Features)</h4>
                  <p>
                    Setup Boxing provides audio boxing cadence coaching, combo workbench builder, workout tracking, round timers, and related training features.
                  </p>
                </section>

                <section className="space-y-1.5">
                  <h4 className="text-xs font-extrabold text-white">Article 3 (Fitness Safety Disclaimer)</h4>
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-amber-200 text-[11px] space-y-1">
                    <p className="font-bold">⚠️ Workout Safety Notice</p>
                    <p>
                      The workouts and audio combos are for self-training fitness guidance only. They do not constitute medical advice. Exercise within your physical capability in a safe area. The Operator is not liable for injuries resulting from overexertion.
                    </p>
                  </div>
                </section>

                <section className="space-y-1.5">
                  <h4 className="text-xs font-extrabold text-white">Article 4 (Contact)</h4>
                  <p className="text-[#94A3B8]">
                    Inquiries: <a href="mailto:wlstjd545@gmail.com" className="text-emerald-400 underline">wlstjd545@gmail.com</a>
                  </p>
                </section>
              </div>
            )
          ) : (
            /* ================= Privacy Content ================= */
            isKo ? (
              <div className="space-y-5">
                <div className="border-b border-[#282C3A] pb-3">
                  <h3 className="text-base font-black text-white">셋업 복싱 개인정보 처리방침</h3>
                  <div className="flex items-center gap-3 text-[11px] text-[#94A3B8] mt-1">
                    <span>발행 기준일: 2026년 10월 5일</span>
                    <span>•</span>
                    <span>시행일자: 2026년 10월 5일</span>
                  </div>
                </div>

                <section className="space-y-1.5">
                  <h4 className="text-xs font-extrabold text-white">제1조 (처리 목적 및 수집 항목)</h4>
                  <p>운영자는 서비스 제공 및 계정 관리를 위해 최소한의 개인정보를 수집합니다.</p>
                  <ul className="list-disc list-inside space-y-1 text-[#94A3B8] pl-1">
                    <li><strong>Google 로그인:</strong> 구글 식별자, 이메일, 이름, 프로필 사진</li>
                    <li><strong>서비스 이용 데이터:</strong> 커스텀 콤보, 운동 시간/세트/펀치수 기록, 타임존, 접속 언어</li>
                    <li><strong>비밀번호(로컬):</strong> 단방향 암호화(Hash) 저장</li>
                  </ul>
                </section>

                <section className="space-y-1.5">
                  <h4 className="text-xs font-extrabold text-white">제2조 (보유 및 파기)</h4>
                  <p>
                    회원 탈퇴 시 모든 개인정보 및 운동 기록은 지체 없이 영구 파기됩니다. (관련 법령에 따른 접속 로그는 3개월 보관)
                  </p>
                </section>

                <section className="space-y-1.5">
                  <h4 className="text-xs font-extrabold text-white">제3조 (제3자 위탁)</h4>
                  <p>
                    안정적인 인프라 운영을 위해 AWS(서버/DB, 서울 리전) 및 Google(로그인/통계) 서비스를 활용하며, 이용자의 개인정보를 광고주 등 외부에 판매하거나 무단 제공하지 않습니다.
                  </p>
                </section>

                <section className="space-y-1.5">
                  <h4 className="text-xs font-extrabold text-white">제4조 (개인정보 보호책임자)</h4>
                  <p className="text-[#94A3B8]">
                    책임자: 정진성 (대표) | 문의: <a href="mailto:wlstjd545@gmail.com" className="text-emerald-400 underline">wlstjd545@gmail.com</a>
                  </p>
                </section>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="border-b border-[#282C3A] pb-3">
                  <h3 className="text-base font-black text-white">Setup Boxing Privacy Policy</h3>
                  <div className="flex items-center gap-3 text-[11px] text-[#94A3B8] mt-1">
                    <span>Published Date: October 5, 2026</span>
                    <span>•</span>
                    <span>Effective Date: October 5, 2026</span>
                  </div>
                </div>

                <section className="space-y-1.5">
                  <h4 className="text-xs font-extrabold text-white">Article 1 (Data We Collect)</h4>
                  <ul className="list-disc list-inside space-y-1 text-[#94A3B8] pl-1">
                    <li>Account & Auth: Email address, Google identifier, display name.</li>
                    <li>Workout Data: Custom combos, workout duration, completed sets, punch counts.</li>
                    <li>Regional Meta: Timezone, country code, language preference.</li>
                  </ul>
                </section>

                <section className="space-y-1.5">
                  <h4 className="text-xs font-extrabold text-white">Article 2 (Data Retention & Deletion)</h4>
                  <p>
                    Personal data is retained only while your account is active. You can delete your account and all logs at any time via App Settings.
                  </p>
                </section>

                <section className="space-y-1.5">
                  <h4 className="text-xs font-extrabold text-white">Article 3 (No Third-Party Sale)</h4>
                  <p className="text-emerald-400 font-semibold">
                    We do not sell, rent, or monetize your personal data with third-party advertisers.
                  </p>
                </section>

                <section className="space-y-1.5">
                  <h4 className="text-xs font-extrabold text-white">Article 4 (Contact)</h4>
                  <p className="text-[#94A3B8]">
                    DPO: Jinseong Jung | Email: <a href="mailto:wlstjd545@gmail.com" className="text-emerald-400 underline">wlstjd545@gmail.com</a>
                  </p>
                </section>
              </div>
            )
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-[#282C3A] bg-[#15171E] flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            {isKo ? '확인' : 'OK'}
          </button>
        </div>
      </div>
    </div>
  );
}
