import Container from "@/components/ui/Container";

export default function ProductLoading() {
  return (
    <div className="pt-24 pb-16">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery Skeleton */}
          <div className="animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-lg mb-4" />
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-20 h-20 bg-gray-200 rounded" />
              ))}
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-1/4" />
            <div className="space-y-2 mt-6">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
            <div className="h-12 bg-gray-200 rounded w-full mt-8" />
          </div>
        </div>

        {/* Related Products Skeleton */}
        <div className="mt-16">
          <div className="h-6 bg-gray-200 rounded w-48 mb-6 animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg mb-3" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/4" />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
