import { Activity, Boxes, Package, ShoppingCart, Sprout, Users } from "lucide-react";
import { AreaMetricChart } from "@/components/data/charts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getDashboard } from "@/db/queries";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";

function Kpi({ label, value, icon: Icon, currency = false }: { label: string; value: string; icon: typeof Users; currency?: boolean }) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">{currency ? formatCurrency(value) : formatNumber(value)}</p>
        </div>
        <span className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </CardContent>
    </Card>
  );
}

export default async function DashboardPage() {
  const data = await getDashboard();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-normal text-slate-950">Dashboard</h1>
        <p className="mt-2 text-sm text-slate-500">Ringkasan produksi, penjualan, produk, dan aktivitas terbaru.</p>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6" aria-label="Ringkasan KPI">
        <Kpi label="Total Petani" value={data.counts?.farmers ?? "0"} icon={Users} />
        <Kpi label="Total Panen" value={data.counts?.harvests ?? "0"} icon={Boxes} />
        <Kpi label="Total Produksi" value={data.counts?.production ?? "0"} icon={Package} />
        <Kpi label="Total Penjualan" value={data.counts?.sales ?? "0"} icon={ShoppingCart} />
        <Kpi label="Revenue" value={data.counts?.revenue ?? "0"} icon={Sprout} currency />
        <Kpi label="Profit" value={data.counts?.profit ?? "0"} icon={Activity} currency />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="font-semibold">Produksi Bulanan</h2>
          </CardHeader>
          <CardContent>
            <AreaMetricChart data={data.productionMonthly} dataKey="value" color="#10b981" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="font-semibold">Penjualan Bulanan</h2>
          </CardHeader>
          <CardContent>
            <AreaMetricChart data={data.salesMonthly} dataKey="value" color="#0f172a" />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <h2 className="font-semibold">Produk Terlaris</h2>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.topProducts.length === 0 && <p className="text-sm text-slate-500">Produk terlaris akan muncul setelah penjualan tercatat.</p>}
            {data.topProducts.map((product) => (
              <div key={product.name} className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-slate-900">{product.name}</p>
                  <p className="text-sm text-slate-500">{formatNumber(product.qty)} terjual</p>
                </div>
                <Badge variant="success">{formatCurrency(product.revenue)}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="font-semibold">Petani Terproduktif</h2>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.topFarmers.length === 0 && <p className="text-sm text-slate-500">Data petani produktif akan muncul setelah panen tercatat.</p>}
            {data.topFarmers.map((farmer) => (
              <div key={farmer.name} className="flex items-center justify-between gap-4">
                <span className="font-medium text-slate-900">{farmer.name}</span>
                <Badge>{formatNumber(farmer.quantity)} Kg</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-600" aria-hidden="true" />
            <h2 className="font-semibold">Aktivitas Terbaru</h2>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.activities.length === 0 && <p className="text-sm text-slate-500">Aktivitas terbaru akan muncul setelah transaksi berjalan.</p>}
            {data.activities.map((activity) => (
              <div key={`${activity.label}-${activity.createdAt}`} className="border-b pb-3 last:border-b-0 last:pb-0">
                <p className="text-sm font-medium text-slate-800">{activity.label}</p>
                <p className="mt-1 text-xs text-slate-500">{formatDate(activity.createdAt)}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
