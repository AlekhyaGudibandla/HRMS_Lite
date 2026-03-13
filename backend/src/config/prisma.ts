import { CONFIG } from "../config";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = CONFIG.DATABASE_URL;

console.log("🛠️  Initializing Prisma with Sanitized URL. Length:", connectionString?.length || 0);

const pool = new Pool({ 
  connectionString,
  ssl: { rejectUnauthorized: false }, // Required for Neon/Render in most cases
  max: 10, // Optimize pool size for Render's free tier
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ 
  adapter,
  // Ensure logs help debug if it fails again
  log: CONFIG.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error", "warn"],
});

// Test connection on startup using the pool directly
pool.query('SELECT NOW()')
  .then((res: any) => console.log("✅ Database connection verified via pg adapter:", res.rows[0].now))
  .catch((err: Error) => {
    console.error("❌ Database connection failed:", err.message);
    if (err.message.includes("ENETUNREACH")) {
      console.error("   → Network unreachable: Likely an IPv6 routing issue on the host.");
    }
  });

export default prisma;
