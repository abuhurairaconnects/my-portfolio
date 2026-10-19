'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  const getSectionTitle = (path: string) => {
    if (path === '/') return 'HOME // MAIN PORTFOLIO';
    if (path.startsWith('/projects/')) {
      const slug = path.replace('/projects/', '').replace(/-/g, ' ').toUpperCase();
      return `CASE STUDY // ${slug}`;
    }
    if (path === '/projects') return 'PROJECTS // CASE STUDIES & SYSTEMS';
    if (path === '/services') return 'SERVICES // ENGINEERING OFFERINGS';
    if (path === '/about') return 'ABOUT // ETHICS & AS-SUNNAH FOUNDATION';
    if (path === '/contact') return 'CONTACT // DIRECT COMMUNICATION';
    if (path === '/hire') return 'HIRE ME // HIGH-INTENT PROJECT BRIEF';
    return path.replace('/', '').toUpperCase() + ' // VERIFIED SECURE PORTAL';
  };

  const sectionTitle = getSectionTitle(pathname);

  return (
    <div key={pathname} className="w-full relative">
      {/* 1. Top Architectural Laser Line: sweeps across the viewport */}
      <motion.div
        className="fixed top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent z-[9999] pointer-events-none origin-left shadow-[0_0_16px_rgba(16,185,129,0.9)]"
        initial={{ scaleX: 0, opacity: 1 }}
        animate={{ scaleX: 1, opacity: [1, 1, 0] }}
        transition={{
          duration: 0.75,
          ease: [0.16, 1, 0.3, 1],
        }}
      />

      {/* 2. Ambient Translucent Backdrop Veil (Never blocks completely, keeps design luminous) */}
      <motion.div
        className="fixed inset-0 bg-[#08090D]/85 backdrop-blur-md z-[9980] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.85, 0] }}
        transition={{
          duration: 0.75,
          times: [0, 0.4, 1],
          ease: [0.16, 1, 0.3, 1],
        }}
      />

      {/* 3. Four-Direction Converging Corner Frames: sweeps in from all 4 outer directions */}
      {/* Top-Left Corner Bracket */}
      <motion.div
        className="fixed top-0 left-0 w-32 sm:w-48 h-32 sm:h-48 border-t-2 border-l-2 border-emerald-400/80 rounded-tl-3xl z-[9990] pointer-events-none shadow-[-4px_-4px_30px_rgba(16,185,129,0.4)] p-3 flex flex-col justify-start items-start"
        initial={{ x: '-120%', y: '-120%', opacity: 0 }}
        animate={{
          x: ['-120%', '0%', '0%', '-120%'],
          y: ['-120%', '0%', '0%', '-120%'],
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration: 0.75,
          times: [0, 0.35, 0.65, 1],
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <span className="text-[9px] font-mono text-emerald-400/80 font-bold tracking-widest uppercase">
          SEC // 01 [TL]
        </span>
        <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1 shadow-[0_0_8px_#10B981]" />
      </motion.div>

      {/* Top-Right Corner Bracket */}
      <motion.div
        className="fixed top-0 right-0 w-32 sm:w-48 h-32 sm:h-48 border-t-2 border-r-2 border-emerald-400/80 rounded-tr-3xl z-[9990] pointer-events-none shadow-[4px_-4px_30px_rgba(16,185,129,0.4)] p-3 flex flex-col justify-start items-end"
        initial={{ x: '120%', y: '-120%', opacity: 0 }}
        animate={{
          x: ['120%', '0%', '0%', '120%'],
          y: ['120%', '0%', '0%', '120%'],
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration: 0.75,
          times: [0, 0.35, 0.65, 1],
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <span className="text-[9px] font-mono text-emerald-400/80 font-bold tracking-widest uppercase">
          SEC // 02 [TR]
        </span>
        <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1 shadow-[0_0_8px_#10B981]" />
      </motion.div>

      {/* Bottom-Left Corner Bracket */}
      <motion.div
        className="fixed bottom-0 left-0 w-32 sm:w-48 h-32 sm:h-48 border-b-2 border-l-2 border-emerald-400/80 rounded-bl-3xl z-[9990] pointer-events-none shadow-[-4px_4px_30px_rgba(16,185,129,0.4)] p-3 flex flex-col justify-end items-start"
        initial={{ x: '-120%', y: '120%', opacity: 0 }}
        animate={{
          x: ['-120%', '0%', '0%', '-120%'],
          y: ['-120%', '0%', '0%', '-120%'],
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration: 0.75,
          times: [0, 0.35, 0.65, 1],
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <div className="w-2 h-2 rounded-full bg-emerald-400 mb-1 shadow-[0_0_8px_#10B981]" />
        <span className="text-[9px] font-mono text-emerald-400/80 font-bold tracking-widest uppercase">
          SEC // 03 [BL]
        </span>
      </motion.div>

      {/* Bottom-Right Corner Bracket */}
      <motion.div
        className="fixed bottom-0 right-0 w-32 sm:w-48 h-32 sm:h-48 border-b-2 border-r-2 border-emerald-400/80 rounded-br-3xl z-[9990] pointer-events-none shadow-[4px_4px_30px_rgba(16,185,129,0.4)] p-3 flex flex-col justify-end items-end"
        initial={{ x: '120%', y: '120%', opacity: 0 }}
        animate={{
          x: ['120%', '0%', '0%', '120%'],
          y: ['120%', '0%', '0%', '120%'],
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration: 0.75,
          times: [0, 0.35, 0.65, 1],
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <div className="w-2 h-2 rounded-full bg-emerald-400 mb-1 shadow-[0_0_8px_#10B981]" />
        <span className="text-[9px] font-mono text-emerald-400/80 font-bold tracking-widest uppercase">
          SEC // 04 [BR]
        </span>
      </motion.div>

      {/* 4. Center HUD Route Identifier & Beacon */}
      <motion.div
        className="fixed inset-0 flex items-center justify-center z-[9995] pointer-events-none px-4"
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{
          opacity: [0, 1, 1, 0],
          scale: [0.88, 1, 1, 1.05],
        }}
        transition={{
          duration: 0.75,
          times: [0, 0.35, 0.65, 1],
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <div className="px-6 py-3.5 rounded-2xl bg-[#08090D]/95 border border-emerald-500/60 shadow-[0_0_40px_rgba(16,185,129,0.45)] flex items-center gap-3.5 max-w-lg text-center backdrop-blur-xl">
          <div className="relative flex items-center justify-center w-3 h-3 shrink-0">
            <span className="absolute w-full h-full rounded-full bg-emerald-400 animate-ping opacity-75" />
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <span className="font-mono text-xs sm:text-sm uppercase tracking-widest text-emerald-400 font-bold truncate">
            {sectionTitle}
          </span>
        </div>
      </motion.div>

      {/* 5. Main Page Content Entrance: timed to reveal smoothly as the outer brackets part */}
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.98,
          y: 18,
          filter: 'blur(4px)',
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
          filter: 'blur(0px)',
        }}
        transition={{
          duration: 0.55,
          delay: 0.25,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="w-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
