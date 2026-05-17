import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/Sidebar";
import type { UserProfile } from "@/types/supabase";

export const metadata = {
  title: {
    default: "Admin",
    template: "%s | Yunik Admin",
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/admin");
  }

  // Check if user is admin
  const { data: profileData } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const profile = profileData as Pick<UserProfile, "role"> | null;

  if (profile?.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 lg:ml-0">
        {/* Mobile header */}
        <div className="lg:hidden bg-dark text-white">
          <div className="p-4 flex items-center justify-between">
            <div>
              <h1 className="font-serif text-xl font-light tracking-[0.2em]">
                YUNIK
              </h1>
              <p className="text-white/60 text-xs">Admin Panel</p>
            </div>
            <a href="/" className="text-white/60 hover:text-white text-sm">
              Tilbage til butik
            </a>
          </div>
          {/* Mobile navigation */}
          <div className="px-4 pb-4 flex flex-wrap gap-2">
            <a
              href="/admin"
              className="px-3 py-2 bg-white/10 rounded text-sm hover:bg-white/20"
            >
              Dashboard
            </a>
            <a
              href="/admin/products"
              className="px-3 py-2 bg-white/10 rounded text-sm hover:bg-white/20"
            >
              Produkter
            </a>
            <a
              href="/admin/orders"
              className="px-3 py-2 bg-white/10 rounded text-sm hover:bg-white/20"
            >
              Ordrer
            </a>
            <a
              href="/admin/products/new"
              className="px-3 py-2 bg-accent rounded text-sm font-medium hover:bg-accent/90"
            >
              + Nyt Produkt
            </a>
          </div>
        </div>
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
