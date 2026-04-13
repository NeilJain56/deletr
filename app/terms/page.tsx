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
      'The Service is provided on an "as-is" and "as-available" basis. Deletr.io makes no warranties, express or implied, regarding the completeness or effectiveness of data broker removals. We do not guarantee that all data brokers will comply with opt-out requests, as compliance depends on each broker\'s policies and applicable law. We do not warrant that the Service will be uninterrupted, error-free, or completely secure.',
  },
  {
    title: "5. Limitation of Liability",
    content:
      "To the maximum extent permitted by applicable law, Deletr.io and its officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Service. Our total liability for any claim arising from the Service shall not exceed the amount you paid for the Service.",
  },
  {
    title: "6. User Responsibilities",
    content:
      "You agree to provide accurate and truthful personal information when using the Service. Providing false or misleading information may result in termination of your access. The Service is available to United States residents only. You must be at least 18 years of age to use the Service. You are responsible for maintaining the confidentiality of any verification codes sent to you.",
  },
  {
    title: "7. Intellectual Property",
    content:
      "All content, trademarks, logos, and intellectual property displayed on Deletr.io are the property of Deletr.io or its licensors. You may not reproduce, distribute, modify, or create derivative works from any content on the Service without prior written consent.",
  },
  {
    title: "8. Termination",
    content:
      "We reserve the right to suspend or terminate your access to the Service at our sole discretion, without notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties. Upon termination, your right to use the Service ceases immediately.",
  },
  {
    title: "9. Governing Law",
    content:
      "These Terms of Service shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions. Any disputes arising under these terms shall be resolved in the state or federal courts located in California.",
  },
  {
    title: "10. Contact",
    content:
      "If you have any questions about these Terms of Service, please contact us at support@deletr.io. We will make reasonable efforts to respond to your inquiry within 48 hours.",
  },
];

export default function TermsPage() {
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
            Terms of Service
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
        </div>
      </main>
      <Footer />
    </div>
  );
}
