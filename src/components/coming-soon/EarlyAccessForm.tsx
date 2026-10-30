"use client";

import { useRef, useState } from "react";
import { useCopy } from "@/components/CopyProvider";

type Status = "idle" | "loading" | "success" | "error";

export default function EarlyAccessForm() {
  const copy = useCopy().comingSoon.signup;
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const honeypotRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (status === "loading") return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/early-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          honeypot: honeypotRef.current?.value || "",
        }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || copy.defaultError);
      }

      setStatus("success");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : copy.defaultError
      );
    }
  };

  return (
    <div className="w-full max-w-md">
      <p className="text-white/90 text-base sm:text-lg font-sans font-light leading-relaxed tracking-wide mb-7">
        {copy.intro}
      </p>

      {/* Form and confirmation share one grid cell so the swap crossfades in
          place instead of shifting the page around it. */}
      <div className="grid">
        {status !== "success" && (
          <form
            onSubmit={handleSubmit}
            className="[grid-area:1/1] relative"
            noValidate
          >
            {/* Honeypot — hidden from people, catnip for bots */}
            <input
              ref={honeypotRef}
              type="text"
              name="b_yunik_hp"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute -left-[9999px] opacity-0 h-0 w-0"
            />

            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={copy.emailPlaceholder}
              autoComplete="email"
              required
              disabled={status === "loading"}
              aria-label={copy.emailAriaLabel}
              // Padding is symmetric so the centered text stays optically
              // centered despite the arrow sitting in the right gutter.
              className="w-full bg-transparent border-b border-white/40 px-12 pb-4 text-center text-white placeholder:text-white/50 font-sans text-base sm:text-lg tracking-wide outline-none transition-colors duration-500 hover:border-white/60 focus:border-white disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={status === "loading"}
              aria-label={copy.submitAriaLabel}
              className="absolute right-0 bottom-0 pb-4 pl-3 text-white/70 transition-all duration-300 hover:text-white hover:translate-x-1 focus-visible:text-white focus-visible:outline-none disabled:opacity-40 disabled:translate-x-0"
            >
              {status === "loading" ? (
                <span className="block h-5 w-5 rounded-full border border-white/30 border-t-white animate-spin" />
              ) : (
                <svg
                  width="24"
                  height="20"
                  viewBox="0 0 24 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  aria-hidden="true"
                >
                  <path d="M0 10h22M16 4l6 6-6 6" />
                </svg>
              )}
            </button>
          </form>
        )}

        {status === "success" && (
          <div className="[grid-area:1/1] self-center animate-fade-in">
            <p className="font-serif text-2xl sm:text-3xl font-light text-white">
              {copy.successHeadline}
            </p>
            <p className="mt-2 text-white/70 text-base font-sans font-light">
              {copy.successBody}
            </p>
          </div>
        )}
      </div>

      {/* Reserved slot so an error message doesn't nudge the layout */}
      <div className="mt-3 min-h-5">
        {status === "error" && (
          <p className="text-red-300/90 text-xs font-sans animate-fade-in">
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
}
