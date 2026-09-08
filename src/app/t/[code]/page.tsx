import { getDb } from "@/db";
import { traceabilityCodes, productions, harvests, products, farmers, materials } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Package, Calendar, User } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TraceabilityPage({ params }: { params: Promise<{ code: string }> }) {
  const code = (await params).code;
  const db = getDb();
  
  const [trace] = await db.select().from(traceabilityCodes).where(eq(traceabilityCodes.code, code));
  
  if (!trace) {
    notFound();
  }

  let entityDetails = null;

  if (trace.entityType === "PRODUCTION") {
    const [prod] = await db.select({
      id: productions.id,
      date: productions.productionDate,
      output: productions.outputQuantity,
      productName: products.name,
      harvestDate: harvests.harvestDate,
      farmerName: farmers.name,
      materialName: materials.name,
    })
    .from(productions)
    .innerJoin(products, eq(products.id, productions.productId))
    .innerJoin(harvests, eq(harvests.id, productions.harvestId))
    .innerJoin(farmers, eq(farmers.id, harvests.farmerId))
    .innerJoin(materials, eq(materials.id, harvests.materialId))
    .where(eq(productions.id, trace.entityId));

    entityDetails = prod;
  }

  if (!entityDetails) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
          <h1 className="text-xl font-bold text-slate-900">Data Tidak Ditemukan</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      <div className="mx-auto max-w-md bg-white min-h-screen shadow-sm sm:min-h-0 sm:mt-12 sm:rounded-3xl sm:border sm:pb-8">
        <div className="bg-emerald-600 px-6 py-8 sm:rounded-t-3xl text-white text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
            <ScanLine className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Traceability</h1>
          <p className="mt-1 text-emerald-100 font-medium tracking-widest">{code}</p>
        </div>

        <div className="px-6 py-6 space-y-8">
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Informasi Produk</h2>
            <div className="rounded-2xl border bg-slate-50/50 p-4 space-y-4">
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="text-xs text-slate-500">Nama Produk</p>
                  <p className="font-semibold text-slate-900">{entityDetails.productName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="text-xs text-slate-500">Tanggal Produksi</p>
                  <p className="font-semibold text-slate-900">{new Date(entityDetails.date).toLocaleDateString("id-ID")}</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Sumber Bahan Baku</h2>
            <div className="relative pl-6 border-l-2 border-emerald-100 space-y-6">
              
              <div className="relative">
                <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full border-4 border-white bg-emerald-500 shadow-sm" />
                <h3 className="font-semibold text-slate-900">Panen {entityDetails.materialName}</h3>
                <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> {new Date(entityDetails.harvestDate).toLocaleDateString("id-ID")}
                </p>
                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                  <User className="h-3 w-3" /> Petani: {entityDetails.farmerName}
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full border-4 border-white bg-emerald-500 shadow-sm" />
                <h3 className="font-semibold text-slate-900">Proses Produksi</h3>
                <p className="text-sm text-slate-500 mt-1">Selesai diproses dan dikemas</p>
              </div>

              <div className="relative">
                <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full border-4 border-white bg-slate-300 shadow-sm" />
                <h3 className="font-semibold text-slate-900">Distribusi</h3>
                <p className="text-sm text-slate-500 mt-1">Siap didistribusikan</p>
              </div>

            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

import { ScanLine } from "lucide-react";
