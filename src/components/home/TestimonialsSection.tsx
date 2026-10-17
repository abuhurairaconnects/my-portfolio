'use client';

import { Testimonial } from '@/types/portfolio';
import { Quote, CheckCircle, Star } from 'lucide-react';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  title?: string;
  subtitle?: string;
}

export function TestimonialsSection({
  testimonials,
  title = 'Client & Partner Endorsements',
  subtitle = 'Authentic evaluations from leaders and stakeholders on real-world delivery impact',
}: TestimonialsSectionProps) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="py-20 border-t border-[#1E2230]/70 relative scroll-mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 mb-3">
            <Star className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
            <span>Verified Endorsements</span>
          </div>

          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#F4F4F6] tracking-tight">
            {title}
          </h2>

          <p className="text-xs sm:text-sm text-[#8E93A4] mt-2 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Testimonials 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="card-surface rounded-3xl p-6 sm:p-7 flex flex-col justify-between group hover:border-emerald-500/40 transition-all duration-300"
            >
              <div>
                {/* Header Quote Icon & Associated Project */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Quote className="w-4 h-4 rotate-180" />
                  </div>

                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#161922] border border-[#1E2230] text-[#8E93A4] max-w-[200px] truncate">
                    {item.projectAssociated}
                  </span>
                </div>

                {/* Quote Text */}
                <p className="text-xs sm:text-sm text-[#C4C7D4] leading-relaxed mb-6 font-sans italic">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              {/* Author & Org Footer */}
              <div className="pt-4 border-t border-[#1E2230] flex items-center justify-between">
                <div>
                  <h4 className="font-display font-bold text-sm text-[#F4F4F6]">
                    {item.author}
                  </h4>
                  <p className="text-[11px] text-[#8E93A4] mt-0.5">
                    {item.role}, <span className="text-emerald-400/90">{item.organization}</span>
                  </p>
                </div>

                {item.verified && (
                  <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 shrink-0">
                    <CheckCircle className="w-3 h-3" />
                    <span>Verified</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
