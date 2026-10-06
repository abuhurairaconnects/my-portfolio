"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUp, Github, Linkedin, Mail } from "lucide-react";
import { portfolio } from "@/data/portfolio";
import { PortfolioData } from "@/lib/validations";

interface FooterProps {
  data?: PortfolioData;
}

export function Footer({ data = portfolio }: FooterProps): React.ReactElement {
  const scrollToTop = (): void => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface/30 text-text py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Monogram and Identity */}
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-accent text-accent-fg font-mono font-bold flex items-center justify-center text-xs">
            {data.person.monogram}
          </span>
          <div className="text-xs text-text-muted">
            <span className="text-text font-medium">{data.person.name}</span> —{" "}
            {data.person.role}
          </div>
        </div>

        {/* Social Links (Strictly GitHub, LinkedIn, Email only) */}
        <div className="flex items-center gap-3">
          <a
            href={data.person.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-lg border border-border bg-surface flex items-center justify-center text-text-muted hover:text-accent hover:border-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="GitHub Profile"
          >
            <Github className="w-4 h-4" aria-hidden="true" />
          </a>
          <a
            href={data.person.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-lg border border-border bg-surface flex items-center justify-center text-text-muted hover:text-accent hover:border-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="LinkedIn Profile"
          >
            <Linkedin className="w-4 h-4" aria-hidden="true" />
          </a>
          <a
            href={`mailto:${data.person.email}`}
            className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-lg border border-border bg-surface flex items-center justify-center text-text-muted hover:text-accent hover:border-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Send direct email"
          >
            <Mail className="w-4 h-4" aria-hidden="true" />
          </a>
          {/* Back to Top */}
          <button
            type="button"
            onClick={scrollToTop}
            className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-lg border border-border bg-surface flex items-center justify-center text-text-muted hover:text-accent hover:border-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Back to top of page"
            title="Back to top"
          >
            <ArrowUp className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-6 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between text-xs text-text-muted gap-2">
        <p>© {currentYear} {data.person.name}. Engineered for performance & accessibility.</p>
        <p className="font-mono">RSC-First • Zero Layout Shift • WCAG 2.2 AA</p>
      </div>
    </footer>
  );
}
