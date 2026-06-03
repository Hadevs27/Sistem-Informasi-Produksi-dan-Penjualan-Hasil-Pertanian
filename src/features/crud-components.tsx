import { Pencil, Plus, Trash2 } from "lucide-react";
import { deleteResource } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input, Label, Select, Textarea } from "@/components/ui/input";

type Option = { id: string; label: string; price?: string };
type FormAction = (formData: FormData) => Promise<void>;
type Field =
  | { name: string; label: string; type?: "text" | "number" | "date" | "email" | "password"; value?: string; required?: boolean }
  | { name: string; label: string; type: "textarea"; value?: string; required?: boolean }
  | { name: string; label: string; type: "select"; value?: string; options: Option[]; required?: boolean }
  | { name: string; label: string; type: "checkbox"; checked?: boolean };

export function PageHeader({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h1 className="text-3xl font-semibold text-slate-950">{title}</h1>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}

function FieldControl({ field }: { field: Field }) {
  const id = field.name;

  if (field.type === "select") {
    return (
      <div className="space-y-1.5">
        <Label htmlFor={id}>{field.label}</Label>
        <Select id={id} name={field.name} defaultValue={field.value ?? ""} required={field.required ?? true}>
          <option value="">Pilih {field.label}</option>
          {field.options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div className="space-y-1.5 md:col-span-2">
        <Label htmlFor={id}>{field.label}</Label>
        <Textarea id={id} name={field.name} defaultValue={field.value} required={field.required ?? true} />
      </div>
    );
  }

  if (field.type === "checkbox") {
    return (
      <label className="flex items-center gap-2 rounded-xl border bg-white px-3 py-3 text-sm font-medium text-slate-700">
        <input name={field.name} type="checkbox" defaultChecked={field.checked} className="h-4 w-4 rounded border-slate-300 accent-emerald-600" />
        {field.label}
      </label>
    );
  }

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{field.label}</Label>
      <Input
        id={id}
        name={field.name}
        type={field.type ?? "text"}
        defaultValue={field.value}
        required={field.required ?? true}
        step={field.type === "number" ? "0.01" : undefined}
      />
    </div>
  );
}

export function EntityForm({
  action,
  fields,
  id,
  compact = false,
}: {
  action: FormAction;
  fields: Field[];
  id?: string;
  compact?: boolean;
}) {
  return (
    <form action={action} className="space-y-4">
      {id && <input type="hidden" name="id" value={id} />}
      <div className={compact ? "space-y-3" : "grid gap-4 md:grid-cols-2"}>
        {fields.map((field) => (
          <FieldControl key={field.name} field={field} />
        ))}
      </div>
      <Button type="submit" className={compact ? "w-full" : undefined}>
        Simpan
      </Button>
    </form>
  );
}

export function CreatePanel({
  title,
  action,
  fields,
}: {
  title: string;
  action: FormAction;
  fields: Field[];
}) {
  return (
    <Card>
      <CardHeader>
        <h2 className="flex items-center gap-2 font-semibold">
          <Plus className="h-4 w-4 text-emerald-600" aria-hidden="true" />
          {title}
        </h2>
      </CardHeader>
      <CardContent>
        <EntityForm action={action} fields={fields} />
      </CardContent>
    </Card>
  );
}

export function RowActions({
  resource,
  id,
  action,
  fields,
}: {
  resource: Parameters<typeof deleteResource>[0];
  id: string;
  action: FormAction;
  fields: Field[];
}) {
  const deleteAction = deleteResource.bind(null, resource, id);

  return (
    <div className="flex justify-end gap-2">
      <details className="relative">
        <summary className="inline-flex h-9 cursor-pointer list-none items-center justify-center gap-2 rounded-lg border bg-white px-3 text-sm font-medium hover:bg-slate-50">
          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
          Edit
        </summary>
        <div className="absolute right-0 z-10 mt-2 w-80 rounded-xl border bg-white p-4 text-left shadow-xl">
          <EntityForm action={action} fields={fields} id={id} compact />
        </div>
      </details>
      <form action={deleteAction}>
        <Button type="submit" variant="danger" className="h-9 rounded-lg px-3">
          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          Hapus
        </Button>
      </form>
    </div>
  );
}
