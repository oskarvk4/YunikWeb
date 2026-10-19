import type { Product, ProductCategory } from "@/types";

/** A category, tile or filter only appears once it has this many published pieces. */
export const MIN_PIECES_TO_SHOW = 3;

export const CATEGORY_VALUES: ProductCategory[] = ["rings", "necklaces", "earrings", "bracelets"];

export type ProductFilter = {
  category?: ProductCategory;
  metal?: "gold" | "silver";
  maxPrice?: number;
};

export function matchesFilter(product: Product, filter: ProductFilter): boolean {
  if (filter.category && product.category !== filter.category) return false;
  if (filter.metal && product.metal !== filter.metal) return false;
  if (filter.maxPrice !== undefined && product.price > filter.maxPrice) return false;
  return true;
}

export function countPieces(products: Product[], filter: ProductFilter): number {
  return products.filter((product) => matchesFilter(product, filter)).length;
}

export function visibleCategories(products: Product[]): ProductCategory[] {
  return CATEGORY_VALUES.filter(
    (category) => countPieces(products, { category }) >= MIN_PIECES_TO_SHOW
  );
}

/** The shop URL that applies a filter, e.g. `/shop?category=earrings&metal=gold`. */
export function shopHref(filter: ProductFilter): string {
  const params = new URLSearchParams();
  if (filter.category) params.set("category", filter.category);
  if (filter.metal) params.set("metal", filter.metal);
  if (filter.maxPrice !== undefined) params.set("maxPrice", String(filter.maxPrice));
  const query = params.toString();
  return query ? `/shop?${query}` : "/shop";
}

// `image` pins a chosen photo to a tile; tiles without one use a matching piece's photo.
const HOME_TILES: { label: string; filter: ProductFilter; image?: string }[] = [
  {
    label: "Guldøreringe",
    filter: { category: "earrings", metal: "gold" },
    image: "/kategorier/guldoereringe.webp",
  },
  { label: "Sølvøreringe", filter: { category: "earrings", metal: "silver" } },
  { label: "Gaver under 700 kr", filter: { maxPrice: 700 } },
  { label: "Alle smykker", filter: {} },
];

const FALLBACK_TILE_IMAGE = "/category-earrings.jpg";

export type HomeTile = { label: string; href: string; image: string };

/**
 * Homepage tiles that have enough pieces to be worth a click. A tile uses its
 * pinned photo if it has one, otherwise the photo of the first matching piece
 * no earlier tile has used, so the tiles don't repeat a picture.
 */
export function buildHomeTiles(products: Product[]): HomeTile[] {
  const used = new Set<string>();
  return HOME_TILES.flatMap(({ label, filter, image: pinned }) => {
    const matches = products.filter((product) => matchesFilter(product, filter));
    if (matches.length < MIN_PIECES_TO_SHOW) return [];
    const photos = matches.map((product) => product.images[0]).filter(Boolean);
    const image =
      pinned ?? photos.find((photo) => !used.has(photo)) ?? photos[0] ?? FALLBACK_TILE_IMAGE;
    used.add(image);
    return [{ label, href: shopHref(filter), image }];
  });
}

/**
 * The homepage product row. In-stock and featured pieces come first, and the
 * list alternates between categories so rings and bracelets get a place too.
 * Expects `products` newest-first, as getAllProducts returns them.
 */
export function pickHomeProducts(products: Product[], limit = 10): Product[] {
  const queues = new Map<ProductCategory, Product[]>();
  for (const product of products) {
    const queue = queues.get(product.category) ?? [];
    queue.push(product);
    queues.set(product.category, queue);
  }

  const ranked = [...queues.values()].map((queue) =>
    [...queue].sort(
      (a, b) =>
        Number(b.stockQuantity > 0) - Number(a.stockQuantity > 0) ||
        Number(b.featured) - Number(a.featured)
    )
  );

  const picked: Product[] = [];
  while (picked.length < limit && ranked.some((queue) => queue.length > 0)) {
    for (const queue of ranked) {
      const next = queue.shift();
      if (next && picked.length < limit) picked.push(next);
    }
  }
  return picked;
}
