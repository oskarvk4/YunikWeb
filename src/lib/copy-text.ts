// Helpers for editable copy that are safe in both server and client components.
import type { Copy } from "@/content/copy";

/**
 * Pages whose long texts are rendered on the server only. They are left out of
 * the copy sent to the browser with every page.
 */
const SERVER_ONLY_PAGES = ["about", "faq", "care", "shipping", "returns", "privacy", "terms"] as const;

export type ClientCopy = Omit<Copy, (typeof SERVER_ONLY_PAGES)[number]>;

export function toClientCopy(copy: Copy): ClientCopy {
  const rest: Record<string, unknown> = { ...copy };
  for (const page of SERVER_ONLY_PAGES) delete rest[page];
  return rest as ClientCopy;
}

/** "rings" → "Ringe", from /admin/copy (site.categories). Unknown keys are returned as they are. */
export function categoryLabel(site: Copy["site"], category: string): string {
  return (site.categories as Record<string, string>)[category] ?? category;
}

/** "silver" → "Sølv", from /admin/copy (site.metals). Unknown keys are returned as they are. */
export function metalLabel(site: Copy["site"], metal: string): string {
  return (site.metals as Record<string, string>)[metal] ?? metal;
}

/**
 * Fills {placeholders} in editable text, e.g.
 * fillText("Betal {amount}", { amount: "900 kr" }) → "Betal 900 kr".
 */
export function fillText(text: string, values: Record<string, string | number>): string {
  return text.replace(/\{(\w+)\}/g, (match, key) => (key in values ? String(values[key]) : match));
}
