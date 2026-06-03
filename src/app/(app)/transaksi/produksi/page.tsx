import { ArrowDown } from "lucide-react";
import { saveProduction } from "@/app/actions";
import { DataTable } from "@/components/data/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { CreatePanel, PageHeader, RowActions } from "@/features/crud-components";
import { listProductions, optionHarvests, optionProducts } from "@/db/queries";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";

export default async function ProductionsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const [data, harvests, products] = await Promise.all([
    listProductions({ q: params.q, page: Number(params.page ?? 1), sort: params.sort, dir: params.dir, from: params.from, to: params.to }),
    optionHarvests(),
    optionProducts(),
  ]);
  const fields = (row?: (typeof data.rows)[number]) => [
    { name: "harvestId", label: "Hasil Panen", type: "select" as const, options: harvests, value: row?.harvestId },
    { name: "productId", label: "Produk", type: "select" as const, options: products, value: row?.productId },
    { name: "inputQuantity", label: "Jumlah Bahan Masuk", type: "number" as const, value: row?.inputQuantity },
    { name: "outputQuantity", label: "Jumlah Produk Keluar", type: "number" as const, value: row?.outputQuantity },
    { name: "productionCost", label: "Biaya Produksi", type: "number" as const, value: row?.productionCost },
    { name: "productionDate", label: "Tanggal Produksi", type: "date" as const, value: row?.productionDate },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Produksi" description="Lacak bahan masuk, produk keluar, biaya, dan yield produksi." />
      <CreatePanel title="Tambah Produksi" action={saveProduction} fields={fields()} />
      <div className="grid gap-4 md:grid-cols-3">
        {data.rows.slice(0, 3).map((row) => (
          <Card key={row.id}>
            <CardContent className="text-center">
              <p className="text-sm font-medium text-slate-500">Input</p>
              <p className="mt-1 font-semibold">{formatNumber(row.inputQuantity)} bahan</p>
              <ArrowDown className="mx-auto my-3 h-5 w-5 text-emerald-600" aria-hidden="true" />
              <p className="text-sm font-medium text-slate-500">Output</p>
              <p className="mt-1 font-semibold">{formatNumber(row.outputQuantity)} {row.productName}</p>
              <p className="mt-3 rounded-full bg-emerald-50 py-1 text-sm font-medium text-emerald-700">Yield {row.yieldRatio}%</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <DataTable
        rows={data.rows}
        columns={[
          { key: "productionDate", label: "Tanggal", sortable: true, render: (row) => formatDate(row.productionDate) },
          { key: "harvestLabel", label: "Panen" },
          { key: "productName", label: "Produk", sortable: true },
          { key: "inputQuantity", label: "Input", render: (row) => formatNumber(row.inputQuantity) },
          { key: "outputQuantity", label: "Output", render: (row) => formatNumber(row.outputQuantity) },
          { key: "productionCost", label: "Biaya", render: (row) => formatCurrency(row.productionCost) },
          { key: "yieldRatio", label: "Yield", render: (row) => `${row.yieldRatio}%` },
        ]}
        search={params.q ?? ""}
        sort={params.sort ?? "productionDate"}
        dir={params.dir ?? "desc"}
        page={data.page}
        totalPages={data.totalPages}
        basePath="/transaksi/produksi"
        exportResource="productions"
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
        actions={(row) => <RowActions resource="productions" id={row.id} action={saveProduction} fields={fields(row)} />}
      />
    </div>
  );
}
