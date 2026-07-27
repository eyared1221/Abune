"use client";

import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useLocale } from "next-intl";
import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth-client";

import { useRouter } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type LoginFormProps = {
  onLogin?: () => void;
  redirectTo?: string;
};

export function LoginForm({
  onLogin,
  redirectTo = "/father",
}: LoginFormProps) {
  const router = useRouter();
  const locale = useLocale() as AppLocale;

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (
  event: FormEvent<HTMLFormElement>,
) => {
  event.preventDefault();

  setErrorMessage("");

  const identifier = emailOrUsername
    .trim()
    .toLowerCase();

  if (!identifier || !password) {
    setErrorMessage(
      "Please enter your email or username and password.",
    );
    return;
  }

  setIsSubmitting(true);

  try {
    let result;

    if (identifier.includes("@")) {
      result = await authClient.signIn.email({
        email: identifier,
        password,
        rememberMe,
      });
    } else {
      result =
        await authClient.signIn.username({
          username: identifier,
          password,
        });
    }

    if (result.error) {
      setErrorMessage(
        "Invalid email, username, or password.",
      );
      return;
    }

    if (onLogin) {
      onLogin();
      return;
    }

    router.replace(redirectTo, { locale });
    router.refresh();
  } catch (error) {
    console.error("Sign-in request failed:", error);

    setErrorMessage(
      "Unable to sign in. Please try again.",
    );
  } finally {
    setIsSubmitting(false);
  }
};

  const handleRegistrationSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    router.replace("/child", { locale });
    router.refresh();
  };

  return (
    <main className="h-[100dvh] overflow-hidden bg-[#f4efe6] p-2 sm:p-3 lg:p-4">
      <div className="mx-auto grid h-full max-w-[1530px] overflow-hidden rounded-[22px] border border-[#e2d2b5] bg-white shadow-[0_18px_60px_rgba(101,76,31,0.12)] lg:grid-cols-2">
        {/* Left panel */}
        <section
          aria-label="Ethiopian Orthodox Church"
          className="relative hidden h-full overflow-hidden bg-cover bg-center bg-no-repeat lg:flex lg:items-center lg:justify-center"
          style={{
            backgroundImage:
              "url('/images/login-background.png')",
          }}
        >
          <div className="relative z-10 flex max-w-[500px] flex-col items-center px-10 text-center">
            <img
              src="/images/logo.png"
              alt="Abune Logo"
              className="mb-5 h-[105px] w-auto object-contain xl:h-[118px]"
            />

            <h1 className="max-w-[430px] text-[22px] font-extrabold uppercase leading-tight tracking-wide text-[#c59b3d] xl:text-[24px]">
              Spiritual Father. Guide. Shepherd
            </h1>

            <p className="mt-2 text-[16px] font-semibold text-[#5f6f91] xl:text-[17px]">
              Ethiopian Orthodox Tewahedo Church
            </p>

            <div className="my-5 flex w-full items-center justify-center gap-4">
              <div className="h-px w-24 bg-[#dbc28d]" />
              <span className="text-lg text-[#c59b3d]">
                ✣
              </span>
              <div className="h-px w-24 bg-[#dbc28d]" />
            </div>

            <p className="max-w-[350px] text-[15px] leading-6 text-[#66728d] xl:text-[16px]">
              Manage your spiritual ministry, children,
              appointments, and confessions in one sacred
              space.
            </p>
          </div>
        </section>

        {/* Right panel */}
        <section
          className="relative flex h-full min-h-0 items-center justify-center overflow-hidden bg-[#fffdf8] px-5 py-6 sm:px-10 lg:px-14"
          style={{
            background:
              "radial-gradient(circle at 84% 14%, rgba(222, 183, 100, 0.18), transparent 18%), radial-gradient(circle at 16% 35%, rgba(238, 208, 145, 0.16), transparent 22%), linear-gradient(145deg, #fffefa 0%, #fcf5e9 100%)",
          }}
        >
          {/* Decorative background shapes */}
          <div className="pointer-events-none absolute -right-20 top-10 h-52 w-52 rounded-full border border-[#d8ae58]/20" />

          <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full border border-[#d8ae58]/15" />

          <div className="relative z-10 w-full max-w-[430px]">
            {showRegistration ? (
              <form
                className="space-y-3"
                onSubmit={handleRegistrationSubmit}
              >
                <div className="text-center">
                  <h2 className="font-serif text-[29px] font-bold leading-tight tracking-tight text-[#26395d] sm:text-[34px]">
                    Create Your<br />Spiritual Child Account
                  </h2>

                  <p className="mx-auto mt-2 max-w-[320px] text-sm font-medium leading-5 text-[#8a8b91]">
                    Register to connect with your spiritual father and begin your spiritual journey.
                  </p>
                </div>

                <div className="pt-3">
                  <label className="sr-only" htmlFor="baptismal-name">
                    Baptismal Name
                  </label>
                  <div className="flex h-[52px] items-center gap-3 rounded-[10px] border border-[#e8dfd0] bg-white/85 px-4 text-[#9c9a92] shadow-sm focus-within:border-[#d3a346] focus-within:ring-4 focus-within:ring-[#c59b3d]/10">
                    <UserRound className="h-[18px] w-[18px] shrink-0" />
                    <input
                      autoComplete="name"
                      className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium text-[#45506a] outline-none placeholder:text-[#a3a19d]"
                      id="baptismal-name"
                      placeholder="Baptismal Name"
                      type="text"
                    />
                  </div>
                </div>

                <div className="flex h-[52px] items-center gap-3 rounded-[10px] border border-[#e8dfd0] bg-white/85 px-4 text-[#9c9a92] shadow-sm focus-within:border-[#d3a346] focus-within:ring-4 focus-within:ring-[#c59b3d]/10">
                  <Mail className="h-[18px] w-[18px] shrink-0" />
                  <label className="sr-only" htmlFor="registration-email">
                    Email
                  </label>
                  <input
                    autoComplete="email"
                    className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium text-[#45506a] outline-none placeholder:text-[#a3a19d]"
                    id="registration-email"
                    placeholder="Email"
                    type="email"
                  />
                  <button
                    className="shrink-0 rounded-[9px] border border-[#d5a54b] px-3 py-1.5 text-xs font-semibold text-[#bd8424] transition-colors hover:bg-[#fff6e3]"
                    type="button"
                  >
                    Send Code
                  </button>
                </div>

                <div className="flex h-[52px] items-center gap-3 rounded-[10px] border border-[#e8dfd0] bg-white/85 px-4 text-[#9c9a92] shadow-sm focus-within:border-[#d3a346] focus-within:ring-4 focus-within:ring-[#c59b3d]/10">
                  <ShieldCheck className="h-[18px] w-[18px] shrink-0" />
                  <label className="sr-only" htmlFor="verification-code">
                    Verification Code
                  </label>
                  <input
                    autoComplete="one-time-code"
                    className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium text-[#45506a] outline-none placeholder:text-[#a3a19d]"
                    id="verification-code"
                    placeholder="Verification Code"
                    type="text"
                  />
                </div>

                <div className="flex h-[52px] items-center gap-3 rounded-[10px] border border-[#e8dfd0] bg-white/85 px-4 text-[#9c9a92] shadow-sm focus-within:border-[#d3a346] focus-within:ring-4 focus-within:ring-[#c59b3d]/10">
                  <LockKeyhole className="h-[18px] w-[18px] shrink-0" />
                  <label className="sr-only" htmlFor="registration-password">
                    Password
                  </label>
                  <input
                    autoComplete="new-password"
                    className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium text-[#45506a] outline-none placeholder:text-[#a3a19d]"
                    id="registration-password"
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                  />
                  <button
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#9c9a92] transition-colors hover:bg-[#f7efdf] hover:text-[#a17d36]"
                    onClick={() => setShowPassword((current) => !current)}
                    type="button"
                  >
                    {showPassword ? <EyeOff className="h-[19px] w-[19px]" /> : <Eye className="h-[19px] w-[19px]" />}
                  </button>
                </div>

                <div className="flex h-[52px] items-center gap-3 rounded-[10px] border border-[#e8dfd0] bg-white/85 px-4 text-[#9c9a92] shadow-sm focus-within:border-[#d3a346] focus-within:ring-4 focus-within:ring-[#c59b3d]/10">
                  <LockKeyhole className="h-[18px] w-[18px] shrink-0" />
                  <label className="sr-only" htmlFor="confirm-password">
                    Confirm Password
                  </label>
                  <input
                    autoComplete="new-password"
                    className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium text-[#45506a] outline-none placeholder:text-[#a3a19d]"
                    id="confirm-password"
                    placeholder="Confirm Password"
                    type={showPassword ? "text" : "password"}
                  />
                  <button
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#9c9a92] transition-colors hover:bg-[#f7efdf] hover:text-[#a17d36]"
                    onClick={() => setShowPassword((current) => !current)}
                    type="button"
                  >
                    {showPassword ? <EyeOff className="h-[19px] w-[19px]" /> : <Eye className="h-[19px] w-[19px]" />}
                  </button>
                </div>

                <button
                  className="mt-2 flex h-[54px] w-full items-center justify-center gap-2.5 rounded-[15px] bg-gradient-to-r from-[#dcad4c] to-[#c98d21] text-base font-bold text-white shadow-[0_10px_22px_rgba(174,126,35,0.26)] transition-all hover:-translate-y-0.5 hover:from-[#d09a34] hover:to-[#b87814]"
                  type="submit"
                >
                  Create Account
                  <ArrowRight className="h-[19px] w-[19px]" />
                </button>

                <p className="pt-2 text-center text-xs font-medium text-[#7f8187] sm:text-sm">
                  Already have an account?{" "}
                  <button
                    className="font-semibold text-[#ad8128] transition-colors hover:text-[#865f16]"
                    onClick={() => setShowRegistration(false)}
                    type="button"
                  >
                    Sign In
                  </button>
                </p>
              </form>
            ) : (
              <>
            <div className="text-center">
              <img
                alt="Abune"
                className="mx-auto h-[106px] w-[106px] rounded-full object-cover shadow-[0_8px_24px_rgba(96,67,20,0.14)]"
                src="/images/logo.png"
              />

              <h2 className="mt-6 font-serif text-[31px] font-bold tracking-tight text-[#26395d] sm:text-[34px]">
                  Welcome Back
              </h2>

              <p className="mt-1 text-sm font-medium text-[#8a8b91]">
                Sign in to your Abune account
              </p>
            </div>

            <form
              className="mt-7 space-y-4"
              onSubmit={handleSubmit}
            >
                {/* Email */}
                <div>
                  <label
                    className="sr-only"
                    htmlFor="email-or-username"
                  >
                    Email
                  </label>

                  <div className="flex h-[52px] items-center gap-3 rounded-[10px] border border-[#e8dfd0] bg-white/85 px-4 text-[#9c9a92] shadow-sm transition-all focus-within:border-[#d3a346] focus-within:ring-4 focus-within:ring-[#c59b3d]/10">
                    <Mail className="h-[18px] w-[18px] shrink-0" />

                    <input
                      autoComplete="email"
                      className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium text-[#45506a] outline-none placeholder:text-[#a3a19d]"
                      id="email-or-username"
                      onChange={(event) =>
                        setEmailOrUsername(
                          event.target.value,
                        )
                      }
                      placeholder="Email"
                      type="email"
                      value={emailOrUsername}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    className="sr-only"
                    htmlFor="password"
                  >
                    Password
                  </label>

                  <div className="flex h-[52px] items-center gap-3 rounded-[10px] border border-[#e8dfd0] bg-white/85 px-4 text-[#9c9a92] shadow-sm transition-all focus-within:border-[#d3a346] focus-within:ring-4 focus-within:ring-[#c59b3d]/10">
                    <LockKeyhole className="h-[18px] w-[18px] shrink-0" />

                    <input
                      autoComplete="current-password"
                      className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium text-[#45506a] outline-none placeholder:text-[#a3a19d]"
                      id="password"
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      placeholder="Password"
                      type={
                        showPassword ? "text" : "password"
                      }
                      value={password}
                    />

                    <button
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#9c9a92] transition-colors hover:bg-[#f7efdf] hover:text-[#a17d36]"
                      onClick={() =>
                        setShowPassword(
                          (current) => !current,
                        )
                      }
                      type="button"
                    >
                      {showPassword ? (
                        <EyeOff className="h-[19px] w-[19px]" />
                      ) : (
                        <Eye className="h-[19px] w-[19px]" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember and forgot password */}
                <div className="flex items-center justify-between gap-3">
                  <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-[#73777e]">
                    <input
                      checked={rememberMe}
                      className="h-3.5 w-3.5 rounded border-[#cfc1a5] accent-[#c89532]"
                      onChange={(event) =>
                        setRememberMe(
                          event.target.checked,
                        )
                      }
                      type="checkbox"
                    />

                    Remember me
                  </label>

                  <button
                    className="text-xs font-semibold text-[#bc8425] transition-colors hover:text-[#865f16]"
                    type="button"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Error */}
                {errorMessage ? (
                  <div
                    className="rounded-[11px] border border-[#e9c7bd] bg-[#fff7f3] px-4 py-2.5 text-sm font-semibold text-[#b75a45]"
                    role="alert"
                  >
                    {errorMessage}
                  </div>
                ) : null}

                {/* Sign in button */}
                <button
                  className={cn(
                    "flex h-[52px] w-full items-center justify-center gap-2.5 rounded-[15px] bg-gradient-to-r from-[#dcad4c] to-[#c98d21] text-sm font-bold text-white shadow-[0_10px_22px_rgba(174,126,35,0.26)] transition-all hover:-translate-y-0.5 hover:from-[#d09a34] hover:to-[#b87814] hover:shadow-[0_13px_26px_rgba(174,126,35,0.30)]",
                    isSubmitting &&
                      "cursor-not-allowed opacity-70 hover:translate-y-0",
                  )}
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting
                    ? "Signing In..."
                    : "Sign In"}

                  <ArrowRight className="h-[18px] w-[18px]" />
                </button>

                {/* Administrator */}
                <p className="pt-3 text-center text-xs font-medium text-[#7f8187] sm:text-sm">
                  Don&apos;t have an account?{" "}
                  <button
                    className="font-semibold text-[#ad8128] transition-colors hover:text-[#865f16]"
                    onClick={() => setShowRegistration(true)}
                    type="button"
                  >
                    Register now
                  </button>
                </p>
              </form>
              </>
            )}

            <div
              aria-hidden="true"
              className="my-6 flex items-center gap-3 text-[#c99432]"
            >
              <span className="h-px flex-1 bg-[#eadfca]" />
              <span className="text-lg leading-none">✣</span>
              <span className="h-px flex-1 bg-[#eadfca]" />
            </div>

            <p className="text-center text-xs font-medium text-[#8f9093]">
              © 2026 Abune. All rights reserved.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
