"use client";

import { useTransition } from "react";
import { setLocaleAction } from "@/app/actions/i18n";
import { useI18n } from "@/components/i18n-provider";
import type { Locale } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { locale } = useI18n();
  const [isPending, startTransition] = useTransition();

  const handleValueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    startTransition(() => {
      setLocaleAction(e.target.value as Locale);
    });
  };

  return (
    <select
      value={locale}
      onChange={handleValueChange}
      disabled={isPending}
      className="h-9 w-[120px] rounded-md border border-slate-200 bg-white px-3 text-sm font-medium shadow-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
      aria-label="Pilih Bahasa"
    >
      <option value="id">🇮🇩 Indonesia</option>
      <option value="en">🇬🇧 English</option>
    </select>
  );
}
