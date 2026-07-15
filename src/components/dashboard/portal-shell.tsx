"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import {
  Bell,
  BookHeart,
  CalendarCheck2,
  CalendarDays,
  CalendarHeart,
  FileBadge,
  Home,
  Menu,
  MessageSquare,
  Search,
  Settings,
  Users,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  subtitle: string;
  href: string;
  icon: typeof Home;
  match: string[];
  exact?: boolean;
};

const primaryNavigation: NavItem[] = [
  {
    label: "Dashboard",
    subtitle: "Daily overview",
    href: "/father",
    icon: Home,
    match: ["/father"],
    exact: true,
  },
  {
    label: "Spiritual Children",
    subtitle: "Mentorship records",
    href: "/father/children",
    icon: Users,
    match: ["/father/children"],
  },
  {
    label: "Confessions",
    subtitle: "Private requests",
    href: "/confessions",
    icon: BookHeart,
    match: ["/confessions"],
  },
  {
    label: "Holy Communion",
    subtitle: "Communion readiness",
    href: "/father/spiritual-dates",
    icon: CalendarHeart,
    match: ["/father/spiritual-dates"],
  },
  {
    label: "Appointments",
    subtitle: "Today's schedule",
    href: "/father/appointments",
    icon: CalendarCheck2,
    match: ["/father/appointments"],
  },
  {
    label: "Requests",
    subtitle: "Pending follow-ups",
    href: "/father/requests",
    icon: FileBadge,
    match: ["/father/requests"],
  },
  {
    label: "Calendar",
    subtitle: "Monthly planning",
    href: "/father/calendar",
    icon: CalendarDays,
    match: ["/father/calendar"],
  },
  {
    label: "Reminders",
    subtitle: "Prayer prompts",
    href: "/father/reminders",
    icon: Bell,
    match: ["/father/reminders"],
  },
];

const utilityNavigation: NavItem[] = [
  {
    label: "Messages",
    subtitle: "Conversations",
    href: "/father/messages",
    icon: MessageSquare,
    match: ["/father/messages"],
  },
  {
    label: "Settings",
    subtitle: "Profile and account",
    href: "/father/settings",
    icon: Settings,
    match: ["/father/settings"],
  },
];

type PortalShellProps = {
  currentPath: string;
  title: string;
  description: string;
  children: ReactNode;
  showHero?: boolean;
  heroVariant?: "default" | "welcome";
  heroAccent?: string;
};

export function PortalShell({
  currentPath,
  title,
  description,
  children,
  showHero = true,
  heroVariant = "default",
  heroAccent,
}: PortalShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const renderNavigation = (items: NavItem[]) =>
    items.map(
      ({ exact = false, href, icon: Icon, label, match, subtitle }) => {
        const isActive = match.some(
          (value) =>
            currentPath === value ||
            (!exact && currentPath.startsWith(`${value}/`)),
        );

        return (
          <Link
            key={href}
            href={href}
            onClick={() => setMobileMenuOpen(false)}
            className={cn(
              "group flex min-h-[78px] items-center gap-4 rounded-[27px] border px-5 py-3 transition-all duration-200",
              isActive
                ? [
                    "border-transparent bg-[#f3e8d1]",
                    "shadow-[0_18px_36px_rgba(207,174,102,0.21)]",
                  ]
                : [
                    "border-transparent bg-transparent",
                    "hover:border-[#eee2ca] hover:bg-[#fffaf0]",
                  ],
            )}
          >
            <span
              className={cn(
                "flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[18px] transition-all duration-200",
                isActive
                  ? "bg-[#ddb84f] text-[#18335f] shadow-[0_8px_18px_rgba(205,163,58,0.24)]"
                  : "bg-[#f1e7d4] text-[#7888a7] group-hover:bg-white",
              )}
            >
              <Icon className="h-[23px] w-[23px]" strokeWidth={1.9} />
            </span>

            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  "truncate text-[16px] font-bold",
                  isActive ? "text-[#b98b25]" : "text-[#102b55]",
                )}
              >
                {label}
              </p>

              <p className="mt-1 truncate text-[12px] font-medium text-[#8490a9]">
                {subtitle}
              </p>
            </div>

            <span
              className={cn(
                "h-3 w-3 shrink-0 rounded-full transition-opacity",
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
      {/* Fixed top header */}
      <header className="sticky top-0 z-50 h-[98px] border-b border-[#eadfca] bg-[rgba(255,255,255,0.97)] backdrop-blur">
        <div className="flex h-full w-full items-center">
          {/* Logo and title area */}
          <div className="flex h-full min-w-0 items-center gap-3 px-4 sm:px-7 xl:w-[390px] xl:shrink-0 xl:border-r xl:border-[#efe6d6]">
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
              width={78}
              height={78}
              priority
              className="h-[76px] w-[76px] shrink-0 object-contain"
            />

            <div className="hidden min-w-0 sm:block">
              <p className="truncate text-[clamp(1rem,1.3vw,1.55rem)] font-black uppercase leading-tight tracking-[0.015em] text-[#c99d40]">
                Spiritual Father · Guide · Shepherd
              </p>

              <p className="mt-1 truncate text-[14px] font-semibold text-[#74829e]">
                Ethiopian Orthodox Tewahedo Church
              </p>
            </div>
          </div>

          {/* Search and notification area */}
          <div className="ml-auto flex min-w-0 flex-1 items-center justify-end gap-4 px-4 sm:px-7">
            <label className="hidden h-[58px] w-full max-w-[425px] items-center gap-3 rounded-full border border-[#ebdfca] bg-[#faf5ec] px-5 text-[#7e899e] md:flex">
              <Search className="h-5 w-5 shrink-0" strokeWidth={2} />

              <input
                type="search"
                placeholder="Search children..."
                className="w-full bg-transparent text-[15px] font-medium text-[#243453] placeholder:text-[#8b938f] focus:outline-none"
              />
            </label>

            <button
              type="button"
              aria-label="Notifications"
              className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-[#425477] transition-colors hover:bg-[#faf5ec]"
            >
              <Bell className="h-6 w-6" strokeWidth={1.8} />

              <span className="absolute right-[8px] top-[8px] h-[10px] w-[10px] rounded-full border-2 border-white bg-[#d84a3c]" />
            </button>
          </div>
        </div>
      </header>

      <div className="relative min-h-[calc(100vh-98px)]">
        {/* Mobile dark overlay */}
        {mobileMenuOpen ? (
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 top-[98px] z-30 bg-[#1c2740]/35 xl:hidden"
          />
        ) : null}

        {/* Left sidebar */}
        <aside
          className={cn(
            "fixed bottom-0 left-0 top-[98px] z-40 w-[330px]",
            "border-r border-[#ece3d4] bg-[linear-gradient(180deg,#fffdf8_0%,#fcf7ee_100%)]",
            "transition-transform duration-300 ease-in-out",
            "xl:w-[390px] xl:translate-x-0",
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex h-full flex-col">
            {/* Sidebar menu button */}
            <div className="flex h-[98px] shrink-0 items-center justify-end px-9 xl:px-[52px]">
              <button
                type="button"
                aria-label="Navigation menu"
                className="flex h-[52px] w-[52px] items-center justify-center rounded-[18px] border border-[#e9ddc8] bg-white text-[#415578] shadow-[0_8px_20px_rgba(44,59,91,0.07)]"
              >
                <Menu className="h-[23px] w-[23px]" strokeWidth={1.9} />
              </button>
            </div>

            {/* Scrollable navigation */}
            <div className="min-h-0 flex-1 overflow-y-auto px-[22px] pb-8">
              <nav className="space-y-2">
                {renderNavigation(primaryNavigation)}
              </nav>

              <div className="mt-7 border-t border-[#e9deca] pt-6">
                <p className="px-5 text-[11px] font-black uppercase tracking-[0.18em] text-[#b09b75]">
                  Support
                </p>

                <nav className="mt-3 space-y-2">
                  {renderNavigation(utilityNavigation)}
                </nav>
              </div>
            </div>
          </div>
        </aside>

        {/* Main page content */}
        <section className="min-w-0 xl:ml-[390px]">
          {/* Welcome hero */}
          {showHero && heroVariant === "welcome" ? (
            <div className="relative min-h-[170px] overflow-hidden border-b border-[#eee4d2] bg-[linear-gradient(105deg,#fffdf8_0%,#fbf5e8_100%)] px-6 py-7 sm:px-10 lg:px-12 xl:rounded-bl-[30px] xl:rounded-br-[30px]">
              {/* Decorative background shapes */}
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

                      {heroAccentParts.slice(1).join(heroAccent)}
                    </>
                  ) : (
                    description
                  )}
                </p>
              </div>
            </div>
          ) : null}

          {/* Default page heading */}
          {showHero && heroVariant === "default" ? (
            <div className="border-b border-[#eee4d2] bg-white px-6 py-7 sm:px-10 lg:px-12">
              <p className="text-sm font-black uppercase tracking-[0.12em] text-[#c99d42]">
                Ministry dashboard
              </p>

              <h1 className="mt-2 text-3xl font-extrabold text-[#243453]">
                {title}
              </h1>

              <p className="mt-3 max-w-2xl text-sm text-[#6e7b96] sm:text-base">
                {description}
              </p>
            </div>
          ) : null}

          {/* Heading when hero is disabled */}
          {!showHero ? (
            <div className="border-b border-[#eee4d2] bg-white px-6 py-7 sm:px-10 lg:px-12">
              <h1 className="text-3xl font-extrabold text-[#243453]">
                {title}
              </h1>

              <p className="mt-3 text-sm text-[#6e7b96] sm:text-base">
                {description}
              </p>
            </div>
          ) : null}

          {/* Dashboard page body */}
          <div className="px-4 pb-8 pt-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}