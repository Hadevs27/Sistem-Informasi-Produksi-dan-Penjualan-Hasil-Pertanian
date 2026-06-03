"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/app/actions";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <Button type="submit" variant="ghost" className="w-full justify-start">
        <LogOut className="h-4 w-4" aria-hidden="true" />
        Logout
      </Button>
    </form>
  );
}
