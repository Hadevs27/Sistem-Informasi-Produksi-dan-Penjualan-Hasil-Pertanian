import { saveMaterial } from "@/app/actions";
import { DataTable } from "@/components/data/data-table";
import { CreatePanel, PageHeader, RowActions } from "@/features/crud-components";
import { listMaterials } from "@/db/queries";

export default async function MaterialsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const data = await listMaterials({ q: params.q, page: Number(params.page ?? 1), sort: params.sort, dir: params.dir });
  const fields = (row?: (typeof data.rows)[number]) => [
    { name: "name", label: "Nama Bahan", value: row?.name },
    { name: "unit", label: "Satuan", value: row?.unit },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Bahan Baku" description="Kelola bahan pertanian seperti Kg, Liter, dan Karung." />
      <CreatePanel title="Tambah Bahan" action={saveMaterial} fields={fields()} />
      <DataTable
        rows={data.rows}
        columns={[
          { key: "name", label: "Nama Bahan", sortable: true },
          { key: "unit", label: "Satuan", sortable: true },
        ]}
        search={params.q ?? ""}
        sort={params.sort ?? "name"}
        dir={params.dir ?? "asc"}
        page={data.page}
        totalPages={data.totalPages}
        basePath="/master/bahan-baku"
        exportResource="materials"
        actions={(row) => <RowActions resource="materials" id={row.id} action={saveMaterial} fields={fields(row)} />}
      />
    </div>
  );
}
