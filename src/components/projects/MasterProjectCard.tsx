'use client';

import Image from 'next/image';
import { Project } from '@/types/portfolio';
import { ExternalLink, Github, Check, Server, ShieldCheck, Cpu } from 'lucide-react';

interface MasterProjectCardProps {
  project: Project;
}

export function MasterProjectCard({ project }: MasterProjectCardProps) {
  return (
    <div className="card-surface rounded-3xl p-6 sm:p-8 md:p-10 relative overflow-hidden flex flex-col justify-between group">
      {/* Background Accent Subtle Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div>
        {/* Header Tags & Status */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono font-medium text-emerald-400">
              {project.badge || 'Featured Flagship'}
            </span>
            <span className="px-3 py-1 rounded-full bg-[#161922] border border-[#1E2230] text-xs font-mono text-[#8E93A4]">
              {project.category}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#8E93A4]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{project.status}</span>
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-[#161922] border border-[#1E2230] shrink-0 p-1 flex items-center justify-center">
            <Image
              src="/madrasa-logo.png"
              alt="Madrasa Management Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div>
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#F4F4F6] tracking-tight group-hover:text-emerald-400 transition-colors">
              {project.title}
            </h3>
            <p className="text-sm font-medium text-[#8E93A4] mt-0.5">
              {project.subtitle}
            </p>
          </div>
        </div>

        {/* Problem & Solution Block */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 text-xs sm:text-sm">
          <div className="p-4 rounded-2xl bg-[#08090D]/60 border border-[#1E2230]/80">
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400/90 font-semibold block mb-1.5">
              The Real-World Friction
            </span>
            <p className="text-[#8E93A4] leading-relaxed">
              {project.problem}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#08090D]/60 border border-[#1E2230]/80">
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold block mb-1.5">
              Architectural Solution
            </span>
            <p className="text-[#8E93A4] leading-relaxed">
              {project.solution}
            </p>
          </div>
        </div>

        {/* Architecture Highlights */}
        <div className="my-6">
          <span className="text-xs font-mono uppercase tracking-wider text-[#535868] block mb-3">
            Core Engineering Highlights
          </span>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {project.architectureHighlights.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-[#8E93A4]">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tangible Client & Business Impact */}
        {project.businessImpact && project.businessImpact.length > 0 && (
          <div className="my-6 p-4 sm:p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                Tangible Client & Operational Impact
              </span>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {project.businessImpact.map((impact, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-emerald-200/90 leading-relaxed font-sans">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{impact}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer: Tech Stack Badges & Links */}
      <div className="pt-6 border-t border-[#1E2230] flex flex-wrap items-center justify-between gap-4 mt-6">
        <div className="flex flex-wrap items-center gap-1.5">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 rounded-lg bg-[#08090D] border border-[#1E2230] text-[11px] font-mono text-[#8E93A4]"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {project.links.repo && (
            <a
              href={project.links.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#161922] hover:bg-[#1B1F2B] border border-[#1E2230] text-xs font-medium text-[#F4F4F6] transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>Source</span>
            </a>
          )}

          {project.links.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-xs font-semibold text-[#08090D] transition-all shadow-md shadow-emerald-500/10 active:scale-95"
            >
              <span>Live Application</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
