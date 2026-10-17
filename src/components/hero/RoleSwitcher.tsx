'use client';

import { useEffect, useState } from 'react';
import { RoleCategory } from '@/types/portfolio';

interface RoleSwitcherProps {
  roles: RoleCategory[];
}

export function RoleSwitcher({ roles }: RoleSwitcherProps) {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % roles.length);
        setFade(true);
      }, 250);
    }, 2800);
    return () => clearInterval(timer);
  }, [roles.length]);

  return (
    <div className="relative inline-flex items-center h-10 sm:h-12 overflow-hidden align-middle">
      <span
        className={`text-emerald-400 font-display font-semibold tracking-tight text-xl sm:text-2xl md:text-3xl transition-all duration-300 transform ${
          fade ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}
      >
        {roles[index]}
      </span>
    </div>
  );
}
