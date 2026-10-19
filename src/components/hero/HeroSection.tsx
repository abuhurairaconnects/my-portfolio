'use client';

import { useState } from 'react';
import Image from 'next/image';
import { portfolioData } from '@/data/portfolio';
import { DotGlobe } from '@/components/ui/DotGlobe';
import {
  MapPin,
  Award,
  CheckCircle2,
  MessageSquare,
  ShieldCheck,
  Zap,
  Sparkles,
  Globe,
  User,
} from 'lucide-react';

export function HeroSection() {
  const { person, metrics } = portfolioData;
  const [activeMediaTab, setActiveMediaTab] = useState<'photo' | 'globe'>('photo');

  const coreServices = [
    {
      num: '01',
      title: 'Full-Stack Web Development',
      outcome: 'Fast, secure web platforms, dashboards and APIs that turn visitors into clients.',
      tech: 'Next.js · React · TypeScript · PostgreSQL',
    },
    {
      num: '02',
      title: 'Application Development',
      outcome: 'Installable cross-platform and mobile-friendly applications that work reliably offline and online.',
      tech: 'PWA · Responsive UI · Offline-First · REST/APIs',
    },
    {
      num: '03',
      title: 'AI Business Automation',
      outcome: 'Automate repetitive work like SMS, voice, data entry and follow-ups to save time and cost.',
      tech: 'Voice/NLP · SMS & IoT · Agent Workflows',
    },
  ];

  return (
    <section id="top" className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-10 items-start">
          {/* Left Column (7 cols): Identity, Hook & 3 Core Services */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Live Availability & Location Badge */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Available for Q4/2026 Projects & Roles</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#11131A] border border-[#1E2230] text-xs font-mono text-[#8E93A4]">
                <MapPin className="w-3.5 h-3.5 text-[#535868]" />
                <span>Dhaka (UTC+6)</span>
              </div>
            </div>

            {/* Main Name */}
            <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-[#F4F4F6] tracking-tight leading-[1.08] mb-3">
              Abu Huraira
            </h1>

            {/* Main Headline */}
            <p className="text-base sm:text-lg text-[#F4F4F6] font-medium max-w-xl leading-snug mb-3">
              {person.heroHook}
            </p>

            {/* Bio Paragraph */}
            <p className="text-xs sm:text-sm text-[#8E93A4] max-w-xl leading-relaxed mb-6">
              {person.summary}
            </p>

            {/* WHAT I DO - 3 CORE SERVICES BOARD */}
            <div className="w-full max-w-xl p-4 sm:p-5 rounded-2xl bg-[#11131A] border border-[#1E2230] shadow-xl shimmer-container mb-6">
              <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-[#1E2230]">
                <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>WHAT I DO</span>
                </span>
                <span className="text-[10px] font-mono text-[#8E93A4] px-2.5 py-0.5 rounded-full bg-[#161922] border border-[#1E2230]">
                  3 Core Services
                </span>
              </div>

              {/* 3 Focused Core Services Rows */}
              <div className="space-y-2.5">
                {coreServices.map((service) => (
                  <div
                    key={service.num}
                    className="p-3 rounded-xl bg-[#08090D]/80 border border-[#1E2230]/70 hover:border-emerald-500/40 transition-colors flex flex-col gap-1 group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-emerald-400 font-bold shrink-0">
                        {service.num}
                      </span>
                      <h3 className="text-xs sm:text-sm font-display font-semibold text-[#F4F4F6] group-hover:text-emerald-300 transition-colors">
                        {service.title}
                      </h3>
                    </div>

                    <p className="text-[11px] sm:text-xs text-[#8E93A4] leading-relaxed pl-5">
                      {service.outcome}
                    </p>

                    <div className="pl-5 pt-0.5">
                      <span className="text-[10px] sm:text-[11px] font-mono text-[#535868]">
                        {service.tech}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick 1-Tap Message Link */}
            <div className="flex items-center gap-4 text-xs font-mono text-[#8E93A4] mb-8">
              <span>Direct WhatsApp message:</span>
              <a
                href={person.social.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>+880 1869-171818</span>
              </a>
            </div>

            {/* Verified Trust Proof Grid */}
            <div className="grid grid-cols-3 gap-6 pt-5 border-t border-[#1E2230] w-full max-w-lg">
              {metrics.map((metric, i) => (
                <div key={i} className="flex flex-col">
                  <span className="font-display font-bold text-2xl text-[#F4F4F6]">
                    {metric.value}
                  </span>
                  <span className="text-xs text-[#8E93A4] font-medium mt-0.5">
                    {metric.label}
                  </span>
                  {metric.detail && (
                    <span className="text-[10px] text-[#535868] font-mono mt-0.5 hidden sm:inline">
                      {metric.detail}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column (5 cols): Authentic High-Res Photo & Verification Card */}
          <div className="lg:col-span-5 relative flex flex-col items-center lg:items-end">
            {/* View Switcher: 👤 My Photo vs 🌍 Worldwide 3D */}
            <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#11131A] border border-[#1E2230] mb-3 shadow-lg">
              <button
                type="button"
                onClick={() => setActiveMediaTab('photo')}
                className={`px-3.5 py-1 rounded-full text-xs font-mono transition-all flex items-center gap-1.5 ${
                  activeMediaTab === 'photo'
                    ? 'bg-emerald-500 text-[#08090D] font-bold shadow-md'
                    : 'text-[#8E93A4] hover:text-[#F4F4F6]'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>👤 My Photo</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveMediaTab('globe')}
                className={`px-3.5 py-1 rounded-full text-xs font-mono transition-all flex items-center gap-1.5 ${
                  activeMediaTab === 'globe'
                    ? 'bg-emerald-500 text-[#08090D] font-bold shadow-md'
                    : 'text-[#8E93A4] hover:text-[#F4F4F6]'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>🌍 Worldwide 3D</span>
              </button>
            </div>

            {/* The Interactive Container with Natural Full Color or 3D Globe */}
            <div className="relative w-72 sm:w-80 md:w-96 aspect-[4/5] rounded-3xl overflow-hidden bg-[#11131A] border-2 border-[#1E2230] shadow-2xl shadow-black/90 group flex items-center justify-center">
              {activeMediaTab === 'photo' ? (
                <Image
                  src={person.photoUrl}
                  alt={person.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
                  {/* Top helper indicator */}
                  <div className="absolute top-3.5 inset-x-3 flex items-center justify-between z-10 pointer-events-none">
                    <div className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span>Worldwide Dhaka Link</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#8E93A4] bg-[#08090D]/80 px-2 py-0.5 rounded">
                      Move cursor to rotate 🖱️
                    </span>
                  </div>

                  <DotGlobe size={360} enableInteraction={true} />

                  {/* Bottom Card Identity Footer */}
                  <div className="absolute bottom-3 inset-x-3 p-2.5 rounded-2xl bg-[#11131A]/95 backdrop-blur-md border border-[#1E2230] flex items-center justify-between text-center">
                    <span className="text-[11px] font-mono text-emerald-400 mx-auto font-medium">
                      🌍 Global Deployments · Dhaka HQ (UTC+6)
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* INSTITUTIONAL CREDENTIAL & CLIENT TRUST CARD DIRECTLY BELOW PHOTO */}
            <div className="w-72 sm:w-80 md:w-96 mt-4 p-4 rounded-2xl bg-[#11131A] border border-[#1E2230] shadow-xl space-y-3.5">
              {/* As-Sunnah Skill Development Institute Training Proof */}
              <div className="flex items-start gap-3 pb-3 border-b border-[#1E2230]">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  <Award className="w-5 h-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#F4F4F6] font-display">
                      As-Sunnah Skill Development Institute
                    </span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  </div>
                  <span className="text-[11px] text-[#8E93A4] font-mono leading-tight mt-0.5">
                    Professional Tech Training & Career Development
                  </span>
                  <span className="text-[10px] text-emerald-400/90 font-mono mt-1 block">
                    ✓ Professional Tech Training & Ethical Practice
                  </span>
                </div>
              </div>

              {/* Why Clients Trust Abu Huraira - 3 Core Guarantees */}
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-xs text-[#8E93A4]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#F4F4F6]">Direct Founder Work:</strong> Zero outsourcing, no delegated junior code.
                  </span>
                </div>

                <div className="flex items-start gap-2 text-xs text-[#8E93A4]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#F4F4F6]">100% Code Ownership:</strong> Full Git repository, Docker & Coolify VPS configs.
                  </span>
                </div>

                <div className="flex items-start gap-2 text-xs text-[#8E93A4]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#F4F4F6]">Proven In Production:</strong> Real live platforms (Madrasa Management & Joruri Rokto).
                  </span>
                </div>
              </div>

              {/* Ethical Pledge Tag */}
              <div className="pt-2.5 border-t border-[#1E2230] flex items-center justify-between text-[10px] font-mono text-[#8E93A4]">
                <span className="text-emerald-400 font-medium"># Islamic Ethical Standards</span>
                <span>Fast 2–4h Turnaround</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
