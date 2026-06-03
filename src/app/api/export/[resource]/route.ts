import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  getReport,
  listFarmers,
  listGroups,
  listHarvests,
  listMaterials,
  listProducts,
  listProductions,
  listSales,
  listUsers,
} from "@/db/queries";
import { canAccessPath, type UserRole } from "@/lib/rbac";

const exportPermissions: Record<string, UserRole[]> = {
  groups: ["ADMIN", "PEGAWAI"],
  farmers: ["ADMIN", "PEGAWAI"],
  materials: ["ADMIN", "PEGAWAI"],
  products: ["ADMIN", "PEGAWAI"],
  harvests: ["ADMIN", "PEGAWAI"],
  productions: ["ADMIN", "PEGAWAI"],
  sales: ["ADMIN", "PEGAWAI"],
  users: ["ADMIN"],
  "report-production": ["ADMIN", "MANAJER"],
  "report-sales": ["ADMIN", "MANAJER"],
  "report-profit": ["ADMIN", "MANAJER"],
};

function csvEscape(value: unknown) {
  const text = String(value ?? "");
  if (/[",\n]/.test(text)) return `"${text.replaceAll('"', '""')}"`;
  return text;
}

function toCsv(rows: Array<Record<string, unknown>>) {
  if (rows.length === 0) return "data\n";
  const headers = Object.keys(rows[0]);
  return [headers.join(","), ...rows.map((row) => headers.map((key) => csvEscape(row[key])).join(","))].join("\n");
}

export async function GET(request: Request, { params }: { params: Promise<{ resource: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!canAccessPath(session.user.role as UserRole, "/api/export")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { resource } = await params;
  const allowedRoles = exportPermissions[resource];
  if (!allowedRoles) return NextResponse.json({ error: "Resource tidak dikenal" }, { status: 404 });
  if (!allowedRoles.includes(session.user.role as UserRole)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const url = new URL(request.url);
  const query = {
    q: url.searchParams.get("q") ?? "",
    page: 1,
    sort: url.searchParams.get("sort") ?? undefined,
    dir: url.searchParams.get("dir") ?? undefined,
    from: url.searchParams.get("from") ?? undefined,
    to: url.searchParams.get("to") ?? undefined,
  };

  let rows: Array<Record<string, unknown>> = [];
  if (resource === "groups") rows = (await listGroups(query)).rows;
  else if (resource === "farmers") rows = (await listFarmers(query)).rows;
  else if (resource === "materials") rows = (await listMaterials(query)).rows;
  else if (resource === "products") rows = (await listProducts(query)).rows;
  else if (resource === "harvests") rows = (await listHarvests(query)).rows;
  else if (resource === "productions") rows = (await listProductions(query)).rows;
  else if (resource === "sales") rows = (await listSales(query)).rows;
  else if (resource === "users") rows = (await listUsers(query)).rows;
  else if (resource === "report-production") rows = (await getReport("production", query)) as Array<Record<string, unknown>>;
  else if (resource === "report-sales") rows = (await getReport("sales", query)) as Array<Record<string, unknown>>;
  else if (resource === "report-profit") {
    const report = (await getReport("profit", query)) as { products: Array<Record<string, unknown>> };
    rows = report.products;
  }

  return new NextResponse(toCsv(rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${resource}.csv"`,
    },
  });
}
