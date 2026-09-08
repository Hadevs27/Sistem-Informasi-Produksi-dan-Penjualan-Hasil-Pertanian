export const roles = ["ADMIN", "PEGAWAI", "MANAJER"] as const;

export type UserRole = (typeof roles)[number];

export const routePermissions: Record<string, UserRole[]> = {
  "/dashboard": ["ADMIN", "PEGAWAI", "MANAJER"],
  "/master": ["ADMIN", "PEGAWAI"],
  "/transaksi": ["ADMIN", "PEGAWAI"],
  "/laporan": ["ADMIN", "MANAJER"],
  "/alerts": ["ADMIN", "PEGAWAI", "MANAJER"],
  "/ai": ["ADMIN", "MANAJER"],
  "/traceability": ["ADMIN", "PEGAWAI", "MANAJER"],
  "/users": ["ADMIN"],
  "/settings": ["ADMIN"],
  "/api/export": ["ADMIN", "PEGAWAI", "MANAJER"],
};

export function canAccessPath(role: UserRole, pathname: string) {
  const match = Object.entries(routePermissions)
    .filter(([prefix]) => pathname.startsWith(prefix))
    .sort(([a], [b]) => b.length - a.length)[0];

  if (!match) return true;
  return match[1].includes(role);
}

export function canMutate(role: UserRole, area: "master" | "transaksi" | "users" | "settings") {
  if (role === "ADMIN") return true;
  if (role === "PEGAWAI") return area === "master" || area === "transaksi";
  return false;
}

export function assertRole(role: UserRole | undefined, allowed: UserRole[]) {
  if (!role || !allowed.includes(role)) {
    throw new Error("Anda tidak memiliki izin untuk aksi ini.");
  }
}
