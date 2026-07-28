import { RegisterForm } from "@/components/auth/register-form";
import { redirectIfAuthenticated } from "@/lib/server-auth";

type RegisterPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function RegisterPage({
  params,
}: RegisterPageProps) {
  const { locale } = await params;

  await redirectIfAuthenticated(locale);

  return <RegisterForm />;
}
