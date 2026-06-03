# PT MACROPRIMA PANGAN UTAMA

Sistem Informasi Produksi dan Penjualan Hasil Pertanian berbasis Next.js 15, Auth.js v5, Drizzle ORM, dan Neon PostgreSQL. Aplikasi ini mengelola alur bisnis dari kelompok tani, petani, panen, produksi, produk jadi, penjualan, laporan, hingga analisis laba-rugi.

## Overview

Tujuan sistem adalah mengurangi pencatatan manual dan menyediakan monitoring produksi, penjualan, serta profit secara cepat dan akurat. UI dirancang modern, minimalis, responsive, accessible, dan enterprise-grade sesuai SDD.

## Business Flow

```mermaid
flowchart LR
  A["Kelompok Tani"] --> B["Petani"]
  B --> C["Hasil Panen"]
  C --> D["Pengolahan Produksi"]
  D --> E["Produk Jadi"]
  E --> F["Penjualan"]
  F --> G["Laporan"]
  G --> H["Analisis Laba Rugi"]
```

## Kerangka Berpikir

```mermaid
mindmap
  root((Sistem Pertanian))
    Master Data
      Kelompok Tani
      Petani
      Bahan Baku
      Produk
    Transaksi
      Hasil Panen
      Produksi
      Penjualan
    Analitik
      Dashboard
      Laporan Produksi
      Laporan Penjualan
      Laba Rugi
    Governance
      Auth.js
      RBAC
      Validasi Zod
      Drizzle ORM
```

## Use Case Diagram

```mermaid
flowchart TD
  Admin["ADMIN"] --> UC1["Kelola semua data"]
  Admin --> UC2["Kelola pengguna"]
  Admin --> UC3["Kelola pengaturan"]
  Pegawai["PEGAWAI"] --> UC4["Kelola master data operasional"]
  Pegawai --> UC5["Kelola panen, produksi, penjualan"]
  Manajer["MANAJER"] --> UC6["Lihat dashboard"]
  Manajer --> UC7["Lihat laporan"]
  Manajer --> UC8["Analisis laba-rugi"]
```

## Activity Diagram

```mermaid
flowchart TD
  Start([Mulai]) --> Login["Login email dan password"]
  Login --> Role{"Role valid?"}
  Role -->|ADMIN| AdminFlow["Akses penuh"]
  Role -->|PEGAWAI| StaffFlow["Kelola data operasional"]
  Role -->|MANAJER| ManagerFlow["Monitoring dan laporan"]
  AdminFlow --> Save["Validasi server dan simpan"]
  StaffFlow --> Save
  ManagerFlow --> Report["Filter dan export laporan"]
  Save --> Dashboard["Dashboard terbarui"]
  Report --> Finish([Selesai])
  Dashboard --> Finish
```

## Flowchart Mutasi Stok

```mermaid
flowchart TD
  A["Input Produksi"] --> B["Validasi Zod"]
  B --> C["Insert/Update productions"]
  C --> D["Tambah stok produk"]
  E["Input Penjualan"] --> F["Validasi stok"]
  F --> G["Insert/Update sales"]
  G --> H["Kurangi stok produk"]
  H --> I["Hitung revenue, cost, profit"]
```

## ERD

```mermaid
erDiagram
  users {
    uuid id PK
    text name
    text email UK
    text password_hash
    role role
    boolean is_active
    timestamptz created_at
    timestamptz updated_at
  }
  farmer_groups ||--o{ farmers : has
  farmers ||--o{ harvests : produces
  materials ||--o{ harvests : categorized
  harvests ||--o{ productions : processed
  products ||--o{ productions : output
  products ||--o{ sales : sold
  farmer_groups {
    uuid id PK
    text name
    timestamptz created_at
    timestamptz updated_at
  }
  farmers {
    uuid id PK
    text name
    text phone
    text address
    uuid group_id FK
  }
  materials {
    uuid id PK
    text name
    text unit
  }
  harvests {
    uuid id PK
    uuid farmer_id FK
    uuid material_id FK
    numeric quantity
    quality quality
    date harvest_date
  }
  products {
    uuid id PK
    text name
    numeric sale_price
    numeric cost_price
    numeric stock
  }
  productions {
    uuid id PK
    uuid harvest_id FK
    uuid product_id FK
    numeric input_quantity
    numeric output_quantity
    numeric production_cost
    date production_date
  }
  sales {
    uuid id PK
    uuid product_id FK
    numeric qty
    numeric price
    numeric total
    numeric cost_total
    date sale_date
  }
```

## Architecture Diagram

```mermaid
flowchart LR
  Browser["Browser"] --> Next["Next.js App Router"]
  Next --> RSC["Server Components"]
  Next --> Actions["Server Actions"]
  Next --> API["Route Handlers"]
  Actions --> Zod["Zod Validation"]
  API --> RBAC["RBAC Middleware"]
  RSC --> Drizzle["Drizzle ORM"]
  Actions --> Drizzle
  Drizzle --> Neon["Neon PostgreSQL"]
  Next --> Auth["Auth.js v5 JWT Session"]
```

## Database Documentation

Tabel utama:

- `users`: akun, role tepat `ADMIN`, `PEGAWAI`, `MANAJER`, status aktif.
- `farmer_groups`: master kelompok tani.
- `farmers`: petani dengan FK ke kelompok tani.
- `materials`: bahan baku dan satuan.
- `harvests`: hasil panen dengan kualitas `SANGAT_BAIK`, `BAIK`, `SEDANG`, `BURUK`.
- `products`: produk jadi, harga jual, harga pokok, stok.
- `productions`: konversi panen menjadi produk jadi dan biaya produksi.
- `sales`: transaksi penjualan, total, dan cost untuk laba-rugi.
- `settings`: identitas aplikasi.

Semua tabel memiliki `id`, `created_at`, dan `updated_at`. Foreign key memakai cascade untuk mencegah orphan data. Index dibuat pada email, role, relasi utama, tanggal transaksi, dan nama produk/petani.

## Role Matrix

| Modul | ADMIN | PEGAWAI | MANAJER |
|---|---:|---:|---:|
| Dashboard | Read | Read | Read |
| Kelompok Tani | CRUD | CRUD | No Access |
| Petani | CRUD | CRUD | No Access |
| Bahan Baku | CRUD | CRUD | No Access |
| Produk | CRUD | CRUD | No Access |
| Hasil Panen | CRUD | CRUD | No Access |
| Produksi | CRUD | CRUD | No Access |
| Penjualan | CRUD | CRUD | No Access |
| Laporan Produksi | Read/Export | No Access | Read/Export |
| Laporan Penjualan | Read/Export | No Access | Read/Export |
| Laba Rugi | Read/Export | No Access | Read/Export |
| User Management | CRUD | No Access | No Access |
| Settings | CRUD | No Access | No Access |

## Installation Guide

1. Install dependencies:

```bash
npm install
```

2. Salin environment:

```bash
cp .env.example .env
```

3. Isi `DATABASE_URL` dari Neon PostgreSQL dan `AUTH_SECRET` yang kuat.

4. Generate dan jalankan migration:

```bash
npm run db:generate
npm run db
npm run db:push
```

5. Seed data demo:

```bash
npm run db:seed
```

6. Jalankan aplikasi:

```bash
npm run dev
```

## Deployment Guide

1. Buat project Vercel dari repository ini.
2. Tambahkan environment variables `DATABASE_URL`, `AUTH_SECRET`, dan `AUTH_URL`.
3. Jalankan migration ke database Neon sebelum traffic production.
4. Deploy dengan build command default `npm run build`.
5. Seed hanya untuk demo/staging; untuk production nyata gunakan data bisnis aktual.

## Demo Accounts

Password seluruh akun demo:

```text
password123
```

| Role | Email |
|---|---|
| ADMIN | admin@example.com |
| PEGAWAI | pegawai@example.com |
| MANAJER | manajer@example.com |

## QA Commands

```bash
npm run typecheck
npm run lint
npm run build
```

`npm run db:migrate` dan `npm run db:seed` membutuhkan `DATABASE_URL` Neon yang valid.
