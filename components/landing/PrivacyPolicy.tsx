import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const clauses = [
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

export function PrivacyPolicy() {
  return (
    <section id="privacy-policy" className="w-full max-w-6xl px-4 sm:px-6">
      <h2 className="mb-6 text-center text-2xl font-medium tracking-tight">
        Privacy policy
      </h2>
      <Accordion className="rounded-xl border border-border">
        {clauses.map((clause) => (
          <AccordionItem key={clause.title} value={clause.title}>
            <AccordionTrigger className="px-4 text-sm font-medium">
              {clause.title}
            </AccordionTrigger>
            <AccordionContent className="px-4 text-sm text-muted-foreground">
              {clause.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <p className="mt-4 text-center text-xs text-muted-foreground">
        Last updated: April 2026 &middot; Governing law: State of California &middot; Effective immediately upon use
      </p>
    </section>
  );
}
