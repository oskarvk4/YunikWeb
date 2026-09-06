import type { ProductMetal } from "@/types";

/**
 * Every Yunik piece is 925 sterling silver. "Gold" pieces are the same silver
 * base with a 3 micron 24 karat plating — so the materials text is derived from
 * the metal, not written from scratch for each product.
 */
export const MATERIALS_SILVER = "925 sterlingsølv.";
export const MATERIALS_GOLD = "925 sterlingsølv med 24 karat guldbelægning i 3 mikron.";

export function defaultMaterials(metal: ProductMetal): string {
  return metal === "gold" ? MATERIALS_GOLD : MATERIALS_SILVER;
}

/**
 * Re-derives the materials text for a metal while keeping anything the admin
 * added after the standard sentence. Custom text that doesn't start with a
 * standard sentence is left untouched.
 */
export function applyMetalToMaterials(current: string, metal: ProductMetal): string {
  const next = defaultMaterials(metal);
  const trimmed = current.trim();
  if (trimmed === "") return next;

  for (const standard of [MATERIALS_SILVER, MATERIALS_GOLD]) {
    if (trimmed === standard) return next;
    if (trimmed.startsWith(standard)) return next + trimmed.slice(standard.length);
  }
  return current;
}

/** True when the field still starts from one of the standard sentences. */
export function hasStandardMaterials(value: string): boolean {
  const trimmed = value.trim();
  return [MATERIALS_SILVER, MATERIALS_GOLD].some((s) => trimmed.startsWith(s));
}
