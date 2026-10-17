'use client';

import { useState } from 'react';
import { Project } from '@/types/portfolio';
import { MasterProjectCard } from './MasterProjectCard';
import { SecondaryCard } from './SecondaryCard';
import { VoiceDemoCard } from './VoiceDemoCard';
import { ExternalLink, Github, Check } from 'lucide-react';

interface ProjectsDirectoryProps {
  projects: Project[];
}

export function ProjectsDirectory({ projects }: ProjectsDirectoryProps) {
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const categories = ['All', 'Full-Stack', 'AI Automation', 'Healthcare/Social', 'Developer Tools'];

  const filtered = activeFilter === 'All'
    ? projects
    : projects.filter((p) => p.category === activeFilter);

  return (
    <div className="space-y-10">
      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-6 border-b border-[#1E2230]">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-mono transition-all duration-200 active:scale-95 ${
              activeFilter === cat
                ? 'bg-emerald-500 text-[#08090D] font-bold shadow-lg shadow-emerald-500/10'
                : 'bg-[#11131A] text-[#8E93A4] hover:text-[#F4F4F6] border border-[#1E2230]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filtered Grid */}
      <div className="space-y-8">
        {filtered.map((project) => {
          if (project.id === 'madrasa-management') {
            return <MasterProjectCard key={project.id} project={project} />;
          }
          if (project.id === 'joruri-rokto') {
            return (
              <div key={project.id} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                <div className="lg:col-span-12">
                  <SecondaryCard project={project} />
                </div>
              </div>
            );
          }
          if (project.id === 'agro-voice-accountant') {
            return (
              <div key={project.id} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                <div className="lg:col-span-12">
                  <VoiceDemoCard project={project} />
                </div>
              </div>
            );
          }

          // Generic Project Card for other projects (NexusAI, etc.)
          return (
            <div
              key={project.id}
              className="card-surface rounded-3xl p-6 sm:p-8 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-[#161922] border border-[#1E2230] text-xs font-mono text-[#8E93A4]">
                    {project.category}
                  </span>
                  <span className="text-xs font-mono text-emerald-400">
                    {project.status}
                  </span>
                </div>

                <h3 className="font-display font-bold text-2xl text-[#F4F4F6] mb-1">
                  {project.title}
                </h3>
                <p className="text-xs text-[#8E93A4] font-medium mb-4">
                  {project.subtitle}
                </p>

                <p className="text-sm text-[#8E93A4] leading-relaxed mb-6">
                  {project.solution}
                </p>

                <div className="space-y-2 mb-6">
                  {project.architectureHighlights.map((highlight, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-[#8E93A4]">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#1E2230] flex flex-wrap items-center justify-between gap-3">
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

                {project.links.repo && (
                  <a
                    href={project.links.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#161922] hover:bg-[#1B1F2B] border border-[#1E2230] text-xs font-medium text-[#F4F4F6] transition-colors"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>View Repository</span>
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
