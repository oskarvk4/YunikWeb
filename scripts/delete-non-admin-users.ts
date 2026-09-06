/**
 * Delete every auth user that is NOT flagged as admin in public.user_profiles.
 * Dry-run by default — pass --confirm to actually delete.
 *
 * Usage:
 *   NODE_TLS_REJECT_UNAUTHORIZED=0 npx tsx scripts/delete-non-admin-users.ts           # dry run
 *   NODE_TLS_REJECT_UNAUTHORIZED=0 npx tsx scripts/delete-non-admin-users.ts --confirm # actually delete
 */

import { config } from "dotenv";
import { createClient, type User } from "@supabase/supabase-js";

config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const CONFIRM = process.argv.includes("--confirm");
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fetchAllUsers() {
  const all: User[] = [];
  const perPage = 200;
  let page = 1;
  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage,
    });
    if (error) throw error;
    if (!data.users.length) break;
    all.push(...data.users);
    if (data.users.length < perPage) break;
    page += 1;
  }
  return all;
}

async function main() {
  const users = await fetchAllUsers();

  const { data: profileRows, error: profErr } = await supabase
    .from("user_profiles")
    .select("id, role");
  if (profErr) {
    console.error("Failed to load user_profiles:", profErr.message);
    process.exit(1);
  }
  const roleById = new Map<string, string>(
    (profileRows ?? []).map((p: { id: string; role: string }) => [p.id, p.role])
  );

  const admins = users.filter((u) => roleById.get(u.id) === "admin");
  const toDelete = users.filter((u) => roleById.get(u.id) !== "admin");

  console.log(`\nTotal users:  ${users.length}`);
  console.log(`Admins kept:  ${admins.length}`);
  for (const a of admins) console.log(`  - ${a.email}  (id=${a.id})`);
  console.log(`To delete:    ${toDelete.length}`);

  if (!CONFIRM) {
    console.log(`\nDRY RUN. No changes made.`);
    console.log(`Re-run with --confirm to delete ${toDelete.length} users.`);
    return;
  }

  console.log(`\n--confirm passed. Deleting ${toDelete.length} users...\n`);

  let deleted = 0;
  let failed = 0;
  for (const u of toDelete) {
    // Delete profile row first (FK to auth.users may or may not cascade).
    const { error: pErr } = await supabase
      .from("user_profiles")
      .delete()
      .eq("id", u.id);
    if (pErr && !pErr.message.includes("No rows")) {
      console.error(`profile delete failed for ${u.email}: ${pErr.message}`);
    }

    const { error: aErr } = await supabase.auth.admin.deleteUser(u.id);
    if (aErr) {
      failed += 1;
      console.error(`auth delete failed for ${u.email}: ${aErr.message}`);
    } else {
      deleted += 1;
      if (deleted % 25 === 0) {
        console.log(`  deleted ${deleted}/${toDelete.length}...`);
      }
    }
  }

  console.log(`\nDone. Deleted: ${deleted}. Failed: ${failed}.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
