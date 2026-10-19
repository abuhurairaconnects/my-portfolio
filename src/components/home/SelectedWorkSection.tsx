'use client';

import { Project } from '@/types/portfolio';
import Link from 'next/link';
import { ExternalLink, Github, ArrowRight, CheckCircle2, Layers, Cpu, Sparkles } from 'lucide-react';
import Image from 'next/image';

interface SelectedWorkSectionProps {
  projects: Project[];
}

export function SelectedWorkSection({ projects }: SelectedWorkSectionProps) {
  const featured = projects.slice(0, 3);

  return (
    <section id="selected-work" className="py-20 border-t border-[#1E2230]/70 relative scroll-mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Selected Work</span>
            </div>

            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#F4F4F6] tracking-tight">
              Featured Production Systems
            </h2>

            <p className="text-xs sm:text-sm text-[#8E93A4] mt-2 leading-relaxed">
              Real-world web applications and AI automations engineered to solve tangible operational bottlenecks. Built with clean architecture, strict type safety, and zero placeholder code.
            </p>
          </div>

          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors shrink-0 group self-start md:self-end"
          >
            <span>View All Projects</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 3 Featured Projects Grid */}
        <div className="space-y-8">
          {featured.map((project, index) => (
            <article
              key={project.id}
              className="card-surface rounded-3xl p-6 sm:p-8 md:p-10 border border-[#1E2230] hover:border-emerald-500/40 transition-all duration-300 relative overflow-hidden group"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left: Project Details & Metrics (8 cols) */}
                <div className="lg:col-span-8 space-y-5">
                  {/* Category & Status Row */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                      {project.badge || project.category}
                    </span>
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#161922] border border-[#1E2230] text-[#8E93A4]">
                      {project.category}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400/90 ml-auto flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      {project.status}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#F4F4F6] group-hover:text-emerald-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-medium text-[#8E93A4] mt-1">
                      {project.subtitle}
                    </p>
                  </div>

                  {/* Problem & Solution Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                    <div className="p-4 rounded-2xl bg-[#08090D]/70 border border-[#1E2230]">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400/90 font-semibold block mb-1.5">
                        Operational Friction
                      </span>
                      <p className="text-xs text-[#8E93A4] leading-relaxed">
                        {project.problem}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#08090D]/70 border border-[#1E2230]">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold block mb-1.5">
                        Engineered Solution
                      </span>
                      <p className="text-xs text-[#8E93A4] leading-relaxed">
                        {project.solution}
                      </p>
                    </div>
                  </div>

                  {/* Highlights Bullet List */}
                  <div className="space-y-1.5 pt-1">
                    {project.architectureHighlights.slice(0, 3).map((item, hIdx) => (
                      <div key={hIdx} className="flex items-start gap-2 text-xs text-[#8E93A4]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-2">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-lg bg-[#08090D] border border-[#1E2230] text-[11px] font-mono text-[#8E93A4]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right: Key Metrics & Action Links (4 cols) */}
                <div className="lg:col-span-4 flex flex-col justify-between h-full space-y-6 lg:pl-4 lg:border-l lg:border-[#1E2230]/70">
                  {/* Metrics Box */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#08090D]/80 border border-[#1E2230] space-y-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#535868] block font-semibold">
                      System Metrics
                    </span>
                    {project.metrics.map((m, mIdx) => (
                      <div key={mIdx} className="flex flex-col border-b border-[#1E2230]/50 pb-2 last:border-0 last:pb-0">
                        <span className="font-display font-bold text-lg text-[#F4F4F6]">
                          {m.value}
                        </span>
                        <span className="text-[11px] font-mono text-emerald-400/90">
                          {m.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Action Links */}
                  <div className="space-y-2.5 pt-2">
                    {project.links.live && (
                      <a
                        href={project.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#08090D] text-xs font-semibold transition-all shadow-md shadow-emerald-500/10 active:scale-95"
                      >
                        <span>Open Live Platform</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}

                    {project.links.repo && (
                      <a
                        href={project.links.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#11131A] hover:bg-[#161922] border border-[#1E2230] hover:border-emerald-500/40 text-xs font-mono text-[#F4F4F6] transition-colors"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>Source Code</span>
                      </a>
                    )}

                    <Link
                      href={`/projects/${project.id}`}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs text-[#8E93A4] hover:text-emerald-400 font-mono transition-colors"
                    >
                      <span>Full Architectural Case Study</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
