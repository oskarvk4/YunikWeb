import "server-only";

import { Resend } from "resend";
import OrderConfirmation, {
  type OrderEmailAddress,
  type OrderEmailItem,
} from "@/emails/OrderConfirmation";
import type { Order } from "@/types/supabase";

let resendInstance: Resend | null = null;

function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!resendInstance) {
    resendInstance = new Resend(apiKey);
  }
  return resendInstance;
}

function getFromAddress(): string {
  return process.env.EMAIL_FROM || "Yunik <kontakt@yunik.dk>";
}

function getReplyTo(): string | undefined {
  return process.env.REPLY_TO_EMAIL || undefined;
}

function getContactEmail(): string {
  return (
    process.env.REPLY_TO_EMAIL ||
    process.env.CONTACT_EMAIL ||
    "YunikJewelry@outlook.com"
  );
}

interface SendResult {
  success: boolean;
  id?: string;
  error?: string;
}

export async function sendOrderConfirmationEmail(
  order: Order
): Promise<SendResult> {
  const resend = getResend();
  if (!resend) {
    console.warn(
      "RESEND_API_KEY not configured — skipping order confirmation email"
    );
    return { success: false, error: "RESEND_API_KEY not configured" };
  }

  if (!order.customer_email) {
    return { success: false, error: "Order has no customer_email" };
  }

  const items = (order.items as unknown as OrderEmailItem[]) ?? [];
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingCost = Math.max(0, order.total_amount - subtotal);
  const shippingAddress =
    (order.shipping_address as unknown as OrderEmailAddress | null) ?? null;
  const customerName = shippingAddress?.name ?? null;
  const shortId = order.id.slice(0, 8).toUpperCase();

  const replyTo = getReplyTo();
  const contactEmail = getContactEmail();

  try {
    const result = await resend.emails.send({
      from: getFromAddress(),
      to: order.customer_email,
      ...(replyTo ? { replyTo } : {}),
      subject: `Tak for din ordre hos Yunik — ${shortId}`,
      react: OrderConfirmation({
        orderId: order.id,
        customerEmail: order.customer_email,
        customerName,
        items,
        subtotal,
        shippingCost,
        total: order.total_amount,
        currency: order.currency || "DKK",
        shippingAddress,
        shippingOption: order.shipping_option || "free",
        contactEmail,
      }),
    });

    if (result.error) {
      console.error("Resend send error:", result.error);
      return { success: false, error: result.error.message };
    }

    return { success: true, id: result.data?.id };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("sendOrderConfirmationEmail failed:", message);
    return { success: false, error: message };
  }
}
