import { Suspense } from "react";
import Container from "@/components/ui/Container";
import ShopContent from "@/components/shop/ShopContent";
import { getAllProducts } from "@/data/products";

export default async function ShopPage() {
  const products = await getAllProducts();

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-[#F5F0EB] py-6">
        <Container>
          <div className="text-center">
            <h1 className="font-serif text-2xl md:text-3xl font-light text-[#1A1A1A] mb-1">
              Alle Smykker
            </h1>
            <p className="text-[#1A1A1A]/60 font-sans text-sm max-w-md mx-auto">
              Udforsk vores komplette kollektion af håndlavede smykker
            </p>
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
