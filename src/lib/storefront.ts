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

/** The price limit of the gift selection ("under 700 kr"): tile, shop chip and URL. */
export const GIFT_PRICE_LIMIT = 700;

/**
 * Seasonal name for the "under 700 kr" gift filter. It reads as a Christmas
 * selection through Christmas Eve (until 00:00 on 25 December, Danish time),
 * then falls back to the plain name by itself. `christmas` says which is active.
 */
export function giftLabels(now = new Date()) {
  const christmas = now < new Date("2026-12-25T00:00:00+01:00");
  return christmas
    ? {
        christmas,
        tile: "Julegaver under 700 kr",
        chip: "Julegaver",
        heading: "Julegaver under 700 kr",
      }
    : {
        christmas,
        tile: "Gaver under 700 kr",
        chip: "Under 700 kr",
        heading: "Gaver under 700 kr",
      };
}

// `image` pins a chosen photo to a tile; tiles without one use a matching piece's photo.
function homeTiles(now: Date): { label: string; filter: ProductFilter; image?: string }[] {
  return [
    {
      label: "Guldøreringe",
      filter: { category: "earrings", metal: "gold" },
      image: "/kategorier/guldoereringe.webp",
    },
    { label: "Sølvøreringe", filter: { category: "earrings", metal: "silver" } },
    { label: giftLabels(now).tile, filter: { maxPrice: GIFT_PRICE_LIMIT } },
    { label: "Alle smykker", filter: {} },
  ];
}

const FALLBACK_TILE_IMAGE = "/category-earrings.jpg";

export type HomeTile = { label: string; href: string; image: string };

/**
 * Homepage tiles that have enough pieces to be worth a click. A tile uses its
 * pinned photo if it has one, otherwise the photo of the first matching piece
 * no earlier tile has used, so the tiles don't repeat a picture.
 * The gift tile's name follows the season (see `giftLabels`).
 */
export function buildHomeTiles(products: Product[], now = new Date()): HomeTile[] {
  const used = new Set<string>();
  return homeTiles(now).flatMap(({ label, filter, image: pinned }) => {
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
