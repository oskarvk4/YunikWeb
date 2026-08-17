import dynamic from "next/dynamic";
import HeroCarousel from "@/components/home/HeroCarousel";
import CategoryGrid from "@/components/home/CategoryGrid";
import { getFeaturedProducts } from "@/data/products";
import { getCopy } from "@/lib/copy";

// Dynamic imports for below-fold components
const FeaturedProducts = dynamic(() => import("@/components/home/FeaturedProducts"), {
  loading: () => <div className="h-[600px] bg-[#F5F0EB]" aria-label="Loading featured products" />,
});
const BrandStory = dynamic(() => import("@/components/home/BrandStory"));
const Newsletter = dynamic(() => import("@/components/home/Newsletter"), {
  loading: () => (
    <div className="h-64 bg-[#1A1A1A]" aria-label="Loading newsletter section" />
  ),
});

export default async function Home() {
  const [featuredProducts, copy] = await Promise.all([
    getFeaturedProducts(),
    getCopy(),
  ]);

  return (
    <>
      <HeroCarousel content={copy.home.hero} />
      <CategoryGrid />
      <FeaturedProducts products={featuredProducts} />
      <BrandStory />
      <Newsletter />
    </>
  );
}
