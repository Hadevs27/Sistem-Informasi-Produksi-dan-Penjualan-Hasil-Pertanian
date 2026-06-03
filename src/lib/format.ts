export const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export const numberFormatter = new Intl.NumberFormat("id-ID", {
  maximumFractionDigits: 2,
});

export function formatCurrency(value: number | string) {
  return currencyFormatter.format(Number(value));
}

export function formatNumber(value: number | string) {
  return numberFormatter.format(Number(value));
}

export function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
  }).format(new Date(value));
}
