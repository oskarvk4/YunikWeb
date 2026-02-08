"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    if (email) {
      setStatus("success");
      setEmail("");
      setTimeout(() => setStatus("idle"), 3000);
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
            Stay Connected
          </h2>
          <p className="text-white/60 font-sans max-w-md mx-auto mb-8">
            Be the first to know about new arrivals, exclusive offers, and
            styling inspiration.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-6 py-4 bg-white/10 border border-white/20 text-white placeholder:text-white/40 font-sans text-sm focus:outline-none focus:border-white/40 transition-colors"
            />
            <Button type="submit" variant="primary" size="lg">
              Subscribe
            </Button>
          </form>

          {status === "success" && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-sm text-[#D4A9A5] font-sans"
            >
              Thank you for subscribing!
            </motion.p>
          )}

          <p className="mt-6 text-xs text-white/40 font-sans">
            By subscribing, you agree to our Privacy Policy and consent to receive
            updates from Yunik.
          </p>
        </motion.div>
      </Container>
    </section>
  );
}
