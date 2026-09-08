import { cookies } from "next/headers";

export type Locale = "id" | "en";
export const defaultLocale: Locale = "id";
export const locales: Locale[] = ["id", "en"];

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;
  if (localeCookie && locales.includes(localeCookie as Locale)) {
    return localeCookie as Locale;
  }
  return defaultLocale;
}
