'use client';

import Link from 'next/link';
import { ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { portfolioData } from '@/data/portfolio';

export function ConversionBanner() {
  const { person } = portfolioData;

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-3xl p-8 sm:p-12 md:p-14 bg-gradient-to-b from-[#11131A] to-[#0D0F15] border border-[#1E2230] shadow-2xl overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex-1 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 mb-4">
              <Zap className="w-3.5 h-3.5" />
              <span>Direct Collaboration</span>
            </div>

            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#F4F4F6] tracking-tight leading-tight mb-3">
              Ready to turn your vision into <br className="hidden sm:inline" />
              <span className="text-emerald-400">production-grade software?</span>
            </h2>

            <p className="text-sm text-[#8E93A4] leading-relaxed mb-6">
              I collaborate with founders, businesses, and engineering leaders to deliver end-to-end web apps, custom AI automations, and clean-code architectures.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-mono text-[#8E93A4]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero AI Slop</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>100% Code Ownership</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>As-Sunnah Integrity</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto shrink-0">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-[#08090D] font-display font-bold text-sm transition-all duration-200 shadow-xl shadow-emerald-500/20 active:scale-95"
            >
              <span>Get in Touch Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={`mailto:${person.social.email}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#161922] hover:bg-[#1C202C] border border-[#1E2230] text-[#F4F4F6] text-xs font-mono transition-colors"
            >
              <span>{person.social.email}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
