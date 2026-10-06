import type { MetadataRoute } from "next";
import { getPortfolioData } from "@/lib/server/portfolio";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
