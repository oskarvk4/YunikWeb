import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/types";
import type { Order } from "@/types/supabase";

export const metadata = {
  title: "Ordrer",
};

export default async function AdminOrdersPage() {
  const supabase = await createClient();

  const { data: ordersData } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  const orders = ordersData as Order[] | null;

  const statusLabels: Record<string, string> = {
    completed: "Gennemført",
    pending: "Afventer",
    expired: "Udløbet",
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-dark">Ordrer</h1>
        <p className="text-dark/60">Administrer kundeordrer</p>
      </div>

      {orders && orders.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-dark/10">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-medium text-dark/60 uppercase tracking-wider">
                  Ordre
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-dark/60 uppercase tracking-wider">
                  Kunde
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-dark/60 uppercase tracking-wider">
                  Dato
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-dark/60 uppercase tracking-wider">
                  Total
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-dark/60 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right px-6 py-4 text-xs font-medium text-dark/60 uppercase tracking-wider">
                  Handling
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark/10">
              {orders.map((order) => {
                const items = order.items as Array<{
                  name: string;
                  quantity: number;
                }>;
                const itemCount = items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-dark">
                          #{order.id.slice(0, 8)}
                        </p>
                        <p className="text-sm text-dark/60">
                          {itemCount} {itemCount === 1 ? "vare" : "varer"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-dark">{order.customer_email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-dark/80">
                        {new Date(order.created_at).toLocaleDateString("da-DK", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-sm text-dark/60">
                        {new Date(order.created_at).toLocaleTimeString("da-DK", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {formatPrice(order.total_amount)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 text-sm rounded-full ${
                          order.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : order.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {statusLabels[order.status] || order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-accent hover:underline"
                      >
                        Se detaljer
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h2 className="font-serif text-xl text-dark mb-2">
            Ingen ordrer endnu
          </h2>
          <p className="text-dark/60">
            Ordrer vil blive vist her, når kunder foretager køb.
          </p>
        </div>
      )}
    </div>
  );
}
