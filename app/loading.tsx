import * as React from "react";

export default function Loading(): React.ReactElement {
  return (
    <div
      className="min-h-screen bg-bg text-text px-6 py-12 max-w-6xl mx-auto space-y-16 animate-pulse"
      aria-busy="true"
      aria-live="polite"
    >
      {/* Navbar Skeleton */}
      <div className="h-16 rounded-xl border border-border bg-surface/50 w-full flex items-center justify-between px-6" />

      {/* Hero Skeleton */}
      <div className="space-y-6 pt-12">
        <div className="h-6 w-48 rounded bg-surface border border-border" />
        <div className="h-12 w-3/4 rounded bg-surface border border-border" />
        <div className="h-20 w-full max-w-2xl rounded bg-surface border border-border" />
        <div className="flex gap-4 pt-4">
          <div className="h-11 w-36 rounded-lg bg-surface border border-border" />
          <div className="h-11 w-36 rounded-lg bg-surface border border-border" />
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
        <div className="h-64 rounded-xl border border-border bg-surface/40" />
        <div className="h-64 rounded-xl border border-border bg-surface/40" />
      </div>
    </div>
  );
}
