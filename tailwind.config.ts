import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#08090D',
          surface: '#11131A',
          hover: '#161922',
          subtle: '#1B1F2B',
        },
        border: {
          subtle: '#1E2230',
          active: '#2E354B',
          glow: 'rgba(16, 185, 129, 0.3)',
        },
        ink: {
          primary: '#F4F4F6',
          secondary: '#8E93A4',
          muted: '#535868',
        },
        accent: {
          emerald: '#10B981',
          emeraldDark: '#059669',
          amber: '#F59E0B',
          cyan: '#06B6D4',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Space Grotesk', 'sans-serif'],
        sans: ['var(--font-sans)', 'Geist Sans', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
