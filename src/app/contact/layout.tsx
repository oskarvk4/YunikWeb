import type { Metadata } from "next";
import { getCopy } from "@/lib/copy";

export async function generateMetadata(): Promise<Metadata> {
  const text = (await getCopy()).contact.metadata;

  return {
    title: text.title,
    description: text.description,
    alternates: { canonical: "/contact" },
  };
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
