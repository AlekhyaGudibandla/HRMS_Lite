import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

let connectionString = process.env.DATABASE_URL || "";
if (connectionString.startsWith('"') && connectionString.endsWith('"')) {
  connectionString = connectionString.substring(1, connectionString.length - 1);
}
if (connectionString.startsWith("'") && connectionString.endsWith("'")) {
  connectionString = connectionString.substring(1, connectionString.length - 1);
}

console.log("Initializing Prisma with Standard PG Adapter. URL Length:", connectionString.length);

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

// Optional: Test connection on startup
pool.query('SELECT NOW()')
  .then(res => console.log("✅ Database connection verified via pg adapter:", res.rows[0].now))
  .catch(err => console.error("❌ Database connection failed:", err.message));

export default prisma;
