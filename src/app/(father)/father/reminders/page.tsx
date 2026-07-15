import { PortalShell } from "@/components/dashboard/portal-shell";
import { RemindersView } from "@/components/dashboard/reminders-view";

export default function RemindersPage() {
  return (
    <PortalShell
      currentPath="/father/reminders"
      title="Reminders"
      description="Stay on top of important follow-ups, appointments, and spiritual responsibilities."
    >
      <RemindersView />
    </PortalShell>
  );
}
