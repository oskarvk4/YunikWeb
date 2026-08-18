import { MetadataRoute } from "next";
import { getAllProductSlugs } from "@/data/products";

const BASE_URL = "https://yunik.dk";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let productSlugs: string[] = [];
  try {
    productSlugs = await getAllProductSlugs();
  } catch {
    // Fall back to empty list if Supabase is unreachable at build time
  }

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/shop`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/contact`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/faq`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/care`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/shipping`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/returns`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const productPages: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${BASE_URL}/product/${slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticPages, ...productPages];
}
