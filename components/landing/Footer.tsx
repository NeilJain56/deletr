import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-10 sm:flex-row sm:justify-between">
        <p className="text-[13px] text-muted-foreground">
          &copy; 2026 Deletr
        </p>
        <div className="flex gap-8 text-[13px] text-muted-foreground">
          <Link href="/privacy" className="transition-colors hover:text-foreground">
            Privacy
          </Link>
          <Link href="/terms" className="transition-colors hover:text-foreground">
            Terms
          </Link>
          <Link href="/contact" className="transition-colors hover:text-foreground">
            Contact
          </Link>
          <Link href="/how-it-works" className="transition-colors hover:text-foreground">
            How it works
          </Link>
        </div>
      </div>
    </footer>
  );
}
