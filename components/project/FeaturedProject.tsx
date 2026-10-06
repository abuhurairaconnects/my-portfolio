"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Github, ArrowRight, TrendingUp, Sparkles } from "lucide-react";
import { PortfolioData } from "@/lib/validations";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface FeaturedProjectProps {
  project: PortfolioData["projects"][0];
}

export function FeaturedProject({
  project,
}: FeaturedProjectProps): React.ReactElement {
  return (
    <article
      className="rounded-3xl border border-border bg-surface overflow-hidden shadow-2xl hover:border-accent/40 transition-all duration-300"
      aria-labelledby={`project-${project.slug}-title`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Left / Mockup Visual */}
        <div className="lg:col-span-7 relative min-h-[300px] sm:min-h-[400px] lg:min-h-[480px] bg-bg border-b lg:border-b-0 lg:border-r border-border overflow-hidden group">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <Image
              src={project.image}
              alt=""
              fill
              className="object-cover blur-2xl opacity-25 scale-125"
              aria-hidden="true"
            />
          </div>
          <Image
            src={project.image}
            alt={project.imageAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 58vw"
            priority
            className="object-contain p-8 sm:p-12 drop-shadow-xl transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-transparent to-transparent pointer-events-none" />

          {/* Floating Pill Badges */}
          <div className="absolute top-5 left-5 flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full bg-accent text-accent-fg text-xs font-mono font-bold uppercase tracking-wider shadow-lg flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Flagship Architecture</span>
            </span>
          </div>

          <div className="absolute bottom-5 left-5 right-5 flex flex-wrap gap-2 pointer-events-none">
            {project.tech.map((t) => (
              <span
                key={t}
                className="px-2.5 py-1 rounded-md bg-surface/90 backdrop-blur-md border border-white/10 text-[11px] font-mono text-text shadow"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Right / Content Details */}
        <div className="lg:col-span-5 p-7 sm:p-9 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <div className="space-y-2">
              <div className="text-xs font-mono uppercase tracking-wider text-accent font-semibold">
                {"// System Case Study"}
              </div>
              <h3
                id={`project-${project.slug}-title`}
                className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text"
              >
                {project.title}
              </h3>
              <p className="text-sm sm:text-base text-text-muted leading-relaxed">
                {project.summary}
              </p>
            </div>

            {/* Problem & Solution Blocks */}
            <div className="space-y-3 pt-1 text-xs sm:text-sm">
              <div className="p-4 rounded-xl border border-border/80 bg-bg/60 space-y-1">
                <span className="font-mono text-accent text-xs font-semibold block uppercase tracking-wider">
                  The Bottleneck //
                </span>
                <p className="text-text-muted leading-relaxed">{project.problem}</p>
              </div>

              <div className="p-4 rounded-xl border border-border/80 bg-bg/60 space-y-1">
                <span className="font-mono text-success text-xs font-semibold block uppercase tracking-wider">
                  The Architectural Resolution //
                </span>
                <p className="text-text-muted leading-relaxed">{project.solution}</p>
              </div>
            </div>

            {/* Measurable Impact Block */}
            {project.impact && project.impact.length > 0 && (
              <div className="p-4 rounded-xl border border-accent/30 bg-accent/5 space-y-2.5">
                <div className="flex items-center gap-1.5 text-accent text-xs font-mono font-semibold">
                  <TrendingUp className="w-4 h-4" aria-hidden="true" />
                  <span>MEASURABLE SYSTEM IMPACT //</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {project.impact.map((imp) => (
                    <div key={imp.metric} className="space-y-0.5">
                      <div className="text-sm font-bold font-mono text-text">
                        {imp.metric}
                      </div>
                      <div className="text-xs text-text-muted leading-tight">
                        {imp.detail}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Links & Case Study CTA */}
          <div className="pt-5 border-t border-border flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {project.links.live && (
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-text hover:text-accent transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Live Demo</span>
                </a>
              )}
              {project.links.repo && (
                <a
                  href={project.links.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-text hover:text-accent transition-colors"
                >
                  <Github className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Repository</span>
                </a>
              )}
            </div>

            <Button
              href={`/projects/${project.slug}`}
              variant="primary"
              size="sm"
              className="gap-2 text-xs font-semibold"
            >
              <span>Explore Case Study</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
