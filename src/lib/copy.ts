import { cache } from "react";
import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import { defaultCopy, type Copy } from "@/content/copy";

// Flatten a nested object to { "a.b.c": value } paths.
function flatten(obj: Record<string, unknown>, prefix = ""): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object") {
      Object.assign(out, flatten(v as Record<string, unknown>, key));
    } else {
      out[key] = String(v);
    }
  }
  return out;
}

// Rebuild a nested object of the same shape as `template`, using values
// from `flatValues` where present and falling back to the template.
function rehydrate<T>(template: T, flatValues: Record<string, string>, prefix = ""): T {
  if (template && typeof template === "object" && !Array.isArray(template)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(template as Record<string, unknown>)) {
      const key = prefix ? `${prefix}.${k}` : k;
      out[k] = rehydrate(v, flatValues, key);
    }
    return out as T;
  }
  return (flatValues[prefix] ?? template) as T;
}

// Site copy is public (anyone may read it) and only changes when an admin
// saves it, so it is read without cookies and cached across requests.
// saveCopy/resetCopy clear the "site_copy" tag. Reading it through the
// cookie-aware client made every page that shows copy, the homepage included,
// render from scratch on each visit.
const getCopyOverrides = unstable_cache(
  async (): Promise<Record<string, string>> => {
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data, error } = await supabase.from("site_copy").select("key, value");
    // Throw rather than return empty, so a failed read is never cached.
    if (error || !data) throw new Error(error?.message ?? "No site copy returned");
    const overrides: Record<string, string> = {};
    for (const row of data) overrides[row.key] = row.value;
    return overrides;
  },
  ["site_copy"],
  { revalidate: 3600, tags: ["site_copy"] }
);

// Returns the full copy tree with any DB overrides applied on top of the code
// defaults. Falls back to the defaults if the database can't be read.
export const getCopy = cache(async (): Promise<Copy> => {
  try {
    return rehydrate(defaultCopy, await getCopyOverrides()) as Copy;
  } catch {
    return defaultCopy as Copy;
  }
});

// Flatten the default tree — used by the admin editor to enumerate all keys.
export function flattenDefaults(): Record<string, string> {
  return flatten(defaultCopy as unknown as Record<string, unknown>);
}
