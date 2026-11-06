"use client";

import { useEffect, useRef, useState } from "react";
import { loadStripe, type Appearance } from "@stripe/stripe-js";
import {
  CheckoutElementsProvider,
  useCheckoutElements,
  BillingAddressElement,
  PaymentElement,
  ShippingAddressElement,
} from "@stripe/react-stripe-js/checkout";
import Button from "@/components/ui/Button";
import { useCopy } from "@/components/CopyProvider";
import { fillText } from "@/lib/copy-text";
import { formatPrice } from "@/types";

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

/** Pulse blocks standing in for the form, while Stripe loads or a session is being created. */
export function PaymentSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-12 bg-[#1A1A1A]/5 animate-pulse" />
      ))}
    </div>
  );
}

/** Totals from the Stripe session, in kroner, reported up to the order summary. */
export type SessionTotals = { discount: number; total: number };

function PaymentForm({
  amountLabel,
  collectsShippingAddress,
  pickupPointLabel,
  email,
  onEmailChange,
  promoCode,
  onPromoCodeChange,
  onTotalsChange,
}: {
  amountLabel: string;
  collectsShippingAddress: boolean;
  pickupPointLabel?: string | null;
  email: string;
  onEmailChange: (email: string) => void;
  promoCode: string;
  onPromoCodeChange: (code: string) => void;
  onTotalsChange: (totals: SessionTotals) => void;
}) {
  const result = useCheckoutElements();
  const copy = useCopy().checkout;
  const text = copy.form;
  const codeText = copy.discount;
  const [error, setError] = useState<string | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [codeInput, setCodeInput] = useState(promoCode);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const reapplied = useRef(false);

  const checkout = result.type === "success" ? result.checkout : null;
  const appliedCode = checkout?.discountAmounts?.find((d) => d.promotionCode)?.promotionCode ?? null;
  const discountMinor = checkout?.total.discount.minorUnitsAmount ?? 0;
  const totalMinor = checkout?.total.total.minorUnitsAmount ?? null;

  // The order summary sits outside this form, so the session's totals (with
  // any discount) are passed up whenever they change.
  useEffect(() => {
    if (totalMinor === null) return;
    onTotalsChange({ discount: discountMinor / 100, total: totalMinor / 100 });
  }, [discountMinor, totalMinor, onTotalsChange]);

  // A new session is created whenever the basket or delivery changes; put the
  // customer's code back on it once, so they don't have to type it again.
  useEffect(() => {
    if (!checkout || reapplied.current || !promoCode || appliedCode) return;
    reapplied.current = true;
    checkout.applyPromotionCode(promoCode).then((res) => {
      if (res.type === "error") onPromoCodeChange("");
    });
  }, [checkout, promoCode, appliedCode, onPromoCodeChange]);

  if (result.type === "loading") {
    return <PaymentSkeleton />;
  }

  if (result.type === "error") {
    return (
      <p className="text-sm font-sans text-red-600">{result.error.message}</p>
    );
  }

  const { checkout: session } = result;

  const applyCode = async () => {
    const code = codeInput.trim();
    if (!code || isApplying) return;
    setCodeError(null);
    setIsApplying(true);
    const res = await session.applyPromotionCode(code);
    setIsApplying(false);
    if (res.type === "error") {
      setCodeError(codeText.error);
      return;
    }
    onPromoCodeChange(code);
  };

  const removeCode = async () => {
    setCodeError(null);
    const res = await session.removePromotionCode();
    if (res.type === "success") {
      setCodeInput("");
      onPromoCodeChange("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsPaying(true);

    // Surfaces field-level problems in the Elements themselves instead of
    // failing at confirm with one opaque message.
    const validation = await session.validateElements();
    if (validation.type === "error") {
      setError(validation.error.message);
      setIsPaying(false);
      return;
    }

    const confirmation = await session.confirm({ email });
    if (confirmation.type === "error") {
      setError(confirmation.error.message);
      setIsPaying(false);
    }
    // On success Stripe redirects to the session's return_url.
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h3 className={sectionClass}>{text.contactHeading}</h3>
        <label htmlFor="checkout-email" className={labelClass}>
          {text.emailLabel}
        </label>
        <input
          id="checkout-email"
          type="email"
          required
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder={text.emailPlaceholder}
          className="w-full px-[14px] py-3 border border-[#1A1A1A]/20 bg-white text-[15px] font-sans text-[#1A1A1A] placeholder:text-[#1A1A1A]/35 focus:border-[#1A1A1A] focus:outline-none transition-colors"
        />
      </div>

      {collectsShippingAddress ? (
        <div>
          <h3 className={sectionClass}>{text.shippingHeading}</h3>
          <ShippingAddressElement />
        </div>
      ) : (
        <div>
          <h3 className={sectionClass}>{text.pickupHeading}</h3>
          <p className="text-[15px] font-sans text-[#1A1A1A]">
            {pickupPointLabel}
          </p>
          <p className="text-sm font-sans text-[#1A1A1A]/60 mt-1">
            {text.pickupNote}
          </p>
        </div>
      )}

      <div>
        <h3 className={sectionClass}>{text.billingHeading}</h3>
        <BillingAddressElement />
      </div>

      <div>
        <h3 className={sectionClass}>{codeText.heading}</h3>
        {appliedCode ? (
          <div className="flex items-center justify-between gap-3 px-[14px] py-3 border border-[#1A1A1A]/20 bg-[#F5F0EB]/60 font-sans text-[15px] text-[#1A1A1A]">
            <span>
              {fillText(codeText.applied, { code: appliedCode })}
              {discountMinor > 0 && (
                <span className="text-[#1A1A1A]/60"> (−{formatPrice(discountMinor / 100)})</span>
              )}
            </span>
            <button
              type="button"
              onClick={removeCode}
              className="text-sm text-[#8D6553] underline underline-offset-4 decoration-[#8D6553]/30 hover:decoration-[#8D6553] cursor-pointer"
            >
              {codeText.remove}
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={codeInput}
              onChange={(e) => {
                setCodeInput(e.target.value.toUpperCase());
                setCodeError(null);
              }}
              onKeyDown={(e) => {
                // Enter applies the code instead of submitting the payment.
                if (e.key === "Enter") {
                  e.preventDefault();
                  applyCode();
                }
              }}
              placeholder={codeText.placeholder}
              aria-label={codeText.heading}
              autoComplete="off"
              className="flex-1 min-w-0 px-[14px] py-3 border border-[#1A1A1A]/20 bg-white text-[15px] font-sans text-[#1A1A1A] placeholder:text-[#1A1A1A]/35 focus:border-[#1A1A1A] focus:outline-none transition-colors"
            />
            <button
              type="button"
              onClick={applyCode}
              disabled={!codeInput.trim() || isApplying}
              className="shrink-0 px-5 border border-[#1A1A1A] text-sm font-sans text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[#1A1A1A] cursor-pointer disabled:cursor-not-allowed"
            >
              {isApplying ? codeText.applying : codeText.apply}
            </button>
          </div>
        )}
        {codeError && (
          <p role="alert" className="mt-2 text-sm font-sans text-red-600">
            {codeError}
          </p>
        )}
      </div>

      <div>
        <h3 className={sectionClass}>{text.methodHeading}</h3>
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
        {isPaying
          ? text.processing
          : fillText(text.payButton, {
              // The session's own total once Stripe has it: includes any discount.
              amount: totalMinor !== null ? formatPrice(totalMinor / 100) : amountLabel,
            })}
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
  /**
   * Held by the checkout page, which creates a new session whenever the basket
   * or delivery choice changes, so the e-mail survives the form being rebuilt.
   */
  email: string;
  onEmailChange: (email: string) => void;
  /** The applied discount code, held by the page so it survives a new session. */
  promoCode: string;
  onPromoCodeChange: (code: string) => void;
  /** Called with the session's discount and total whenever they change. */
  onTotalsChange: (totals: SessionTotals) => void;
}

export default function StripePayment({
  clientSecret,
  amountLabel,
  collectsShippingAddress,
  pickupPointLabel,
  email,
  onEmailChange,
  promoCode,
  onPromoCodeChange,
  onTotalsChange,
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
        email={email}
        onEmailChange={onEmailChange}
        promoCode={promoCode}
        onPromoCodeChange={onPromoCodeChange}
        onTotalsChange={onTotalsChange}
      />
    </CheckoutElementsProvider>
  );
}
