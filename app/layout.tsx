import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { portfolio } from "@/data/portfolio";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0B0F17" },
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(portfolio.seo.siteUrl),
  title: {
    default: portfolio.seo.title,
    template: `%s | ${portfolio.person.name}`,
  },
  description: portfolio.seo.description,
  keywords: [
    "Senior Full-Stack Engineer",
    "Systems Architecture",
    "Distributed Systems",
    "High Performance Web",
    "Next.js",
    "TypeScript",
    "Go",
    "PostgreSQL",
  ],
  authors: [{ name: portfolio.person.name, url: portfolio.seo.siteUrl }],
  creator: portfolio.person.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: portfolio.seo.siteUrl,
    title: portfolio.seo.title,
    description: portfolio.seo.description,
    siteName: `${portfolio.person.name} — Portfolio`,
    images: [
      {
        url: portfolio.seo.ogImage,
        width: 1200,
        height: 630,
        alt: `${portfolio.person.name} — Senior Full-Stack Engineer Portfolio`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: portfolio.seo.title,
    description: portfolio.seo.description,
    images: [portfolio.seo.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const jsonLdPerson = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: portfolio.person.name,
    jobTitle: portfolio.person.role,
    url: portfolio.seo.siteUrl,
    sameAs: [portfolio.person.social.github, portfolio.person.social.linkedin],
    address: {
      "@type": "PostalAddress",
      addressLocality: portfolio.person.location,
    },
  };

  const jsonLdWebsite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: portfolio.seo.title,
    url: portfolio.seo.siteUrl,
    description: portfolio.seo.description,
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdPerson) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
        />
      </head>
      <body className="min-h-screen bg-bg text-text antialiased font-sans selection:bg-accent selection:text-accent-fg">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent focus:text-accent-fg focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-accent"
        >
          Skip to content
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
