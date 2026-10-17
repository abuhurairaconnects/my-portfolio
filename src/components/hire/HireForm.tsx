'use client';

import { useActionState, useState, useEffect } from 'react';
import { submitHireInquiry, ContactActionResult } from '@/actions/contact';
import { Send, CheckCircle2, AlertCircle, ShieldCheck, Clock, Sparkles } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

const initialState: ContactActionResult = {
  success: false,
  message: '',
};

const SERVICE_OPTIONS = [
  'Custom Web Applications & SaaS Dashboards',
  'E-Commerce & Scalable Store Platforms',
  'API & Backend Architecture & VPS Setup',
  'AI Business Automation & Workflow Pipelines',
  'Bangla & English Voice AI Systems',
  'Other Custom Software / Strategic Consultation',
];

const BUDGET_OPTIONS = [
  '$500 – $1,000 (Small MVP / Fast Automation)',
  '$1,000 – $2,500 (Production Web App / SaaS)',
  '$2,500 – $5,000+ (Full Platform / Enterprise)',
  'Monthly Retainer / Dedicated Contract ($30–$50/hr)',
  'Flexible / Open to Architectural Estimation',
];

const TIMELINE_OPTIONS = [
  '1 to 2 Weeks (Rapid Sprint / MVP)',
  '3 to 4 Weeks (Standard Production Project)',
  '1 to 2 Months (Comprehensive Platform)',
  'Flexible Timeline / Ongoing Partnership',
];

export function HireForm() {
  const [state, formAction, isPending] = useActionState(submitHireInquiry, initialState);
  const searchParams = useSearchParams();
  const preselectedService = searchParams.get('service');

  const [selectedService, setSelectedService] = useState(SERVICE_OPTIONS[0]);

  useEffect(() => {
    if (preselectedService === 'fullstack-web') {
      setSelectedService(SERVICE_OPTIONS[0]);
    } else if (preselectedService === 'ecommerce-platforms') {
      setSelectedService(SERVICE_OPTIONS[1]);
    } else if (preselectedService === 'api-backend-vps') {
      setSelectedService(SERVICE_OPTIONS[2]);
    } else if (preselectedService === 'ai-business-automation') {
      setSelectedService(SERVICE_OPTIONS[3]);
    } else if (preselectedService === 'voice-speech-ai') {
      setSelectedService(SERVICE_OPTIONS[4]);
    }
  }, [preselectedService]);

  return (
    <div className="p-6 sm:p-10 rounded-3xl bg-[#11131A] border border-[#1E2230] relative overflow-hidden shadow-2xl">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Project Scope & Inquiry Form</span>
        </div>
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#F4F4F6] tracking-tight">
          Submit Project Scope & Requirements
        </h2>
        <p className="text-xs sm:text-sm text-[#8E93A4] mt-2 leading-relaxed">
          Provide your project objectives below. Abu Huraira will directly evaluate your technical architecture and return a concrete proposal, milestones, and timeline within 24 hours.
        </p>
      </div>

      {state?.success ? (
        <div className="p-6 sm:p-8 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-200 animate-fade-in space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-display font-bold text-base text-emerald-300">
                Inquiry Successfully Dispatched!
              </h4>
              <p className="text-xs text-emerald-400/80 font-mono mt-0.5">
                Delivered directly to Abu Huraira&apos;s management console
              </p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed font-sans pt-2 border-t border-emerald-500/20">
            {state.message}
          </p>
          <div className="p-3.5 rounded-xl bg-[#08090D]/60 border border-emerald-500/20 text-xs font-mono text-[#8E93A4]">
            For urgent discussions, reach out directly on WhatsApp: <span className="text-emerald-400 font-semibold">+880 1869-171818</span>
          </div>
        </div>
      ) : (
        <form action={formAction} className="space-y-6">
          {state?.message && !state?.success && (
            <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{state.message}</span>
            </div>
          )}

          {/* 1. Name & Email Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="hire-name" className="block text-xs font-mono text-[#8E93A4] mb-1.5">
                Full Name *
              </label>
              <input
                id="hire-name"
                name="name"
                type="text"
                required
                placeholder="e.g. Abdullah Khan / Tariq Mansoor"
                className="w-full px-4 py-3 rounded-xl bg-[#08090D] border border-[#1E2230] focus:border-emerald-500 text-sm text-[#F4F4F6] placeholder-[#535868] outline-none transition-colors"
              />
              {state?.errors?.name && (
                <p className="text-[11px] font-mono text-rose-400 mt-1">{state.errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="hire-email" className="block text-xs font-mono text-[#8E93A4] mb-1.5">
                Email Address *
              </label>
              <input
                id="hire-email"
                name="email"
                type="email"
                required
                placeholder="e.g. client@organization.com"
                className="w-full px-4 py-3 rounded-xl bg-[#08090D] border border-[#1E2230] focus:border-emerald-500 text-sm text-[#F4F4F6] placeholder-[#535868] outline-none transition-colors"
              />
              {state?.errors?.email && (
                <p className="text-[11px] font-mono text-rose-400 mt-1">{state.errors.email}</p>
              )}
            </div>
          </div>

          {/* 2. Service Selection */}
          <div>
            <label htmlFor="serviceType" className="block text-xs font-mono text-[#8E93A4] mb-1.5">
              Service Category *
            </label>
            <select
              id="serviceType"
              name="serviceType"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#08090D] border border-[#1E2230] focus:border-emerald-500 text-sm text-[#F4F4F6] outline-none transition-colors cursor-pointer"
            >
              {SERVICE_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="bg-[#11131A] text-[#F4F4F6]">
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Budget & Timeline Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="budget" className="block text-xs font-mono text-[#8E93A4] mb-1.5">
                Estimated Budget Tier
              </label>
              <select
                id="budget"
                name="budget"
                defaultValue={BUDGET_OPTIONS[1]}
                className="w-full px-4 py-3 rounded-xl bg-[#08090D] border border-[#1E2230] focus:border-emerald-500 text-xs sm:text-sm text-[#F4F4F6] outline-none transition-colors cursor-pointer"
              >
                {BUDGET_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} className="bg-[#11131A] text-[#F4F4F6]">
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="timeline" className="block text-xs font-mono text-[#8E93A4] mb-1.5">
                Target Timeline
              </label>
              <select
                id="timeline"
                name="timeline"
                defaultValue={TIMELINE_OPTIONS[1]}
                className="w-full px-4 py-3 rounded-xl bg-[#08090D] border border-[#1E2230] focus:border-emerald-500 text-xs sm:text-sm text-[#F4F4F6] outline-none transition-colors cursor-pointer"
              >
                {TIMELINE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} className="bg-[#11131A] text-[#F4F4F6]">
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4. Project Scope / Requirements */}
          <div>
            <label htmlFor="hire-message" className="block text-xs font-mono text-[#8E93A4] mb-1.5">
              Project Scope & Requirements *
            </label>
            <textarea
              id="hire-message"
              name="message"
              rows={5}
              required
              placeholder="Describe your business goals, required modules, target users, or any benchmark reference applications..."
              className="w-full px-4 py-3 rounded-xl bg-[#08090D] border border-[#1E2230] focus:border-emerald-500 text-sm text-[#F4F4F6] placeholder-[#535868] outline-none transition-colors resize-none leading-relaxed"
            />
            {state?.errors?.message && (
              <p className="text-[11px] font-mono text-rose-400 mt-1">{state.errors.message}</p>
            )}
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-3 border-y border-[#1E2230]">
            <div className="flex items-center gap-2.5 text-xs text-[#8E93A4]">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Guaranteed response within 24 hours</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-[#8E93A4]">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% source code & database ownership</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#08090D] font-display font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 active:scale-98 disabled:opacity-60 shadow-xl shadow-emerald-500/10 cursor-pointer"
          >
            {isPending ? (
              <span>Transmitting Proposal...</span>
            ) : (
              <>
                <span>Submit Project Inquiry</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
