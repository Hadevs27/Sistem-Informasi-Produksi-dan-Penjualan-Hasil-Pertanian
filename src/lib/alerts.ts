import { getDb } from "@/db";
import { alerts, products } from "@/db/schema";
import { getProductMetrics } from "./analytics";

export async function evaluateAlerts() {
  const db = getDb();
  const allProducts = await db.select().from(products);
  
  for (const product of allProducts) {
    const metrics = await getProductMetrics(product.id);
    
    // Rule 1: LOW_STOCK
    if (metrics.stock < 50 && metrics.stock > 0) {
      await createAlertIfNotExists({
        type: "LOW_STOCK",
        severity: "WARNING",
        title: `Stok Menipis: ${product.name}`,
        description: `Stok produk ${product.name} tersisa ${metrics.stock} unit.`,
        entityType: "PRODUCT",
        entityId: product.id,
      });
    }
    
    // Rule 2: STOCKOUT_RISK
    if (metrics.stock <= 0) {
      await createAlertIfNotExists({
        type: "STOCKOUT_RISK",
        severity: "CRITICAL",
        title: `Stok Habis: ${product.name}`,
        description: `Stok produk ${product.name} telah habis. Segera lakukan produksi.`,
        entityType: "PRODUCT",
        entityId: product.id,
      });
    }
    
    // Rule 3: NEGATIVE_MARGIN
    if (metrics.profit < 0) {
      await createAlertIfNotExists({
        type: "NEGATIVE_MARGIN",
        severity: "CRITICAL",
        title: `Margin Negatif: ${product.name}`,
        description: `Produk ${product.name} mengalami kerugian sebesar ${Math.abs(metrics.profit)}.`,
        entityType: "PRODUCT",
        entityId: product.id,
      });
    }
  }
}

async function createAlertIfNotExists(data: typeof alerts.$inferInsert) {
  const db = getDb();
  
  // Basic deduplication: Check if an UNREAD alert of same type and entity exists
  const existing = await db.query.alerts.findFirst({
    where: (alerts, { eq, and }) => 
      and(
        eq(alerts.type, data.type!),
        eq(alerts.entityId, data.entityId!),
        eq(alerts.status, "UNREAD")
      ),
  });

  if (!existing) {
    await db.insert(alerts).values(data);
  }
}
