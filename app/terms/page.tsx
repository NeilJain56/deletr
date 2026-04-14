import Link from "next/link";
import { Footer } from "@/components/landing/Footer";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content:
      'By accessing or using Deletr.io ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use the Service. We reserve the right to update these terms at any time, and your continued use of the Service constitutes acceptance of any modifications.',
  },
  {
    title: "2. Service Description",
    content:
      "Deletr.io is a data broker removal service. We scan publicly available data broker databases for your personal information and submit opt-out requests on your behalf. The Service is offered as a one-time transaction and does not include ongoing monitoring or repeated removals. Results may vary depending on data broker responsiveness and compliance.",
  },
  {
    title: "3. Payment Terms",
    content:
      "The Service is offered at a one-time fee of $10 for individuals or $25 for families (up to 4 members). All payments are non-refundable once processing has begun. Payments are securely processed by Stripe. Deletr.io does not store your payment card information. Prices are subject to change, but any changes will not affect transactions already completed.",
  },
  {
    title: "4. Disclaimer of Warranties",
    content:
      'The Service is provided on an "as-is" and "as-available" basis. Deletr.io makes no warranties, express or implied, regarding the completeness or effectiveness of data broker removals. We do not guarantee that all data brokers will comply with opt-out requests, as compliance depends on each broker\'s policies and applicable law.',
  },
  {
    title: "5. Limitation of Liability",
    content:
      "To the maximum extent permitted by applicable law, Deletr.io and its officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Service. Our total liability for any claim arising from the Service shall not exceed the amount you paid for the Service.",
  },
  {
    title: "6. User Responsibilities",
    content:
      "You agree to provide accurate and truthful personal information when using the Service. The Service is available to United States residents only. You must be at least 18 years of age to use the Service. You are responsible for maintaining the confidentiality of any verification codes sent to you.",
  },
  {
    title: "7. Intellectual Property",
    content:
      "All content, trademarks, logos, and intellectual property displayed on Deletr.io are the property of Deletr.io or its licensors. You may not reproduce, distribute, modify, or create derivative works from any content on the Service without prior written consent.",
  },
  {
    title: "8. Termination",
    content:
      "We reserve the right to suspend or terminate your access to the Service at our sole discretion, without notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties.",
  },
  {
    title: "9. Governing Law",
    content:
      "These Terms of Service shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions.",
  },
  {
    title: "10. Contact",
    content:
      "If you have any questions about these Terms of Service, please contact us at support@deletr.io.",
  },
];

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="mb-12 text-[13px] text-muted-foreground">
            Last updated April 2026 &middot; Governing law: California
          </p>

          <div className="space-y-8">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="mb-2 text-[15px] font-medium text-foreground">
                  {section.title}
                </h2>
                <p className="text-[14px] leading-relaxed text-muted-foreground">
                  {section.content}
                </p>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
