import * as React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { TechStack } from "@/components/sections/TechStack";
import { Projects } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
import { OpenSource } from "@/components/sections/OpenSource";
import { Contact } from "@/components/sections/Contact";
import { getPortfolioData } from "@/lib/server/portfolio";

// Next.js 15 ISR: Static prerendering at build time with hourly background revalidation
export const revalidate = 3600;

export default function Home(): React.ReactElement {
  const data = getPortfolioData();

  return (
    <div className="min-h-screen bg-bg text-text selection:bg-accent selection:text-accent-fg">
      <Navbar data={data} />
      <main id="main-content" tabIndex={-1}>
        <Hero data={data} />
        <React.Suspense fallback={<div className="min-h-[300px] animate-pulse" />}>
          <About data={data} />
        </React.Suspense>
        <React.Suspense fallback={<div className="min-h-[300px] animate-pulse" />}>
          <TechStack data={data} />
        </React.Suspense>
        <React.Suspense fallback={<div className="min-h-[400px] animate-pulse" />}>
          <Projects data={data} />
        </React.Suspense>
        <React.Suspense fallback={<div className="min-h-[400px] animate-pulse" />}>
          <Experience data={data} />
        </React.Suspense>
        <React.Suspense fallback={<div className="min-h-[300px] animate-pulse" />}>
          <OpenSource data={data} />
        </React.Suspense>
        <React.Suspense fallback={<div className="min-h-[400px] animate-pulse" />}>
          <Contact data={data} />
        </React.Suspense>
      </main>
      <Footer data={data} />
    </div>
  );
}
