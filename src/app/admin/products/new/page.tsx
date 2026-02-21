import Link from "next/link";
import ProductForm from "@/components/admin/ProductForm";

export const metadata = {
  title: "Tilføj Produkt",
};

export default function NewProductPage() {
  return (
    <div>
      <div className="mb-8">
        <nav className="text-sm text-dark/60 mb-4">
          <Link href="/admin/products" className="hover:text-accent">
            Produkter
          </Link>
          <span className="mx-2">/</span>
          <span className="text-dark">Tilføj Produkt</span>
        </nav>
        <h1 className="text-2xl font-serif text-dark">Tilføj Produkt</h1>
        <p className="text-dark/60">Opret et nyt produkt til din butik</p>
      </div>

      <ProductForm mode="create" />
    </div>
  );
}
