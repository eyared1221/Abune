import {
  ArrowRight,
  CircleX,
  Clock3,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Link } from "@/i18n/navigation";
import { redirectIfAuthenticated } from "@/lib/server-auth";
import { validateFatherInvitation } from "@/server/services/father-invitation.service";

type InvitationPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    token?: string | string[];
  }>;
};

function tokenFromQuery(value: string | string[] | undefined) {
  return typeof value === "string" ? value : "";
}

export default async function FatherInvitationPage({
  params,
  searchParams,
}: InvitationPageProps) {
  const { locale } = await params;
  await redirectIfAuthenticated(locale);

  const query = await searchParams;
  const token = tokenFromQuery(query.token);
  const validation = await validateFatherInvitation({ token });
  const t = await getTranslations("Auth");

  if (!validation.ok) {
    let title = t("fatherInvitation.invalidTitle");
    let description = t("fatherInvitation.invalidDescription");

    if (validation.code === "INVITATION_EXPIRED") {
      title = t("fatherInvitation.expiredTitle");
      description = t("fatherInvitation.expiredDescription");
    } else if (validation.code === "INVITATION_USED") {
      title = t("fatherInvitation.usedTitle");
      description = t("fatherInvitation.usedDescription");
    } else if (validation.code === "INVITATION_REVOKED") {
      title = t("fatherInvitation.revokedTitle");
      description = t("fatherInvitation.revokedDescription");
    }

    return (
      <InvitationShell>
        <div className="flex flex-col items-center text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full border border-[#edc9bd] bg-[#fff5f0] text-[#b75a45]">
            <CircleX className="h-10 w-10" />
          </span>
          <h1 className="mt-6 font-serif text-[30px] font-bold text-[#26395d] sm:text-[36px]">
            {title}
          </h1>
          <p className="mt-3 max-w-[390px] text-sm font-medium leading-6 text-[#7f8187]">
            {description}
          </p>
          <Link
            className="mt-7 inline-flex h-[50px] items-center justify-center rounded-[14px] border border-[#d3a346] px-6 text-sm font-bold text-[#a56e16] transition-colors hover:bg-[#fff5df]"
            href="/login"
          >
            {t("fatherInvitation.backToLogin")}
          </Link>
        </div>
      </InvitationShell>
    );
  }

  const { invitation } = validation;
  const formattedExpiry = new Intl.DateTimeFormat(
    locale === "am" ? "am-ET" : "en-US",
    {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Africa/Addis_Ababa",
    },
  ).format(invitation.expiresAt);

  return (
    <InvitationShell>
      <div className="text-center">
        <span className="inline-flex rounded-full border border-[#e4c987] bg-[#fff7e6] px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#a86f16]">
          {t("fatherInvitation.badge")}
        </span>
        <span className="mx-auto mt-5 flex h-20 w-20 items-center justify-center rounded-full border border-[#ead1a0] bg-[#fff8e9] text-[#b57918] shadow-sm">
          <ShieldCheck className="h-10 w-10" />
        </span>
        <h1 className="mt-5 font-serif text-[30px] font-bold leading-tight text-[#26395d] sm:text-[36px]">
          {t("fatherInvitation.title")}
        </h1>
        <p className="mx-auto mt-3 max-w-[400px] text-sm font-medium leading-6 text-[#7f8187]">
          {t("fatherInvitation.description")}
        </p>
      </div>

      <div className="mt-7 space-y-3">
        {invitation.invitedName ? (
          <div className="rounded-[14px] border border-[#ead8b8] bg-white/80 px-4 py-3 text-sm font-semibold text-[#465675]">
            {t("fatherInvitation.invitedName", {
              name: invitation.invitedName,
            })}
          </div>
        ) : null}

        <div className="flex items-center gap-3 rounded-[14px] border border-[#ead8b8] bg-white/80 px-4 py-3 text-sm font-semibold text-[#465675]">
          <Mail className="h-5 w-5 shrink-0 text-[#b57918]" />
          <span className="min-w-0 break-all">{invitation.email}</span>
        </div>

        <div className="flex items-start gap-3 rounded-[14px] border border-[#ead8b8] bg-white/80 px-4 py-3 text-sm font-medium leading-5 text-[#68738a]">
          <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-[#b57918]" />
          <span>
            {t("fatherInvitation.expires", {
              date: formattedExpiry,
            })}
          </span>
        </div>
      </div>

      <Link
        className="mt-7 flex h-[54px] w-full items-center justify-center gap-2.5 rounded-[15px] bg-gradient-to-r from-[#dcad4c] to-[#c98d21] text-sm font-bold text-white shadow-[0_10px_22px_rgba(174,126,35,0.26)] transition-transform hover:-translate-y-0.5"
        href={`/register/father?token=${encodeURIComponent(token)}`}
      >
        {t("fatherInvitation.registerNow")}
        <ArrowRight className="h-5 w-5" />
      </Link>

      <p className="mt-4 text-center text-xs font-medium leading-5 text-[#8a8b91]">
        {t("fatherInvitation.singleUse")}
      </p>
    </InvitationShell>
  );
}

function InvitationShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[#f4efe6] p-2 sm:p-3 lg:p-4">
      <div className="mx-auto grid min-h-[calc(100vh-16px)] max-w-[1500px] overflow-hidden rounded-[28px] border border-[#e5d4b5] bg-[#fffdf8] shadow-[0_18px_60px_rgba(101,76,31,0.12)] lg:min-h-[calc(100vh-24px)] lg:grid-cols-2">
        <section
          aria-label="Abune"
          className="relative hidden overflow-hidden bg-cover bg-center bg-no-repeat lg:flex lg:items-center lg:justify-center"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,253,248,0.78), rgba(255,249,238,0.9)), url('/images/login-background.png')",
          }}
        >
          <div className="relative z-10 flex max-w-[540px] flex-col items-center px-10 text-center">
            <img
              alt="Abune Logo"
              className="h-[118px] w-auto object-contain"
              src="/images/logo.png"
            />
            <div className="my-8 flex items-center gap-5 text-[#c99b37]">
              <span className="h-px w-28 bg-[#d9ba79]" />
              <span className="text-xl">✣</span>
              <span className="h-px w-28 bg-[#d9ba79]" />
            </div>
            <p className="max-w-[430px] font-serif text-2xl font-bold leading-9 text-[#4d6794]">
              Spiritual Father. Guide. Shepherd.
            </p>
          </div>
        </section>

        <section className="relative flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_100%_20%,rgba(234,203,135,0.18),transparent_20%),linear-gradient(145deg,#fffefa_0%,#fcf4e7_100%)] px-5 py-10 sm:px-10 lg:px-14">
          <div className="pointer-events-none absolute -right-20 top-12 h-64 w-64 rounded-full border border-[#f0ddb7]" />
          <div className="relative z-10 w-full max-w-[460px]">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
