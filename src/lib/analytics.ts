import { sql } from "drizzle-orm";
import { getDb } from "@/db";

export async function getOverallMetrics() {
  const db = getDb();
  
  const result = await db.execute<{
    products: string;
    sales: string;
    production: string;
    revenue: string;
    profit: string;
    totalCost: string;
  }>(sql`
    select
      (select count(*) from products)::text as products,
      (select coalesce(sum(qty), 0) from sales)::text as sales,
      (select coalesce(sum(output_quantity), 0) from productions)::text as production,
      (select coalesce(sum(total), 0) from sales)::text as revenue,
      (select coalesce(sum(total - cost_total), 0) from sales)::text as profit,
      (select coalesce(sum(cost_total), 0) from sales)::text as "totalCost"
  `);

  const counts = result.rows[0];

  return {
    products: Number(counts?.products ?? 0),
    salesVolume: Number(counts?.sales ?? 0),
    productionVolume: Number(counts?.production ?? 0),
    revenue: Number(counts?.revenue ?? 0),
    profit: Number(counts?.profit ?? 0),
    totalCost: Number(counts?.totalCost ?? 0),
    margin: Number(counts?.revenue) > 0 ? (Number(counts?.profit) / Number(counts?.revenue)) * 100 : 0,
  };
}

export async function getProductMetrics(productId: string) {
  const db = getDb();

  const result = await db.execute<{
    stock: string;
    totalSalesQty: string;
    totalProductionQty: string;
    revenue: string;
    cost: string;
  }>(sql`
    select
      (select stock from products where id = ${productId})::text as stock,
      (select coalesce(sum(qty), 0) from sales where product_id = ${productId})::text as "totalSalesQty",
      (select coalesce(sum(output_quantity), 0) from productions where product_id = ${productId})::text as "totalProductionQty",
      (select coalesce(sum(total), 0) from sales where product_id = ${productId})::text as revenue,
      (select coalesce(sum(cost_total), 0) from sales where product_id = ${productId})::text as cost
  `);

  const metrics = result.rows[0];

  return {
    stock: Number(metrics?.stock ?? 0),
    totalSalesQty: Number(metrics?.totalSalesQty ?? 0),
    totalProductionQty: Number(metrics?.totalProductionQty ?? 0),
    revenue: Number(metrics?.revenue ?? 0),
    cost: Number(metrics?.cost ?? 0),
    profit: Number(metrics?.revenue ?? 0) - Number(metrics?.cost ?? 0),
  };
}

export async function getHistoricalSales(productId: string, days: number = 30) {
  const db = getDb();
  
  const rows = await db.execute<{ date: string; qty: string }>(sql`
    select sale_date as date, sum(qty)::text as qty
    from sales
    where product_id = ${productId}
      and sale_date >= current_date - (${days}::int || ' days')::interval
    group by sale_date
    order by sale_date asc
  `);
  
  return rows.rows.map(r => ({ date: r.date, qty: Number(r.qty) }));
}
