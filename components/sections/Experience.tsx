"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Briefcase, GitBranch, Award, Code2 } from "lucide-react";
import { portfolio } from "@/data/portfolio";
import { PortfolioData } from "@/lib/validations";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { MotionReveal } from "@/components/ui/MotionReveal";

const TYPE_ICONS: Record<string, React.ElementType> = {
  "full-time": Briefcase,
  freelance: Code2,
  "open-source": GitBranch,
  milestone: Award,
};

interface ExperienceProps {
  data?: PortfolioData;
}

export function Experience({ data = portfolio }: ExperienceProps): React.ReactElement {
  return (
    <section id="experience" aria-labelledby="experience-heading" className="py-24 border-t border-border overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 space-y-14">
        <MotionReveal direction="up">
          <SectionHeading
            id="experience-heading"
            eyebrow="Proven Trajectory"
            title="Engineering Milestones & Roles"
            description="A chronological record of full-time technical leadership, infrastructure ownership, and distributed systems delivery."
          />
        </MotionReveal>

        {/* Semantic <ol> timeline with Smooth Staggered Animation & Hover Motion */}
        <ol className="relative border-l border-border/80 ml-3 sm:ml-4 space-y-12 list-none">
          {data.experience.map((item, index) => {
            const Icon = TYPE_ICONS[item.type] || Briefcase;

            return (
              <motion.li
                key={`${item.org}-${item.start}`}
                initial={{ opacity: 0, y: 22, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative pl-7 sm:pl-9 group"
              >
                {/* Timeline node dot */}
                <span className="absolute -left-3.5 top-1.5 w-7 h-7 rounded-full border border-border bg-surface flex items-center justify-center text-text-muted group-hover:border-accent group-hover:text-accent group-hover:scale-110 transition-all duration-200 shadow">
                  <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                </span>

                <motion.div
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  className="rounded-2xl border border-border bg-surface/80 p-6 sm:p-7 space-y-3.5 transition-colors duration-200 hover:border-accent/50 shadow-sm hover:shadow-md"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-text tracking-tight group-hover:text-accent transition-colors">
                        {item.role}
                      </h3>
                      <div className="text-sm font-semibold text-accent font-mono">
                        @{item.org}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-text-muted px-2.5 py-1 rounded-md bg-bg border border-border/60">
                        {item.start} — {item.end || "Present"}
                      </span>
                      <Badge variant="outline" className="capitalize text-[11px]">
                        {item.type}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-text-muted leading-relaxed">
                    {item.summary}
                  </p>
                </motion.div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
