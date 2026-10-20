"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import DeliveryPicker from "@/components/checkout/DeliveryPicker";
import StripePayment from "@/components/checkout/StripePayment";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/types";
import { getCategoryLabel } from "@/constants/categories";
import { trackBeginCheckout } from "@/lib/analytics";
import {
  SHIPPING_OPTIONS,
  formatPickupPoint,
  formatShippingPrice,
  type PickupPointSnapshot,
  type ShippingOptionKey,
} from "@/constants/shipping";

export default function CheckoutPage() {
  const { items, getTotal, getItemCount, removeItem, updateQuantity } = useCart();
  const totalItemCount = getItemCount();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shippingOption, setShippingOption] =
    useState<ShippingOptionKey>("home");
  const [pickupPoint, setPickupPoint] = useState<PickupPointSnapshot | null>(
    null
  );
  // Holds the embedded Stripe session. `signature` is what the session was
  // priced for — if the cart or delivery choice changes underneath it (the
  // cart drawer is reachable from the navbar), the session is stale and we
  // drop back to the review step rather than charge for the wrong basket.
  const [session, setSession] = useState<{
    clientSecret: string;
    signature: string;
  } | null>(null);

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

  useEffect(() => {
    if (session && session.signature !== cartSignature) {
      setSession(null);
    }
  }, [cartSignature, session]);

  const handleCheckout = async () => {
    if (items.length === 0) return;

    if (needsPickupPoint) {
      setError("Vælg en pakkeshop for at fortsætte.");
      return;
    }

    setIsLoading(true);
    setError(null);

    // Track begin checkout
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

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          shippingOption,
          pickupPoint: shippingOption === "pickup" ? pickupPoint : null,
          uiMode:
            process.env.NEXT_PUBLIC_STRIPE_HOSTED_CHECKOUT === "true"
              ? "hosted"
              : "embedded",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Der opstod en fejl");
      }

      if (data.clientSecret) {
        setSession({ clientSecret: data.clientSecret, signature: cartSignature });
        setIsLoading(false);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      throw new Error("Betalingen kunne ikke startes");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Der opstod en fejl ved betaling");
      setIsLoading(false);
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

  return (
    <div className="pt-20">
      {/* Header */}
      <section
        className={`border-b border-[#1A1A1A]/8 ${
          session ? "py-6" : "py-12 md:py-16"
        }`}
      >
        <Container>
          <div className="animate-fade-in-up">
            <h1 className="font-serif text-3xl md:text-4xl font-light text-[#1A1A1A]">
              Checkout
            </h1>
          </div>
        </Container>
      </section>

      {/* Content */}
      <section className={session ? "pt-10 pb-16" : "py-12 md:py-16"}>
        <Container>
          {/* At the payment step the columns are sized to their content and
              centred — a 3-col grid stranded ~235px of bare cream beside the
              560px form at desktop widths. */}
          <div
            className={`grid gap-12 ${
              session
                ? "lg:grid-cols-[minmax(0,560px)_minmax(0,300px)] lg:justify-center"
                : "lg:grid-cols-3"
            }`}
          >
            {/* Cart Items */}
            <div className={session ? "" : "lg:col-span-2"}>
              <div
                className="animate-fade-in"
                style={{ animationDelay: "0.2s" }}
              >
                {session ? (
                  <div>
                    <div className="flex items-baseline gap-5 mb-6">
                      <h2 className="font-serif text-xl font-light text-[#1A1A1A]">
                        Betaling
                      </h2>
                      <button
                        type="button"
                        onClick={() => setSession(null)}
                        className="text-sm font-sans text-[#8D6553] underline underline-offset-4 decoration-[#8D6553]/30 hover:decoration-[#8D6553] transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#8D6553] focus-visible:ring-offset-2 rounded-sm"
                      >
                        Rediger ordre
                      </button>
                    </div>
                    <StripePayment
                      clientSecret={session.clientSecret}
                      amountLabel={formatPrice(getTotal() + shipping.price)}
                      collectsShippingAddress={shippingOption !== "pickup"}
                      pickupPointLabel={
                        pickupPoint ? formatPickupPoint(pickupPoint) : null
                      }
                    />
                  </div>
                ) : (
                  <>
                <h2 className="font-serif text-xl font-light text-[#1A1A1A] mb-6">
                  Din Ordre ({totalItemCount} {totalItemCount === 1 ? "vare" : "varer"})
                </h2>

                <div className="space-y-6">
                  {items.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex gap-4 pb-6 border-b border-[#1A1A1A]/10 animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="relative w-24 h-24 md:w-32 md:h-32 bg-[#F5F0EB] flex-shrink-0">
                        <Image
                          src={item.images[0]}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="128px"
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

                        <div className="flex items-center justify-between mt-4">
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

                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 text-[#8D6553] font-sans mt-6 hover:underline outline-none focus-visible:ring-2 focus-visible:ring-[#8D6553] focus-visible:ring-offset-2 rounded-sm"
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
                  </>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className={session ? "" : "lg:col-span-1"}>
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

                <div className="flex justify-between items-center mb-6">
                  <span className="font-serif text-lg text-[#1A1A1A]">Total</span>
                  <span className="font-serif text-2xl text-[#1A1A1A]">
                    {formatPrice(getTotal() + shipping.price)}
                  </span>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-sm mb-4 text-sm font-sans">
                    {error}
                  </div>
                )}

                {session ? (
                  <p className="font-sans text-sm text-[#1A1A1A]/60">
                    Udfyld dine oplysninger og betal i betalingsformularen.
                  </p>
                ) : (
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleCheckout}
                  disabled={isLoading || needsPickupPoint}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Behandler...
                    </span>
                  ) : (
                    "Gå til Betaling"
                  )}
                </Button>
                )}

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
