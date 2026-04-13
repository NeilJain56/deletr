"use client";

import Link from "next/link";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-xl font-medium text-teal">
          deletr
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/privacy"
            className="hidden text-sm text-muted-foreground hover:text-foreground sm:block"
          >
            Privacy policy
          </Link>
          <Link
            href="/how-it-works"
            className="hidden text-sm text-muted-foreground hover:text-foreground sm:block"
          >
            How it works
          </Link>
          <Link
            href="/"
            className="rounded-full bg-teal px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-teal-dark"
          >
            Scan free &rarr;
          </Link>
        </div>
      </div>
    </nav>
  );
}
