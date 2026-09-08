import {
  ArrowRight,
  BarChart3,
  Building2,
  ChartNoAxesCombined,
  Factory,
  PackageCheck,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import { loginAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { DemoAccounts, FloatingProduct, MotionBlock, MotionFeatureCard } from "./login-motion";
import { getLocale } from "@/lib/i18n";
import { getDictionary } from "@/messages";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const params = await searchParams;
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const features = [
    {
      icon: PackageCheck,
      label: "Production Monitoring",
      caption: "Batch visibility",
    },
    {
      icon: ShieldCheck,
      label: "Role-Based Access",
      caption: "Secure workflow",
    },
    {
      icon: BarChart3,
      label: "Business Analytics",
      caption: "Executive insight",
    },
  ];

  return (
    <main className="grid min-h-screen bg-slate-50 lg:grid-cols-[minmax(0,1fr)_520px]">
      <section className="relative hidden overflow-hidden bg-slate-950 px-12 py-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.16]"
          style={{
            backgroundImage: "url('/images/login-food-products.png')",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 opacity-95"
          style={{
            background:
              "radial-gradient(circle at 18% 18%, rgba(16,185,129,0.22), transparent 30%), radial-gradient(circle at 82% 22%, rgba(34,211,238,0.13), transparent 28%), radial-gradient(circle at 58% 82%, rgba(59,130,246,0.14), transparent 34%)",
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/92 to-emerald-950/80" aria-hidden="true" />
        <div
          className="absolute inset-0 opacity-70"
          style={{
            background:
              "linear-gradient(115deg, rgba(255,255,255,0.09) 0%, transparent 19%, transparent 64%, rgba(16,185,129,0.10) 100%)",
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t from-emerald-500/24 to-transparent" aria-hidden="true" />
        <FloatingProduct
          className="pointer-events-none absolute bottom-24 right-4 z-0 hidden w-56 opacity-80 drop-shadow-[0_34px_68px_rgba(16,185,129,0.30)] lg:block xl:bottom-auto xl:right-8 xl:top-[52%] xl:w-80 xl:-translate-y-1/2 2xl:right-14 2xl:w-96"
          aria-hidden="true"
        >
          <Image
            src="/images/cimory-cutout.png"
            alt=""
            width={240}
            height={210}
            className="h-auto w-full object-contain saturate-[1.06] contrast-[1.04]"
            priority
          />
        </FloatingProduct>

        <MotionBlock className="relative z-10 flex items-center gap-3" variant="fadeIn">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/10 backdrop-blur">
            <Building2 className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold tracking-wide">PT MACROPRIMA PANGAN UTAMA</p>
            <p className="text-sm text-slate-300">Integrated Production &amp; Distribution Platform</p>
          </div>
        </MotionBlock>

        <MotionBlock className="relative z-10 max-w-[680px]" delay={0.08}>
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-100 shadow-lg shadow-emerald-950/20 backdrop-blur">
            <Factory className="h-3.5 w-3.5" aria-hidden="true" />
            Enterprise food production control
          </div>
          <h1 className="max-w-[650px] text-5xl font-semibold leading-[1.05] tracking-normal text-white xl:text-[3.45rem]">
            Digitalisasi Produksi dan Distribusi Pangan Secara Terintegrasi
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            Kelola bahan baku, produksi, penjualan, laporan, dan laba-rugi dalam satu platform modern yang terintegrasi.
          </p>
          <div className="mt-11 grid max-w-2xl grid-cols-3 gap-3">
            {features.map((feature, index) => (
              <MotionFeatureCard
                key={feature.label}
                delay={0.16 + index * 0.07}
                className="rounded-xl border border-white/12 bg-white/[0.075] p-4 shadow-xl shadow-slate-950/10 backdrop-blur-md transition hover:border-emerald-200/35 hover:bg-white/[0.105]"
              >
                <feature.icon className="mb-3 h-4 w-4 text-emerald-200" aria-hidden="true" />
                <p className="text-sm font-semibold leading-5 text-white">{feature.label}</p>
                <p className="mt-1 text-xs text-slate-300">{feature.caption}</p>
              </MotionFeatureCard>
            ))}
          </div>
        </MotionBlock>

        <MotionBlock className="relative z-10 flex items-center gap-3 text-sm text-slate-300" delay={0.26}>
          <ShieldCheck className="h-4 w-4 text-emerald-300" aria-hidden="true" />
          Session authentication, protected routes, and role-based access.
        </MotionBlock>
      </section>

      <section className="flex items-center justify-center bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.08),transparent_30%),linear-gradient(180deg,#f8fafc_0%,#f1f5f9_100%)] px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white">
              <Building2 className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-950">PT MACROPRIMA PANGAN UTAMA</p>
              <p className="text-xs text-slate-500">Integrated Production &amp; Distribution Platform</p>
            </div>
          </div>

          <MotionBlock
            className="rounded-2xl border border-slate-200/80 bg-white/95 p-8 shadow-[0_28px_90px_rgba(15,23,42,0.14)] ring-1 ring-white/80 backdrop-blur"
            variant="scaleIn"
            delay={0.1}
          >
            <div className="mb-9">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 shadow-sm ring-1 ring-emerald-100">
                <ChartNoAxesCombined className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 className="text-2xl font-semibold tracking-normal text-slate-950">Masuk ke sistem</h2>
              <p className="mt-2.5 text-sm leading-6 text-slate-500">
                Akses dashboard produksi, distribusi, dan laporan operasional secara aman.
              </p>
            </div>
            {params.error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {params.error}
              </div>
            )}
            <form action={loginAction} className="space-y-4">
              <input type="hidden" name="callbackUrl" value={params.callbackUrl ?? "/dashboard"} />
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" autoComplete="email" required className="h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" autoComplete="current-password" required className="h-11" />
              </div>
              <Button type="submit" className="h-11 w-full shadow-lg shadow-emerald-600/18">
                Masuk
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </form>
            <DemoAccounts dict={dict} />
          </MotionBlock>
          <p className="mt-6 text-center text-xs text-slate-500">
            Protected by Auth.js session management and enterprise RBAC.
          </p>
        </div>
      </section>
    </main>
  );
}
