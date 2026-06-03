import { saveUser } from "@/app/actions";
import { DataTable } from "@/components/data/data-table";
import { Badge } from "@/components/ui/badge";
import { CreatePanel, PageHeader, RowActions } from "@/features/crud-components";
import { listUsers } from "@/db/queries";

export default async function UsersPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const data = await listUsers({ q: params.q, page: Number(params.page ?? 1), sort: params.sort, dir: params.dir });
  const roleOptions = [
    { id: "ADMIN", label: "ADMIN" },
    { id: "PEGAWAI", label: "PEGAWAI" },
    { id: "MANAJER", label: "MANAJER" },
  ];
  const fields = (row?: (typeof data.rows)[number]) => [
    { name: "name", label: "Nama", value: row?.name },
    { name: "email", label: "Email", type: "email" as const, value: row?.email },
    { name: "password", label: row ? "Password Baru" : "Password", type: "password" as const, required: !row },
    { name: "role", label: "Role", type: "select" as const, options: roleOptions, value: row?.role },
    { name: "isActive", label: "Aktif", type: "checkbox" as const, checked: row?.isActive ?? true },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Pengguna" description="Kelola akun, role, status aktivasi, dan reset password." />
      <CreatePanel title="Tambah Pengguna" action={saveUser} fields={fields()} />
      <DataTable
        rows={data.rows}
        columns={[
          { key: "name", label: "Nama", sortable: true },
          { key: "email", label: "Email", sortable: true },
          { key: "role", label: "Role", sortable: true, render: (row) => <Badge>{row.role}</Badge> },
          { key: "isActive", label: "Status", render: (row) => <Badge variant={row.isActive ? "success" : "danger"}>{row.isActive ? "Aktif" : "Nonaktif"}</Badge> },
        ]}
        search={params.q ?? ""}
        sort={params.sort ?? "name"}
        dir={params.dir ?? "asc"}
        page={data.page}
        totalPages={data.totalPages}
        basePath="/users"
        exportResource="users"
        actions={(row) => <RowActions resource="users" id={row.id} action={saveUser} fields={fields(row)} />}
      />
    </div>
  );
}
