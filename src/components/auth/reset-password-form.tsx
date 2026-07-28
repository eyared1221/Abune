"use client";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldAlert,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";

import { useRouter } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

type ResetPasswordFormProps = {
  token?: string;
  tokenError?: boolean;
};

export function ResetPasswordForm({
  token,
  tokenError = false,
}: ResetPasswordFormProps) {
  const router = useRouter();
  const locale = useLocale() as AppLocale;
  const t = useTranslations("Auth");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSucceeded, setResetSucceeded] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const invalidToken = tokenError || !token;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    if (!token) {
      setErrorMessage(t("resetPassword.errors.invalidLink"));
      return;
    }

    if (password.length < 10) {
      setErrorMessage(t("resetPassword.errors.passwordTooShort"));
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage(t("resetPassword.errors.passwordsDoNotMatch"));
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await authClient.resetPassword({
        newPassword: password,
        token,
      });

      if (result.error) {
        setErrorMessage(t("resetPassword.errors.invalidOrExpired"));
        return;
      }

      setResetSucceeded(true);
      window.setTimeout(() => {
        router.replace("/login?reset=1", { locale });
        router.refresh();
      }, 1800);
    } catch (error) {
      console.error("Password reset failed:", error);
      setErrorMessage(t("resetPassword.errors.unavailable"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-[100dvh] bg-[#f4efe6] p-2 sm:p-3 lg:p-4">
      <div className="mx-auto grid min-h-[calc(100dvh-16px)] max-w-[1530px] overflow-hidden rounded-[22px] border border-[#e2d2b5] bg-white shadow-[0_18px_60px_rgba(101,76,31,0.12)] lg:min-h-[calc(100dvh-24px)] lg:grid-cols-2">
        <section
          aria-label={t("common.churchName")}
          className="relative hidden overflow-hidden bg-cover bg-center bg-no-repeat lg:flex lg:items-center lg:justify-center"
          style={{
            backgroundImage: "url('/images/login-background.png')",
          }}
        >
          <div className="relative z-10 flex max-w-[500px] flex-col items-center px-10 text-center">
            <img
              alt="Abune Logo"
              className="mb-5 h-[105px] w-auto object-contain xl:h-[118px]"
              src="/images/logo.png"
            />
            <h1 className="max-w-[430px] text-[22px] font-extrabold uppercase leading-tight tracking-wide text-[#c59b3d] xl:text-[24px]">
              {t("common.fatherGuideShepherd")}
            </h1>
            <p className="mt-2 text-[16px] font-semibold text-[#5f6f91] xl:text-[17px]">
              {t("common.churchName")}
            </p>
            <div className="my-5 flex w-full items-center justify-center gap-4">
              <div className="h-px w-24 bg-[#dbc28d]" />
              <span className="text-lg text-[#c59b3d]">✣</span>
              <div className="h-px w-24 bg-[#dbc28d]" />
            </div>
            <p className="max-w-[350px] text-[15px] leading-6 text-[#66728d] xl:text-[16px]">
              {t("common.ministryDescription")}
            </p>
          </div>
        </section>

        <section
          className="relative flex min-h-[650px] items-center justify-center overflow-hidden px-5 py-8 sm:px-10 lg:px-14"
          style={{
            background:
              "radial-gradient(circle at 84% 14%, rgba(222, 183, 100, 0.18), transparent 18%), radial-gradient(circle at 16% 35%, rgba(238, 208, 145, 0.16), transparent 22%), linear-gradient(145deg, #fffefa 0%, #fcf5e9 100%)",
          }}
        >
          <div className="pointer-events-none absolute -right-20 top-10 h-52 w-52 rounded-full border border-[#d8ae58]/20" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full border border-[#d8ae58]/15" />

          <div className="relative z-10 w-full max-w-[430px]">
            <div className="text-center">
              <img
                alt="Abune"
                className="mx-auto h-[106px] w-[106px] rounded-full object-cover shadow-[0_8px_24px_rgba(96,67,20,0.14)]"
                src="/images/logo.png"
              />
              <h2 className="mt-6 font-serif text-[31px] font-bold tracking-tight text-[#26395d] sm:text-[34px]">
                {t("resetPassword.title")}
              </h2>
              <p className="mx-auto mt-2 max-w-[360px] text-sm font-medium leading-5 text-[#8a8b91]">
                {t("resetPassword.subtitle")}
              </p>
            </div>

            {invalidToken ? (
              <div className="mt-7 rounded-[16px] border border-[#e9c7bd] bg-[#fff7f3] px-5 py-5 text-center">
                <ShieldAlert className="mx-auto h-10 w-10 text-[#b75a45]" />
                <h3 className="mt-3 font-serif text-xl font-bold text-[#26395d]">
                  {t("resetPassword.invalidTitle")}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#68738a]">
                  {t("resetPassword.invalidDescription")}
                </p>
                <button
                  className="mt-5 inline-flex h-[46px] items-center justify-center gap-2 rounded-[13px] bg-gradient-to-r from-[#dcad4c] to-[#c98d21] px-5 text-sm font-bold text-white"
                  onClick={() =>
                    router.push("/forgot-password", { locale })
                  }
                  type="button"
                >
                  {t("resetPassword.requestNewLink")}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ) : resetSucceeded ? (
              <div className="mt-7 rounded-[16px] border border-[#cfe1bf] bg-[#f4f9ef] px-5 py-5 text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 text-[#4d874c]" />
                <h3 className="mt-3 font-serif text-xl font-bold text-[#26395d]">
                  {t("resetPassword.successTitle")}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#68738a]">
                  {t("resetPassword.successDescription")}
                </p>
                <p className="mt-3 text-xs font-semibold text-[#4d874c]">
                  {t("resetPassword.redirecting")}
                </p>
              </div>
            ) : (
              <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
                <PasswordField
                  autoComplete="new-password"
                  id="new-password"
                  label={t("resetPassword.password")}
                  onChange={setPassword}
                  onToggle={() =>
                    setShowPassword((current) => !current)
                  }
                  show={showPassword}
                  value={password}
                />

                <PasswordField
                  autoComplete="new-password"
                  id="confirm-new-password"
                  label={t("resetPassword.confirmPassword")}
                  onChange={setConfirmPassword}
                  onToggle={() =>
                    setShowConfirmPassword((current) => !current)
                  }
                  show={showConfirmPassword}
                  value={confirmPassword}
                />

                <p className="text-xs font-medium text-[#8a8b91]">
                  {t("resetPassword.passwordHint")}
                </p>

                {errorMessage ? (
                  <div
                    className="rounded-[11px] border border-[#e9c7bd] bg-[#fff7f3] px-4 py-2.5 text-sm font-semibold text-[#b75a45]"
                    role="alert"
                  >
                    {errorMessage}
                  </div>
                ) : null}

                <button
                  className={cn(
                    "flex h-[52px] w-full items-center justify-center gap-2.5 rounded-[15px] bg-gradient-to-r from-[#dcad4c] to-[#c98d21] text-sm font-bold text-white shadow-[0_10px_22px_rgba(174,126,35,0.26)] transition-all hover:-translate-y-0.5 hover:from-[#d09a34] hover:to-[#b87814]",
                    isSubmitting &&
                      "cursor-not-allowed opacity-70 hover:translate-y-0",
                  )}
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting
                    ? t("resetPassword.resetting")
                    : t("resetPassword.reset")}
                  <ArrowRight className="h-[18px] w-[18px]" />
                </button>
              </form>
            )}

            {!resetSucceeded ? (
              <button
                className="mx-auto mt-5 flex items-center gap-2 text-sm font-semibold text-[#ad8128] transition-colors hover:text-[#865f16]"
                onClick={() => router.push("/login", { locale })}
                type="button"
              >
                <ArrowLeft className="h-4 w-4" />
                {t("resetPassword.backToSignIn")}
              </button>
            ) : null}

            <div
              aria-hidden="true"
              className="my-6 flex items-center gap-3 text-[#c99432]"
            >
              <span className="h-px flex-1 bg-[#eadfca]" />
              <span className="text-lg leading-none">✣</span>
              <span className="h-px flex-1 bg-[#eadfca]" />
            </div>

            <p className="text-center text-xs font-medium text-[#8f9093]">
              {t("common.copyright")}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function PasswordField({
  autoComplete,
  id,
  label,
  onChange,
  onToggle,
  show,
  value,
}: {
  autoComplete: string;
  id: string;
  label: string;
  onChange: (value: string) => void;
  onToggle: () => void;
  show: boolean;
  value: string;
}) {
  return (
    <div className="flex h-[52px] items-center gap-3 rounded-[10px] border border-[#e8dfd0] bg-white/85 px-4 text-[#9c9a92] shadow-sm transition-all focus-within:border-[#d3a346] focus-within:ring-4 focus-within:ring-[#c59b3d]/10">
      <LockKeyhole className="h-[18px] w-[18px] shrink-0" />
      <label className="sr-only" htmlFor={id}>
        {label}
      </label>
      <input
        autoComplete={autoComplete}
        className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium text-[#45506a] outline-none placeholder:text-[#a3a19d]"
        id={id}
        onChange={(event) => onChange(event.target.value)}
        placeholder={label}
        type={show ? "text" : "password"}
        value={value}
      />
      <button
        aria-label={show ? "Hide password" : "Show password"}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#9c9a92] transition-colors hover:bg-[#f7efdf] hover:text-[#a17d36]"
        onClick={onToggle}
        type="button"
      >
        {show ? (
          <EyeOff className="h-[19px] w-[19px]" />
        ) : (
          <Eye className="h-[19px] w-[19px]" />
        )}
      </button>
    </div>
  );
}
