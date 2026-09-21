import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ClientOnly } from "@/components/ClientOnly";
import MovementOS from "@/movement/MovementOS";

export const Route = createFileRoute("/movement-os")({
  component: () => (
    <AppShell>
      <ClientOnly fallback={<div className="p-6">Loading Movement OS...</div>}>
        <MovementOS />
      </ClientOnly>
    </AppShell>
  ),
});