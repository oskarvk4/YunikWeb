"use client";

import { useSearchParams } from "next/navigation";
import { GIFT_PRICE_LIMIT, giftLabels } from "@/lib/storefront";

/** The shop's <h1>: "Alle Smykker", or the gift selection's name while its price filter is on. */
export default function ShopHeading({ className }: { className?: string }) {
  const searchParams = useSearchParams();
  const giftSelection = Number(searchParams.get("maxPrice")) === GIFT_PRICE_LIMIT;

  return <h1 className={className}>{giftSelection ? giftLabels().heading : "Alle Smykker"}</h1>;
}
