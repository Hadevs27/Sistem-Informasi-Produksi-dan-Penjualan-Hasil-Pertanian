import Link from "next/link";
import { ArrowDownUp, Download, Search } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/data/empty-state";
import { cn } from "@/lib/utils";

export type DataColumn<T> = {
  key: keyof T & string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
};

function nextSort(currentSort: string, currentDir: string, key: string) {
  if (currentSort !== key) return "asc";
  return currentDir === "asc" ? "desc" : "asc";
}

export function DataTable<T extends { id: string }>({
  rows,
  columns,
  search,
  sort,
  dir,
  page,
  totalPages,
  basePath,
  exportResource,
  filters,
  actions,
}: {
  rows: T[];
  columns: DataColumn<T>[];
  search: string;
  sort: string;
  dir: string;
  page: number;
  totalPages: number;
  basePath: string;
  exportResource?: string;
  filters?: React.ReactNode;
  actions?: (row: T) => React.ReactNode;
}) {
  const query = new URLSearchParams({ q: search, sort, dir });
  const hasRows = rows.length > 0;

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <form className="flex flex-col gap-3 md:flex-row md:items-end" action={basePath}>
          <div className="min-w-0 flex-1">
            <label htmlFor="table-search" className="mb-1 block text-sm font-medium text-slate-700">
              Search
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                id="table-search"
                name="q"
                defaultValue={search}
                className="h-11 w-full rounded-xl border bg-white pl-9 pr-3 text-sm shadow-sm"
              />
            </div>
          </div>
          {filters}
          <button className="h-11 rounded-xl bg-slate-900 px-4 text-sm font-medium text-white" type="submit">
            Terapkan
          </button>
          {exportResource && (
            <ButtonLink href={`/api/export/${exportResource}?${query.toString()}`} variant="outline">
              <Download className="h-4 w-4" aria-hidden="true" />
              Export
            </ButtonLink>
          )}
        </form>
      </Card>

      {!hasRows ? (
        <EmptyState title="Belum ada data" description="Data akan muncul setelah form tambah data berhasil disimpan." />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <thead className="sticky top-0 bg-slate-100 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  {columns.map((column) => {
                    const params = new URLSearchParams({
                      q: search,
                      sort: column.key,
                      dir: nextSort(sort, dir, column.key),
                      page: "1",
                    });
                    return (
                      <th key={column.key} scope="col" className="border-b px-4 py-3 font-semibold">
                        {column.sortable ? (
                          <Link className="inline-flex items-center gap-2 hover:text-slate-900" href={`${basePath}?${params}`}>
                            {column.label}
                            <ArrowDownUp className="h-3.5 w-3.5" aria-hidden="true" />
                          </Link>
                        ) : (
                          column.label
                        )}
                      </th>
                    );
                  })}
                  {actions && <th className="border-b px-4 py-3 text-right font-semibold">Aksi</th>}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={row.id} className={cn("border-b hover:bg-emerald-50/50", index % 2 === 1 && "bg-slate-50/60")}>
                    {columns.map((column) => (
                      <td key={column.key} className="px-4 py-3 align-top text-slate-700">
                        {column.render ? column.render(row) : String(row[column.key] ?? "")}
                      </td>
                    ))}
                    {actions && <td className="px-4 py-3 text-right align-top">{actions(row)}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between gap-3 border-t px-4 py-3 text-sm text-slate-600">
            <span>
              Halaman {page} dari {totalPages}
            </span>
            <div className="flex gap-2">
              <ButtonLink
                href={`${basePath}?${new URLSearchParams({ q: search, sort, dir, page: String(Math.max(1, page - 1)) })}`}
                variant="outline"
                className={cn(page <= 1 && "pointer-events-none opacity-50")}
              >
                Sebelumnya
              </ButtonLink>
              <ButtonLink
                href={`${basePath}?${new URLSearchParams({ q: search, sort, dir, page: String(Math.min(totalPages, page + 1)) })}`}
                variant="outline"
                className={cn(page >= totalPages && "pointer-events-none opacity-50")}
              >
                Berikutnya
              </ButtonLink>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
