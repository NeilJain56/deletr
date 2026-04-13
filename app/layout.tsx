import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PostHogProvider } from "@/components/providers/PostHogProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Deletr — Delete your data from every broker. $10 one-time.",
  description:
    "We find every data broker selling your personal information and remove it. One payment of $10 — not $120/year like everyone else.",
  openGraph: {
    title: "Deletr — Delete your data. Not a subscription.",
    description:
      "We find every data broker selling your personal information and remove it. $10 one-time.",
    url: "https://deletr.vercel.app",
    siteName: "Deletr",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
