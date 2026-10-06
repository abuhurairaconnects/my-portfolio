"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { portfolio } from "@/data/portfolio";
import { PortfolioData } from "@/lib/validations";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/Button";

const NAV_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#stack" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

interface NavbarProps {
  data?: PortfolioData;
}

export function Navbar({ data = portfolio }: NavbarProps): React.ReactElement {
  const [mounted, setMounted] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);
  const [activeSection, setActiveSection] = React.useState<string>("#home");
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const drawerRef = React.useRef<HTMLDivElement | null>(null);
  const isClickNavigatingRef = React.useRef<boolean>(false);
  const clickTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Reliable scroll detection for active section & navbar appearance
  React.useEffect(() => {
    let ticking = false;

    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > 20);

      // If user recently clicked a nav item, don't let scroll listener bounce the pill
      if (isClickNavigatingRef.current) return;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Bottom of page detection (activates Contact immediately)
          const isAtBottom =
            window.innerHeight + window.scrollY >=
            document.documentElement.scrollHeight - 80;

          if (isAtBottom) {
            setActiveSection("#contact");
            ticking = false;
            return;
          }

          if (window.scrollY < 120) {
            setActiveSection("#home");
            ticking = false;
            return;
          }

          // Focal line at 38% from top of viewport
          const focalPoint = window.innerHeight * 0.38;

          for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
            const item = NAV_ITEMS[i];
            const el = document.getElementById(item.href.slice(1));
            if (!el) continue;
            const rect = el.getBoundingClientRect();
            if (rect.top <= focalPoint) {
              setActiveSection(item.href);
              break;
            }
          }

          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    };
  }, []);

  // Esc key & body scroll lock handling for mobile drawer
  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent): void => {
        if (e.key === "Escape") {
          setMobileMenuOpen(false);
          triggerRef.current?.focus();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileMenuOpen]);

  const handleNavClick = (
    e?: React.MouseEvent<HTMLElement>,
    href?: string
  ): void => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
      document.body.style.overflow = "";
      triggerRef.current?.focus();
    }

    if (href) {
      setActiveSection(href);
      isClickNavigatingRef.current = true;

      // Lock scroll interference for 950ms until smooth scroll finishes
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = setTimeout(() => {
        isClickNavigatingRef.current = false;
      }, 950);

      // On mobile and desktop, execute smooth scroll cleanly
      const targetId = href.replace("#", "");
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        e?.preventDefault();
        setTimeout(() => {
          targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 40);
      }
    }
  };

  return (
    <>
      <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
        isScrolled
          ? "bg-white/95 dark:bg-[#0B0F17]/95 backdrop-blur-md border-b border-border shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Left: Monogram and Name */}
        <Link
          href="#home"
          onClick={(e) => handleNavClick(e, "#home")}
          className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg p-1 -m-1"
          aria-label={`${data.person.name} Home`}
        >
          <span className="w-9 h-9 rounded-xl bg-accent text-accent-fg font-mono font-bold flex items-center justify-center text-sm shadow-sm transition-transform group-hover:scale-105">
            {data.person.monogram}
          </span>
          <span className="font-semibold text-text text-sm sm:text-base tracking-tight group-hover:text-accent transition-colors">
            {data.person.name}
          </span>
        </Link>

        {/* Center: Desktop Navigation with Ultra-Smooth Sliding Pill */}
        <nav
          aria-label="Main Navigation"
          className="hidden md:flex items-center gap-1 bg-slate-100/90 dark:bg-slate-900/90 border border-border/80 px-2 py-1.5 rounded-full backdrop-blur-md shadow-sm"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`relative px-4 py-1.5 text-xs font-medium rounded-full transition-colors z-10 ${
                  isActive
                    ? "text-accent-fg font-semibold"
                    : "text-text-muted hover:text-text"
                }`}
              >
                {/* Silky Gliding Orange Pill without bounce or jitter */}
                {isActive && (
                  <motion.span
                    layoutId="navbar-active-pill"
                    className="absolute inset-0 bg-accent rounded-full -z-10 shadow-sm"
                    transition={{
                      type: "spring",
                      stiffness: 420,
                      damping: 34,
                      mass: 0.5,
                    }}
                  />
                )}
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Right: Theme Toggle & Get in Touch */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Button
            href="#contact"
            variant="primary"
            size="sm"
            className="gap-1.5 shadow-sm"
            onClick={(e) => handleNavClick(e, "#contact")}
          >
            <span>Get in Touch</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Button>
        </div>

        {/* Mobile: Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl border border-border bg-surface flex items-center justify-center text-text hover:border-accent hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-drawer"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>

    {/* Mobile Drawer (Portal to body: 100% full-screen, opaque, immune to header clipping) */}
    {mounted &&
      createPortal(
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              id="mobile-drawer"
              ref={drawerRef}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation Menu"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              style={{ backgroundColor: "var(--bg)" }}
              className="fixed inset-0 z-[99999] flex flex-col justify-between p-6 bg-white dark:bg-[#0B0F17] overflow-y-auto md:hidden"
            >
              {/* Drawer Header: Logo/Monogram, ThemeToggle, Close Button */}
              <div className="flex items-center justify-between pb-5 border-b border-border shrink-0">
                <Link
                  href="#home"
                  onClick={(e) => handleNavClick(e, "#home")}
                  className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg"
                  aria-label={`${data.person.name} Home`}
                >
                  <span className="w-9 h-9 rounded-xl bg-accent text-accent-fg font-mono font-bold flex items-center justify-center text-sm shadow-sm">
                    {data.person.monogram}
                  </span>
                  <span className="font-semibold text-text text-base tracking-tight">
                    {data.person.name}
                  </span>
                </Link>

                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      document.body.style.overflow = "";
                      triggerRef.current?.focus();
                    }}
                    className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl border border-border bg-surface flex items-center justify-center text-text hover:border-accent hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Navigation Links */}
              <nav
                aria-label="Mobile Navigation"
                className="flex flex-col gap-2.5 py-6 my-auto"
              >
                {NAV_ITEMS.map((item) => {
                  const isActive = activeSection === item.href;
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className={`px-4 py-3.5 rounded-xl text-base font-medium transition-all flex items-center justify-between min-h-[48px] ${
                        isActive
                          ? "bg-accent text-accent-fg font-semibold shadow-md"
                          : "text-text bg-surface/80 hover:bg-surface border border-border/70 hover:border-accent/40"
                      }`}
                    >
                      <span className="text-base tracking-tight">{item.label}</span>
                      <ArrowRight
                        className={`w-4 h-4 transition-transform ${
                          isActive ? "text-accent-fg translate-x-1" : "text-text-muted"
                        }`}
                        aria-hidden="true"
                      />
                    </a>
                  );
                })}
              </nav>

              {/* Bottom Actions */}
              <div className="pt-5 border-t border-border flex flex-col gap-3 shrink-0">
                <Button
                  href="#contact"
                  variant="primary"
                  size="md"
                  className="w-full justify-center min-h-[48px] text-base font-semibold shadow-md"
                  onClick={(e) => handleNavClick(e, "#contact")}
                >
                  <span>Get in Touch</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" aria-hidden="true" />
                </Button>
                <p className="text-xs text-center text-text-muted font-mono pt-1">
                  {data.person.role} • {data.person.location}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
