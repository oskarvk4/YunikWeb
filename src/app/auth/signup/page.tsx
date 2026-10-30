"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useCopy } from "@/components/CopyProvider";
import EmailText from "@/components/auth/EmailText";

export default function SignupPage() {
  const copy = useCopy().auth;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError(copy.passwordErrors.mismatch);
      return;
    }

    if (password.length < 6) {
      setError(copy.passwordErrors.tooShort);
      return;
    }

    setIsLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    setSuccess(true);
    setIsLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md animate-fade-in-up">
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
              {copy.signupSuccess.headline}
            </h1>
            <p className="text-dark/60 mb-6">
              <EmailText text={copy.signupSuccess.body} email={email} />
            </p>
            <Link
              href="/auth/login"
              className="text-accent hover:underline"
            >
              {copy.signupSuccess.backLink}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="bg-white p-8 shadow-sm">
          <h1 className="font-serif text-3xl text-dark text-center mb-2">
            {copy.signup.headline}
          </h1>
          <p className="text-dark/60 text-center mb-8">
            {copy.signup.subhead}
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
                className="block text-sm font-medium text-dark mb-2"
              >
                {copy.signup.emailLabel}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-dark/20 focus:border-accent focus:outline-none transition-colors"
                placeholder={copy.signup.emailPlaceholder}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-dark mb-2"
              >
                {copy.signup.passwordLabel}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 border border-dark/20 focus:border-accent focus:outline-none transition-colors"
                placeholder={copy.signup.passwordPlaceholder}
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-dark mb-2"
              >
                {copy.signup.confirmLabel}
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-dark/20 focus:border-accent focus:outline-none transition-colors"
                placeholder={copy.signup.confirmPlaceholder}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-dark text-white py-3 font-medium hover:bg-dark/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? copy.signup.submitting : copy.signup.submit}
            </button>
          </form>

          <p className="mt-6 text-center text-dark/60">
            {copy.signup.haveAccount}{" "}
            <Link href="/auth/login" className="text-accent hover:underline">
              {copy.signup.loginLink}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
