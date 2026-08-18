"use client";

const STORAGE_KEY = "yunik-cookie-consent";
const EVENT_NAME = "yunik-consent-change";

export type ConsentValue = "accepted" | "rejected";

interface StoredConsent {
  value: ConsentValue;
  at: string;
}

export function readConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredConsent;
    return parsed.value;
  } catch {
    return null;
  }
}

export function writeConsent(value: ConsentValue): void {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ value, at: new Date().toISOString() })
    );
    window.dispatchEvent(
      new CustomEvent(EVENT_NAME, { detail: { value } })
    );
  } catch {
    // ignore
  }
}

export function onConsentChange(
  handler: (value: ConsentValue | null) => void
): () => void {
  const listener = () => handler(readConsent());
  window.addEventListener(EVENT_NAME, listener);
  return () => window.removeEventListener(EVENT_NAME, listener);
}
