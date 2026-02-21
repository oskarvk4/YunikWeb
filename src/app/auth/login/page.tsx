"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/account";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const supabase = createClient();

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(
          error.message === "Invalid login credentials"
            ? "Forkert email eller adgangskode"
            : error.message
        );
        setIsLoading(false);
        return;
      }

      if (data.user) {
        // Ensure session is persisted before redirecting
        await supabase.auth.getSession();
        window.location.href = redirect;
      } else {
        setError("Login mislykkedes. Prøv igen.");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Netværksfejl. Tjek din internetforbindelse og prøv igen.");
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <div className="bg-white p-8 shadow-sm">
        <h1 className="font-serif text-3xl text-brand-black text-center mb-2">
          Log ind
        </h1>
        <p className="text-brand-black/60 text-center mb-8">
          Velkommen tilbage til Yunik
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 text-sm rounded">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-brand-black mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-dark/20 focus:border-accent focus:outline-none transition-colors"
              placeholder="din@email.dk"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-brand-black mb-2"
            >
              Adgangskode
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-dark/20 focus:border-accent focus:outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>

          <div className="flex justify-end">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-accent hover:underline"
            >
              Glemt adgangskode?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-black text-brand-white py-3 font-medium hover:bg-brand-black/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Logger ind..." : "Log ind"}
          </button>
        </form>

        <p className="mt-6 text-center text-brand-black/60">
          Har du ikke en konto?{" "}
          <Link href="/auth/signup" className="text-accent hover:underline">
            Opret konto
          </Link>
        </p>
      </div>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-brand-beige flex items-center justify-center px-4 py-16">
      <Suspense
        fallback={
          <div className="w-full max-w-md bg-white p-8 shadow-sm animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-8" />
            <div className="space-y-6">
              <div className="h-12 bg-gray-200 rounded" />
              <div className="h-12 bg-gray-200 rounded" />
              <div className="h-12 bg-gray-200 rounded" />
            </div>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
