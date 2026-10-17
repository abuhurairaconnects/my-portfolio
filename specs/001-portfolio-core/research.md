# Engineering Research & Design Tokens (RESEARCH.md)

**Feature**: `001-portfolio-core`  
**Date**: 2026-10-16  
**Audience**: Engineering & UI/UX Audit  

---

## 1. Verified Package Ecosystem (2025–2026 Stable)

To avoid hallucinated dependencies and runtime incompatibilities with Node 24 and React 19, the following audited package targets are locked:

| Package | Target Version | Purpose | Compatibility Notes |
| :--- | :--- | :--- | :--- |
| `next` | `^15.2.0` | App Router Core, Server Components, Server Actions | React 19 native support, standalone output |
| `react` | `^19.0.0` | UI Library | Native server actions & transitions |
| `react-dom` | `^19.0.0` | DOM Renderer | React 19 client runtime |
| `typescript` | `^5.7.0` | Strict Type Checking | `strict: true`, zero `any` |
| `tailwindcss` | `^3.4.17` | Utility CSS Framework | Stable JIT engine with custom tokens |
| `framer-motion` | `^12.4.0` | Micro-interactions & AnimatePresence | Fluid 60fps layout animations |
| `lucide-react` | `^0.475.0` | Semantic Vector Icons | Tree-shakeable SVG icons |
| `clsx` | `^2.1.1` | Class string composition | Lightweight condition handling |
| `tailwind-merge`| `^3.0.0` | Safe Tailwind utility overrides | Zero style collisions |

---

## 2. Design System Tokens (`ui-ux-pro-max` & `anti-ai-vibe`)

### 2.1 Color Palette Archetype: Swiss Architectural Noir
```css
:root {
  /* Surfaces & Backgrounds */
  --bg-primary: #08090D;      /* Deep Obsidian Noir */
  --bg-surface: #11131A;      /* Elevated structural card surface */
  --bg-surface-hover: #161922;/* Interactive hover elevation */
  --border-subtle: #1E2230;   /* Hairline container borders */
  --border-active: #2D3348;   /* Highlighted border focus */

  /* Typography / Inks */
  --ink-primary: #F4F4F6;     /* 100% Optical contrast text */
  --ink-secondary: #8E93A4;   /* Balanced body & description text */
  --ink-muted: #535868;       /* Subtle metadata, tags, timestamps */

  /* Intentional Zero-Slop Accents */
  --accent-emerald: #10B981;  /* Engineering precision & growth */
  --accent-emerald-glow: rgba(16, 185, 129, 0.15);
  --accent-amber: #F59E0B;    /* Warm accent for badges & alerts */
}
```

### 2.2 Typography Pairing
- **Display / Headlines**: Space Grotesk / Syne (Variable font, tracking `-0.035em`, font-weight `700`, leading `1.05`).
- **Body & Controls**: Geist Sans / DM Sans (Standard weight `400` / `500`, tracking `-0.01em`, leading `1.6`).
- **Data & Tech Badges**: JetBrains Mono (weight `500`, uppercase tracking `+0.05em`, font-size `12px` / `13px`).

---

## 3. Hallmark 57 Quality Gates Cross-Check

1. **No Purple-Blue Gradients**: Strictly enforced. Background is solid obsidian noir (`#08090D`) with physical border hairlines (`#1E2230`).
2. **No 3-Column Clichés**: Portfolio projects are arranged in an asymmetric **Bento Grid** (1 wide featured master project + 2 stacked complementary cards).
3. **No Invented Metrics**: All numbers correspond to verified project realities (e.g., student records, medical donor match rules, audio parser algorithms).
4. **No Fake Browser Chrome**: Project showcases use genuine screenshots and direct interactive previews, not fake Mac traffic light windows.
5. **No Italicized Headings**: Headlines use clean geometric typography with zero arbitrary slant.
6. **No Plain Inter Monotony**: Display text leverages Space Grotesk's distinct architectural geometry.

---

## 4. Coolify VPS Deployment Strategy

- **Build Output**: Next.js Standalone mode (`output: 'standalone'` in `next.config.ts`).
- **Container Footprint**: Multi-stage minimal Node.js Alpine image ($< 150$MB RAM consumption).
- **Health Check Endpoint**: `/api/health` returning `200 OK` for Coolify / Traefik continuous uptime monitoring.
