import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontakt Os",
  description: "Kontakt Yunik — vi svarer inden for 24 timer på hverdage. Skriv til os om din ordre, et produkt eller noget helt tredje.",
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
