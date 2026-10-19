'use client';

import Link from 'next/link';
import { Project } from '@/types/portfolio';
import { HeartHandshake, ShieldAlert, PhoneCall, Check, ArrowRight } from 'lucide-react';

interface SecondaryCardProps {
  project: Project;
}

export function SecondaryCard({ project }: SecondaryCardProps) {
  return (
    <div className="card-surface rounded-3xl p-6 sm:p-8 flex flex-col justify-between group relative overflow-hidden">
      <div>
        {/* Category & Status */}
        <div className="flex items-center justify-between gap-2 mb-5">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-xs font-mono font-medium text-rose-400">
              {project.badge || 'Healthcare Platform'}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-[#161922] border border-[#1E2230] text-[11px] font-mono text-[#8E93A4]">
              {project.category}
            </span>
          </div>
          <span className="text-[11px] font-mono text-[#535868]">
            {project.status}
          </span>
        </div>

        {/* Title & Tagline */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-xl sm:text-2xl text-[#F4F4F6] group-hover:text-rose-400 transition-colors">
              {project.title}
            </h3>
            <p className="text-xs text-[#8E93A4] font-medium">
              {project.subtitle}
            </p>
          </div>
        </div>

        {/* Core Value Proposition */}
        <p className="text-xs sm:text-sm text-[#8E93A4] leading-relaxed my-4">
          {project.solution}
        </p>

        {/* Architectural Features Pills */}
        <div className="space-y-2 my-5">
          {project.architectureHighlights.map((feature, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-[#8E93A4]">
              <Check className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        {/* Tangible Client & Social Impact */}
        {project.businessImpact && project.businessImpact.length > 0 && (
          <div className="my-4 p-4 rounded-2xl bg-rose-950/20 border border-rose-500/25">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-rose-400 block mb-2">
              Direct Real-World Impact:
            </span>
            <ul className="space-y-1.5">
              {project.businessImpact.map((impact, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-rose-200/90 font-sans">
                  <Check className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                  <span>{impact}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Tech Badges */}
      <div className="pt-5 border-t border-[#1E2230] flex flex-wrap items-center justify-between gap-3 mt-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 rounded-md bg-[#08090D] border border-[#1E2230] text-[10px] font-mono text-[#8E93A4]"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/projects/${project.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#161922] hover:bg-[#1E2230] border border-[#1E2230] hover:border-emerald-500/40 text-xs font-mono text-[#F4F4F6] transition-colors"
          >
            <span>Case Study</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
          </Link>

          <div className="flex items-center gap-1.5 text-xs font-mono text-rose-400">
            <PhoneCall className="w-3.5 h-3.5" />
            <span>1-Tap Dialing</span>
          </div>
        </div>
      </div>
    </div>
  );
}
