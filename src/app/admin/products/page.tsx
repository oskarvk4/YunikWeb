import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/types";
import type { DbProduct } from "@/types/supabase";

export const metadata = {
  title: "Produkter",
};

export default async function AdminProductsPage() {
  const supabase = await createClient();

  const { data: productsData } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  const products = productsData as DbProduct[] | null;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif text-dark">Produkter</h1>
          <p className="text-dark/60">Administrer dine produkter</p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-dark text-white px-6 py-3 font-medium hover:bg-dark/90 transition-colors flex items-center space-x-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <span>Tilføj produkt</span>
        </Link>
      </div>

      {products && products.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-dark/10">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-medium text-dark/60 uppercase tracking-wider">
                  Produkt
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-dark/60 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-dark/60 uppercase tracking-wider">
                  Pris
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-dark/60 uppercase tracking-wider">
                  Lager
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-dark/60 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right px-6 py-4 text-xs font-medium text-dark/60 uppercase tracking-wider">
                  Handling
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark/10">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 flex-shrink-0">
                        {product.images?.[0] && (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-dark">{product.name}</p>
                        <p className="text-sm text-dark/60">{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="capitalize text-dark/80">
                      {product.category === "rings"
                        ? "Ringe"
                        : product.category === "necklaces"
                        ? "Halskæder"
                        : product.category === "earrings"
                        ? "Øreringe"
                        : "Armbånd"}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`${
                        product.stock_quantity > 10
                          ? "text-green-600"
                          : product.stock_quantity > 0
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {product.stock_quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {product.featured && (
                        <span className="px-2 py-1 bg-accent/10 text-accent text-xs rounded">
                          Fremhævet
                        </span>
                      )}
                      {product.new_arrival && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                          Ny
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="text-accent hover:underline"
                    >
                      Rediger
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-accent"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <h2 className="font-serif text-xl text-dark mb-2">
            Ingen produkter endnu
          </h2>
          <p className="text-dark/60 mb-6">
            Kom i gang ved at tilføje dit første produkt.
          </p>
          <Link
            href="/admin/products/new"
            className="inline-block bg-dark text-white px-6 py-3 font-medium hover:bg-dark/90 transition-colors"
          >
            Tilføj produkt
          </Link>
        </div>
      )}
    </div>
  );
}
