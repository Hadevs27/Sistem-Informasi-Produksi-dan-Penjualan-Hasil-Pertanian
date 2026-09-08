"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, KeyRound, Mail } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type MotionBlockProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: "fadeUp" | "fadeIn" | "scaleIn";
};

const ease = [0.22, 1, 0.36, 1] as const;

export function MotionBlock({ children, className, delay = 0, variant = "fadeUp" }: MotionBlockProps) {
  const reduceMotion = useReducedMotion();

  const initialByVariant = {
    fadeUp: { opacity: 0, y: 18 },
    fadeIn: { opacity: 0 },
    scaleIn: { opacity: 0, y: 12, scale: 0.98 },
  };

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : initialByVariant[variant]}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.65, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

export function FloatingProduct({ children, className }: { children: ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, x: 22, scale: 0.96 }}
      animate={
        reduceMotion
          ? undefined
          : {
              opacity: 1,
              x: 0,
              scale: 1,
              y: [0, -8, 0],
            }
      }
      transition={
        reduceMotion
          ? undefined
          : {
              opacity: { duration: 0.8, ease },
              x: { duration: 0.8, ease },
              scale: { duration: 0.8, ease },
              y: { duration: 7, repeat: Infinity, ease: "easeInOut" },
            }
      }
    >
      {children}
    </motion.div>
  );
}

export function MotionFeatureCard({ children, className, delay = 0 }: MotionBlockProps) {
  return (
    <MotionBlock className={className} delay={delay} variant="scaleIn">
      {children}
    </MotionBlock>
  );
}

const demoAccounts = [
  { role: "Admin", email: "admin@example.com" },
  { role: "Pegawai", email: "pegawai@example.com" },
  { role: "Manajer", email: "manajer@example.com" },
];

export function DemoAccounts({ dict }: { dict: any }) {
  const [open, setOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);

  const handleSelect = (email: string) => {
    setSelectedEmail(email);
    
    // Autofill the form inputs directly via DOM since they are uncontrolled
    const emailInput = document.getElementById("email") as HTMLInputElement;
    const passwordInput = document.getElementById("password") as HTMLInputElement;
    
    if (emailInput) emailInput.value = email;
    if (passwordInput) passwordInput.value = "password123";
  };

  return (
    <details
      className="mt-6 rounded-xl border border-slate-200/80 bg-slate-50/80"
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary
        className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-xl px-4 py-3 text-left transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 [&::-webkit-details-marker]:hidden"
      >
        <span>
          <span className="block text-sm font-semibold text-slate-950">{dict?.login?.demoAccounts || "Demo Accounts"}</span>
          <span className="mt-0.5 block text-xs text-slate-500">{dict?.login?.clickToTry || "Klik untuk mencoba peran berbeda."}</span>
        </span>
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 text-slate-500 transition-transform", open && "rotate-180")}
          aria-hidden="true"
        />
      </summary>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease }}
            className="overflow-hidden"
          >
            <div className="space-y-3 border-t border-slate-200/80 px-4 py-4">
              {demoAccounts.map((account) => {
                const isSelected = selectedEmail === account.email;
                return (
                  <button
                    key={account.email}
                    type="button"
                    onClick={() => handleSelect(account.email)}
                    className={cn(
                      "w-full flex items-center justify-between gap-3 rounded-lg px-3 py-2 shadow-sm text-left transition-all",
                      "focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 active:scale-[0.98]",
                      isSelected 
                        ? "bg-emerald-50 ring-1 ring-emerald-500/50" 
                        : "bg-white hover:bg-slate-50 hover:border-slate-300 border border-transparent"
                    )}
                    aria-label={`${dict?.login?.useAccount || "Use demo account"}: ${account.role}`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={cn(
                          "text-xs font-semibold uppercase transition-colors",
                          isSelected ? "text-emerald-700" : "text-slate-500"
                        )}>
                          {account.role}
                        </p>
                        {isSelected && (
                          <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                            {dict?.login?.selected || "Terpilih"}
                          </span>
                        )}
                      </div>
                      <p className={cn(
                        "truncate text-sm font-medium transition-colors",
                        isSelected ? "text-emerald-950" : "text-slate-900"
                      )}>
                        {account.email}
                      </p>
                    </div>
                    <Mail className={cn("h-4 w-4 shrink-0", isSelected ? "text-emerald-500" : "text-slate-400")} aria-hidden="true" />
                  </button>
                );
              })}
              <div className="flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50/50 px-3 py-2 text-sm font-medium text-emerald-800">
                <KeyRound className="h-4 w-4" aria-hidden="true" />
                Password: password123
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </details>
  );
}
