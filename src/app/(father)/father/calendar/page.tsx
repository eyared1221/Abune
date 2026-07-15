import { CalendarView } from "@/components/dashboard/calendar-view";
import { PortalShell } from "@/components/dashboard/portal-shell";

export default function CalendarPage() {
  return (
    <PortalShell
      currentPath="/father/calendar"
      title="Calendar"
      description="Manage appointments and schedule."
      showHero={false}
    >
      <CalendarView />
    </PortalShell>
  );
}
