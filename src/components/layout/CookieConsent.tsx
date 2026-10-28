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
      // Phones: a compact card that leaves the page visible around it. From md: a full-width bar.
      className="fixed inset-x-3 bottom-3 z-50 rounded-sm bg-[#1A1A1A] text-white shadow-[0_8px_30px_rgba(0,0,0,0.3)] md:inset-x-0 md:bottom-0 md:rounded-none md:shadow-[0_-8px_30px_rgba(0,0,0,0.2)]"
    >
      <div className="mx-auto max-w-6xl p-4 flex flex-col gap-3 md:flex-row md:items-center md:gap-4 md:px-6 md:py-3 lg:px-8">
        <p className="text-[13px] leading-snug text-white/80 font-sans md:text-sm md:leading-relaxed md:flex-1">
          Vi bruger cookies til statistik og markedsføring. Læs mere i vores{" "}
          <Link
            href="/privacy"
            className="underline hover:text-white transition-colors"
          >
            privatlivspolitik
          </Link>
          .
        </p>
        {/* Rejecting is as easy as accepting: same size, weight and contrast, only the fill differs. */}
        <div className="flex gap-2 md:flex-shrink-0">
          <button
            type="button"
            onClick={() => dismiss("rejected")}
            className="flex-1 md:flex-none px-4 py-2 text-[13px] md:text-sm font-sans font-medium text-white border border-white hover:bg-white/15 rounded transition-colors"
          >
            Kun nødvendige
          </button>
          <button
            type="button"
            onClick={() => dismiss("accepted")}
            className="flex-1 md:flex-none px-4 py-2 text-[13px] md:text-sm font-sans font-medium bg-white text-[#1A1A1A] border border-white hover:bg-white/90 rounded transition-colors"
          >
            Accepter alle
          </button>
        </div>
      </div>
    </div>
  );
}
