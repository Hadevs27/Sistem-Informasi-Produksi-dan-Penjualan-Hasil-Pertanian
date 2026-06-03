"use server";

import bcrypt from "bcryptjs";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { auth, signIn, signOut } from "@/auth";
import { getDb } from "@/db";
import {
  farmerGroups,
  farmers,
  harvests,
  materials,
  productions,
  products,
  sales,
  settings,
  users,
} from "@/db/schema";
import { canMutate, type UserRole } from "@/lib/rbac";
import {
  farmerSchema,
  groupSchema,
  harvestSchema,
  idSchema,
  materialSchema,
  productSchema,
  productionSchema,
  saleSchema,
  settingsSchema,
  userSchema,
} from "@/lib/validation";

type Resource =
  | "groups"
  | "farmers"
  | "materials"
  | "products"
  | "harvests"
  | "productions"
  | "sales"
  | "users"
  | "settings";

const resourcePaths: Record<Resource, string> = {
  groups: "/master/kelompok-tani",
  farmers: "/master/petani",
  materials: "/master/bahan-baku",
  products: "/master/produk",
  harvests: "/transaksi/hasil-panen",
  productions: "/transaksi/produksi",
  sales: "/transaksi/penjualan",
  users: "/users",
  settings: "/settings",
};

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "");
}

function boolValue(formData: FormData, key: string) {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

async function requireMutation(resource: Resource) {
  const session = await auth();
  const role = session?.user?.role as UserRole | undefined;
  const area = resource === "users" ? "users" : resource === "settings" ? "settings" : ["harvests", "productions", "sales"].includes(resource) ? "transaksi" : "master";

  if (!role || !canMutate(role, area)) {
    throw new Error("Anda tidak memiliki izin untuk mengubah data ini.");
  }

  return session!.user;
}

export async function loginAction(formData: FormData) {
  try {
    await signIn("credentials", {
      email: value(formData, "email"),
      password: value(formData, "password"),
      redirectTo: value(formData, "callbackUrl") || "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/login?error=Email atau password tidak valid");
    }
    throw error;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}

export async function saveGroup(formData: FormData) {
  await requireMutation("groups");
  const parsed = groupSchema.parse({ name: value(formData, "name") });
  const id = value(formData, "id");

  if (id) {
    await getDb().update(farmerGroups).set({ ...parsed, updatedAt: new Date() }).where(eq(farmerGroups.id, idSchema.parse(id)));
  } else {
    await getDb().insert(farmerGroups).values(parsed);
  }

  revalidatePath(resourcePaths.groups);
  redirect(`${resourcePaths.groups}?success=Kelompok tani berhasil disimpan`);
}

export async function saveFarmer(formData: FormData) {
  await requireMutation("farmers");
  const parsed = farmerSchema.parse({
    name: value(formData, "name"),
    phone: value(formData, "phone"),
    address: value(formData, "address"),
    groupId: value(formData, "groupId"),
  });
  const id = value(formData, "id");

  if (id) {
    await getDb().update(farmers).set({ ...parsed, updatedAt: new Date() }).where(eq(farmers.id, idSchema.parse(id)));
  } else {
    await getDb().insert(farmers).values(parsed);
  }

  revalidatePath(resourcePaths.farmers);
  redirect(`${resourcePaths.farmers}?success=Petani berhasil disimpan`);
}

export async function saveMaterial(formData: FormData) {
  await requireMutation("materials");
  const parsed = materialSchema.parse({ name: value(formData, "name"), unit: value(formData, "unit") });
  const id = value(formData, "id");

  if (id) {
    await getDb().update(materials).set({ ...parsed, updatedAt: new Date() }).where(eq(materials.id, idSchema.parse(id)));
  } else {
    await getDb().insert(materials).values(parsed);
  }

  revalidatePath(resourcePaths.materials);
  redirect(`${resourcePaths.materials}?success=Bahan baku berhasil disimpan`);
}

export async function saveProduct(formData: FormData) {
  await requireMutation("products");
  const parsed = productSchema.parse({
    name: value(formData, "name"),
    salePrice: value(formData, "salePrice"),
    costPrice: value(formData, "costPrice"),
    stock: value(formData, "stock"),
  });
  const payload = {
    name: parsed.name,
    salePrice: String(parsed.salePrice),
    costPrice: String(parsed.costPrice),
    stock: String(parsed.stock),
  };
  const id = value(formData, "id");

  if (id) {
    await getDb().update(products).set({ ...payload, updatedAt: new Date() }).where(eq(products.id, idSchema.parse(id)));
  } else {
    await getDb().insert(products).values(payload);
  }

  revalidatePath(resourcePaths.products);
  redirect(`${resourcePaths.products}?success=Produk berhasil disimpan`);
}

export async function saveHarvest(formData: FormData) {
  await requireMutation("harvests");
  const parsed = harvestSchema.parse({
    farmerId: value(formData, "farmerId"),
    materialId: value(formData, "materialId"),
    quantity: value(formData, "quantity"),
    quality: value(formData, "quality"),
    harvestDate: value(formData, "harvestDate"),
  });
  const payload = { ...parsed, quantity: String(parsed.quantity) };
  const id = value(formData, "id");

  if (id) {
    await getDb().update(harvests).set({ ...payload, updatedAt: new Date() }).where(eq(harvests.id, idSchema.parse(id)));
  } else {
    await getDb().insert(harvests).values(payload);
  }

  revalidatePath(resourcePaths.harvests);
  redirect(`${resourcePaths.harvests}?success=Hasil panen berhasil disimpan`);
}

export async function saveProduction(formData: FormData) {
  await requireMutation("productions");
  const parsed = productionSchema.parse({
    harvestId: value(formData, "harvestId"),
    productId: value(formData, "productId"),
    inputQuantity: value(formData, "inputQuantity"),
    outputQuantity: value(formData, "outputQuantity"),
    productionCost: value(formData, "productionCost"),
    productionDate: value(formData, "productionDate"),
  });
  const id = value(formData, "id");
  const db = getDb();

  if (id) {
    const productionId = idSchema.parse(id);
    const [existing] = await db.select().from(productions).where(eq(productions.id, productionId)).limit(1);
    if (!existing) throw new Error("Data produksi tidak ditemukan.");
    const delta = parsed.productId === existing.productId ? parsed.outputQuantity - Number(existing.outputQuantity) : parsed.outputQuantity;
    await db.update(productions).set({
      harvestId: parsed.harvestId,
      productId: parsed.productId,
      inputQuantity: String(parsed.inputQuantity),
      outputQuantity: String(parsed.outputQuantity),
      productionCost: String(parsed.productionCost),
      productionDate: parsed.productionDate,
      updatedAt: new Date(),
    }).where(eq(productions.id, productionId));
    if (parsed.productId !== existing.productId) {
      await db.execute(sql`update products set stock = stock - ${existing.outputQuantity}::numeric, updated_at = now() where id = ${existing.productId}`);
    }
    await db.execute(sql`update products set stock = stock + ${delta}::numeric, updated_at = now() where id = ${parsed.productId}`);
  } else {
    await db.insert(productions).values({
      harvestId: parsed.harvestId,
      productId: parsed.productId,
      inputQuantity: String(parsed.inputQuantity),
      outputQuantity: String(parsed.outputQuantity),
      productionCost: String(parsed.productionCost),
      productionDate: parsed.productionDate,
    });
    await db.execute(sql`update products set stock = stock + ${parsed.outputQuantity}::numeric, updated_at = now() where id = ${parsed.productId}`);
  }

  revalidatePath(resourcePaths.productions);
  revalidatePath(resourcePaths.products);
  redirect(`${resourcePaths.productions}?success=Produksi berhasil disimpan`);
}

export async function saveSale(formData: FormData) {
  await requireMutation("sales");
  const parsed = saleSchema.parse({
    productId: value(formData, "productId"),
    qty: value(formData, "qty"),
    price: value(formData, "price"),
    saleDate: value(formData, "saleDate"),
  });
  const id = value(formData, "id");
  const db = getDb();
  const [product] = await db.select().from(products).where(eq(products.id, parsed.productId)).limit(1);
  if (!product) throw new Error("Produk tidak ditemukan.");

  const total = parsed.qty * parsed.price;
  const costTotal = parsed.qty * Number(product.costPrice);

  if (id) {
    const saleId = idSchema.parse(id);
    const [existing] = await db.select().from(sales).where(eq(sales.id, saleId)).limit(1);
    if (!existing) throw new Error("Data penjualan tidak ditemukan.");
    const stockDelta = parsed.productId === existing.productId ? Number(existing.qty) - parsed.qty : -parsed.qty;
    if (parsed.productId !== existing.productId) {
      await db.execute(sql`update products set stock = stock + ${existing.qty}::numeric, updated_at = now() where id = ${existing.productId}`);
    }
    const availableResult = await db.execute<{ stock: string }>(sql`select stock::text from products where id = ${parsed.productId}`);
    const [available] = availableResult.rows;
    if (Number(available?.stock ?? 0) + (parsed.productId === existing.productId ? Number(existing.qty) : 0) < parsed.qty) {
      throw new Error("Stok produk tidak mencukupi.");
    }
    await db.update(sales).set({
      productId: parsed.productId,
      qty: String(parsed.qty),
      price: String(parsed.price),
      total: String(total),
      costTotal: String(costTotal),
      saleDate: parsed.saleDate,
      updatedAt: new Date(),
    }).where(eq(sales.id, saleId));
    await db.execute(sql`update products set stock = stock + ${stockDelta}::numeric, updated_at = now() where id = ${parsed.productId}`);
  } else {
    if (Number(product.stock) < parsed.qty) throw new Error("Stok produk tidak mencukupi.");
    await db.insert(sales).values({
      productId: parsed.productId,
      qty: String(parsed.qty),
      price: String(parsed.price),
      total: String(total),
      costTotal: String(costTotal),
      saleDate: parsed.saleDate,
    });
    await db.execute(sql`update products set stock = stock - ${parsed.qty}::numeric, updated_at = now() where id = ${parsed.productId}`);
  }

  revalidatePath(resourcePaths.sales);
  revalidatePath(resourcePaths.products);
  redirect(`${resourcePaths.sales}?success=Penjualan berhasil disimpan`);
}

export async function saveUser(formData: FormData) {
  await requireMutation("users");
  const parsed = userSchema.parse({
    name: value(formData, "name"),
    email: value(formData, "email").toLowerCase(),
    password: value(formData, "password"),
    role: value(formData, "role"),
    isActive: boolValue(formData, "isActive"),
  });
  const id = value(formData, "id");

  if (!id && !parsed.password) throw new Error("Password wajib diisi untuk user baru.");
  const payload: Partial<typeof users.$inferInsert> = {
    name: parsed.name,
    email: parsed.email,
    role: parsed.role,
    isActive: parsed.isActive,
    updatedAt: new Date(),
  };
  if (parsed.password) payload.passwordHash = await bcrypt.hash(parsed.password, 12);

  if (id) {
    await getDb().update(users).set(payload).where(eq(users.id, idSchema.parse(id)));
  } else {
    await getDb().insert(users).values({
      name: parsed.name,
      email: parsed.email,
      passwordHash: await bcrypt.hash(parsed.password ?? "", 12),
      role: parsed.role,
      isActive: parsed.isActive,
    });
  }

  revalidatePath(resourcePaths.users);
  redirect(`${resourcePaths.users}?success=Pengguna berhasil disimpan`);
}

export async function saveSettings(formData: FormData) {
  await requireMutation("settings");
  const parsed = settingsSchema.parse({
    systemName: value(formData, "systemName"),
    logoUrl: value(formData, "logoUrl"),
    description: value(formData, "description"),
  });
  const id = value(formData, "id");
  const payload = { ...parsed, logoUrl: parsed.logoUrl || null };

  if (id) {
    await getDb().update(settings).set({ ...payload, updatedAt: new Date() }).where(eq(settings.id, idSchema.parse(id)));
  } else {
    await getDb().insert(settings).values(payload);
  }

  revalidatePath(resourcePaths.settings);
  redirect(`${resourcePaths.settings}?success=Pengaturan berhasil disimpan`);
}

export async function deleteResource(resource: Resource, id: string) {
  await requireMutation(resource);
  const parsedId = idSchema.parse(id);
  const db = getDb();

  if (resource === "groups") await db.delete(farmerGroups).where(eq(farmerGroups.id, parsedId));
  if (resource === "farmers") await db.delete(farmers).where(eq(farmers.id, parsedId));
  if (resource === "materials") await db.delete(materials).where(eq(materials.id, parsedId));
  if (resource === "products") await db.delete(products).where(eq(products.id, parsedId));
  if (resource === "harvests") await db.delete(harvests).where(eq(harvests.id, parsedId));
  if (resource === "users") await db.delete(users).where(eq(users.id, parsedId));
  if (resource === "settings") await db.delete(settings).where(eq(settings.id, parsedId));
  if (resource === "productions") {
    const [existing] = await db.select().from(productions).where(eq(productions.id, parsedId)).limit(1);
    if (existing) {
      await db.delete(productions).where(eq(productions.id, parsedId));
      await db.execute(sql`update products set stock = stock - ${existing.outputQuantity}::numeric, updated_at = now() where id = ${existing.productId}`);
    }
  }
  if (resource === "sales") {
    const [existing] = await db.select().from(sales).where(eq(sales.id, parsedId)).limit(1);
    if (existing) {
      await db.delete(sales).where(eq(sales.id, parsedId));
      await db.execute(sql`update products set stock = stock + ${existing.qty}::numeric, updated_at = now() where id = ${existing.productId}`);
    }
  }

  revalidatePath(resourcePaths[resource]);
  redirect(`${resourcePaths[resource]}?success=Data berhasil dihapus`);
}
