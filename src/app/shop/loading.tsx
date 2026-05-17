import Container from "@/components/ui/Container";

function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-square bg-gray-200 rounded-lg mb-3" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/4" />
    </div>
  );
}

export default function ShopLoading() {
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

      {/* Filter Bar Skeleton */}
      <section className="py-6">
        <Container>
          <div className="flex gap-2 mb-6 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 w-24 bg-gray-200 rounded-full" />
            ))}
          </div>

          {/* Product Grid Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
