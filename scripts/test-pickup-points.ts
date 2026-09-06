/**
 * Verify Shipmondo credentials and confirm which carrier codes your account
 * can look up parcel shops for.
 *
 * Usage:
 *   npx tsx scripts/test-pickup-points.ts 5000
 *   npx tsx scripts/test-pickup-points.ts 5000 postnord
 */

import { config } from "dotenv";

config({ path: ".env.local" });

const BASE_URL = "https://app.shipmondo.com/api/public/v3";

const user = process.env.SHIPMONDO_API_USER;
const key = process.env.SHIPMONDO_API_KEY;

if (!user || !key) {
  console.error("Missing SHIPMONDO_API_USER or SHIPMONDO_API_KEY in .env.local");
  process.exit(1);
}

const zipcode = process.argv[2] || "5000";
const carriers = process.argv[3] ? [process.argv[3]] : ["gls", "postnord", "dao", "bring"];

const auth = `Basic ${Buffer.from(`${user}:${key}`).toString("base64")}`;

async function probe(carrierCode: string) {
  const url = new URL(`${BASE_URL}/pickup_points`);
  url.searchParams.set("carrier_code", carrierCode);
  url.searchParams.set("country_code", "DK");
  url.searchParams.set("zipcode", zipcode);

  const response = await fetch(url, {
    headers: { Authorization: auth, Accept: "application/json" },
  });

  if (!response.ok) {
    console.log(
      `✗ ${carrierCode.padEnd(9)} ${response.status} ${response.statusText}`
    );
    return;
  }

  const payload = await response.json();
  const list = Array.isArray(payload) ? payload : payload?.pickup_points ?? [];
  console.log(`✓ ${carrierCode.padEnd(9)} ${list.length} pakkeshops omkring ${zipcode}`);

  if (list.length) {
    console.log("   first result:", JSON.stringify(list[0], null, 2));
  }
}

async function main() {
  for (const carrier of carriers) {
    await probe(carrier);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
