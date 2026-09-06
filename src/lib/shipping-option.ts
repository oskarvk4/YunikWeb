import "server-only";

import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import {
  normaliseShippingOption,
  type ShippingOptionKey,
} from "@/constants/shipping";

/**
 * Two of the three delivery options are free, so `amount_total` alone can't
 * tell them apart — the choice is carried in metadata instead.
 */
export async function resolveShippingOption(
  session: Stripe.Checkout.Session
): Promise<ShippingOptionKey> {
  // Sessions created by /api/checkout carry the choice directly — no extra
  // API call needed. The rate lookups below only cover in-flight sessions
  // created before this key existed.
  if (session.metadata?.shipping_option) {
    return normaliseShippingOption(session.metadata.shipping_option);
  }

  const rate = session.shipping_cost?.shipping_rate;

  if (rate && typeof rate !== "string" && rate.metadata?.option) {
    return normaliseShippingOption(rate.metadata.option);
  }

  if (typeof rate === "string") {
    try {
      const shippingRate = await stripe.shippingRates.retrieve(rate);
      if (shippingRate.metadata?.option) {
        return normaliseShippingOption(shippingRate.metadata.option);
      }
    } catch (error) {
      console.error("Could not resolve shipping rate", rate, error);
    }
  }

  // Sessions created before the metadata existed: paid == express.
  return session.shipping_cost?.amount_total ? "express" : "home";
}
