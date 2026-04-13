"use client";

import Link from "next/link";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-xl font-medium text-teal">
          deletr
        </Link>
        <div className="flex items-center gap-6">
          <a
            href="#privacy-policy"
            className="hidden text-sm text-muted-foreground hover:text-foreground sm:block"
          >
            Privacy policy
          </a>
          <a
            href="#how-it-works"
            className="hidden text-sm text-muted-foreground hover:text-foreground sm:block"
          >
            How it works
          </a>
          <a
            href="#hero"
            className="rounded-full bg-teal px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-dark"
          >
            Scan free &rarr;
          </a>
        </div>
      </div>
    </nav>
  );
}
