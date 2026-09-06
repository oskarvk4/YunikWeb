"use client";

import { useState } from "react";
import { loadStripe, type Appearance } from "@stripe/stripe-js";
import {
  CheckoutElementsProvider,
  useCheckoutElements,
  BillingAddressElement,
  PaymentElement,
  ShippingAddressElement,
} from "@stripe/react-stripe-js/checkout";
import Button from "@/components/ui/Button";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

// Mirrors the storefront: DM Sans body, #1A1A1A ink on white, #8D6553 accent,
// and square corners — Button.tsx has no radius class, so neither do these.
const DARK = "#1A1A1A";
const ACCENT = "#8D6553";

const appearance: Appearance = {
  theme: "stripe",
  variables: {
    fontFamily: '"DM Sans", system-ui, sans-serif',
    fontSizeBase: "15px",
    colorPrimary: ACCENT,
    colorBackground: "#FFFFFF",
    colorText: DARK,
    colorTextSecondary: "rgba(26,26,26,0.6)",
    colorTextPlaceholder: "rgba(26,26,26,0.35)",
    colorDanger: "#B3261E",
    borderRadius: "0px",
    spacingUnit: "4px",
  },
  rules: {
    ".Input": {
      border: "1px solid rgba(26,26,26,0.2)",
      boxShadow: "none",
      padding: "12px 14px",
      fontSize: "15px",
    },
    ".Input:focus": {
      border: `1px solid ${DARK}`,
      boxShadow: "none",
      outline: "none",
    },
    ".Input::placeholder": { color: "rgba(26,26,26,0.35)" },
    ".Label": {
      fontSize: "11px",
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      color: "rgba(26,26,26,0.6)",
      marginBottom: "8px",
    },
    ".Tab": {
      border: "1px solid rgba(26,26,26,0.2)",
      boxShadow: "none",
      borderRadius: "0px",
    },
    ".Tab:hover": { border: `1px solid rgba(26,26,26,0.4)` },
    ".Tab--selected": {
      border: `1px solid ${DARK}`,
      boxShadow: "none",
      color: DARK,
    },
    ".Block": {
      border: "1px solid rgba(26,26,26,0.15)",
      boxShadow: "none",
      borderRadius: "0px",
    },
    ".Error": { fontSize: "13px" },
  },
};

// Stripe's iframes can't see the self-hosted next/font files, so the same
// family is pulled from Google for the Elements only.
const fonts = [
  {
    cssSrc:
      "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&display=swap",
  },
];

// Field labels mirror the `.Label` rule above so ours and Stripe's read as
// one form. Section headings are serif so they don't compete with them.
const labelClass =
  "block text-xs font-sans uppercase tracking-[0.1em] text-[#1A1A1A]/60 mb-2";
const sectionClass =
  "font-serif text-lg font-light text-[#1A1A1A] mb-4 pb-2 border-b border-[#1A1A1A]/10";

function PaymentForm({
  amountLabel,
  collectsShippingAddress,
  pickupPointLabel,
}: {
  amountLabel: string;
  collectsShippingAddress: boolean;
  pickupPointLabel?: string | null;
}) {
  const result = useCheckoutElements();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPaying, setIsPaying] = useState(false);

  if (result.type === "loading") {
    return (
      <div className="space-y-4" aria-busy="true">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-12 bg-[#1A1A1A]/5 animate-pulse" />
        ))}
      </div>
    );
  }

  if (result.type === "error") {
    return (
      <p className="text-sm font-sans text-red-600">{result.error.message}</p>
    );
  }

  const { checkout } = result;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsPaying(true);

    // Surfaces field-level problems in the Elements themselves instead of
    // failing at confirm with one opaque message.
    const validation = await checkout.validateElements();
    if (validation.type === "error") {
      setError(validation.error.message);
      setIsPaying(false);
      return;
    }

    const confirmation = await checkout.confirm({ email });
    if (confirmation.type === "error") {
      setError(confirmation.error.message);
      setIsPaying(false);
    }
    // On success Stripe redirects to the session's return_url.
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h3 className={sectionClass}>Kontakt</h3>
        <label htmlFor="checkout-email" className={labelClass}>
          E-mail
        </label>
        <input
          id="checkout-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="din@email.dk"
          className="w-full px-[14px] py-3 border border-[#1A1A1A]/20 bg-white text-[15px] font-sans text-[#1A1A1A] placeholder:text-[#1A1A1A]/35 focus:border-[#1A1A1A] focus:outline-none transition-colors"
        />
      </div>

      {collectsShippingAddress ? (
        <div>
          <h3 className={sectionClass}>Leveringsadresse</h3>
          <ShippingAddressElement />
        </div>
      ) : (
        <div>
          <h3 className={sectionClass}>Afhentning</h3>
          <p className="text-[15px] font-sans text-[#1A1A1A]">
            {pickupPointLabel}
          </p>
          <p className="text-sm font-sans text-[#1A1A1A]/60 mt-1">
            Du får besked, når pakken er klar til afhentning.
          </p>
        </div>
      )}

      <div>
        <h3 className={sectionClass}>Faktureringsadresse</h3>
        <BillingAddressElement />
      </div>

      <div>
        <h3 className={sectionClass}>Betalingsmetode</h3>
        <PaymentElement />
      </div>

      {error && (
        <p role="alert" className="text-sm font-sans text-red-600">
          {error}
        </p>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        disabled={isPaying}
      >
        {isPaying ? "Behandler…" : `Betal ${amountLabel}`}
      </Button>
    </form>
  );
}

interface StripePaymentProps {
  clientSecret: string;
  amountLabel: string;
  /**
   * Pakkeshop orders go to the parcel shop the customer already chose, so the
   * session collects no shipping address and the form must not ask for one.
   */
  collectsShippingAddress: boolean;
  /** The chosen shop, shown in place of the delivery address fields. */
  pickupPointLabel?: string | null;
}

export default function StripePayment({
  clientSecret,
  amountLabel,
  collectsShippingAddress,
  pickupPointLabel,
}: StripePaymentProps) {
  return (
    <CheckoutElementsProvider
      stripe={stripePromise}
      options={{
        clientSecret,
        elementsOptions: {
          appearance,
          fonts,
          loader: "auto",
          // With no shipping address on the session there is nothing to sync
          // the billing address from, so the checkbox would be meaningless.
          ...(collectsShippingAddress
            ? { syncAddressCheckbox: "billing" as const }
            : {}),
        },
      }}
    >
      <PaymentForm
        amountLabel={amountLabel}
        collectsShippingAddress={collectsShippingAddress}
        pickupPointLabel={pickupPointLabel}
      />
    </CheckoutElementsProvider>
  );
}
