import { Suspense } from "react";
import Container from "@/components/ui/Container";
import ShopContent from "@/components/shop/ShopContent";
import ShopHeading from "@/components/shop/ShopHeading";
import { getAllProducts } from "@/data/products";

const HEADING_CLASS = "font-serif text-3xl md:text-4xl font-light text-[#1A1A1A]";

export default async function ShopPage() {
  const products = await getAllProducts();

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-[#F5F0EB] py-4 md:py-6">
        <Container>
          <div className="text-center">
            {/* Reads the URL, so it sits in Suspense; the plain heading is what the static page shows. */}
            <Suspense fallback={<h1 className={HEADING_CLASS}>Alle Smykker</h1>}>
              <ShopHeading className={HEADING_CLASS} />
            </Suspense>
          </div>
        </Container>
      </section>

      {/* Products Section */}
      <section className="py-6 min-h-[60vh]">
        <Container>
          <Suspense
            fallback={
              <div className="text-center py-20">
                <p className="text-[#1A1A1A]/60 font-sans">Indlæser produkter...</p>
              </div>
            }
          >
            <ShopContent products={products} />
          </Suspense>
        </Container>
      </section>
    </div>
  );
}
