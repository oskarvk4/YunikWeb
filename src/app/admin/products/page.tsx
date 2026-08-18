import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/types";
import type { DbProduct } from "@/types/supabase";
import ProductPublishToggle from "@/components/admin/ProductPublishToggle";

export const metadata = {
  title: "Produkter",
};

interface AdminProductsPageProps {
  searchParams: Promise<{ deleted?: string }>;
}

const categoryLabel: Record<string, string> = {
  rings: "Ringe",
  necklaces: "Halskæder",
  earrings: "Øreringe",
  bracelets: "Armbånd",
};

function stockBadge(qty: number) {
  if (qty === 0) {
    return {
      label: "Udsolgt",
      cls: "bg-red-100 text-red-700 border-red-200",
      dot: "bg-red-500",
    };
  }
  if (qty <= 5) {
    return {
      label: `Lavt (${qty})`,
      cls: "bg-yellow-100 text-yellow-800 border-yellow-200",
      dot: "bg-yellow-500",
    };
  }
  return {
    label: `${qty} på lager`,
    cls: "bg-green-100 text-green-700 border-green-200",
    dot: "bg-green-500",
  };
}

export default async function AdminProductsPage({
  searchParams,
}: AdminProductsPageProps) {
  const params = await searchParams;
  const supabase = await createClient();

  const { data: productsData } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  const products = productsData as DbProduct[] | null;

  const total = products?.length ?? 0;
  const offline = products?.filter((p) => !(p.published ?? true)).length ?? 0;
  const outOfStock = products?.filter((p) => p.stock_quantity === 0).length ?? 0;
  const lowStock =
    products?.filter((p) => p.stock_quantity > 0 && p.stock_quantity <= 5)
      .length ?? 0;
  const featured = products?.filter((p) => p.featured).length ?? 0;

  return (
    <div>
      {params.deleted && (
        <div className="mb-6 flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="font-medium">Produkt slettet</span>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-serif text-dark">Produkter</h1>
          <p className="text-dark/60">Administrer dine produkter</p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-dark text-white px-6 py-3 font-medium hover:bg-dark/90 transition-colors flex items-center gap-2 rounded"
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
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <span>Tilføj produkt</span>
        </Link>
      </div>

      {total > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-dark/60 uppercase tracking-wide">
                I alt
              </p>
              <p className="text-2xl font-serif text-dark mt-1">{total}</p>
            </div>
            <div className="w-10 h-10 bg-accent/10 text-accent rounded-full flex items-center justify-center">
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
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-dark/60 uppercase tracking-wide">
                Udsolgt
              </p>
              <p className="text-2xl font-serif text-red-600 mt-1">
                {outOfStock}
              </p>
            </div>
            <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
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
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
                />
              </svg>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-dark/60 uppercase tracking-wide">
                Lavt lager
              </p>
              <p className="text-2xl font-serif text-yellow-600 mt-1">
                {lowStock}
              </p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center">
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
                  d="M12 9v2m0 4h.01M5.07 19h13.86a2 2 0 001.74-2.99l-6.93-12a2 2 0 00-3.48 0l-6.93 12A2 2 0 005.07 19z"
                />
              </svg>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-dark/60 uppercase tracking-wide">
                Offline
              </p>
              <p className="text-2xl font-serif text-gray-400 mt-1">{offline}</p>
            </div>
            <div className="w-10 h-10 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center">
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
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
            </div>
          </div>
        </div>
      )}

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
                <th className="text-left px-6 py-4 text-xs font-medium text-dark/60 uppercase tracking-wider">
                  Synlighed
                </th>
                <th className="text-right px-6 py-4 text-xs font-medium text-dark/60 uppercase tracking-wider">
                  Handling
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark/10">
              {products.map((product) => {
                const sb = stockBadge(product.stock_quantity);
                return (
                  <tr key={product.id} className={`hover:bg-gray-50 transition-colors ${!(product.published ?? true) ? "opacity-50" : ""}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0 overflow-hidden flex items-center justify-center">
                          {product.images?.[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <svg
                              className="w-5 h-5 text-dark/30"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-dark truncate">
                            {product.name}
                          </p>
                          <p className="text-sm text-dark/60 font-mono truncate">
                            {product.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize text-dark/80">
                        {categoryLabel[product.category] ?? product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-dark">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${sb.cls}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${sb.dot}`}
                        />
                        {sb.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {product.featured && (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent/10 text-accent text-xs rounded"
                            title="Fremhævet"
                          >
                            <svg
                              className="w-3 h-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            Fremhævet
                          </span>
                        )}
                        {product.new_arrival && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                            Ny
                          </span>
                        )}
                        {!product.featured && !product.new_arrival && (
                          <span className="text-xs text-dark/30">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <ProductPublishToggle
                        productId={product.id}
                        published={product.published ?? true}
                      />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <a
                          href={`/product/${product.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-dark/60 hover:text-accent hover:bg-accent/5 rounded transition-colors"
                          title="Vis i butik"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-dark/20 text-dark text-sm font-medium rounded hover:bg-dark hover:text-white hover:border-dark transition-colors"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Rediger
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
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
            className="inline-block bg-dark text-white px-6 py-3 font-medium hover:bg-dark/90 transition-colors rounded"
          >
            Tilføj produkt
          </Link>
        </div>
      )}
    </div>
  );
}
