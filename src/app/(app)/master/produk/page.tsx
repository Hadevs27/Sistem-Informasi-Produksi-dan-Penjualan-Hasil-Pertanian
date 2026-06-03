import { saveProduct } from "@/app/actions";
import { DataTable } from "@/components/data/data-table";
import { CreatePanel, PageHeader, RowActions } from "@/features/crud-components";
import { listProducts } from "@/db/queries";
import { formatCurrency, formatNumber } from "@/lib/format";

export default async function ProductsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const data = await listProducts({ q: params.q, page: Number(params.page ?? 1), sort: params.sort, dir: params.dir });
  const fields = (row?: (typeof data.rows)[number]) => [
    { name: "name", label: "Nama Produk", value: row?.name },
    { name: "salePrice", label: "Harga Jual", type: "number" as const, value: row?.salePrice },
    { name: "costPrice", label: "Harga Pokok", type: "number" as const, value: row?.costPrice },
    { name: "stock", label: "Stok", type: "number" as const, value: row?.stock },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Produk" description="Kelola produk jadi, harga jual, harga pokok, dan stok." />
      <CreatePanel title="Tambah Produk" action={saveProduct} fields={fields()} />
      <DataTable
        rows={data.rows}
        columns={[
          { key: "name", label: "Nama Produk", sortable: true },
          { key: "salePrice", label: "Harga Jual", sortable: true, render: (row) => formatCurrency(row.salePrice) },
          { key: "costPrice", label: "Harga Pokok", render: (row) => formatCurrency(row.costPrice) },
          { key: "stock", label: "Stok", sortable: true, render: (row) => formatNumber(row.stock) },
        ]}
        search={params.q ?? ""}
        sort={params.sort ?? "name"}
        dir={params.dir ?? "asc"}
        page={data.page}
        totalPages={data.totalPages}
        basePath="/master/produk"
        exportResource="products"
        actions={(row) => <RowActions resource="products" id={row.id} action={saveProduct} fields={fields(row)} />}
      />
    </div>
  );
}
