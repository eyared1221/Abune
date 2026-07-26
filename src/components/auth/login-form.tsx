"use client";

import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
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
          className="relative flex h-full min-h-0 items-center justify-center overflow-hidden px-4 py-4 sm:px-7 lg:px-10 xl:px-14"
          style={{
            background:
              "radial-gradient(circle at top right, rgba(197, 155, 61, 0.14), transparent 34%), linear-gradient(145deg, #fffdf8 0%, #fbf4e8 100%)",
          }}
        >
          {/* Decorative background shapes */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#c59b3d]/5" />

          <div className="pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-[#d9bd7b]/10" />

          <div className="relative z-10 flex h-full min-h-0 w-full max-w-[700px] flex-col justify-center">
            {/* Mobile branding */}
            <div className="mb-4 text-center lg:hidden">
              <img
                alt="Abune"
                className="mx-auto h-16 w-auto object-contain"
                src="/images/logo.png"
              />

              <p className="mt-2 text-xs font-extrabold uppercase tracking-wide text-[#b48a32]">
                Spiritual Father Portal
              </p>
            </div>

            <div className="rounded-[22px] border border-[#e3d3b5] bg-[#fffdfa]/95 px-5 py-5 shadow-[0_18px_46px_rgba(117,84,31,0.10)] backdrop-blur-sm sm:px-8 sm:py-6 lg:px-10 lg:py-7 xl:px-12">
              <div>
                <div className="mb-3 h-1 w-14 rounded-full bg-[#c59b3d]" />

                <h2 className="text-[28px] font-extrabold tracking-tight text-[#b2862e] sm:text-[30px]">
                  Welcome Back
                </h2>

                <p className="mt-1.5 text-sm font-medium text-[#5f6f91] sm:text-base">
                  Sign in to your Spiritual Father portal
                </p>
              </div>

              <form
                className="mt-6 space-y-4"
                onSubmit={handleSubmit}
              >
                {/* Email */}
                <div>
                  <label
                    className="mb-2 block text-sm font-bold text-[#405377]"
                    htmlFor="email-or-username"
                  >
                    Email or Username
                  </label>

                  <div className="flex h-[50px] items-center gap-3 rounded-[11px] border border-[#ddcfb5] bg-[#fffefb] px-4 text-[#a17d36] transition-all focus-within:border-[#c59b3d] focus-within:ring-4 focus-within:ring-[#c59b3d]/10">
                    <Mail className="h-[19px] w-[19px] shrink-0" />

                    <input
                      autoComplete="username"
                      className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium text-[#3f5070] outline-none placeholder:text-[#9296a1]"
                      id="email-or-username"
                      onChange={(event) =>
                        setEmailOrUsername(
                          event.target.value,
                        )
                      }
                      placeholder="Enter your email or username"
                      type="text"
                      value={emailOrUsername}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    className="mb-2 block text-sm font-bold text-[#405377]"
                    htmlFor="password"
                  >
                    Password
                  </label>

                  <div className="flex h-[50px] items-center gap-3 rounded-[11px] border border-[#ddcfb5] bg-[#fffefb] px-4 text-[#a17d36] transition-all focus-within:border-[#c59b3d] focus-within:ring-4 focus-within:ring-[#c59b3d]/10">
                    <LockKeyhole className="h-[19px] w-[19px] shrink-0" />

                    <input
                      autoComplete="current-password"
                      className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium text-[#3f5070] outline-none placeholder:text-[#9296a1]"
                      id="password"
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      placeholder="Enter your password"
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
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#7d8ba5] transition-colors hover:bg-[#f7efdf] hover:text-[#a17d36]"
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
                  <label className="flex cursor-pointer items-center gap-2.5 text-sm font-semibold text-[#536586]">
                    <input
                      checked={rememberMe}
                      className="h-4 w-4 rounded border-[#cfc1a5] accent-[#b68a30]"
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
                    className="text-sm font-semibold text-[#ad8128] transition-colors hover:text-[#865f16]"
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
                    "flex h-[50px] w-full items-center justify-center gap-2.5 rounded-[10px] bg-gradient-to-r from-[#c59b3d] to-[#aa7b24] text-sm font-bold text-white shadow-[0_10px_24px_rgba(174,126,35,0.25)] transition-all hover:-translate-y-0.5 hover:from-[#b88c31] hover:to-[#966a1c] hover:shadow-[0_13px_28px_rgba(174,126,35,0.30)]",
                    isSubmitting &&
                      "cursor-not-allowed opacity-70 hover:translate-y-0",
                  )}
                  disabled={isSubmitting}
                  type="submit"
                >
                  <LockKeyhole className="h-[19px] w-[19px]" />

                  {isSubmitting
                    ? "Signing In..."
                    : "Sign In"}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-4">
                  <span className="h-px flex-1 bg-[#e3d7c1]" />

                  <span className="text-xs font-medium text-[#7e8491]">
                    or continue with
                  </span>

                  <span className="h-px flex-1 bg-[#e3d7c1]" />
                </div>

                {/* Google */}
                <button
                  className="flex h-[48px] w-full items-center justify-center gap-3 rounded-[10px] border border-[#ddcfb5] bg-[#fffefb] text-sm font-semibold text-[#4d5f80] transition-all hover:border-[#c9b481] hover:bg-[#fbf5e9]"
                  type="button"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full text-sm font-extrabold text-[#b48831]">
                    G
                  </span>

                  Continue with Google
                </button>

                {/* Administrator */}
                <p className="text-center text-xs font-medium text-[#687591] sm:text-sm">
                  Don&apos;t have an account?{" "}
                  <button
                    className="font-semibold text-[#ad8128] transition-colors hover:text-[#865f16]"
                    type="button"
                  >
                    Contact administrator
                  </button>
                </p>
              </form>
            </div>

            <p className="mt-3 text-center text-xs font-medium text-[#6e7d99] sm:text-sm">
              © 2026 Abune. All rights reserved.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
