import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createStandaloneAdminClient } from "@/lib/supabase/server";
import Stripe from "stripe";
import { getAllProducts } from "@/data/products";
import { sendOrderConfirmationEmail } from "@/lib/email/transactional";
import type { Database, Json } from "@/types/supabase";

type OrderInsert = Database["public"]["Tables"]["orders"]["Insert"];

function getWebhookSecrets(): string[] {
  return [
    process.env.STRIPE_WEBHOOK_SECRET,
    process.env.STRIPE_WEBHOOK_SECRET_LIVE,
    process.env.STRIPE_WEBHOOK_SECRET_TEST,
  ].filter((secret): secret is string => Boolean(secret));
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  let processingFailed = false;

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  const webhookSecrets = getWebhookSecrets();

  if (webhookSecrets.length === 0) {
    console.error("No Stripe webhook signing secret is configured");
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 500 }
    );
  }

  try {
    const verifiedEvent = webhookSecrets.reduce<Stripe.Event | null>(
      (currentEvent, secret) => {
        if (currentEvent) return currentEvent;

        try {
          return stripe.webhooks.constructEvent(body, signature, secret);
        } catch {
          return null;
        }
      },
      null
    );

    if (!verifiedEvent) {
      throw new Error("No configured webhook signing secret matched");
    }

    event = verifiedEvent;
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  console.log("Stripe webhook received:", {
    type: event.type,
    livemode: event.livemode,
  });

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      try {
        console.log("Webhook received checkout.session.completed:", session.id);

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

        // Idempotent insert: if a row with this stripe_session_id already
        // exists we treat the delivery as a duplicate and skip the email so
        // Stripe retries and dual endpoints (prod + `stripe listen`) don't
        // produce duplicate orders/emails.
        const { data: insertedRows, error } = await supabase
          .from("orders")
          .upsert(orderData, {
            onConflict: "stripe_session_id",
            ignoreDuplicates: true,
          })
          .select();

        if (error) {
          processingFailed = true;
          console.error("Failed to save order:", {
            sessionId: session.id,
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code,
            orderData,
          });
        } else if (!insertedRows || insertedRows.length === 0) {
          console.log("Duplicate webhook delivery — order already saved:", {
            sessionId: session.id,
          });
        } else {
          const order = insertedRows[0];
          console.log("Order saved successfully:", {
            orderId: order.id,
            sessionId: session.id,
          });

          const emailResult = await sendOrderConfirmationEmail(order);
          if (!emailResult.success) {
            console.error(
              "Order confirmation email failed for",
              order.id,
              emailResult.error
            );
          } else {
            console.log("Order confirmation email sent:", {
              orderId: order.id,
              resendMessageId: emailResult.id,
            });
          }

          for (const item of items) {
            const product = products.find((entry) => entry.id === item.id);
            if (!product) continue;

            const nextStock = Math.max(
              0,
              product.stockQuantity - item.quantity
            );

            const { error: stockError } = await supabase
              .from("products")
              .update({ stock_quantity: nextStock })
              .eq("id", item.id);

            if (stockError) {
              processingFailed = true;
              console.error("Failed to update inventory:", item.id, stockError);
            }
          }
        }
      } catch (error) {
        processingFailed = true;
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
        processingFailed = true;
        console.error("Error saving expired session:", error);
      }

      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  if (processingFailed) {
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
