import { getDb } from "@/db";
import { alerts } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { evaluateAlerts } from "@/lib/alerts";
import { revalidatePath } from "next/cache";
import { AlertCircle, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { getLocale } from "@/lib/i18n";
import { getDictionary } from "@/messages";

export default async function AlertsPage() {
  const db = getDb();
  const locale = await getLocale();
  const dict = getDictionary(locale);

  // Trigger evaluation on page load (in a real app, use a cron job)
  await evaluateAlerts();
  
  const allAlerts = await db.select().from(alerts).orderBy(desc(alerts.detectedAt)).limit(50);

  const severityColors = {
    CRITICAL: "bg-rose-50 border-rose-200 text-rose-700",
    WARNING: "bg-amber-50 border-amber-200 text-amber-700",
    INFO: "bg-blue-50 border-blue-200 text-blue-700",
  };

  const icons = {
    CRITICAL: <AlertCircle className="h-5 w-5 text-rose-600" />,
    WARNING: <AlertTriangle className="h-5 w-5 text-amber-600" />,
    INFO: <Info className="h-5 w-5 text-blue-600" />,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{dict.alerts.title}</h1>
        <p className="text-slate-500">Notifikasi cerdas berdasarkan performa dan risiko operasional.</p>
      </div>

      <div className="flex flex-col gap-4">
        {allAlerts.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-12 text-slate-500">
            <CheckCircle className="mb-2 h-8 w-8 text-emerald-500" />
            <p>{dict.alerts.empty}</p>
          </div>
        )}
        
        {allAlerts.map((alert) => (
          <div key={alert.id} className={`flex items-start gap-4 rounded-xl border p-4 shadow-sm transition-colors ${severityColors[alert.severity as keyof typeof severityColors]} ${alert.status !== "UNREAD" ? "opacity-60 grayscale" : ""}`}>
            <div className="mt-1 shrink-0">
              {icons[alert.severity as keyof typeof icons]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-semibold">{alert.title}</h3>
                <span className="text-xs font-medium opacity-70">
                  {new Date(alert.detectedAt).toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
                    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                  })}
                </span>
              </div>
              <p className="mt-1 text-sm opacity-90">{alert.description}</p>
              
              {alert.status === "UNREAD" && (
                <form action={async () => {
                  "use server";
                  const db = getDb();
                  await db.update(alerts).set({ status: "ACKNOWLEDGED" }).where(eq(alerts.id, alert.id));
                  revalidatePath("/alerts");
                }} className="mt-3">
                  <button type="submit" className="text-xs font-semibold underline underline-offset-2 opacity-80 hover:opacity-100">
                    Tandai sudah dibaca
                  </button>
                </form>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
