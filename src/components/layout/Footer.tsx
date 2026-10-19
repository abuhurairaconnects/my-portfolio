'use client';

import { portfolioData } from '@/data/portfolio';
import {
  Mail,
  ArrowUp,
  ArrowUpRight,
  Phone,
  MapPin,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  const { person } = portfolioData;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const servicesLinks = [
    { label: 'Full-Stack Web Development', href: '/services#fullstack-web' },
    { label: 'Mobile-Friendly Apps (PWA)', href: '/services#pwa-apps' },
    { label: 'AI Business Automation & Workflows', href: '/services#ai-business-automation' },
    { label: 'Custom Cloud VPS & Docker Setup', href: '/services#api-backend-vps' },
    { label: 'E-Commerce & Scalable Store Platforms', href: '/services#ecommerce-platforms' },
    { label: 'Voice AI & Field Data Intelligence', href: '/services#voice-speech-ai' },
  ];

  const companyLinks = [
    { label: 'About Abu Huraira', href: '/about' },
    { label: 'As-Sunnah Ethical Training', href: '/about#ethics' },
    { label: 'Production Case Studies', href: '/projects' },
    { label: 'Technical Skills Matrix', href: '/services#skills' },
    { label: 'Client Endorsements & Proof', href: '/#testimonials' },
    { label: 'Start a Project (Hire Me)', href: '/hire' },
    { label: 'Direct Inquiry & Contact', href: '/contact' },
  ];

  return (
    <footer className="relative pt-16 pb-12 bg-[#050608] border-t border-[#1E2230] transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* 3-Column Fat Footer (Mega Directory / Sitemap) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-[#1E2230]/70">
          {/* Column 1: SERVICES (5 cols) */}
          <div className="md:col-span-5 flex flex-col items-start">
            <div className="w-8 h-1 bg-emerald-400 rounded-full mb-3" />
            <h4 className="font-display font-bold text-sm tracking-wider uppercase text-[#F4F4F6] mb-5">
              SERVICES
            </h4>

            <ul className="space-y-3 w-full">
              {servicesLinks.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-2 text-xs sm:text-sm text-[#8E93A4] hover:text-emerald-400 transition-colors"
                  >
                    <span className="text-emerald-400/80 group-hover:text-emerald-400 font-mono transition-colors">
                      ↗
                    </span>
                    <span className="group-hover:translate-x-0.5 transition-transform">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: COMPANY (4 cols) */}
          <div className="md:col-span-4 flex flex-col items-start">
            <div className="w-8 h-1 bg-cyan-400 rounded-full mb-3" />
            <h4 className="font-display font-bold text-sm tracking-wider uppercase text-[#F4F4F6] mb-5">
              COMPANY
            </h4>

            <ul className="space-y-3 w-full">
              {companyLinks.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-2 text-xs sm:text-sm text-[#8E93A4] hover:text-emerald-400 transition-colors"
                  >
                    <span className="text-cyan-400/80 group-hover:text-emerald-400 font-mono transition-colors">
                      ↗
                    </span>
                    <span className="group-hover:translate-x-0.5 transition-transform">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: CONTACT (3 cols) */}
          <div className="md:col-span-3 flex flex-col items-start">
            <div className="w-8 h-1 bg-emerald-400 rounded-full mb-3" />
            <h4 className="font-display font-bold text-sm tracking-wider uppercase text-[#F4F4F6] mb-5">
              CONTACT
            </h4>

            {/* Founder Info */}
            <div className="mb-4">
              <span className="text-[10px] font-mono text-[#535868] uppercase tracking-wider block font-semibold">
                FOUNDER & FULL-STACK ARCHITECT
              </span>
              <span className="font-display font-bold text-base text-[#F4F4F6] block mt-0.5">
                Abu Huraira
              </span>
            </div>

            {/* Direct Contact Points matching reference image */}
            <div className="space-y-3 w-full text-xs sm:text-sm">
              {/* WhatsApp / Phone */}
              <a
                href={person.social.whatsapp || 'https://wa.me/8801869171818'}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2.5 text-[#8E93A4] hover:text-emerald-400 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <span className="font-mono text-xs font-semibold text-[#F4F4F6] group-hover:text-emerald-400 transition-colors">
                  01869171818
                </span>
              </a>

              {/* Email */}
              <a
                href={`mailto:${person.social.email}`}
                className="group flex items-center gap-2.5 text-[#8E93A4] hover:text-emerald-400 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <span className="font-mono text-xs truncate max-w-[200px]">
                  {person.social.email}
                </span>
              </a>

              {/* Location */}
              <div className="flex items-center gap-2.5 text-[#8E93A4]">
                <div className="w-7 h-7 rounded-lg bg-[#161922] border border-[#1E2230] flex items-center justify-center text-emerald-400 shrink-0">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-mono">
                  Dhaka, Bangladesh
                </span>
              </div>
            </div>

            {/* Live Status Pill */}
            <div className="mt-5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Available for New Projects</span>
            </div>
          </div>
        </div>

        {/* Lower Row: Brand, Legal & Back to Top */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#535868]">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-[#161922] border border-[#2E354B] flex items-center justify-center text-xs font-mono font-bold text-emerald-400">
              {person.monogram}
            </div>
            <span className="text-[#8E93A4]">
              © 2026 Abu Huraira. All rights reserved. Built with Next.js & TypeScript.
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 hidden sm:inline">
              v2.7 Instant
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#11131A] hover:bg-[#161922] border border-[#1E2230] text-xs font-mono text-[#8E93A4] hover:text-[#F4F4F6] transition-colors"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
