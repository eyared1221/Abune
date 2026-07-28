import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import {
  isAppRole,
  type AppRole,
} from "@/lib/permissions";

function dashboardPath(locale: string, role: AppRole) {
  return role === "SPIRITUAL_FATHER"
    ? `/${locale}/father`
    : `/${locale}/child`;
}

export async function getServerSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}

export async function redirectIfAuthenticated(locale: string) {
  const session = await getServerSession();
  const role = session?.user.role;

  if (isAppRole(role)) {
    redirect(dashboardPath(locale, role));
  }
}

export async function requireRole(
  locale: string,
  requiredRole: AppRole,
) {
  const session = await getServerSession();

  if (!session) {
    redirect(`/${locale}/login`);
  }

  const role = session.user.role;

  if (!isAppRole(role)) {
    redirect(`/${locale}/login`);
  }

  if (role !== requiredRole) {
    redirect(dashboardPath(locale, role));
  }

  return session;
}
