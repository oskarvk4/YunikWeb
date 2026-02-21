"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { DbProduct } from "@/types/supabase";

interface ProductFormProps {
  product?: DbProduct;
  mode: "create" | "edit";
}

const categories = [
  { value: "rings", label: "Ringe" },
  { value: "necklaces", label: "Halskæder" },
  { value: "earrings", label: "Øreringe" },
  { value: "bracelets", label: "Armbånd" },
];

export default function ProductForm({ product, mode }: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    id: product?.id || "",
    slug: product?.slug || "",
    name: product?.name || "",
    price: product?.price || 0,
    category: product?.category || "rings",
    description: product?.description || "",
    materials: product?.materials || "",
    images: product?.images?.join("\n") || "",
    featured: product?.featured || false,
    new_arrival: product?.new_arrival || false,
    stock_quantity: product?.stock_quantity || 100,
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/æ/g, "ae")
      .replace(/ø/g, "oe")
      .replace(/å/g, "aa")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: mode === "create" ? generateSlug(name) : prev.slug,
      id: mode === "create" ? generateSlug(name) : prev.id,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const supabase = createClient();

    const images = formData.images
      .split("\n")
      .map((url) => url.trim())
      .filter(Boolean);

    const productData = {
      id: formData.id,
      slug: formData.slug,
      name: formData.name,
      price: Number(formData.price),
      category: formData.category,
      description: formData.description,
      materials: formData.materials,
      images,
      featured: formData.featured,
      new_arrival: formData.new_arrival,
      stock_quantity: Number(formData.stock_quantity),
      currency: "DKK",
    };

    let result;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabaseAny = supabase as any;

    if (mode === "create") {
      result = await supabaseAny.from("products").insert(productData);
    } else {
      result = await supabaseAny
        .from("products")
        .update(productData)
        .eq("id", product!.id);
    }

    if (result.error) {
      setError(result.error.message);
      setIsLoading(false);
      return;
    }

    router.push("/admin/products");
    router.refresh();
  };

  const handleDelete = async () => {
    if (!confirm("Er du sikker på, at du vil slette dette produkt?")) {
      return;
    }

    setIsLoading(true);
    const supabase = createClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from("products")
      .delete()
      .eq("id", product!.id);

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    router.push("/admin/products");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="font-serif text-lg mb-4">Produkt Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              Navn *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={handleNameChange}
              required
              className="w-full px-4 py-3 border border-dark/20 focus:border-accent focus:outline-none"
              placeholder="Produkt navn"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              Slug
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, slug: e.target.value }))
              }
              className="w-full px-4 py-3 border border-dark/20 focus:border-accent focus:outline-none bg-gray-50"
              placeholder="produkt-slug"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              Pris (DKK) *
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  price: Number(e.target.value),
                }))
              }
              required
              min="0"
              className="w-full px-4 py-3 border border-dark/20 focus:border-accent focus:outline-none"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              Kategori *
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category: e.target.value }))
              }
              className="w-full px-4 py-3 border border-dark/20 focus:border-accent focus:outline-none bg-white"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              Materialer
            </label>
            <input
              type="text"
              value={formData.materials}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, materials: e.target.value }))
              }
              className="w-full px-4 py-3 border border-dark/20 focus:border-accent focus:outline-none"
              placeholder="f.eks. 925 Sterling sølv"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              Lagerbeholdning
            </label>
            <input
              type="number"
              value={formData.stock_quantity}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  stock_quantity: Number(e.target.value),
                }))
              }
              min="0"
              className="w-full px-4 py-3 border border-dark/20 focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-dark mb-2">
            Beskrivelse
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            rows={4}
            className="w-full px-4 py-3 border border-dark/20 focus:border-accent focus:outline-none"
            placeholder="Produkt beskrivelse..."
          />
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-dark mb-2">
            Billede URLs (én per linje)
          </label>
          <textarea
            value={formData.images}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, images: e.target.value }))
            }
            rows={3}
            className="w-full px-4 py-3 border border-dark/20 focus:border-accent focus:outline-none font-mono text-sm"
            placeholder="/ring-1.jpg&#10;/ring-2.jpg"
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-6">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, featured: e.target.checked }))
              }
              className="w-5 h-5 rounded border-dark/20 text-accent focus:ring-accent"
            />
            <span className="text-sm font-medium text-dark">Fremhævet produkt</span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.new_arrival}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  new_arrival: e.target.checked,
                }))
              }
              className="w-5 h-5 rounded border-dark/20 text-accent focus:ring-accent"
            />
            <span className="text-sm font-medium text-dark">Ny ankomst</span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div>
          {mode === "edit" && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isLoading}
              className="px-6 py-3 text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
            >
              Slet produkt
            </button>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-dark/20 hover:border-dark/40 font-medium"
          >
            Annuller
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-dark text-white font-medium hover:bg-dark/90 disabled:opacity-50"
          >
            {isLoading
              ? "Gemmer..."
              : mode === "create"
              ? "Opret produkt"
              : "Gem ændringer"}
          </button>
        </div>
      </div>
    </form>
  );
}
