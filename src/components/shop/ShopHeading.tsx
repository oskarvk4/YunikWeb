"use client";

import { useSearchParams } from "next/navigation";
import { GIFT_PRICE_LIMIT, giftLabels } from "@/lib/storefront";
import { useCopy } from "@/components/CopyProvider";
import { categoryLabel } from "@/lib/copy-text";

/**
 * The shop's <h1>: the gift selection's name while its price filter is on, else
 * the chosen category ("Ringe"), else "Alle Smykker".
 */
export default function ShopHeading({ className }: { className?: string }) {
  const copy = useCopy();
  const searchParams = useSearchParams();
  const giftSelection = Number(searchParams.get("maxPrice")) === GIFT_PRICE_LIMIT;
  const category = searchParams.get("category");
  const categoryName = category ? categoryLabel(copy.site, category) : null;
  // Unknown categories in the URL (e.g. ?category=xyz) fall back to the default heading.
  const knownCategory = categoryName && categoryName !== category ? categoryName : null;

  const heading = giftSelection
    ? giftLabels(copy.shop.collections).heading
    : (knownCategory ?? copy.shop.heading.title);

  return <h1 className={className}>{heading}</h1>;
}
