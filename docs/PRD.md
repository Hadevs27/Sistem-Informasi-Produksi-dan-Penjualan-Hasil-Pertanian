# PRD - Sistem Informasi Produksi dan Penjualan Hasil Pertanian

## 1. Project Overview

### Nama Produk

Sistem Informasi Produksi dan Penjualan Hasil Pertanian

### Tujuan

Membangun sistem berbasis web untuk mengelola proses produksi hasil pertanian secara terintegrasi mulai dari pengelolaan petani, hasil panen, pengolahan bahan, produk jadi, penjualan, hingga analisis laba-rugi.

### Platform

* Web Application
* Responsive Desktop & Mobile
* Multi User

---

# 2. Technology Stack

## Frontend

* Next.js 15
* TypeScript
* Tailwind CSS
* Shadcn UI

## Backend

* Next.js Server Actions
* Route Handlers

## Database

* Neon PostgreSQL

## ORM

* Drizzle ORM

## Authentication

* Auth.js (NextAuth v5)

## Validation

* Zod

## Deployment

* Vercel

## Charts

* Recharts

---

# 3. User Roles

## Admin

Hak akses:

* Mengelola seluruh data
* Mengelola pengguna
* Mengelola pengaturan sistem
* Melihat seluruh laporan

---

## Pegawai

Hak akses:

* Mengelola data petani
* Mengelola hasil panen
* Mengelola produksi
* Mengelola penjualan

---

## Manajer

Hak akses:

* Dashboard
* Monitoring
* Laporan
* Analisis laba rugi

Tidak dapat mengubah master data.

---

# 4. Business Flow

Kelompok Tani
↓
Petani
↓
Hasil Panen
↓
Pengolahan Produksi
↓
Produk Jadi
↓
Penjualan
↓
Laporan
↓
Analisis Laba Rugi

---

# 5. Functional Requirements

## Modul Authentication

### Login

User dapat login menggunakan:

* Email
* Password

Validasi:

* Email terdaftar
* Password benar

---

### Logout

User dapat keluar dari sistem.

---

### Profile

User dapat:

* Mengubah nama
* Mengubah password

---

# Modul Dashboard

## Dashboard Summary

Menampilkan:

* Total Kelompok Tani
* Total Petani
* Total Hasil Panen
* Total Produk
* Total Penjualan

---

## Dashboard Analytics

Menampilkan:

* Grafik Produksi Bulanan
* Grafik Penjualan Bulanan
* Produk Terlaris
* Petani Paling Produktif

---

# Modul Kelompok Tani

## List Kelompok Tani

Kolom:

* Nama Kelompok
* Jumlah Anggota
* Tanggal Dibuat

---

## CRUD Kelompok Tani

Admin dapat:

* Tambah
* Edit
* Hapus
* Cari

---

# Modul Petani

## Data Petani

Field:

* Nama
* Nomor Telepon
* Alamat
* Kelompok Tani

---

## CRUD Petani

Admin dan Pegawai dapat:

* Tambah
* Edit
* Hapus
* Cari

---

# Modul Bahan Baku

## Data Bahan

Field:

* Nama Bahan
* Satuan

Contoh:

* Kg
* Liter
* Karung

---

## CRUD Bahan

Admin dan Pegawai dapat:

* Tambah
* Edit
* Hapus

---

# Modul Hasil Panen

## Input Hasil Panen

Field:

* Petani
* Bahan
* Jumlah
* Kualitas
* Tanggal Panen

---

## Status Kualitas

Pilihan:

* Sangat Baik
* Baik
* Sedang
* Buruk

---

## Fitur

* Tambah data panen
* Edit data panen
* Hapus data panen
* Filter tanggal

---

# Modul Produksi

## Input Produksi

Field:

* Hasil Panen
* Produk
* Jumlah Bahan Masuk
* Jumlah Produk Keluar
* Tanggal Produksi

---

## Tracking Produksi

Sistem menyimpan:

* Bahan yang digunakan
* Produk yang dihasilkan
* Rasio produksi

Contoh:

500 Kg Kedelai
↓
Produksi
↓
300 Kg Tempe

---

## Fitur

* Tambah Produksi
* Edit Produksi
* Hapus Produksi
* Riwayat Produksi

---

# Modul Produk

## Master Produk

Field:

* Nama Produk
* Harga Jual
* Stok

---

## CRUD Produk

* Tambah
* Edit
* Hapus
* Cari

---

# Modul Penjualan

## Input Penjualan

Field:

* Produk
* Qty
* Harga
* Total
* Tanggal

---

## Fitur

* Tambah Penjualan
* Edit Penjualan
* Hapus Penjualan
* Filter Periode

---

# Modul Laporan

## Laporan Produksi

Filter:

* Harian
* Bulanan
* Tahunan

Output:

* Total Produksi
* Total Bahan Digunakan

---

## Laporan Penjualan

Filter:

* Harian
* Bulanan
* Tahunan

Output:

* Total Transaksi
* Total Omzet

---

# Modul Analisis Laba Rugi

## Perhitungan

## Revenue

# Cost

Profit

---

## Dashboard Profit

Menampilkan:

* Total Pendapatan
* Total Pengeluaran
* Total Profit
* Produk Terlaris
* Produk Profit Tertinggi
* Produk Merugi

---

# Modul User Management

## Data User

Field:

* Nama
* Email
* Role
* Status

---

## Fitur

* Tambah User
* Edit User
* Hapus User
* Reset Password
* Aktivasi User

---

# Modul Settings

## Pengaturan Sistem

Field:

* Nama Aplikasi
* Logo
* Deskripsi Sistem

---

# 6. Non Functional Requirements

## Security

* Password Hashing (bcrypt)
* Session Authentication
* Role Based Access Control
* CSRF Protection

---

## Performance

* Server Side Rendering
* Pagination
* Lazy Loading

---

## Scalability

Sistem harus mampu menangani:

* 10.000+ data petani
* 100.000+ data transaksi

---

# 7. Database Tables

## Core Tables

* users
* farmer_groups
* farmers
* materials
* harvests
* products
* productions
* sales
* settings

---

# 8. Future Features

## Phase 2

* Export PDF
* Export Excel
* Notifikasi WhatsApp
* Audit Log
* Barcode Produk
* QR Code Tracking Produksi

---

# 9. Success Metrics

* Pengurangan pencatatan manual
* Monitoring produksi real-time
* Laporan otomatis
* Analisis laba-rugi lebih cepat
* Akurasi data produksi meningkat

---

# 10. MVP Scope

Versi pertama wajib mencakup:

* Authentication
* Dashboard
* Kelompok Tani
* Petani
* Bahan Baku
* Hasil Panen
* Produksi
* Produk
* Penjualan
* Laporan
* Laba Rugi
* User Management
