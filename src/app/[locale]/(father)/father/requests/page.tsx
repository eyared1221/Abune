import { PortalShell } from "@/components/dashboard/portal-shell";
import { RequestsView } from "@/components/dashboard/requests-view";

export default function RequestsPage() {
  return (
    <PortalShell
      currentPath="/father/requests"
      title="Requests"
      description="Manage all requests from your spiritual children."
    >
      <RequestsView />
    </PortalShell>
  );
}
