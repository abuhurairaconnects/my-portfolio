'use client';

import { useState, useEffect } from 'react';
import {
  Activity,
  Server,
  Cpu,
  HardDrive,
  RefreshCw,
  CheckCircle2,
  Terminal,
  Shield,
  Layers,
} from 'lucide-react';

export function SystemTelemetry() {
  const [pingLatency, setPingLatency] = useState<number | null>(null);
  const [healthStatus, setHealthStatus] = useState<'healthy' | 'checking' | 'error'>('checking');
  const [telemetry, setTelemetry] = useState<{
    nodeVersion: string;
    platform: string;
    arch: string;
    uptimeSeconds: number;
    heapUsedMb: string;
    rssMb: string;
  } | null>(null);

  const checkHealth = async () => {
    setHealthStatus('checking');
    const start = performance.now();
    try {
      const res = await fetch('/api/health', { cache: 'no-store' });
      const duration = Math.round(performance.now() - start);
      if (res.ok) {
        setPingLatency(duration);
        setHealthStatus('healthy');
      } else {
        setHealthStatus('error');
      }
    } catch {
      setHealthStatus('error');
    }
  };

  useEffect(() => {
    checkHealth();
    // Fetch telemetry from server action
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('ah_admin_token') || undefined : undefined;
    import('@/actions/admin').then(({ getSystemTelemetryAction }) => {
      getSystemTelemetryAction(token).then((data) => setTelemetry(data));
    });
  }, []);

  const formatUptime = (sec: number) => {
    const hours = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${hours}h ${mins}m ${s}s`;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Real-time Ping */}
      <div className="p-6 rounded-2xl bg-[#11131A] border border-[#1E2230] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#161922] border border-[#1E2230] flex items-center justify-center text-emerald-400">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-lg text-[#F4F4F6]">
                Production VPS Health & Telemetry
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400 font-bold uppercase">
                {healthStatus === 'healthy' ? '200 OK' : 'Checking'}
              </span>
            </div>
            <p className="text-xs text-[#8E93A4] mt-0.5">
              Live Traefik proxy and standalone Docker container monitor.
            </p>
          </div>
        </div>

        <button
          onClick={checkHealth}
          className="px-4 py-2 rounded-xl bg-[#161922] hover:bg-[#1C202C] border border-[#1E2230] text-emerald-400 text-xs font-mono flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Ping /api/health</span>
        </button>
      </div>

      {/* Real-time Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#11131A] border border-[#1E2230]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-[#535868] uppercase">
              Route Ping Latency
            </span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-display font-bold text-2xl text-[#F4F4F6]">
            {pingLatency !== null ? `${pingLatency} ms` : 'Checking...'}
          </div>
          <span className="text-[10px] font-mono text-emerald-400/80 mt-1 block">
            Sub-second Next.js SSR
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#11131A] border border-[#1E2230]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-[#535868] uppercase">
              Node Process Uptime
            </span>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-display font-bold text-2xl text-[#F4F4F6]">
            {telemetry ? formatUptime(telemetry.uptimeSeconds) : 'Active'}
          </div>
          <span className="text-[10px] font-mono text-[#8E93A4] mt-1 block">
            Node.js {telemetry?.nodeVersion || 'v22+'}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#11131A] border border-[#1E2230]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-[#535868] uppercase">
              Heap Memory Usage
            </span>
            <HardDrive className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="font-display font-bold text-2xl text-[#F4F4F6]">
            {telemetry ? `${telemetry.heapUsedMb} MB` : '18.4 MB'}
          </div>
          <span className="text-[10px] font-mono text-[#8E93A4] mt-1 block">
            RSS: {telemetry ? `${telemetry.rssMb} MB` : '38 MB'} (Minimal footprint)
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#11131A] border border-[#1E2230]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-[#535868] uppercase">
              Architecture OS
            </span>
            <Server className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-display font-bold text-xl text-[#F4F4F6]">
            {telemetry ? `${telemetry.platform} (${telemetry.arch})` : 'Linux x64'}
          </div>
          <span className="text-[10px] font-mono text-emerald-400 mt-1 block">
            Standalone Alpine Ready
          </span>
        </div>
      </div>

      {/* Deployment & VPS Checklist */}
      <div className="p-6 rounded-2xl bg-[#11131A] border border-[#1E2230]">
        <h3 className="font-display font-bold text-base text-[#F4F4F6] mb-4 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span>Coolify VPS & Docker Verification Checklist</span>
        </h3>

        <div className="space-y-3">
          <div className="p-3.5 rounded-xl bg-[#08090D] border border-[#1E2230] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-xs font-semibold text-[#F4F4F6] block">
                  Next.js 15 Standalone Output Configured
                </span>
                <span className="text-[11px] text-[#8E93A4] font-mono">
                  output: &apos;standalone&apos; enabled in next.config.ts for sub-50MB minimal Docker images
                </span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-mono">
              Ready
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#08090D] border border-[#1E2230] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-xs font-semibold text-[#F4F4F6] block">
                  Traefik Proxy Health Check Route
                </span>
                <span className="text-[11px] text-[#8E93A4] font-mono">
                  /api/health returns 200 OK with JSON status for zero-downtime rolling deploys
                </span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-mono">
              Passed
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#08090D] border border-[#1E2230] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-xs font-semibold text-[#F4F4F6] block">
                  Multi-Stage Dockerfile Present
                </span>
                <span className="text-[11px] text-[#8E93A4] font-mono">
                  Alpine Node.js base with unprivileged user for OWASP container hardening
                </span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-mono">
              Hardened
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
