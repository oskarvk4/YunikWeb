"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import DeliveryPicker from "@/components/checkout/DeliveryPicker";
import StripePayment, { PaymentSkeleton } from "@/components/checkout/StripePayment";
import { useCart } from "@/lib/cart";
import { formatPrice, type CartItem } from "@/types";
import { getCategoryLabel } from "@/constants/categories";
import { trackBeginCheckout } from "@/lib/analytics";
import {
  SHIPPING_OPTIONS,
  formatPickupPoint,
  formatShippingPrice,
  type PickupPointSnapshot,
  type ShippingOptionKey,
} from "@/constants/shipping";

// Production uses the embedded form. "hosted" sends people to checkout.stripe.com
// instead, and stays click-to-start: no session is made until they ask for one.
const HOSTED_CHECKOUT = process.env.NEXT_PUBLIC_STRIPE_HOSTED_CHECKOUT === "true";

// Sessions are created by themselves as the basket changes, so a local run with live
// keys would open live Checkout Sessions on every change. Local development needs
// test keys (see .env.development.local); until then the form stays switched off.
const LIVE_KEY_IN_DEV =
  process.env.NODE_ENV !== "production" &&
  (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "").startsWith("pk_live_");

const SESSION_DEBOUNCE_MS = 400;

interface CheckoutRequest {
  items: CartItem[];
  shippingOption: ShippingOptionKey;
  pickupPoint: PickupPointSnapshot | null;
  uiMode: "embedded" | "hosted";
}

/** Asks the server for a Stripe session; resolves with its clientSecret or hosted url. */
async function requestCheckout(
  body: CheckoutRequest
): Promise<{ clientSecret?: string; url?: string }> {
  const response = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "Der opstod en fejl");
  }
  return data;
}

const errorMessage = (err: unknown) =>
  err instanceof Error ? err.message : "Der opstod en fejl ved betaling";

export default function CheckoutPage() {
  const { items, getTotal, getItemCount, removeItem, updateQuantity } = useCart();
  const totalItemCount = getItemCount();
  const [shippingOption, setShippingOption] =
    useState<ShippingOptionKey>("home");
  const [pickupPoint, setPickupPoint] = useState<PickupPointSnapshot | null>(
    null
  );
  // Kept here, not in the payment form, because the form is rebuilt whenever a
  // new session is created.
  const [email, setEmail] = useState("");
  // The embedded Stripe session. `signature` is what it was priced for: if the
  // basket or delivery choice changes (the cart drawer is reachable from the
  // navbar), the session is stale and a new one is created.
  const [session, setSession] = useState<{
    clientSecret: string;
    signature: string;
  } | null>(null);
  // A failed request, tied to the basket it failed for so it clears itself when
  // the basket changes.
  const [failure, setFailure] = useState<{
    signature: string;
    message: string;
  } | null>(null);
  // Bumped by "Prøv igen" to run the request again for the same basket.
  const [attempt, setAttempt] = useState(0);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const trackedBeginCheckout = useRef(false);

  const shipping = SHIPPING_OPTIONS[shippingOption];
  const needsPickupPoint = shippingOption === "pickup" && !pickupPoint;

  const cartSignature = useMemo(
    () =>
      JSON.stringify([
        items.map((item) => [item.id, item.quantity]),
        shippingOption,
        pickupPoint?.number ?? null,
      ]),
    [items, shippingOption, pickupPoint]
  );

  // A session counts only while it matches the basket as it is now.
  const readySession = session?.signature === cartSignature ? session : null;
  const currentFailure =
    failure?.signature === cartSignature ? failure.message : null;
  const canCreateSession =
    items.length > 0 && !needsPickupPoint && !HOSTED_CHECKOUT && !LIVE_KEY_IN_DEV;

  // Once per visit, not once per session.
  useEffect(() => {
    if (trackedBeginCheckout.current || items.length === 0) return;
    trackedBeginCheckout.current = true;
    trackBeginCheckout(
      items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        category: item.category,
        quantity: item.quantity,
      })),
      getTotal()
    );
  }, [items, getTotal]);

  // Creates the session as soon as the basket and delivery choice are settled.
  // The wait lets a run of quantity or delivery clicks collapse into one request,
  // and a reply for a basket that has since changed is thrown away.
  const sessionSignature = session?.signature;
  useEffect(() => {
    if (!canCreateSession || sessionSignature === cartSignature) return;

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      try {
        const data = await requestCheckout({
          items,
          shippingOption,
          pickupPoint: shippingOption === "pickup" ? pickupPoint : null,
          uiMode: "embedded",
        });
        if (cancelled) return;
        if (!data.clientSecret) throw new Error("Betalingen kunne ikke startes");
        setSession({ clientSecret: data.clientSecret, signature: cartSignature });
      } catch (err) {
        if (cancelled) return;
        setFailure({ signature: cartSignature, message: errorMessage(err) });
      }
    }, SESSION_DEBOUNCE_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [
    canCreateSession,
    cartSignature,
    sessionSignature,
    attempt,
    items,
    shippingOption,
    pickupPoint,
  ]);

  const retry = () => {
    setFailure(null);
    setAttempt((n) => n + 1);
  };

  // Hosted mode only: the old click-to-pay flow, redirecting to Stripe.
  const handleHostedCheckout = async () => {
    if (items.length === 0 || needsPickupPoint) return;

    setIsRedirecting(true);
    setFailure(null);

    try {
      const data = await requestCheckout({
        items,
        shippingOption,
        pickupPoint: shippingOption === "pickup" ? pickupPoint : null,
        uiMode: "hosted",
      });
      if (!data.url) throw new Error("Betalingen kunne ikke startes");
      window.location.href = data.url;
    } catch (err) {
      setFailure({ signature: cartSignature, message: errorMessage(err) });
      setIsRedirecting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="pt-20">
        <section className="py-16 md:py-24">
          <Container size="narrow">
            <div className="text-center animate-fade-in-up">
              <div className="w-20 h-20 bg-[#F5F0EB] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-[#1A1A1A]/30"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h1 className="font-serif text-3xl md:text-4xl font-light text-[#1A1A1A] mb-4">
                Din kurv er tom
              </h1>
              <p className="text-[#1A1A1A]/60 font-sans mb-8">
                Tilføj nogle smykker til din kurv for at fortsætte
              </p>
              <Link href="/shop">
                <Button variant="primary" size="lg">
                  Gå til Shop
                </Button>
              </Link>
            </div>
          </Container>
        </section>
      </div>
    );
  }

  const failureBox = currentFailure && (
    <div
      role="alert"
      className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-sm text-sm font-sans"
    >
      {currentFailure}
    </div>
  );

  let paymentArea: ReactNode;
  if (needsPickupPoint) {
    paymentArea = (
      <p className="font-sans text-sm text-[#1A1A1A]/60">
        Vælg en pakkeshop ovenfor for at fortsætte til betaling.
      </p>
    );
  } else if (HOSTED_CHECKOUT) {
    paymentArea = (
      <div className="space-y-4">
        {failureBox}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleHostedCheckout}
          disabled={isRedirecting}
        >
          {isRedirecting ? "Behandler..." : "Gå til betaling"}
        </Button>
      </div>
    );
  } else if (LIVE_KEY_IN_DEV) {
    paymentArea = (
      <p className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-sm text-sm font-sans">
        Lokal udvikling med live Stripe-nøgler: betalingsformularen er slået fra.
        Læg test-nøgler i .env.development.local.
      </p>
    );
  } else if (currentFailure) {
    paymentArea = (
      <div className="space-y-4">
        {failureBox}
        <Button variant="outline" size="md" onClick={retry}>
          Prøv igen
        </Button>
      </div>
    );
  } else if (readySession) {
    paymentArea = (
      <StripePayment
        key={readySession.clientSecret}
        clientSecret={readySession.clientSecret}
        amountLabel={formatPrice(getTotal() + shipping.price)}
        collectsShippingAddress={shippingOption !== "pickup"}
        pickupPointLabel={pickupPoint ? formatPickupPoint(pickupPoint) : null}
        email={email}
        onEmailChange={setEmail}
      />
    );
  } else {
    paymentArea = <PaymentSkeleton />;
  }

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="border-b border-[#1A1A1A]/8 py-8 md:py-12">
        <Container>
          <div className="animate-fade-in-up">
            <h1 className="font-serif text-3xl md:text-4xl font-light text-[#1A1A1A]">
              Checkout
            </h1>
          </div>
        </Container>
      </section>

      {/* Content */}
      <section className="py-10 md:py-12">
        <Container>
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Basket, delivery and payment, top to bottom */}
            <div className="lg:col-span-2">
              <div
                className="animate-fade-in"
                style={{ animationDelay: "0.2s" }}
              >
                <h2 className="font-serif text-xl font-light text-[#1A1A1A] mb-6">
                  Din Ordre ({totalItemCount} {totalItemCount === 1 ? "vare" : "varer"})
                </h2>

                <div className="space-y-5">
                  {items.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex gap-4 pb-5 border-b border-[#1A1A1A]/10 animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="relative w-20 h-20 bg-[#F5F0EB] flex-shrink-0">
                        <Image
                          src={item.images[0]}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-serif text-lg text-[#1A1A1A]">
                              {item.name}
                            </h3>
                            <p className="text-sm text-[#1A1A1A]/60 font-sans capitalize mt-1">
                              {getCategoryLabel(item.category)}
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-1 rounded-sm"
                            aria-label="Fjern vare"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 border border-[#1A1A1A]/20 flex items-center justify-center text-sm hover:border-[#1A1A1A] transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-1"
                              aria-label="Reducer antal"
                            >
                              -
                            </button>
                            <span className="text-sm font-sans w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.stockQuantity}
                              className="w-8 h-8 border border-[#1A1A1A]/20 flex items-center justify-center text-sm hover:border-[#1A1A1A] transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-40"
                              aria-label="Øg antal"
                            >
                              +
                            </button>
                          </div>
                          <p className="font-serif text-lg text-[#1A1A1A]">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <DeliveryPicker
                  option={shippingOption}
                  onOptionChange={setShippingOption}
                  pickupPoint={pickupPoint}
                  onPickupPointChange={setPickupPoint}
                />

                <div className="border-t border-[#1A1A1A]/10 pt-6 mt-6">
                  <h2 className="font-serif text-lg text-[#1A1A1A] mb-4">Betaling</h2>
                  {paymentArea}
                </div>

                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 text-[#8D6553] font-sans mt-8 hover:underline outline-none focus-visible:ring-2 focus-visible:ring-[#8D6553] focus-visible:ring-offset-2 rounded-sm"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Fortsæt shopping
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div
                className="bg-white border border-[#1A1A1A]/8 p-6 md:p-8 lg:sticky lg:top-32 animate-fade-in-up"
                style={{ animationDelay: "0.3s" }}
              >
                <h2 className="font-serif text-xl font-light text-[#1A1A1A] mb-6">
                  Ordreoversigt
                </h2>

                <div className="space-y-4 border-b border-[#1A1A1A]/10 pb-4 mb-4">
                  <div className="flex justify-between font-sans text-sm">
                    <span className="text-[#1A1A1A]/60">Subtotal</span>
                    <span className="text-[#1A1A1A]">{formatPrice(getTotal())}</span>
                  </div>
                  <div className="flex justify-between font-sans text-sm">
                    <span className="text-[#1A1A1A]/60">{shipping.label}</span>
                    <span className="text-[#1A1A1A]">
                      {formatShippingPrice(shipping)}
                    </span>
                  </div>
                  {pickupPoint && (
                    <p className="font-sans text-sm text-[#1A1A1A]/60">
                      {pickupPoint.name}
                      {pickupPoint.city ? `, ${pickupPoint.city}` : ""}
                    </p>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-serif text-lg text-[#1A1A1A]">Total</span>
                  <span className="font-serif text-2xl text-[#1A1A1A]">
                    {formatPrice(getTotal() + shipping.price)}
                  </span>
                </div>

                <div className="mt-6 flex items-center justify-center gap-2 text-[#1A1A1A]/50">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <span className="text-xs font-sans">Sikker betaling med Stripe</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
