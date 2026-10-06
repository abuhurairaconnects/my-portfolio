import * as React from "react";
import { GitBranch, ExternalLink } from "lucide-react";
import { portfolio } from "@/data/portfolio";
import { PortfolioData } from "@/lib/validations";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MotionReveal } from "@/components/ui/MotionReveal";

interface OpenSourceProps {
  data?: PortfolioData;
}

export function OpenSource({ data = portfolio }: OpenSourceProps): React.ReactElement | null {
  if (!data.openSource.enabled || !data.openSource.repos?.length) {
    return null;
  }

  return (
    <section id="opensource" aria-labelledby="opensource-heading" className="py-20 border-t border-border overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 space-y-12">
        <MotionReveal direction="up">
          <SectionHeading
            id="opensource-heading"
            eyebrow="Community & Tooling"
            title="Open-Source Contributions"
            description="Publicly available libraries, algorithmic data structures, and developer utilities engineered for the broader community."
          />
        </MotionReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.openSource.repos.map((repo, idx) => (
            <MotionReveal key={repo.name} direction={idx % 2 === 0 ? "left" : "right"} delay={0.1 + idx * 0.1}>
              <a
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-border bg-surface p-6 flex flex-col justify-between space-y-4 hover:border-accent/40 group transition-all h-full"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-text font-mono font-semibold text-base group-hover:text-accent transition-colors">
                      <GitBranch className="w-4 h-4 text-accent" aria-hidden="true" />
                      <span>{repo.name}</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" aria-hidden="true" />
                  </div>
                  <p className="text-sm text-text-muted leading-relaxed">
                    {repo.description}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono text-text-muted pt-2 border-t border-border/60">
                  <span>Public Repository</span>
                  <span>•</span>
                  <span>MIT License</span>
                </div>
              </a>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
