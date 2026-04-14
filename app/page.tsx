import { Navbar } from "@/components/landing/Navbar";
import { HeroInput } from "@/components/landing/HeroInput";
import { TrustTiles } from "@/components/landing/TrustTiles";
import { ComparisonTable } from "@/components/landing/ComparisonTable";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col items-center">
        {/* Hero */}
        <section
          id="hero"
          className="relative flex w-full flex-col items-center px-6 pt-32 pb-24 text-center sm:pt-44 sm:pb-32"
        >
          {/* Radial glow behind hero */}
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-teal/[0.04] blur-[120px] animate-glow-pulse" />

          <p className="animate-fade-in-up mb-6 text-[13px] tracking-wide text-muted-foreground uppercase">
            Data broker removal &middot; $10 one-time
          </p>

          <h1 className="animate-fade-in-up-delay max-w-3xl font-heading text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.05] tracking-[-0.03em] text-foreground">
            Delete your data.
            <br />
            <span className="text-muted-foreground">Not a subscription.</span>
          </h1>

          <p className="animate-fade-in-up-delay-2 mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
            We find every data broker selling your personal information
            and remove it. One payment &mdash; not $120/year.
          </p>

          <div className="animate-fade-in-up-delay-2 mt-10 w-full flex justify-center">
            <HeroInput />
          </div>
        </section>

        {/* Divider */}
        <div className="h-px w-full max-w-5xl bg-border" />

        {/* Trust tiles */}
        <TrustTiles />

        {/* Divider */}
        <div className="h-px w-full max-w-5xl bg-border" />

        {/* Comparison table */}
        <ComparisonTable />

        {/* Bottom CTA */}
        <section className="flex flex-col items-center gap-5 px-6 py-24 text-center sm:py-32">
          <h2 className="font-heading text-[clamp(1.75rem,4vw,3rem)] leading-[1.1] tracking-[-0.02em]">
            Ready to disappear?
          </h2>
          <p className="max-w-md text-muted-foreground">
            Scan is free. Removal is $10. No subscription, no account, no data stored.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
