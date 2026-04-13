import Link from "next/link";
import { Footer } from "@/components/landing/Footer";

const contacts = [
  {
    label: "General Support",
    email: "support@deletr.io",
    description: "Questions about your scan, payment, or deletion report.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-teal"
      >
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
  {
    label: "Privacy Inquiries",
    email: "privacy@deletr.io",
    description:
      "CCPA requests, data deletion inquiries, or privacy-related concerns.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-teal"
      >
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
];

export default function ContactPage() {
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
            Contact Us
          </h1>
          <p className="mb-10 text-sm text-muted-foreground">
            We&apos;re here to help. Reach out using one of the channels below.
          </p>

          <div className="grid gap-6 sm:grid-cols-2">
            {contacts.map((contact) => (
              <div
                key={contact.email}
                className="rounded-xl border border-border bg-card p-6"
              >
                <div className="mb-4">{contact.icon}</div>
                <h2 className="mb-1 text-lg font-semibold text-foreground">
                  {contact.label}
                </h2>
                <a
                  href={`mailto:${contact.email}`}
                  className="mb-3 inline-block text-sm font-medium text-teal hover:underline"
                >
                  {contact.email}
                </a>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {contact.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-border bg-card p-6 text-center">
            <p className="text-sm text-muted-foreground">
              We typically respond within{" "}
              <span className="font-medium text-foreground">
                24&ndash;48 hours
              </span>
              . For urgent matters, please include &quot;URGENT&quot; in your
              subject line.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
