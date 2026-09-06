/**
 * Summarise auth users: total, confirmed vs unconfirmed, daily signup rate,
 * top email domains, and Gmail dot-shuffling patterns (bot signal).
 *
 * Usage:
 *   NODE_TLS_REJECT_UNAUTHORIZED=0 npx tsx scripts/user-stats.ts
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

function domainOf(email: string | undefined) {
  if (!email) return "(no-email)";
  const at = email.lastIndexOf("@");
  return at === -1 ? "(malformed)" : email.slice(at + 1).toLowerCase();
}

function isDotShuffledGmail(email: string | undefined) {
  if (!email) return false;
  const at = email.lastIndexOf("@");
  if (at === -1) return false;
  const local = email.slice(0, at);
  const domain = email.slice(at + 1).toLowerCase();
  if (domain !== "gmail.com" && domain !== "googlemail.com") return false;
  // Signal: three or more dots in local part is unusual for real users.
  const dotCount = (local.match(/\./g) ?? []).length;
  return dotCount >= 3;
}

async function main() {
  const users = await fetchAllUsers();
  const total = users.length;

  let confirmed = 0;
  let unconfirmed = 0;
  const byDay = new Map<string, number>();
  const byDomain = new Map<string, number>();
  let dotShuffledGmail = 0;

  const { data: profileRows } = await supabase
    .from("user_profiles")
    .select("id, role");
  const roleById = new Map<string, string>(
    (profileRows ?? []).map((p: { id: string; role: string }) => [p.id, p.role])
  );
  let adminCount = 0;

  for (const u of users) {
    if (u.email_confirmed_at) confirmed += 1;
    else unconfirmed += 1;

    const day = (u.created_at ?? "").slice(0, 10);
    byDay.set(day, (byDay.get(day) ?? 0) + 1);

    const d = domainOf(u.email);
    byDomain.set(d, (byDomain.get(d) ?? 0) + 1);

    if (isDotShuffledGmail(u.email)) dotShuffledGmail += 1;

    if (roleById.get(u.id) === "admin") adminCount += 1;
  }

  console.log(`\n=== USER STATS ===`);
  console.log(`Total users:            ${total}`);
  console.log(`Email confirmed:        ${confirmed}`);
  console.log(`NOT confirmed:          ${unconfirmed}  ← bots rarely confirm`);
  console.log(`Admins (role=admin):    ${adminCount}`);
  console.log(`Dot-shuffled gmail:     ${dotShuffledGmail}  ← strong bot signal`);

  console.log(`\n=== SIGNUPS PER DAY (last 30 days shown) ===`);
  const days = [...byDay.entries()].sort(([a], [b]) => (a < b ? 1 : -1));
  for (const [day, count] of days.slice(0, 30)) {
    const bar = "█".repeat(Math.min(count, 60));
    console.log(`${day}  ${String(count).padStart(4)}  ${bar}`);
  }

  console.log(`\n=== TOP EMAIL DOMAINS (top 20) ===`);
  const domains = [...byDomain.entries()].sort(([, a], [, b]) => b - a);
  for (const [d, count] of domains.slice(0, 20)) {
    console.log(`${String(count).padStart(4)}  ${d}`);
  }

  console.log(``);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
