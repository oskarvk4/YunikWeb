import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { getAllProducts } from "@/data/products";
import { getCopy } from "@/lib/copy";
import { fillText } from "@/lib/copy-text";
import {
  SHIPPING_OPTIONS,
  pickupPointToMetadata,
  readPickupPoint,
  shippingTexts,
  type ShippingOptionKey,
} from "@/constants/shipping";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  images: string[];
}

const isShippingOptionKey = (value: unknown): value is ShippingOptionKey =>
  typeof value === "string" && value in SHIPPING_OPTIONS;

export async function POST(request: NextRequest) {
  // Messages the customer may see come from /admin/copy (checkout.errors).
  const copy = await getCopy();
  const errors = copy.checkout.errors;

  try {
    const { items, shippingOption, pickupPoint, uiMode } =
      (await request.json()) as {
        items: CartItem[];
        shippingOption?: unknown;
        pickupPoint?: unknown;
        uiMode?: unknown;
      };

    // Embedded renders the payment form inside /checkout on our own domain.
    // "hosted" is the escape hatch back to checkout.stripe.com — the client
    // asks for it when NEXT_PUBLIC_STRIPE_HOSTED_CHECKOUT is set, so the
    // redirect flow can be restored without a code change.
    const embedded = uiMode !== "hosted";

    // Get current user if logged in
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: errors.emptyCart },
        { status: 400 }
      );
    }

    // The delivery method is picked on /checkout, not in Stripe — Stripe has
    // no parcel-shop picker, and asking after payment loses customers who
    // close the tab. Default to home so an older client can't break checkout.
    const option = isShippingOptionKey(shippingOption)
      ? SHIPPING_OPTIONS[shippingOption]
      : SHIPPING_OPTIONS.home;

    // The name customers see in Stripe comes from /admin/copy (checkout.delivery).
    const shippingLabel = shippingTexts(copy.checkout.delivery, option.key).label;

    const point = option.key === "pickup" ? readPickupPoint(pickupPoint) : null;
    if (option.key === "pickup" && !point) {
      return NextResponse.json(
        { error: errors.pickupRequired },
        { status: 400 }
      );
    }

    // Fetch products from database and validate prices server-side
    const products = await getAllProducts();
    const productMap = new Map(products.map((p) => [p.id, p]));

    const validatedItems: CartItem[] = [];
    for (const item of items) {
      const product = productMap.get(item.id);
      if (!product) {
        return NextResponse.json(
          { error: fillText(errors.productNotFound, { id: item.id }) },
          { status: 400 }
        );
      }

      if (item.quantity <= 0) {
        return NextResponse.json(
          { error: fillText(errors.invalidQuantity, { name: product.name }) },
          { status: 400 }
        );
      }

      if (product.stockQuantity <= 0) {
        return NextResponse.json(
          { error: fillText(errors.soldOut, { name: product.name }) },
          { status: 400 }
        );
      }

      if (item.quantity > product.stockQuantity) {
        return NextResponse.json(
          {
            error: fillText(errors.fewLeft, {
              stock: product.stockQuantity,
              name: product.name,
            }),
          },
          { status: 400 }
        );
      }

      // Use server-side price and name to prevent manipulation
      validatedItems.push({
        ...item,
        price: product.price,
        name: product.name,
        images: product.images,
      });
    }

    const origin = request.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      currency: "dkk",
      locale: "da",
      // Deliberately unset: pinning an allowlist here overrides the Dashboard
      // and suppressed everything except MobilePay and card. Omitting it lets
      // Stripe offer whatever the default payment method configuration has
      // enabled and that suits a DKK/DK session — currently card, Klarna,
      // Link, MobilePay and Amazon Pay. Apple Pay and Google Pay are wallets
      // on `card`, so they surface once the domain is registered for the key
      // in use (test done; live still pending).
      billing_address_collection: "required",
      // A parcel-shop order is delivered to the shop, so asking for a street
      // address would only confuse — the billing address still identifies the
      // customer.
      ...(option.key === "pickup"
        ? {}
        : {
            shipping_address_collection: {
              allowed_countries: ["DK" as const],
            },
          }),
      // Store user_id and minimal cart items in metadata (500 char limit)
      metadata: {
        user_id: user?.id || "",
        items: JSON.stringify(
          validatedItems.map((item) => ({
            id: item.id,
            qty: item.quantity,
            price: item.price,
          }))
        ),
        shipping_option: option.key,
        ...(point ? pickupPointToMetadata(point) : {}),
      },
      // Only the rate the customer already chose, so there is nothing to
      // re-pick on Stripe's side and the pakkeshop choice can't be orphaned.
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount" as const,
            fixed_amount: {
              amount: option.price * 100,
              currency: "dkk",
            },
            display_name: point
              ? `${shippingLabel} — ${point.name}`
              : shippingLabel,
            metadata: { option: option.key },
            delivery_estimate: {
              minimum: {
                unit: "business_day" as const,
                value: option.minDays,
              },
              maximum: {
                unit: "business_day" as const,
                value: option.maxDays,
              },
            },
          },
        },
      ],
      line_items: validatedItems.map((item) => ({
        price_data: {
          currency: "dkk",
          product_data: {
            name: item.name,
            images: item.images.slice(0, 1).map((img) =>
              img.startsWith("http") ? img : `${origin}${img}`
            ),
          },
          unit_amount: item.price * 100, // Convert to øre (price validated server-side)
        },
        quantity: item.quantity,
      })),
      // Custom/embedded sessions take a return_url and reject
      // success_url/cancel_url; hosted needs the opposite pair.
      ...(embedded
        ? {
            // 'custom' renders through Elements in our own DOM, which is the
            // only mode that accepts an Appearance object — Embedded Checkout
            // takes no styling from code at all. It is still a Checkout
            // Session, so checkout.session.completed fires unchanged.
            ui_mode: "custom" as const,
            return_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          }
        : {
            success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/checkout/cancel`,
          }),
    });

    return NextResponse.json(
      embedded
        ? { clientSecret: session.client_secret }
        : { url: session.url }
    );
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: errors.sessionFailed },
      { status: 500 }
    );
  }
}
