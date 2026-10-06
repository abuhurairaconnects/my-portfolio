"use client";

import * as React from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): React.ReactElement {
  React.useEffect(() => {
    console.error("Runtime exception encountered:", error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-24 bg-bg text-text">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-12 h-12 rounded-full border border-border bg-surface flex items-center justify-center mx-auto text-accent">
          <AlertTriangle className="w-6 h-6" aria-hidden="true" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text">
          Unexpected Error Encountered
        </h1>
        <p className="text-text-muted text-sm sm:text-base leading-relaxed">
          An unhandled runtime error occurred during rendering. You can attempt to re-render the view.
        </p>
        <div className="pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-accent-fg hover:opacity-90 text-sm font-semibold transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            Retry Execution
          </button>
        </div>
      </div>
    </main>
  );
}
