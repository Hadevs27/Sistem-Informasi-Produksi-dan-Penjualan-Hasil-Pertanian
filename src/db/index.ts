import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";
import { getRequiredEnv } from "@/lib/env";

let cachedDb: NeonHttpDatabase<typeof schema> | null = null;

export function getDb() {
  if (cachedDb) return cachedDb;

  const databaseUrl = getRequiredEnv("DATABASE_URL");
  cachedDb = drizzle(neon(databaseUrl), { schema });
  return cachedDb;
}
