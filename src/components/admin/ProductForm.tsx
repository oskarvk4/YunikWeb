"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { revalidateProducts } from "@/lib/revalidate";
import type { DbProduct, Database } from "@/types/supabase";
import ImageUploader from "./ImageUploader";

type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];
type ProductUpdate = Database["public"]["Tables"]["products"]["Update"];

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

type FormState = {
  id: string;
  slug: string;
  name: string;
  price: number;
  category: string;
  metal: "gold" | "silver";
  description: string;
  materials: string;
  images: string[];
  featured: boolean;
  new_arrival: boolean;
  one_of_one: boolean;
  stock_quantity: number;
};

function buildInitialState(product?: DbProduct): FormState {
  return {
    id: product?.id || "",
    slug: product?.slug || "",
    name: product?.name || "",
    price: product?.price ?? 0,
    category: product?.category || "rings",
    metal: product?.metal || "silver",
    description: product?.description || "",
    materials: product?.materials || "",
    images: product?.images || [],
    featured: product?.featured ?? false,
    new_arrival: product?.new_arrival ?? false,
    one_of_one: product?.one_of_one ?? false,
    stock_quantity: product?.stock_quantity ?? 100,
  };
}

function humanizeError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("row-level security") || m.includes("rls")) {
    return "Du har ikke rettigheder til at gemme. Tjek at din bruger er admin og at RLS-politikkerne for 'products' er sat op.";
  }
  if (m.includes("duplicate key") || m.includes("unique")) {
    return "Et produkt med samme ID eller slug findes allerede. Vælg et andet navn.";
  }
  if (m.includes("permission denied")) {
    return "Adgang nægtet i databasen. Tjek RLS-politikker for 'products'-tabellen.";
  }
  if (m.includes("bucket not found")) {
    return "Storage-bucket 'product-images' findes ikke. Opret den i Supabase Dashboard først.";
  }
  if (m.includes("failed to fetch") || m.includes("network")) {
    return "Netværksfejl — kunne ikke nå serveren. Tjek din forbindelse og prøv igen.";
  }
  return message;
}

export default function ProductForm({ product, mode }: ProductFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initial = useMemo(() => buildInitialState(product), [product]);

  const [formData, setFormData] = useState<FormState>(initial);
  const [savedSnapshot, setSavedSnapshot] = useState<FormState>(initial);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(
    mode === "edit" && searchParams.get("saved") === "created"
      ? "Produkt oprettet"
      : null
  );

  const isDirty = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(savedSnapshot);
  }, [formData, savedSnapshot]);

  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(null), 3500);
    return () => clearTimeout(t);
  }, [success]);

  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .replace(/æ/g, "ae")
      .replace(/ø/g, "oe")
      .replace(/å/g, "aa")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: mode === "create" ? generateSlug(name) : prev.slug,
      id: mode === "create" ? generateSlug(name) : prev.id,
    }));
  };

  const validate = (): string | null => {
    if (!formData.name.trim()) return "Navn er påkrævet.";
    if (!formData.slug.trim()) return "Slug er påkrævet.";
    if (formData.price < 0) return "Pris kan ikke være negativ.";
    if (formData.stock_quantity < 0)
      return "Lagerbeholdning kan ikke være negativ.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    const supabase = createClient();

    if (mode === "create") {
      const insertData: ProductInsert = {
        slug: formData.slug,
        name: formData.name,
        price: Number(formData.price),
        category: formData.category,
        metal: formData.metal,
        description: formData.description,
        materials: formData.materials,
        images: formData.images,
        featured: formData.featured,
        new_arrival: formData.new_arrival,
        one_of_one: formData.one_of_one,
        stock_quantity: Number(formData.stock_quantity),
        currency: "DKK",
      };
      const { data: inserted, error: insertError } = await supabase
        .from("products")
        .insert(insertData)
        .select("id")
        .single();

      if (insertError || !inserted) {
        setError(humanizeError(insertError?.message ?? "Kunne ikke oprette produkt."));
        setIsLoading(false);
        return;
      }

      await revalidateProducts();
      setSavedSnapshot({ ...formData, id: inserted.id });
      router.push(`/admin/products/${inserted.id}/edit?saved=created`);
      router.refresh();
      return;
    }

    const updateData: ProductUpdate = {
      slug: formData.slug,
      name: formData.name,
      price: Number(formData.price),
      category: formData.category,
      metal: formData.metal,
      description: formData.description,
      materials: formData.materials,
      images: formData.images,
      featured: formData.featured,
      new_arrival: formData.new_arrival,
      one_of_one: formData.one_of_one,
      stock_quantity: Number(formData.stock_quantity),
    };
    const { error: updateError } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", product!.id);

    if (updateError) {
      setError(humanizeError(updateError.message));
      setIsLoading(false);
      return;
    }

    await revalidateProducts();
    setSavedSnapshot(formData);
    setSuccess("Ændringer gemt");
    setIsLoading(false);
    router.refresh();
  };

  const handleDelete = async () => {
    if (
      !confirm(
        `Er du sikker på, at du vil slette "${product?.name}"? Dette kan ikke fortrydes.`
      )
    ) {
      return;
    }

    setIsDeleting(true);
    setError(null);
    const supabase = createClient();

    const { error: deleteError } = await supabase
      .from("products")
      .delete()
      .eq("id", product!.id);

    if (deleteError) {
      setError(humanizeError(deleteError.message));
      setIsDeleting(false);
      return;
    }

    await revalidateProducts();
    setSavedSnapshot(formData);
    router.push("/admin/products?deleted=1");
    router.refresh();
  };

  useEffect(() => {
    if (!searchParams.get("saved")) return;
    const url = new URL(window.location.href);
    url.searchParams.delete("saved");
    window.history.replaceState({}, "", url.toString());
  }, [searchParams]);

  const stockBadge = (() => {
    const q = Number(formData.stock_quantity) || 0;
    if (q === 0)
      return {
        label: "Udsolgt",
        cls: "bg-red-100 text-red-700 border-red-200",
      };
    if (q <= 5)
      return {
        label: `Lavt lager (${q})`,
        cls: "bg-yellow-100 text-yellow-800 border-yellow-200",
      };
    return {
      label: `${q} på lager`,
      cls: "bg-green-100 text-green-700 border-green-200",
    };
  })();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Toasts */}
      {success && (
        <div
          role="status"
          className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg animate-in fade-in slide-in-from-top-2"
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
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="font-medium">{success}</span>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg"
        >
          <svg
            className="w-5 h-5 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01M5.07 19h13.86a2 2 0 001.74-2.99l-6.93-12a2 2 0 00-3.48 0l-6.93 12A2 2 0 005.07 19z"
            />
          </svg>
          <div className="flex-1">
            <p className="font-medium">Kunne ikke gemme</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-700"
            aria-label="Luk"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Status row (edit mode) */}
      {mode === "edit" && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${stockBadge.cls}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {stockBadge.label}
          </span>
          {formData.featured && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20">
              <svg
                className="w-3.5 h-3.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Fremhævet
            </span>
          )}
          {formData.new_arrival && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
              Ny ankomst
            </span>
          )}
          {isDirty && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Ugemte ændringer
            </span>
          )}
          {product?.slug && (
            <a
              href={`/product/${product.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex items-center gap-1.5 text-sm text-dark/70 hover:text-accent"
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
              Vis i butik
            </a>
          )}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="font-serif text-lg mb-4">Produkt Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              Navn <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={handleNameChange}
              required
              className="w-full px-4 py-3 border border-dark/20 focus:border-accent focus:outline-none rounded"
              placeholder="Produkt navn"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, slug: e.target.value }))
              }
              required
              className="w-full px-4 py-3 border border-dark/20 focus:border-accent focus:outline-none bg-gray-50 rounded font-mono text-sm"
              placeholder="produkt-slug"
            />
            <p className="mt-1 text-xs text-dark/50">
              Bruges i URL&apos;en: /product/{formData.slug || "..."}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              Pris (DKK) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              inputMode="decimal"
              value={formData.price === 0 ? "" : formData.price}
              onChange={(e) => {
                const v = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  price: v === "" ? 0 : Number(v),
                }));
              }}
              onWheel={(e) => e.currentTarget.blur()}
              required
              min="0"
              className="w-full px-4 py-3 border border-dark/20 focus:border-accent focus:outline-none rounded"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              Kategori <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category: e.target.value }))
              }
              className="w-full px-4 py-3 border border-dark/20 focus:border-accent focus:outline-none bg-white rounded"
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
              Metal <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              {(["silver", "gold"] as const).map((m) => {
                const isActive = formData.metal === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, metal: m }))
                    }
                    aria-pressed={isActive}
                    className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded border text-sm font-medium transition-colors ${
                      isActive
                        ? "border-accent bg-accent/10 text-dark"
                        : "border-dark/20 bg-white text-dark hover:border-dark/40"
                    }`}
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded-full border ${
                        m === "gold"
                          ? "bg-[#D4AF37] border-[#a88a25]"
                          : "bg-[#C0C0C0] border-[#7d7d7d]"
                      }`}
                    />
                    {m === "gold" ? "Guld" : "Sølv"}
                  </button>
                );
              })}
            </div>
            <p className="mt-1 text-xs text-dark/50">
              Bruges af shop-filteret.
            </p>
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
              className="w-full px-4 py-3 border border-dark/20 focus:border-accent focus:outline-none rounded"
              placeholder="f.eks. 925 Sterling sølv"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              Lagerbeholdning
            </label>
            <div className="flex items-stretch">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    stock_quantity: Math.max(0, prev.stock_quantity - 1),
                  }))
                }
                className="px-3 border border-r-0 border-dark/20 bg-gray-50 hover:bg-gray-100 rounded-l"
                aria-label="Sænk lagerbeholdning"
              >
                −
              </button>
              <input
                type="number"
                inputMode="numeric"
                value={formData.stock_quantity === 0 ? "" : formData.stock_quantity}
                onChange={(e) => {
                  const v = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    stock_quantity: v === "" ? 0 : Number(v),
                  }));
                }}
                onWheel={(e) => e.currentTarget.blur()}
                min="0"
                className="flex-1 px-4 py-3 border-y border-dark/20 focus:border-accent focus:outline-none text-center"
                placeholder="0"
              />
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    stock_quantity: prev.stock_quantity + 1,
                  }))
                }
                className="px-3 border border-l-0 border-dark/20 bg-gray-50 hover:bg-gray-100 rounded-r"
                aria-label="Forøg lagerbeholdning"
              >
                +
              </button>
            </div>
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
            className="w-full px-4 py-3 border border-dark/20 focus:border-accent focus:outline-none rounded"
            placeholder="Produkt beskrivelse..."
          />
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-dark mb-2">
            Billeder
          </label>
          <ImageUploader
            images={formData.images}
            onChange={(images) =>
              setFormData((prev) => ({ ...prev, images }))
            }
            maxImages={10}
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
            <span className="text-sm font-medium text-dark">
              Fremhævet produkt
            </span>
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

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.one_of_one}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  one_of_one: e.target.checked,
                }))
              }
              className="w-5 h-5 rounded border-dark/20 text-accent focus:ring-accent"
            />
            <span className="text-sm font-medium text-dark">Unikt stykke (1 af 1)</span>
          </label>
        </div>
      </div>

      {/* Action row */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 flex flex-wrap items-center gap-3">
        {mode === "edit" && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isLoading || isDeleting}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded font-medium disabled:opacity-50 transition-colors"
          >
            {isDeleting ? (
              <span className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
            ) : (
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            )}
            <span>{isDeleting ? "Sletter…" : "Slet produkt"}</span>
          </button>
        )}

        {isDirty && !isLoading && (
          <span className="hidden md:inline text-sm text-amber-700">
            Du har ugemte ændringer
          </span>
        )}

        <div className="ml-auto flex items-center gap-3">
          <Link
            href="/admin/products"
            className="px-5 py-2.5 border border-dark/20 text-dark hover:border-dark/40 hover:bg-gray-50 font-medium rounded transition-colors"
          >
            Annuller
          </Link>
          <button
            type="submit"
            disabled={isLoading || isDeleting}
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-dark/20 text-dark hover:border-dark/40 hover:bg-gray-50 font-medium rounded transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-dark border-t-transparent rounded-full animate-spin" />
                <span>Gemmer…</span>
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
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
                <span>
                  {mode === "create" ? "Opret produkt" : "Gem ændringer"}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
