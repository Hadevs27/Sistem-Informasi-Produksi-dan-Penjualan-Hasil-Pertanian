import bcrypt from "bcryptjs";
import { sql } from "drizzle-orm";
import { getDb } from "@/db";
import { farmerGroups, farmers, harvests, materials, productions, products, sales, settings, users } from "@/db/schema";

const db = getDb();
const today = new Date("2026-06-02");

function dayOffset(days: number) {
  const date = new Date(today);
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
}

function pick<T>(items: T[], index: number) {
  return items[index % items.length];
}

async function main() {
  console.log("Resetting database data...");
  await db.delete(sales);
  await db.delete(productions);
  await db.delete(harvests);
  await db.delete(farmers);
  await db.delete(farmerGroups);
  await db.delete(materials);
  await db.delete(products);
  await db.delete(settings);
  await db.delete(users);

  const passwordHash = await bcrypt.hash("password123", 12);
  await db.insert(users).values([
    { name: "Admin Macroprima", email: "admin@example.com", passwordHash, role: "ADMIN", isActive: true },
    { name: "Pegawai Operasional", email: "pegawai@example.com", passwordHash, role: "PEGAWAI", isActive: true },
    { name: "Manajer Bisnis", email: "manajer@example.com", passwordHash, role: "MANAJER", isActive: true },
  ]);

  await db.insert(settings).values({
    systemName: "PT MACROPRIMA PANGAN UTAMA",
    logoUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150",
    description: "Enterprise Production Management System untuk produksi, distribusi, laporan, dan analisis laba-rugi pangan.",
  });

  const groupRows = await db.insert(farmerGroups).values([
    { name: "Kelompok Tani Subur Makmur" },
    { name: "Kelompok Tani Hijau Lestari" },
    { name: "Kelompok Tani Sumber Rejeki" },
  ]).returning();

  const materialRows = await db.insert(materials).values([
    { name: "Kedelai", unit: "Kg" },
    { name: "Singkong", unit: "Kg" },
    { name: "Jagung", unit: "Kg" },
    { name: "Cabai", unit: "Kg" },
    { name: "Susu Kedelai", unit: "Liter" },
  ]).returning();

  const productRows = await db.insert(products).values([
    { name: "Tempe Premium", salePrice: "18000", costPrice: "9500", stock: "0" },
    { name: "Keripik Singkong", salePrice: "22000", costPrice: "12000", stock: "0" },
    { name: "Tepung Jagung", salePrice: "16000", costPrice: "8500", stock: "0" },
    { name: "Sambal Cabai", salePrice: "28000", costPrice: "15000", stock: "0" },
    { name: "Susu Kedelai Botol", salePrice: "12000", costPrice: "6500", stock: "0" },
  ]).returning();

  const farmerRows = await db.insert(farmers).values(
    Array.from({ length: 20 }, (_, index) => ({
      name: `Petani ${String(index + 1).padStart(2, "0")}`,
      phone: `08${String(1220000000 + index)}`,
      address: `Dusun ${pick(["Melati", "Kenanga", "Mawar", "Anggrek"], index)} RT ${index + 1}`,
      groupId: pick(groupRows, index).id,
    })),
  ).returning();

  const harvestRows = await db.insert(harvests).values(
    Array.from({ length: 100 }, (_, index) => ({
      farmerId: pick(farmerRows, index).id,
      materialId: pick(materialRows, index).id,
      quantity: String(120 + (index % 9) * 17),
      quality: pick(["SANGAT_BAIK", "BAIK", "SEDANG", "BURUK"] as const, index),
      harvestDate: dayOffset(160 - index),
    })),
  ).returning();

  await db.insert(productions).values(
    Array.from({ length: 75 }, (_, index) => {
      const product = pick(productRows, index);
      const input = 80 + (index % 10) * 12;
      const output = Math.round(input * (0.52 + (index % 4) * 0.07));
      return {
        harvestId: pick(harvestRows, index).id,
        productId: product.id,
        inputQuantity: String(input),
        outputQuantity: String(output),
        productionCost: String(output * Number(product.costPrice)),
        productionDate: dayOffset(120 - index),
      };
    }),
  );

  await db.execute(sql`
    update products p set stock = coalesce(prod.total_output, 0), updated_at = now()
    from (
      select product_id, sum(output_quantity) as total_output
      from productions
      group by product_id
    ) prod
    where p.id = prod.product_id
  `);

  await db.insert(sales).values(
    Array.from({ length: 250 }, (_, index) => {
      const product = pick(productRows, index);
      const qty = 2 + (index % 7);
      const price = Number(product.salePrice);
      return {
        productId: product.id,
        qty: String(qty),
        price: String(price),
        total: String(qty * price),
        costTotal: String(qty * Number(product.costPrice)),
        saleDate: dayOffset(95 - Math.floor(index / 3)),
      };
    }),
  );

  await db.execute(sql`
    update products p set stock = greatest(0, p.stock - coalesce(sold.total_qty, 0)), updated_at = now()
    from (
      select product_id, sum(qty) as total_qty
      from sales
      group by product_id
    ) sold
    where p.id = sold.product_id
  `);

  console.log("Seed completed.");
  console.log("Demo accounts: admin@example.com, pegawai@example.com, manajer@example.com");
  console.log("Password: password123");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
