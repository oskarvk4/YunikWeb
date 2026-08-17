import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
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

// Cached per request. Returns the full copy tree with any DB overrides
// applied on top of the code defaults.
export const getCopy = cache(async (): Promise<Copy> => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("site_copy").select("key, value");
    if (error || !data) return defaultCopy as Copy;
    const overrides: Record<string, string> = {};
    for (const row of data) overrides[row.key] = row.value;
    return rehydrate(defaultCopy, overrides) as Copy;
  } catch {
    return defaultCopy as Copy;
  }
});

// Flatten the default tree — used by the admin editor to enumerate all keys.
export function flattenDefaults(): Record<string, string> {
  return flatten(defaultCopy as unknown as Record<string, unknown>);
}
