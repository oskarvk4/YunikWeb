/**
 * Personal early-access links for people on the early-access list.
 *
 * While the coming-soon gate is on, opening /early-access/<token> from the
 * launch email sets a signed cookie that lets that browser into the shop.
 * Tokens and cookies are HMAC-signed with EARLY_ACCESS_SECRET, so they can't
 * be guessed or edited, and checking a cookie needs no database call.
 *
 * Uses Web Crypto only, so it runs in the middleware (edge), route handlers
 * and the send script alike.
 */

export const EARLY_ACCESS_COOKIE = "yunik_early_access";
export const EARLY_ACCESS_DAYS = 30;

/** Preview links (for test emails) are "preview-<expiry seconds>" and skip the list check. */
const PREVIEW_PREFIX = "preview-";

function getSecret(): string | null {
  const secret = process.env.EARLY_ACCESS_SECRET;
  return secret && secret.length >= 32 ? secret : null;
}

function base64url(bytes: ArrayBuffer): string {
  let binary = "";
  for (const b of new Uint8Array(bytes)) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sign(message: string): Promise<string | null> {
  const secret = getSecret();
  if (!secret) return null;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return base64url(await crypto.subtle.sign("HMAC", key, encoder.encode(message)));
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

const nowSeconds = () => Math.floor(Date.now() / 1000);

/** Link token for one subscriber: "<id>.<signature>". */
export async function createLinkToken(subscriberId: string): Promise<string> {
  const signature = await sign(`link:${subscriberId}`);
  if (!signature) throw new Error("EARLY_ACCESS_SECRET is missing or shorter than 32 characters");
  return `${subscriberId}.${signature}`;
}

/** Link token for a test email, valid for `days` days and not tied to anyone on the list. */
export async function createPreviewLinkToken(days = 3): Promise<string> {
  return createLinkToken(`${PREVIEW_PREFIX}${nowSeconds() + days * 86400}`);
}

/**
 * Reads a link token. Returns the subscriber id, "preview" for a live preview
 * token, or null when the signature is wrong or a preview has expired.
 */
export async function readLinkToken(token: string): Promise<string | null> {
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;
  const id = token.slice(0, dot);
  const expected = await sign(`link:${id}`);
  if (!expected || !safeEqual(expected, token.slice(dot + 1))) return null;

  if (id.startsWith(PREVIEW_PREFIX)) {
    const expires = Number(id.slice(PREVIEW_PREFIX.length));
    return Number.isFinite(expires) && expires > nowSeconds() ? "preview" : null;
  }
  return id;
}

/** Cookie value "<id>.<expiry seconds>.<signature>" and its max age in seconds. */
export async function createAccessCookie(
  subscriberId: string,
  days = EARLY_ACCESS_DAYS
): Promise<{ value: string; maxAge: number }> {
  const maxAge = days * 86400;
  const expires = nowSeconds() + maxAge;
  const signature = await sign(`cookie:${subscriberId}:${expires}`);
  if (!signature) throw new Error("EARLY_ACCESS_SECRET is missing or shorter than 32 characters");
  return { value: `${subscriberId}.${expires}.${signature}`, maxAge };
}

/** True for an unexpired cookie this site signed. False when the secret isn't set. */
export async function hasValidAccessCookie(value: string | undefined): Promise<boolean> {
  if (!value) return false;
  const parts = value.split(".");
  if (parts.length !== 3) return false;
  const [id, expiresRaw, signature] = parts;
  const expires = Number(expiresRaw);
  if (!Number.isFinite(expires) || expires <= nowSeconds()) return false;
  const expected = await sign(`cookie:${id}:${expires}`);
  return expected !== null && safeEqual(expected, signature);
}
