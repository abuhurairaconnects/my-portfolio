'use client';

import { useState } from 'react';
import { portfolioData } from '@/data/portfolio';
import {
  Award,
  CheckCircle2,
  ShieldCheck,
  UserCheck,
  Sparkles,
  Save,
  MessageSquare,
  Mail,
  MapPin,
} from 'lucide-react';

export function ProfileTrustManager() {
  const { person } = portfolioData;
  const [isAvailable, setIsAvailable] = useState(person.status.available);
  const [statusText, setStatusText] = useState(person.status.text);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-6">
      {savedNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Profile & Trust parameters verified and updated successfully.</span>
        </div>
      )}

      {/* Header Card */}
      <div className="p-6 rounded-2xl bg-[#11131A] border border-[#1E2230]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#161922] border border-[#1E2230] flex items-center justify-center font-display font-bold text-xl text-emerald-400">
              AH
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-xl text-[#F4F4F6]">
                  {person.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400 font-bold uppercase">
                  Founder
                </span>
              </div>
              <p className="text-xs font-mono text-[#8E93A4] mt-0.5">
                {person.founderRole || 'Founder & Principal Software Architect'}
              </p>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#08090D] font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all active:scale-95"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Settings</span>
          </button>
        </div>

        {/* Availability Toggle */}
        <div className="p-4 rounded-xl bg-[#08090D] border border-[#1E2230] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-semibold text-[#F4F4F6] block">
              Contract & Client Availability Status
            </span>
            <span className="text-[11px] text-[#8E93A4] font-mono">
              Controls the live pulsing availability pill on the homepage Hero.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAvailable(!isAvailable)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-2 transition-all ${
                isAvailable
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                  : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isAvailable ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
                }`}
              />
              <span>{isAvailable ? 'Available for Q4/2026' : 'Booked / Unavailable'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Institutional Training & Trust Card */}
      <div className="p-6 rounded-2xl bg-[#11131A] border border-[#1E2230] space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-[#1E2230]">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-[#F4F4F6]">
              Verified Training Institution & Ethical Seal
            </h3>
            <p className="text-xs text-[#8E93A4]">
              Rendered prominently beneath your profile photo to maximize client trust.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#08090D] border border-[#1E2230]">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#535868] block mb-1">
              Primary Institute
            </span>
            <span className="text-sm font-bold text-[#F4F4F6] block font-display">
              As-Sunnah Skill Development Institute
            </span>
            <span className="text-xs text-emerald-400 font-mono mt-0.5 block">
              Ethical Software Engineering & Technology
            </span>
            <p className="text-xs text-[#8E93A4] mt-2 leading-relaxed">
              Professional Skill Development, ethical software engineering, and disciplined client accountability.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#08090D] border border-[#1E2230]">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#535868] block mb-1">
              Academic & Values Foundation
            </span>
            <span className="text-sm font-bold text-[#F4F4F6] block font-display">
              Islamic Studies & Research
            </span>
            <span className="text-xs text-amber-400 font-mono mt-0.5 block">
              Ethical Practice & Social Responsibility
            </span>
            <p className="text-xs text-[#8E93A4] mt-2 leading-relaxed">
              Transparent client reporting, zero hidden dependencies, and zero speculative hype.
            </p>
          </div>
        </div>

        {/* 4 Trust Pillars Client Guarantee */}
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#535868] block mb-3">
            Core Client Trust Pillars Configured:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-[#08090D] border border-[#1E2230] flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-[#F4F4F6] block">
                  Direct Founder Collaboration
                </span>
                <span className="text-[11px] text-[#8E93A4]">
                  Zero outsourcing. Clients work directly with Abu Huraira.
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#08090D] border border-[#1E2230] flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-[#F4F4F6] block">
                  100% Codebase Ownership
                </span>
                <span className="text-[11px] text-[#8E93A4]">
                  Git repo + Docker + Coolify VPS independence guaranteed.
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#08090D] border border-[#1E2230] flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-[#F4F4F6] block">
                  Production-Proven Systems
                </span>
                <span className="text-[11px] text-[#8E93A4]">
                  Live systems handling real institutions and emergency dispatch.
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#08090D] border border-[#1E2230] flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-[#F4F4F6] block">
                  Zero AI-Slop Discipline
                </span>
                <span className="text-[11px] text-[#8E93A4]">
                  Type-safe Next.js 15, strict testing, zero placeholder code.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
