/**
 * List all auth users and their profile roles
 *
 * Usage:
 *   npx tsx scripts/list-users.ts
 */

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
  const { data: authData, error: authErr } = await supabase.auth.admin.listUsers();
  if (authErr) {
    console.error("listUsers error:", authErr.message);
    process.exit(1);
  }

  const { data: profiles, error: profErr } = await supabase
    .from("user_profiles")
    .select("id, role, created_at");
  if (profErr) {
    console.error("user_profiles error:", profErr.message);
  }

  const roleById = new Map<string, string>(
    (profiles ?? []).map((p: { id: string; role: string }) => [p.id, p.role])
  );

  console.log(`\nFound ${authData.users.length} auth user(s):\n`);
  for (const u of authData.users) {
    const role = roleById.get(u.id) ?? "(no profile row)";
    console.log(`- ${u.email ?? "(no email)"}  id=${u.id}  role=${role}  created=${u.created_at}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
