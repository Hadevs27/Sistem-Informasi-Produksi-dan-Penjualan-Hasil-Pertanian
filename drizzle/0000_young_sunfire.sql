CREATE TYPE "public"."quality" AS ENUM('SANGAT_BAIK', 'BAIK', 'SEDANG', 'BURUK');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('ADMIN', 'PEGAWAI', 'MANAJER');--> statement-breakpoint
CREATE TABLE "farmer_groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "farmers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"address" text NOT NULL,
	"group_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "harvests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"farmer_id" uuid NOT NULL,
	"material_id" uuid NOT NULL,
	"quantity" numeric(14, 2) NOT NULL,
	"quality" "quality" NOT NULL,
	"harvest_date" date NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "materials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"unit" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "productions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"harvest_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"input_quantity" numeric(14, 2) NOT NULL,
	"output_quantity" numeric(14, 2) NOT NULL,
	"production_cost" numeric(14, 2) DEFAULT '0' NOT NULL,
	"production_date" date NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"sale_price" numeric(14, 2) NOT NULL,
	"cost_price" numeric(14, 2) DEFAULT '0' NOT NULL,
	"stock" numeric(14, 2) DEFAULT '0' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sales" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"qty" numeric(14, 2) NOT NULL,
	"price" numeric(14, 2) NOT NULL,
	"total" numeric(14, 2) NOT NULL,
	"cost_total" numeric(14, 2) DEFAULT '0' NOT NULL,
	"sale_date" date NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"system_name" text NOT NULL,
	"logo_url" text,
	"description" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" "role" NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "farmers" ADD CONSTRAINT "farmers_group_id_farmer_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."farmer_groups"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "harvests" ADD CONSTRAINT "harvests_farmer_id_farmers_id_fk" FOREIGN KEY ("farmer_id") REFERENCES "public"."farmers"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "harvests" ADD CONSTRAINT "harvests_material_id_materials_id_fk" FOREIGN KEY ("material_id") REFERENCES "public"."materials"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "productions" ADD CONSTRAINT "productions_harvest_id_harvests_id_fk" FOREIGN KEY ("harvest_id") REFERENCES "public"."harvests"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "productions" ADD CONSTRAINT "productions_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "sales" ADD CONSTRAINT "sales_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "farmers_group_idx" ON "farmers" USING btree ("group_id");--> statement-breakpoint
CREATE INDEX "farmers_name_idx" ON "farmers" USING btree ("name");--> statement-breakpoint
CREATE INDEX "harvests_farmer_idx" ON "harvests" USING btree ("farmer_id");--> statement-breakpoint
CREATE INDEX "harvests_material_idx" ON "harvests" USING btree ("material_id");--> statement-breakpoint
CREATE INDEX "harvests_date_idx" ON "harvests" USING btree ("harvest_date");--> statement-breakpoint
CREATE INDEX "productions_harvest_idx" ON "productions" USING btree ("harvest_id");--> statement-breakpoint
CREATE INDEX "productions_product_idx" ON "productions" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "productions_date_idx" ON "productions" USING btree ("production_date");--> statement-breakpoint
CREATE INDEX "products_name_idx" ON "products" USING btree ("name");--> statement-breakpoint
CREATE INDEX "sales_product_idx" ON "sales" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "sales_date_idx" ON "sales" USING btree ("sale_date");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_role_idx" ON "users" USING btree ("role");