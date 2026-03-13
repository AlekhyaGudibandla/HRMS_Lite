import "dotenv/config";
import dns from "dns";

// Global Network Fix: Force IPv4 for all DNS lookups. 
// Cloud providers like Render often have issues routing traffic via IPv6 (connect ENETUNREACH).
// This fixes BOTH database and email connectivity issues in production.
if (typeof dns.setDefaultResultOrder === "function") {
  dns.setDefaultResultOrder("ipv4first");
}

/**
 * Robustly sanitizes environment variables.
 * Strips whitespace and surrounding quotes (single or double) which
 * often get accidentally included when copying from dashboards like Neon or Render.
 */
const sanitize = (val: string | undefined): string => {
  if (!val) return "";
  let clean = val.trim();
  // Remove surrounding quotes if they exist
  if ((clean.startsWith('"') && clean.endsWith('"')) || (clean.startsWith("'") && clean.endsWith("'"))) {
    clean = clean.substring(1, clean.length - 1);
  }
  return clean.trim();
};

export const CONFIG = {
  DATABASE_URL: sanitize(process.env.DATABASE_URL),
  // Fallback support for EMAIL_USER/PASS
  SMTP_USER: sanitize(process.env.SMTP_USER || process.env.EMAIL_USER),
  // Gmail App Passwords
  SMTP_PASS: sanitize(process.env.SMTP_PASS || process.env.EMAIL_PASS).replace(/\s+/g, ""),
  FRONTEND_URL: sanitize(process.env.FRONTEND_URL) || "http://localhost:3000",
  PORT: parseInt(sanitize(process.env.PORT)) || 5001,
  NODE_ENV: sanitize(process.env.NODE_ENV) || "development",
  JWT_SECRET: sanitize(process.env.JWT_SECRET) || "hrms_secret_fallback",
};

// Log sanitized status (without sensitive info)
console.log("🛠️  Config sanitized: Database and SMTP variables cleaned.");
if (CONFIG.NODE_ENV === "production") {
  console.log(`🌐 Production mode: Frontend URL is ${CONFIG.FRONTEND_URL}`);
}
