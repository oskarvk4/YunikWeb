"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleProductPublished(productId: string, currentValue: boolean) {
  const supabase = await createClient();

  // Verify the caller is an admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") throw new Error("Unauthorized");

  const { error } = await supabase
    .from("products")
    .update({ published: !currentValue })
    .eq("id", productId);

  if (error) throw new Error(error.message);

  revalidatePath("/shop");
  revalidatePath("/", "layout");
  revalidatePath("/admin/products");
}
