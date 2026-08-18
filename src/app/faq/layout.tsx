import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Svar på de mest stillede spørgsmål om Yunik-smykker — levering, returnering, størrelser, materialer og meget mere.",
  alternates: { canonical: "/faq" },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children;
}
