import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

config({ path: ".env.local", override: false, quiet: true });
config({ path: ".env", override: false, quiet: true });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required for Drizzle. Add it to .env, .env.local, or your deployment environment.");
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
  strict: true,
  verbose: true,
});
