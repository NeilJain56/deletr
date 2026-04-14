const tiles = [
  {
    title: "No subscription",
    description: "Pay $10 once. Competitors charge $100\u2013$200 per year for the same thing.",
  },
  {
    title: "Zero data stored",
    description: "We process your scan in memory and delete everything after. Nothing persists.",
  },
  {
    title: "Full transparency",
    description: "We name every broker and show every removal. Others hide behind vague dashboards.",
  },
];

export function TrustTiles() {
  return (
    <section className="w-full max-w-5xl px-6 py-20 sm:py-28">
      <p className="mb-10 text-center text-[13px] tracking-wide text-muted-foreground uppercase">
        Why deletr
      </p>
      <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
        {tiles.map((tile) => (
          <div key={tile.title} className="bg-card p-8">
            <h3 className="mb-2 text-[15px] font-medium text-foreground">
              {tile.title}
            </h3>
            <p className="text-[14px] leading-relaxed text-muted-foreground">
              {tile.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
