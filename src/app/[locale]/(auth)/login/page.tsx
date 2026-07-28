import { LoginForm } from "@/components/auth/login-form";
import { redirectIfAuthenticated } from "@/lib/server-auth";

type LoginPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    registered?: string | string[];
    reset?: string | string[];
  }>;
};

export default async function LoginPage({
  params,
  searchParams,
}: LoginPageProps) {
  const { locale } = await params;

  await redirectIfAuthenticated(locale);

  const query = await searchParams;
  const registrationSucceeded = query.registered === "1";
  const passwordResetSucceeded = query.reset === "1";

  return (
    <LoginForm
      passwordResetSucceeded={passwordResetSucceeded}
      registrationSucceeded={registrationSucceeded}
    />
  );
}
