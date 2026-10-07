import * as React from "react";

export default function AdminLoading(): React.ReactElement {
  return (
    <div
      className="min-h-screen bg-bg text-text px-6 py-12 max-w-6xl mx-auto space-y-8 animate-pulse"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div className="h-8 w-48 rounded bg-surface border border-border" />
        <div className="h-10 w-28 rounded-lg bg-surface border border-border" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-28 rounded-xl bg-surface border border-border" />
        <div className="h-28 rounded-xl bg-surface border border-border" />
        <div className="h-28 rounded-xl bg-surface border border-border" />
      </div>

      <div className="h-96 rounded-2xl bg-surface border border-border" />
    </div>
  );
}
