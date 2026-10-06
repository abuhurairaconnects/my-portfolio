"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Github, ArrowRight, TrendingUp } from "lucide-react";
import { PortfolioData } from "@/lib/validations";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface ProjectCardProps {
  project: PortfolioData["projects"][0];
}

export function ProjectCard({ project }: ProjectCardProps): React.ReactElement {
  return (
    <article
      className="rounded-2xl border border-border bg-surface overflow-hidden flex flex-col justify-between hover:border-accent/40 transition-all duration-300 group shadow-md"
      aria-labelledby={`project-card-${project.slug}-title`}
    >
      <div>
        {/* Project Thumbnail Image with Framora Hover Zoom */}
        <div className="relative h-52 sm:h-60 w-full bg-bg border-b border-border overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <Image
              src={project.image}
              alt=""
              fill
              className="object-cover blur-xl opacity-25 scale-125"
              aria-hidden="true"
            />
          </div>
          <Image
            src={project.image}
            alt={project.imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain p-6 drop-shadow-md transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent pointer-events-none" />

          {/* Top-Right Arrow Badge */}
          <Link
            href={`/projects/${project.slug}`}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-surface/90 backdrop-blur-md border border-border flex items-center justify-center text-text group-hover:bg-accent group-hover:text-accent-fg transition-all"
            aria-label={`View case study for ${project.title}`}
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-7 space-y-4">
          <div className="space-y-1.5">
            <h3
              id={`project-card-${project.slug}-title`}
              className="text-xl font-bold tracking-tight text-text group-hover:text-accent transition-colors"
            >
              {project.title}
            </h3>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
              {project.summary}
            </p>
          </div>

          {/* Problem & Solution Mini Blocks */}
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl border border-border/80 bg-bg/60">
              <span className="font-mono text-accent text-[11px] font-semibold block uppercase">
                Problem:
              </span>
              <p className="text-text-muted line-clamp-2 leading-relaxed">
                {project.problem}
              </p>
            </div>
            <div className="p-3 rounded-xl border border-border/80 bg-bg/60">
              <span className="font-mono text-success text-[11px] font-semibold block uppercase">
                Solution:
              </span>
              <p className="text-text-muted line-clamp-2 leading-relaxed">
                {project.solution}
              </p>
            </div>
          </div>

          {/* Conditional Measurable Impact */}
          {project.impact && project.impact.length > 0 && (
            <div className="p-3 rounded-xl border border-accent/25 bg-accent/5 space-y-1">
              <div className="flex items-center gap-1 text-accent text-[11px] font-mono font-semibold">
                <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
                <span>MEASURED IMPACT:</span>
              </div>
              <div className="text-xs font-semibold text-text">
                {project.impact[0].metric} —{" "}
                <span className="text-text-muted font-normal">
                  {project.impact[0].detail}
                </span>
              </div>
            </div>
          )}

          {/* Tech Badges */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.tech.map((t) => (
              <Badge key={t} variant="default">
                {t}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-6 pt-0 border-t border-border/60 mt-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          {project.links.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg border border-border/60 bg-bg/50 text-text-muted hover:text-accent hover:border-accent transition-colors"
              aria-label={`Live demo for ${project.title}`}
            >
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
            </a>
          )}
          {project.links.repo && (
            <a
              href={project.links.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg border border-border/60 bg-bg/50 text-text-muted hover:text-accent hover:border-accent transition-colors"
              aria-label={`GitHub repository for ${project.title}`}
            >
              <Github className="w-4 h-4" aria-hidden="true" />
            </a>
          )}
        </div>

        <Button
          href={`/projects/${project.slug}`}
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs font-medium"
        >
          <span>Deep Dive</span>
          <ArrowRight className="w-3 h-3" aria-hidden="true" />
        </Button>
      </div>
    </article>
  );
}
