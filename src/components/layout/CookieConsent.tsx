"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { readConsent, writeConsent } from "@/lib/consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (readConsent() === null) {
      setVisible(true);
    }
  }, []);

  const dismiss = (value: "accepted" | "rejected") => {
    writeConsent(value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie samtykke"
      className="fixed inset-x-0 bottom-0 z-50 bg-[#1A1A1A] text-white shadow-[0_-8px_30px_rgba(0,0,0,0.2)]"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row md:items-center gap-4">
        <p className="text-sm text-white/80 font-sans leading-relaxed flex-1">
          Vi bruger cookies for at få siden til at fungere og for at forbedre
          din oplevelse. Læs mere i vores{" "}
          <Link
            href="/privacy"
            className="underline hover:text-white transition-colors"
          >
            privatlivspolitik
          </Link>
          .
        </p>
        <div className="flex gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => dismiss("rejected")}
            className="px-4 py-2 text-sm font-sans text-white/70 hover:text-white border border-white/20 hover:border-white/40 rounded transition-colors"
          >
            Kun nødvendige
          </button>
          <button
            type="button"
            onClick={() => dismiss("accepted")}
            className="px-4 py-2 text-sm font-sans bg-white text-[#1A1A1A] hover:bg-white/90 rounded transition-colors font-medium"
          >
            Accepter alle
          </button>
        </div>
      </div>
    </div>
  );
}
