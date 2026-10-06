"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { portfolio } from "@/data/portfolio";
import { PortfolioData } from "@/lib/validations";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TechIcon } from "@/components/ui/TechIcon";
import { MotionReveal } from "@/components/ui/MotionReveal";

interface TechStackProps {
  data?: PortfolioData;
}

export function TechStack({ data = portfolio }: TechStackProps): React.ReactElement {
  return (
    <section id="stack" aria-labelledby="stack-heading" className="py-24 border-t border-border overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 space-y-14">
        <MotionReveal direction="up">
          <SectionHeading
            id="stack-heading"
            eyebrow="Curated Arsenal"
            title="Battle-Tested Technical Stack"
            description="A specialized toolchain selected for deterministic type safety, low-overhead execution, and enterprise resilience."
          />
        </MotionReveal>

        {/* 4-Column Stack Grid with Staggered Category Cards & Animated Tool Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.stack.map((category, catIdx) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{
                duration: 0.45,
                delay: catIdx * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="rounded-2xl border border-border bg-surface p-6 flex flex-col justify-between space-y-6 hover:border-accent/50 transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              {/* Category Header */}
              <div className="flex items-center justify-between pb-3 border-b border-border/80">
                <h3 className="text-xs font-mono uppercase tracking-wider text-accent font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  {"// "}{category.category}
                </h3>
                <span className="text-[11px] font-mono text-text-muted px-2 py-0.5 rounded-md bg-bg border border-border/60">
                  {category.tools.length} Tools
                </span>
              </div>

              {/* Every Individual Tool Option with Entrance Animation & Micro-Interactions */}
              <div className="grid grid-cols-1 gap-2.5">
                {category.tools.map((tool, toolIdx) => (
                  <motion.div
                    key={tool.name}
                    initial={{ opacity: 0, y: 14, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: false, amount: 0.1 }}
                    transition={{
                      duration: 0.38,
                      delay: catIdx * 0.08 + toolIdx * 0.05,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    whileHover={{
                      scale: 1.03,
                      x: 4,
                      transition: { type: "spring", stiffness: 450, damping: 22 },
                    }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center justify-between p-3 rounded-xl border border-border/80 bg-bg/60 hover:bg-surface text-text hover:border-accent/60 transition-colors duration-200 cursor-pointer group shadow-sm hover:shadow"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-surface group-hover:bg-accent/10 border border-border/60 group-hover:border-accent/40 flex items-center justify-center transition-colors">
                        <TechIcon
                          icon={tool.icon}
                          name={tool.name}
                          className="w-4 h-4 text-text-muted group-hover:text-accent group-hover:scale-110 transition-all duration-200"
                        />
                      </div>
                      <span className="text-sm font-medium tracking-tight text-text group-hover:text-accent transition-colors duration-200 font-mono">
                        {tool.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-text-muted opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:inline">
                        Active
                      </span>
                      <span className="w-2 h-2 rounded-full bg-border group-hover:bg-accent group-hover:scale-125 transition-all duration-200 shadow-sm" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
