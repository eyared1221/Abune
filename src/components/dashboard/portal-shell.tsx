"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import { useState, type ReactNode } from "react";
import {
  Bell,
  BookHeart,
  CalendarCheck2,
  CalendarDays,
  CalendarHeart,
  FileBadge,
  Home,
  LoaderCircle,
  LogOut,
  Menu,
  MessageSquare,
  Search,
  Settings,
  Users,
  X,
} from "lucide-react";

import { LanguageToggle } from "@/components/layouts/language-toggle";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon: typeof Home;
  match: string[];
  exact?: boolean;
};

const primaryNavigation: NavItem[] = [
  {
    label: "Dashboard",
    href: "/father",
    icon: Home,
    match: ["/father"],
    exact: true,
  },
  {
    label: "Spiritual Children",
    href: "/father/children",
    icon: Users,
    match: ["/father/children"],
  },
  {
    label: "Schedule",
    href: "/father/calendar",
    icon: CalendarDays,
    match: ["/father/calendar"],
  },
  {
    label: "Appointments",
    href: "/father/appointments",
    icon: CalendarCheck2,
    match: ["/father/appointments"],
  },
  {
    label: "Requests",
    href: "/father/requests",
    icon: FileBadge,
    match: ["/father/requests"],
  },
  {
    label: "Spiritual Guidance",
    href: "/confessions",
    icon: BookHeart,
    match: ["/confessions"],
  },
  {
    label: "Holy Communion",
    href: "/father/spiritual-dates",
    icon: CalendarHeart,
    match: ["/father/spiritual-dates"],
  },
  {
    label: "Reminders",
    href: "/father/reminders",
    icon: Bell,
    match: ["/father/reminders"],
  },
];

const utilityNavigation: NavItem[] = [
  {
    label: "Messages",
    href: "/father/messages",
    icon: MessageSquare,
    match: ["/father/messages"],
  },
  {
    label: "Settings",
    href: "/father/settings",
    icon: Settings,
    match: ["/father/settings"],
  },
];

type PortalShellProps = {
  children: ReactNode;

  // Used only for the Dashboard welcome section.
  title?: string;
  description?: string;
  heroAccent?: string;
  showHero?: boolean;

  // Kept for compatibility with existing page files.
  currentPath?: string;
  heroVariant?: "default" | "welcome";
};

export function PortalShell({
  children,
  title = "",
  description = "",
  heroAccent,
  showHero,
  currentPath,
  heroVariant = "default",
}: PortalShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const router = useRouter();
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const activePath = currentPath ?? pathname;

  // The welcome section appears only on the Dashboard.
  const shouldShowWelcomeHero =
    showHero ?? heroVariant === "welcome";

  const todayLabel = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })
    .format(new Date())
    .toUpperCase();

  const heroAccentParts =
    heroAccent && description.includes(heroAccent)
      ? description.split(heroAccent)
      : null;

  async function handleLogout() {
    setIsLoggingOut(true);
    setLogoutError("");

    try {
      const result = await authClient.signOut();

      if (result.error) {
        throw new Error(result.error.message || "Logout failed.");
      }

      setLogoutDialogOpen(false);
      router.replace("/login", { locale });
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
      setLogoutError("Unable to log out. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  }

  function openLogoutDialog() {
    setMobileMenuOpen(false);
    setLogoutError("");
    setLogoutDialogOpen(true);
  }

  function closeLogoutDialog() {
    if (isLoggingOut) {
      return;
    }

    setLogoutDialogOpen(false);
    setLogoutError("");
  }

  const renderNavigation = (items: NavItem[]) =>
    items.map(
      ({
        exact = false,
        href,
        icon: Icon,
        label,
        match,
      }) => {
        const isActive = match.some(
          (value) =>
            activePath === value ||
            (!exact && activePath.startsWith(`${value}/`)),
        );

        return (
          <Link
            key={href}
            href={href}
            onClick={() => setMobileMenuOpen(false)}
            className={cn(
              "group mx-1 flex min-h-[58px] items-center gap-3 rounded-[20px] border px-3 py-2 transition-all duration-200",
              isActive
                ? [
                    "border-transparent bg-[#f3e8d1]",
                    "shadow-[0_10px_24px_rgba(207,174,102,0.18)]",
                  ]
                : [
                    "border-transparent bg-transparent",
                    "hover:border-[#eee2ca] hover:bg-[#fffaf0]",
                  ],
            )}
          >
            <span
              className={cn(
                "flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[14px] transition-all duration-200",
                isActive
                  ? "bg-[#ddb84f] text-[#18335f] shadow-[0_6px_14px_rgba(205,163,58,0.22)]"
                  : "bg-[#f1e7d4] text-[#7888a7] group-hover:bg-white",
              )}
            >
              <Icon
                className="h-[20px] w-[20px]"
                strokeWidth={1.9}
              />
            </span>

            <p
              className={cn(
                "min-w-0 flex-1 truncate text-[15px] font-bold",
                isActive
                  ? "text-[#b98b25]"
                  : "text-[#102b55]",
              )}
            >
              {label}
            </p>

            <span
              className={cn(
                "h-2.5 w-2.5 shrink-0 rounded-full transition-opacity",
                isActive
                  ? "bg-[#d8b14b] opacity-100"
                  : "bg-[#dfc995] opacity-0 group-hover:opacity-100",
              )}
            />
          </Link>
        );
      },
    );

  return (
    <main className="min-h-screen bg-[#faf9f6] text-[#243453]">
      {/* Top header */}
      <header className="sticky top-0 z-50 h-[98px] border-b border-[#eadfca] bg-[rgba(255,255,255,0.97)] backdrop-blur">
        <div className="flex h-full w-full items-center">
{/* Logo area */}
<div className="flex h-full min-w-0 items-center gap-4 px-4 sm:px-6 xl:w-[560px] xl:shrink-0 xl:px-8">
  <button
    type="button"
    aria-label="Toggle navigation"
    aria-expanded={mobileMenuOpen}
    onClick={() => setMobileMenuOpen((open) => !open)}
    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#eadfca] bg-white text-[#263b61] xl:hidden"
  >
    {mobileMenuOpen ? (
      <X className="h-5 w-5" />
    ) : (
      <Menu className="h-5 w-5" />
    )}
  </button>

  <Image
    src="/images/logo.png"
    alt="Abune logo"
    width={72}
    height={72}
    priority
    className="h-[70px] w-[70px] shrink-0 object-contain"
  />

  <div className="hidden min-w-0 sm:block">
    <p className="whitespace-nowrap text-[clamp(0.9rem,1.05vw,1.2rem)] font-black uppercase leading-tight tracking-[0.01em] text-[#c99d40]">
      Spiritual Father · Guide · Shepherd
    </p>

    <p className="mt-1 whitespace-nowrap text-[12px] font-semibold text-[#74829e]">
      Ethiopian Orthodox Tewahedo Church
    </p>
  </div>
</div>

          {/* Search and actions */}
          <div className="ml-auto flex min-w-0 flex-1 items-center justify-end gap-3 px-4 sm:px-6">
            <label className="hidden h-[54px] w-full max-w-[400px] items-center gap-3 rounded-full border border-[#ebdfca] bg-[#faf5ec] px-5 text-[#7e899e] md:flex">
              <Search
                className="h-5 w-5 shrink-0"
                strokeWidth={2}
              />

              <input
                type="search"
                placeholder="Search children..."
                className="w-full bg-transparent text-[14px] font-medium text-[#243453] placeholder:text-[#8b938f] focus:outline-none"
              />
            </label>

            <button
              type="button"
              aria-label="Notifications"
              className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#425477] transition-colors hover:bg-[#faf5ec]"
            >
              <Bell
                className="h-6 w-6"
                strokeWidth={1.8}
              />

              <span className="absolute right-[7px] top-[7px] h-[10px] w-[10px] rounded-full border-2 border-white bg-[#d84a3c]" />
            </button>

            <LanguageToggle />
          </div>
        </div>
      </header>

      <div className="relative min-h-[calc(100vh-98px)]">
        {/* Mobile overlay */}
        {mobileMenuOpen ? (
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 top-[98px] z-30 bg-[#1c2740]/35 xl:hidden"
          />
        ) : null}

        {/* Sidebar */}
        <aside
          className={cn(
            "fixed bottom-0 left-0 top-[98px] z-40 w-[285px]",
            "border-r border-[#ece3d4]",
            "bg-[linear-gradient(180deg,#fffdf8_0%,#fcf7ee_100%)]",
            "transition-transform duration-300 ease-in-out",
            "xl:w-[320px] xl:translate-x-0",
            mobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full",
          )}
        >
          <div className="flex h-full flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-8 pt-3">
              <nav className="space-y-1.5">
                {renderNavigation(primaryNavigation)}
              </nav>

              <div className="mt-6 border-t border-[#e9deca] pt-5">
                <p className="px-4 text-[10px] font-black uppercase tracking-[0.18em] text-[#b09b75]">
                  Support
                </p>

                <nav className="mt-3 space-y-1.5">
                  {renderNavigation(utilityNavigation)}

                  <button
                    type="button"
                    onClick={openLogoutDialog}
                    className="group mx-1 flex min-h-[58px] w-[calc(100%_-_0.5rem)] items-center gap-3 rounded-[20px] border border-transparent px-3 py-2 text-left transition-all duration-200 hover:border-[#f0d6cf] hover:bg-[#fff4f1]"
                  >
                    <span className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[14px] bg-[#f7e6e1] text-[#b95a48] transition-all duration-200 group-hover:bg-white">
                      <LogOut
                        className="h-[20px] w-[20px]"
                        strokeWidth={1.9}
                      />
                    </span>

                    <span className="min-w-0 flex-1 truncate text-[15px] font-bold text-[#9f4437]">
                      Logout
                    </span>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <section className="min-w-0 xl:ml-[320px]">
          {/* Dashboard welcome section only */}
          {shouldShowWelcomeHero ? (
            <div className="relative min-h-[170px] overflow-hidden border-b border-[#eee4d2] bg-[linear-gradient(105deg,#fffdf8_0%,#fbf5e8_100%)] px-6 py-7 sm:px-10 lg:px-12 xl:rounded-bl-[30px] xl:rounded-br-[30px]">
              <div className="pointer-events-none absolute right-[-35px] top-[-92px] h-[215px] w-[215px] rounded-full bg-[#dfc78f]/30" />

              <div className="pointer-events-none absolute bottom-[-65px] right-[7%] h-[160px] w-[160px] rounded-full bg-[#ead9b4]/38" />

              <div className="pointer-events-none absolute bottom-[-90px] right-[33%] h-[155px] w-[155px] rounded-full bg-[#f2e8d0]/34" />

              <div className="relative z-10 max-w-4xl">
                <p
                  suppressHydrationWarning
                  className="text-[15px] font-black uppercase tracking-[0.08em] text-[#cca046] sm:text-[17px]"
                >
                  {todayLabel}
                </p>

                <h1 className="mt-3 text-[clamp(2rem,2.6vw,2.75rem)] font-black leading-[1.1] tracking-[-0.025em] text-[#173461]">
                  {title}
                </h1>

                <p className="mt-4 max-w-3xl text-[16px] font-medium leading-7 text-[#657696] sm:text-[18px]">
                  {heroAccentParts ? (
                    <>
                      {heroAccentParts[0]}

                      <span className="font-black text-[#c99b37]">
                        {heroAccent}
                      </span>

                      {heroAccentParts
                        .slice(1)
                        .join(heroAccent)}
                    </>
                  ) : (
                    description
                  )}
                </p>
              </div>
            </div>
          ) : null}

          {/* No separate header is shown on normal tabs */}
          <div
            className={cn(
              "px-4 pb-8 sm:px-6 lg:px-8",
              shouldShowWelcomeHero ? "pt-6" : "pt-8",
            )}
          >
            {children}
          </div>
        </section>
      </div>

      {logoutDialogOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          role="presentation"
        >
          <button
            type="button"
            aria-label="Close logout confirmation"
            className="absolute inset-0 bg-[#17233d]/45 backdrop-blur-[2px]"
            disabled={isLoggingOut}
            onClick={closeLogoutDialog}
          />

          <section
            aria-describedby="logout-dialog-description"
            aria-labelledby="logout-dialog-title"
            aria-modal="true"
            className="relative z-10 w-full max-w-[430px] rounded-[26px] border border-[#eadcc3] bg-[#fffdf8] p-6 shadow-[0_24px_80px_rgba(23,35,61,0.25)] sm:p-8"
            role="dialog"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#efd8d1] bg-[#fff3ef] text-[#b95543]">
              <LogOut className="h-7 w-7" strokeWidth={1.9} />
            </div>

            <h2
              id="logout-dialog-title"
              className="mt-5 text-center font-serif text-[27px] font-bold text-[#18335f]"
            >
              Do you want to logout?
            </h2>

            <p
              id="logout-dialog-description"
              className="mx-auto mt-2 max-w-[330px] text-center text-sm font-medium leading-6 text-[#74809a]"
            >
              You will need to sign in again to access the Spiritual Father
              portal.
            </p>

            {logoutError ? (
              <div
                className="mt-5 rounded-[12px] border border-[#e9c7bd] bg-[#fff7f3] px-4 py-3 text-center text-sm font-semibold text-[#b75a45]"
                role="alert"
              >
                {logoutError}
              </div>
            ) : null}

            <div className="mt-7 grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={isLoggingOut}
                onClick={closeLogoutDialog}
                className="flex h-12 items-center justify-center rounded-[13px] border border-[#dfd4c1] bg-white text-sm font-bold text-[#53617c] transition-colors hover:bg-[#faf6ef] disabled:cursor-not-allowed disabled:opacity-60"
              >
                No
              </button>

              <button
                type="button"
                disabled={isLoggingOut}
                onClick={() => void handleLogout()}
                className="flex h-12 items-center justify-center gap-2 rounded-[13px] bg-[#b95543] text-sm font-bold text-white shadow-[0_8px_18px_rgba(185,85,67,0.24)] transition-all hover:bg-[#a74636] disabled:cursor-not-allowed disabled:opacity-65"
              >
                {isLoggingOut ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : null}
                {isLoggingOut ? "Logging out..." : "Yes"}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}