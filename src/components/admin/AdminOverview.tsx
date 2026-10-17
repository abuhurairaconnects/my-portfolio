'use client';

import { Inquiry } from '@/lib/inquiriesStore';
import {
  Inbox,
  FolderGit2,
  Activity,
  UserCheck,
  ArrowRight,
  Mail,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';

interface AdminOverviewProps {
  inquiries: Inquiry[];
  onSelectTab: (tab: 'inquiries' | 'projects' | 'profile' | 'telemetry' | 'security') => void;
}

export function AdminOverview({ inquiries, onSelectTab }: AdminOverviewProps) {
  const newInquiries = inquiries.filter((i) => i.status === 'new');
  const recentInquiries = inquiries.slice(0, 3);

  const formatTime = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="space-y-8">
      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Inquiries KPI */}
        <div
          onClick={() => onSelectTab('inquiries')}
          className="p-5 rounded-2xl bg-[#11131A] border border-[#1E2230] hover:border-emerald-500/40 cursor-pointer transition-all hover:-translate-y-0.5 group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono text-[#535868] uppercase tracking-wider">
              Client Inquiries
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-bold text-3xl text-[#F4F4F6]">
              {inquiries.length}
            </span>
            {newInquiries.length > 0 && (
              <span className="text-xs font-mono text-emerald-400 font-semibold animate-pulse">
                +{newInquiries.length} New
              </span>
            )}
          </div>
          <span className="text-[11px] text-[#8E93A4] mt-1 block">
            Click to manage incoming leads
          </span>
        </div>

        {/* Projects KPI */}
        <div
          onClick={() => onSelectTab('projects')}
          className="p-5 rounded-2xl bg-[#11131A] border border-[#1E2230] hover:border-emerald-500/40 cursor-pointer transition-all hover:-translate-y-0.5 group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono text-[#535868] uppercase tracking-wider">
              Production Systems
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <FolderGit2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-bold text-3xl text-[#F4F4F6]">
              4
            </span>
            <span className="text-xs font-mono text-cyan-400">
              3 Featured
            </span>
          </div>
          <span className="text-[11px] text-[#8E93A4] mt-1 block">
            Madrasa, Joruri Rokto, Farm Voice
          </span>
        </div>

        {/* VPS Health KPI */}
        <div
          onClick={() => onSelectTab('telemetry')}
          className="p-5 rounded-2xl bg-[#11131A] border border-[#1E2230] hover:border-emerald-500/40 cursor-pointer transition-all hover:-translate-y-0.5 group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono text-[#535868] uppercase tracking-wider">
              Traefik & VPS Health
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-bold text-2xl text-emerald-400">
              200 OK
            </span>
            <span className="text-xs font-mono text-[#8E93A4]">
              Healthy
            </span>
          </div>
          <span className="text-[11px] text-[#8E93A4] mt-1 block">
            Next.js 15 Standalone daemon
          </span>
        </div>

        {/* Profile & Trust Status KPI */}
        <div
          onClick={() => onSelectTab('profile')}
          className="p-5 rounded-2xl bg-[#11131A] border border-[#1E2230] hover:border-emerald-500/40 cursor-pointer transition-all hover:-translate-y-0.5 group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono text-[#535868] uppercase tracking-wider">
              Founder Profile
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-bold text-xl text-[#F4F4F6]">
              As-Sunnah
            </span>
            <span className="text-xs font-mono text-emerald-400 font-semibold">
              Certified
            </span>
          </div>
          <span className="text-[11px] text-[#8E93A4] mt-1 block">
            Founder & Principal Architect
          </span>
        </div>
      </div>

      {/* Two Column Section: Recent Inquiries + System Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Recent Inquiries */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#11131A] border border-[#1E2230]">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#1E2230]">
            <div>
              <h3 className="font-display font-bold text-base text-[#F4F4F6]">
                Recent Incoming Client Inquiries
              </h3>
              <p className="text-xs text-[#8E93A4] mt-0.5">
                Real messages submitted through the portfolio contact form.
              </p>
            </div>
            <button
              onClick={() => onSelectTab('inquiries')}
              className="text-xs font-mono text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>View All ({inquiries.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentInquiries.map((inq) => (
              <div
                key={inq.id}
                className="p-4 rounded-xl bg-[#08090D] border border-[#1E2230] hover:border-emerald-500/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-semibold text-sm text-[#F4F4F6]">
                      {inq.name}
                    </span>
                    {inq.status === 'new' && (
                      <span className="px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono">
                        NEW
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-[#535868]">
                    {formatTime(inq.timestamp)}
                  </span>
                </div>

                <p className="text-xs text-[#8E93A4] line-clamp-2 leading-relaxed mb-3">
                  {inq.message}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-[#1E2230]/60">
                  <span className="text-[10px] font-mono text-[#535868]">
                    {inq.email}
                  </span>
                  <a
                    href={`mailto:${inq.email}?subject=Re:%20Inquiry%20regarding%20Software%20%26%20AI%20Automation`}
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    <Mail className="w-3 h-3" />
                    <span>Quick Reply</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (5 cols): Operational Guarantees & Quick Actions */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-[#11131A] border border-[#1E2230]">
            <h3 className="font-display font-bold text-base text-[#F4F4F6] mb-3">
              Founder Quick Actions
            </h3>
            <div className="space-y-2.5">
              <button
                onClick={() => onSelectTab('inquiries')}
                className="w-full p-3 rounded-xl bg-[#08090D] hover:bg-[#161922] border border-[#1E2230] text-left text-xs font-medium text-[#F4F4F6] flex items-center justify-between group transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Inbox className="w-4 h-4 text-emerald-400" />
                  <span>Review Incoming Inquiries CRM</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#535868] group-hover:text-emerald-400 transition-colors" />
              </button>

              <button
                onClick={() => onSelectTab('projects')}
                className="w-full p-3 rounded-xl bg-[#08090D] hover:bg-[#161922] border border-[#1E2230] text-left text-xs font-medium text-[#F4F4F6] flex items-center justify-between group transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <FolderGit2 className="w-4 h-4 text-cyan-400" />
                  <span>Manage Production Projects Showcase</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#535868] group-hover:text-cyan-400 transition-colors" />
              </button>

              <button
                onClick={() => onSelectTab('profile')}
                className="w-full p-3 rounded-xl bg-[#08090D] hover:bg-[#161922] border border-[#1E2230] text-left text-xs font-medium text-[#F4F4F6] flex items-center justify-between group transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <UserCheck className="w-4 h-4 text-amber-400" />
                  <span>Update As-Sunnah & Trust Badges</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#535868] group-hover:text-amber-400 transition-colors" />
              </button>

              <Link
                href="/"
                className="w-full p-3 rounded-xl bg-[#08090D] hover:bg-[#161922] border border-[#1E2230] text-left text-xs font-medium text-[#F4F4F6] flex items-center justify-between group transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Preview Live Portfolio Frontend</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#535868] group-hover:text-emerald-400 transition-colors" />
              </Link>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0B0D13] border border-[#1E2230]">
            <div className="flex items-center gap-2 text-xs font-bold font-display text-emerald-400 mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Grounded in As-Sunnah Professional Ethics</span>
            </div>
            <p className="text-[11px] text-[#8E93A4] leading-relaxed">
              Transparent client commitments, 100% code ownership, red-green tested Next.js 15 architectures, and zero speculative vendor lock-in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
