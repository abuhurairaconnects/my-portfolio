'use client';

import { useActionState } from 'react';
import { submitContactInquiry, ContactActionResult } from '@/actions/contact';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

const initialState: ContactActionResult = {
  success: false,
  message: '',
};

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactInquiry, initialState);

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#11131A] border border-[#1E2230] relative overflow-hidden">
      <h3 className="font-display font-bold text-xl text-[#F4F4F6] mb-2">
        Send a Direct Inquiry
      </h3>
      <p className="text-xs text-[#8E93A4] mb-6">
        Discuss full-stack web platforms, custom AI business automation, or software engineering contracts.
      </p>

      {state?.success ? (
        <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-200 animate-fade-in space-y-2">
          <div className="flex items-center gap-2 font-display font-semibold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Inquiry Dispatched</span>
          </div>
          <p className="text-xs text-emerald-300/90 leading-relaxed font-sans">
            {state.message}
          </p>
        </div>
      ) : (
        <form action={formAction} className="space-y-4">
          {state?.message && !state?.success && (
            <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{state.message}</span>
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-xs font-mono text-[#8E93A4] mb-1.5">
              Full Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="e.g. Abdullah Khan"
              className="w-full px-4 py-2.5 rounded-xl bg-[#08090D] border border-[#1E2230] focus:border-emerald-500 text-sm text-[#F4F4F6] placeholder-[#535868] outline-none transition-colors"
            />
            {state?.errors?.name && (
              <p className="text-[11px] font-mono text-rose-400 mt-1">{state.errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-mono text-[#8E93A4] mb-1.5">
              Email Address *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="e.g. client@organization.com"
              className="w-full px-4 py-2.5 rounded-xl bg-[#08090D] border border-[#1E2230] focus:border-emerald-500 text-sm text-[#F4F4F6] placeholder-[#535868] outline-none transition-colors"
            />
            {state?.errors?.email && (
              <p className="text-[11px] font-mono text-rose-400 mt-1">{state.errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="message" className="block text-xs font-mono text-[#8E93A4] mb-1.5">
              Project Scope or Inquiry *
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              required
              placeholder="Describe your engineering requirement, system architecture, or timeline..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#08090D] border border-[#1E2230] focus:border-emerald-500 text-sm text-[#F4F4F6] placeholder-[#535868] outline-none transition-colors resize-none"
            />
            {state?.errors?.message && (
              <p className="text-[11px] font-mono text-rose-400 mt-1">{state.errors.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#08090D] font-display font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 active:scale-98 disabled:opacity-60 shadow-lg shadow-emerald-500/10"
          >
            {isPending ? (
              <span>Transmitting...</span>
            ) : (
              <>
                <span>Transmit Message</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
