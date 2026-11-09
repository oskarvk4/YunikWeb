import "server-only";

import { redirect } from "next/navigation";
import {
  createClient,
  createStandaloneAdminClient,
} from "@/lib/supabase/server";

/**
 * Client for admin pages that read orders. Orders have no read policy we can rely
 * on for the signed-in admin, and a page's data fetch can't lean on the layout's
 * redirect (pages and layouts render side by side), so this checks the admin itself
 * and then hands back the cookie-free service-role client. createAdminClient()
 * carries the visitor's cookies and so still acts as the user.
 */
export async function getAdminDataClient() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?redirect=/admin");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") redirect("/");

  return createStandaloneAdminClient();
}
