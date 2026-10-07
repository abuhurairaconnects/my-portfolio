"use client";

import * as React from "react";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): React.ReactElement {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0B0F17] text-[#F8FAFC] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6 p-8 rounded-2xl border border-white/10 bg-white/5">
          <h2 className="text-2xl font-bold tracking-tight">Something went wrong</h2>
          <p className="text-sm text-slate-400">
            A critical system error occurred. You can attempt to recover the session.
          </p>
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-lg bg-orange-600 text-white font-medium hover:bg-orange-500 transition-colors"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
