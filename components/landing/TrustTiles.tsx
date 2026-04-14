const tiles = [
  {
    icon: (
      <svg className="h-5 w-5 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
    ),
    title: "No subscription",
    description: "Pay $10 once. Competitors charge $100\u2013$200 per year for the same thing.",
    accent: "border-teal/20",
  },
  {
    icon: (
      <svg className="h-5 w-5 text-[#60A5FA]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    title: "Zero data stored",
    description: "We process your scan in memory and delete everything after. Nothing persists.",
    accent: "border-[#60A5FA]/20",
  },
  {
    icon: (
      <svg className="h-5 w-5 text-[#A78BFA]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Full transparency",
    description: "We name every broker and show every removal. Others hide behind vague dashboards.",
    accent: "border-[#A78BFA]/20",
  },
];

export function TrustTiles() {
  return (
    <section className="w-full max-w-5xl px-6 py-20 sm:py-28">
      <p className="mb-10 text-center text-[13px] tracking-wide text-muted-foreground uppercase">
        Why deletr
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        {tiles.map((tile) => (
          <div
            key={tile.title}
            className={`rounded-xl border ${tile.accent} bg-card p-7 transition-colors hover:bg-secondary/50`}
          >
            <div className="mb-4">{tile.icon}</div>
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
