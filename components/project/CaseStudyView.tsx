"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  CheckCircle,
  AlertTriangle,
  Zap,
  Shield,
  Layers,
  FileCode,
} from "lucide-react";
import { PortfolioData } from "@/lib/validations";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface CaseStudyViewProps {
  project: PortfolioData["projects"][0];
}

export function CaseStudyView({ project }: CaseStudyViewProps): React.ReactElement {
  const caseStudy = project.caseStudy;

  return (
    <article className="max-w-4xl mx-auto px-6 py-16 sm:py-24 space-y-16">
      {/* Back Link */}
      <div>
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-xs font-mono text-text-muted hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded px-2 py-1 -ml-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Back to Projects Overview</span>
        </Link>
      </div>

      {/* Case Study Header */}
      <header className="space-y-6 border-b border-border pb-10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-accent">
            <span>{"// ARCHITECTURAL CASE STUDY"}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-text">
            {project.title}
          </h1>
          <p className="text-lg sm:text-xl text-text-muted leading-relaxed">
            {project.summary}
          </p>
        </div>

        {/* Tech Badges & External Links */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex flex-wrap gap-1.5">
            {project.tech.map((t) => (
              <Badge key={t} variant="default">
                {t}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {project.links.live && (
              <Button href={project.links.live} external variant="primary" size="sm" className="gap-1.5">
                <span>Live Demo</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </Button>
            )}
            {project.links.repo && (
              <Button href={project.links.repo} external variant="secondary" size="sm" className="gap-1.5">
                <Github className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Repository</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Project Hero Visual */}
      <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-2xl border border-border bg-surface overflow-hidden shadow-lg">
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
          priority
          sizes="(max-width: 1024px) 100vw, 896px"
          className="object-contain p-6 sm:p-10 drop-shadow-md"
        />
      </div>

      {/* Problem & Solution Deep Dive */}
      <section aria-labelledby="problem-solution-heading" className="space-y-6">
        <h2 id="problem-solution-heading" className="text-xl font-bold tracking-tight text-text">
          Context & Objectives
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="space-y-3 border-accent/20 bg-accent/5">
            <div className="flex items-center gap-2 text-accent text-xs font-mono font-semibold uppercase">
              <AlertTriangle className="w-4 h-4" aria-hidden="true" />
              <span>Architectural Problem</span>
            </div>
            <p className="text-sm text-text-muted leading-relaxed">{project.problem}</p>
          </Card>

          <Card className="space-y-3 border-success/20 bg-success/5">
            <div className="flex items-center gap-2 text-success text-xs font-mono font-semibold uppercase">
              <CheckCircle className="w-4 h-4" aria-hidden="true" />
              <span>Engineered Solution</span>
            </div>
            <p className="text-sm text-text-muted leading-relaxed">{project.solution}</p>
          </Card>
        </div>
      </section>

      {/* Measurable Impact Section (Only if verified) */}
      {project.impact && project.impact.length > 0 && (
        <section aria-labelledby="impact-heading" className="space-y-6">
          <h2 id="impact-heading" className="text-xl font-bold tracking-tight text-text">
            Measurable Production Impact
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {project.impact.map((imp) => (
              <div
                key={imp.metric}
                className="p-5 rounded-xl border border-border bg-surface flex flex-col justify-between gap-1"
              >
                <div className="text-2xl font-mono font-bold text-accent">{imp.metric}</div>
                <div className="text-xs sm:text-sm text-text-muted">{imp.detail}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Architecture Diagram (Conditional) */}
      {caseStudy?.architecture && (
        <section aria-labelledby="architecture-heading" className="space-y-6">
          <div className="space-y-1">
            <h2 id="architecture-heading" className="text-xl font-bold tracking-tight text-text flex items-center gap-2">
              <Layers className="w-5 h-5 text-accent" aria-hidden="true" />
              <span>System Architecture</span>
            </h2>
            <p className="text-xs font-mono text-text-muted">
              {"// Data flow topology and isolation boundaries"}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-surface p-4 overflow-hidden">
            <div className="relative w-full aspect-[800/320] bg-bg rounded-lg overflow-hidden border border-border/80">
              <Image
                src={caseStudy.architecture.diagram}
                alt={caseStudy.architecture.alt}
                fill
                className="object-contain"
                sizes="(max-width: 800px) 100vw, 800px"
              />
            </div>
            {caseStudy.architecture.notes && (
              <p className="text-xs text-text-muted pt-3 leading-relaxed border-t border-border/60 mt-3">
                <span className="font-semibold text-text">Topology Notes:</span>{" "}
                {caseStudy.architecture.notes}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Technical Decisions (Conditional) */}
      {caseStudy?.decisions && caseStudy.decisions.length > 0 && (
        <section aria-labelledby="decisions-heading" className="space-y-6">
          <h2 id="decisions-heading" className="text-xl font-bold tracking-tight text-text flex items-center gap-2">
            <FileCode className="w-5 h-5 text-accent" aria-hidden="true" />
            <span>Key Architectural Trade-offs & Decisions</span>
          </h2>
          <ul className="space-y-3 list-none">
            {caseStudy.decisions.map((decision, index) => (
              <li
                key={index}
                className="p-4 rounded-xl border border-border bg-surface/60 text-sm text-text-muted leading-relaxed flex items-start gap-3"
              >
                <span className="font-mono text-accent text-xs font-bold shrink-0 mt-0.5">
                  0{index + 1}.
                </span>
                <span>{decision}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Challenges & Solutions (Conditional) */}
      {caseStudy?.challenges && caseStudy.challenges.length > 0 && (
        <section aria-labelledby="challenges-heading" className="space-y-6">
          <h2 id="challenges-heading" className="text-xl font-bold tracking-tight text-text">
            Critical Challenges & Resolution
          </h2>
          <div className="space-y-4">
            {caseStudy.challenges.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border bg-surface p-5 space-y-3"
              >
                <div className="text-sm font-semibold text-text flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  <span>Challenge: {item.challenge}</span>
                </div>
                <div className="text-xs sm:text-sm text-text-muted pl-4 border-l-2 border-success/40 leading-relaxed">
                  <span className="font-medium text-success block mb-0.5">Resolution:</span>
                  {item.solution}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Performance & Security Considerations (Conditional) */}
      {(caseStudy?.performance?.length || caseStudy?.security?.length) && (
        <section aria-labelledby="tuning-heading" className="space-y-6">
          <h2 id="tuning-heading" className="text-xl font-bold tracking-tight text-text">
            Performance & Defensive Security
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {caseStudy.performance && caseStudy.performance.length > 0 && (
              <Card className="space-y-3">
                <div className="flex items-center gap-2 text-accent text-xs font-mono font-semibold uppercase">
                  <Zap className="w-4 h-4" aria-hidden="true" />
                  <span>Performance Tuning</span>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-text-muted list-disc pl-4">
                  {caseStudy.performance.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </Card>
            )}

            {caseStudy.security && caseStudy.security.length > 0 && (
              <Card className="space-y-3">
                <div className="flex items-center gap-2 text-success text-xs font-mono font-semibold uppercase">
                  <Shield className="w-4 h-4" aria-hidden="true" />
                  <span>Security Hardening</span>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-text-muted list-disc pl-4">
                  {caseStudy.security.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </Card>
            )}
          </div>
        </section>
      )}

      {/* Bottom CTA to Discuss Project */}
      <div className="p-8 rounded-2xl border border-border bg-surface/80 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-text">Interested in similar system architectures?</h3>
          <p className="text-xs sm:text-sm text-text-muted">
            Let’s discuss performance characteristics, system design, or engineering consulting.
          </p>
        </div>
        <Button href="/#contact" variant="primary" size="md">
          Initiate Discussion
        </Button>
      </div>
    </article>
  );
}
