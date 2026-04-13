import Link from "next/link";
import { Footer } from "@/components/landing/Footer";

const steps = [
  {
    number: 1,
    title: "Enter your phone or email",
    description:
      "We verify ownership of your contact information with a one-time code. This ensures only you can initiate removal requests for your data.",
  },
  {
    number: 2,
    title: "We scan data broker databases",
    description:
      "Our system searches 10+ data broker databases for your personal information, including your name, phone number, email, address, and other publicly listed records.",
  },
  {
    number: 3,
    title: "Pay $10 one-time",
    description:
      "Once the scan is complete, pay a single fee of $10 and we submit opt-out requests to every data broker that holds your information. No subscriptions, no recurring charges.",
  },
  {
    number: 4,
    title: "Get your proof report",
    description:
      "You receive a detailed proof report emailed directly to you with every deletion confirmed. See exactly which brokers were contacted and the status of each removal request.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <main className="flex-1 px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/"
            className="mb-8 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            &larr; Back to home
          </Link>

          <h1 className="mb-2 text-3xl font-bold tracking-tight">
            How It Works
          </h1>
          <p className="mb-10 text-sm text-muted-foreground">
            Four simple steps to remove your personal data from broker
            databases.
          </p>

          <div className="space-y-6">
            {steps.map((step) => (
              <div
                key={step.number}
                className="flex gap-5 rounded-xl border border-border bg-card p-6"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal text-base font-bold text-background">
                  {step.number}
                </div>
                <div>
                  <h2 className="mb-1 text-lg font-semibold text-foreground">
                    {step.title}
                  </h2>
                  <p className="leading-relaxed text-muted-foreground">
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
