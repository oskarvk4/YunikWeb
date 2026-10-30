/**
 * Single source of truth for delivery options.
 *
 * Read by the Stripe checkout session, the webhook, the admin order views,
 * the transactional emails and the /shipping page — so a rate change lands
 * everywhere at once instead of drifting between checkout and copy.
 */

import type { Copy } from "@/content/copy";
import { fillText } from "@/lib/copy-text";

export type ShippingOptionKey = "pickup" | "home" | "express";

export interface ShippingOption {
  key: ShippingOptionKey;
  /**
   * Default name. The emails and admin views read it as it is. What customers see
   * in checkout and in Stripe is edited in /admin/copy (checkout.delivery), via
   * shippingTexts() below.
   */
  label: string;
  /** DKK incl. moms. */
  price: number;
  minDays: number;
  maxDays: number;
  /** Default description; see `label`. */
  description: string;
}

/** The delivery texts from /admin/copy (checkout.delivery). */
export type DeliveryCopy = Copy["checkout"]["delivery"];

/** Name and description of a delivery option as customers see them, from /admin/copy. */
export function shippingTexts(
  delivery: DeliveryCopy,
  key: ShippingOptionKey
): { label: string; description: string } {
  return {
    label: delivery[`${key}Label` as const],
    description: delivery[`${key}Description` as const],
  };
}

export const SHIPPING_OPTIONS: Record<ShippingOptionKey, ShippingOption> = {
  pickup: {
    key: "pickup",
    label: "Pakkeshop",
    price: 0,
    minDays: 2,
    maxDays: 5,
    description: "Afhent i en pakkeshop tæt på dig",
  },
  home: {
    key: "home",
    label: "Levering til døren",
    price: 0,
    minDays: 2,
    maxDays: 5,
    description: "Leveret direkte til din adresse",
  },
  express: {
    key: "express",
    label: "Ekspres til døren",
    price: 49,
    minDays: 1,
    maxDays: 2,
    description: "Hurtigst muligt til din adresse",
  },
};

export const SHIPPING_OPTION_LIST: ShippingOption[] = [
  SHIPPING_OPTIONS.pickup,
  SHIPPING_OPTIONS.home,
  SHIPPING_OPTIONS.express,
];

/** "2-5 hverdage". Pass the /admin/copy delivery texts to use the edited wording. */
export const formatDeliveryEstimate = (
  option: ShippingOption,
  delivery?: Pick<DeliveryCopy, "estimate">
): string =>
  fillText(delivery?.estimate ?? "{min}-{max} hverdage", {
    min: option.minDays,
    max: option.maxDays,
  });

/** "Gratis" or "49 DKK". Pass the /admin/copy delivery texts to use the edited wording. */
export const formatShippingPrice = (
  option: ShippingOption,
  delivery?: Pick<DeliveryCopy, "free" | "price">
): string =>
  option.price === 0
    ? (delivery?.free ?? "Gratis")
    : fillText(delivery?.price ?? "{price} DKK", { price: option.price });

/**
 * Orders placed before parcel shops existed stored "free" for home delivery.
 */
export function normaliseShippingOption(
  value?: string | null
): ShippingOptionKey {
  if (value === "pickup" || value === "home" || value === "express") {
    return value;
  }
  return "home";
}

export const getShippingOption = (value?: string | null): ShippingOption =>
  SHIPPING_OPTIONS[normaliseShippingOption(value)];

/**
 * Snapshot of the parcel shop the customer picked, stored on the order so it
 * stays readable even if the shop later closes or is renamed.
 */
export interface PickupPointSnapshot {
  number: string;
  name: string;
  address: string | null;
  zipcode: string | null;
  city: string | null;
  carrier_code: string | null;
}

export function readPickupPoint(value: unknown): PickupPointSnapshot | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Record<string, unknown>;
  if (typeof raw.number !== "string" || typeof raw.name !== "string") {
    return null;
  }
  const text = (key: string) =>
    typeof raw[key] === "string" ? (raw[key] as string) : null;

  return {
    number: raw.number,
    name: raw.name,
    address: text("address"),
    zipcode: text("zipcode"),
    city: text("city"),
    carrier_code: text("carrier_code"),
  };
}

/** One-line form for emails and order summaries. */
export function formatPickupPoint(point: PickupPointSnapshot): string {
  return [
    point.name,
    point.address,
    [point.zipcode, point.city].filter(Boolean).join(" ") || null,
  ]
    .filter(Boolean)
    .join(", ");
}

/**
 * Stripe caps each metadata value at 500 characters, so the snapshot travels
 * as separate flat keys rather than one JSON blob. The checkout session writes
 * these; the webhook reads them back onto the order row.
 */
export function pickupPointToMetadata(
  point: PickupPointSnapshot
): Record<string, string> {
  // Stripe rejects the whole session if any metadata value exceeds 500 chars,
  // and this snapshot arrives from the browser. Real shop names are far
  // shorter, so clamping is invisible in practice and turns a failed checkout
  // into a slightly truncated label.
  const cap = (value: string) => value.slice(0, 200);

  const entries: Record<string, string> = {
    pickup_number: cap(point.number),
    pickup_name: cap(point.name),
  };
  if (point.address) entries.pickup_address = cap(point.address);
  if (point.zipcode) entries.pickup_zipcode = cap(point.zipcode);
  if (point.city) entries.pickup_city = cap(point.city);
  if (point.carrier_code) {
    entries.pickup_carrier_code = cap(point.carrier_code);
  }
  return entries;
}

export function pickupPointFromMetadata(
  metadata?: Record<string, string> | null
): PickupPointSnapshot | null {
  if (!metadata?.pickup_number || !metadata.pickup_name) return null;
  return {
    number: metadata.pickup_number,
    name: metadata.pickup_name,
    address: metadata.pickup_address || null,
    zipcode: metadata.pickup_zipcode || null,
    city: metadata.pickup_city || null,
    carrier_code: metadata.pickup_carrier_code || null,
  };
}
