"use client";

import * as React from "react";
import { Code2 } from "lucide-react";
import { portfolio } from "@/data/portfolio";
import { PortfolioData } from "@/lib/validations";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FeaturedProject } from "@/components/project/FeaturedProject";
import { ProjectCard } from "@/components/project/ProjectCard";
import { MotionReveal } from "@/components/ui/MotionReveal";

interface ProjectsProps {
  data?: PortfolioData;
}

export function Projects({ data = portfolio }: ProjectsProps): React.ReactElement {
  const [activeFilter, setActiveFilter] = React.useState<string>("All Projects");

  const projects = React.useMemo(() => data.projects || [], [data.projects]);
  const hasProjects = projects.length > 0;

  // Build dynamic categories list from actual projects data
  const categories = React.useMemo(() => {
    if (!hasProjects) return ["All Projects"];
    const cats = ["All Projects"];
    if (projects.some((p) => p.featured)) {
      cats.push("Featured");
    }
    // Extract unique technologies for quick filtering
    const allTech = Array.from(new Set(projects.flatMap((p) => p.tech || []))).slice(0, 3);
    cats.push(...allTech);
    return cats;
  }, [hasProjects, projects]);

  const featuredProject =
    projects.find((p) => p.featured) || (hasProjects ? projects[0] : null);

  const gridProjects = React.useMemo(() => {
    if (!hasProjects) return [];
    return projects.filter((p) => p.slug !== featuredProject?.slug);
  }, [hasProjects, projects, featuredProject]);

  const filteredProjects = React.useMemo(() => {
    if (!hasProjects) return [];
    if (activeFilter === "All Projects") return projects;
    if (activeFilter === "Featured") return projects.filter((p) => p.featured);
    return projects.filter((p) => p.tech?.includes(activeFilter));
  }, [hasProjects, activeFilter, projects]);

  return (
    <section id="projects" aria-labelledby="projects-heading" className="py-24 border-t border-border overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 space-y-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <MotionReveal direction="left">
            <SectionHeading
              id="projects-heading"
              eyebrow="Portfolio Showcase"
              title="Featured Engineering Projects"
              description="A curated selection of modern web platforms, software applications, and intelligent AI automation solutions."
              className="mb-0"
            />
          </MotionReveal>

          {/* Filter Pills from Right (Only show if multiple projects exist) */}
          {hasProjects && categories.length > 1 && (
            <MotionReveal direction="right">
              <div className="flex flex-wrap items-center gap-2 bg-surface p-1.5 rounded-2xl border border-border shrink-0">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveFilter(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all duration-150 min-h-[36px] ${
                      activeFilter === cat
                        ? "bg-accent text-accent-fg font-semibold shadow"
                        : "text-text-muted hover:text-text hover:bg-bg/60"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </MotionReveal>
          )}
        </div>

        {/* Empty State when no projects exist */}
        {!hasProjects ? (
          <MotionReveal direction="up">
            <div className="rounded-2xl border border-dashed border-border bg-surface/40 p-12 sm:p-16 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center mx-auto text-accent shadow-sm">
                <Code2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-text">
                  No Projects Added Yet
                </h3>
                <p className="text-xs sm:text-sm text-text-muted max-w-md mx-auto">
                  Projects added or modified in the Admin Panel will update here in real-time.
                </p>
              </div>
            </div>
          </MotionReveal>
        ) : (
          <>
            {/* 1. Flagship Featured Project */}
            {(activeFilter === "All Projects" || activeFilter === "Featured") && featuredProject && (
              <MotionReveal direction="scale" delay={0.15}>
                <div className="space-y-6">
                  <FeaturedProject project={featuredProject} />
                </div>
              </MotionReveal>
            )}

            {/* 2. Grid Projects */}
            {filteredProjects.length > 0 && (
              <div className="space-y-6 pt-4">
                <div className="flex items-center justify-between pb-2 border-b border-border/80">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-accent font-semibold">
                    {"//"} All Implementations ({filteredProjects.length})
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredProjects.map((project, idx) => (
                    <MotionReveal
                      key={project.slug}
                      direction={idx % 2 === 0 ? "left" : "right"}
                      delay={0.1 + idx * 0.15}
                    >
                      <ProjectCard project={project} />
                    </MotionReveal>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
