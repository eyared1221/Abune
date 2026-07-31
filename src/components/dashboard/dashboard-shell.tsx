"use client";

import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { PortalShell } from "@/components/dashboard/portal-shell";
import { useSession } from "@/lib/auth-client";

export function DashboardShell() {
  const { data: session } = useSession();
  const name = session?.user.name?.trim() || "Father";

  return (
    <PortalShell
      currentPath="/father"
      title={`Welcome back, ${name} \u2020`}
      description="You have 8 appointments scheduled for today."
      heroAccent="8 appointments"
      heroVariant="welcome"
    >
      <DashboardOverview />
    </PortalShell>
  );
}
