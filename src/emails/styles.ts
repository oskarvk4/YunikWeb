/**
 * Shared visual tokens for transactional emails, so a change to the brand
 * palette or card treatment lands in every email at once.
 * Email-specific one-offs stay local to their template.
 */

/**
 * The YUNIK wordmark — the only logo emails use, rendered by Logo.tsx.
 * Email clients can't resolve relative paths, so it needs an absolute URL.
 * Deliberately www — the apex 307s to www.yunik.dk, and some image proxies
 * won't follow that hop. Transparent PNG (383×62), shown at about half its
 * pixel width so it stays sharp on retina displays.
 */
export const LOGO_URL = "https://www.yunik.dk/yunik-wordmark.png";
export const LOGO_WIDTH = 180;
export const LOGO_HEIGHT = 29;

// Type styling stays on the element, so a blocked image falls back to its alt
// text set as the same spaced serif wordmark.
export const logo: React.CSSProperties = {
  display: "block",
  margin: "0 auto",
  color: "#1A1A1A",
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "24px",
  letterSpacing: "0.3em",
};

export const body: React.CSSProperties = {
  backgroundColor: "#F5F0EB",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  margin: 0,
  padding: 0,
};

export const container: React.CSSProperties = {
  maxWidth: "560px",
  margin: "0 auto",
  padding: "32px 16px",
};

export const header: React.CSSProperties = {
  textAlign: "center" as const,
  padding: "24px 0 32px",
};

export const tagline: React.CSSProperties = {
  fontSize: "12px",
  letterSpacing: "0.2em",
  textTransform: "uppercase" as const,
  color: "#8D6553",
  margin: "14px 0 0",
};

export const card: React.CSSProperties = {
  backgroundColor: "#FFFFFF",
  borderRadius: "8px",
  padding: "28px 24px",
  marginBottom: "16px",
};

export const h2: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "24px",
  color: "#1A1A1A",
  margin: "0 0 16px",
  fontWeight: 400,
};

export const h3: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "18px",
  color: "#1A1A1A",
  margin: "0 0 16px",
  fontWeight: 400,
};

export const paragraph: React.CSSProperties = {
  fontSize: "15px",
  lineHeight: "24px",
  color: "#1A1A1A",
  margin: "0 0 12px",
};

export const meta: React.CSSProperties = {
  fontSize: "14px",
  color: "#8D6553",
  margin: "16px 0 0",
};

export const hr: React.CSSProperties = {
  borderColor: "#EDE5DC",
  margin: "16px 0",
};

export const addressLine: React.CSSProperties = {
  fontSize: "14px",
  color: "#1A1A1A",
  margin: "2px 0",
  lineHeight: "20px",
};

export const footer: React.CSSProperties = {
  textAlign: "center" as const,
  padding: "24px 0",
};

export const footerText: React.CSSProperties = {
  fontSize: "13px",
  color: "#1A1A1A",
  margin: "0 0 8px",
};

export const footerSmall: React.CSSProperties = {
  fontSize: "12px",
  color: "#8D6553",
  margin: 0,
};

export const link: React.CSSProperties = {
  color: "#8D6553",
  textDecoration: "underline",
};
