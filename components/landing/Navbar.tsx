"use client";

import Link from "next/link";

export function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link href="/" className="font-heading text-lg tracking-tight text-foreground">
          deletr
        </Link>
        <div className="flex items-center gap-8">
          <Link
            href="/how-it-works"
            className="hidden text-[13px] text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            How it works
          </Link>
          <Link
            href="/privacy"
            className="hidden text-[13px] text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            Privacy
          </Link>
          <Link
            href="/#hero"
            className="rounded-full border border-border bg-secondary px-4 py-1.5 text-[13px] text-foreground transition-all hover:border-muted-foreground/30 hover:bg-muted"
          >
            Get started
          </Link>
        </div>
      </div>
    </nav>
  );
}
