import * as React from "react";
import Image from "next/image";
import {
  ArrowDown,
  Github,
  Linkedin,
  Mail,
  Sparkles,
  Code2,
  Cpu,
  Globe,
} from "lucide-react";
import { portfolio } from "@/data/portfolio";
import { PortfolioData } from "@/lib/validations";
import { Button } from "@/components/ui/Button";
import { MotionReveal } from "@/components/ui/MotionReveal";

interface HeroProps {
  data?: PortfolioData;
}

export function Hero({ data = portfolio }: HeroProps): React.ReactElement {
  const photoUrl =
    data.person.photo ||
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80";

  return (
    <section
      id="home"
      aria-label="Introduction and Overview"
      className="relative pt-28 pb-20 md:pt-40 md:pb-28 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Assembling smoothly from Left */}
          <MotionReveal
            direction="left"
            delay={0.1}
            className="lg:col-span-7 space-y-7"
          >
            {/* Availability Floating Glass Pill */}
            {data.availability.enabled && (
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-border/80 bg-surface/80 backdrop-blur-md text-xs font-mono text-text shadow-sm hover:border-accent/40 transition-colors">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="pulse-indicator animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success" />
                </span>
                <span className="text-text-muted">{data.availability.label}</span>
                <span className="text-border">|</span>
                <span className="text-accent font-medium">{data.person.location}</span>
              </div>
            )}

            {/* Prominent Name & Title */}
            <div className="space-y-3">
              <span className="text-accent text-base sm:text-lg font-mono font-semibold tracking-wider uppercase block">
                Hi, I am
              </span>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-text leading-[1.05]">
                {data.person.name}
              </h1>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent via-orange-400 to-amber-300">
                {data.person.role}
              </h2>
            </div>

            {/* Concise Bio highlighting Web Development, AI Automation & Software Development */}
            <p className="text-base sm:text-lg text-text-muted max-w-xl font-normal leading-relaxed">
              {data.person.tagline}
            </p>

            {/* Skill Focus Pills */}
            <div className="flex flex-wrap gap-2.5 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-surface text-xs font-mono text-text hover:border-accent/40 transition-colors">
                <Globe className="w-3.5 h-3.5 text-accent" />
                <span>Web Development</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-surface text-xs font-mono text-text hover:border-accent/40 transition-colors">
                <Cpu className="w-3.5 h-3.5 text-accent" />
                <span>AI Automation</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-surface text-xs font-mono text-text hover:border-accent/40 transition-colors">
                <Code2 className="w-3.5 h-3.5 text-accent" />
                <span>Software Development</span>
              </span>
            </div>

            {/* CTA: Explore Projects Button */}
            <div className="pt-2">
              <Button
                href="#projects"
                variant="primary"
                size="lg"
                className="gap-2.5 shadow-lg text-sm sm:text-base px-6 py-3.5"
              >
                <span>Explore Projects</span>
                <ArrowDown className="w-4 h-4" aria-hidden="true" />
              </Button>
            </div>

            {/* Professional Networks */}
            <div className="flex items-center gap-4 pt-4 border-t border-border/80">
              <span className="text-xs font-mono uppercase tracking-wider text-text-muted">
                Connect //
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={data.person.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-border/60 bg-surface/60 text-text-muted hover:text-accent hover:border-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  aria-label="GitHub Profile"
                >
                  <Github className="w-4 h-4" aria-hidden="true" />
                </a>
                <a
                  href={data.person.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-border/60 bg-surface/60 text-text-muted hover:text-accent hover:border-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-4 h-4" aria-hidden="true" />
                </a>
                <a
                  href={`mailto:${data.person.email}`}
                  className="p-2.5 rounded-xl border border-border/60 bg-surface/60 text-text-muted hover:text-accent hover:border-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  aria-label="Send direct email"
                >
                  <Mail className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </MotionReveal>

          {/* Right Column: Converging in smoothly from Right */}
          <MotionReveal
            direction="right"
            delay={0.2}
            className="lg:col-span-5 relative flex justify-center items-center"
          >
            {/* Soft Ambient Glow */}
            <div
              className="absolute -inset-6 w-[120%] h-[120%] rounded-full hero-glow-effect pointer-events-none -z-10"
              aria-hidden="true"
            />

            {/* Large Full Photo Container */}
            <div className="w-full max-w-md sm:max-w-lg relative group">
              <div className="relative aspect-[4/5] sm:aspect-[3/4] w-full rounded-3xl overflow-hidden border-2 border-border/90 bg-surface shadow-2xl transition-all duration-300 group-hover:border-accent/50">
                <Image
                  src={photoUrl}
                  alt={`${data.person.name} — ${data.person.role}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  priority
                  className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Subtle dark vignette gradient at bottom of photo to ensure crisp text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

                {/* Bottom Overlay Label - High Contrast in both Light & Dark Mode */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-slate-950/90 dark:bg-black/85 backdrop-blur-md border border-white/20 shadow-2xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-base sm:text-lg tracking-tight drop-shadow-sm">
                      {data.person.name}
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50" />
                  </div>
                  <p className="text-xs font-mono text-orange-400 font-semibold tracking-wide">
                    {data.person.role}
                  </p>
                </div>
              </div>

              {/* Floating Framora Badge 1: Top-Right Glass Chip (Ultra-crisp in Light & Dark Mode) */}
              <div className="hidden sm:flex absolute -top-4 -right-4 px-3.5 py-2 rounded-2xl border border-slate-300 dark:border-white/15 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md shadow-xl items-center gap-2 text-xs font-mono text-slate-800 dark:text-slate-100 font-semibold">
                <Sparkles className="w-4 h-4 text-orange-500 dark:text-orange-400 shrink-0" />
                <span>Full-Stack & AI</span>
              </div>

              {/* Floating Framora Badge 2: Bottom-Left Glass Chip (Ultra-crisp in Light & Dark Mode) */}
              <div className="hidden sm:flex absolute -bottom-4 -left-4 px-3.5 py-2 rounded-2xl border border-slate-300 dark:border-white/15 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md shadow-xl items-center gap-2 text-xs font-mono text-slate-800 dark:text-slate-100 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50 shrink-0" />
                <span>Available for Hire</span>
              </div>
            </div>
          </MotionReveal>
        </div>
      </div>
    </section>
  );
}
