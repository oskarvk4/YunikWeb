import Link from "next/link";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { getCopy } from "@/lib/copy";

// Shown for any address that doesn't exist, including products that aren't (or
// are no longer) in the shop. Texts come from /admin/copy (site.notFound).
export async function generateMetadata() {
  const copy = await getCopy();
  return { title: copy.site.notFound.title, robots: { index: false } };
}

export default async function NotFound() {
  const text = (await getCopy()).site.notFound;

  return (
    <div className="pt-20">
      <section className="py-24 md:py-32">
        <Container size="narrow">
          <div className="text-center">
            <p className="font-serif text-6xl md:text-7xl font-light text-[#1A1A1A]/15 mb-6">404</p>
            <h1 className="font-serif text-3xl md:text-4xl font-light text-[#1A1A1A] mb-4">
              {text.headline}
            </h1>
            <p className="text-[#1A1A1A]/60 font-sans leading-relaxed max-w-md mx-auto mb-10">
              {text.body}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/shop">
                <Button variant="primary">{text.shopButton}</Button>
              </Link>
              <Link href="/">
                <Button variant="outline">{text.homeButton}</Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
