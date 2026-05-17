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

const product = {
  slug: "product",
  name: "Product",
  price: 100,
  currency: "DKK",
  category: "rings",
  description: "Test product for end-to-end checkout flow",
  materials: "Test material",
  images: ["/hero-rings.jpg"],
  featured: true,
  new_arrival: true,
  stock_quantity: 99,
};

async function main() {
  const { data, error } = await supabase
    .from("products")
    .upsert(product, { onConflict: "slug" })
    .select();

  if (error) {
    console.error("Insert failed:", error);
    process.exit(1);
  }

  console.log("Inserted:", data);
}

main();
