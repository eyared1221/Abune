import { ChildDashboardShell } from "@/components/dashboard/child-dashboard-shell";
import { requireRole } from "@/lib/server-auth";

type ChildDashboardPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ChildDashboardPage({
  params,
}: ChildDashboardPageProps) {
  const { locale } = await params;

  await requireRole(locale, "SPIRITUAL_CHILD");

  return <ChildDashboardShell />;
}
