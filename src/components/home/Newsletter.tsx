"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { trackNewsletterSignup } from "@/lib/analytics";

const MAILCHIMP_URL = process.env.NEXT_PUBLIC_MAILCHIMP_URL;

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const honeypotRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check - if filled, it's a bot
    if (honeypotRef.current?.value) {
      // Silently reject spam
      setStatus("success");
      return;
    }

    if (!email) return;

    setStatus("loading");
    setErrorMessage("");

    // If Mailchimp URL is configured, submit to Mailchimp
    if (MAILCHIMP_URL) {
      try {
        // Convert POST URL to JSONP-compatible URL
        const url = new URL(MAILCHIMP_URL.replace("/post?", "/post-json?"));
        url.searchParams.set("EMAIL", email);
        url.searchParams.set("c", "callback");

        // Use JSONP for cross-origin Mailchimp submission
        await new Promise<void>((resolve, reject) => {
          const callbackName = `mailchimp_${Date.now()}`;
          const script = document.createElement("script");

          // Define callback
          (window as unknown as Record<string, unknown>)[callbackName] = (response: { result: string; msg: string }) => {
            delete (window as unknown as Record<string, unknown>)[callbackName];
            document.body.removeChild(script);

            if (response.result === "success") {
              resolve();
            } else {
              // Handle "already subscribed" as success
              if (response.msg?.includes("already subscribed")) {
                resolve();
              } else {
                reject(new Error(response.msg || "Tilmelding fejlede"));
              }
            }
          };

          url.searchParams.set("c", callbackName);
          script.src = url.toString();
          script.onerror = () => reject(new Error("Netværksfejl"));
          document.body.appendChild(script);

          // Timeout after 10 seconds
          setTimeout(() => reject(new Error("Timeout")), 10000);
        });

        setStatus("success");
        setEmail("");
        trackNewsletterSignup(email);
        setTimeout(() => setStatus("idle"), 5000);
      } catch (error) {
        setStatus("error");
        setErrorMessage(error instanceof Error ? error.message : "Noget gik galt. Prøv igen.");
        setTimeout(() => setStatus("idle"), 5000);
      }
    } else {
      // Fallback: Just show success (for development/demo)
      setStatus("success");
      setEmail("");
      trackNewsletterSignup(email);
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <section className="py-20 md:py-28 bg-[#1A1A1A]">
      <Container size="narrow">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-light text-white mb-4">
            Hold Dig Opdateret
          </h2>
          <p className="text-white/60 font-sans max-w-md mx-auto mb-8">
            Vær den første til at høre om nye ankomster, eksklusive tilbud og
            stylinginspiration.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
          >
            {/* Honeypot field - hidden from users, bots will fill it */}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Indtast din email"
              required
              disabled={status === "loading"}
              className="flex-1 px-6 py-4 bg-white/10 border border-white/20 text-white placeholder:text-white/40 font-sans text-sm outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:border-white/40 transition-colors disabled:opacity-50"
            />
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Sender..." : "Tilmeld"}
            </Button>
          </form>

          {status === "success" && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-sm text-[#D4A9A5] font-sans"
            >
              Tak for din tilmelding!
            </motion.p>
          )}

          {status === "error" && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-sm text-red-400 font-sans"
            >
              {errorMessage}
            </motion.p>
          )}

          <p className="mt-6 text-xs text-white/40 font-sans">
            Ved at tilmelde dig accepterer du vores{" "}
            <a href="/privacy" className="underline hover:text-white/60 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-sm">
              privatlivspolitik
            </a>{" "}
            og giver samtykke til at modtage opdateringer fra Yunik.
          </p>
        </motion.div>
      </Container>
    </section>
  );
}
