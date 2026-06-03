import { AreaMetricChart } from "@/components/data/charts";
import { DataTable } from "@/components/data/data-table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { PageHeader } from "@/features/crud-components";
import { getReport } from "@/db/queries";
import { formatCurrency, formatNumber } from "@/lib/format";

type ProductionReportRow = { id: string; month: string; totalOutput: string; totalInput: string; cost: string };

export default async function ProductionReportPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const report = (await getReport("production", { from: params.from, to: params.to })) as Omit<ProductionReportRow, "id">[];
  const rows = report.map((row) => ({ ...row, id: row.month }));
  const totalOutput = rows.reduce((sum, row) => sum + Number(row.totalOutput), 0);
  const totalInput = rows.reduce((sum, row) => sum + Number(row.totalInput), 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Laporan Produksi" description="Rekap total produksi dan bahan digunakan per periode." />
      <section className="grid gap-4 md:grid-cols-3">
        <Card><CardContent><p className="text-sm text-slate-500">Total Produksi</p><p className="mt-2 text-3xl font-semibold">{formatNumber(totalOutput)}</p></CardContent></Card>
        <Card><CardContent><p className="text-sm text-slate-500">Total Bahan</p><p className="mt-2 text-3xl font-semibold">{formatNumber(totalInput)}</p></CardContent></Card>
        <Card><CardContent><p className="text-sm text-slate-500">Biaya Produksi</p><p className="mt-2 text-3xl font-semibold">{formatCurrency(rows.reduce((s, r) => s + Number(r.cost), 0))}</p></CardContent></Card>
      </section>
      <Card>
        <CardHeader><h2 className="font-semibold">Tren Produksi</h2></CardHeader>
        <CardContent><AreaMetricChart data={rows.map((row) => ({ month: row.month, value: Number(row.totalOutput) }))} dataKey="value" color="#10b981" /></CardContent>
      </Card>
      <DataTable
        rows={rows}
        columns={[
          { key: "month", label: "Periode" },
          { key: "totalInput", label: "Bahan Digunakan", render: (row) => formatNumber(row.totalInput) },
          { key: "totalOutput", label: "Total Produksi", render: (row) => formatNumber(row.totalOutput) },
          { key: "cost", label: "Biaya", render: (row) => formatCurrency(row.cost) },
        ]}
        search=""
        sort="month"
        dir="asc"
        page={1}
        totalPages={1}
        basePath="/laporan/produksi"
        exportResource="report-production"
        filters={
          <>
            <div><Label htmlFor="from">Tanggal Awal</Label><Input id="from" name="from" type="date" defaultValue={params.from} /></div>
            <div><Label htmlFor="to">Tanggal Akhir</Label><Input id="to" name="to" type="date" defaultValue={params.to} /></div>
          </>
        }
      />
    </div>
  );
}
