import { PortalShell } from "@/components/dashboard/portal-shell";
import { SpiritualDatesView } from "@/components/dashboard/spiritual-dates-view";

export default function SpiritualDatesPage() {
  return (
    <PortalShell
      currentPath="/father/spiritual-dates"
      title="Spiritual Dates"
      description="View and manage important spiritual dates, feasts, fasts, and church events."
    >
      <SpiritualDatesView />
    </PortalShell>
  );
}
