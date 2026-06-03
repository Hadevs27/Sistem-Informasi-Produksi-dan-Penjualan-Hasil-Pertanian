import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "danger" | "ghost" | "outline";

const variants: Record<Variant, string> = {
  primary: "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700",
  secondary: "bg-slate-900 text-white shadow-sm hover:bg-slate-800",
  danger: "bg-red-600 text-white shadow-sm hover:bg-red-700",
  ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
  outline: "border bg-white text-slate-800 shadow-sm hover:bg-slate-50",
};

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium transition disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

export function ButtonLink({
  className,
  variant = "primary",
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant; href: string; children: ReactNode }) {
  return (
    <Link
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium transition",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
