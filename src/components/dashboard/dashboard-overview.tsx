"use client";

import {
  Bell,
  CalendarCheck2,
  CalendarClock,
  ChevronRight,
  Cross,
  HandHeart,
  Heart,
  NotebookTabs,
  TrendingUp,
  UserRoundCheck,
  Users,
  CircleCheck,
  Clock3,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const stats = [
  {
    label: "Total Children",
    value: "156",
    status: "+12",
    icon: Users,
    iconClassName: "bg-[#fbf0db] text-[#c9a34e]",
    statusClassName: "text-[#168c53]",
  },
  {
    label: "Meetings Today",
    value: "8",
    status: "3 pending",
    icon: CalendarCheck2,
    iconClassName: "bg-[#e3f1ff] text-[#1685e5]",
    statusClassName: "text-[#168c53]",
  },
  {
    label: "Communion Ready",
    value: "24",
    status: "+5",
    icon: Heart,
    iconClassName: "bg-[#e2f7ed] text-[#269d69]",
    statusClassName: "text-[#168c53]",
  },
  {
    label: "In Repentance",
    value: "18",
    status: "-2",
    icon: TrendingUp,
    iconClassName: "bg-[#fff1df] text-[#ed920d]",
    statusClassName: "text-[#168c53]",
  },
] as const;

const requests = [
  {
    title: "Confession Request",
    name: "Mekdes Assefa",
    date: "Requested on May 18, 2025 - 9:30 AM",
    icon: Cross,
    iconClassName: "bg-[#f5ecff] text-[#9b5cff]",
  },
  {
    title: "Spiritual Guidance",
    name: "Daniel Gebre",
    date: "Requested on May 18, 2025 - 8:15 AM",
    icon: HandHeart,
    iconClassName: "bg-[#e9fff1] text-[#35b56e]",
  },
  {
    title: "Counseling Request",
    name: "Hanna Tesfaye",
    date: "Requested on May 17, 2025 - 6:45 PM",
    icon: Heart,
    iconClassName: "bg-[#ffe9f0] text-[#f05c88]",
  },
  {
    title: "Family Issue",
    name: "Rachel Michael",
    date: "Requested on May 17, 2025 - 4:20 PM",
    icon: Users,
    iconClassName: "bg-[#eaf1ff] text-[#4f7bff]",
  },
  {
    title: "Spiritual Guidance",
    name: "Samuel Bekele",
    date: "Requested on May 17, 2025 - 2:10 PM",
    icon: NotebookTabs,
    iconClassName: "bg-[#f3e8ff] text-[#8b5cf6]",
  },
] as const;

const appointments = [
  {
    time: "09:00 AM",
    name: "Abebe Tesfaye",
    initials: "AT",
    type: "Confession",
    status: "Completed",
    statusClassName: "bg-[#e8f8ef] text-[#13975d]",
  },
  {
    time: "10:30 AM",
    name: "Marta Girma",
    initials: "MG",
    type: "Reflection",
    status: "In Progress",
    statusClassName: "bg-[#e5f1ff] text-[#1685e5]",
  },
  {
    time: "02:00 PM",
    name: "Dawit Mulugeta",
    initials: "DM",
    type: "Review",
    status: "Upcoming",
    statusClassName: "bg-[#fff3df] text-[#ed920d]",
  },
  {
    time: "03:30 PM",
    name: "Sara Bekele",
    initials: "SB",
    type: "Confession",
    status: "Upcoming",
    statusClassName: "bg-[#fff3df] text-[#ed920d]",
  },
] as const;

const reminders = [
  {
    title: "Follow-up: Confession",
    subtitle: "With Mekdes Assefa",
    date: "May 20, 2025",
    time: "10:30 AM",
    icon: CalendarClock,
    iconClassName: "bg-[#eaf1ff] text-[#4f7bff]",
  },
  {
    title: "Spiritual Check-in",
    subtitle: "With Daniel Gebre",
    date: "May 21, 2025",
    time: "09:00 AM",
    icon: Bell,
    iconClassName: "bg-[#f3ebff] text-[#9b5cff]",
  },
  {
    title: "Monthly Family Visit",
    subtitle: "With Tesfaye Family",
    date: "May 25, 2025",
    time: "11:00 AM",
    icon: UserRoundCheck,
    iconClassName: "bg-[#e9fff1] text-[#36b56f]",
  },
] as const;

export function DashboardOverview() {
  return (
    <div className="space-y-7">
      {/* Statistics */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(
          ({
            icon: Icon,
            iconClassName,
            label,
            status,
            statusClassName,
            value,
          }) => (
            <div
              key={label}
              className="group relative min-h-[205px] overflow-hidden rounded-[24px] border border-[#ece7dd] bg-white px-7 py-6 shadow-[0_10px_30px_rgba(25,38,70,0.07)] transition-all duration-300 hover:-translate-y-1 hover:border-[#dfd2b7] hover:shadow-[0_18px_42px_rgba(25,38,70,0.13)]"
            >
              {/* Decorative glow */}
              <div className="pointer-events-none absolute -right-12 -top-14 h-32 w-32 rounded-full bg-[#d9b354]/[0.06] transition-transform duration-500 group-hover:scale-125" />

              <div className="relative z-10 flex items-start justify-between">
                <div
                  className={cn(
                    "flex h-[58px] w-[58px] items-center justify-center rounded-[18px] shadow-sm ring-1 ring-black/[0.025] transition-transform duration-300 group-hover:scale-105",
                    iconClassName,
                  )}
                >
                  <Icon className="h-7 w-7" strokeWidth={1.8} />
                </div>

                <span
                  className={cn(
                    "rounded-full bg-[#f1faf5] px-3 py-1 text-xs font-bold",
                    statusClassName,
                  )}
                >
                  {status}
                </span>
              </div>

              <div className="relative z-10 mt-7">
                <p className="text-[38px] font-extrabold leading-none tracking-tight text-[#17223f]">
                  {value}
                </p>

                <p className="mt-3 text-[16px] font-semibold text-[#7f899f]">
                  {label}
                </p>
              </div>

              <div className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#b99645] to-[#e1c16c] transition-transform duration-300 group-hover:scale-x-100" />
            </div>
          ),
        )}
      </section>

      {/* Requests and appointments */}
      <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        {/* Recent Requests */}
<Card className="overflow-hidden rounded-[26px] border border-[#ece8df] bg-white shadow-[0_12px_34px_rgba(25,38,70,0.08)]">
  <CardHeader className="px-7 pb-5 pt-7">
    <div className="flex items-center justify-between">
      <CardTitle className="text-[24px] font-semibold text-[#14213d]">
        Recent Requests
      </CardTitle>

      <button
        className="flex items-center gap-1 text-[15px] font-semibold text-[#c99936] transition-colors hover:text-[#a97d27]"
        type="button"
      >
        View All
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  </CardHeader>

  <CardContent className="space-y-4 px-7 pb-7">
    {requests.map(
      ({
        date,
        icon: Icon,
        iconClassName,
        name,
        title,
      }) => (
        <div
          key={`${title}-${name}`}
          className="group flex min-h-[100px] items-center gap-5 rounded-[17px] bg-[#f7f2e9] px-5 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#f3ecdf] hover:shadow-[0_8px_18px_rgba(34,45,70,0.07)]"
        >
          {/* Request icon */}
          <div
            className={cn(
              "flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full shadow-[0_7px_16px_rgba(34,45,70,0.10)]",
              iconClassName,
            )}
          >
            <Icon className="h-6 w-6" strokeWidth={1.8} />
          </div>

          {/* Request details */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-[18px] font-semibold text-[#10213f]">
              {title}
            </p>

            <div className="mt-1.5 flex flex-wrap items-center gap-3">
              <p className="text-[15px] font-medium text-[#4f5d78]">
                {name}
              </p>

              <span className="h-1 w-1 rounded-full bg-[#b5ad9e]" />

              <p className="text-[13px] font-medium text-[#8790a5]">
                {date}
              </p>
            </div>
          </div>

          {/* Request status */}
          <Badge
            variant="warning"
            className="shrink-0 rounded-full border-0 bg-[#fff3df] px-3.5 py-1.5 text-[13px] font-semibold text-[#ed920d] shadow-none"
          >
            Pending
          </Badge>
        </div>
      ),
    )}
  </CardContent>
</Card>

        {/* Today’s Appointments */}
<Card className="overflow-hidden rounded-[26px] border border-[#ece8df] bg-white shadow-[0_12px_34px_rgba(25,38,70,0.08)]">
  <CardHeader className="px-7 pb-5 pt-7">
    <div className="flex items-center justify-between">
      <CardTitle className="text-[24px] font-semibold text-[#14213d]">
        Today&apos;s Appointments
      </CardTitle>

      <button
        className="flex items-center gap-1 text-[15px] font-semibold text-[#c99936] transition-colors hover:text-[#a97d27]"
        type="button"
      >
        View All
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  </CardHeader>

  <CardContent className="space-y-4 px-7 pb-7">
    {appointments.map(
      ({
        initials,
        name,
        status,
        statusClassName,
        time,
        type,
      }) => (
        <div
          key={`${time}-${name}`}
          className="group flex min-h-[100px] items-center gap-5 rounded-[17px] bg-[#f7f2e9] px-5 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#f3ecdf] hover:shadow-[0_8px_18px_rgba(34,45,70,0.07)]"
        >
          {/* Initial avatar */}
          <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#d1a64c] to-[#b8892e] text-[18px] font-bold text-white shadow-[0_7px_16px_rgba(185,150,69,0.22)]">
            {initials}
          </div>

          {/* Name, time and appointment type */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-[18px] font-semibold text-[#10213f]">
              {name}
            </p>

            <div className="mt-1.5 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 text-[15px] font-medium text-[#8790a5]">
                <Clock3 className="h-4 w-4" strokeWidth={1.8} />
                <span>{time}</span>
              </div>

              <span className="rounded-full bg-[#fff4db] px-3 py-1 text-[13px] font-semibold text-[#9f721c]">
                {type}
              </span>
            </div>
          </div>

          {/* Appointment status */}
          <div
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-semibold",
              statusClassName,
            )}
          >
            {status === "Completed" && (
              <CircleCheck className="h-4 w-4" strokeWidth={1.8} />
            )}

            {status === "In Progress" && (
              <Clock3 className="h-4 w-4" strokeWidth={1.8} />
            )}

            <span>{status}</span>
          </div>
        </div>
      ),
    )}
  </CardContent>
</Card>
      </section>

      {/* Upcoming Reminders */}
      <Card className="overflow-hidden rounded-[26px] border border-[#ece8df] bg-white shadow-[0_12px_34px_rgba(25,38,70,0.07)]">
        <CardHeader className="border-b border-[#f0ede6] px-7 py-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-extrabold text-[#17223f]">
                Upcoming Reminders
              </CardTitle>

              <p className="mt-1 text-sm font-medium text-[#8992a7]">
                Important ministry activities coming soon
              </p>
            </div>

            <button
              className="rounded-full bg-[#f5f1e8] px-4 py-2 text-sm font-bold text-[#9c7b31] transition-colors hover:bg-[#ece2cf]"
              type="button"
            >
              View All
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-5">
          <div className="grid gap-4 lg:grid-cols-3">
            {reminders.map(
              ({
                date,
                icon: Icon,
                iconClassName,
                subtitle,
                time,
                title,
              }) => (
                <div
                  key={`${title}-${date}`}
                  className="group relative overflow-hidden rounded-[22px] border border-[#eee9df] bg-[#fdfcf9] p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_14px_28px_rgba(25,38,70,0.09)]"
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-[16px]",
                        iconClassName,
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <ChevronRight className="h-5 w-5 text-[#a5adbd] transition-transform group-hover:translate-x-1" />
                  </div>

                  <p className="mt-5 text-[16px] font-extrabold text-[#1d2859]">
                    {title}
                  </p>

                  <p className="mt-1 text-sm font-medium text-[#68728d]">
                    {subtitle}
                  </p>

                  <div className="mt-5 flex items-end justify-between border-t border-[#eee9df] pt-4">
                    <div>
                      <p className="text-sm font-bold text-[#4c5678]">
                        {date}
                      </p>

                      <p className="mt-1 text-xs font-medium text-[#8e97aa]">
                        {time}
                      </p>
                    </div>

                    <span className="rounded-full bg-[#f5f1e8] px-3 py-1 text-xs font-bold text-[#9c7b31]">
                      Upcoming
                    </span>
                  </div>
                </div>
              ),
            )}
          </div>

          <div className="mt-6 flex items-start gap-3 rounded-[18px] border border-[#e8dfca] bg-[#faf6ed] px-5 py-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#b99645] text-sm font-extrabold text-white">
              i
            </div>

            <div>
              <p className="text-sm font-bold text-[#3f4964]">
                Stay on top of your ministry
              </p>

              <p className="mt-1 text-sm font-medium text-[#7a8398]">
                You currently have 3 upcoming reminders requiring your
                attention.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}