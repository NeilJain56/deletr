export function SpamEstimate({ estimate }: { estimate: number }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border p-6">
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-warning-light">
        <svg
          className="h-6 w-6 text-warning"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      </div>
      <div>
        <p className="text-base font-medium">
          ~{estimate} spam calls/month estimated
        </p>
        <p className="text-sm text-muted-foreground">
          Based on your exposure across data broker databases
        </p>
      </div>
    </div>
  );
}
