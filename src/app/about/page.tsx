import type { Metadata } from 'next';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { portfolioData } from '@/data/portfolio';
import { Award, BookOpen, Compass, CheckCircle2, Shield, HeartHandshake, ArrowRight, Download, FileText, CheckCheck, Workflow, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export const metadata: Metadata = {
  title: 'About, Ethics & As-Sunnah Foundations | Abu Huraira',
  description: 'Learn about Abu Huraira, his professional training from As-Sunnah Skill Development, and his engineering philosophy.',
};

export default function AboutPage() {
  const { person, educationAndEthics } = portfolioData;

  const workingMethodology = [
    {
      step: '01',
      title: 'Deep Understanding & Radical Honesty',
      subtitle: 'Requirement Analysis & Truthful Scoping',
      desc: 'No unrealistic claims or false promises. Your business problem is analyzed in depth to architect reliable, production-ready systems without unnecessary feature bloat or inflated budgets.',
    },
    {
      step: '02',
      title: 'Transparent Sprints & Zero AI Slop',
      subtitle: 'Live Milestones & Clean Architecture',
      desc: 'Regular live staging demos and git commits shared throughout development. Zero borrowed sluggish templates; every module is built with strict TypeScript types, deterministic logic, and complete testing.',
    },
    {
      step: '03',
      title: '100% Code & Database Ownership',
      subtitle: 'Self-Hosted VPS & Zero Lock-in',
      desc: 'Zero vendor lock-in. Full production source code, Docker configs, database migrations, and setup documentation are deployed directly to your own server or Coolify VPS under your complete control.',
    },
    {
      step: '04',
      title: 'Amanah & Ethical Accountability',
      subtitle: 'Trust, Timeliness & Data Integrity',
      desc: 'Rooted in professional ethics from As-Sunnah Skill Development and classical Islamic principles, client time and commitments are treated as sacred trusts (Amanah) with strict privacy and integrity.',
    },
  ];

  return (
    <main className="min-h-screen bg-transparent text-[#F4F4F6] relative selection:bg-emerald-500/20 selection:text-emerald-300">
      <Navbar />

      <div className="pt-36 pb-24 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header Hero */}
        <ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 mb-4">
                <span>Personal Narrative & Roots</span>
              </div>

              <h1 className="font-display font-bold text-4xl sm:text-6xl text-[#F4F4F6] tracking-tight leading-tight mb-6">
                About
              </h1>

              <p className="text-base sm:text-lg text-[#8E93A4] leading-relaxed mb-6">
              I am Abu Huraira, a software engineer and AI automation specialist based in Dhaka, Bangladesh. My work is defined by a belief that software should not be superficial or bloated; it must solve real problems, respect user privacy, and operate with verifiable reliability.
            </p>

            <p className="text-sm text-[#8E93A4] leading-relaxed mb-8">
              My engineering discipline is strongly anchored by professional training from <strong className="text-[#F4F4F6]">As-Sunnah Skill Development</strong> alongside academic Islamic studies. This foundation instills honesty, transparent client reporting, and an ethical code of conduct in every digital system I build.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#08090D] font-display font-bold text-sm transition-all shadow-lg shadow-emerald-500/10 active:scale-95"
              >
                <span>Get in Touch</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Secondary Download CV Button */}
              <a
                href={person.resumeUrl || '/Abu-Huraira-Resume.pdf'}
                download
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#161922] hover:bg-[#1E2230] border border-[#1E2230] hover:border-emerald-500/40 text-xs font-mono text-[#F4F4F6] transition-colors"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Download CV / Resume</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col items-center lg:items-end">
            <div className="relative w-72 sm:w-80 aspect-[4/5] rounded-3xl overflow-hidden bg-[#11131A] border-2 border-[#1E2230] shadow-2xl group">
              <Image
                src={person.photoUrl}
                alt={person.name}
                fill
                priority
                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />

              {/* Founder Top-Right Floating Pill */}
              <div className="absolute top-3.5 right-3.5 px-3 py-1.5 rounded-full bg-[#11131A]/95 backdrop-blur-md border border-emerald-500/30 shadow-lg flex items-center gap-1.5 z-10">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                  Founder
                </span>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-[#08090D]/85 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 inset-x-3 p-3 rounded-2xl bg-[#11131A]/95 backdrop-blur-md border border-[#1E2230] text-center">
                <span className="font-display font-bold text-xs text-[#F4F4F6] block">
                  Abu Huraira
                </span>
                <span className="text-[10px] font-mono text-emerald-400">
                  Founder & Principal Software Architect
                </span>
              </div>
            </div>

            {/* As-Sunnah Credential Box Below Photo */}
            <div className="w-72 sm:w-80 mt-4 p-4 rounded-2xl bg-[#11131A] border border-[#1E2230] shadow-xl">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#F4F4F6] block font-display">
                    As-Sunnah Skill Development Institute
                  </span>
                  <span className="text-[11px] text-[#8E93A4] font-mono block mt-0.5">
                    Professional Tech Training & Ethical Practice
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono mt-1 block">
                    ✓ Verified Ethical Foundations
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

        {/* Dedicated Section: How I Work & Delivery Ethics */}
        <ScrollReveal delay={0.1}>
          <section id="ethics" className="p-8 sm:p-12 rounded-3xl bg-[#0F1118] border border-emerald-500/30 mb-24 shadow-2xl relative overflow-hidden scroll-mt-28">
          <div className="max-w-3xl mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ethical Working Methodology</span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#F4F4F6] tracking-tight">
              How I Work & Delivery Ethics
            </h2>
            <p className="text-xs sm:text-sm text-[#8E93A4] mt-2 leading-relaxed">
              Every client engagement is driven by absolute transparency, strict deadline compliance, and ethical stewardship (Amanah) instilled through professional As-Sunnah training.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {workingMethodology.map((m, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-7 rounded-2xl bg-[#11131A] border border-[#1E2230] hover:border-emerald-500/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-emerald-400 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      Step {m.step}
                    </span>
                    <span className="text-[11px] font-mono text-[#535868]">
                      {m.subtitle}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-[#F4F4F6] group-hover:text-emerald-400 transition-colors mb-2">
                    {m.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#8E93A4] leading-relaxed">
                    {m.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
        </ScrollReveal>

        {/* The 3 Core Pillars: As-Sunnah, Islamic Studies, Digital Competencies */}
        <ScrollReveal delay={0.1}>
          <div className="space-y-16 mb-24">
            <div className="border-b border-[#1E2230] pb-6">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider block mb-2">
                Detailed Background
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#F4F4F6]">
                Educational & Multidisciplinary Pillars
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {educationAndEthics.map((item, idx) => (
                <div
                  key={idx}
                  className="card-surface rounded-3xl p-8 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-[#161922] border border-[#1E2230] flex items-center justify-center">
                        {idx === 0 ? (
                          <Award className="w-6 h-6 text-emerald-400" />
                        ) : idx === 1 ? (
                          <BookOpen className="w-6 h-6 text-amber-400" />
                        ) : (
                          <Compass className="w-6 h-6 text-cyan-400" />
                        )}
                      </div>
                      {item.badge && (
                        <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-[#161922] border border-[#1E2230] text-emerald-400">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="font-display font-bold text-xl text-[#F4F4F6] mb-1">
                      {item.institution}
                    </h3>
                    <p className="text-xs font-mono text-emerald-400 mb-4">
                      {item.title}
                    </p>

                    <p className="text-xs sm:text-sm text-[#8E93A4] leading-relaxed mb-6">
                      {item.description}
                    </p>

                    <ul className="space-y-2 mb-6">
                      {item.highlights.map((highlight, hIdx) => (
                        <li key={hIdx} className="flex items-start gap-2 text-xs text-[#8E93A4]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Guiding Principles */}
        <ScrollReveal delay={0.1}>
          <div className="p-8 sm:p-12 rounded-3xl bg-[#0B0D13] border border-[#1E2230]">
            <div className="max-w-2xl mb-8">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider block mb-2">
                Engineering Manifesto
              </span>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#F4F4F6]">
                Principles I Never Compromise On
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-[#11131A] border border-[#1E2230]">
                <Shield className="w-5 h-5 text-emerald-400 mb-3" />
                <h3 className="font-display font-semibold text-base text-[#F4F4F6] mb-1.5">
                  Zero AI Slop
                </h3>
                <p className="text-xs text-[#8E93A4] leading-relaxed">
                  Every line of code is intentional, type-safe, and deterministic. No fake metrics, no cookie-cutter templates, and no shortcuts.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#11131A] border border-[#1E2230]">
                <HeartHandshake className="w-5 h-5 text-emerald-400 mb-3" />
                <h3 className="font-display font-semibold text-base text-[#F4F4F6] mb-1.5">
                  Radical Transparency
                </h3>
                <p className="text-xs text-[#8E93A4] leading-relaxed">
                  Clear deadlines, reproducible test suites, honest communication, and no hidden vendor dependencies.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#11131A] border border-[#1E2230]">
                <Award className="w-5 h-5 text-emerald-400 mb-3" />
                <h3 className="font-display font-semibold text-base text-[#F4F4F6] mb-1.5">
                  Full Code Ownership
                </h3>
                <p className="text-xs text-[#8E93A4] leading-relaxed">
                  You own 100% of your repository, documentation, and database schemas with ready-to-run Docker and Coolify configs.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>

      <Footer />
    </main>
  );
}
