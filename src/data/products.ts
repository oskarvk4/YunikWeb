import { Product, CategoryInfo, ProductCategory } from "@/types";
import type { Database } from "@/types/supabase";
import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import productsData from "./products.json";

type DbProduct = Database["public"]["Tables"]["products"]["Row"];

// Cache duration in seconds. On-demand invalidation via revalidateTag("products")
// is triggered from admin product mutations, so this can be long.
const CACHE_REVALIDATE = 3600;

// Create a direct Supabase client without cookies (for cached queries)
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables");
  }

  return createClient<Database>(supabaseUrl, supabaseKey);
}

// Categories remain static (rarely change) - safe to import in client components
export const categories: CategoryInfo[] = productsData.categories.map((c) => ({
  ...c,
  slug: c.slug as ProductCategory,
}));

// Map database row to Product type
function mapDbProductToProduct(dbProduct: DbProduct): Product {
  return {
    id: dbProduct.id,
    slug: dbProduct.slug,
    name: dbProduct.name,
    price: dbProduct.price,
    currency: "DKK",
    category: dbProduct.category as ProductCategory,
    metal: dbProduct.metal,
    description: dbProduct.description || "",
    materials: dbProduct.materials || "",
    images: dbProduct.images || [],
    featured: dbProduct.featured,
    newArrival: dbProduct.new_arrival,
    oneOfOne: dbProduct.one_of_one ?? false,
    stockQuantity: dbProduct.stock_quantity ?? 0,
  };
}

// Fetch all products from Supabase (cached)
export const getAllProducts = unstable_cache(
  async (): Promise<Product[]> => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
      return [];
    }

    return ((data || []) as DbProduct[]).map(mapDbProductToProduct);
  },
  ["all-products"],
  { revalidate: CACHE_REVALIDATE, tags: ["products"] }
);

// Fetch single product by slug (cached)
export async function getProductBySlug(slug: string): Promise<Product | null> {
  return unstable_cache(
    async (): Promise<Product | null> => {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error || !data) {
        return null;
      }

      return mapDbProductToProduct(data as DbProduct);
    },
    [`product-${slug}`],
    { revalidate: CACHE_REVALIDATE, tags: ["products", `product-${slug}`] }
  )();
}

// Fetch products by category (cached)
export async function getProductsByCategory(category: string): Promise<Product[]> {
  if (category === "all") return getAllProducts();

  return unstable_cache(
    async (): Promise<Product[]> => {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", category)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching products by category:", error);
        return [];
      }

      return ((data || []) as DbProduct[]).map(mapDbProductToProduct);
    },
    [`products-category-${category}`],
    { revalidate: CACHE_REVALIDATE, tags: ["products"] }
  )();
}

// Fetch featured products (cached)
export const getFeaturedProducts = unstable_cache(
  async (): Promise<Product[]> => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("featured", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching featured products:", error);
      return [];
    }

    return ((data || []) as DbProduct[]).map(mapDbProductToProduct);
  },
  ["featured-products"],
  { revalidate: CACHE_REVALIDATE, tags: ["products"] }
);

// Fetch new arrivals (cached)
export const getNewArrivals = unstable_cache(
  async (): Promise<Product[]> => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("new_arrival", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching new arrivals:", error);
      return [];
    }

    return ((data || []) as DbProduct[]).map(mapDbProductToProduct);
  },
  ["new-arrivals"],
  { revalidate: CACHE_REVALIDATE, tags: ["products"] }
);

// Fetch related products (same category, excluding current product) - cached
export async function getRelatedProducts(product: Product, limit: number = 4): Promise<Product[]> {
  return unstable_cache(
    async (): Promise<Product[]> => {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", product.category)
        .neq("id", product.id)
        .limit(limit);

      if (error) {
        console.error("Error fetching related products:", error);
        return [];
      }

      return ((data || []) as DbProduct[]).map(mapDbProductToProduct);
    },
    [`related-products-${product.category}-${product.id}`],
    { revalidate: CACHE_REVALIDATE, tags: ["products"] }
  )();
}

// Fetch all product slugs (for generateStaticParams - runs at build time)
export async function getAllProductSlugs(): Promise<string[]> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("products")
      .select("slug");

    if (error) {
      console.error("Error fetching product slugs:", error);
      return [];
    }

    return (data || []).map((p) => p.slug);
  } catch (error) {
    console.error("Error fetching product slugs:", error);
    return [];
  }
}
