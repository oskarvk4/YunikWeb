import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  images: string[];
}

export async function POST(request: NextRequest) {
  try {
    const { items } = (await request.json()) as { items: CartItem[] };

    // Get current user if logged in
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Kurven er tom" },
        { status: 400 }
      );
    }

    const origin = request.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      currency: "dkk",
      locale: "da",
      payment_method_types: ["mobilepay", "card"],
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["DK"],
      },
      // Store user_id and minimal cart items in metadata (500 char limit)
      metadata: {
        user_id: user?.id || "",
        items: JSON.stringify(
          items.map((item) => ({
            id: item.id,
            qty: item.quantity,
            price: item.price,
          }))
        ),
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 0,
              currency: "dkk",
            },
            display_name: "Gratis fragt",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 2,
              },
              maximum: {
                unit: "business_day",
                value: 5,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 4900,
              currency: "dkk",
            },
            display_name: "Express levering",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 1,
              },
              maximum: {
                unit: "business_day",
                value: 2,
              },
            },
          },
        },
      ],
      line_items: items.map((item) => ({
        price_data: {
          currency: "dkk",
          product_data: {
            name: item.name,
            images: item.images.slice(0, 1).map((img) =>
              img.startsWith("http") ? img : `${origin}${img}`
            ),
          },
          unit_amount: item.price * 100, // Convert to øre
        },
        quantity: item.quantity,
      })),
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Der opstod en fejl ved oprettelse af betalingen" },
      { status: 500 }
    );
  }
}
