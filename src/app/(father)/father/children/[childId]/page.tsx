import { notFound } from "next/navigation";

import { SpiritualChildProfileView } from "@/components/dashboard/spiritual-child-profile-view";
import { PortalShell } from "@/components/dashboard/portal-shell";
import { getSpiritualChildBySlug } from "@/lib/spiritual-children";

export default async function SpiritualChildProfilePage({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = await params;
  const child = getSpiritualChildBySlug(childId);

  if (!child) {
    notFound();
  }

  return (
    <PortalShell
      currentPath="/father/children"
      title={child.name}
      description={`Profile overview for ${child.name}.`}
      showHero={false}
    >
      <SpiritualChildProfileView child={child} />
    </PortalShell>
  );
}
