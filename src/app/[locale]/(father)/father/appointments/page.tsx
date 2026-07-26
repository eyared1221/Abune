import { AppointmentsView } from "@/components/dashboard/appointments-view";
import { PortalShell } from "@/components/dashboard/portal-shell";

export default function AppointmentsPage() {
  return (
    <PortalShell
      currentPath="/father/appointments"
      title="Appointments"
      description="View and manage your appointments and spiritual meetings."
    >
      <AppointmentsView />
    </PortalShell>
  );
}
