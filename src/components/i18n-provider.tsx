"use client";

import { createContext, useContext } from "react";
import type { Locale } from "@/lib/i18n";
import type { id } from "@/messages/id";

type Dictionary = typeof id;

interface I18nContextType {
  locale: Locale;
  dict: Dictionary;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({
  children,
  locale,
  dict,
}: {
  children: React.ReactNode;
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <I18nContext.Provider value={{ locale, dict }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
}
