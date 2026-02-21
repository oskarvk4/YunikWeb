import dynamic from "next/dynamic";
import Hero from "@/components/home/Hero";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedProducts from "@/components/home/FeaturedProducts";

// Dynamic imports for below-fold components
const BrandStory = dynamic(() => import("@/components/home/BrandStory"));
const Newsletter = dynamic(() => import("@/components/home/Newsletter"), {
  loading: () => (
    <div className="h-64 bg-[#1A1A1A]" aria-label="Loading newsletter section" />
  ),
});

export default function Home() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <FeaturedProducts />
      <BrandStory />
      <Newsletter />
    </>
  );
}
