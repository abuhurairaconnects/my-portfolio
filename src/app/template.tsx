'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* 1. Top Architectural Laser Line: sweeps smoothly across the viewport on route switch */}
      <motion.div
        className="fixed top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent z-[10000] pointer-events-none origin-left shadow-[0_0_12px_rgba(16,185,129,0.8)]"
        initial={{ scaleX: 0, opacity: 1 }}
        animate={{ scaleX: 1, opacity: [1, 1, 0] }}
        transition={{
          duration: 0.55,
          ease: [0.16, 1, 0.3, 1],
        }}
      />

      {/* 2. Four-Corner Architectural Aperture Glow: converges from all edges inward on page change */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-[9998]"
        initial={{
          boxShadow: 'inset 0 0 100px 20px rgba(16, 185, 129, 0.18)',
          opacity: 1,
        }}
        animate={{
          boxShadow: 'inset 0 0 0px 0px rgba(16, 185, 129, 0)',
          opacity: 0,
        }}
        transition={{
          duration: 0.65,
          ease: [0.16, 1, 0.3, 1],
        }}
      />

      {/* 3. Main Page Content Entrance: expands smoothly with scale, blur dissolution, and opacity */}
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.98,
          y: 16,
          filter: 'blur(8px)',
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
          filter: 'blur(0px)',
        }}
        exit={{
          opacity: 0,
          scale: 0.99,
          filter: 'blur(4px)',
        }}
        transition={{
          duration: 0.48,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="w-full"
      >
        {children}
      </motion.div>
    </>
  );
}
