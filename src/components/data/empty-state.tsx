import { Inbox } from "lucide-react";
import { Card } from "@/components/ui/card";

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <Card className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <Inbox className="mb-3 h-10 w-10 text-slate-300" aria-hidden="true" />
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-slate-500">{description}</p>
    </Card>
  );
}
