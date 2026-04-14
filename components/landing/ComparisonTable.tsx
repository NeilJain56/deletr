interface Row {
  feature: string;
  deletr: string;
  competitors: string;
  deletrGood: boolean;
}

const rows: Row[] = [
  {
    feature: "Pricing",
    deletr: "$10 one-time",
    competitors: "$100\u2013$200/yr",
    deletrGood: true,
  },
  {
    feature: "Account required",
    deletr: "No",
    competitors: "Yes",
    deletrGood: true,
  },
  {
    feature: "Broker list shown",
    deletr: "Every broker, named",
    competitors: "Hidden or partial",
    deletrGood: true,
  },
  {
    feature: "Data stored after",
    deletr: "None",
    competitors: "Profile kept on file",
    deletrGood: true,
  },
  {
    feature: "Family plan",
    deletr: "$25 for 5 people",
    competitors: "Extra per person/yr",
    deletrGood: true,
  },
  {
    feature: "Proof of deletion",
    deletr: "Full report emailed",
    competitors: "Varies",
    deletrGood: true,
  },
];

export function ComparisonTable() {
  return (
    <section className="w-full max-w-5xl px-6 py-20 sm:py-28">
      <p className="mb-4 text-center text-[13px] tracking-wide text-muted-foreground uppercase">
        Comparison
      </p>
      <h2 className="mb-10 text-center font-heading text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.15] tracking-[-0.02em]">
        How we compare
      </h2>
      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-5 py-3.5 text-left text-[13px] font-normal text-muted-foreground" />
              <th className="px-5 py-3.5 text-left text-[13px] font-medium text-teal">
                deletr
              </th>
              <th className="px-5 py-3.5 text-left text-[13px] font-normal text-muted-foreground">
                Others
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.feature}
                className="border-b border-border last:border-0 transition-colors hover:bg-secondary/50"
              >
                <td className="px-5 py-3.5 text-[13px] text-muted-foreground">
                  {row.feature}
                </td>
                <td className="px-5 py-3.5 text-[13px] text-foreground">
                  {row.deletr}
                </td>
                <td className="px-5 py-3.5 text-[13px] text-muted-foreground">
                  {row.competitors}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
