import {
  boolean,
  date,
  index,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
};

export const roleEnum = pgEnum("role", ["ADMIN", "PEGAWAI", "MANAJER"]);
export const qualityEnum = pgEnum("quality", ["SANGAT_BAIK", "BAIK", "SEDANG", "BURUK"]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    role: roleEnum("role").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    ...timestamps,
  },
  (table) => [uniqueIndex("users_email_idx").on(table.email), index("users_role_idx").on(table.role)],
);

export const farmerGroups = pgTable("farmer_groups", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  ...timestamps,
});

export const farmers = pgTable(
  "farmers",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    phone: text("phone").notNull(),
    address: text("address").notNull(),
    groupId: uuid("group_id")
      .notNull()
      .references(() => farmerGroups.id, { onDelete: "cascade", onUpdate: "cascade" }),
    ...timestamps,
  },
  (table) => [index("farmers_group_idx").on(table.groupId), index("farmers_name_idx").on(table.name)],
);

export const materials = pgTable("materials", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  unit: text("unit").notNull(),
  ...timestamps,
});

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    salePrice: numeric("sale_price", { precision: 14, scale: 2 }).notNull(),
    costPrice: numeric("cost_price", { precision: 14, scale: 2 }).default("0").notNull(),
    stock: numeric("stock", { precision: 14, scale: 2 }).default("0").notNull(),
    ...timestamps,
  },
  (table) => [index("products_name_idx").on(table.name)],
);

export const harvests = pgTable(
  "harvests",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    farmerId: uuid("farmer_id")
      .notNull()
      .references(() => farmers.id, { onDelete: "cascade", onUpdate: "cascade" }),
    materialId: uuid("material_id")
      .notNull()
      .references(() => materials.id, { onDelete: "cascade", onUpdate: "cascade" }),
    quantity: numeric("quantity", { precision: 14, scale: 2 }).notNull(),
    quality: qualityEnum("quality").notNull(),
    harvestDate: date("harvest_date").notNull(),
    ...timestamps,
  },
  (table) => [
    index("harvests_farmer_idx").on(table.farmerId),
    index("harvests_material_idx").on(table.materialId),
    index("harvests_date_idx").on(table.harvestDate),
  ],
);

export const productions = pgTable(
  "productions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    harvestId: uuid("harvest_id")
      .notNull()
      .references(() => harvests.id, { onDelete: "cascade", onUpdate: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade", onUpdate: "cascade" }),
    inputQuantity: numeric("input_quantity", { precision: 14, scale: 2 }).notNull(),
    outputQuantity: numeric("output_quantity", { precision: 14, scale: 2 }).notNull(),
    productionCost: numeric("production_cost", { precision: 14, scale: 2 }).default("0").notNull(),
    productionDate: date("production_date").notNull(),
    ...timestamps,
  },
  (table) => [
    index("productions_harvest_idx").on(table.harvestId),
    index("productions_product_idx").on(table.productId),
    index("productions_date_idx").on(table.productionDate),
  ],
);

export const sales = pgTable(
  "sales",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade", onUpdate: "cascade" }),
    qty: numeric("qty", { precision: 14, scale: 2 }).notNull(),
    price: numeric("price", { precision: 14, scale: 2 }).notNull(),
    total: numeric("total", { precision: 14, scale: 2 }).notNull(),
    costTotal: numeric("cost_total", { precision: 14, scale: 2 }).default("0").notNull(),
    saleDate: date("sale_date").notNull(),
    ...timestamps,
  },
  (table) => [index("sales_product_idx").on(table.productId), index("sales_date_idx").on(table.saleDate)],
);

export const settings = pgTable("settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  systemName: text("system_name").notNull(),
  logoUrl: text("logo_url"),
  description: text("description").notNull(),
  ...timestamps,
});

export type User = typeof users.$inferSelect;
