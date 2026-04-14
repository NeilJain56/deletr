import Link from "next/link";
import { Footer } from "@/components/landing/Footer";

const steps = [
  {
    number: "01",
    title: "Enter your phone or email",
    description:
      "We verify ownership with a one-time code. This ensures only you can initiate removal requests for your data.",
  },
  {
    number: "02",
    title: "We scan data brokers",
    description:
      "Our system searches 10+ data broker databases for your personal information, including name, phone, email, and address records.",
  },
  {
    number: "03",
    title: "Pay $10 one-time",
    description:
      "We submit opt-out requests to every broker that holds your information. No subscriptions, no recurring charges.",
  },
  {
    number: "04",
    title: "Get your proof report",
    description:
      "A detailed proof report is emailed to you with every deletion confirmed. See exactly which brokers were contacted and each removal status.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 px-6 py-16">
        <div className="mx-auto max-w-2xl">
          <Link
            href="/"
            className="mb-10 inline-flex text-[13px] text-muted-foreground transition-colors hover:text-foreground"
          >
            &larr; Back
          </Link>

          <h1 className="mb-2 font-heading text-[clamp(1.75rem,4vw,2.5rem)] tracking-[-0.02em]">
            How it works
          </h1>
          <p className="mb-12 text-[13px] text-muted-foreground">
            Four steps to remove your data from broker databases.
          </p>

          <div className="space-y-px overflow-hidden rounded-xl border border-border bg-border">
            {steps.map((step) => (
              <div key={step.number} className="flex gap-6 bg-card p-6">
                <span className="flex-shrink-0 font-heading text-2xl text-muted-foreground/30">
                  {step.number}
                </span>
                <div>
                  <h2 className="mb-1 text-[15px] font-medium text-foreground">
                    {step.title}
                  </h2>
                  <p className="text-[14px] leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
