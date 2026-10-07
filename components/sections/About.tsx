import * as React from "react";
import Link from "next/link";
import {
  Globe,
  Cpu,
  Smartphone,
  Sparkles,
  Layers,
  Zap,
  Lock,
  Eye,
  CheckCircle2,
  Terminal,
  Code2,
} from "lucide-react";
import { portfolio } from "@/data/portfolio";
import { PortfolioData } from "@/lib/validations";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MotionReveal } from "@/components/ui/MotionReveal";

const FOCUS_ICONS: Record<string, React.ElementType> = {
  "Full-Stack Web Development": Globe,
  "Software Development": Cpu,
  "Application Development": Smartphone,
  "AI Automation Expert": Sparkles,
  "AI Automation": Sparkles,
  "Distributed Architecture": Layers,
  "High-Performance Systems": Zap,
  "Defensive Security": Lock,
  "Inclusive & Accessible UX": Eye,
};

const FOCUS_TAGS: Record<string, string> = {
  "Full-Stack Web Development": "Frontend & Backend • Scalable APIs",
  "Software Development": "Clean Architecture • High Reliability",
  "Application Development": "Cross-Platform • Fluid UX",
  "AI Automation Expert": "Autonomous Agents • Smart Workflows",
  "AI Automation": "Autonomous Agents • Smart Workflows",
  "Distributed Architecture": "Event-Driven & Partitioning",
  "High-Performance Systems": "Sub-ms Caching & P99",
  "Defensive Security": "Zero-Trust & Cryptography",
  "Inclusive & Accessible UX": "WCAG 2.2 AA & 100% Keyboard",
};

interface AboutProps {
  data?: PortfolioData;
}

export function About({ data = portfolio }: AboutProps): React.ReactElement {
  return (
    <section id="about" aria-labelledby="about-heading" className="py-24 border-t border-border overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 space-y-16">
        {/* Heading */}
        <MotionReveal direction="down">
          <SectionHeading
            id="about-heading"
            eyebrow="Profile & Core Disciplines"
            title="Engineering Web, Software & AI Solutions"
            description="Specializing in full-stack web platforms, robust software architecture, cross-platform applications, and intelligent AI automation."
          />
        </MotionReveal>

        {/* Bento Grid with Smooth Staggered Convergence */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Bento Item 1: Main Story & Professional Persona */}
          <MotionReveal
            direction="left"
            delay={0.1}
            className="lg:col-span-7 rounded-2xl border border-border bg-surface p-7 sm:p-9 flex flex-col justify-between space-y-6 hover:border-accent/40 transition-colors shadow-sm"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-accent uppercase tracking-wider">
                <Terminal className="w-4 h-4" aria-hidden="true" />
                <span>{"// Professional Background"}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-text">
                Building modern web platforms, software applications & intelligent AI automations.
              </h3>
              <div className="space-y-4 text-sm sm:text-base text-text-muted leading-relaxed">
                <p>{data.about.paragraphs[0]}</p>
                <p>{data.about.paragraphs[1]}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-border/70 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-text-muted">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 text-success">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Full-Stack Web & Apps
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1.5 text-accent">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Clean Software Design
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1.5 text-text">
                  <CheckCircle2 className="w-3.5 h-3.5" /> AI-Driven Automation
                </span>
              </div>

              {/* Discreet Secret Admin Portal Icon for Owner */}
              <Link
                href="/admin"
                className="opacity-25 hover:opacity-100 hover:text-accent transition-opacity p-1 rounded focus:opacity-100 focus:outline-none"
                title="Admin Control Center"
                aria-label="Secret Admin Access"
              >
                <Lock className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          </MotionReveal>

          {/* Bento Item 2: Core Engineering Capabilities */}
          <MotionReveal
            direction="right"
            delay={0.2}
            className="lg:col-span-5 rounded-2xl border border-border bg-surface/70 p-7 sm:p-9 flex flex-col justify-between space-y-6 hover:border-accent/40 transition-colors shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-accent uppercase tracking-wider">
                <Code2 className="w-4 h-4" aria-hidden="true" />
                <span>{"// Core Capabilities"}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-text">
                Engineering Disciplines
              </h3>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                Delivering high-quality digital products tailored to modern business requirements with uncompromising performance and usability.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { label: "Web Development", val: "Next.js, React, Node & APIs" },
                { label: "Software Engineering", val: "Clean Code & Modular Architecture" },
                { label: "App Development", val: "Cross-Platform & Responsive UX" },
                { label: "AI Automation", val: "Agent Workflows & API Integrations" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between p-3 rounded-xl border border-border/80 bg-bg/60 text-xs font-mono"
                >
                  <span className="text-text-muted">{item.label}</span>
                  <span className="text-accent font-semibold">{item.val}</span>
                </div>
              ))}
            </div>
          </MotionReveal>

          {/* Bento Items 3-6: The 4 Specialized Focus Pillars */}
          {data.about.focus.map((item, idx) => {
            const Icon = FOCUS_ICONS[item.title] || Layers;
            const tag = FOCUS_TAGS[item.title] || "Core Discipline";
            const dir = idx % 2 === 0 ? "left" : "right";

            return (
              <MotionReveal
                key={item.title}
                direction={dir}
                delay={0.15 + idx * 0.1}
                className="lg:col-span-6 rounded-2xl border border-border bg-surface p-7 flex flex-col justify-between space-y-4 hover:border-accent/40 transition-all duration-200 group shadow-sm hover:shadow"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-bg border border-border flex items-center justify-center text-accent group-hover:scale-105 group-hover:border-accent/50 transition-all">
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full border border-border/80 bg-bg/50 text-[11px] font-mono text-text-muted">
                      {tag}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-text tracking-tight group-hover:text-accent transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </MotionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
