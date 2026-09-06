"use server";

import { revalidatePath, updateTag } from "next/cache";

/**
 * Invalidate everything that reads the product catalogue.
 *
 * The queries in src/data/products.ts are wrapped in `unstable_cache` with a
 * one-hour revalidate and the "products" tag, and the tag is what actually
 * clears the cached data. `revalidatePath` only drops rendered routes: it never
 * reaches the entries filled by /api/checkout and /api/webhook, which render no
 * page at all — which is why a sold-out item could still pass the checkout
 * stock gate for up to an hour after it sold out.
 *
 * Both are needed: the tag clears the data, the paths re-render the pages.
 *
 * `updateTag` rather than `revalidateTag`: this only ever runs inside a Server
 * Action, and it gives read-your-own-writes, so an admin who saves a price sees
 * the new price on the next render instead of a stale copy served while the
 * revalidation happens in the background.
 */
export async function revalidateProducts() {
  updateTag("products");
  revalidatePath("/shop");
  revalidatePath("/", "layout");
  revalidatePath("/admin/products");
}
