"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { sendShippingConfirmationEmail } from "@/lib/email/transactional";
import { isCarrierKey } from "@/constants/carriers";
import type { Order } from "@/types/supabase";

export interface FulfillmentResult {
  ok: boolean;
  error?: string;
  emailSent?: boolean;
  emailError?: string;
}

export interface ShipOrderInput {
  carrier: string;
  trackingNumber: string;
  trackingUrl?: string;
  notify: boolean;
}

async function isAdmin(): Promise<boolean> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return profile?.role === "admin";
}

function revalidateOrder(orderId: string) {
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
  revalidatePath("/account/orders");
}

export async function markOrderShipped(
  orderId: string,
  input: ShipOrderInput
): Promise<FulfillmentResult> {
  if (!(await isAdmin())) return { ok: false, error: "Unauthorized" };

  const carrier = input.carrier.trim();
  if (!isCarrierKey(carrier)) {
    return { ok: false, error: "Vælg en fragtfører." };
  }

  const trackingNumber = input.trackingNumber.trim();
  const trackingUrl = input.trackingUrl?.trim() || null;

  // "Anden fragtfører" has no number format we can build a link from, so a
  // pasted link is the only way to give the customer something to click.
  if (carrier !== "other" && !trackingNumber) {
    return { ok: false, error: "Indtast et tracking-nummer." };
  }
  if (trackingUrl && !/^https?:\/\//i.test(trackingUrl)) {
    return {
      ok: false,
      error: "Tracking-link skal starte med http:// eller https://",
    };
  }

  // Service role: the admin identity is verified above, and orders are not
  // writable under the anon-key RLS policies.
  const admin = await createAdminClient();

  const { data, error } = await admin
    .from("orders")
    .update({
      fulfillment_status: "shipped",
      carrier,
      tracking_number: trackingNumber || null,
      tracking_url: trackingUrl,
      shipped_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .select("*")
    .single();

  if (error) return { ok: false, error: error.message };

  revalidateOrder(orderId);

  if (!input.notify) return { ok: true, emailSent: false };

  // The order is shipped either way — a bounced email must not undo that.
  const email = await sendShippingConfirmationEmail(data as Order);
  return {
    ok: true,
    emailSent: email.success,
    emailError: email.success ? undefined : email.error,
  };
}

export async function resendShippingEmail(
  orderId: string
): Promise<FulfillmentResult> {
  if (!(await isAdmin())) return { ok: false, error: "Unauthorized" };

  const admin = await createAdminClient();
  const { data, error } = await admin
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (error || !data) {
    return { ok: false, error: error?.message || "Ordren blev ikke fundet." };
  }

  const order = data as Order;
  if (order.fulfillment_status !== "shipped") {
    return { ok: false, error: "Ordren er ikke markeret som afsendt." };
  }

  const email = await sendShippingConfirmationEmail(order);
  return {
    ok: email.success,
    emailSent: email.success,
    error: email.success ? undefined : email.error,
  };
}

export async function markOrderUnfulfilled(
  orderId: string
): Promise<FulfillmentResult> {
  if (!(await isAdmin())) return { ok: false, error: "Unauthorized" };

  const admin = await createAdminClient();
  const { error } = await admin
    .from("orders")
    .update({
      fulfillment_status: "unfulfilled",
      carrier: null,
      tracking_number: null,
      tracking_url: null,
      shipped_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  if (error) return { ok: false, error: error.message };

  revalidateOrder(orderId);
  return { ok: true };
}
