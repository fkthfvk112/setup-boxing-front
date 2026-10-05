'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MessageSquare, Send, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';
import { inquiryApi } from '../../lib/api';
import { showAlert } from '../../utils/swal';

type InquiryCategory = 'bug' | 'feature' | 'payment' | 'account' | 'general';

interface CategoryOption {
  id: InquiryCategory;
  labelKey: 'inquiryCategoryBug' | 'inquiryCategoryFeature' | 'inquiryCategoryPayment' | 'inquiryCategoryAccount' | 'inquiryCategoryGeneral';
  icon: string;
  prefixKo: string;
  prefixEn: string;
}

const CATEGORY_OPTIONS: CategoryOption[] = [
  { id: 'bug', labelKey: 'inquiryCategoryBug', icon: '🐞', prefixKo: '[버그 제보]', prefixEn: '[Bug]' },
  { id: 'feature', labelKey: 'inquiryCategoryFeature', icon: '💡', prefixKo: '[기능 제안]', prefixEn: '[Feature]' },
  { id: 'payment', labelKey: 'inquiryCategoryPayment', icon: '💳', prefixKo: '[결제/구독]', prefixEn: '[Payment]' },
  { id: 'account', labelKey: 'inquiryCategoryAccount', icon: '👤', prefixKo: '[계정/로그인]', prefixEn: '[Account]' },
  { id: 'general', labelKey: 'inquiryCategoryGeneral', icon: '💬', prefixKo: '[기타 문의]', prefixEn: '[General]' },
];

export default function InquiryPage() {
  const { t, language } = useI18n();
  const isKo = language === 'ko';
  const router = useRouter();

  const [category, setCategory] = useState<InquiryCategory>('bug');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('boxing_user');
        if (raw) {
          const user = JSON.parse(raw);
          if (user?.email && !user.email.startsWith('kakao_') && !user.email.startsWith('guest_')) {
            setEmail(user.email);
          }
        }
      } catch {}
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      await showAlert(
        t('inquiryEnterTitle'),
        undefined,
        'warning'
      );
      return;
    }

    if (!content.trim()) {
      await showAlert(
        t('inquiryEnterContent'),
        undefined,
        'warning'
      );
      return;
    }

    const currentCat = CATEGORY_OPTIONS.find((c) => c.id === category) || CATEGORY_OPTIONS[0];
    const prefix = isKo ? currentCat.prefixKo : currentCat.prefixEn;
    const finalTitle = `${prefix} ${title.trim()}`;

    try {
      setLoading(true);
      const res = await inquiryApi.submitInquiry({
        title: finalTitle,
        content: content.trim(),
        userEmail: email.trim() || undefined,
      });

      if (res.success) {
        setSubmitted(true);
        await showAlert(
          t('inquirySubmittedTitle'),
          t('inquirySuccess'),
          'success'
        );
      } else {
        await showAlert(
          t('inquiryFailedTitle'),
          res.message || '잠시 후 다시 시도해주세요.',
          'error'
        );
      }
    } catch (err: any) {
      console.error('[Inquiry] Error submitting:', err);
      await showAlert(
        t('error'),
        err?.message || t('inquiryFailedConnection'),
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0B0C10] text-white select-none">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-3.5 border-b border-[#282C3A]">
        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            className="p-1.5 -ml-1.5 rounded-xl bg-[#15171E] border border-[#282C3A] text-[#94A3B8] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-lg font-black text-[#F8FAFC] tracking-tight">
            {t('inquiryTitle')}
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 px-4 py-6 overflow-y-auto max-w-md mx-auto w-full">
        {submitted ? (
          <div className="bg-[#15171E] border border-[#282C3A] rounded-2xl p-6 text-center space-y-4 animate-fade-in mt-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">
                {t('inquiryThankYou')}
              </h2>
              <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed">
                {t('inquirySuccess')}
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setTitle('');
                  setContent('');
                }}
                className="w-full py-3 rounded-xl bg-[#1E222D] hover:bg-[#282C3A] text-white font-bold text-xs transition-colors"
              >
                {t('inquirySubmitAnother')}
              </button>
              <Link
                href="/"
                className="block w-full text-center py-2 text-xs text-[#64748B] hover:text-white transition-colors mt-2"
              >
                {t('inquiryReturnHome')}
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-[#15171E] border border-emerald-500/20 rounded-2xl p-4 space-y-1 bg-gradient-to-br from-emerald-950/20 to-[#15171E]">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-black">
                <MessageSquare className="w-4 h-4" />
                <span>{t('inquiryHeaderHelp')}</span>
              </div>
              <p className="text-xs text-[#94A3B8] pt-1 leading-relaxed">
                {t('inquirySubtitle')}
              </p>
            </div>

            {/* Category Selector Chips */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#CBD5E1]">
                {t('inquiryCategory')}{' '}
                <span className="text-emerald-400">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CATEGORY_OPTIONS.map((cat) => {
                  const isSelected = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all border text-left ${
                        isSelected
                          ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400 shadow-sm shadow-emerald-500/20'
                          : 'bg-[#15171E] border-[#282C3A] text-[#94A3B8] hover:text-white hover:border-[#3E4556]'
                      }`}
                    >
                      <span className="text-sm">{cat.icon}</span>
                      <span className="truncate">{t(cat.labelKey)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#CBD5E1]">
                {t('inquiryLabelEmail')}{' '}
                <span className="text-[10px] text-[#64748B] font-normal">
                  ({t('inquiryOptional')})
                </span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('inquiryEmailPlaceholder')}
                className="w-full bg-[#15171E] border border-[#282C3A] focus:border-emerald-500 rounded-xl px-3.5 py-3 text-xs text-white placeholder-[#64748B] outline-none transition-colors"
              />
            </div>

            {/* Title Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#CBD5E1]">
                {t('inquiryLabelTitle')}{' '}
                <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('inquiryTitlePlaceholder')}
                maxLength={100}
                required
                className="w-full bg-[#15171E] border border-[#282C3A] focus:border-emerald-500 rounded-xl px-3.5 py-3 text-xs text-white placeholder-[#64748B] outline-none transition-colors font-medium"
              />
            </div>

            {/* Content Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#CBD5E1]">
                {t('inquiryLabelContent')}{' '}
                <span className="text-emerald-400">*</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={t('inquiryContentPlaceholder')}
                rows={6}
                required
                className="w-full bg-[#15171E] border border-[#282C3A] focus:border-emerald-500 rounded-xl p-3.5 text-xs text-white placeholder-[#64748B] outline-none transition-colors resize-none leading-relaxed"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/25 active:scale-[0.98]"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? t('inquirySending') : t('inquirySubmit')}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
