'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  showHairline?: boolean;
}

export function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  showHairline = false,
}: ScrollRevealProps) {
  const getOffset = () => {
    switch (direction) {
      case 'up':
        return { y: 32, x: 0 };
      case 'down':
        return { y: -32, x: 0 };
      case 'left':
        return { y: 0, x: 32 };
      case 'right':
        return { y: 0, x: -32 };
      case 'none':
        return { y: 0, x: 0 };
    }
  };

  const offset = getOffset();

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: offset.x,
        y: offset.y,
        filter: 'blur(6px)',
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        filter: 'blur(0px)',
      }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`relative ${className}`}
    >
      {showHairline && (
        <motion.div
          className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent pointer-events-none"
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: delay + 0.1, ease: [0.16, 1, 0.3, 1] }}
        />
      )}
      {children}
    </motion.div>
  );
}
