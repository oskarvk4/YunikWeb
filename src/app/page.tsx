import dynamic from "next/dynamic";
import Hero from "@/components/home/Hero";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import { getFeaturedProducts } from "@/data/products";

// Dynamic imports for below-fold components
const BrandStory = dynamic(() => import("@/components/home/BrandStory"));
const Newsletter = dynamic(() => import("@/components/home/Newsletter"), {
  loading: () => (
    <div className="h-64 bg-[#1A1A1A]" aria-label="Loading newsletter section" />
  ),
});

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      <Hero />
      <CategoryGrid />
      <FeaturedProducts products={featuredProducts} />
      <BrandStory />
      <Newsletter />
    </>
  );
}
