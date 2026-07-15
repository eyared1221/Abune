import { PortalShell } from "@/components/dashboard/portal-shell";
import { SpiritualChildrenView } from "@/components/dashboard/spiritual-children-view";

export default function SpiritualChildrenPage() {
  return (
    <PortalShell
      currentPath="/father/children"
      title="Spiritual Children"
      description="View and manage the spiritual children under your guidance."
    >
      <SpiritualChildrenView />
    </PortalShell>
  );
}
