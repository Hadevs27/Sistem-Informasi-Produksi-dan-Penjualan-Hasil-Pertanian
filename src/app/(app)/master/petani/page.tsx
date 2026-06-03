import { saveFarmer } from "@/app/actions";
import { DataTable } from "@/components/data/data-table";
import { CreatePanel, PageHeader, RowActions } from "@/features/crud-components";
import { listFarmers, optionGroups } from "@/db/queries";

export default async function FarmersPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const [data, groups] = await Promise.all([
    listFarmers({ q: params.q, page: Number(params.page ?? 1), sort: params.sort, dir: params.dir }),
    optionGroups(),
  ]);
  const fields = (row?: (typeof data.rows)[number]) => [
    { name: "name", label: "Nama", value: row?.name },
    { name: "phone", label: "Nomor Telepon", value: row?.phone },
    { name: "groupId", label: "Kelompok Tani", type: "select" as const, options: groups, value: row?.groupId },
    { name: "address", label: "Alamat", type: "textarea" as const, value: row?.address },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Petani" description="Kelola profil petani, kontak, alamat, dan kelompok tani." />
      <CreatePanel title="Tambah Petani" action={saveFarmer} fields={fields()} />
      <DataTable
        rows={data.rows}
        columns={[
          { key: "name", label: "Nama", sortable: true },
          { key: "groupName", label: "Kelompok", sortable: true },
          { key: "phone", label: "Telepon", sortable: true },
          { key: "address", label: "Alamat" },
        ]}
        search={params.q ?? ""}
        sort={params.sort ?? "name"}
        dir={params.dir ?? "asc"}
        page={data.page}
        totalPages={data.totalPages}
        basePath="/master/petani"
        exportResource="farmers"
        actions={(row) => <RowActions resource="farmers" id={row.id} action={saveFarmer} fields={fields(row)} />}
      />
    </div>
  );
}
