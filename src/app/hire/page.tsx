import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HireForm } from '@/components/hire/HireForm';
import { portfolioData } from '@/data/portfolio';
import { Shield, Zap, Award, ArrowRight, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Hire Abu Huraira | Custom Web Development & AI Automation',
  description: 'Submit your project scope, timeline, and requirements directly to Abu Huraira for custom software engineering and AI automation.',
};

export default function HirePage() {
  const { person } = portfolioData;

  const clientAdvantages = [
    {
      icon: Award,
      title: 'As-Sunnah Ethical Discipline & Integrity',
      desc: 'Uncompromising honesty, transparent communication, disciplined milestone execution, and zero artificial delays throughout your engagement.',
    },
    {
      icon: Shield,
      title: '100% Code & Database Ownership',
      desc: 'Zero recurring vendor markups or platform lock-in. Your software is containerized with Docker and deployed directly to your own server or VPS.',
    },
    {
      icon: Zap,
      title: 'Zero AI-Slop & Strict Type-Safety',
      desc: 'Engineered with Next.js 15 and strict TypeScript—ensuring sub-second page performance, flawless responsive layouts, and zero defects.',
    },
  ];

  return (
    <main className="min-h-screen bg-transparent text-[#F4F4F6] relative selection:bg-emerald-500/20 selection:text-emerald-300">
      <Navbar />

      <div className="pt-36 pb-24 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Page Hero Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 mb-4">
            <span>High-Intent Project Inquiry</span>
          </div>

          <h1 className="font-display font-bold text-4xl sm:text-5xl text-[#F4F4F6] tracking-tight leading-tight mb-4">
            Engineer Your Next Digital System <br />
            <span className="text-emerald-400">With Precision & Integrity</span>
          </h1>

          <p className="text-base sm:text-lg text-[#8E93A4] leading-relaxed">
            Share your roadmap for a custom web platform, high-converting store, or business AI pipeline. Every engagement is executed with architectural rigor and direct founder accountability.
          </p>
        </div>

        {/* 2-Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
          {/* Left Column: Client Assurances & Quick Reach (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-7 rounded-3xl bg-[#11131A] border border-[#1E2230] space-y-6">
              <h3 className="font-display font-bold text-lg text-[#F4F4F6] pb-3 border-b border-[#1E2230]">
                Why Partner With Abu Huraira?
              </h3>

              <div className="space-y-5">
                {clientAdvantages.map((adv, i) => {
                  const Icon = adv.icon;
                  return (
                    <div key={i} className="flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-display font-semibold text-sm text-[#F4F4F6] mb-1">
                          {adv.title}
                        </h4>
                        <p className="text-xs text-[#8E93A4] leading-relaxed">
                          {adv.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Contact & WhatsApp Box */}
            <div className="p-6 rounded-3xl bg-[#11131A] border border-[#1E2230] space-y-4">
              <h4 className="font-display font-semibold text-sm text-[#F4F4F6]">
                Need Preliminary Discussion or Quick Consultation?
              </h4>
              <p className="text-xs text-[#8E93A4] leading-relaxed">
                If your project scope is still evolving or you simply want preliminary architectural advice, visit the general contact channel.
              </p>

              <div className="pt-2 flex flex-col gap-2.5">
                <Link
                  href="/contact"
                  className="p-3 rounded-xl bg-[#08090D] hover:bg-[#161922] border border-[#1E2230] text-xs font-mono text-[#F4F4F6] flex items-center justify-between transition-colors group"
                >
                  <span>Open General Contact Page</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                </Link>

                <a
                  href={person.social.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs font-mono text-emerald-300 flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Direct WhatsApp Chat</span>
                  </span>
                  <span>+880 1869-171818</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Hire Form (7 cols) */}
          <div className="lg:col-span-7">
            <Suspense
              fallback={
                <div className="p-8 rounded-3xl bg-[#11131A] border border-[#1E2230] text-center text-xs font-mono text-[#8E93A4]">
                  Loading form...
                </div>
              }
            >
              <HireForm />
            </Suspense>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
