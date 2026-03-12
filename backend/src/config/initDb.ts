import "dotenv/config";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function initDb(): Promise<void> {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS employees (
        id            SERIAL PRIMARY KEY,
        employee_id   VARCHAR(50) UNIQUE NOT NULL,
        full_name     VARCHAR(255) NOT NULL,
        email         VARCHAR(255) NOT NULL,
        department    VARCHAR(255) NOT NULL,
        created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;
    console.log("✅ employees table created");

    await sql`
      CREATE TABLE IF NOT EXISTS attendance (
        id            SERIAL PRIMARY KEY,
        employee_id   VARCHAR(50) NOT NULL REFERENCES employees(employee_id) ON DELETE CASCADE,
        date          DATE NOT NULL,
        status        VARCHAR(10) NOT NULL CHECK (status IN ('Present', 'Absent')),
        created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(employee_id, date)
      )
    `;
    console.log("✅ attendance table created");

    console.log("\n🚀 Database initialised successfully!");
  } catch (error) {
    console.error("❌ Database init failed:", (error as Error).message);
    process.exit(1);
  }
}

initDb();
