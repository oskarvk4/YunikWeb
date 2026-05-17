/**
 * Seed script to insert products from products.json into Supabase
 *
 * Usage:
 *   npx tsx scripts/seed-products.ts
 */

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import productsData from "../src/data/products.json";

// Load environment variables from .env.local
config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing environment variables:");
  console.error("  - NEXT_PUBLIC_SUPABASE_URL");
  console.error("  - SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedProducts() {
  console.log("Starting product seed...\n");

  // Don't include 'id' - let Supabase generate UUIDs automatically
  const products = productsData.products.map((p) => ({
    slug: p.slug,
    name: p.name,
    price: p.price,
    currency: "DKK",
    category: p.category,
    description: p.description,
    materials: p.materials,
    images: p.images,
    featured: p.featured,
    new_arrival: p.newArrival,
    stock_quantity: 10, // Default stock
  }));

  console.log(`Found ${products.length} products to seed.\n`);

  // Insert products one by one to handle duplicates gracefully
  for (const product of products) {
    const { error } = await supabase
      .from("products")
      .upsert(product, { onConflict: "slug" });

    if (error) {
      console.error(`❌ Failed to insert "${product.name}":`, error.message);
    } else {
      console.log(`✓ Inserted: ${product.name}`);
    }
  }

  console.log("\n✅ Seed complete!");
}

seedProducts().catch(console.error);
