'use client';

import { portfolioData } from '@/data/portfolio';
import { MasterProjectCard } from './MasterProjectCard';
import { SecondaryCard } from './SecondaryCard';
import { VoiceDemoCard } from './VoiceDemoCard';

export function BentoGrid() {
  const { projects } = portfolioData;

  const madrasaProject = projects.find((p) => p.id === 'madrasa-management') || projects[0];
  const joruriRoktoProject = projects.find((p) => p.id === 'joruri-rokto') || projects[1];
  const voiceProject = projects.find((p) => p.id === 'agro-voice-accountant') || projects[2];

  return (
    <section id="projects" className="py-20 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#11131A] border border-[#1E2230] text-xs font-mono text-emerald-400 mb-3">
              <span>01 // Selected Systems</span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[#F4F4F6] tracking-tight">
              Production Architecture & Systems
            </h2>
          </div>
          <p className="text-sm text-[#8E93A4] max-w-md leading-relaxed font-normal">
            Real software solving concrete friction across education, emergency healthcare, and voice-assisted agriculture. Zero dummy placeholders.
          </p>
        </div>

        {/* Asymmetric Bento Architecture */}
        <div className="space-y-6">
          {/* Top Master Hero Card */}
          <MasterProjectCard project={madrasaProject} />

          {/* Lower Two Flanking Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SecondaryCard project={joruriRoktoProject} />
            <VoiceDemoCard project={voiceProject} />
          </div>
        </div>
      </div>
    </section>
  );
}
