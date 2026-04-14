export function SpamEstimate({ estimate }: { estimate: number }) {
  return (
    <div className="rounded-xl border border-border p-5">
      <div className="flex items-center justify-between">
        <span className="text-[13px] text-muted-foreground">Estimated spam calls</span>
        <span className="font-heading text-xl tracking-tight text-warning">~{estimate}/mo</span>
      </div>
      <p className="mt-1 text-[12px] text-muted-foreground/60">
        Based on your exposure across data broker databases
      </p>
    </div>
  );
}
