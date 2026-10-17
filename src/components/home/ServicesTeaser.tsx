'use client';

import Link from 'next/link';
import { portfolioData } from '@/data/portfolio';
import { ArrowRight, Globe, Code2, Cpu, Mic } from 'lucide-react';

export function ServicesTeaser() {
  const { services } = portfolioData;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Globe':
        return <Globe className="w-5 h-5 text-emerald-400" />;
      case 'Code2':
        return <Code2 className="w-5 h-5 text-cyan-400" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-amber-400" />;
      default:
        return <Mic className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <section className="py-20 bg-[#06070A] border-y border-[#1E2230]/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 mb-3">
              <span>What I Deliver for Clients</span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#F4F4F6] tracking-tight">
              Specialized Engineering Offerings
            </h2>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <span>Explore All Services & Tech Stack</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4 Pillar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="card-surface rounded-2xl p-6 flex flex-col justify-between group hover:border-emerald-500/40"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#161922] border border-[#1E2230] flex items-center justify-center mb-4 group-hover:border-emerald-500/30 transition-colors">
                  {getIcon(service.icon)}
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 block w-fit mb-2">
                  {service.roleBadge}
                </span>

                <h3 className="font-display font-bold text-lg text-[#F4F4F6] mb-2 group-hover:text-emerald-400 transition-colors">
                  {service.title}
                </h3>

                <p className="text-xs text-[#8E93A4] leading-relaxed">
                  {service.shortDesc}
                </p>
              </div>

              <div className="pt-4 border-t border-[#1E2230] mt-6 flex items-center justify-between text-xs text-[#8E93A4]">
                <span className="font-mono text-[11px]">Production-Ready</span>
                <Link
                  href="/services"
                  className="text-emerald-400 hover:underline flex items-center gap-1 font-medium"
                >
                  <span>Learn more</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
