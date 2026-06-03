"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function ToastQuery() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");
    if (success) toast.success(success);
    if (error === "forbidden") toast.error("Akses ditolak untuk role Anda.");
    if (error && error !== "forbidden") toast.error(error);
  }, [searchParams]);

  return null;
}
