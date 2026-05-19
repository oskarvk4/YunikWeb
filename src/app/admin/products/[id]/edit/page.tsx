import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ProductForm from "@/components/admin/ProductForm";
import type { DbProduct } from "@/types/supabase";

export const metadata = {
  title: "Rediger Produkt",
};

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: productData, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !productData) {
    notFound();
  }

  const product = productData as DbProduct;

  return (
    <div>
      <div className="mb-8">
        <nav className="text-sm text-dark/60 mb-4">
          <Link href="/admin/products" className="hover:text-accent">
            Produkter
          </Link>
          <span className="mx-2">/</span>
          <span className="text-dark">Rediger</span>
        </nav>
        <h1 className="text-2xl font-serif text-dark">Rediger Produkt</h1>
        <p className="text-dark/60">{product.name}</p>
      </div>

      <Suspense fallback={null}>
        <ProductForm product={product} mode="edit" />
      </Suspense>
    </div>
  );
}
