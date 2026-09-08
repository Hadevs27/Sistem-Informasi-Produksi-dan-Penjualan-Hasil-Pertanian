import { getDb } from "@/db";
import { products, forecasts } from "@/db/schema";
import { generateForecast } from "@/app/actions/forecast";
import { desc } from "drizzle-orm";
import { getLocale } from "@/lib/i18n";
import { getDictionary } from "@/messages";

export default async function ForecastPage() {
  const db = getDb();
  const locale = await getLocale();
  const dict = getDictionary(locale);

  const allProducts = await db.select().from(products);
  const latestForecasts = await db.select().from(forecasts).orderBy(desc(forecasts.createdAt)).limit(20);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{dict.nav.forecast}</h1>
        <p className="text-slate-500">
          Proyeksi permintaan produk berdasarkan data historis penjualan.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {allProducts.map((p) => {
          const pForecasts = latestForecasts.filter(f => f.productId === p.id);
          const latest = pForecasts[0];
          
          return (
            <div key={p.id} className="rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">{p.name}</h3>
              <p className="text-sm text-slate-500 mb-4">Stok saat ini: <span className="font-medium text-slate-900">{p.stock}</span></p>
              
              {latest ? (
                <div className="space-y-3">
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Prediksi Permintaan (30 Hari)</p>
                    <p className="mt-1 text-2xl font-bold text-emerald-600">{Number(latest.expectedDemand).toFixed(0)} unit</p>
                    <p className="mt-1 text-xs text-slate-500">Tingkat Kepercayaan: {latest.confidence}</p>
                  </div>
                  
                  {Number(latest.expectedDemand) > Number(p.stock) && (
                    <div className="rounded-lg bg-rose-50 p-4 text-sm text-rose-700">
                      <span className="font-semibold">Risiko Kekurangan Stok!</span> Prediksi permintaan melebihi stok yang tersedia saat ini.
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-lg bg-slate-50 p-6 text-center text-sm text-slate-500">
                  Belum ada data peramalan.
                </div>
              )}
              
              <form action={async () => {
                "use server";
                await generateForecast(p.id, 30);
              }} className="mt-4">
                <button type="submit" className="w-full rounded-lg bg-white border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  Generate Forecast
                </button>
              </form>
            </div>
          );
        })}
      </div>
    </div>
  );
}
