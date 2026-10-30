import dynamic from "next/dynamic";
import HeroCarousel from "@/components/home/HeroCarousel";
import TrustBar from "@/components/home/TrustBar";
import CategoryGrid from "@/components/home/CategoryGrid";
import ShopWindow from "@/components/home/ShopWindow";
import { getAllProducts } from "@/data/products";
import { getCopy } from "@/lib/copy";
import { buildHomeTiles, pickHomeProducts } from "@/lib/storefront";

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

export const metadata = { alternates: { canonical: "/" } };

export default async function Home() {
  const [allProducts, copy] = await Promise.all([
    getAllProducts(),
    getCopy(),
  ]);

  return (
    <>
      <HeroCarousel content={copy.home.hero} />
      <TrustBar content={copy.home.trustBar} />
      <FeaturedProducts products={pickHomeProducts(allProducts, 10)} content={copy.home.featured} />
      <CategoryGrid tiles={buildHomeTiles(allProducts, copy.shop.collections)} content={copy.home.categories} />
      <ShopWindow content={copy.home.shops} />
      <BrandStory content={copy.home.brandStory} />
      <Newsletter />
    </>
  );
}
