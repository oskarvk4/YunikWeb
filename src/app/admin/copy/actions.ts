"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { flattenDefaults } from "@/lib/copy";

type Entry = { key: string; value: string };

export async function saveCopy(entries: Entry[]): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Ikke logget ind." };

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if ((profile as { role?: string } | null)?.role !== "admin") {
    return { ok: false, error: "Kun admins kan gemme." };
  }

  const validKeys = new Set(Object.keys(flattenDefaults()));
  const rows = entries
    .filter((e) => validKeys.has(e.key))
    .map((e) => ({ key: e.key, value: e.value, updated_by: user.id }));

  if (rows.length === 0) return { ok: true };

  const { error } = await supabase
    .from("site_copy")
    .upsert(rows, { onConflict: "key" });
  if (error) return { ok: false, error: error.message };

  // Revalidate every storefront route so changes go live immediately.
  revalidatePath("/", "layout");

  return { ok: true };
}

export async function resetCopy(keys: string[]): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Ikke logget ind." };

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if ((profile as { role?: string } | null)?.role !== "admin") {
    return { ok: false, error: "Kun admins kan nulstille." };
  }

  if (keys.length === 0) return { ok: true };

  const { error } = await supabase.from("site_copy").delete().in("key", keys);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/", "layout");
  return { ok: true };
}
