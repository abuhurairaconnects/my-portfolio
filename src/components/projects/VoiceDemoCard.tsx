'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Project } from '@/types/portfolio';
import { Mic, Volume2, CheckCircle2, MessageSquare, Play, Sparkles, ArrowRight } from 'lucide-react';

interface VoiceDemoCardProps {
  project: Project;
}

export function VoiceDemoCard({ project }: VoiceDemoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [demoState, setDemoState] = useState<'idle' | 'listening' | 'parsed'>('idle');

  const simulateVoice = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    setDemoState('listening');

    setTimeout(() => {
      setDemoState('parsed');
      setIsPlaying(false);
    }, 1800);
  };

  return (
    <div className="card-surface rounded-3xl p-6 sm:p-8 flex flex-col justify-between group relative overflow-hidden">
      <div>
        {/* Category & Status */}
        <div className="flex items-center justify-between gap-2 mb-5">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono font-medium text-cyan-400">
              {project.badge || 'AI Voice & IoT'}
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
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-xl sm:text-2xl text-[#F4F4F6] group-hover:text-cyan-400 transition-colors">
              {project.title}
            </h3>
            <p className="text-xs text-[#8E93A4] font-medium">
              {project.subtitle}
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#8E93A4] leading-relaxed my-3">
          {project.problem}
        </p>

        {/* Interactive Bangla Speech Parser Interactive Box */}
        <div className="p-4 rounded-2xl bg-[#08090D] border border-[#1E2230] my-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Bangla Parser Demo</span>
            </span>

            <button
              onClick={simulateVoice}
              disabled={isPlaying}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-[11px] font-mono text-cyan-300 transition-all active:scale-95 disabled:opacity-50"
            >
              <Play className="w-3 h-3" />
              <span>{isPlaying ? 'Processing...' : 'Simulate Voice'}</span>
            </button>
          </div>

          {/* Voice Input State */}
          <div className="space-y-2">
            <div className="p-2.5 rounded-xl bg-[#11131A] border border-[#1E2230] text-xs">
              <span className="text-[10px] font-mono text-[#535868] block">Spoken Audio Sample (Bangla Voice Input):</span>
              <p className="font-medium text-[#F4F4F6] mt-0.5">
                &ldquo;Pond 2 received 25 KG Nourish feed, cost 3200 BDT&rdquo;
              </p>
            </div>

            {/* Simulated Parsed Result */}
            {demoState === 'parsed' ? (
              <div className="p-2.5 rounded-xl bg-cyan-950/20 border border-cyan-800/40 text-[11px] font-mono animate-fade-in text-cyan-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span>Target: Pond #2</span>
                  <span className="text-emerald-400">Qty: 25 KG Feed</span>
                </div>
                <div className="flex items-center justify-between text-[#8E93A4]">
                  <span>Expense: BDT 3,200</span>
                  <span className="text-cyan-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> SMS Dispatched
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-[11px] font-mono text-[#535868] text-center py-1.5 flex items-center justify-center gap-2">
                {isPlaying ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span className="text-cyan-300">Parsing Bangla syntax & intents...</span>
                  </>
                ) : (
                  <span>Click &quot;Simulate Voice&quot; to test the NLP pipeline</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Tangible Farm & Business Impact */}
        {project.businessImpact && project.businessImpact.length > 0 && (
          <div className="my-3 p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/25">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400 block mb-2">
              Tangible Farm & Operational ROI:
            </span>
            <ul className="space-y-1.5">
              {project.businessImpact.map((impact, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-cyan-200/90 font-sans">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{impact}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Tech Badges */}
      <div className="pt-4 border-t border-[#1E2230] flex flex-wrap items-center justify-between gap-3 mt-2">
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

          <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Automated SMS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
