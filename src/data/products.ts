import { Product, CategoryInfo, ProductCategory } from "@/types";
import productsData from "./products.json";

// Load from JSON file - edit products.json to add/remove products
export const categories: CategoryInfo[] = productsData.categories.map((c) => ({
  ...c,
  slug: c.slug as ProductCategory,
}));

export const products: Product[] = productsData.products.map((p) => ({
  ...p,
  currency: "DKK" as const,
  category: p.category as ProductCategory,
}));

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find((product) => product.slug === slug);
};

export const getProductsByCategory = (category: string): Product[] => {
  if (category === "all") return products;
  return products.filter((product) => product.category === category);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter((product) => product.featured);
};

export const getNewArrivals = (): Product[] => {
  return products.filter((product) => product.newArrival);
};

export const getRelatedProducts = (product: Product, limit: number = 4): Product[] => {
  return products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit);
};
