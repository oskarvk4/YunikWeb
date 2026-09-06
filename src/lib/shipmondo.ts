import "server-only";

const BASE_URL = "https://app.shipmondo.com/api/public/v3";

/**
 * A parcel shop as returned by Shipmondo's /pickup_points lookup.
 * `number` is the value a label request takes as `service_point_id`.
 */
export interface PickupPoint {
  number: string;
  name: string;
  companyName: string | null;
  address: string;
  zipcode: string;
  city: string;
  country: string;
  carrierCode: string;
  /** Strings like "Monday: 08:00-20:00" — Shipmondo returns English day names. */
  openingHours: string[];
  /** A staffed parcel shop, or an unattended Nærboks locker. */
  kind: "shop" | "locker";
  /** Nærboks lockers can only be opened with the PostNord app. */
  requiresApp: boolean;
  /** Null on postal-code lookups; Shipmondo only fills it for address searches. */
  distance: number | null;
  latitude: number | null;
  longitude: number | null;
}

interface RawPickupPoint {
  number?: string | number;
  id?: string | number;
  name?: string;
  company_name?: string;
  address?: string;
  zipcode?: string | number;
  city?: string;
  country?: string;
  carrier_code?: string;
  opening_hours?: unknown;
  distance?: number;
  latitude?: number;
  longitude?: number;
}

export class ShipmondoError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = "ShipmondoError";
  }
}

function authHeader(): string {
  const user = process.env.SHIPMONDO_API_USER;
  const key = process.env.SHIPMONDO_API_KEY;
  if (!user || !key) {
    throw new ShipmondoError(
      "SHIPMONDO_API_USER / SHIPMONDO_API_KEY are not configured"
    );
  }
  return `Basic ${Buffer.from(`${user}:${key}`).toString("base64")}`;
}

/**
 * PostNord appends " - Kræver PostNord App" to every Nærboks locker name.
 * That's a property of the pickup point, not part of what it's called, so we
 * lift it out and let the UI show it as a note.
 */
function classify(rawName: string) {
  const requiresApp = /kr[æa]ver postnord app/i.test(rawName);
  const name = rawName
    .replace(/\s*[-–—]\s*kr[æa]ver postnord app\s*$/i, "")
    .trim();
  return {
    name: name || "Pakkeshop",
    requiresApp,
    kind: (/^n[æa]rboks\b/i.test(name) ? "locker" : "shop") as "shop" | "locker",
  };
}

function normalise(raw: RawPickupPoint): PickupPoint | null {
  const number = raw.number ?? raw.id;
  if (number === undefined || number === null) return null;

  const { name, requiresApp, kind } = classify(
    raw.name || raw.company_name || "Pakkeshop"
  );

  return {
    number: String(number),
    name,
    kind,
    requiresApp,
    companyName: raw.company_name ?? null,
    address: raw.address || "",
    zipcode: raw.zipcode !== undefined ? String(raw.zipcode) : "",
    city: raw.city || "",
    country: raw.country || "DK",
    carrierCode: raw.carrier_code || "",
    openingHours: Array.isArray(raw.opening_hours)
      ? raw.opening_hours.filter(
          (entry): entry is string => typeof entry === "string"
        )
      : [],
    distance: typeof raw.distance === "number" ? raw.distance : null,
    latitude: typeof raw.latitude === "number" ? raw.latitude : null,
    longitude: typeof raw.longitude === "number" ? raw.longitude : null,
  };
}

export async function fetchPickupPoints({
  zipcode,
  carrierCode,
  countryCode = "DK",
}: {
  zipcode: string;
  carrierCode: string;
  countryCode?: string;
}): Promise<PickupPoint[]> {
  const url = new URL(`${BASE_URL}/pickup_points`);
  url.searchParams.set("carrier_code", carrierCode);
  url.searchParams.set("country_code", countryCode);
  url.searchParams.set("zipcode", zipcode);

  const response = await fetch(url, {
    headers: {
      Authorization: authHeader(),
      Accept: "application/json",
    },
    // Parcel shops move rarely; an hour of cache keeps us well inside any
    // rate limit even if a customer reloads the picker repeatedly.
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new ShipmondoError(
      `Shipmondo pickup_points failed: ${response.status} ${response.statusText}`,
      response.status
    );
  }

  const payload: unknown = await response.json();
  const list = Array.isArray(payload)
    ? payload
    : Array.isArray((payload as { pickup_points?: unknown[] })?.pickup_points)
    ? (payload as { pickup_points: unknown[] }).pickup_points
    : [];

  return (
    list
      .map((entry) => normalise(entry as RawPickupPoint))
      .filter((point): point is PickupPoint => point !== null)
      // Shipmondo returns lockers first and leaves `distance` null on postcode
      // lookups, so without this every result above the fold needs the
      // PostNord app. Staffed shops are what most customers expect, so they
      // lead; sort is stable, so Shipmondo's own order survives within a group.
      .sort((a, b) => Number(a.kind === "locker") - Number(b.kind === "locker"))
  );
}
