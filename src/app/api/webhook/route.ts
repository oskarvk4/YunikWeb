import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createStandaloneAdminClient } from "@/lib/supabase/server";
import Stripe from "stripe";
import { getAllProducts } from "@/data/products";
import { sendOrderConfirmationEmail } from "@/lib/email/transactional";
import type { Database, Json } from "@/types/supabase";

type OrderInsert = Database["public"]["Tables"]["orders"]["Insert"];

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not configured");
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 500 }
    );
  }

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      try {
        // Use admin client to bypass RLS
        const supabase = createStandaloneAdminClient();
        const products = await getAllProducts();

        // Parse cart items from metadata and expand with product details
        const rawItems = session.metadata?.items
          ? JSON.parse(session.metadata.items)
          : [];
        const items = rawItems.map((item: { id: string; qty: number; price: number }) => {
          const product = products.find((p) => p.id === item.id);
          return {
            id: item.id,
            name: product?.name || "Unknown",
            price: item.price,
            quantity: item.qty,
            image: product?.images?.[0] || "",
          };
        });

        // Get user_id from metadata (if user was logged in)
        const userId = session.metadata?.user_id || null;

        // Calculate total (convert from smallest unit)
        const totalAmount = session.amount_total
          ? Math.round(session.amount_total / 100)
          : 0;

        // Determine shipping option
        let shippingOption = "free";
        if (session.shipping_cost?.amount_total && session.shipping_cost.amount_total > 0) {
          shippingOption = "express";
        }

        // Save order to database
        // shipping_details is available on Session but TypeScript types may not expose it
        const sessionWithShipping = session as Stripe.Checkout.Session & {
          shipping_details?: { address?: Record<string, unknown> };
        };
        const shippingAddress = sessionWithShipping.shipping_details?.address as Json | undefined;

        const orderData: OrderInsert = {
          user_id: userId || null,
          stripe_session_id: session.id,
          customer_email: session.customer_details?.email || "",
          items: items as Json,
          total_amount: totalAmount,
          currency: session.currency?.toUpperCase() || "DKK",
          shipping_address: shippingAddress || null,
          billing_address: (session.customer_details?.address as Json) || null,
          shipping_option: shippingOption,
          status: "completed",
        };

        const { data: order, error } = await supabase
          .from("orders")
          .insert(orderData)
          .select()
          .single();

        if (error) {
          console.error("Failed to save order:", error);
        } else {
          console.log("Order saved successfully:", order.id);

          const emailResult = await sendOrderConfirmationEmail(order);
          if (!emailResult.success) {
            console.error(
              "Order confirmation email failed for",
              order.id,
              emailResult.error
            );
          }

          // TODO: Update inventory
          // for (const item of items) {
          //   await supabase
          //     .from("products")
          //     .update({ stock_quantity: supabase.sql`stock_quantity - ${item.quantity}` })
          //     .eq("id", item.id);
          // }
        }
      } catch (error) {
        console.error("Error processing completed checkout:", error);
      }

      break;
    }

    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("Checkout session expired:", session.id);

      // Optionally save expired sessions for analytics
      try {
        const supabase = createStandaloneAdminClient();
        const products = await getAllProducts();
        const rawItems = session.metadata?.items
          ? JSON.parse(session.metadata.items)
          : [];
        const items = rawItems.map((item: { id: string; qty: number; price: number }) => {
          const product = products.find((p) => p.id === item.id);
          return {
            id: item.id,
            name: product?.name || "Unknown",
            price: item.price,
            quantity: item.qty,
          };
        });
        const userId = session.metadata?.user_id || null;

        const expiredOrderData: OrderInsert = {
          user_id: userId || null,
          stripe_session_id: session.id,
          customer_email: session.customer_details?.email || "unknown",
          items: items as Json,
          total_amount: session.amount_total
            ? Math.round(session.amount_total / 100)
            : 0,
          currency: session.currency?.toUpperCase() || "DKK",
          status: "expired",
        };

        await supabase.from("orders").insert(expiredOrderData);
      } catch (error) {
        console.error("Error saving expired session:", error);
      }

      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
