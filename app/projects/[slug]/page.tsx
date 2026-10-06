import * as React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPortfolioData } from "@/lib/server/portfolio";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CaseStudyView } from "@/components/project/CaseStudyView";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const portfolio = getPortfolioData();
  const project = portfolio.projects.find((p) => p.slug === slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.title} — Detailed Overview`,
    description: project.summary,
    openGraph: {
      title: `${project.title} | ${portfolio.person.name}`,
      description: project.summary,
      images: [
        {
          url: project.image,
          width: 1200,
          height: 630,
          alt: project.imageAlt,
        },
      ],
    },
  };
}

export default async function ProjectPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { slug } = await params;
  const portfolio = getPortfolioData();
  const project = portfolio.projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  // Structured Data (JSON-LD): CreativeWork / SoftwareSourceCode (Strictly NOT SoftwareApplication per rule 9)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: project.title,
    description: project.summary,
    author: {
      "@type": "Person",
      name: portfolio.person.name,
      jobTitle: portfolio.person.role,
    },
    programmingLanguage: project.tech,
    codeRepository: project.links.repo || undefined,
  };

  return (
    <div className="min-h-screen bg-bg text-text selection:bg-accent selection:text-accent-fg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar data={portfolio} />
      <main id="main-content" tabIndex={-1} className="pt-20">
        <CaseStudyView project={project} />
      </main>
      <Footer data={portfolio} />
    </div>
  );
}
