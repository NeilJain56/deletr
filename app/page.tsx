import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/landing/Navbar";
import { HeroInput } from "@/components/landing/HeroInput";
import { TrustTiles } from "@/components/landing/TrustTiles";
import { ComparisonTable } from "@/components/landing/ComparisonTable";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col items-center gap-20 pb-20">
        {/* Hero */}
        <section
          id="hero"
          className="flex w-full max-w-6xl flex-col items-center gap-8 px-4 pt-20 text-center sm:px-6 sm:pt-28"
        >
          <Badge className="bg-teal-light text-teal-dark border-transparent px-4 py-1.5 text-xs font-medium">
            US data broker removal &middot; $10 one-time
          </Badge>
          <h1 className="max-w-2xl text-[34px] font-medium leading-tight tracking-[-0.8px]">
            Delete your data. Not a subscription.
          </h1>
          <p className="max-w-xl text-base text-muted-foreground">
            We find every data broker selling your personal information and
            remove it. One payment of $10 &mdash; not $120/year like everyone
            else.
          </p>
          <HeroInput />
        </section>

        {/* Trust tiles */}
        <TrustTiles />

        {/* Comparison table */}
        <ComparisonTable />

        {/* Compliance badges */}
        <section className="flex w-full max-w-6xl flex-wrap items-center justify-center gap-3 px-4 sm:px-6">
          {[
            "CCPA Compliant",
            "Stripe Payments",
            "256-bit Encryption",
            "US-only Data Handling",
          ].map((badge) => (
            <Badge
              key={badge}
              variant="outline"
              className="border-border px-3 py-1 text-xs text-muted-foreground"
            >
              {badge}
            </Badge>
          ))}
        </section>

      </main>
      <Footer />
    </>
  );
}
