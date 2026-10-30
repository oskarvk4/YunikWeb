"use client";

import { useCallback, useState } from "react";
import { DEFAULT_PICKUP_CARRIER } from "@/constants/carriers";
import {
  SHIPPING_OPTION_LIST,
  formatDeliveryEstimate,
  formatShippingPrice,
  shippingTexts,
  type PickupPointSnapshot,
  type ShippingOptionKey,
} from "@/constants/shipping";
import { useCopy } from "@/components/CopyProvider";

interface PickupPoint {
  number: string;
  name: string;
  address: string;
  zipcode: string;
  city: string;
  carrierCode: string;
  openingHours: string[];
  kind: "shop" | "locker";
  requiresApp: boolean;
  /** Shipmondo returns null for postal-code lookups; kept for address searches. */
  distance: number | null;
}

function formatDistance(metres: number | null): string | null {
  if (metres === null) return null;
  return metres >= 1000
    ? `${(metres / 1000).toFixed(1).replace(".", ",")} km`
    : `${Math.round(metres)} m`;
}

/** Shipmondo returns "Monday: 08:00-20:00". `days` maps the English day names to the edited ones. */
const toDanishHours = (entry: string, days: Record<string, string>): string =>
  entry.replace(/^(\w+):/, (match, day: string) => `${days[day] ?? day}:`);

const toSnapshot = (point: PickupPoint): PickupPointSnapshot => ({
  number: point.number,
  name: point.name,
  address: point.address || null,
  zipcode: point.zipcode || null,
  city: point.city || null,
  carrier_code: point.carrierCode || DEFAULT_PICKUP_CARRIER,
});

interface DeliveryPickerProps {
  option: ShippingOptionKey;
  onOptionChange: (option: ShippingOptionKey) => void;
  pickupPoint: PickupPointSnapshot | null;
  onPickupPointChange: (point: PickupPointSnapshot | null) => void;
}

/**
 * Delivery method is chosen here rather than in Stripe Checkout, because
 * Stripe has no parcel-shop picker and asking for one after payment loses
 * customers who close the tab. The session is then created with only the
 * chosen rate, so there is nothing to re-pick on Stripe's side.
 */
export default function DeliveryPicker({
  option,
  onOptionChange,
  pickupPoint,
  onPickupPointChange,
}: DeliveryPickerProps) {
  const text = useCopy().checkout;
  // Day names for the opening hours, which Shipmondo sends in English.
  const dayNames: Record<string, string> = {
    Monday: text.days.monday,
    Tuesday: text.days.tuesday,
    Wednesday: text.days.wednesday,
    Thursday: text.days.thursday,
    Friday: text.days.friday,
    Saturday: text.days.saturday,
    Sunday: text.days.sunday,
  };
  const lookupFailed = text.pickup.lookupError;
  const noneFound = text.pickup.noneFound;
  const [zipcode, setZipcode] = useState("");
  const [points, setPoints] = useState<PickupPoint[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookup = useCallback(async (code: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/pickup-points?zipcode=${encodeURIComponent(code)}&carrier=${DEFAULT_PICKUP_CARRIER}`
      );
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setPoints([]);
        setError(data.error || lookupFailed);
        return;
      }

      setPoints(data.points ?? []);
      if ((data.points ?? []).length === 0) {
        setError(noneFound);
      }
    } catch {
      setPoints([]);
      setError(lookupFailed);
    } finally {
      setSearched(true);
      setLoading(false);
    }
  }, [lookupFailed, noneFound]);

  const selectOption = (next: ShippingOptionKey) => {
    onOptionChange(next);
    // A shop only belongs to a pakkeshop order — drop it if they switch away.
    if (next !== "pickup") onPickupPointChange(null);
  };

  return (
    <div className="border-t border-[#1A1A1A]/10 pt-6 mt-6">
      <h2 className="font-serif text-lg text-[#1A1A1A] mb-4">
        {text.delivery.heading}
      </h2>

      <div className="space-y-2">
        {SHIPPING_OPTION_LIST.map((entry) => {
          const isActive = entry.key === option;
          const entryText = shippingTexts(text.delivery, entry.key);

          return (
            <label
              key={entry.key}
              className={`flex items-start gap-3 px-4 py-3 border rounded-sm cursor-pointer transition-colors ${
                isActive
                  ? "border-[#8D6553] bg-[#8D6553]/5"
                  : "border-[#1A1A1A]/10 hover:border-[#1A1A1A]/30"
              }`}
            >
              <input
                type="radio"
                name="delivery-option"
                value={entry.key}
                checked={isActive}
                onChange={() => selectOption(entry.key)}
                className="mt-1 accent-[#8D6553]"
              />
              <span className="flex-1">
                <span className="flex items-baseline justify-between gap-3">
                  <span className="font-sans text-sm font-medium text-[#1A1A1A]">
                    {entryText.label}
                  </span>
                  <span className="font-sans text-sm text-[#1A1A1A]">
                    {formatShippingPrice(entry, text.delivery)}
                  </span>
                </span>
                <span className="block font-sans text-sm text-[#1A1A1A]/60">
                  {entryText.description} · {formatDeliveryEstimate(entry, text.delivery)}
                </span>
              </span>
            </label>
          );
        })}
      </div>

      {option === "pickup" && (
        <div className="mt-5">
          {pickupPoint ? (
            <div className="px-4 py-3 border border-[#8D6553] bg-[#8D6553]/5 rounded-sm mb-4">
              <p className="font-sans text-xs uppercase tracking-wide text-[#8D6553] mb-1">
                {text.pickup.selectedHeading}
              </p>
              <p className="font-sans text-sm text-[#1A1A1A]">
                {pickupPoint.name}
              </p>
              <p className="font-sans text-sm text-[#1A1A1A]/60">
                {pickupPoint.address}
                {pickupPoint.city
                  ? ` · ${pickupPoint.zipcode} ${pickupPoint.city}`
                  : ""}
              </p>
            </div>
          ) : null}

          {/* White against the cream page background (#F5F0EB) so the one
              thing we still need from the customer reads as its own step. */}
          <div className="bg-white border border-[#1A1A1A]/10 p-4 md:p-5 rounded-sm mb-4">
            <label
              htmlFor="pickup-zipcode"
              className="block font-sans text-sm font-medium text-[#1A1A1A] mb-1"
            >
              {pickupPoint
                ? text.pickup.searchAnother
                : text.pickup.findHeading}
            </label>
            <p className="font-sans text-sm text-[#1A1A1A]/60 mb-3">
              {text.pickup.zipcodeHelp}
            </p>
            <div className="flex gap-2">
              <input
                id="pickup-zipcode"
                value={zipcode}
                onChange={(event) =>
                  setZipcode(event.target.value.replace(/\D/g, "").slice(0, 4))
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    if (/^\d{4}$/.test(zipcode)) lookup(zipcode);
                  }
                }}
                inputMode="numeric"
                maxLength={4}
                placeholder={text.pickup.zipcodePlaceholder}
                // text-base keeps iOS Safari from zooming in on focus.
                className="w-36 border border-[#1A1A1A]/25 px-3 py-2.5 text-base font-sans rounded-sm outline-none transition-colors focus:border-[#8D6553] focus:ring-1 focus:ring-[#8D6553]"
              />
              <button
                type="button"
                onClick={() => lookup(zipcode)}
                disabled={loading || !/^\d{4}$/.test(zipcode)}
                className="px-6 py-2.5 text-sm font-sans text-white bg-[#8D6553] rounded-sm transition-colors hover:bg-[#7A5646] disabled:bg-[#1A1A1A]/20 disabled:cursor-not-allowed"
              >
                {loading ? text.pickup.searching : text.pickup.searchButton}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-700 font-sans mb-4">{error}</p>
          )}

          {points.length > 0 && (
            <ul className="space-y-2 max-h-96 overflow-y-auto">
              {points.map((point) => {
                const isSelected = pickupPoint?.number === point.number;
                const distance = formatDistance(point.distance);

                return (
                  <li key={point.number}>
                    <button
                      type="button"
                      onClick={() => onPickupPointChange(toSnapshot(point))}
                      className={`w-full text-left px-4 py-3 border rounded-sm transition-colors ${
                        isSelected
                          ? "border-[#8D6553] bg-[#8D6553]/5"
                          : "border-[#1A1A1A]/10 hover:border-[#1A1A1A]/30"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-sans text-sm font-medium text-[#1A1A1A]">
                            {point.name}
                          </p>
                          <p className="font-sans text-sm text-[#1A1A1A]/60">
                            {point.address}
                            {point.city
                              ? ` · ${point.zipcode} ${point.city}`
                              : ""}
                          </p>
                          {point.requiresApp && (
                            <p className="font-sans text-xs text-[#1A1A1A]/50 mt-1">
                              {text.pickup.locker}
                            </p>
                          )}
                          {isSelected && point.openingHours.length > 0 && (
                            <ul className="mt-3 space-y-0.5">
                              {point.openingHours.map((entry) => (
                                <li
                                  key={entry}
                                  className="font-sans text-xs text-[#1A1A1A]/50"
                                >
                                  {toDanishHours(entry, dayNames)}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <div className="text-right flex-shrink-0">
                          {distance && (
                            <p className="font-sans text-xs text-[#1A1A1A]/50">
                              {distance}
                            </p>
                          )}
                          {isSelected && (
                            <p className="font-sans text-xs text-[#8D6553]">
                              {text.pickup.selected}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {searched && !loading && !error && points.length > 0 && (
            <p className="font-sans text-xs text-[#1A1A1A]/50 mt-3">
              {text.pickup.carrierNote}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
