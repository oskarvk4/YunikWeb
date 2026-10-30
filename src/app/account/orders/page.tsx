import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCopy } from "@/lib/copy";
import { fillText } from "@/lib/copy-text";
import { formatPrice } from "@/types";
import { getCarrierLabel, getTrackingUrl } from "@/constants/carriers";
import {
  getShippingOption,
  readPickupPoint,
} from "@/constants/shipping";
import type { Order } from "@/types/supabase";

export async function generateMetadata(): Promise<Metadata> {
  const copy = (await getCopy()).account;
  return {
    title: copy.metadata.ordersTitle,
  };
}

export default async function OrdersPage() {
  const copy = (await getCopy()).account;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/account/orders");
  }

  const { data } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const orders = data as Order[] | null;

  return (
    <div className="min-h-screen bg-light pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="text-sm text-dark/60 mb-4">
            <Link href="/account" className="hover:text-accent">
              {copy.orders.breadcrumbAccount}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-dark">{copy.orders.headline}</span>
          </nav>
          <h1 className="font-serif text-3xl md:text-4xl text-dark">
            {copy.orders.headline}
          </h1>
        </div>

        {/* Orders List */}
        {orders && orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => {
              const items = order.items as Array<{
                id: string;
                name: string;
                price: number;
                quantity: number;
                image?: string;
              }>;

              const trackingUrl = getTrackingUrl(
                order.carrier,
                order.tracking_number,
                order.tracking_url
              );
              const shippingOption = getShippingOption(order.shipping_option);
              const pickupPoint = readPickupPoint(order.pickup_point);

              return (
                <div key={order.id} className="bg-white shadow-sm overflow-hidden">
                  {/* Order Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b border-dark/10">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex flex-wrap gap-6">
                        <div>
                          <p className="text-xs text-dark/60 uppercase tracking-wide">
                            {copy.orderCard.numberLabel}
                          </p>
                          <p className="font-medium text-dark">
                            #{order.id.slice(0, 8)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-dark/60 uppercase tracking-wide">
                            {copy.orderCard.dateLabel}
                          </p>
                          <p className="font-medium text-dark">
                            {new Date(order.created_at).toLocaleDateString("da-DK", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-dark/60 uppercase tracking-wide">
                            {copy.orderCard.totalLabel}
                          </p>
                          <p className="font-medium text-dark">
                            {formatPrice(order.total_amount)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-block px-3 py-1 text-sm rounded-full ${
                            order.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : order.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {order.status === "completed"
                            ? copy.statuses.completed
                            : order.status === "pending"
                            ? copy.statuses.pending
                            : order.status}
                        </span>
                        {order.fulfillment_status === "shipped" && (
                          <span className="inline-block px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700">
                            {copy.statuses.shipped}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="px-6 py-4">
                    <div className="space-y-4">
                      {items.map((item, index) => (
                        <div
                          key={`${order.id}-${item.id}-${index}`}
                          className="flex items-center gap-4"
                        >
                          <div className="w-16 h-16 bg-gray-100 flex-shrink-0">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-dark truncate">
                              {item.name}
                            </p>
                            <p className="text-sm text-dark/60">
                              {fillText(copy.orderCard.quantity, { quantity: item.quantity })}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-dark">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tracking */}
                  {order.fulfillment_status === "shipped" && (
                    <div className="px-6 py-4 border-t border-dark/10">
                      <p className="text-xs text-dark/60 uppercase tracking-wide mb-2">
                        {copy.orderCard.shipmentLabel}
                      </p>
                      <p className="text-sm text-dark">
                        {order.shipped_at
                          ? fillText(copy.orderCard.shippedWithDate, {
                              carrier: getCarrierLabel(order.carrier),
                              date: new Date(order.shipped_at).toLocaleDateString("da-DK", {
                                day: "numeric",
                                month: "long",
                              }),
                            })
                          : fillText(copy.orderCard.shippedWith, {
                              carrier: getCarrierLabel(order.carrier),
                            })}
                      </p>
                      {order.tracking_number && (
                        <p className="text-sm text-dark/60 font-mono mt-1">
                          {order.tracking_number}
                        </p>
                      )}
                      {trackingUrl && (
                        <a
                          href={trackingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block text-sm text-accent hover:underline mt-2"
                        >
                          {copy.orderCard.trackLink}
                        </a>
                      )}
                    </div>
                  )}

                  {/* Pakkeshop */}
                  {shippingOption.key === "pickup" && pickupPoint && (
                    <div className="px-6 py-4 border-t border-dark/10">
                      <p className="text-xs text-dark/60 uppercase tracking-wide mb-2">
                        {copy.orderCard.pickupLabel}
                      </p>
                      <p className="text-sm text-dark">
                        {pickupPoint.name}
                        {pickupPoint.address && (
                          <>
                            <br />
                            {pickupPoint.address}
                          </>
                        )}
                        {pickupPoint.city && (
                          <>
                            <br />
                            {pickupPoint.zipcode} {pickupPoint.city}
                          </>
                        )}
                      </p>
                    </div>
                  )}

                  {/* Shipping Info */}
                  {shippingOption.key !== "pickup" && order.shipping_address && (
                    <div className="px-6 py-4 border-t border-dark/10">
                      <p className="text-xs text-dark/60 uppercase tracking-wide mb-2">
                        {copy.orderCard.addressLabel}
                      </p>
                      <p className="text-sm text-dark">
                        {(order.shipping_address as { line1?: string; line2?: string; city?: string; postal_code?: string }).line1}
                        {(order.shipping_address as { line2?: string }).line2 && `, ${(order.shipping_address as { line2?: string }).line2}`}
                        <br />
                        {(order.shipping_address as { postal_code?: string }).postal_code} {(order.shipping_address as { city?: string }).city}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white p-12 shadow-sm text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h2 className="font-serif text-xl text-dark mb-2">
              {copy.ordersEmpty.headline}
            </h2>
            <p className="text-dark/60 mb-6">
              {copy.ordersEmpty.body}
            </p>
            <Link
              href="/shop"
              className="inline-block bg-dark text-white px-8 py-3 font-medium hover:bg-dark/90 transition-colors"
            >
              {copy.ordersEmpty.button}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
