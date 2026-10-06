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

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default function Home(): React.ReactElement {
  const data = getPortfolioData();

  return (
    <div className="min-h-screen bg-bg text-text selection:bg-accent selection:text-accent-fg">
      <Navbar data={data} />
      <main id="main-content" tabIndex={-1}>
        <Hero data={data} />
        <About data={data} />
        <TechStack data={data} />
        <Projects data={data} />
        <Experience data={data} />
        <OpenSource data={data} />
        <Contact data={data} />
      </main>
      <Footer data={data} />
    </div>
  );
}
