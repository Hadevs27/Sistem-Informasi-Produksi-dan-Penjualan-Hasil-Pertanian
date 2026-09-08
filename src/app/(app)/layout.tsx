import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AppShell } from "@/components/layout/app-shell";
import { ToastQuery } from "@/components/layout/toast-query";
import { getLocale } from "@/lib/i18n";
import { getDictionary } from "@/messages";
import { I18nProvider } from "@/components/i18n-provider";

export const dynamic = "force-dynamic";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <I18nProvider locale={locale} dict={dict}>
      <AppShell role={session.user.role} name={session.user.name ?? "User"}>
        <ToastQuery />
        {children}
      </AppShell>
    </I18nProvider>
  );
}
