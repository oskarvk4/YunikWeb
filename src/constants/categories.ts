export const PRODUCT_CATEGORIES = {
  rings: { label: "Ringe", slug: "rings" },
  necklaces: { label: "Halskæder", slug: "necklaces" },
  earrings: { label: "Øreringe", slug: "earrings" },
  bracelets: { label: "Armbånd", slug: "bracelets" },
} as const;

export type ProductCategory = keyof typeof PRODUCT_CATEGORIES;

export const getCategoryLabel = (category: string): string =>
  PRODUCT_CATEGORIES[category as ProductCategory]?.label || category;

export const CATEGORY_OPTIONS = Object.entries(PRODUCT_CATEGORIES).map(
  ([value, { label }]) => ({ value, label })
);

export const ALL_CATEGORIES = Object.keys(PRODUCT_CATEGORIES) as ProductCategory[];
