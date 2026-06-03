"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold">Terjadi kesalahan</h2>
          <p className="mt-1 text-sm">{error.message}</p>
          <Button type="button" variant="danger" className="mt-4" onClick={reset}>
            Coba lagi
          </Button>
        </div>
      </div>
    </div>
  );
}
