"use client";

import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import {
  useEffect,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import { Link, useRouter } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

const fieldClass =
  "flex h-[52px] items-center gap-3 rounded-[10px] border border-[#e8dfd0] bg-white/85 px-4 text-[#9b9a92] shadow-sm transition-colors focus-within:border-[#d3a346] focus-within:ring-4 focus-within:ring-[#c59b3d]/10";
const inputClass =
  "h-full min-w-0 flex-1 bg-transparent text-sm font-medium text-[#45506a] outline-none placeholder:text-[#a3a19d] disabled:cursor-not-allowed disabled:text-[#8b8d92]";

type BusyAction = "send" | "verify" | "create" | null;
type RegistrationMode = "child" | "father";

type RegisterFormProps = {
  accountType?: RegistrationMode;
  invitationToken?: string;
  invitedEmail?: string;
  invitedName?: string | null;
};

type ApiResponse = {
  challengeId?: string;
  registrationToken?: string;
  resendAfterSeconds?: number;
  code?: string;
  message?: string;
};

export function RegisterForm({
  accountType = "child",
  invitationToken,
  invitedEmail = "",
  invitedName,
}: RegisterFormProps) {
  const router = useRouter();
  const locale = useLocale() as AppLocale;
  const t = useTranslations("Auth");
  const isFather = accountType === "father";

  const [baptismalName, setBaptismalName] = useState(
    invitedName?.trim() ?? "",
  );
  const [email, setEmail] = useState(invitedEmail.trim().toLowerCase());
  const [challengeId, setChallengeId] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [registrationToken, setRegistrationToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [busyAction, setBusyAction] = useState<BusyAction>(null);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [accountCreated, setAccountCreated] = useState(false);

  const codeSent = Boolean(challengeId);
  const emailVerified = Boolean(registrationToken);
  const nameLocked = codeSent;
  const emailLocked = isFather || codeSent;

  useEffect(() => {
    if (cooldownSeconds <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setCooldownSeconds((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [cooldownSeconds]);

  useEffect(() => {
    if (!accountCreated) {
      return;
    }

    const timer = window.setTimeout(() => {
      router.replace("/login?registered=1", { locale });
    }, 2200);

    return () => window.clearTimeout(timer);
  }, [accountCreated, locale, router]);

  function translatedError(response: ApiResponse) {
    switch (response.code) {
      case "ACCOUNT_EXISTS":
        return t("errors.accountExists");
      case "RESEND_COOLDOWN":
        return t("errors.resendCooldown");
      case "RATE_LIMITED":
        return t("errors.rateLimited");
      case "EMAIL_SEND_FAILED":
        return t("errors.emailSendFailed");
      case "INVALID_CODE":
        return t("errors.invalidCode");
      case "CODE_EXPIRED":
        return t("errors.codeExpired");
      case "CODE_ALREADY_VERIFIED":
        return t("errors.codeAlreadyVerified");
      case "TOO_MANY_ATTEMPTS":
        return t("errors.tooManyAttempts");
      case "VERIFICATION_REQUIRED":
        return t("errors.verificationRequired");
      case "REGISTRATION_TOKEN_EXPIRED":
        return t("errors.registrationExpired");
      case "INVALID_REGISTRATION_TOKEN":
        return t("errors.invalidRegistration");
      case "ACCOUNT_CREATE_FAILED":
        return t("errors.accountCreateFailed");
      case "INVITATION_REQUIRED":
        return t("errors.invitationRequired");
      case "INVALID_INVITATION":
        return t("errors.invalidInvitation");
      case "INVITATION_EXPIRED":
        return t("errors.invitationExpired");
      case "INVITATION_USED":
        return t("errors.invitationUsed");
      case "INVITATION_REVOKED":
        return t("errors.invitationRevoked");
      case "INVITATION_EMAIL_MISMATCH":
        return t("errors.invitationEmailMismatch");
      case "FORBIDDEN":
        return t("errors.forbidden");
      case "INVALID_INPUT":
        return response.message || t("errors.invalidInput");
      default:
        return response.message || t("errors.generic");
    }
  }

  async function postJson(path: string, body: unknown) {
    const response = await fetch(path, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = (await response.json().catch(() => ({}))) as ApiResponse;

    if (!response.ok) {
      throw new Error(translatedError(data));
    }

    return data;
  }

  function invitationContext() {
    return isFather ? { invitationToken } : {};
  }

  async function handleSendCode() {
    setErrorMessage("");
    setInfoMessage("");

    if (baptismalName.trim().length < 2) {
      setErrorMessage(
        isFather
          ? t("errors.fullNameRequired")
          : t("errors.nameRequired"),
      );
      return;
    }

    if (!email.trim()) {
      setErrorMessage(t("errors.emailRequired"));
      return;
    }

    if (isFather && !invitationToken) {
      setErrorMessage(t("errors.invitationRequired"));
      return;
    }

    setBusyAction("send");

    try {
      const result = await postJson("/api/registration/send-code", {
        email,
        ...invitationContext(),
      });

      if (!result.challengeId) {
        throw new Error(t("errors.generic"));
      }

      setChallengeId(result.challengeId);
      setVerificationCode("");
      setRegistrationToken("");
      setCooldownSeconds(result.resendAfterSeconds ?? 60);
      setInfoMessage(
        t("register.codeSent", {
          email: email.trim().toLowerCase(),
        }),
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : t("errors.generic"),
      );
    } finally {
      setBusyAction(null);
    }
  }

  async function handleVerifyCode() {
    setErrorMessage("");
    setInfoMessage("");

    if (!/^\d{6}$/.test(verificationCode)) {
      setErrorMessage(t("errors.enterSixDigitCode"));
      return;
    }

    setBusyAction("verify");

    try {
      const result = await postJson("/api/registration/verify-code", {
        challengeId,
        email,
        code: verificationCode,
        ...invitationContext(),
      });

      if (!result.registrationToken) {
        throw new Error(t("errors.generic"));
      }

      setRegistrationToken(result.registrationToken);
      setInfoMessage(t("register.emailVerified"));
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : t("errors.generic"),
      );
    } finally {
      setBusyAction(null);
    }
  }

  function resetEmailVerification() {
    setChallengeId("");
    setVerificationCode("");
    setRegistrationToken("");
    setPassword("");
    setConfirmPassword("");
    setCooldownSeconds(0);
    setErrorMessage("");
    setInfoMessage("");
  }

  async function handleCreateAccount(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setErrorMessage("");
    setInfoMessage("");

    if (!emailVerified) {
      setErrorMessage(t("errors.verificationRequired"));
      return;
    }

    if (password.length < 10) {
      setErrorMessage(t("errors.passwordTooShort"));
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage(t("errors.passwordsDoNotMatch"));
      return;
    }

    setBusyAction("create");

    try {
      await postJson("/api/registration/create-account", {
        challengeId,
        registrationToken,
        baptismalName,
        email,
        password,
        confirmPassword,
        ...invitationContext(),
      });

      setAccountCreated(true);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : t("errors.generic"),
      );
    } finally {
      setBusyAction(null);
    }
  }

  if (accountCreated) {
    return (
      <AuthShell>
        <div className="flex flex-col items-center text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full border border-[#cfe3bf] bg-[#f1f8eb] text-[#4e9a4f] shadow-sm">
            <CheckCircle2 className="h-10 w-10" />
          </span>
          <h1 className="mt-6 font-serif text-[31px] font-bold text-[#26395d] sm:text-[36px]">
            {t("register.successTitle")}
          </h1>
          <p className="mt-3 max-w-[360px] text-sm font-medium leading-6 text-[#7f8187]">
            {isFather
              ? t("fatherRegister.successDescription")
              : t("register.successDescription")}
          </p>
          <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-[#b47a13]">
            <LoaderCircle className="h-4 w-4 animate-spin" />
            {t("register.redirecting")}
          </div>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <header className="text-center">
        {isFather ? (
          <span className="mb-3 inline-flex rounded-full border border-[#e4c987] bg-[#fff7e6] px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#a86f16]">
            {t("fatherRegister.invitationBadge")}
          </span>
        ) : null}
        <h1 className="font-serif text-[29px] font-bold leading-[1.18] tracking-tight text-[#26395d] sm:text-[34px]">
          {isFather ? t("fatherRegister.title") : t("register.title")}
        </h1>
        <p className="mx-auto mt-3 max-w-[360px] text-sm font-medium leading-5 text-[#8a8b91]">
          {isFather
            ? t("fatherRegister.subtitle")
            : t("register.subtitle")}
        </p>
      </header>

      <form className="mt-6 space-y-3" onSubmit={handleCreateAccount}>
        <label className={fieldClass} htmlFor="baptismal-name">
          <UserRound className="h-[18px] w-[18px] shrink-0" />
          <input
            autoComplete="name"
            className={inputClass}
            disabled={nameLocked}
            id="baptismal-name"
            onChange={(event) => setBaptismalName(event.target.value)}
            placeholder={
              isFather
                ? t("fatherRegister.fullName")
                : t("register.baptismalName")
            }
            type="text"
            value={baptismalName}
          />
        </label>

        <label className={fieldClass} htmlFor="registration-email">
          <Mail className="h-[18px] w-[18px] shrink-0" />
          <input
            autoComplete="email"
            className={inputClass}
            disabled={emailLocked}
            id="registration-email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder={t("register.email")}
            type="email"
            value={email}
          />
          {!emailVerified ? (
            <button
              className="shrink-0 rounded-[8px] border border-[#d7972d] px-3 py-1.5 text-xs font-semibold text-[#bd7917] transition-colors hover:bg-[#fff5df] disabled:cursor-not-allowed disabled:opacity-55"
              disabled={
                busyAction !== null ||
                (codeSent && cooldownSeconds > 0)
              }
              onClick={handleSendCode}
              type="button"
            >
              {busyAction === "send"
                ? t("register.sendingCode")
                : codeSent
                  ? cooldownSeconds > 0
                    ? t("register.resendIn", {
                        seconds: cooldownSeconds,
                      })
                    : t("register.resendCode")
                  : t("register.sendCode")}
            </button>
          ) : (
            <CheckCircle2 className="h-5 w-5 text-[#4d9b50]" />
          )}
        </label>

        {isFather ? (
          <p className="px-1 text-xs font-medium leading-5 text-[#8a8b91]">
            {t("fatherRegister.emailLocked")}
          </p>
        ) : null}

        {codeSent && !emailVerified ? (
          <>
            <label className={fieldClass} htmlFor="verification-code">
              <ShieldCheck className="h-[18px] w-[18px] shrink-0" />
              <input
                autoComplete="one-time-code"
                className={inputClass}
                id="verification-code"
                inputMode="numeric"
                maxLength={6}
                onChange={(event) =>
                  setVerificationCode(
                    event.target.value.replace(/\D/g, "").slice(0, 6),
                  )
                }
                placeholder={t("register.verificationCode")}
                type="text"
                value={verificationCode}
              />
            </label>

            <div className="flex items-center justify-between gap-3">
              {!isFather ? (
                <button
                  className="text-xs font-semibold text-[#8b6b2c] hover:text-[#684b16]"
                  onClick={resetEmailVerification}
                  type="button"
                >
                  {t("register.changeEmail")}
                </button>
              ) : (
                <span />
              )}

              <button
                className="flex h-10 items-center justify-center gap-2 rounded-[10px] border border-[#d5a54b] px-5 text-sm font-bold text-[#b57918] transition-colors hover:bg-[#fff5df] disabled:cursor-not-allowed disabled:opacity-55"
                disabled={busyAction !== null}
                onClick={handleVerifyCode}
                type="button"
              >
                {busyAction === "verify" ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <ShieldCheck className="h-4 w-4" />
                )}
                {busyAction === "verify"
                  ? t("register.verifyingCode")
                  : t("register.verifyCode")}
              </button>
            </div>
          </>
        ) : null}

        {emailVerified ? (
          <>
            <PasswordField
              id="password"
              onChange={setPassword}
              onToggle={() => setShowPassword((current) => !current)}
              placeholder={t("register.password")}
              show={showPassword}
              value={password}
            />

            <PasswordField
              id="confirm-password"
              onChange={setConfirmPassword}
              onToggle={() =>
                setShowConfirmPassword((current) => !current)
              }
              placeholder={t("register.confirmPassword")}
              show={showConfirmPassword}
              value={confirmPassword}
            />

            <p className="px-1 text-xs font-medium text-[#8a8b91]">
              {t("register.passwordHint")}
            </p>
          </>
        ) : null}

        {errorMessage ? (
          <div
            className="rounded-[11px] border border-[#e9c7bd] bg-[#fff7f3] px-4 py-2.5 text-sm font-semibold text-[#b75a45]"
            role="alert"
          >
            {errorMessage}
          </div>
        ) : null}

        {infoMessage ? (
          <div
            className="rounded-[11px] border border-[#cfe1bf] bg-[#f4f9ef] px-4 py-2.5 text-sm font-semibold text-[#4d874c]"
            role="status"
          >
            {infoMessage}
          </div>
        ) : null}

        {emailVerified ? (
          <button
            className="mt-2 flex h-[52px] w-full items-center justify-center gap-2.5 rounded-[15px] bg-gradient-to-r from-[#dcad4c] to-[#c98d21] text-sm font-bold text-white shadow-[0_10px_22px_rgba(174,126,35,0.26)] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            disabled={busyAction !== null}
            type="submit"
          >
            {busyAction === "create" ? (
              <LoaderCircle className="h-5 w-5 animate-spin" />
            ) : null}
            {busyAction === "create"
              ? t("register.creatingAccount")
              : t("register.createAccount")}
            {busyAction !== "create" ? (
              <ArrowRight className="h-5 w-5" />
            ) : null}
          </button>
        ) : null}
      </form>

      <p className="mt-5 text-center text-xs font-medium text-[#7f8187] sm:text-sm">
        {t("register.alreadyHaveAccount")} {" "}
        <Link
          className="font-semibold text-[#ba7b18] hover:text-[#925b0d]"
          href="/login"
        >
          {t("register.signIn")}
        </Link>
      </p>
    </AuthShell>
  );
}

function AuthShell({ children }: { children: ReactNode }) {
  const t = useTranslations("Auth");

  return (
    <main className="min-h-screen bg-[#f4efe6] p-2 sm:p-3 lg:p-4">
      <div className="mx-auto grid min-h-[calc(100vh-16px)] max-w-[1880px] overflow-hidden rounded-[28px] border border-[#e5d4b5] bg-[#fffdf8] shadow-[0_18px_60px_rgba(101,76,31,0.12)] lg:min-h-[calc(100vh-24px)] lg:grid-cols-2">
        <section
          aria-label={t("common.churchName")}
          className="relative hidden overflow-hidden bg-cover bg-center bg-no-repeat lg:flex lg:items-center lg:justify-center"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,253,248,0.78), rgba(255,249,238,0.9)), url('/images/login-background.png')",
          }}
        >
          <div className="relative z-10 flex max-w-[560px] flex-col items-center px-10 text-center">
            <img
              alt="Abune Logo"
              className="h-[118px] w-auto object-contain"
              src="/images/logo.png"
            />
            <h2 className="mt-10 text-[30px] font-extrabold uppercase leading-tight tracking-wide text-[#c99b37]">
              {t("common.fatherGuideShepherd")}
            </h2>
            <p className="mt-4 text-xl font-semibold text-[#4d6794]">
              {t("common.churchName")}
            </p>
            <div
              aria-hidden="true"
              className="my-9 flex items-center gap-5 text-[#c99b37]"
            >
              <span className="h-px w-28 bg-[#d9ba79]" />
              <span className="text-xl">✣</span>
              <span className="h-px w-28 bg-[#d9ba79]" />
            </div>
            <p className="max-w-[460px] text-xl leading-8 text-[#59729b]">
              {t("common.ministryDescription")}
            </p>
          </div>
        </section>

        <section className="relative flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_100%_20%,rgba(234,203,135,0.18),transparent_20%),linear-gradient(145deg,#fffefa_0%,#fcf4e7_100%)] px-5 py-10 sm:px-10 lg:px-14">
          <div className="pointer-events-none absolute -right-20 top-12 h-64 w-64 rounded-full border border-[#f0ddb7]" />
          <div className="relative z-10 w-full max-w-[430px]">
            {children}

            <div
              aria-hidden="true"
              className="my-6 flex items-center gap-3 text-[#ca922f]"
            >
              <span className="h-px flex-1 bg-[#eadbc2]" />
              <span className="text-xl">✣</span>
              <span className="h-px flex-1 bg-[#eadbc2]" />
            </div>

            <p className="text-center text-xs font-medium text-[#7d899a]">
              {t("common.copyright")}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function PasswordField({
  id,
  onChange,
  onToggle,
  placeholder,
  show,
  value,
}: {
  id: string;
  onChange: (value: string) => void;
  onToggle: () => void;
  placeholder: string;
  show: boolean;
  value: string;
}) {
  return (
    <label className={fieldClass} htmlFor={id}>
      <LockKeyhole className="h-[18px] w-[18px] shrink-0" />
      <input
        autoComplete="new-password"
        className={inputClass}
        id={id}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={show ? "text" : "password"}
        value={value}
      />
      <button
        aria-label={show ? "Hide password" : "Show password"}
        className="shrink-0 transition-colors hover:text-[#b77b19]"
        onClick={onToggle}
        type="button"
      >
        {show ? (
          <EyeOff className="h-[18px] w-[18px]" />
        ) : (
          <Eye className="h-[18px] w-[18px]" />
        )}
      </button>
    </label>
  );
}
