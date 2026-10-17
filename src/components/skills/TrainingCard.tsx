'use client';

import { portfolioData } from '@/data/portfolio';
import { Award, BookOpen, Compass, CheckCircle2 } from 'lucide-react';

export function TrainingCard() {
  const { educationAndEthics } = portfolioData;

  const getIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Award className="w-5 h-5 text-emerald-400" />;
      case 1:
        return <BookOpen className="w-5 h-5 text-amber-400" />;
      default:
        return <Compass className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <div className="card-surface rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono font-medium text-emerald-400 mb-6">
          <span>Foundation & Ethics</span>
        </div>

        <h3 className="font-display font-bold text-2xl text-[#F4F4F6] tracking-tight mb-2">
          As-Sunnah Skill Development & Ethical Roots
        </h3>
        <p className="text-sm text-[#8E93A4] mb-8 leading-relaxed">
          Technical mastery paired with uncompromised ethics, disciplined time management, and a sense of accountability before clients and society.
        </p>

        <div className="space-y-6">
          {educationAndEthics.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#08090D] border border-[#1E2230] relative overflow-hidden group hover:border-[#2E354B] transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#161922] border border-[#1E2230] flex items-center justify-center shrink-0 mt-0.5">
                  {getIcon(idx)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <h4 className="font-display font-semibold text-base text-[#F4F4F6] group-hover:text-emerald-400 transition-colors">
                      {item.institution}
                    </h4>
                    {item.badge && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#161922] border border-[#1E2230] text-[#8E93A4]">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-medium text-emerald-400 font-mono mb-2">
                    {item.title}
                  </p>

                  <p className="text-xs text-[#8E93A4] leading-relaxed mb-3">
                    {item.description}
                  </p>

                  <ul className="space-y-1.5">
                    {item.highlights.map((highlight, hIdx) => (
                      <li key={hIdx} className="flex items-start gap-2 text-xs text-[#8E93A4]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400/80 shrink-0 mt-0.5" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
