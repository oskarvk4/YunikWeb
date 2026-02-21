"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if we have a valid recovery session
    const checkSession = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        setIsValidSession(true);
      }
    };

    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Adgangskoderne matcher ikke");
      return;
    }

    if (password.length < 6) {
      setError("Adgangskoden skal være mindst 6 tegn");
      return;
    }

    setIsLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    setSuccess(true);
    setIsLoading(false);

    // Redirect to account after a short delay
    setTimeout(() => {
      router.push("/account");
    }, 2000);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white p-8 shadow-sm text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
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
            </div>
            <h1 className="font-serif text-2xl text-dark mb-2">
              Adgangskode opdateret
            </h1>
            <p className="text-dark/60">
              Din adgangskode er blevet ændret. Du bliver nu sendt videre...
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!isValidSession) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white p-8 shadow-sm text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h1 className="font-serif text-2xl text-dark mb-2">
              Ugyldigt link
            </h1>
            <p className="text-dark/60 mb-6">
              Dette link er udløbet eller ugyldigt. Bed om et nyt
              nulstillingslink.
            </p>
            <Link
              href="/auth/forgot-password"
              className="inline-block bg-dark text-white px-6 py-3 font-medium hover:bg-dark/90 transition-colors"
            >
              Anmod om nyt link
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white p-8 shadow-sm">
          <h1 className="font-serif text-3xl text-dark text-center mb-2">
            Ny adgangskode
          </h1>
          <p className="text-dark/60 text-center mb-8">
            Indtast din nye adgangskode nedenfor.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 text-sm rounded">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-dark mb-2"
              >
                Ny adgangskode
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 border border-dark/20 focus:border-accent focus:outline-none transition-colors"
                placeholder="Mindst 6 tegn"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-dark mb-2"
              >
                Bekræft ny adgangskode
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-dark/20 focus:border-accent focus:outline-none transition-colors"
                placeholder="Gentag adgangskode"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-dark text-white py-3 font-medium hover:bg-dark/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Opdaterer..." : "Opdater adgangskode"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
