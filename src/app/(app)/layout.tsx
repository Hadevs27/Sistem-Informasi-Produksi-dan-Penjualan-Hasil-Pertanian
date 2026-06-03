import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AppShell } from "@/components/layout/app-shell";
import { ToastQuery } from "@/components/layout/toast-query";

export const dynamic = "force-dynamic";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <AppShell role={session.user.role} name={session.user.name ?? "User"}>
      <ToastQuery />
      {children}
    </AppShell>
  );
}
