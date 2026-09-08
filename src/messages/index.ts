import { id } from "./id";
import { en } from "./en";
import { type Locale } from "@/lib/i18n";

export const dictionaries = {
  id,
  en,
};

export function getDictionary(locale: Locale) {
  return dictionaries[locale] ?? dictionaries.id;
}
