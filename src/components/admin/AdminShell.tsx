'use client';

import { useState, useEffect } from 'react';
import { Inquiry } from '@/lib/inquiriesStore';
import { fetchInquiriesAction, checkAdminSessionAction, logoutAdminAction } from '@/actions/admin';
import { AdminLogin } from './AdminLogin';
import { AdminOverview } from './AdminOverview';
import { InquiriesManager } from './InquiriesManager';
import { ProjectsManager } from './ProjectsManager';
import { ProfileTrustManager } from './ProfileTrustManager';
import { SystemTelemetry } from './SystemTelemetry';
import { AdminSecuritySettings } from './AdminSecuritySettings';
import {
  LayoutDashboard,
  Inbox,
  FolderGit2,
  UserCheck,
  Activity,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Menu,
  X,
  KeyRound,
} from 'lucide-react';
import Link from 'next/link';

export function AdminShell() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'inquiries' | 'projects' | 'profile' | 'telemetry' | 'security'>('overview');
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('ah_admin_token') || undefined : undefined;
    checkAdminSessionAction(token)
      .then((res) => {
        if (res.authenticated) {
          setIsAuthenticated(true);
          loadInquiries(token);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
  }, []);

  const loadInquiries = async (tokenOverride?: string) => {
    const token = tokenOverride || (typeof window !== 'undefined' ? sessionStorage.getItem('ah_admin_token') || undefined : undefined);
    try {
      const data = await fetchInquiriesAction(token);
      setInquiries(data);
    } catch (err) {
      console.error('Error fetching inquiries:', err);
    }
  };

  const handleLogout = async () => {
    await logoutAdminAction();
    sessionStorage.removeItem('ah_admin_auth');
    sessionStorage.removeItem('ah_admin_token');
    setIsAuthenticated(false);
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#08090D] flex items-center justify-center text-xs font-mono text-emerald-400">
        Loading System Control Center...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onAuthenticated={() => {
      setIsAuthenticated(true);
      loadInquiries();
    }} />;
  }

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    {
      id: 'inquiries',
      label: 'Inquiries CRM',
      icon: Inbox,
      badge: inquiries.filter((i) => i.status === 'new').length,
    },
    { id: 'projects', label: 'Projects Directory', icon: FolderGit2 },
    { id: 'profile', label: 'Profile & Trust Hub', icon: UserCheck },
    { id: 'telemetry', label: 'System & VPS Telemetry', icon: Activity },
    { id: 'security', label: 'Security & Passkey', icon: ShieldCheck },
  ] as const;

  return (
    <div className="min-h-screen bg-[#08090D] text-[#F4F4F6] flex flex-col selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-[#11131A]/95 backdrop-blur-md border-b border-[#1E2230] px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus:outline-none"
            title="Open Public Portfolio"
          >
            <div className="w-8 h-8 rounded-full bg-[#161922] border border-[#2E354B] flex items-center justify-center text-xs font-mono font-bold text-emerald-400 group-hover:border-emerald-500/50 transition-colors">
              AH
            </div>
            <div>
              <span className="font-display font-bold text-sm text-[#F4F4F6] group-hover:text-emerald-400 transition-colors block leading-tight">
                Abu Huraira
              </span>
              <span className="text-[10px] font-mono text-emerald-400/80">
                Admin Control Center
              </span>
            </div>
          </Link>

          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400 font-bold uppercase">
            Founder Console
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('security')}
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-colors ${
              activeTab === 'security'
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 font-bold'
                : 'bg-[#161922] hover:bg-[#1B202D] border-[#1E2230] text-[#8E93A4] hover:text-[#F4F4F6]'
            }`}
            title="Set / Change Admin Password"
          >
            <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
            <span>Password Settings</span>
          </button>

          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#161922] hover:bg-[#1B202D] border border-[#1E2230] text-xs font-mono text-[#8E93A4] hover:text-[#F4F4F6] transition-colors"
          >
            <span>Live Portfolio</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-xs font-mono text-rose-400 transition-colors"
            title="Sign out of Admin Dashboard"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg bg-[#161922] border border-[#1E2230] text-[#F4F4F6]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main Layout: Sidebar + Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8 flex flex-col md:flex-row gap-8 items-start">
        {/* Left Navigation Sidebar */}
        <aside
          className={`${
            mobileMenuOpen ? 'block' : 'hidden'
          } md:block w-full md:w-64 shrink-0 space-y-2`}
        >
          <div className="p-2 rounded-2xl bg-[#11131A] border border-[#1E2230] space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-all ${
                    isActive
                      ? 'bg-emerald-500 text-[#08090D] font-bold shadow-md shadow-emerald-500/20'
                      : 'text-[#8E93A4] hover:text-[#F4F4F6] hover:bg-[#161922]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>

                  {'badge' in item && typeof item.badge === 'number' && item.badge > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        isActive
                          ? 'bg-[#08090D] text-emerald-400'
                          : 'bg-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Institutional Credential Seal in Sidebar */}
          <div className="p-4 rounded-2xl bg-[#11131A] border border-[#1E2230] hidden md:block">
            <div className="flex items-center gap-2 text-xs font-bold font-display text-[#F4F4F6] mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Certified Founder</span>
            </div>
            <p className="text-[11px] text-[#8E93A4] font-mono leading-relaxed">
              As-Sunnah Skill Development Institute Graduate.
            </p>
          </div>
        </aside>

        {/* Right Active Tab Content */}
        <main className="flex-1 w-full min-w-0">
          {activeTab === 'overview' && (
            <AdminOverview
              inquiries={inquiries}
              onSelectTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'inquiries' && (
            <InquiriesManager
              inquiries={inquiries}
              onRefresh={loadInquiries}
            />
          )}

          {activeTab === 'projects' && <ProjectsManager />}

          {activeTab === 'profile' && <ProfileTrustManager />}

          {activeTab === 'telemetry' && <SystemTelemetry />}

          {activeTab === 'security' && <AdminSecuritySettings />}
        </main>
      </div>
    </div>
  );
}
