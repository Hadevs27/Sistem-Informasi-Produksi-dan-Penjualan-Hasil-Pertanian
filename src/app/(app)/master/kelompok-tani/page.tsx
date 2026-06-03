import { saveGroup } from "@/app/actions";
import { DataTable } from "@/components/data/data-table";
import { CreatePanel, PageHeader, RowActions } from "@/features/crud-components";
import { listGroups } from "@/db/queries";

export default async function GroupsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const data = await listGroups({ q: params.q, page: Number(params.page ?? 1), sort: params.sort, dir: params.dir });

  return (
    <div className="space-y-6">
      <PageHeader title="Kelompok Tani" description="Kelola kelompok tani dan jumlah anggota aktif." />
      <CreatePanel title="Tambah Kelompok Tani" action={saveGroup} fields={[{ name: "name", label: "Nama Kelompok" }]} />
      <DataTable
        rows={data.rows}
        columns={[
          { key: "name", label: "Nama Kelompok", sortable: true },
          { key: "memberCount", label: "Jumlah Anggota", sortable: true },
          { key: "createdAt", label: "Tanggal Dibuat", sortable: true },
        ]}
        search={params.q ?? ""}
        sort={params.sort ?? "createdAt"}
        dir={params.dir ?? "desc"}
        page={data.page}
        totalPages={data.totalPages}
        basePath="/master/kelompok-tani"
        exportResource="groups"
        actions={(row) => (
          <RowActions resource="groups" id={row.id} action={saveGroup} fields={[{ name: "name", label: "Nama Kelompok", value: row.name }]} />
        )}
      />
    </div>
  );
}
