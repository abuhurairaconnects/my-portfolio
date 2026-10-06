"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

export type RevealDirection =
  | "left"
  | "right"
  | "up"
  | "down"
  | "scale"
  | "fade";

interface MotionRevealProps extends HTMLMotionProps<"div"> {
  direction?: RevealDirection;
  delay?: number;
  duration?: number;
  once?: boolean;
  className?: string;
  children: React.ReactNode;
}

// 100% Hardware-accelerated GPU transforms with willChange
// Offsets are natural, crisp, and prevent layout thrashing
const VARIANTS = {
  left: {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
  },
  right: {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 },
  },
  up: {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  },
  down: {
    hidden: { opacity: 0, y: -24 },
    visible: { opacity: 1, y: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
};

export function MotionReveal({
  direction = "up",
  delay = 0,
  duration = 0.45,
  once = false,
  className = "",
  children,
  ...props
}: MotionRevealProps): React.ReactElement {
  const variant = VARIANTS[direction];

  return (
    <motion.div
      variants={variant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-20px 0px" }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1], // Smooth Apple/Framer cubic bezier
      }}
      style={{ willChange: "transform, opacity" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function MotionStaggerContainer({
  children,
  className = "",
  staggerDelay = 0.06,
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}): React.ReactElement {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-20px 0px" }}
      transition={{
        staggerChildren: staggerDelay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
