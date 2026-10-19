'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <div key={pathname} className="w-full">
      {/* 1. Top Architectural Laser Line: sweeps across the viewport */}
      <motion.div
        className="fixed top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent z-[9999] pointer-events-none origin-left shadow-[0_0_16px_rgba(16,185,129,0.9)]"
        initial={{ scaleX: 0, opacity: 1 }}
        animate={{ scaleX: 1, opacity: [1, 1, 0] }}
        transition={{
          duration: 0.85,
          ease: [0.22, 1, 0.36, 1],
        }}
      />

      {/* 2. Four-Quadrant Architectural Converging Shutter: swoops in from all 4 outer directions */}
      {/* Top-Left Quadrant */}
      <motion.div
        className="fixed top-0 left-0 w-1/2 h-1/2 bg-[#08090D] border-r-2 border-b-2 border-emerald-500/60 shadow-[4px_4px_30px_rgba(16,185,129,0.3)] z-[9990] pointer-events-none flex items-end justify-end p-4"
        initial={{ x: '-100%', y: '-100%' }}
        animate={{
          x: ['-100%', '0%', '0%', '-100%'],
          y: ['-100%', '0%', '0%', '-100%'],
        }}
        transition={{
          duration: 0.85,
          times: [0, 0.38, 0.58, 1],
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <div className="w-5 h-5 border-r-2 border-b-2 border-emerald-400" />
      </motion.div>

      {/* Top-Right Quadrant */}
      <motion.div
        className="fixed top-0 right-0 w-1/2 h-1/2 bg-[#08090D] border-l-2 border-b-2 border-emerald-500/60 shadow-[-4px_4px_30px_rgba(16,185,129,0.3)] z-[9990] pointer-events-none flex items-end justify-start p-4"
        initial={{ x: '100%', y: '-100%' }}
        animate={{
          x: ['100%', '0%', '0%', '100%'],
          y: ['100%', '0%', '0%', '100%'],
        }}
        transition={{
          duration: 0.85,
          times: [0, 0.38, 0.58, 1],
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <div className="w-5 h-5 border-l-2 border-b-2 border-emerald-400" />
      </motion.div>

      {/* Bottom-Left Quadrant */}
      <motion.div
        className="fixed bottom-0 left-0 w-1/2 h-1/2 bg-[#08090D] border-r-2 border-t-2 border-emerald-500/60 shadow-[4px_-4px_30px_rgba(16,185,129,0.3)] z-[9990] pointer-events-none flex items-start justify-end p-4"
        initial={{ x: '-100%', y: '100%' }}
        animate={{
          x: ['-100%', '0%', '0%', '-100%'],
          y: ['-100%', '0%', '0%', '-100%'],
        }}
        transition={{
          duration: 0.85,
          times: [0, 0.38, 0.58, 1],
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <div className="w-5 h-5 border-r-2 border-t-2 border-emerald-400" />
      </motion.div>

      {/* Bottom-Right Quadrant */}
      <motion.div
        className="fixed bottom-0 right-0 w-1/2 h-1/2 bg-[#08090D] border-l-2 border-t-2 border-emerald-500/60 shadow-[-4px_-4px_30px_rgba(16,185,129,0.3)] z-[9990] pointer-events-none flex items-start justify-start p-4"
        initial={{ x: '100%', y: '100%' }}
        animate={{
          x: ['100%', '0%', '0%', '100%'],
          y: ['100%', '0%', '0%', '100%'],
        }}
        transition={{
          duration: 0.85,
          times: [0, 0.38, 0.58, 1],
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <div className="w-5 h-5 border-l-2 border-t-2 border-emerald-400" />
      </motion.div>

      {/* 3. Center Confluence Reticle & Identity Node */}
      <motion.div
        className="fixed inset-0 flex items-center justify-center z-[9995] pointer-events-none"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: [0, 1, 1, 0],
          scale: [0.8, 1, 1, 1.1],
        }}
        transition={{
          duration: 0.85,
          times: [0, 0.38, 0.58, 1],
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <div className="px-5 py-3 rounded-2xl bg-[#08090D]/95 border border-emerald-500/50 shadow-[0_0_35px_rgba(16,185,129,0.45)] flex items-center gap-3">
          <div className="relative flex items-center justify-center w-3 h-3">
            <span className="absolute w-full h-full rounded-full bg-emerald-400 animate-ping opacity-75" />
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-bold">
            Abu Huraira // Systems Architect
          </span>
        </div>
      </motion.div>

      {/* 4. Four-Corner Accent Reticles */}
      <motion.div
        className="fixed top-3 left-3 sm:top-5 sm:left-5 w-12 h-12 sm:w-20 sm:h-20 border-t-[3px] border-l-[3px] border-emerald-400 rounded-tl-2xl z-[9998] pointer-events-none shadow-[-4px_-4px_20px_rgba(16,185,129,0.5)]"
        initial={{ opacity: 0, scale: 0.75 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0.75, 1, 1, 0.95] }}
        transition={{ duration: 0.85, times: [0, 0.35, 0.75, 1] }}
      >
        <span className="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_#10B981]" />
      </motion.div>

      <motion.div
        className="fixed top-3 right-3 sm:top-5 sm:right-5 w-12 h-12 sm:w-20 sm:h-20 border-t-[3px] border-r-[3px] border-emerald-400 rounded-tr-2xl z-[9998] pointer-events-none shadow-[4px_-4px_20px_rgba(16,185,129,0.5)]"
        initial={{ opacity: 0, scale: 0.75 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0.75, 1, 1, 0.95] }}
        transition={{ duration: 0.85, times: [0, 0.35, 0.75, 1] }}
      >
        <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_#10B981]" />
      </motion.div>

      <motion.div
        className="fixed bottom-3 left-3 sm:bottom-5 sm:left-5 w-12 h-12 sm:w-20 sm:h-20 border-b-[3px] border-l-[3px] border-emerald-400 rounded-bl-2xl z-[9998] pointer-events-none shadow-[-4px_4px_20px_rgba(16,185,129,0.5)]"
        initial={{ opacity: 0, scale: 0.75 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0.75, 1, 1, 0.95] }}
        transition={{ duration: 0.85, times: [0, 0.35, 0.75, 1] }}
      >
        <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_#10B981]" />
      </motion.div>

      <motion.div
        className="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 w-12 h-12 sm:w-20 sm:h-20 border-b-[3px] border-r-[3px] border-emerald-400 rounded-br-2xl z-[9998] pointer-events-none shadow-[4px_4px_20px_rgba(16,185,129,0.5)]"
        initial={{ opacity: 0, scale: 0.75 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0.75, 1, 1, 0.95] }}
        transition={{ duration: 0.85, times: [0, 0.35, 0.75, 1] }}
      >
        <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_#10B981]" />
      </motion.div>

      {/* 5. Main Page Content Entrance: timed to reveal right as the 4 shutters part open */}
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.98,
          y: 20,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        transition={{
          duration: 0.55,
          delay: 0.45,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="w-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
