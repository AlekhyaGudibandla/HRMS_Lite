import { CONFIG } from "./src/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: CONFIG.DATABASE_URL,
  },
});
