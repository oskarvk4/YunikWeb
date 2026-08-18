"use client";

import { useTransition } from "react";
import { toggleProductPublished } from "@/app/admin/products/actions";

interface ProductPublishToggleProps {
  productId: string;
  published: boolean;
}

export default function ProductPublishToggle({ productId, published }: ProductPublishToggleProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      await toggleProductPublished(productId, published);
    });
  };

  const isLive = published;

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      title={isLive ? "Klik for at tage offline" : "Klik for at gøre live"}
      className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
        isLive
          ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
          : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"
      }`}
    >
      {isPending ? (
        <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        <span className={`w-2 h-2 rounded-full ${isLive ? "bg-green-500" : "bg-gray-400"}`} />
      )}
      {isLive ? "Live" : "Offline"}
    </button>
  );
}
