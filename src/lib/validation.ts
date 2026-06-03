import { z } from "zod";
import { roles } from "@/lib/rbac";

export const idSchema = z.string().uuid();
export const requiredText = z.string().trim().min(1, "Wajib diisi");
export const moneySchema = z.coerce.number().min(0, "Tidak boleh negatif");
export const quantitySchema = z.coerce.number().positive("Harus lebih dari 0");
export const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Tanggal tidak valid");

export const userSchema = z.object({
  name: requiredText,
  email: z.string().trim().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter").optional().or(z.literal("")),
  role: z.enum(roles),
  isActive: z.coerce.boolean().default(true),
});

export const profileSchema = z.object({
  name: requiredText,
  password: z.string().min(8, "Password minimal 8 karakter").optional().or(z.literal("")),
});

export const groupSchema = z.object({ name: requiredText });
export const materialSchema = z.object({ name: requiredText, unit: requiredText });
export const productSchema = z.object({
  name: requiredText,
  salePrice: moneySchema,
  costPrice: moneySchema,
  stock: moneySchema,
});
export const farmerSchema = z.object({
  name: requiredText,
  phone: requiredText,
  address: requiredText,
  groupId: idSchema,
});
export const harvestSchema = z.object({
  farmerId: idSchema,
  materialId: idSchema,
  quantity: quantitySchema,
  quality: z.enum(["SANGAT_BAIK", "BAIK", "SEDANG", "BURUK"]),
  harvestDate: dateSchema,
});
export const productionSchema = z.object({
  harvestId: idSchema,
  productId: idSchema,
  inputQuantity: quantitySchema,
  outputQuantity: quantitySchema,
  productionCost: moneySchema,
  productionDate: dateSchema,
});
export const saleSchema = z.object({
  productId: idSchema,
  qty: quantitySchema,
  price: moneySchema,
  saleDate: dateSchema,
});
export const settingsSchema = z.object({
  systemName: requiredText,
  logoUrl: z.string().trim().url("URL logo tidak valid").optional().or(z.literal("")),
  description: requiredText,
});
