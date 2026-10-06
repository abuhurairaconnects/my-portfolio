import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound(): React.ReactElement {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-24 bg-bg text-text">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-block px-3 py-1 text-xs font-mono font-medium rounded-full border border-border bg-surface text-accent">
          HTTP 404
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text">
          Page Not Found
        </h1>
        <p className="text-text-muted text-sm sm:text-base leading-relaxed">
          The requested route or architectural document does not exist or has been relocated.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border bg-surface hover:border-accent hover:text-accent text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Back to Overview
          </Link>
        </div>
      </div>
    </main>
  );
}
