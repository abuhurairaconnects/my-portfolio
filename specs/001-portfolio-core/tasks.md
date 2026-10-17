# Tasks: Abu Huraira Portfolio Platform

**Feature**: `001-portfolio-core`  
**Input**: Design documents from `specs/001-portfolio-core/`  
**Status**: All Tasks Verified & Completed  

---

## Phase 1: Setup & Shared Infrastructure
- [x] T001 Initialize `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, and `tailwind.config.ts` with strict TypeScript and Swiss Noir design tokens.
- [x] T002 Install verified dependencies (`next@^15.5.28`, `react@^19.0.0`, `react-dom@^19.0.0`, `typescript@^5.7.0`, `tailwindcss@^3.4.17`, `framer-motion@^12.4.0`, `lucide-react@^0.475.0`, `clsx`, `tailwind-merge`).
- [x] T003 [P] Create `src/types/portfolio.ts` with strict TypeScript contracts for `Project`, `SkillGroup`, `EducationBackground`, and `ContactSubmission`.
- [x] T004 [P] Create `src/data/portfolio.ts` with complete, authentic Abu Huraira records (the 5 roles, 3 flagship real-world systems, As-Sunnah Skill Development training, verified contacts).
- [x] T005 [P] Setup `public/` directory with authentic profile photo and project preview assets.

---

## Phase 2: Foundational Layout & Design Tokens
- [x] T006 [US1] Create `src/app/globals.css` with Swiss Architectural Noir CSS custom variables, optical resets, and custom scrollbar styles.
- [x] T007 [US1] Create `src/app/layout.tsx` configuring Next.js font loaders (Space Grotesk, DM Sans, JetBrains Mono) and OpenGraph SEO metadata.
- [x] T008 [US1] Create `src/components/layout/Navbar.tsx` featuring the floating glass container, monogram `AH`, semantic section links, and live availability badge.

---

## Phase 3: Core User Stories Implementation
- [x] T009 [US1] Create `src/components/hero/RoleSwitcher.tsx` with Framer Motion fluid typographic rotator across the 5 roles (Full-Stack Web, Software, Application, AI Automation, AI Business Automation).
- [x] T010 [US1] Create `src/components/hero/HeroSection.tsx` with asymmetric layout, location tag (Dhaka · UTC+6), primary CTA buttons, and authentic photo frame.
- [x] T011 [US2] Create `src/components/projects/MasterProjectCard.tsx` showcasing the *Madrasa Management System* with problem/solution, live Render URL, metrics, and role-based architecture.
- [x] T012 [US2] Create `src/components/projects/SecondaryCard.tsx` showcasing *Joruri Rokto (জরুরি রক্ত)* with emergency medical blood matching and ambulance hub.
- [x] T013 [US2] Create `src/components/projects/VoiceDemoCard.tsx` showcasing *Smart Bangla Voice Farm Accountant* with interactive audio waveform and speech-to-ledger preview.
- [x] T014 [US2] Create `src/components/projects/BentoGrid.tsx` assembling the asymmetric 3-project showcase with zero cookie-cutter cards.
- [x] T015 [US3] Create `src/components/skills/TrainingCard.tsx` highlighting As-Sunnah Skill Development credentials, Islamic Studies values, and digital media skills.
- [x] T016 [US3] Create `src/components/skills/SkillsMatrix.tsx` with technical bento cards categorized into Frontend, Backend & Database, DevOps, and AI Workflows.
- [x] T017 [US4] Create `src/actions/contact.ts` Next.js Server Action with payload validation and error resilience.
- [x] T018 [US4] Create `src/components/contact/ContactForm.tsx` with client-side feedback, loading states, and instant success confirmation.
- [x] T019 [US4] Create `src/components/layout/Footer.tsx` with inverted high-contrast layout, contact action, and direct connection channels.
- [x] T020 [US4] Assemble root landing page in `src/app/page.tsx` integrating all sections and create `/api/health/route.ts` for Traefik health checks.

---

## Phase 4: Production Gates, Docker & Verification
- [x] T021 Create multi-stage `Dockerfile` with `output: 'standalone'` for Coolify VPS deployment.
- [x] T022 Run TypeScript compiler check (`npx tsc --noEmit`) and verify zero errors.
- [x] T023 Run production build (`npm run build`) and verify successful static generation.
- [x] T024 Audit against all 57 Hallmark Anti-Slop gates and verify responsive viewports (375px, 768px, 1440px).
