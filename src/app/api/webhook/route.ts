import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { stripe } from "@/lib/stripe";
import { createStandaloneAdminClient } from "@/lib/supabase/server";
import Stripe from "stripe";
import { getAllProducts } from "@/data/products";
import { sendOrderConfirmationEmail } from "@/lib/email/transactional";
import { resolveShippingOption } from "@/lib/shipping-option";
import { pickupPointFromMetadata } from "@/constants/shipping";
import type { Database, Json, Order } from "@/types/supabase";

type OrderInsert = Database["public"]["Tables"]["orders"]["Insert"];
type AdminClient = ReturnType<typeof createStandaloneAdminClient>;

/** The shape the order row's `items` column carries. */
interface OrderLineItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

function getWebhookSecrets(): string[] {
  return [
    process.env.STRIPE_WEBHOOK_SECRET,
    process.env.STRIPE_WEBHOOK_SECRET_LIVE,
    process.env.STRIPE_WEBHOOK_SECRET_TEST,
  ].filter((secret): secret is string => Boolean(secret));
}

/**
 * `checkout.session.completed` fires as soon as the customer finishes the flow,
 * which is not the same as the money having arrived. Delayed-notification
 * methods leave `payment_status` at "unpaid" and settle — or fail — minutes
 * later through the async_payment_* events. Only a paid session may be booked
 * as a completed order, emailed, and taken out of stock.
 */
function isPaid(session: Stripe.Checkout.Session): boolean {
  return session.payment_status === "paid";
}

function readSessionItems(
  session: Stripe.Checkout.Session,
  products: Awaited<ReturnType<typeof getAllProducts>>
): OrderLineItem[] {
  const rawItems: { id: string; qty: number; price: number }[] = session
    .metadata?.items
    ? JSON.parse(session.metadata.items)
    : [];

  return rawItems.map((item) => {
    const product = products.find((p) => p.id === item.id);
    return {
      id: item.id,
      name: product?.name || "Unknown",
      price: item.price,
      quantity: item.qty,
      image: product?.images?.[0] || "",
    };
  });
}

async function buildOrderData(
  session: Stripe.Checkout.Session,
  status: "completed" | "pending"
): Promise<{ orderData: OrderInsert; items: OrderLineItem[] }> {
  const products = await getAllProducts();
  const items = readSessionItems(session, products);

  // Get user_id from metadata (if user was logged in)
  const userId = session.metadata?.user_id || null;

  // Calculate total (convert from smallest unit)
  const totalAmount = session.amount_total
    ? Math.round(session.amount_total / 100)
    : 0;

  const shippingOption = await resolveShippingOption(session);

  // shipping_details is available on Session but TypeScript types may not expose it
  const sessionWithShipping = session as Stripe.Checkout.Session & {
    shipping_details?: { address?: Record<string, unknown> };
  };
  const shippingAddress = sessionWithShipping.shipping_details?.address as
    | Json
    | undefined;

  // The shop was chosen on /checkout and rode along in session metadata,
  // so a paid pakkeshop order is never missing its destination.
  const pickupPoint =
    shippingOption === "pickup"
      ? pickupPointFromMetadata(session.metadata)
      : null;

  return {
    items,
    orderData: {
      user_id: userId || null,
      stripe_session_id: session.id,
      customer_email: session.customer_details?.email || "",
      items: items as unknown as Json,
      total_amount: totalAmount,
      currency: session.currency?.toUpperCase() || "DKK",
      shipping_address:
        shippingAddress || (session.customer_details?.address as Json) || null,
      billing_address: (session.customer_details?.address as Json) || null,
      shipping_option: shippingOption,
      pickup_point_id: pickupPoint?.number ?? null,
      pickup_point: (pickupPoint as Json) ?? null,
      status,
    },
  };
}

/**
 * Idempotent insert: if a row with this stripe_session_id already exists we
 * treat the delivery as a duplicate and return no order, so Stripe retries and
 * dual endpoints (prod + `stripe listen`) don't produce duplicate orders or
 * duplicate emails.
 */
async function insertOrder(
  supabase: AdminClient,
  orderData: OrderInsert
): Promise<{ order: Order | null; failed: boolean }> {
  const { data, error } = await supabase
    .from("orders")
    .upsert(orderData, {
      onConflict: "stripe_session_id",
      ignoreDuplicates: true,
    })
    .select();

  if (error) {
    console.error("Failed to save order:", {
      sessionId: orderData.stripe_session_id,
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      orderData,
    });
    return { order: null, failed: true };
  }

  if (!data || data.length === 0) {
    console.log("Duplicate webhook delivery — order already saved:", {
      sessionId: orderData.stripe_session_id,
    });
    return { order: null, failed: false };
  }

  return { order: data[0] as Order, failed: false };
}

/**
 * Confirmation email and inventory, run exactly once per order — on whichever
 * delivery first sees the session paid.
 */
async function fulfilPaidOrder(
  supabase: AdminClient,
  order: Order,
  items: OrderLineItem[]
): Promise<boolean> {
  let failed = false;

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

  const oversold: { productId: string; name: string; shortfall: number }[] = [];

  for (const item of items) {
    // Decrement inside Postgres rather than reading stock and writing back an
    // absolute value: the product list is served from a cached query, so a
    // read-modify-write both loses concurrent orders and can resurrect stock
    // that an admin has changed since the cache was filled.
    const { data: stock, error: stockError } = await supabase.rpc(
      "decrement_product_stock",
      { p_product_id: item.id, p_quantity: item.quantity }
    );

    if (stockError) {
      failed = true;
      console.error("Failed to update inventory:", item.id, stockError);
      continue;
    }

    if (stock === null) {
      console.warn("Inventory decrement matched no product:", item.id);
      continue;
    }

    if (stock.shortfall > 0) {
      oversold.push({
        productId: item.id,
        name: item.name,
        shortfall: stock.shortfall,
      });
    } else if (stock.remaining === 0) {
      console.log("Product is now out of stock:", item.id);
    }
  }

  // Nothing reserves stock between session creation and payment, so two buyers
  // can pay for the same last piece. The money is already taken — so accept the
  // order, flag it, and shout. Better found now than at packing time.
  if (oversold.length > 0) {
    console.error("OVERSELL — order takes more stock than exists:", {
      orderId: order.id,
      customerEmail: order.customer_email,
      oversold,
    });

    const { error: flagError } = await supabase
      .from("orders")
      .update({ needs_attention: true, updated_at: new Date().toISOString() })
      .eq("id", order.id);

    if (flagError) {
      failed = true;
      console.error(
        "Failed to flag oversold order for attention:",
        order.id,
        flagError
      );
    }
  }

  // Stock just moved, so drop the cached catalogue. Without this the checkout
  // route keeps validating against the pre-sale figures for up to an hour and
  // happily sells an item that is already gone.
  //
  // `{ expire: 0 }`, not the usual "max": a profile with a stale window would
  // keep serving the pre-sale stock to the next checkout while revalidating in
  // the background, which is the exact bug this is here to close. `updateTag`
  // would be stronger still but is Server-Action-only, and this is a webhook.
  // Tag only — re-rendering every storefront route on each order is not worth
  // it; the pages pick the change up on their own ISR cycle.
  if (items.length > 0) {
    revalidateTag("products", { expire: 0 });
  }

  return failed;
}

/**
 * Books a session Stripe has confirmed as paid. Used by both the synchronous
 * path (`completed` with payment_status "paid") and the delayed one
 * (`async_payment_succeeded`), which can arrive with no row written yet if the
 * `completed` delivery failed.
 */
async function bookPaidSession(
  supabase: AdminClient,
  session: Stripe.Checkout.Session
): Promise<boolean> {
  const { orderData, items } = await buildOrderData(session, "completed");
  const { order, failed } = await insertOrder(supabase, orderData);

  if (failed) return true;
  if (!order) return false;

  console.log("Order saved successfully:", {
    orderId: order.id,
    sessionId: session.id,
  });

  return fulfilPaidOrder(supabase, order, items);
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
        console.log("Webhook received checkout.session.completed:", {
          sessionId: session.id,
          paymentStatus: session.payment_status,
        });

        // Use admin client to bypass RLS
        const supabase = createStandaloneAdminClient();

        if (isPaid(session)) {
          processingFailed = await bookPaidSession(supabase, session);
          break;
        }

        // Money isn't in yet. Record the order so it is visible to the admin
        // and in the customer's history, but hold the confirmation email and
        // the stock decrement until async_payment_succeeded says it settled.
        const { orderData } = await buildOrderData(session, "pending");
        const { order, failed } = await insertOrder(supabase, orderData);
        processingFailed = failed;

        if (order) {
          console.log("Order saved as pending — awaiting payment:", {
            orderId: order.id,
            sessionId: session.id,
            paymentStatus: session.payment_status,
          });
        }
      } catch (error) {
        processingFailed = true;
        console.error("Error processing completed checkout:", error);
      }

      break;
    }

    case "checkout.session.async_payment_succeeded": {
      const session = event.data.object as Stripe.Checkout.Session;

      try {
        const supabase = createStandaloneAdminClient();

        // `neq("status", "completed")` is what makes this idempotent: a repeat
        // delivery promotes nothing, so the email and the stock decrement stay
        // one-shot.
        const { data: promoted, error } = await supabase
          .from("orders")
          .update({
            status: "completed",
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_session_id", session.id)
          .neq("status", "completed")
          .select()
          .maybeSingle();

        if (error) {
          processingFailed = true;
          console.error("Failed to promote pending order:", {
            sessionId: session.id,
            message: error.message,
          });
          break;
        }

        if (promoted) {
          const order = promoted as Order;
          console.log("Pending order settled:", {
            orderId: order.id,
            sessionId: session.id,
          });
          const products = await getAllProducts();
          processingFailed = await fulfilPaidOrder(
            supabase,
            order,
            readSessionItems(session, products)
          );
          break;
        }

        // Nothing was promoted: either this is a duplicate delivery, or the
        // `completed` event never landed a row. Tell the two apart.
        const { data: existing } = await supabase
          .from("orders")
          .select("id")
          .eq("stripe_session_id", session.id)
          .maybeSingle();

        if (existing) {
          console.log(
            "Duplicate async_payment_succeeded — order already completed:",
            { sessionId: session.id }
          );
          break;
        }

        console.warn(
          "async_payment_succeeded with no existing order — booking now:",
          { sessionId: session.id }
        );
        processingFailed = await bookPaidSession(supabase, session);
      } catch (error) {
        processingFailed = true;
        console.error("Error processing async payment success:", error);
      }

      break;
    }

    case "checkout.session.async_payment_failed": {
      const session = event.data.object as Stripe.Checkout.Session;

      try {
        const supabase = createStandaloneAdminClient();

        const { error } = await supabase
          .from("orders")
          .update({ status: "failed", updated_at: new Date().toISOString() })
          .eq("stripe_session_id", session.id)
          .neq("status", "completed");

        if (error) {
          processingFailed = true;
          console.error("Failed to mark order as failed:", {
            sessionId: session.id,
            message: error.message,
          });
          break;
        }

        console.log("Payment failed for session:", session.id);
      } catch (error) {
        processingFailed = true;
        console.error("Error processing async payment failure:", error);
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
        const items = readSessionItems(session, products);
        const userId = session.metadata?.user_id || null;

        const expiredOrderData: OrderInsert = {
          user_id: userId || null,
          stripe_session_id: session.id,
          customer_email: session.customer_details?.email || "unknown",
          items: items as unknown as Json,
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
