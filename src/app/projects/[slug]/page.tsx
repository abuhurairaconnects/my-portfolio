import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { portfolioData } from '@/data/portfolio';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ExternalLink, 
  Github, 
  CheckCircle2, 
  Terminal, 
  Shield, 
  Cpu, 
  Sparkles, 
  Layers,
  Clock,
  ArrowRight
} from 'lucide-react';

interface CaseStudyProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const { projects } = portfolioData;
  const paths: { slug: string }[] = [];
  
  projects.forEach((p) => {
    paths.push({ slug: p.id });
    if (p.slug) {
      paths.push({ slug: p.slug });
    }
  });

  return paths;
}

export async function generateMetadata({ params }: CaseStudyProps): Promise<Metadata> {
  const { slug } = await params;
  const project = portfolioData.projects.find(
    (p) => p.id === slug || p.slug === slug
  );

  if (!project) {
    return {
      title: 'Project Not Found | Abu Huraira',
    };
  }

  return {
    title: `${project.title} — Architectural Case Study | Abu Huraira`,
    description: project.problem || project.subtitle,
  };
}

export default async function ProjectCaseStudyPage({ params }: CaseStudyProps) {
  const { slug } = await params;
  const project = portfolioData.projects.find(
    (p) => p.id === slug || p.slug === slug
  );

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-transparent text-[#F4F4F6] relative selection:bg-emerald-500/20 selection:text-emerald-300">
      <Navbar />

      <div className="pt-36 pb-24 max-w-5xl mx-auto px-4 sm:px-6">
        {/* Navigation Breadcrumb */}
        <ScrollReveal>
          <div className="mb-8">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-xs font-mono text-[#8E93A4] hover:text-emerald-400 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Projects Directory</span>
            </Link>
          </div>
        </ScrollReveal>

        {/* Case Study Header Hero */}
        <ScrollReveal delay={0.05}>
          <div className="p-8 sm:p-12 rounded-3xl bg-[#11131A] border border-[#1E2230] relative overflow-hidden shadow-2xl mb-12">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400">
                {project.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-[#161922] border border-[#1E2230] text-xs font-mono text-[#8E93A4]">
                Status: {project.status}
              </span>
            </div>

            <h1 className="font-display font-bold text-3xl sm:text-5xl text-[#F4F4F6] tracking-tight leading-tight mb-4">
              {project.title}
            </h1>

            <p className="text-base sm:text-lg text-[#8E93A4] leading-relaxed max-w-3xl mb-8">
              {project.subtitle}
            </p>

            {/* CTAs: Live Link & Repo */}
            <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-[#1E2230]">
              {project.links.live && (
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#08090D] font-display font-bold text-xs transition-all shadow-lg shadow-emerald-500/10 active:scale-95"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Launch Live Platform</span>
                </a>
              )}

              {project.links.repo && (
                <a
                  href={project.links.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#161922] hover:bg-[#1E2230] border border-[#1E2230] hover:border-emerald-500/40 text-xs font-mono text-[#F4F4F6] transition-colors"
                >
                  <Github className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Inspect Source Code</span>
                </a>
              )}
            </div>
          </div>
        </ScrollReveal>

        {/* 2-Column Deep Case Study Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Column (8 cols): Problem, Solution, Architecture */}
          <div className="lg:col-span-8 space-y-10">
            {/* 1. Problem Statement */}
            <ScrollReveal showHairline delay={0.1}>
              <div className="p-7 sm:p-8 rounded-3xl bg-[#0D0F15] border border-[#1E2230]">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-mono text-red-400 mb-4">
                  <span>01 // Operational Friction</span>
                </div>
                <h2 className="font-display font-bold text-2xl text-[#F4F4F6] mb-3">
                  The Problem & Target Context
                </h2>
                <p className="text-sm sm:text-base text-[#8E93A4] leading-relaxed">
                  {project.problem}
                </p>
              </div>
            </ScrollReveal>

            {/* 2. Engineered Solution */}
            <ScrollReveal showHairline delay={0.15}>
              <div className="p-7 sm:p-8 rounded-3xl bg-[#0D0F15] border border-[#1E2230]">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 mb-4">
                  <span>02 // Engineered Solution</span>
                </div>
                <h2 className="font-display font-bold text-2xl text-[#F4F4F6] mb-3">
                  System Architecture & Approach
                </h2>
                <p className="text-sm sm:text-base text-[#8E93A4] leading-relaxed mb-6">
                  {project.solution}
                </p>

                {/* Key Architectural Highlights */}
                <h3 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold mb-3">
                  Core Architectural Milestones:
                </h3>
                <div className="space-y-3">
                  {project.architectureHighlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#F4F4F6]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* 3. Business Impact & Measurable Outcomes */}
            {project.businessImpact && project.businessImpact.length > 0 && (
              <ScrollReveal showHairline delay={0.2}>
                <div className="p-7 sm:p-8 rounded-3xl bg-[#0D0F15] border border-[#1E2230]">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-mono text-blue-400 mb-4">
                    <span>03 // Verifiable Outcomes</span>
                  </div>
                  <h2 className="font-display font-bold text-2xl text-[#F4F4F6] mb-3">
                    Measurable Operational Impact
                  </h2>
                  <div className="space-y-3">
                    {project.businessImpact.map((impact, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#8E93A4]">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-2" />
                        <span>{impact}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}
          </div>

          {/* Sidebar Column (4 cols): Tech Stack, Role, Integrity Guarantee */}
          <div className="lg:col-span-4 space-y-6">
            {/* Tech Stack Box */}
            <ScrollReveal delay={0.1}>
              <div className="p-6 rounded-3xl bg-[#11131A] border border-[#1E2230]">
                <h3 className="font-display font-bold text-base text-[#F4F4F6] pb-3 border-b border-[#1E2230] mb-4 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>Technology Stack</span>
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-lg bg-[#08090D] border border-[#1E2230] text-xs font-mono text-[#F4F4F6]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* System Metrics Box */}
            {project.metrics && project.metrics.length > 0 && (
              <ScrollReveal delay={0.15}>
                <div className="p-6 rounded-3xl bg-[#11131A] border border-[#1E2230]">
                  <h3 className="font-display font-bold text-base text-[#F4F4F6] pb-3 border-b border-[#1E2230] mb-4 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-emerald-400" />
                    <span>Operational Metrics</span>
                  </h3>
                  <div className="space-y-3">
                    {project.metrics.map((m, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-[#08090D] border border-[#1E2230]">
                        <span className="text-[10px] font-mono text-[#8E93A4] uppercase block">
                          {m.label}
                        </span>
                        <span className="font-mono text-sm text-emerald-400 font-bold">
                          {m.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Engineering Ethics Card */}
            <ScrollReveal delay={0.2}>
              <div className="p-6 rounded-3xl bg-[#11131A] border border-[#1E2230] space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                  <Shield className="w-4 h-4" />
                  <span>As-Sunnah Standard</span>
                </div>
                <h4 className="font-display font-semibold text-sm text-[#F4F4F6]">
                  100% Code Ownership
                </h4>
                <p className="text-xs text-[#8E93A4] leading-relaxed">
                  Every project built by Abu Huraira is delivered with complete source code ownership, containerized Docker deployment, and zero proprietary lock-in.
                </p>
                <div className="pt-2">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <span>Request Similar System</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
