"use client";

import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { PortalShell } from "@/components/dashboard/portal-shell";

export function DashboardShell() {
  return (
    <PortalShell
      currentPath="/father"
      title="Welcome back, Abba Yohannes †"
      description="You have 8 appointments scheduled for today."
      heroAccent="8 appointments"
      heroVariant="welcome"
    >
      <DashboardOverview />
    </PortalShell>
  );
}