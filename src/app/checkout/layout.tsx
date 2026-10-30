import { getCopy } from "@/lib/copy";

// The checkout pages are client components, so their tab title is set here.
// They stay out of search results.
export async function generateMetadata() {
  const copy = await getCopy();
  return { title: copy.checkout.seo.title, robots: { index: false, follow: false } };
}

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="preconnect" href="https://js.stripe.com" />
      <link rel="dns-prefetch" href="https://js.stripe.com" />
      {children}
    </>
  );
}
