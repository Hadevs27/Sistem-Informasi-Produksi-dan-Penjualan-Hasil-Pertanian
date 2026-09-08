"use server";

import { cookies } from "next/headers";
import { type Locale } from "@/lib/i18n";
import { revalidatePath } from "next/cache";

export async function setLocaleAction(locale: Locale) {
  const cookieStore = await cookies();
  cookieStore.set("NEXT_LOCALE", locale, { path: "/", maxAge: 31536000 });
  revalidatePath("/");
}
