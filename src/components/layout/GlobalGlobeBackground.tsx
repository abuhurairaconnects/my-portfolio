'use client';

import { usePathname } from 'next/navigation';
import { DotGlobe } from '@/components/ui/DotGlobe';

export function GlobalGlobeBackground() {
  const pathname = usePathname();

  // Hide the globe on admin console
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      {/* Global Architectural Blueprint Grid Across All Pages */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_85%_75%_at_50%_35%,#000_65%,transparent_100%)] select-none"
      />

      {/* Global 3D Dot Globe */}
      <div
        aria-hidden="true"
        className="fixed top-10 right-[-10%] sm:right-[-4%] lg:right-[2%] w-[480px] sm:w-[580px] lg:w-[680px] aspect-square pointer-events-none z-0 opacity-80 sm:opacity-90 lg:opacity-95 [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)] select-none overflow-hidden transition-opacity duration-500"
      >
        <DotGlobe size={680} enableInteraction={false} />
      </div>
    </>
  );
}
