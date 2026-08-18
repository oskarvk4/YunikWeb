export type ProductCategory = "rings" | "necklaces" | "earrings" | "bracelets";

export type ProductMetal = "gold" | "silver";

export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  currency: "DKK";
  category: ProductCategory;
  metal: ProductMetal;
  description: string;
  materials: string;
  images: string[];
  featured: boolean;
  newArrival: boolean;
  oneOfOne: boolean;
  stockQuantity: number;
  published: boolean;
};

export type CartItem = Product & {
  quantity: number;
};

export type CategoryInfo = {
  name: string;
  slug: ProductCategory;
  image: string;
  description: string;
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("da-DK", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price) + " DKK";
};

// Re-export Supabase types
export type { UserProfile, Order, DbProduct } from "./supabase";

// Import Order for local use
import type { Order as OrderType } from "./supabase";

// User type with profile
export type User = {
  id: string;
  email: string;
  profile: {
    role: "user" | "admin";
    created_at: string;
  } | null;
};

// Order item type for storing in orders
export type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

// Admin dashboard stats
export type AdminStats = {
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  totalProducts: number;
  recentOrders: OrderType[];
};
