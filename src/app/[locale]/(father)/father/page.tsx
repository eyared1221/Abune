import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireRole } from "@/lib/server-auth";

type FatherDashboardPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function FatherDashboardPage({
  params,
}: FatherDashboardPageProps) {
  const { locale } = await params;

  await requireRole(locale, "SPIRITUAL_FATHER");

  return <DashboardShell />;
}
