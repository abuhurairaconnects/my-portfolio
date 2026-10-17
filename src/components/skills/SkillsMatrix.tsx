'use client';

import { portfolioData } from '@/data/portfolio';
import { TrainingCard } from './TrainingCard';
import { Layout, Server, Bot, Terminal } from 'lucide-react';

export function SkillsMatrix() {
  const { skills } = portfolioData;

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layout':
        return <Layout className="w-5 h-5 text-emerald-400" />;
      case 'Server':
        return <Server className="w-5 h-5 text-cyan-400" />;
      case 'Bot':
        return <Bot className="w-5 h-5 text-amber-400" />;
      default:
        return <Terminal className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <section id="skills" className="py-20 relative scroll-mt-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#11131A] border border-[#1E2230] text-xs font-mono text-emerald-400 mb-3">
              <span>02 // Capabilities & Ethics</span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[#F4F4F6] tracking-tight">
              Engineering Stack & Foundations
            </h2>
          </div>
          <p className="text-sm text-[#8E93A4] max-w-md leading-relaxed">
            Proven modern web and AI toolchains anchored by disciplined execution from As-Sunnah Skill Development.
          </p>
        </div>

        {/* Dual Pillar Matrix: Tech Stack on Left, Ethics/Training on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (7 cols): Tech Stack Bento Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {skills.map((category, idx) => (
              <div
                key={idx}
                className="card-surface rounded-2xl p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#161922] border border-[#1E2230] flex items-center justify-center mb-4">
                    {getCategoryIcon(category.icon)}
                  </div>

                  <h3 className="font-display font-bold text-lg text-[#F4F4F6] mb-1">
                    {category.title}
                  </h3>
                  <p className="text-xs text-[#8E93A4] mb-4">
                    {category.subtitle}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {category.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2.5 py-1 rounded-lg bg-[#08090D] border border-[#1E2230] text-xs font-mono text-[#F4F4F6] hover:border-emerald-500/40 transition-colors"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column (5 cols): As-Sunnah Skill Development & Ethical Training */}
          <div className="lg:col-span-5">
            <TrainingCard />
          </div>
        </div>
      </div>
    </section>
  );
}
