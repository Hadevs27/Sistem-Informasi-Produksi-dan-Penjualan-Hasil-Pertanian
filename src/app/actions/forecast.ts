"use server";

import { getHistoricalSales } from "@/lib/analytics";
import { getDb } from "@/db";
import { forecasts } from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function generateForecast(productId: string, horizonDays: number = 30) {
  const db = getDb();
  
  // 1. Fetch historical sales data (last 90 days for better trend)
  const history = await getHistoricalSales(productId, 90);
  
  // 2. Simple Moving Average (SMA) baseline
  let expectedDemand = 0;
  let confidence = "LOW";
  let lowerBound = 0;
  let upperBound = 0;

  if (history.length > 0) {
    const totalQty = history.reduce((sum, record) => sum + record.qty, 0);
    const dailyAverage = totalQty / 90;
    expectedDemand = dailyAverage * horizonDays;
    
    // Confidence based on data points
    if (history.length > 30) confidence = "HIGH";
    else if (history.length > 10) confidence = "MEDIUM";

    // Simple variance for bounds (assuming 20% variance)
    lowerBound = expectedDemand * 0.8;
    upperBound = expectedDemand * 1.2;
  }

  // 3. Store the forecast in DB
  await db.insert(forecasts).values({
    productId,
    forecastDate: new Date().toISOString(),
    horizonDays: horizonDays.toString(),
    expectedDemand: expectedDemand.toString(),
    lowerBound: lowerBound.toString(),
    upperBound: upperBound.toString(),
    confidence,
  });

  revalidatePath("/laporan/forecast");

  return { expectedDemand, lowerBound, upperBound, confidence };
}
