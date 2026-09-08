import { getDb } from "@/db";
import { traceabilityCodes, productions, products } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { QRCodeSVG } from "qrcode.react";
import { getLocale } from "@/lib/i18n";
import { getDictionary } from "@/messages";

export default async function InternalTraceabilityPage() {
  const db = getDb();
  const locale = await getLocale();
  const dict = getDictionary(locale);

  const codes = await db.select({
    id: traceabilityCodes.id,
    code: traceabilityCodes.code,
    url: traceabilityCodes.url,
    entityType: traceabilityCodes.entityType,
    productName: products.name,
    date: productions.productionDate,
  })
  .from(traceabilityCodes)
  .leftJoin(productions, eq(productions.id, traceabilityCodes.entityId))
  .leftJoin(products, eq(products.id, productions.productId))
  .orderBy(desc(traceabilityCodes.createdAt))
  .limit(20);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{dict.nav.traceability}</h1>
        <p className="text-slate-500">Kelola kode pelacakan QR untuk produksi.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {codes.map((c) => (
          <div key={c.id} className="rounded-xl border bg-white p-6 shadow-sm flex flex-col items-center text-center">
            <div className="mb-4 rounded-xl border bg-white p-2 shadow-sm">
              <QRCodeSVG value={c.url} size={150} />
            </div>
            <h3 className="font-bold font-mono text-slate-900 tracking-wider">{c.code}</h3>
            <p className="text-sm font-medium text-slate-700 mt-2">{c.productName}</p>
            <p className="text-xs text-slate-500 mt-1">Prod: {new Date(c.date!).toLocaleDateString("id-ID")}</p>
            <a href={c.url} target="_blank" rel="noreferrer" className="mt-4 text-xs font-semibold text-emerald-600 hover:underline">
              Buka Halaman Publik
            </a>
          </div>
        ))}

        {codes.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed py-12 text-center text-slate-500">
            Belum ada kode pelacakan. Generate kode dari halaman Produksi.
          </div>
        )}
      </div>
    </div>
  );
}
