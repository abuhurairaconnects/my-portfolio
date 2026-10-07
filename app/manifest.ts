import type { MetadataRoute } from "next";
import { portfolio } from "@/data/portfolio";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${portfolio.person.name} — Full-Stack Developer`,
    short_name: portfolio.person.name,
    description: portfolio.seo.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0B0F17",
    theme_color: "#0B0F17",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
