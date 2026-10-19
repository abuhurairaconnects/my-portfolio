'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* 1. Top Architectural Laser Line: sweeps smoothly across the viewport on route switch */}
      <motion.div
        className="fixed top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent z-[10000] pointer-events-none origin-left shadow-[0_0_16px_rgba(16,185,129,0.9)]"
        initial={{ scaleX: 0, opacity: 1 }}
        animate={{ scaleX: 1, opacity: [1, 1, 0] }}
        transition={{
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
        }}
      />

      {/* 2. Four-Corner Architectural Reticles: swoop in from outside to frame the screen on page change */}
      {/* Top-Left Bracket */}
      <motion.div
        className="fixed top-3 left-3 sm:top-5 sm:left-5 w-10 h-10 sm:w-16 sm:h-16 border-t-2 border-l-2 border-emerald-400/90 rounded-tl-xl z-[9998] pointer-events-none shadow-[-4px_-4px_16px_rgba(16,185,129,0.4)]"
        initial={{ x: -50, y: -50, opacity: 0, scale: 0.8 }}
        animate={{
          x: [-50, 0, 0, -15],
          y: [-50, 0, 0, -15],
          opacity: [0, 1, 1, 0],
          scale: [0.8, 1, 1, 0.95],
        }}
        transition={{
          duration: 0.85,
          times: [0, 0.35, 0.75, 1],
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <span className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981]" />
      </motion.div>

      {/* Top-Right Bracket */}
      <motion.div
        className="fixed top-3 right-3 sm:top-5 sm:right-5 w-10 h-10 sm:w-16 sm:h-16 border-t-2 border-r-2 border-emerald-400/90 rounded-tr-xl z-[9998] pointer-events-none shadow-[4px_-4px_16px_rgba(16,185,129,0.4)]"
        initial={{ x: 50, y: -50, opacity: 0, scale: 0.8 }}
        animate={{
          x: [50, 0, 0, 15],
          y: [-50, 0, 0, -15],
          opacity: [0, 1, 1, 0],
          scale: [0.8, 1, 1, 0.95],
        }}
        transition={{
          duration: 0.85,
          times: [0, 0.35, 0.75, 1],
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981]" />
      </motion.div>

      {/* Bottom-Left Bracket */}
      <motion.div
        className="fixed bottom-3 left-3 sm:bottom-5 sm:left-5 w-10 h-10 sm:w-16 sm:h-16 border-b-2 border-l-2 border-emerald-400/90 rounded-bl-xl z-[9998] pointer-events-none shadow-[-4px_4px_16px_rgba(16,185,129,0.4)]"
        initial={{ x: -50, y: 50, opacity: 0, scale: 0.8 }}
        animate={{
          x: [-50, 0, 0, -15],
          y: [50, 0, 0, 15],
          opacity: [0, 1, 1, 0],
          scale: [0.8, 1, 1, 0.95],
        }}
        transition={{
          duration: 0.85,
          times: [0, 0.35, 0.75, 1],
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <span className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981]" />
      </motion.div>

      {/* Bottom-Right Bracket */}
      <motion.div
        className="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 w-10 h-10 sm:w-16 sm:h-16 border-b-2 border-r-2 border-emerald-400/90 rounded-br-xl z-[9998] pointer-events-none shadow-[4px_4px_16px_rgba(16,185,129,0.4)]"
        initial={{ x: 50, y: 50, opacity: 0, scale: 0.8 }}
        animate={{
          x: [50, 0, 0, 15],
          y: [50, 0, 0, 15],
          opacity: [0, 1, 1, 0],
          scale: [0.8, 1, 1, 0.95],
        }}
        transition={{
          duration: 0.85,
          times: [0, 0.35, 0.75, 1],
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <span className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981]" />
      </motion.div>

      {/* 3. Four-Direction Converging Aura Vignette: sweeps from all outer edges into view */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-[9997]"
        initial={{
          boxShadow: 'inset 0 0 160px 40px rgba(16, 185, 129, 0.35), inset 0 0 60px 15px rgba(16, 185, 129, 0.45)',
          opacity: 1,
        }}
        animate={{
          boxShadow: 'inset 0 0 0px 0px rgba(16, 185, 129, 0), inset 0 0 0px 0px rgba(16, 185, 129, 0)',
          opacity: 0,
        }}
        transition={{
          duration: 0.85,
          ease: [0.22, 1, 0.36, 1],
        }}
      />

      {/* 4. Main Page Content Entrance: graceful elevation, scale expansion, and blur dissolution */}
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.96,
          y: 28,
          filter: 'blur(10px)',
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
          filter: 'blur(0px)',
        }}
        transition={{
          duration: 0.75,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="w-full"
      >
        {children}
      </motion.div>
    </>
  );
}
