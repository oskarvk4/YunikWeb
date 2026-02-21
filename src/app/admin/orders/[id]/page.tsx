import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/types";
import type { Order } from "@/types/supabase";

export const metadata = {
  title: "Ordre Detaljer",
};

interface OrderDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: orderData, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !orderData) {
    notFound();
  }

  const order = orderData as Order;

  const items = order.items as Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;

  const shippingAddress = order.shipping_address as {
    line1?: string;
    line2?: string;
    city?: string;
    postal_code?: string;
    country?: string;
  } | null;

  const statusLabels: Record<string, string> = {
    completed: "Gennemført",
    pending: "Afventer",
    expired: "Udløbet",
  };

  return (
    <div>
      <div className="mb-8">
        <nav className="text-sm text-dark/60 mb-4">
          <Link href="/admin/orders" className="hover:text-accent">
            Ordrer
          </Link>
          <span className="mx-2">/</span>
          <span className="text-dark">#{order.id.slice(0, 8)}</span>
        </nav>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif text-dark">
              Ordre #{order.id.slice(0, 8)}
            </h1>
            <p className="text-dark/60">
              {new Date(order.created_at).toLocaleDateString("da-DK", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <span
            className={`inline-block px-4 py-2 text-sm rounded-full ${
              order.status === "completed"
                ? "bg-green-100 text-green-700"
                : order.status === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {statusLabels[order.status] || order.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-dark/10">
              <h2 className="font-serif text-lg">Ordrelinjer</h2>
            </div>
            <div className="divide-y divide-dark/10">
              {items.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="px-6 py-4 flex items-center gap-4"
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
                    <p className="font-medium text-dark">{item.name}</p>
                    <p className="text-sm text-dark/60">
                      {formatPrice(item.price)} x {item.quantity}
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
            <div className="px-6 py-4 border-t border-dark/10 bg-gray-50">
              <div className="flex justify-between items-center">
                <span className="font-medium text-dark">Total</span>
                <span className="text-xl font-serif text-dark">
                  {formatPrice(order.total_amount)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="font-serif text-lg mb-4">Kunde</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-dark/60">Email</p>
                <p className="text-dark">{order.customer_email}</p>
              </div>
              {order.user_id && (
                <div>
                  <p className="text-sm text-dark/60">Bruger ID</p>
                  <p className="text-dark text-sm font-mono">
                    {order.user_id.slice(0, 8)}...
                  </p>
                </div>
              )}
            </div>
          </div>

          {shippingAddress && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="font-serif text-lg mb-4">Leveringsadresse</h2>
              <div className="text-dark">
                <p>{shippingAddress.line1}</p>
                {shippingAddress.line2 && <p>{shippingAddress.line2}</p>}
                <p>
                  {shippingAddress.postal_code} {shippingAddress.city}
                </p>
                <p>{shippingAddress.country}</p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="font-serif text-lg mb-4">Forsendelse</h2>
            <p className="text-dark capitalize">
              {order.shipping_option === "free"
                ? "Gratis fragt (2-5 hverdage)"
                : order.shipping_option === "express"
                ? "Express (1-2 hverdage)"
                : order.shipping_option || "Standard"}
            </p>
          </div>

          {order.stripe_session_id && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="font-serif text-lg mb-4">Betaling</h2>
              <div className="space-y-2">
                <p className="text-sm text-dark/60">Stripe Session ID</p>
                <p className="text-dark text-xs font-mono break-all">
                  {order.stripe_session_id}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
