import type { MetadataRoute } from "next";
import { getPortfolioData } from "@/lib/server/portfolio";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function sitemap(): MetadataRoute.Sitemap {
  const portfolio = getPortfolioData();
  const baseUrl = portfolio.seo.siteUrl;

  const projectRoutes = portfolio.projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    ...projectRoutes,
  ];
}
