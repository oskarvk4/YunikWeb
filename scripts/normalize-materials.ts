/**
 * Rewrite every product's materials text so it matches the actual product line:
 * all pieces are 925 sterling silver, and "gold" pieces are that same silver
 * with a 3 micron 24 karat plating. Legacy wording (18k gold plated, vermeil,
 * brass, rhodium) is replaced; any non-metal detail in the first sentence is
 * kept as its own short sentence.
 *
 * Usage:
 *   NODE_TLS_REJECT_UNAUTHORIZED=0 npx tsx scripts/normalize-materials.ts          # dry run
 *   NODE_TLS_REJECT_UNAUTHORIZED=0 npx tsx scripts/normalize-materials.ts --apply  # writes
 */

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { defaultMaterials } from "../src/constants/materials";

config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const apply = process.argv.includes("--apply");

type Row = {
  id: string;
  name: string;
  metal: "gold" | "silver";
  materials: string | null;
};

/**
 * Leading metal claim: an optional karat + plating word, a base metal, and an
 * optional plating tail ("med rhodiumbelægning for langvarig glans").
 */
const METAL_PHRASE =
  /^(?:925\s+)?(?:\d{1,2}\s*karat\s+)?(?:guldbelagt\s+|guld\s*vermeil\s+(?:over\s+)?|forgyldt\s+)?(?:sterlingsølv|sterling\s*sølv|sølv|messing)(?:\s+med\s+(?:\d{1,2}\s*karat\s+)?(?:rhodium|guld|sølv|forgyld)[^,.]*)?/i;

/** Words that mean the text is making a gold claim. */
const GOLD_CLAIM = /(guldbelagt|vermeil|forgyldt|guldbelægning)/i;

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=\.)\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function toSentence(fragment: string): string {
  const cleaned = fragment.trim().replace(/^med\s+/i, "").replace(/[.\s]+$/, "").trim();
  if (!cleaned) return "";
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1) + ".";
}

function normalize(materials: string | null, metal: "gold" | "silver"): string {
  const standard = defaultMaterials(metal);
  const text = (materials ?? "").trim();
  if (!text) return standard;

  const sentences = splitSentences(text);
  const first = sentences[0] ?? "";
  const rest = sentences.slice(1);

  const match = first.match(METAL_PHRASE);
  if (!match) {
    // No recognisable metal claim — prepend the standard sentence, keep the text.
    return [standard, ...sentences].join(" ");
  }

  const qualifier = toSentence(first.slice(match[0].length));
  return [standard, qualifier, ...rest].filter(Boolean).join(" ");
}

async function main() {
  const { data, error } = await supabase
    .from("products")
    .select("id, name, metal, materials")
    .order("name");

  if (error) {
    console.error("Could not read products:", error.message);
    process.exit(1);
  }

  const rows = (data ?? []) as Row[];
  const changes: { row: Row; next: string }[] = [];

  for (const row of rows) {
    const next = normalize(row.materials, row.metal);
    const current = (row.materials ?? "").trim();

    const textClaimsGold = GOLD_CLAIM.test(current);
    if (current && textClaimsGold !== (row.metal === "gold")) {
      console.warn(
        `⚠  ${row.name}: metal="${row.metal}" but text ${
          textClaimsGold ? "claims gold" : "makes no gold claim"
        } — the metal column wins.`
      );
    }
    if (/messing/i.test(current)) {
      console.warn(`⚠  ${row.name}: text said messing (brass) — rewritten to 925 sterlingsølv.`);
    }
    if (/rhodium/i.test(current)) {
      console.warn(`⚠  ${row.name}: rhodium plating claim dropped.`);
    }

    if (next !== current) changes.push({ row, next });
  }

  console.log(`\n${rows.length} products, ${changes.length} need rewriting.\n`);

  for (const { row, next } of changes) {
    console.log(`${row.name}  [${row.metal}]`);
    console.log(`  −  ${row.materials ?? "(tom)"}`);
    console.log(`  +  ${next}\n`);
  }

  if (!apply) {
    console.log("Dry run — rerun with --apply to write these changes.");
    return;
  }

  let written = 0;
  for (const { row, next } of changes) {
    const { error: updateError } = await supabase
      .from("products")
      .update({ materials: next })
      .eq("id", row.id);

    if (updateError) {
      console.error(`✗ ${row.name}: ${updateError.message}`);
      continue;
    }
    written += 1;
  }

  console.log(`\nUpdated ${written}/${changes.length} products.`);
  console.log("Remember to revalidate the storefront cache (any admin product save does it).");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
