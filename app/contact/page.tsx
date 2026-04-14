import Link from "next/link";
import { Footer } from "@/components/landing/Footer";

export default function ContactPage() {
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
            Contact
          </h1>
          <p className="mb-12 text-[13px] text-muted-foreground">
            We typically respond within 24&ndash;48 hours.
          </p>

          <div className="space-y-4">
            <div className="rounded-xl border border-border p-6">
              <p className="mb-1 text-[13px] text-muted-foreground">General support</p>
              <a
                href="mailto:support@deletr.io"
                className="text-[15px] font-medium text-teal hover:underline"
              >
                support@deletr.io
              </a>
              <p className="mt-2 text-[13px] text-muted-foreground">
                Questions about your scan, payment, or deletion report.
              </p>
            </div>

            <div className="rounded-xl border border-border p-6">
              <p className="mb-1 text-[13px] text-muted-foreground">Privacy inquiries</p>
              <a
                href="mailto:privacy@deletr.io"
                className="text-[15px] font-medium text-teal hover:underline"
              >
                privacy@deletr.io
              </a>
              <p className="mt-2 text-[13px] text-muted-foreground">
                CCPA requests, data deletion inquiries, or privacy concerns.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
