import { sql, type SQL } from "drizzle-orm";
import { getDb } from "@/db";
import { toNumber } from "@/lib/utils";

export type ListParams = {
  q?: string;
  page?: number;
  sort?: string;
  dir?: string;
  from?: string;
  to?: string;
};

export type Paged<T> = {
  rows: T[];
  page: number;
  totalPages: number;
  total: number;
};

const pageSize = 10;

function like(q?: string) {
  return `%${q?.trim() ?? ""}%`;
}

function dirSql(dir?: string) {
  return dir === "desc" ? sql`desc` : sql`asc`;
}

async function rowsOf<T extends Record<string, unknown>>(statement: SQL) {
  const result = await getDb().execute<T>(statement);
  return result.rows;
}

async function firstValue(statement: SQL) {
  const [row] = await rowsOf<{ count: string }>(statement);
  return Number(row?.count ?? 0);
}

async function paged<T extends Record<string, unknown>>(params: ListParams, countSql: SQL, dataSql: (limit: number, offset: number) => SQL) {
  const page = Math.max(1, Number(params.page ?? 1));
  const total = await firstValue(countSql);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const rows = await rowsOf<T>(dataSql(pageSize, (page - 1) * pageSize));
  return { rows, page, totalPages, total };
}

export type GroupRow = { id: string; name: string; memberCount: string; createdAt: string };
export async function listGroups(params: ListParams): Promise<Paged<GroupRow>> {
  const orderMap: Record<string, SQL> = {
    name: sql`fg.name`,
    memberCount: sql`member_count`,
    createdAt: sql`fg.created_at`,
  };
  const orderBy = orderMap[params.sort ?? ""] ?? orderMap.createdAt;
  const countSql = sql`select count(*)::int as count from farmer_groups fg where fg.name ilike ${like(params.q)}`;
  return paged<GroupRow>(
    params,
    countSql,
    (limit, offset) => sql`
      select fg.id, fg.name, count(f.id)::int::text as "memberCount", fg.created_at::text as "createdAt"
      from farmer_groups fg
      left join farmers f on f.group_id = fg.id
      where fg.name ilike ${like(params.q)}
      group by fg.id
      order by ${orderBy} ${dirSql(params.dir)}
      limit ${limit} offset ${offset}
    `,
  );
}

export type FarmerRow = { id: string; name: string; phone: string; address: string; groupName: string; groupId: string };
export async function listFarmers(params: ListParams): Promise<Paged<FarmerRow>> {
  const orderMap: Record<string, SQL> = {
    name: sql`f.name`,
    phone: sql`f.phone`,
    groupName: sql`fg.name`,
  };
  const orderBy = orderMap[params.sort ?? ""] ?? orderMap.name;
  const term = like(params.q);
  const countSql = sql`
    select count(*)::int as count
    from farmers f join farmer_groups fg on fg.id = f.group_id
    where f.name ilike ${term} or f.phone ilike ${term} or fg.name ilike ${term}
  `;
  return paged<FarmerRow>(
    params,
    countSql,
    (limit, offset) => sql`
      select f.id, f.name, f.phone, f.address, f.group_id as "groupId", fg.name as "groupName"
      from farmers f join farmer_groups fg on fg.id = f.group_id
      where f.name ilike ${term} or f.phone ilike ${term} or fg.name ilike ${term}
      order by ${orderBy} ${dirSql(params.dir)}
      limit ${limit} offset ${offset}
    `,
  );
}

export type MaterialRow = { id: string; name: string; unit: string };
export async function listMaterials(params: ListParams): Promise<Paged<MaterialRow>> {
  const orderBy = params.sort === "unit" ? sql`unit` : sql`name`;
  const countSql = sql`select count(*)::int as count from materials where name ilike ${like(params.q)} or unit ilike ${like(params.q)}`;
  return paged<MaterialRow>(
    params,
    countSql,
    (limit, offset) => sql`
      select id, name, unit from materials
      where name ilike ${like(params.q)} or unit ilike ${like(params.q)}
      order by ${orderBy} ${dirSql(params.dir)}
      limit ${limit} offset ${offset}
    `,
  );
}

export type ProductRow = { id: string; name: string; salePrice: string; costPrice: string; stock: string };
export async function listProducts(params: ListParams): Promise<Paged<ProductRow>> {
  const orderMap: Record<string, SQL> = {
    name: sql`name`,
    salePrice: sql`sale_price`,
    stock: sql`stock`,
  };
  const orderBy = orderMap[params.sort ?? ""] ?? orderMap.name;
  const countSql = sql`select count(*)::int as count from products where name ilike ${like(params.q)}`;
  return paged<ProductRow>(
    params,
    countSql,
    (limit, offset) => sql`
      select id, name, sale_price::text as "salePrice", cost_price::text as "costPrice", stock::text
      from products
      where name ilike ${like(params.q)}
      order by ${orderBy} ${dirSql(params.dir)}
      limit ${limit} offset ${offset}
    `,
  );
}

function dateFilter(column: SQL, params: ListParams) {
  if (params.from && params.to) return sql`${column} between ${params.from}::date and ${params.to}::date`;
  if (params.from) return sql`${column} >= ${params.from}::date`;
  if (params.to) return sql`${column} <= ${params.to}::date`;
  return sql`true`;
}

export type HarvestRow = {
  id: string;
  farmerId: string;
  materialId: string;
  farmerName: string;
  materialName: string;
  unit: string;
  quantity: string;
  quality: string;
  harvestDate: string;
};
export async function listHarvests(params: ListParams): Promise<Paged<HarvestRow>> {
  const term = like(params.q);
  const orderMap: Record<string, SQL> = {
    harvestDate: sql`h.harvest_date`,
    farmerName: sql`f.name`,
    materialName: sql`m.name`,
    quantity: sql`h.quantity`,
  };
  const orderBy = orderMap[params.sort ?? ""] ?? orderMap.harvestDate;
  const where = sql`(${dateFilter(sql`h.harvest_date`, params)}) and (f.name ilike ${term} or m.name ilike ${term} or h.quality::text ilike ${term})`;
  return paged<HarvestRow>(
    params,
    sql`select count(*)::int as count from harvests h join farmers f on f.id=h.farmer_id join materials m on m.id=h.material_id where ${where}`,
    (limit, offset) => sql`
      select h.id, h.farmer_id as "farmerId", h.material_id as "materialId", f.name as "farmerName", m.name as "materialName",
        m.unit, h.quantity::text, h.quality::text, h.harvest_date::text as "harvestDate"
      from harvests h
      join farmers f on f.id=h.farmer_id
      join materials m on m.id=h.material_id
      where ${where}
      order by ${orderBy} ${dirSql(params.dir)}
      limit ${limit} offset ${offset}
    `,
  );
}

export type ProductionRow = {
  id: string;
  harvestId: string;
  productId: string;
  harvestLabel: string;
  productName: string;
  inputQuantity: string;
  outputQuantity: string;
  productionCost: string;
  productionDate: string;
  yieldRatio: string;
};
export async function listProductions(params: ListParams): Promise<Paged<ProductionRow>> {
  const term = like(params.q);
  const orderBy = params.sort === "productName" ? sql`p.name` : sql`pr.production_date`;
  const where = sql`(${dateFilter(sql`pr.production_date`, params)}) and (p.name ilike ${term} or f.name ilike ${term} or m.name ilike ${term})`;
  return paged<ProductionRow>(
    params,
    sql`
      select count(*)::int as count
      from productions pr
      join harvests h on h.id=pr.harvest_id
      join farmers f on f.id=h.farmer_id
      join materials m on m.id=h.material_id
      join products p on p.id=pr.product_id
      where ${where}
    `,
    (limit, offset) => sql`
      select pr.id, pr.harvest_id as "harvestId", pr.product_id as "productId",
        concat(f.name, ' - ', m.name, ' ', h.quantity, ' ', m.unit) as "harvestLabel",
        p.name as "productName", pr.input_quantity::text as "inputQuantity", pr.output_quantity::text as "outputQuantity",
        pr.production_cost::text as "productionCost", pr.production_date::text as "productionDate",
        case when pr.input_quantity = 0 then '0' else round((pr.output_quantity / pr.input_quantity) * 100, 2)::text end as "yieldRatio"
      from productions pr
      join harvests h on h.id=pr.harvest_id
      join farmers f on f.id=h.farmer_id
      join materials m on m.id=h.material_id
      join products p on p.id=pr.product_id
      where ${where}
      order by ${orderBy} ${dirSql(params.dir)}
      limit ${limit} offset ${offset}
    `,
  );
}

export type SaleRow = {
  id: string;
  productId: string;
  productName: string;
  qty: string;
  price: string;
  total: string;
  costTotal: string;
  saleDate: string;
};
export async function listSales(params: ListParams): Promise<Paged<SaleRow>> {
  const term = like(params.q);
  const orderMap: Record<string, SQL> = {
    productName: sql`p.name`,
    qty: sql`s.qty`,
    total: sql`s.total`,
    saleDate: sql`s.sale_date`,
  };
  const orderBy = orderMap[params.sort ?? ""] ?? orderMap.saleDate;
  const where = sql`(${dateFilter(sql`s.sale_date`, params)}) and p.name ilike ${term}`;
  return paged<SaleRow>(
    params,
    sql`select count(*)::int as count from sales s join products p on p.id=s.product_id where ${where}`,
    (limit, offset) => sql`
      select s.id, s.product_id as "productId", p.name as "productName", s.qty::text, s.price::text,
        s.total::text, s.cost_total::text as "costTotal", s.sale_date::text as "saleDate"
      from sales s join products p on p.id=s.product_id
      where ${where}
      order by ${orderBy} ${dirSql(params.dir)}
      limit ${limit} offset ${offset}
    `,
  );
}

export async function optionGroups() {
  return rowsOf<{ id: string; label: string }>(sql`select id, name as label from farmer_groups order by name`);
}

export async function optionFarmers() {
  return rowsOf<{ id: string; label: string }>(sql`select id, name as label from farmers order by name`);
}

export async function optionMaterials() {
  return rowsOf<{ id: string; label: string }>(sql`select id, concat(name, ' (', unit, ')') as label from materials order by name`);
}

export async function optionProducts() {
  return rowsOf<{ id: string; label: string; price: string }>(
    sql`select id, concat(name, ' - stok ', stock) as label, sale_price::text as price from products order by name`,
  );
}

export async function optionHarvests() {
  return rowsOf<{ id: string; label: string }>(sql`
    select h.id, concat(h.harvest_date, ' - ', f.name, ' - ', m.name, ' ', h.quantity, ' ', m.unit) as label
    from harvests h
    join farmers f on f.id=h.farmer_id
    join materials m on m.id=h.material_id
    order by h.harvest_date desc
    limit 200
  `);
}

export async function getSettings() {
  const [row] = await rowsOf<{ id: string; systemName: string; logoUrl: string | null; description: string }>(sql`
    select id, system_name as "systemName", logo_url as "logoUrl", description
    from settings
    order by created_at asc
    limit 1
  `);
  return row;
}

export type UserRow = { id: string; name: string; email: string; role: string; isActive: boolean };
export async function listUsers(params: ListParams): Promise<Paged<UserRow>> {
  const term = like(params.q);
  const orderMap: Record<string, SQL> = {
    name: sql`name`,
    email: sql`email`,
    role: sql`role`,
  };
  const orderBy = orderMap[params.sort ?? ""] ?? orderMap.name;
  return paged<UserRow>(
    params,
    sql`select count(*)::int as count from users where name ilike ${term} or email ilike ${term} or role::text ilike ${term}`,
    (limit, offset) => sql`
      select id, name, email, role::text, is_active as "isActive"
      from users
      where name ilike ${term} or email ilike ${term} or role::text ilike ${term}
      order by ${orderBy} ${dirSql(params.dir)}
      limit ${limit} offset ${offset}
    `,
  );
}

export async function getDashboard() {
  const [counts] = await rowsOf<{
    groups: string;
    farmers: string;
    harvests: string;
    products: string;
    sales: string;
    production: string;
    revenue: string;
    profit: string;
  }>(sql`
    select
      (select count(*) from farmer_groups)::text as groups,
      (select count(*) from farmers)::text as farmers,
      (select count(*) from harvests)::text as harvests,
      (select count(*) from products)::text as products,
      (select count(*) from sales)::text as sales,
      (select coalesce(sum(output_quantity),0) from productions)::text as production,
      (select coalesce(sum(total),0) from sales)::text as revenue,
      (select coalesce(sum(total - cost_total),0) from sales)::text as profit
  `);

  const productionMonthly = await rowsOf<{ month: string; value: string }>(sql`
    select to_char(production_date, 'Mon YYYY') as month, coalesce(sum(output_quantity),0)::text as value
    from productions
    group by date_trunc('month', production_date), to_char(production_date, 'Mon YYYY')
    order by date_trunc('month', production_date)
    limit 12
  `);

  const salesMonthly = await rowsOf<{ month: string; value: string }>(sql`
    select to_char(sale_date, 'Mon YYYY') as month, coalesce(sum(total),0)::text as value
    from sales
    group by date_trunc('month', sale_date), to_char(sale_date, 'Mon YYYY')
    order by date_trunc('month', sale_date)
    limit 12
  `);

  const topProducts = await rowsOf<{ name: string; qty: string; revenue: string }>(sql`
    select p.name, sum(s.qty)::text as qty, sum(s.total)::text as revenue
    from sales s join products p on p.id=s.product_id
    group by p.name
    order by sum(s.qty) desc
    limit 5
  `);

  const topFarmers = await rowsOf<{ name: string; quantity: string }>(sql`
    select f.name, sum(h.quantity)::text as quantity
    from harvests h join farmers f on f.id=h.farmer_id
    group by f.name
    order by sum(h.quantity) desc
    limit 5
  `);

  const activities = await rowsOf<{ label: string; createdAt: string }>(sql`
    select concat('Penjualan ', p.name, ' senilai ', s.total) as label, s.created_at::text as "createdAt"
    from sales s join products p on p.id=s.product_id
    order by s.created_at desc
    limit 6
  `);

  return {
    counts,
    productionMonthly: productionMonthly.map((row) => ({ ...row, value: toNumber(row.value) })),
    salesMonthly: salesMonthly.map((row) => ({ ...row, value: toNumber(row.value) })),
    topProducts,
    topFarmers,
    activities,
  };
}

export async function getReport(kind: "production" | "sales" | "profit", params: ListParams) {
  if (kind === "production") {
    const rows = await rowsOf<{ month: string; totalOutput: string; totalInput: string; cost: string }>(sql`
      select to_char(production_date, 'Mon YYYY') as month,
        sum(output_quantity)::text as "totalOutput",
        sum(input_quantity)::text as "totalInput",
        sum(production_cost)::text as cost
      from productions
      where ${dateFilter(sql`production_date`, params)}
      group by date_trunc('month', production_date), to_char(production_date, 'Mon YYYY')
      order by date_trunc('month', production_date)
    `);
    return rows;
  }

  if (kind === "sales") {
    const rows = await rowsOf<{ month: string; transactions: string; revenue: string }>(sql`
      select to_char(sale_date, 'Mon YYYY') as month,
        count(*)::text as transactions,
        sum(total)::text as revenue
      from sales
      where ${dateFilter(sql`sale_date`, params)}
      group by date_trunc('month', sale_date), to_char(sale_date, 'Mon YYYY')
      order by date_trunc('month', sale_date)
    `);
    return rows;
  }

  const [summary] = await rowsOf<{ revenue: string; cost: string; profit: string; margin: string }>(sql`
    select
      coalesce(sum(total),0)::text as revenue,
      coalesce(sum(cost_total),0)::text as cost,
      (coalesce(sum(total),0) - coalesce(sum(cost_total),0))::text as profit,
      case when coalesce(sum(total),0) = 0 then '0'
        else round(((coalesce(sum(total),0) - coalesce(sum(cost_total),0)) / coalesce(sum(total),1)) * 100, 2)::text
      end as margin
    from sales
    where ${dateFilter(sql`sale_date`, params)}
  `);

  const trend = await rowsOf<{ month: string; revenue: string; cost: string; profit: string }>(sql`
    select to_char(sale_date, 'Mon YYYY') as month,
      sum(total)::text as revenue,
      sum(cost_total)::text as cost,
      (sum(total)-sum(cost_total))::text as profit
    from sales
    where ${dateFilter(sql`sale_date`, params)}
    group by date_trunc('month', sale_date), to_char(sale_date, 'Mon YYYY')
    order by date_trunc('month', sale_date)
  `);

  const products = await rowsOf<{ name: string; revenue: string; profit: string }>(sql`
    select p.name, sum(s.total)::text as revenue, (sum(s.total)-sum(s.cost_total))::text as profit
    from sales s join products p on p.id=s.product_id
    where ${dateFilter(sql`s.sale_date`, params)}
    group by p.name
    order by profit::numeric desc
    limit 8
  `);

  return { summary, trend, products };
}
