import type { Metadata } from "next";
import { getCopy } from "@/lib/copy";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = (await getCopy()).faq;
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: "/faq" },
  };
}

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children;
}
