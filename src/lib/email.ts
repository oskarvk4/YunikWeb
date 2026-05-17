// Email service utility functions
// Currently supports Mailchimp via JSONP for static sites
// Can be extended to support other services (Klaviyo, SendGrid, etc.)

import { z } from "zod";

// Email validation schema using Zod
const emailSchema = z.string().email("Ugyldig email adresse");

export interface SubscribeResult {
  success: boolean;
  message: string;
}

/**
 * Subscribe an email to the newsletter list
 * Uses Mailchimp JSONP for static site compatibility
 */
export async function subscribeToNewsletter(email: string): Promise<SubscribeResult> {
  const mailchimpUrl = process.env.NEXT_PUBLIC_MAILCHIMP_URL;

  if (!mailchimpUrl) {
    // No email service configured - return success for development
    console.warn("No MAILCHIMP_URL configured. Email subscription simulated.");
    return { success: true, message: "Subscribed (development mode)" };
  }

  return new Promise((resolve) => {
    try {
      // Convert POST URL to JSONP-compatible URL
      const url = new URL(mailchimpUrl.replace("/post?", "/post-json?"));
      url.searchParams.set("EMAIL", email);

      const callbackName = `mailchimp_${Date.now()}`;
      const script = document.createElement("script");

      // Define callback
      (window as unknown as Record<string, unknown>)[callbackName] = (response: { result: string; msg: string }) => {
        delete (window as unknown as Record<string, unknown>)[callbackName];
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }

        if (response.result === "success") {
          resolve({ success: true, message: "Tak for din tilmelding!" });
        } else if (response.msg?.includes("already subscribed")) {
          resolve({ success: true, message: "Du er allerede tilmeldt!" });
        } else {
          resolve({ success: false, message: response.msg || "Tilmelding fejlede" });
        }
      };

      url.searchParams.set("c", callbackName);
      script.src = url.toString();
      script.onerror = () => {
        resolve({ success: false, message: "Netværksfejl. Prøv igen." });
      };
      document.body.appendChild(script);

      // Timeout after 10 seconds
      setTimeout(() => {
        resolve({ success: false, message: "Timeout. Prøv igen." });
      }, 10000);
    } catch {
      resolve({ success: false, message: "Noget gik galt. Prøv igen." });
    }
  });
}

/**
 * Validate email format using Zod
 */
export function isValidEmail(email: string): boolean {
  const result = emailSchema.safeParse(email);
  return result.success;
}

/**
 * Validate and parse email, returning error message if invalid
 */
export function validateEmail(email: string): { valid: boolean; error?: string } {
  const result = emailSchema.safeParse(email);
  if (result.success) {
    return { valid: true };
  }
  return { valid: false, error: result.error.issues[0]?.message || "Ugyldig email" };
}

/**
 * Get Mailchimp form URL for embedding
 * Returns null if not configured
 */
export function getMailchimpFormUrl(): string | null {
  return process.env.NEXT_PUBLIC_MAILCHIMP_URL || null;
}
