import { notFound } from "next/navigation";

import { SpiritualChildProfileView } from "@/components/dashboard/spiritual-child-profile-view";
import { PortalShell } from "@/components/dashboard/portal-shell";
import { getSpiritualChildBySlugAction } from "@/server/actions/spiritual-children.actions";
import type { PersistedSpiritualChild } from "@/types/spiritual-child";

export default async function SpiritualChildProfilePage({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = await params;
  const result = await getSpiritualChildBySlugAction(childId);

  if (!result.success) {
    notFound();
  }

  const child = result.child as PersistedSpiritualChild;

  return (
    <PortalShell
      currentPath="/father/children"
      title={child.submission.baptismalName}
      description={`Profile overview for ${child.submission.baptismalName}.`}
      showHero={false}
    >
      <SpiritualChildProfileView child={child} />
    </PortalShell>
  );
}
