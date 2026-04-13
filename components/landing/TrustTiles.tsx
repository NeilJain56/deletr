import { Card, CardContent } from "@/components/ui/card";

const tiles = [
  {
    icon: "\uD83D\uDEAB",
    title: "No subscription",
    description:
      "Pay $10 once. Competitors charge $100\u2013$200 per year.",
  },
  {
    icon: "\uD83D\uDD12",
    title: "Zero data stored",
    description:
      "We process your scan and delete all information immediately after.",
  },
  {
    icon: "\uD83D\uDC41",
    title: "Full transparency",
    description:
      "We show you every broker we remove you from. Others hide this.",
  },
];

export function TrustTiles() {
  return (
    <section id="how-it-works" className="w-full max-w-6xl px-4 sm:px-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {tiles.map((tile) => (
          <Card key={tile.title} className="border-border/50">
            <CardContent className="flex flex-col gap-2 p-6">
              <span className="text-3xl">{tile.icon}</span>
              <h3 className="text-base font-medium">{tile.title}</h3>
              <p className="text-sm text-muted-foreground">
                {tile.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
