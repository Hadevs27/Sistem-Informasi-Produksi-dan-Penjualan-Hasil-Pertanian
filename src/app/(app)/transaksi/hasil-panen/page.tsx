import { saveHarvest } from "@/app/actions";
import { DataTable } from "@/components/data/data-table";
import { Badge } from "@/components/ui/badge";
import { Input, Label } from "@/components/ui/input";
import { CreatePanel, PageHeader, RowActions } from "@/features/crud-components";
import { listHarvests, optionFarmers, optionMaterials } from "@/db/queries";
import { formatDate, formatNumber } from "@/lib/format";

const qualityBadge = {
  SANGAT_BAIK: "success",
  BAIK: "success",
  SEDANG: "warning",
  BURUK: "danger",
} as const;

export default async function HarvestsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const [data, farmers, materials] = await Promise.all([
    listHarvests({ q: params.q, page: Number(params.page ?? 1), sort: params.sort, dir: params.dir, from: params.from, to: params.to }),
    optionFarmers(),
    optionMaterials(),
  ]);
  const fields = (row?: (typeof data.rows)[number]) => [
    { name: "farmerId", label: "Petani", type: "select" as const, options: farmers, value: row?.farmerId },
    { name: "materialId", label: "Bahan", type: "select" as const, options: materials, value: row?.materialId },
    { name: "quantity", label: "Jumlah", type: "number" as const, value: row?.quantity },
    {
      name: "quality",
      label: "Kualitas",
      type: "select" as const,
      value: row?.quality,
      options: [
        { id: "SANGAT_BAIK", label: "Sangat Baik" },
        { id: "BAIK", label: "Baik" },
        { id: "SEDANG", label: "Sedang" },
        { id: "BURUK", label: "Buruk" },
      ],
    },
    { name: "harvestDate", label: "Tanggal Panen", type: "date" as const, value: row?.harvestDate },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Hasil Panen" description="Catat hasil panen berdasarkan petani, bahan, jumlah, kualitas, dan tanggal." />
      <CreatePanel title="Tambah Hasil Panen" action={saveHarvest} fields={fields()} />
      <DataTable
        rows={data.rows}
        columns={[
          { key: "harvestDate", label: "Tanggal", sortable: true, render: (row) => formatDate(row.harvestDate) },
          { key: "farmerName", label: "Petani", sortable: true },
          { key: "materialName", label: "Bahan", sortable: true },
          { key: "quantity", label: "Jumlah", sortable: true, render: (row) => `${formatNumber(row.quantity)} ${row.unit}` },
          {
            key: "quality",
            label: "Kualitas",
            render: (row) => <Badge variant={qualityBadge[row.quality as keyof typeof qualityBadge]}>{row.quality.replace("_", " ")}</Badge>,
          },
        ]}
        search={params.q ?? ""}
        sort={params.sort ?? "harvestDate"}
        dir={params.dir ?? "desc"}
        page={data.page}
        totalPages={data.totalPages}
        basePath="/transaksi/hasil-panen"
        exportResource="harvests"
        filters={
          <>
            <div>
              <Label htmlFor="from">Tanggal Awal</Label>
              <Input id="from" name="from" type="date" defaultValue={params.from} />
            </div>
            <div>
              <Label htmlFor="to">Tanggal Akhir</Label>
              <Input id="to" name="to" type="date" defaultValue={params.to} />
            </div>
          </>
        }
        actions={(row) => <RowActions resource="harvests" id={row.id} action={saveHarvest} fields={fields(row)} />}
      />
    </div>
  );
}
