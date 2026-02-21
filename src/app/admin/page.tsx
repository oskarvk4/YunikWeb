import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import StatsCard from "@/components/admin/StatsCard";
import { formatPrice } from "@/types";
import type { Order, UserProfile, DbProduct } from "@/types/supabase";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch stats
  const [ordersResult, usersResult, productsResult] = await Promise.all([
    supabase.from("orders").select("*").order("created_at", { ascending: false }),
    supabase.from("user_profiles").select("*"),
    supabase.from("products").select("*"),
  ]);

  const orders = (ordersResult.data || []) as Order[];
  const users = (usersResult.data || []) as UserProfile[];
  const products = (productsResult.data || []) as DbProduct[];

  // Calculate stats
  const totalRevenue = orders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + o.total_amount, 0);

  const recentOrders = orders.slice(0, 5);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-dark">Dashboard</h1>
        <p className="text-dark/60">Oversigt over din butik</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Omsætning"
          value={formatPrice(totalRevenue)}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
        <StatsCard
          title="Ordrer"
          value={orders.length}
          subtitle={`${pendingOrders} afventer`}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          }
        />
        <StatsCard
          title="Produkter"
          value={products.length}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          }
        />
        <StatsCard
          title="Brugere"
          value={users.length}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          }
        />
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-dark/10 flex items-center justify-between">
          <h2 className="font-serif text-lg text-dark">Seneste Ordrer</h2>
          <Link
            href="/admin/orders"
            className="text-sm text-accent hover:underline"
          >
            Se alle
          </Link>
        </div>

        {recentOrders.length > 0 ? (
          <div className="divide-y divide-dark/10">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="p-6 flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-accent"
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
                  <div>
                    <p className="font-medium text-dark">
                      Ordre #{order.id.slice(0, 8)}
                    </p>
                    <p className="text-sm text-dark/60">
                      {order.customer_email}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-dark">
                    {formatPrice(order.total_amount)}
                  </p>
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded ${
                      order.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : order.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.status === "completed"
                      ? "Gennemført"
                      : order.status === "pending"
                      ? "Afventer"
                      : order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <p className="text-dark/60">Ingen ordrer endnu</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/products/new"
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow flex items-center space-x-4"
        >
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <div>
            <p className="font-medium text-dark">Tilføj Produkt</p>
            <p className="text-sm text-dark/60">Opret et nyt produkt</p>
          </div>
        </Link>

        <Link
          href="/admin/orders"
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow flex items-center space-x-4"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-blue-600"
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
          <div>
            <p className="font-medium text-dark">Administrer Ordrer</p>
            <p className="text-sm text-dark/60">Se og håndter ordrer</p>
          </div>
        </Link>

        <Link
          href="/admin/users"
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow flex items-center space-x-4"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
          <div>
            <p className="font-medium text-dark">Administrer Brugere</p>
            <p className="text-sm text-dark/60">Se og håndter brugere</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
