'use client';

import { useState } from 'react';
import { portfolioData } from '@/data/portfolio';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export function Navbar() {
  const { person } = portfolioData;
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/projects' },
    { label: 'Services', href: '/services' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 sm:px-6 pointer-events-none">
      <nav className="pointer-events-auto flex items-center justify-between gap-4 sm:gap-8 px-4 sm:px-6 py-2.5 rounded-full bg-[#11131A]/90 backdrop-blur-xl border border-[#1E2230] shadow-2xl shadow-black/80 max-w-4xl w-full transition-all">
        {/* Profile Avatar / Brand */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus:outline-none"
        >
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#2E354B] group-hover:border-emerald-500/60 transition-colors shrink-0 bg-[#161922] shadow-sm">
            <Image
              src={person.photoUrl}
              alt={person.name}
              fill
              sizes="32px"
              className="object-cover object-top"
              priority
            />
          </div>
          <span className="font-display font-semibold text-sm tracking-tight text-[#F4F4F6] hidden sm:inline group-hover:text-emerald-400 transition-colors">
            {person.name}
          </span>
        </Link>

        {/* Desktop Multi-Page Links */}
        <div className="hidden md:flex items-center gap-6 text-xs font-medium tracking-wide">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors focus:outline-none py-1 relative ${
                  isActive
                    ? 'text-emerald-400 font-semibold'
                    : 'text-[#8E93A4] hover:text-[#F4F4F6]'
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="navbar-active-pill"
                    className="absolute bottom-0 inset-x-0 h-0.5 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                    transition={{
                      type: 'spring',
                      stiffness: 380,
                      damping: 32,
                    }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* CTA + Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <Link
            href="/hire"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F4F4F6] text-[#08090D] text-xs font-semibold hover:bg-emerald-400 hover:text-[#08090D] transition-all duration-200 active:scale-95 shadow-sm"
          >
            <span>Hire Me</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-8 h-8 rounded-full bg-[#161922] border border-[#1E2230] flex items-center justify-center text-[#F4F4F6] hover:border-emerald-500/40 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto fixed inset-x-4 top-20 p-5 rounded-3xl bg-[#11131A] border border-[#1E2230] shadow-2xl shadow-black/90 md:hidden flex flex-col gap-2 animate-fade-in z-50">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-2xl text-sm font-medium transition-colors flex items-center justify-between ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'text-[#8E93A4] hover:bg-[#161922] hover:text-[#F4F4F6]'
                }`}
              >
                <span>{link.label}</span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
              </Link>
            );
          })}

          <div className="pt-2 border-t border-[#1E2230] flex flex-col gap-2">
            <Link
              href="/hire"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-xl bg-emerald-500 text-[#08090D] text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <span>Hire Me</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
