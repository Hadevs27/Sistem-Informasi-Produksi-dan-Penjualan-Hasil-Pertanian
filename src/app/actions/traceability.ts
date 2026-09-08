"use server";

import { getDb } from "@/db";
import { traceabilityCodes } from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function generateTraceabilityCode(entityType: "PRODUCTION" | "HARVEST" | "SALE", entityId: string, originUrl: string) {
  const db = getDb();
  
  // check if exists
  const existing = await db.query.traceabilityCodes.findFirst({
    where: (traceabilityCodes, { eq, and }) => 
      and(
        eq(traceabilityCodes.entityType, entityType),
        eq(traceabilityCodes.entityId, entityId)
      )
  });

  if (existing) return existing;

  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(100 + Math.random() * 900);
  const code = `BATCH-${dateStr}-${random}`;

  const url = `${originUrl}/t/${code}`;

  const [inserted] = await db.insert(traceabilityCodes).values({
    code,
    entityType,
    entityId,
    url,
  }).returning();

  revalidatePath("/traceability");
  return inserted;
}
