# Implementation Plan: Abu Huraira Portfolio Platform

**Branch**: `001-portfolio-core` | **Date**: 2026-10-16 | **Spec**: [specs/001-portfolio-core/spec.md](file:///run/media/abu-huraira/346C3D856C3D42C2/PROJECTS%20%28%20antigravity%29/main%20%20portfolio/specs/001-portfolio-core/spec.md)

---

## 1. Technical Context & Constraints

- **Framework**: Next.js 15 (App Router), React 19, TypeScript (Strict).
- **Styling**: Tailwind CSS with Swiss Architectural Noir tokens (`#08090D`, `#11131A`, `#10B981`).
- **Motion**: Framer Motion for micro-interactions, layout transitions, and fluid role rotation.
- **Data Architecture**: Statically compiled type-safe TypeScript models (`src/data/portfolio.ts`) ensuring 100% resilience with zero database runtime failure risks for core portfolio data.
- **Dynamic Handlers**: Next.js Server Action for the contact inquiry form with in-memory / local SQLite persistence and error state feedback.
- **Target Deployment**: Coolify VPS (Docker Standalone container with automated Traefik SSL).
- **Core Constraints**: Lighthouse $\ge 98$, CLS = 0.00, FCP $< 0.8$s, zero Hallmark AI-slop violations.

---

## 2. Directory & Component Architecture Plan

```text
main  portfolio/
├── .specify/                         # GitHub Spec Kit engine & bash scripts
├── specs/001-portfolio-core/         # Feature specifications and checklists
│   ├── spec.md
│   ├── research.md
│   ├── plan.md
│   └── tasks.md
├── public/                           # Static assets, profile image, project previews
│   ├── profile.jpg
│   └── projects/
│       ├── madrasa-preview.png
│       ├── joruri-rokto-preview.png
│       └── agro-voice-preview.png
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Global HTML metadata, fonts, theme wrapper
│   │   ├── page.tsx                  # Root landing page assembling sections
│   │   ├── globals.css               # Swiss Noir tokens & Tailwind directives
│   │   └── api/
│   │       └── health/route.ts       # Healthcheck endpoint for Coolify Traefik
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx            # Floating glass header with availability badge
│   │   │   └── Footer.tsx            # Inverted statement footer with contact action
│   │   ├── hero/
│   │   │   ├── HeroSection.tsx       # 5-role dynamic typographic switcher & morph frame
│   │   │   └── RoleSwitcher.tsx      # Smooth Framer Motion headline rotator
│   │   ├── projects/
│   │   │   ├── BentoGrid.tsx         # Asymmetric project grid
│   │   │   ├── MasterProjectCard.tsx # Madrasa Management System featured card
│   │   │   ├── SecondaryCard.tsx     # Joruri Rokto (জরুরি রক্ত) emergency card
│   │   │   └── VoiceDemoCard.tsx     # Smart Voice Farm & Bangla Speech preview
│   │   ├── skills/
│   │   │   ├── SkillsMatrix.tsx      # Dual-column technical & As-Sunnah training
│   │   │   └── TrainingCard.tsx      # As-Sunnah Skill Development credentials
│   │   └── contact/
│   │       ├── ContactForm.tsx       # Server action validated contact form
│   │       └── SocialLinks.tsx       # GitHub, Email, LinkedIn, Telegram links
│   ├── data/
│   │   └── portfolio.ts              # Typed source of truth for projects, roles, bio
│   ├── types/
│   │   └── portfolio.ts              # Strict TypeScript interfaces
│   └── actions/
│       └── contact.ts                # Next.js Server Action with validation
├── Dockerfile                        # Multi-stage optimized Docker build for Coolify
├── next.config.ts                    # Standalone output configuration
├── package.json                      # Dependency manifests (React 19, Next 15)
├── tailwind.config.ts                # Design tokens & color scale extensions
└── tsconfig.json                     # Strict TypeScript compiler options
```

---

## 3. Phased Execution Roadmap (Zero Code in this Step)

### Phase 1: Scaffolding & Design Foundation
- Scaffold Next.js 15 project structure with TypeScript and Tailwind CSS.
- Configure Tailwind with verified Swiss Noir palette tokens (`--bg-primary`, `--ink-primary`, `--accent-emerald`).
- Setup Space Grotesk / Syne and Geist font loaders.
- Populate `src/types/portfolio.ts` and `src/data/portfolio.ts` with authentic Abu Huraira project records, 5 roles, and As-Sunnah credentials.

### Phase 2: Core Components & Layout Assembly
- **Navbar**: Floating container with monogram `AH` and live status badge.
- **HeroSection**: Fluid 5-role switcher, authentic profile image in morphing frame.
- **BentoGrid (The 3 Flagships)**:
  - *Madrasa Management System* (Master card with live URL & metrics).
  - *Joruri Rokto* (Medical matching & emergency ambulance hub).
  - *Smart Bangla Voice Farm Accountant* (Audio waveform & speech parser demo).
- **Skills & Education Matrix**: Dual-column technical bento cards and As-Sunnah Skill Development training card.
- **Inverted Footer & Contact**: Server Action inquiry form with error states and instant success toasts.

### Phase 3: Verification, Hardening & Coolify Dockerization
- Test across mobile (375px), tablet (768px), and desktop (1440px).
- Audit against all 57 Hallmark Anti-Slop quality gates.
- Create multi-stage `Dockerfile` with `output: 'standalone'`.
- Verify build pass with zero TypeScript or ESLint errors.
