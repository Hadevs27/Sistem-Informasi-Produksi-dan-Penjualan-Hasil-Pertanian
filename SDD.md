# SOFTWARE DESIGN DOCUMENT (SDD)

## Sistem Informasi Produksi dan Penjualan Hasil Pertanian

Version: 1.0

Architecture: Next.js 15 + Drizzle ORM + Neon PostgreSQL

Design System: Shadcn UI + Tailwind CSS

---

# 1. DESIGN PRINCIPLES

## Vision

Menciptakan sistem yang:

* Modern
* Minimalis
* Cepat
* Mudah digunakan
* Enterprise Ready

Inspirasi desain:

* Linear
* Notion
* Stripe Dashboard
* Vercel Dashboard
* Supabase Dashboard

---

# 2. DESIGN LANGUAGE

## Style Direction

Professional + Elegant + Clean

Karakteristik:

* Banyak whitespace
* Rounded corners
* Soft shadow
* Typography modern
* Tidak banyak warna mencolok

---

# Color Palette

## Primary

Emerald

```css
#10B981
```

Makna:

* Pertanian
* Produksi
* Pertumbuhan

---

## Secondary

Slate

```css
#0F172A
```

---

## Success

```css
#22C55E
```

---

## Warning

```css
#F59E0B
```

---

## Danger

```css
#EF4444
```

---

## Background

```css
#F8FAFC
```

---

# Typography

Font:

## Primary

Geist

Fallback:

* Inter
* Sans-serif

---

Hierarchy:

H1

48px

Bold

---

H2

36px

Semibold

---

H3

24px

Semibold

---

Body

14px - 16px

Regular

---

# 3. APPLICATION LAYOUT

## Desktop Layout

```text
┌─────────────────────────────┐
│ Header                      │
├───────┬─────────────────────┤
│       │                     │
│Sidebar│ Main Content        │
│       │                     │
│       │                     │
└───────┴─────────────────────┘
```

---

# Sidebar Width

Expanded

```css
280px
```

Collapsed

```css
80px
```

---

# Header

Height

```css
72px
```

Berisi:

* Search
* Notification
* User Profile

---

# Mobile Layout

Sidebar berubah menjadi:

Drawer Navigation

---

# 4. NAVIGATION STRUCTURE

## Dashboard

```text
/dashboard
```

---

## Master Data

```text
/master
```

Submenu:

* Kelompok Tani
* Petani
* Bahan Baku
* Produk

---

## Transaksi

```text
/transaksi
```

Submenu:

* Hasil Panen
* Produksi
* Penjualan

---

## Laporan

```text
/laporan
```

Submenu:

* Produksi
* Penjualan
* Laba Rugi

---

## Pengguna

```text
/users
```

---

## Pengaturan

```text
/settings
```

---

# 5. DASHBOARD DESIGN

## Layout

Top Section

4 KPI Cards

```text
Total Petani
Total Panen
Total Produk
Total Penjualan
```

---

Middle Section

```text
Produksi Bulanan
Penjualan Bulanan
```

Chart:

Area Chart

---

Bottom Section

```text
Produk Terlaris
Petani Terproduktif
Aktivitas Terbaru
```

---

# Dashboard Components

## KPI Card

Style:

* Rounded-xl
* Soft shadow
* Icon kiri atas
* Value besar

Contoh:

```text
1,245
Total Petani
```

---

# 6. DATA TABLE DESIGN

Gunakan:

Shadcn Data Table

Fitur:

* Search
* Pagination
* Sorting
* Column Filter
* Export

---

Style:

* Zebra rows
* Hover state
* Sticky header

---

# Table Toolbar

Kanan atas:

```text
+ Tambah Data
```

Kiri:

```text
Search
Filter
```

---

# 7. FORM DESIGN

## Layout

Max width:

```css
800px
```

---

Grid:

```css
2 columns
```

Desktop

1 column

Mobile

---

Field Style

Height:

```css
44px
```

Radius:

```css
12px
```

---

Validation

Inline Error

Contoh:

```text
Nama wajib diisi
```

Merah lembut

---

# 8. MODULE UI DESIGN

## Kelompok Tani

List View

* Data Table

Create View

* Nama Kelompok

---

## Petani

List View

Tampilkan:

* Nama
* Kelompok
* Telepon
* Alamat

---

Detail View

Profile Card

Riwayat Panen

---

## Hasil Panen

List View

Columns:

* Tanggal
* Petani
* Bahan
* Jumlah
* Kualitas

---

Quality Badge

Hijau

Sangat Baik

---

Kuning

Sedang

---

Merah

Buruk

---

## Produksi

Visual Flow

```text
Panen
↓
Produksi
↓
Produk
```

---

Production Card

Menampilkan:

Input

500 Kg Kedelai

Output

300 Kg Tempe

Yield

60%

---

## Produk

Product Card

Menampilkan:

* Nama
* Harga
* Stok

---

## Penjualan

Sales Table

Kolom:

* Produk
* Qty
* Total
* Tanggal

---

# 9. REPORT DESIGN

## Report Dashboard

Cards:

* Total Produksi
* Total Penjualan
* Profit

---

Chart

Line Chart

Per Bulan

---

Filter Section

* Tanggal Awal
* Tanggal Akhir
* Export

---

# 10. LABA RUGI MODULE

Halaman paling premium.

Layout:

Top KPI

```text
Revenue
Cost
Profit
Margin
```

---

Middle

Profit Trend Chart

---

Bottom

Top Products

Loss Products

---

# 11. ROLE BASED ACCESS

## Admin

Semua akses

---

## Pegawai

Master Data

Produksi

Penjualan

---

## Manajer

Dashboard

Laporan

Analitik

---

# 12. DESIGN SYSTEM COMPONENTS

## Core Components

* Button
* Input
* Select
* Modal
* Sheet
* Card
* Table
* Badge
* Alert
* Chart
* Avatar

---

# Button Variants

Primary

Emerald

---

Secondary

Slate

---

Danger

Red

---

Ghost

Transparent

---

# 13. RESPONSIVE STRATEGY

Breakpoint

Mobile

```css
<768px
```

Tablet

```css
768px - 1024px
```

Desktop

```css
>1024px
```

---

# 14. SECURITY DESIGN

Authentication

Auth.js

---

Authorization

Middleware RBAC

---

Protected Routes

* Dashboard
* Master Data
* Transaksi
* Laporan

---

# 15. FUTURE ENHANCEMENTS

Phase 2

* Dark Mode
* WhatsApp Notification
* Barcode Produk
* QR Tracking
* Multi Cabang
* Multi Gudang

---

# 16. UX GOALS

User dapat:

* Menambah data < 10 detik
* Menemukan data < 5 detik
* Membuat laporan < 30 detik

Tanpa perlu pelatihan khusus.

Target pengalaman pengguna:

"Sesederhana menggunakan Notion namun sekuat sistem ERP modern."
