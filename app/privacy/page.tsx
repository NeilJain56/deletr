import Link from "next/link";
import { Footer } from "@/components/landing/Footer";

const sections = [
  {
    title: "1. Information we collect",
    content:
      "We collect your phone number or email address solely for the purpose of verifying your identity and scanning data brokers on your behalf. Stripe handles all payment processing \u2014 we never see or store your card details.",
  },
  {
    title: "2. How we use your information",
    content:
      "Your information is used exclusively for: scanning data broker databases, submitting opt-out requests on your behalf, and emailing your deletion proof report. We do not use your information for marketing purposes.",
  },
  {
    title: "3. Data retention",
    content:
      "We do not maintain persistent storage of your personal information. All data is processed in-memory and via temporary cache with automatic expiration. Your email address is purged after the deletion report is delivered.",
  },
  {
    title: "4. Third-party services",
    content:
      "We use Stripe for payment processing, Twilio/Resend for verification communications, and data broker APIs for opt-out submissions. We do not sell, rent, or share your personal information with any third party.",
  },
  {
    title: "5. CCPA rights",
    content:
      "Under the California Consumer Privacy Act, you have the right to know what personal information we collect, request deletion of your data, and opt out of the sale of your information. Contact: privacy@deletr.io",
  },
  {
    title: "6. Security",
    content:
      "All data transmission uses TLS 1.3 encryption. We follow the principle of least privilege for all system access. Security incidents are reviewed within 24 hours.",
  },
  {
    title: "7. Contact",
    content:
      "For privacy inquiries: privacy@deletr.io. For support: support@deletr.io. This service is available to US residents only.",
  },
];

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="mb-10 text-sm text-muted-foreground">
            Last updated: April 2026 &middot; Governing law: State of California
          </p>

          <div className="space-y-8">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="mb-2 text-lg font-semibold text-foreground">
                  {section.title}
                </h2>
                <p className="leading-relaxed text-muted-foreground">
                  {section.content}
                </p>
              </section>
            ))}
          </div>

          <p className="mt-12 text-center text-xs text-muted-foreground">
            Last updated: April 2026 &middot; Governing law: State of California &middot; Effective immediately upon use
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
