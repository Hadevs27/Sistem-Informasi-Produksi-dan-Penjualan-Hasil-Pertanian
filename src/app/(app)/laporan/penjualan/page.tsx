import { AreaMetricChart } from "@/components/data/charts";
import { DataTable } from "@/components/data/data-table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { PageHeader } from "@/features/crud-components";
import { getReport } from "@/db/queries";
import { formatCurrency, formatNumber } from "@/lib/format";

type SalesReportRow = { id: string; month: string; transactions: string; revenue: string };

export default async function SalesReportPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const report = (await getReport("sales", { from: params.from, to: params.to })) as Omit<SalesReportRow, "id">[];
  const rows = report.map((row) => ({ ...row, id: row.month }));
  const totalRevenue = rows.reduce((sum, row) => sum + Number(row.revenue), 0);
  const totalTransactions = rows.reduce((sum, row) => sum + Number(row.transactions), 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Laporan Penjualan" description="Rekap transaksi dan omzet berdasarkan periode." />
      <section className="grid gap-4 md:grid-cols-2">
        <Card><CardContent><p className="text-sm text-slate-500">Total Transaksi</p><p className="mt-2 text-3xl font-semibold">{formatNumber(totalTransactions)}</p></CardContent></Card>
        <Card><CardContent><p className="text-sm text-slate-500">Total Omzet</p><p className="mt-2 text-3xl font-semibold">{formatCurrency(totalRevenue)}</p></CardContent></Card>
      </section>
      <Card>
        <CardHeader><h2 className="font-semibold">Tren Penjualan</h2></CardHeader>
        <CardContent><AreaMetricChart data={rows.map((row) => ({ month: row.month, value: Number(row.revenue) }))} dataKey="value" color="#0f172a" /></CardContent>
      </Card>
      <DataTable
        rows={rows}
        columns={[
          { key: "month", label: "Periode" },
          { key: "transactions", label: "Transaksi", render: (row) => formatNumber(row.transactions) },
          { key: "revenue", label: "Omzet", render: (row) => formatCurrency(row.revenue) },
        ]}
        search=""
        sort="month"
        dir="asc"
        page={1}
        totalPages={1}
        basePath="/laporan/penjualan"
        exportResource="report-sales"
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
