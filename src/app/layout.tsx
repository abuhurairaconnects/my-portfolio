import type { Metadata } from 'next';
import { Space_Grotesk, DM_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { portfolioData } from '@/data/portfolio';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://abuhuraira.dev'),
  title: 'Abu Huraira | Full-Stack Web Developer & AI Business Automation',
  description: 'I build fast web platforms and AI automations that remove manual work and turn visitors into clients.',
  keywords: [
    'Abu Huraira',
    'Full-Stack Web Developer',
    'AI Business Automation',
    'Full-Stack Web Development',
    'Application Development',
    'Next.js 15',
    'React 19',
    'TypeScript',
    'PostgreSQL',
    'Docker',
    'Coolify',
    'Dhaka Bangladesh Developer',
    'As-Sunnah Skill Development',
  ],
  authors: [{ name: portfolioData.person.name, url: 'https://github.com/abuhurairaconnects' }],
  creator: portfolioData.person.name,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://abuhuraira.dev',
    title: 'Abu Huraira | Full-Stack Web Developer & AI Business Automation',
    description: 'I build fast web platforms and AI automations that remove manual work and turn visitors into clients.',
    siteName: `${portfolioData.person.name} Portfolio`,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `${portfolioData.person.name} Portfolio`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${portfolioData.person.name} | Full-Stack Developer & AI Automation`,
    description: portfolioData.person.tagline,
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { GlobalGlobeBackground } from '@/components/layout/GlobalGlobeBackground';
import { SpiderCursor } from '@/components/ui/SpiderCursor';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  localStorage.removeItem('theme');
                  document.documentElement.classList.remove('light');
                  document.documentElement.classList.add('dark');
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${dmSans.variable} ${jetbrainsMono.variable} antialiased bg-[#08090D] text-[#F4F4F6] min-h-screen selection:bg-emerald-500/20 selection:text-emerald-300 relative`}
      >
        <GlobalGlobeBackground />
        <SpiderCursor />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
