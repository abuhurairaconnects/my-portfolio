'use client';

import { useState } from 'react';
import { portfolioData } from '@/data/portfolio';
import { Project } from '@/types/portfolio';
import {
  ExternalLink,
  Github,
  Star,
  CheckCircle2,
  FolderGit2,
  Layers,
  Terminal,
} from 'lucide-react';

export function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>(portfolioData.projects);
  const [notice, setNotice] = useState<string | null>(null);

  const toggleFeatured = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, featured: !p.featured };
          setNotice(`Updated "${p.title}" featured status to ${updated.featured ? 'Enabled' : 'Disabled'}.`);
          setTimeout(() => setNotice(null), 3000);
          return updated;
        }
        return p;
      })
    );
  };

  return (
    <div className="space-y-6">
      {notice && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 flex items-center justify-between animate-fade-in">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)} className="text-[#8E93A4] hover:text-[#F4F4F6]">
            ✕
          </button>
        </div>
      )}

      <div className="flex items-center justify-between pb-4 border-b border-[#1E2230]">
        <div>
          <h2 className="font-display font-bold text-xl text-[#F4F4F6]">
            Production Projects Catalog
          </h2>
          <p className="text-xs text-[#8E93A4] mt-0.5">
            Manage showcase status, live URLs, and technical highlights for all {projects.length} systems.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-emerald-400">
            {projects.filter((p) => p.featured).length} Featured on Home/Directory
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {projects.map((project) => (
          <div
            key={project.id}
            className="p-6 rounded-2xl bg-[#11131A] border border-[#1E2230] hover:border-[#2E354B] transition-colors"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#161922] border border-[#1E2230] flex items-center justify-center text-emerald-400 shrink-0">
                  <FolderGit2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display font-bold text-lg text-[#F4F4F6]">
                      {project.title}
                    </h3>
                    <span className="px-2 py-0.5 rounded-md bg-[#161922] border border-[#1E2230] text-[10px] font-mono text-[#8E93A4]">
                      {project.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400">
                      {project.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#8E93A4] mt-1">
                    {project.subtitle}
                  </p>
                </div>
              </div>

              {/* Actions & Featured Toggle */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleFeatured(project.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all ${
                    project.featured
                      ? 'bg-amber-400/10 border border-amber-400/30 text-amber-300'
                      : 'bg-[#161922] border border-[#1E2230] text-[#8E93A4] hover:text-[#F4F4F6]'
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 ${project.featured ? 'fill-amber-400' : ''}`} />
                  <span>{project.featured ? 'Featured Master' : 'Make Featured'}</span>
                </button>

                {project.links.live && (
                  <a
                    href={project.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
                    title="Open Live Production URL"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                {project.links.repo && (
                  <a
                    href={project.links.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-[#161922] hover:bg-[#1B202D] text-[#8E93A4] hover:text-[#F4F4F6] border border-[#1E2230] transition-colors"
                    title="View GitHub Repository"
                  >
                    <Github className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

            {/* Architecture Highlights */}
            <div className="p-4 rounded-xl bg-[#08090D] border border-[#1E2230] mb-4">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#535868] block mb-2">
                Architecture & Engineering Specs:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {project.architectureHighlights.map((hl, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-[#8E93A4]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-snug">{hl}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-[#1E2230]">
              <span className="text-[10px] font-mono text-[#535868] mr-1">Stack:</span>
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 rounded-md bg-[#161922] border border-[#1E2230] text-[10px] font-mono text-[#8E93A4]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
