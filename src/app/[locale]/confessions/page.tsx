import { ConfessionsView } from "@/components/dashboard/confessions-view";
import { PortalShell } from "@/components/dashboard/portal-shell";

export default function LocalizedConfessionsPage() {
  return (
    <PortalShell
      currentPath="/confessions"
      title="Confessions"
      description="Review confession requests, manage appointments, and keep spiritual records."
    >
      <ConfessionsView />
    </PortalShell>
  );
}
