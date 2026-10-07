import type { MetadataRoute } from "next";
import { getPortfolioData } from "@/lib/server/portfolio";

export const revalidate = 86400;

export default function robots(): MetadataRoute.Robots {
  const portfolio = getPortfolioData();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin", "/admin/"],
    },
    sitemap: `${portfolio.seo.siteUrl}/sitemap.xml`,
  };
}
