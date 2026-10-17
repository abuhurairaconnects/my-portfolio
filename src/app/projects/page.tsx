import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProjectsDirectory } from '@/components/projects/ProjectsDirectory';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { portfolioData } from '@/data/portfolio';

export const metadata: Metadata = {
  title: 'Production Case Studies & Systems | Abu Huraira',
  description: 'Explore full-stack web platforms, healthcare matching hubs, and Bangla voice automation systems built by Abu Huraira.',
};

export default function ProjectsPage() {
  const { projects, testimonials } = portfolioData;

  return (
    <main className="min-h-screen bg-transparent text-[#F4F4F6] relative selection:bg-emerald-500/20 selection:text-emerald-300">
      <Navbar />

      <div className="pt-36 pb-20 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Page Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 mb-4">
            <span>Engineering Showcase</span>
          </div>

          <h1 className="font-display font-bold text-4xl sm:text-5xl text-[#F4F4F6] tracking-tight mb-4">
            Production Case Studies & Systems
          </h1>

          <p className="text-base sm:text-lg text-[#8E93A4] leading-relaxed">
            Every application showcased here is a real-world, functional solution solving concrete operational friction—tested, containerized, and deployed with zero placeholder code.
          </p>
        </div>

        {/* Directory with Filters */}
        <ProjectsDirectory projects={projects} />
      </div>

      {/* Verified Client Testimonials */}
      <TestimonialsSection
        testimonials={testimonials}
        title="Client & Partner Project Evaluations"
        subtitle="Direct outcomes and feedback following production deployment and automation"
      />

      <Footer />
    </main>
  );
}

