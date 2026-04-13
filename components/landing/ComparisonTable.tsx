import { Badge } from "@/components/ui/badge";

type CellColor = "green" | "red" | "amber";

interface Row {
  feature: string;
  deletr: { text: string; color: CellColor };
  competitors: { text: string; color: CellColor };
}

const rows: Row[] = [
  {
    feature: "Pricing",
    deletr: { text: "$10 one-time", color: "green" },
    competitors: { text: "$100\u2013$200/yr", color: "red" },
  },
  {
    feature: "Account required",
    deletr: { text: "No", color: "green" },
    competitors: { text: "Yes", color: "red" },
  },
  {
    feature: "Broker list shown",
    deletr: { text: "Every broker, named", color: "green" },
    competitors: { text: "Hidden or partial", color: "red" },
  },
  {
    feature: "Data stored after deletion",
    deletr: { text: "None", color: "green" },
    competitors: { text: "Profile kept on file", color: "red" },
  },
  {
    feature: "Family coverage",
    deletr: { text: "$25 for 5 people", color: "green" },
    competitors: { text: "Extra per person/yr", color: "amber" },
  },
  {
    feature: "Proof of deletion",
    deletr: { text: "Full report emailed", color: "green" },
    competitors: { text: "Varies by provider", color: "amber" },
  },
];

const colorMap: Record<CellColor, string> = {
  green: "bg-teal-light text-teal-dark border-transparent",
  red: "bg-danger-light text-danger border-transparent",
  amber: "bg-warning-light text-warning border-transparent",
};

export function ComparisonTable() {
  return (
    <section className="w-full max-w-6xl px-4 sm:px-6">
      <h2 className="mb-6 text-center text-2xl font-medium tracking-tight">
        How we compare
      </h2>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Feature
              </th>
              <th className="px-4 py-3 text-left font-medium text-teal">
                deletr
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Competitors
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.feature} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium">{row.feature}</td>
                <td className="px-4 py-3">
                  <Badge className={colorMap[row.deletr.color]}>
                    {row.deletr.text}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge className={colorMap[row.competitors.color]}>
                    {row.competitors.text}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
