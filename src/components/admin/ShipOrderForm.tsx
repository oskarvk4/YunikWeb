"use client";

import { useState, useTransition } from "react";
import {
  markOrderShipped,
  markOrderUnfulfilled,
  resendShippingEmail,
  type FulfillmentResult,
} from "@/app/admin/orders/actions";
import {
  CARRIER_OPTIONS,
  getCarrierLabel,
  getTrackingUrl,
} from "@/constants/carriers";

interface ShipOrderFormProps {
  orderId: string;
  fulfillmentStatus: string;
  carrier: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  shippedAt: string | null;
  customerEmail: string;
}

type Feedback = { tone: "ok" | "warn" | "error"; message: string } | null;

function feedbackFrom(result: FulfillmentResult, okMessage: string): Feedback {
  if (!result.ok) {
    return { tone: "error", message: result.error || "Noget gik galt." };
  }
  if (result.emailError) {
    return {
      tone: "warn",
      message: `${okMessage} Emailen kunne dog ikke sendes: ${result.emailError}`,
    };
  }
  return { tone: "ok", message: okMessage };
}

export default function ShipOrderForm({
  orderId,
  fulfillmentStatus,
  carrier,
  trackingNumber,
  trackingUrl,
  shippedAt,
  customerEmail,
}: ShipOrderFormProps) {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<Feedback>(null);

  const [carrierValue, setCarrierValue] = useState(carrier || "postnord");
  const [trackingValue, setTrackingValue] = useState(trackingNumber || "");
  const [urlValue, setUrlValue] = useState(trackingUrl || "");
  const [notify, setNotify] = useState(true);

  const isShipped = fulfillmentStatus === "shipped";
  const resolvedUrl = getTrackingUrl(carrier, trackingNumber, trackingUrl);

  const run = (
    action: () => Promise<FulfillmentResult>,
    okMessage: string
  ) => {
    setFeedback(null);
    startTransition(async () => {
      setFeedback(feedbackFrom(await action(), okMessage));
    });
  };

  const handleShip = () =>
    run(
      () =>
        markOrderShipped(orderId, {
          carrier: carrierValue,
          trackingNumber: trackingValue,
          trackingUrl: urlValue,
          notify,
        }),
      notify
        ? `Markeret som afsendt. Tracking-email sendt til ${customerEmail}.`
        : "Markeret som afsendt. Ingen email sendt."
    );

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-lg">Afsendelse</h2>
        <span
          className={`inline-block px-3 py-1 text-xs rounded-full ${
            isShipped
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {isShipped ? "Afsendt" : "Ikke afsendt"}
        </span>
      </div>

      {isShipped ? (
        <div className="space-y-4">
          <div className="space-y-1 text-sm">
            <p className="text-dark">
              {getCarrierLabel(carrier)}
              {trackingNumber ? (
                <span className="font-mono text-dark/70"> · {trackingNumber}</span>
              ) : null}
            </p>
            {shippedAt && (
              <p className="text-dark/60">
                Afsendt{" "}
                {new Date(shippedAt).toLocaleDateString("da-DK", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}
            {resolvedUrl && (
              <a
                href={resolvedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                Åbn sporing →
              </a>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                run(
                  () => resendShippingEmail(orderId),
                  `Tracking-email sendt igen til ${customerEmail}.`
                )
              }
              disabled={isPending}
              className="px-3 py-2 text-sm border border-dark/20 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send email igen
            </button>
            <button
              type="button"
              onClick={() =>
                run(
                  () => markOrderUnfulfilled(orderId),
                  "Afsendelsen er fortrudt. Tracking-oplysningerne er ryddet."
                )
              }
              disabled={isPending}
              className="px-3 py-2 text-sm text-red-700 border border-red-200 rounded-md hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Fortryd afsendelse
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label
              htmlFor="carrier"
              className="block text-sm text-dark/60 mb-1"
            >
              Fragtfører
            </label>
            <select
              id="carrier"
              value={carrierValue}
              onChange={(e) => setCarrierValue(e.target.value)}
              className="w-full border border-dark/20 rounded-md px-3 py-2 text-sm bg-white"
            >
              {CARRIER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="trackingNumber"
              className="block text-sm text-dark/60 mb-1"
            >
              Tracking-nummer
            </label>
            <input
              id="trackingNumber"
              value={trackingValue}
              onChange={(e) => setTrackingValue(e.target.value)}
              placeholder="00570012345678901234"
              className="w-full border border-dark/20 rounded-md px-3 py-2 text-sm font-mono"
            />
          </div>

          <div>
            <label
              htmlFor="trackingUrl"
              className="block text-sm text-dark/60 mb-1"
            >
              Tracking-link <span className="text-dark/40">(valgfrit)</span>
            </label>
            <input
              id="trackingUrl"
              value={urlValue}
              onChange={(e) => setUrlValue(e.target.value)}
              placeholder="Udfyld kun hvis fragtførerens standardlink ikke virker"
              className="w-full border border-dark/20 rounded-md px-3 py-2 text-sm"
            />
          </div>

          <label className="flex items-start gap-2 text-sm text-dark cursor-pointer">
            <input
              type="checkbox"
              checked={notify}
              onChange={(e) => setNotify(e.target.checked)}
              className="mt-0.5"
            />
            <span>
              Send tracking-email til {customerEmail}
            </span>
          </label>

          <button
            type="button"
            onClick={handleShip}
            disabled={isPending}
            className="w-full bg-dark text-white px-4 py-2.5 text-sm font-medium rounded-md hover:bg-dark/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Gemmer…" : "Marker som afsendt"}
          </button>
        </div>
      )}

      {feedback && (
        <p
          className={`mt-4 text-sm ${
            feedback.tone === "ok"
              ? "text-green-700"
              : feedback.tone === "warn"
              ? "text-yellow-700"
              : "text-red-700"
          }`}
        >
          {feedback.message}
        </p>
      )}
    </div>
  );
}
