import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { UserProfile, Order } from "@/types/supabase";

export const metadata = {
  title: "Min Konto",
};

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/account");
  }

  const { data: profileData } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: ordersData } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(3);

  const profile = profileData as UserProfile | null;
  const orders = ordersData as Order[] | null;

  return (
    <div className="min-h-screen bg-light pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl md:text-4xl text-dark mb-2">
            Min Konto
          </h1>
          <p className="text-dark/60">
            Velkommen tilbage, {user.email}
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Link
            href="/account/orders"
            className="bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-accent"
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
                <h3 className="font-medium text-dark">Mine Ordrer</h3>
                <p className="text-sm text-dark/60">Se ordrehistorik</p>
              </div>
            </div>
          </Link>

          <Link
            href="/shop"
            className="bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-dark">Shop</h3>
                <p className="text-sm text-dark/60">Udforsk vores kollektion</p>
              </div>
            </div>
          </Link>

          <Link
            href="/contact"
            className="bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-dark">Kontakt</h3>
                <p className="text-sm text-dark/60">Har du spørgsmål?</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Account Info */}
        <div className="bg-white p-6 shadow-sm mb-8">
          <h2 className="font-serif text-xl text-dark mb-4">Kontoinformation</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-dark/60 mb-1">Email</label>
              <p className="text-dark">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm text-dark/60 mb-1">Medlem siden</label>
              <p className="text-dark">
                {profile?.created_at
                  ? new Date(profile.created_at).toLocaleDateString("da-DK", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Ukendt"}
              </p>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl text-dark">Seneste Ordrer</h2>
            <Link
              href="/account/orders"
              className="text-sm text-accent hover:underline"
            >
              Se alle
            </Link>
          </div>

          {orders && orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between py-4 border-b border-dark/10 last:border-0"
                >
                  <div>
                    <p className="font-medium text-dark">
                      Ordre #{order.id.slice(0, 8)}
                    </p>
                    <p className="text-sm text-dark/60">
                      {new Date(order.created_at).toLocaleDateString("da-DK")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-dark">
                      {order.total_amount.toLocaleString("da-DK")} DKK
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
            <div className="text-center py-8">
              <p className="text-dark/60 mb-4">Du har ingen ordrer endnu</p>
              <Link
                href="/shop"
                className="inline-block bg-dark text-white px-6 py-2 text-sm hover:bg-dark/90 transition-colors"
              >
                Start shopping
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
