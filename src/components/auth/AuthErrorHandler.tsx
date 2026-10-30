"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCopy } from "@/components/CopyProvider";

export default function AuthErrorHandler() {
  const router = useRouter();
  const expiredLink = useCopy().auth.forgot.expiredLink;

  useEffect(() => {
    if (!window.location.hash.includes("error=")) return;

    const params = new URLSearchParams(window.location.hash.slice(1));
    const errorCode = params.get("error_code");
    const errorDescription = params.get("error_description");

    history.replaceState(null, "", window.location.pathname + window.location.search);

    if (errorCode === "otp_expired" || errorCode === "access_denied") {
      const message = errorDescription ?? expiredLink;
      router.replace(`/auth/forgot-password?error=${encodeURIComponent(message)}`);
    }
  }, [router, expiredLink]);

  return null;
}
