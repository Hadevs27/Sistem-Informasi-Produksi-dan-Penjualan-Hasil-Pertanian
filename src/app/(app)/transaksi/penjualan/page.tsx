import { saveSale } from "@/app/actions";
import { DataTable } from "@/components/data/data-table";
import { Input, Label } from "@/components/ui/input";
import { CreatePanel, PageHeader, RowActions } from "@/features/crud-components";
import { listSales, optionProducts } from "@/db/queries";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";

export default async function SalesPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const [data, products] = await Promise.all([
    listSales({ q: params.q, page: Number(params.page ?? 1), sort: params.sort, dir: params.dir, from: params.from, to: params.to }),
    optionProducts(),
  ]);
  const fields = (row?: (typeof data.rows)[number]) => [
    { name: "productId", label: "Produk", type: "select" as const, options: products, value: row?.productId },
    { name: "qty", label: "Qty", type: "number" as const, value: row?.qty },
    { name: "price", label: "Harga", type: "number" as const, value: row?.price },
    { name: "saleDate", label: "Tanggal", type: "date" as const, value: row?.saleDate },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Penjualan" description="Catat transaksi produk, qty, harga, total, dan periode penjualan." />
      <CreatePanel title="Tambah Penjualan" action={saveSale} fields={fields()} />
      <DataTable
        rows={data.rows}
        columns={[
          { key: "saleDate", label: "Tanggal", sortable: true, render: (row) => formatDate(row.saleDate) },
          { key: "productName", label: "Produk", sortable: true },
          { key: "qty", label: "Qty", sortable: true, render: (row) => formatNumber(row.qty) },
          { key: "price", label: "Harga", render: (row) => formatCurrency(row.price) },
          { key: "total", label: "Total", sortable: true, render: (row) => formatCurrency(row.total) },
        ]}
        search={params.q ?? ""}
        sort={params.sort ?? "saleDate"}
        dir={params.dir ?? "desc"}
        page={data.page}
        totalPages={data.totalPages}
        basePath="/transaksi/penjualan"
        exportResource="sales"
        filters={
          <>
            <div>
              <Label htmlFor="from">Tanggal Awal</Label>
              <Input id="from" name="from" type="date" defaultValue={params.from} />
            </div>
            <div>
              <Label htmlFor="to">Tanggal Akhir</Label>
              <Input id="to" name="to" type="date" defaultValue={params.to} />
            </div>
          </>
        }
        actions={(row) => <RowActions resource="sales" id={row.id} action={saveSale} fields={fields(row)} />}
      />
    </div>
  );
}
