import { redirect } from "next/navigation";

import { RegisterForm } from "@/components/auth/register-form";
import { redirectIfAuthenticated } from "@/lib/server-auth";
import { validateFatherInvitation } from "@/server/services/father-invitation.service";

type FatherRegisterPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    token?: string | string[];
  }>;
};

export default async function FatherRegisterPage({
  params,
  searchParams,
}: FatherRegisterPageProps) {
  const { locale } = await params;
  await redirectIfAuthenticated(locale);

  const query = await searchParams;
  const token = typeof query.token === "string" ? query.token : "";
  const validation = await validateFatherInvitation({ token });

  if (!validation.ok) {
    const queryString = token
      ? `?token=${encodeURIComponent(token)}`
      : "";

    redirect(
      `/${locale}/register/father/invitation${queryString}`,
    );
  }

  return (
    <RegisterForm
      accountType="father"
      invitationToken={token}
      invitedEmail={validation.invitation.email}
      invitedName={validation.invitation.invitedName}
    />
  );
}
