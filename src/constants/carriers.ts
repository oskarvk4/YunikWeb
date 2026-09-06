export type CarrierKey = "postnord" | "gls" | "dao" | "bring" | "other";

interface Carrier {
  label: string;
  /** Returns null when the carrier has no public track & trace URL we can build. */
  trackingUrl: (trackingNumber: string) => string | null;
}

export const CARRIERS: Record<CarrierKey, Carrier> = {
  postnord: {
    label: "PostNord",
    trackingUrl: (n) =>
      `https://tracking.postnord.com/dk/?id=${encodeURIComponent(n)}`,
  },
  gls: {
    label: "GLS",
    trackingUrl: (n) =>
      `https://gls-group.com/DK/da/find-pakke/?match=${encodeURIComponent(n)}`,
  },
  dao: {
    label: "DAO",
    trackingUrl: (n) =>
      `https://www.dao.as/find-pakke?stregkode=${encodeURIComponent(n)}`,
  },
  bring: {
    label: "Bring",
    trackingUrl: (n) =>
      `https://tracking.bring.dk/tracking.html?q=${encodeURIComponent(n)}`,
  },
  other: {
    label: "Anden fragtfører",
    trackingUrl: () => null,
  },
};

export const CARRIER_OPTIONS = Object.entries(CARRIERS).map(
  ([value, { label }]) => ({ value: value as CarrierKey, label })
);

export const isCarrierKey = (value: string): value is CarrierKey =>
  value in CARRIERS;

export const getCarrierLabel = (carrier?: string | null): string =>
  carrier && isCarrierKey(carrier) ? CARRIERS[carrier].label : carrier || "Fragtfører";

/**
 * The link we give the customer. A manually pasted `override` always wins —
 * carriers change their track & trace URLs more often than we redeploy.
 */
export function getTrackingUrl(
  carrier?: string | null,
  trackingNumber?: string | null,
  override?: string | null
): string | null {
  if (override) return override;
  if (!carrier || !trackingNumber || !isCarrierKey(carrier)) return null;
  return CARRIERS[carrier].trackingUrl(trackingNumber);
}

export const FULFILLMENT_LABELS: Record<string, string> = {
  unfulfilled: "Ikke afsendt",
  shipped: "Afsendt",
  delivered: "Leveret",
};

export const getFulfillmentLabel = (status?: string | null): string =>
  (status && FULFILLMENT_LABELS[status]) || FULFILLMENT_LABELS.unfulfilled;

/**
 * Shipmondo carrier codes for parcel-shop lookups. Verified against a live
 * account on 2026-08-31 via `scripts/test-pickup-points.ts` — note PostNord's
 * code is `pdk` (Post Danmark); `postnord` returns 422.
 */
export type PickupCarrierCode = "pdk" | "gls" | "dao" | "bring";

export const PICKUP_CARRIERS: Record<
  PickupCarrierCode,
  { label: string; carrier: CarrierKey }
> = {
  pdk: { label: "PostNord", carrier: "postnord" },
  gls: { label: "GLS", carrier: "gls" },
  dao: { label: "DAO", carrier: "dao" },
  bring: { label: "Bring", carrier: "bring" },
};

/**
 * Must match the carrier you actually buy labels from — a parcel shop only
 * accepts parcels from its own carrier. PostNord has the widest DK coverage
 * (21 shops around 5000 versus 13 for the others).
 */
export const DEFAULT_PICKUP_CARRIER: PickupCarrierCode = "pdk";

export const isPickupCarrier = (value: string): value is PickupCarrierCode =>
  value in PICKUP_CARRIERS;
