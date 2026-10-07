import * as React from "react";

export default function ProjectLoading(): React.ReactElement {
  return (
    <div
      className="min-h-screen bg-bg text-text px-6 py-12 max-w-5xl mx-auto space-y-12 animate-pulse"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="h-6 w-32 rounded bg-surface border border-border" />
      
      <div className="space-y-4">
        <div className="h-10 w-3/4 rounded bg-surface border border-border" />
        <div className="h-6 w-1/2 rounded bg-surface border border-border" />
      </div>

      <div className="aspect-video w-full rounded-2xl bg-surface border border-border" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-32 rounded-xl bg-surface border border-border md:col-span-2" />
        <div className="h-32 rounded-xl bg-surface border border-border" />
      </div>
    </div>
  );
}
