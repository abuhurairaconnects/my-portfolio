import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/hero/HeroSection';
import { SelectedWorkSection } from '@/components/home/SelectedWorkSection';
import { ServicesTeaser } from '@/components/home/ServicesTeaser';
import { SkillsMatrix } from '@/components/skills/SkillsMatrix';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { ConversionBanner } from '@/components/home/ConversionBanner';
import { Footer } from '@/components/layout/Footer';
import { portfolioData } from '@/data/portfolio';
import Link from 'next/link';
import { ArrowRight, FolderKanban, Wrench, GraduationCap, Sparkles } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export const metadata: Metadata = {
  title: 'Abu Huraira | Full-Stack Web Developer & Software Engineer',
  description: 'I build fast web platforms, software products, and AI automations that remove manual work and turn visitors into clients.',
};

export default function HomePage() {
  const exploreGateways = [
    {
      title: 'Production Projects',
      subtitle: 'Madrasa Management, Joruri Rokto & Bangla Voice Farm Accountant',
      href: '/projects',
      badge: 'Case Studies',
      icon: FolderKanban,
      action: 'Open Projects Directory',
    },
    {
      title: 'Services & Tech Stack',
      subtitle: 'Full-Stack Web Apps, AI Business Automations & Voice Solutions',
      href: '/services',
      badge: 'Client Offerings',
      icon: Wrench,
      action: 'View All Services',
    },
    {
      title: 'About & Working Ethics',
      subtitle: 'As-Sunnah training, ethical software engineering & personal narrative',
      href: '/about',
      badge: 'Background',
      icon: GraduationCap,
      action: 'Read Personal Story',
    },
    {
      title: 'Contact & Inquiries',
      subtitle: 'Direct channels, collaboration inquiries & technical consultations',
      href: '/contact',
      badge: 'Communication',
      icon: Sparkles,
      action: 'Open Contact Channels',
    },
  ];

  return (
    <main className="min-h-screen bg-transparent text-[#F4F4F6] relative selection:bg-emerald-500/20 selection:text-emerald-300">
      <Navbar />
      
      {/* 1. Commanding Hero with clean photo & clear CTAs */}
      <HeroSection />

      {/* 2. Featured Selected Work Showcase (Flagship Production Systems) */}
      <ScrollReveal showHairline>
        <SelectedWorkSection projects={portfolioData.projects} />
      </ScrollReveal>

      {/* 3. Core Client Services & Value Offerings */}
      <ScrollReveal showHairline delay={0.05}>
        <ServicesTeaser />
      </ScrollReveal>

      {/* 4. Engineering Capabilities & As-Sunnah Ethical Foundations */}
      <ScrollReveal showHairline delay={0.05}>
        <SkillsMatrix />
      </ScrollReveal>

      {/* 5. Focused Navigation Gateways to Deep Subpages */}
      <ScrollReveal showHairline delay={0.05}>
        <section className="py-20 border-t border-[#1E2230]/70 bg-[#06070A]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mb-12">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider block mb-2">
                Deep Explanations & Dedicated Sections
              </span>
              <h2 className="font-display font-bold text-2xl sm:text-4xl text-[#F4F4F6] tracking-tight">
                Where would you like to explore next?
              </h2>
              <p className="text-xs sm:text-sm text-[#8E93A4] mt-2 leading-relaxed">
                Every domain is documented with transparent engineering case studies, full tech breakdowns, and direct communication channels.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {exploreGateways.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={idx}
                    href={item.href}
                    className="card-surface rounded-2xl p-6 sm:p-7 flex flex-col justify-between group hover:border-emerald-500/40 transition-all hover:-translate-y-1"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-[#161922] border border-[#1E2230] flex items-center justify-center text-emerald-400 group-hover:border-emerald-500/30 transition-colors">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {item.badge}
                        </span>
                      </div>

                      <h3 className="font-display font-bold text-xl text-[#F4F4F6] group-hover:text-emerald-400 transition-colors mb-2">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#8E93A4] leading-relaxed mb-4">
                        {item.subtitle}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#1E2230] flex items-center justify-between text-xs font-semibold text-emerald-400">
                      <span>{item.action}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 6. Authentic Client Testimonials (Grounded evaluations) */}
      <ScrollReveal showHairline delay={0.05}>
        <TestimonialsSection testimonials={portfolioData.testimonials} />
      </ScrollReveal>

      {/* 7. Direct Collaboration & High-Intent Conversion Banner */}
      <ScrollReveal showHairline delay={0.05}>
        <ConversionBanner />
      </ScrollReveal>

      {/* 8. Footer */}
      <Footer />
    </main>
  );
}
