import { ProfitTrendChart } from "@/components/data/charts";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { PageHeader } from "@/features/crud-components";
import { getReport } from "@/db/queries";
import { formatCurrency, formatNumber } from "@/lib/format";

type ProfitReport = {
  summary: { revenue: string; cost: string; profit: string; margin: string };
  trend: { month: string; revenue: string; cost: string; profit: string }[];
  products: { name: string; revenue: string; profit: string }[];
};

export default async function ProfitPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const report = (await getReport("profit", { from: params.from, to: params.to })) as ProfitReport;
  const trend = report.trend.map((row) => ({
    month: row.month,
    revenue: Number(row.revenue),
    cost: Number(row.cost),
    profit: Number(row.profit),
  }));
  const topProducts = report.products.filter((row) => Number(row.profit) >= 0);
  const lossProducts = report.products.filter((row) => Number(row.profit) < 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Laba Rugi" description="Analisis revenue, cost, profit, margin, produk tertinggi, dan produk merugi." />
      <form className="flex flex-col gap-3 rounded-xl border bg-white p-4 md:flex-row md:items-end" action="/laporan/laba-rugi">
        <div><Label htmlFor="from">Tanggal Awal</Label><Input id="from" name="from" type="date" defaultValue={params.from} /></div>
        <div><Label htmlFor="to">Tanggal Akhir</Label><Input id="to" name="to" type="date" defaultValue={params.to} /></div>
        <button className="h-11 rounded-xl bg-slate-900 px-4 text-sm font-medium text-white">Terapkan</button>
        <Link className="inline-flex h-11 items-center justify-center rounded-xl border bg-white px-4 text-sm font-medium" href="/api/export/report-profit">Export</Link>
      </form>
      <section className="grid gap-4 md:grid-cols-4">
        <Card><CardContent><p className="text-sm text-slate-500">Revenue</p><p className="mt-2 text-2xl font-semibold">{formatCurrency(report.summary.revenue)}</p></CardContent></Card>
        <Card><CardContent><p className="text-sm text-slate-500">Cost</p><p className="mt-2 text-2xl font-semibold">{formatCurrency(report.summary.cost)}</p></CardContent></Card>
        <Card><CardContent><p className="text-sm text-slate-500">Profit</p><p className="mt-2 text-2xl font-semibold">{formatCurrency(report.summary.profit)}</p></CardContent></Card>
        <Card><CardContent><p className="text-sm text-slate-500">Margin</p><p className="mt-2 text-2xl font-semibold">{formatNumber(report.summary.margin)}%</p></CardContent></Card>
      </section>
      <Card>
        <CardHeader><h2 className="font-semibold">Profit Trend</h2></CardHeader>
        <CardContent><ProfitTrendChart data={trend} /></CardContent>
      </Card>
      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader><h2 className="font-semibold">Produk Profit Tertinggi</h2></CardHeader>
          <CardContent className="space-y-3">
            {topProducts.map((row) => (
              <div key={row.name} className="flex items-center justify-between"><span className="font-medium">{row.name}</span><Badge variant="success">{formatCurrency(row.profit)}</Badge></div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><h2 className="font-semibold">Produk Merugi</h2></CardHeader>
          <CardContent className="space-y-3">
            {lossProducts.length === 0 ? <p className="text-sm text-slate-500">Tidak ada produk merugi pada periode ini.</p> : lossProducts.map((row) => (
              <div key={row.name} className="flex items-center justify-between"><span className="font-medium">{row.name}</span><Badge variant="danger">{formatCurrency(row.profit)}</Badge></div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
