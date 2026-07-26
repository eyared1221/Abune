import { getTranslations } from "next-intl/server";

import { PortalShell } from "@/components/dashboard/portal-shell";
import { SpiritualChildrenView } from "@/components/dashboard/spiritual-children-view";

export default async function SpiritualChildrenPage() {
  const t = await getTranslations("SpiritualChildren");

  return (
    <PortalShell
      currentPath="/father/children"
      title={t("page.title")}
      description={t("page.description")}
    >
      <SpiritualChildrenView />
    </PortalShell>
  );
}
