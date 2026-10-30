"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { readConsent, writeConsent } from "@/lib/consent";
import { useCopy } from "@/components/CopyProvider";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const text = useCopy().site.cookies;

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

  // The message holds {link} where the privacy-policy link goes. If an editor
  // removes it, the link is still shown, after the message.
  const slot = text.message.indexOf("{link}");
  const beforeLink = slot === -1 ? `${text.message} ` : text.message.slice(0, slot);
  const afterLink = slot === -1 ? "" : text.message.slice(slot + "{link}".length);
  const privacyLink = (
    <Link
      href="/privacy"
      className="underline hover:text-white transition-colors"
    >
      {text.privacyLink}
    </Link>
  );

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={text.ariaLabel}
      // Phones: a compact card that leaves the page visible around it. From md: a full-width bar.
      className="fixed inset-x-3 bottom-3 z-50 rounded-sm bg-[#1A1A1A] text-white shadow-[0_8px_30px_rgba(0,0,0,0.3)] md:inset-x-0 md:bottom-0 md:rounded-none md:shadow-[0_-8px_30px_rgba(0,0,0,0.2)]"
    >
      <div className="mx-auto max-w-6xl p-4 flex flex-col gap-3 md:flex-row md:items-center md:gap-4 md:px-6 md:py-3 lg:px-8">
        <p className="text-[13px] leading-snug text-white/80 font-sans md:text-sm md:leading-relaxed md:flex-1">
          {beforeLink}
          {privacyLink}
          {afterLink}
        </p>
        {/* Rejecting is as easy as accepting: same size, weight and contrast, only the fill differs. */}
        <div className="flex gap-2 md:flex-shrink-0">
          <button
            type="button"
            onClick={() => dismiss("rejected")}
            className="flex-1 md:flex-none px-4 py-2 text-[13px] md:text-sm font-sans font-medium text-white border border-white hover:bg-white/15 rounded transition-colors"
          >
            {text.reject}
          </button>
          <button
            type="button"
            onClick={() => dismiss("accepted")}
            className="flex-1 md:flex-none px-4 py-2 text-[13px] md:text-sm font-sans font-medium bg-white text-[#1A1A1A] border border-white hover:bg-white/90 rounded transition-colors"
          >
            {text.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
