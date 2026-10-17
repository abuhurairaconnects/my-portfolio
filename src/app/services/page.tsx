import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SkillsMatrix } from '@/components/skills/SkillsMatrix';
import { portfolioData } from '@/data/portfolio';
import { Globe, Code2, Cpu, Mic, ShoppingBag, CheckCircle2, ArrowRight, Clock, Target, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Services & Engineering Capabilities | Abu Huraira',
  description: 'Specialized Full-Stack Web Development, E-Commerce, and AI Business Automation services by Abu Huraira.',
};

export default function ServicesPage() {
  const { services, faqs } = portfolioData;

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Globe':
        return <Globe className="w-6 h-6 text-emerald-400" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-6 h-6 text-purple-400" />;
      case 'Code2':
        return <Code2 className="w-6 h-6 text-cyan-400" />;
      case 'Cpu':
        return <Cpu className="w-6 h-6 text-amber-400" />;
      default:
        return <Mic className="w-6 h-6 text-emerald-400" />;
    }
  };

  return (
    <main className="min-h-screen bg-transparent text-[#F4F4F6] relative selection:bg-emerald-500/20 selection:text-emerald-300">
      <Navbar />

      <div className="pt-36 pb-20 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Client Services & Offerings</span>
          </div>

          <h1 className="font-display font-bold text-4xl sm:text-5xl text-[#F4F4F6] tracking-tight mb-4">
            High-Impact Software Engineering & AI Automation
          </h1>

          <p className="text-base sm:text-lg text-[#8E93A4] leading-relaxed">
            Tailored web applications, headless e-commerce, and autonomous AI pipelines engineered for startups, enterprises, and ambitious founders. Built with sub-second speed, zero downtime, and transparent timelines.
          </p>
        </div>

        {/* Detailed Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {services.map((service) => (
            <div
              key={service.id}
              id={service.id}
              className="card-surface rounded-3xl p-7 sm:p-8 flex flex-col justify-between group hover:border-emerald-500/40 transition-all duration-300 scroll-mt-28"
            >
              <div>
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#161922] border border-[#1E2230] flex items-center justify-center">
                    {getServiceIcon(service.icon)}
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400">
                    {service.roleBadge}
                  </span>
                </div>

                <h2 className="font-display font-bold text-2xl text-[#F4F4F6] mb-3">
                  {service.title}
                </h2>

                <p className="text-sm text-[#8E93A4] leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Core Deliverables */}
                <div className="space-y-2.5 mb-6 p-4 rounded-2xl bg-[#08090D]/70 border border-[#1E2230]">
                  <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold block mb-2">
                    ✓ Core Deliverables:
                  </span>
                  {service.deliverables.map((item, dIdx) => (
                    <div key={dIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#F4F4F6]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                {/* Timeline & Ideal Target Box */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 text-xs font-mono">
                  {service.timeline && (
                    <div className="p-3 rounded-xl bg-[#161922] border border-[#1E2230] flex items-center gap-2 text-[#8E93A4]">
                      <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-[#535868] block">Delivery Timeline:</span>
                        <span className="text-[#F4F4F6] font-semibold">{service.timeline}</span>
                      </div>
                    </div>
                  )}

                  {service.idealFor && (
                    <div className="p-3 rounded-xl bg-[#161922] border border-[#1E2230] flex items-center gap-2 text-[#8E93A4]">
                      <Target className="w-4 h-4 text-cyan-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-[#535868] block">Ideal For:</span>
                        <span className="text-[#F4F4F6] font-semibold">{service.idealFor}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Technologies & Action Button */}
              <div className="pt-6 border-t border-[#1E2230] flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-1.5">
                  {service.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-lg bg-[#08090D] border border-[#1E2230] text-[11px] font-mono text-[#8E93A4]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#08090D] text-xs font-semibold transition-all shadow-md shadow-emerald-500/10 active:scale-95"
                >
                  <span>Inquire About Service</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* High-Impact Client CTA Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#11131A] via-[#141722] to-[#11131A] border border-emerald-500/30 mb-24 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider">
              Ready to collaborate?
            </span>
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#F4F4F6]">
              Need a custom platform or AI business workflow?
            </h3>
            <p className="text-xs sm:text-sm text-[#8E93A4] max-w-xl">
              Submit your project scope, timeline, and questions. Receive a concrete technical proposal and delivery roadmap within 24 hours.
            </p>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-[#08090D] font-display font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 active:scale-95 shrink-0"
          >
            <span>Get in Touch</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Embedded Complete Tech Matrix */}
        <div className="mb-24">
          <SkillsMatrix />
        </div>

        {/* Client FAQs */}
        <div className="max-w-4xl mx-auto pt-12 border-t border-[#1E2230]">
          <div className="text-center mb-12">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider block mb-2">
              Common Questions
            </span>
            <h2 className="font-display font-bold text-3xl text-[#F4F4F6]">
              Client Collaboration FAQ
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, fIdx) => (
              <div
                key={fIdx}
                className="p-6 rounded-2xl bg-[#11131A] border border-[#1E2230]"
              >
                <span className="text-[11px] font-mono text-emerald-400 block mb-1">
                  // {faq.category}
                </span>
                <h3 className="font-display font-semibold text-base text-[#F4F4F6] mb-2">
                  {faq.question}
                </h3>
                <p className="text-xs sm:text-sm text-[#8E93A4] leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
