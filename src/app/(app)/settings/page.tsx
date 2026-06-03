import { saveSettings } from "@/app/actions";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PageHeader, EntityForm } from "@/features/crud-components";
import { getSettings } from "@/db/queries";

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-6">
      <PageHeader title="Pengaturan" description="Atur identitas aplikasi, logo, dan deskripsi sistem." />
      <Card className="max-w-3xl">
        <CardHeader>
          <h2 className="font-semibold">Pengaturan Sistem</h2>
        </CardHeader>
        <CardContent>
          <EntityForm
            action={saveSettings}
            id={settings?.id}
            fields={[
              { name: "systemName", label: "Nama Aplikasi", value: settings?.systemName ?? "Caesar Laporan Pertanian" },
              { name: "logoUrl", label: "Logo URL", value: settings?.logoUrl ?? "", required: false },
              { name: "description", label: "Deskripsi Sistem", type: "textarea", value: settings?.description ?? "Sistem informasi produksi dan penjualan hasil pertanian." },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
