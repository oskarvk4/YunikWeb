export type ProductCategory = "rings" | "necklaces" | "earrings" | "bracelets";

export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  currency: "DKK";
  category: ProductCategory;
  description: string;
  materials: string;
  images: string[];
  featured: boolean;
  newArrival: boolean;
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
