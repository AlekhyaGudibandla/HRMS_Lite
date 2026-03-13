import "dotenv/config";

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
  // Fallback support for EMAIL_USER/PASS if the user used the guide's previous suggestion
  SMTP_USER: sanitize(process.env.SMTP_USER || process.env.EMAIL_USER),
  // Gmail App Passwords are 16 chars without spaces.
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
