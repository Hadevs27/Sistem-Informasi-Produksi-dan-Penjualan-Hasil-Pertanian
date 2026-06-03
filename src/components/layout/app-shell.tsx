"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import {
  BarChart3,
  Boxes,
  ChevronLeft,
  FileText,
  LayoutDashboard,
  Menu,
  Package,
  Settings,
  ShoppingCart,
  Sprout,
  Users,
  Wheat,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/rbac";
import { canAccessPath } from "@/lib/rbac";
import { LogoutButton } from "@/components/layout/logout-button";

const navigation = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/master/kelompok-tani", label: "Kelompok Tani", icon: Sprout },
  { href: "/master/petani", label: "Petani", icon: Users },
  { href: "/master/bahan-baku", label: "Bahan Baku", icon: Wheat },
  { href: "/master/produk", label: "Produk", icon: Package },
  { href: "/transaksi/hasil-panen", label: "Hasil Panen", icon: Boxes },
  { href: "/transaksi/produksi", label: "Produksi", icon: BarChart3 },
  { href: "/transaksi/penjualan", label: "Penjualan", icon: ShoppingCart },
  { href: "/laporan/produksi", label: "Laporan Produksi", icon: FileText },
  { href: "/laporan/penjualan", label: "Laporan Penjualan", icon: FileText },
  { href: "/laporan/laba-rugi", label: "Laba Rugi", icon: BarChart3 },
  { href: "/users", label: "Pengguna", icon: Users },
  { href: "/settings", label: "Pengaturan", icon: Settings },
];

export function AppShell({
  children,
  role,
  name,
}: {
  children: React.ReactNode;
  role: UserRole;
  name: string;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const visibleNavigation = useMemo(() => navigation.filter((item) => canAccessPath(role, item.href)), [role]);

  const sidebar = (
    <aside
      className={cn(
        "flex h-full flex-col border-r bg-white transition-[width] duration-200",
        collapsed ? "w-20" : "w-[280px]",
      )}
      aria-label="Navigasi utama"
    >
      <div className="flex h-[72px] items-center justify-between border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-lg font-bold text-white">
            M
          </span>
          {!collapsed && (
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-slate-950">PT MACROPRIMA</span>
              <span className="block text-xs text-slate-500">Production EMS</span>
            </span>
          )}
        </Link>
        <button
          type="button"
          className="hidden rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:block"
          onClick={() => setCollapsed((value) => !value)}
          aria-label={collapsed ? "Perluas sidebar" : "Ciutkan sidebar"}
        >
          <ChevronLeft className={cn("h-4 w-4 transition", collapsed && "rotate-180")} />
        </button>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {visibleNavigation.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100",
                active && "bg-emerald-50 text-emerald-700",
                collapsed && "justify-center px-0",
              )}
              title={collapsed ? item.label : undefined}
              onClick={() => setMobileOpen(false)}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-3">
        {!collapsed && (
          <div className="mb-3 rounded-xl bg-slate-50 p-3">
            <p className="truncate text-sm font-semibold text-slate-900">{name}</p>
            <p className="text-xs text-slate-500">{role}</p>
          </div>
        )}
        <LogoutButton />
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <div className="hidden fixed inset-y-0 left-0 z-30 lg:block">{sidebar}</div>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 lg:hidden">
          <div className="h-full w-[280px] bg-white">{sidebar}</div>
          <button
            type="button"
            className="absolute right-4 top-4 rounded-full bg-white p-2"
            onClick={() => setMobileOpen(false)}
            aria-label="Tutup navigasi"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
      <div className={cn("transition-[padding] duration-200", collapsed ? "lg:pl-20" : "lg:pl-[280px]")}>
        <header className="sticky top-0 z-20 flex h-[72px] items-center gap-3 border-b bg-white/90 px-4 backdrop-blur lg:px-6">
          <button
            type="button"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Buka navigasi"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex min-w-0 flex-1 items-center">
            <label className="sr-only" htmlFor="global-search">
              Search
            </label>
            <input
              id="global-search"
              className="h-11 w-full max-w-xl rounded-xl border bg-slate-50 px-4 text-sm focus:bg-white"
            />
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
            {name.charAt(0).toUpperCase()}
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6">{children}</main>
      </div>
    </div>
  );
}
