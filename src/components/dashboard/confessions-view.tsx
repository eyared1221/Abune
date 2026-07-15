"use client";

import {
  CalendarCheck2,
  CalendarClock,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Cross,
  Eye,
  Filter,
  MoreHorizontal,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const stats = [
  {
    label: "Pending Requests",
    value: "12",
    note: "Needs your attention",
    icon: Cross,
    iconClassName: "bg-[#f3e8ff] text-[#8d5df6]",
    noteClassName: "text-[#8d5df6]",
  },
  {
    label: "Upcoming Confessions",
    value: "8",
    note: "This week",
    icon: CalendarCheck2,
    iconClassName: "bg-[#e8fff1] text-[#33b36b]",
    noteClassName: "text-[#6d7796]",
  },
  {
    label: "Confessions Completed",
    value: "156",
    note: "This month",
    icon: CheckCircle2,
    iconClassName: "bg-[#e9f1ff] text-[#4676ff]",
    noteClassName: "text-[#6d7796]",
  },
  {
    label: "Follow-up Needed",
    value: "24",
    note: "Requires follow-up",
    icon: CalendarClock,
    iconClassName: "bg-[#fff5df] text-[#f59e0b]",
    noteClassName: "text-[#6d7796]",
  },
] as const;

const confessionRequests = [
  {
    initials: "MA",
    name: "Mekdes Assefa",
    meta: "Age 22  -  Young Adults",
    requestedFor: "Requested for: May 18, 2025  -  9:30 AM",
    status: "Pending",
    requestDate: "Requested on",
    requestDay: "May 16, 2025",
    avatarClassName: "bg-[#f4ebff] text-[#8e59ff]",
  },
  {
    initials: "DG",
    name: "Daniel Gebre",
    meta: "Age 19  -  Teens",
    requestedFor: "Requested for: May 18, 2025  -  11:30 AM",
    status: "Pending",
    requestDate: "Requested on",
    requestDay: "May 16, 2025",
    avatarClassName: "bg-[#e8fff2] text-[#2eaf67]",
  },
  {
    initials: "HT",
    name: "Hanna Tesfaye",
    meta: "Age 24  -  Young Adults",
    requestedFor: "Requested for: May 17, 2025  -  6:45 PM",
    status: "Pending",
    requestDate: "Requested on",
    requestDay: "May 15, 2025",
    avatarClassName: "bg-[#ffe9f0] text-[#ef476f]",
  },
  {
    initials: "YB",
    name: "Yonas Berhe",
    meta: "Age 17  -  Teens",
    requestedFor: "Requested for: May 17, 2025  -  2:30 PM",
    status: "Pending",
    requestDate: "Requested on",
    requestDay: "May 15, 2025",
    avatarClassName: "bg-[#eaf1ff] text-[#4676ff]",
  },
  {
    initials: "RM",
    name: "Rachel Michael",
    meta: "Age 21  -  Young Adults",
    requestedFor: "Requested for: May 16, 2025  -  4:00 PM",
    status: "Pending",
    requestDate: "Requested on",
    requestDay: "May 14, 2025",
    avatarClassName: "bg-[#f3ebff] text-[#8c5bff]",
  },
] as const;

const todaysConfessions = [
  { time: "09:00 AM", name: "Mekdes Assefa", group: "Young Adults", variant: "violet" as const },
  { time: "11:30 AM", name: "Daniel Gebre", group: "Teens", variant: "success" as const },
  { time: "02:30 PM", name: "Yonas Berhe", group: "Teens", variant: "success" as const },
  { time: "04:00 PM", name: "Rachel Michael", group: "Young Adults", variant: "violet" as const },
] as const;

const confessionNotes = [
  {
    name: "Mekdes Assefa",
    lastConfession: "Last Confession: May 4, 2025",
    followUp: "Recommended follow-up in 2 weeks",
    icon: Cross,
    iconClassName: "bg-[#f4ebff] text-[#8e59ff]",
    followUpClassName: "text-[#8d5df6]",
  },
  {
    name: "Daniel Gebre",
    lastConfession: "Last Confession: May 2, 2025",
    followUp: "Regular follow-up",
    icon: CalendarCheck2,
    iconClassName: "bg-[#e8fff2] text-[#2eaf67]",
    followUpClassName: "text-[#33b36b]",
  },
  {
    name: "Hanna Tesfaye",
    lastConfession: "Last Confession: Apr 20, 2025",
    followUp: "Recommended follow-up in 1 week",
    icon: ShieldCheck,
    iconClassName: "bg-[#ffe9f0] text-[#ef476f]",
    followUpClassName: "text-[#ef476f]",
  },
] as const;

const tabs = ["Requests", "Scheduled", "Completed", "Follow-up"] as const;

export function ConfessionsView() {
  return (
    <>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ icon: Icon, iconClassName, label, note, noteClassName, value }) => (
          <Card key={label}>
            <CardContent className="p-6">
              <div className={cn("flex h-14 w-14 items-center justify-center rounded-2xl", iconClassName)}>
                <Icon className="h-6 w-6" />
              </div>
              <p className="mt-6 text-[2.5rem] font-extrabold leading-none text-[#121c4b]">{value}</p>
              <p className="mt-4 text-lg font-bold text-[#1d2859]">{label}</p>
              <p className={cn("mt-1 text-sm font-semibold", noteClassName)}>{note}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardContent className="p-0">
          <div className="grid grid-cols-2 border-b border-[#eef1fb] text-sm font-extrabold text-[#6b7695] md:grid-cols-4">
            {tabs.map((tab, index) => {
              const active = index === 0;

              return (
                <button
                  key={tab}
                  type="button"
                  className={cn(
                    "border-b-2 px-4 py-5 text-center transition-colors",
                    active
                      ? "border-[#3563ff] text-[#3563ff]"
                      : "border-transparent hover:text-[#1d2859]",
                  )}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          <div className="p-4 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row">
              <div className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-[#e9edf8] bg-white px-4 py-3 text-[#7b86a7]">
                <Search className="h-5 w-5 shrink-0" />
                <span className="truncate text-sm font-semibold">Search by name or phone...</span>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  className="flex items-center justify-between gap-4 rounded-2xl border border-[#e9edf8] bg-white px-4 py-3 text-sm font-semibold text-[#4c5678] sm:min-w-[140px]"
                  type="button"
                >
                  All Status
                  <ChevronDown className="h-4 w-4 text-[#97a0bb]" />
                </button>

                <button
                  className="flex items-center justify-between gap-4 rounded-2xl border border-[#e9edf8] bg-white px-4 py-3 text-sm font-semibold text-[#4c5678] sm:min-w-[140px]"
                  type="button"
                >
                  All Groups
                  <ChevronDown className="h-4 w-4 text-[#97a0bb]" />
                </button>

                <button
                  className="flex items-center justify-center gap-2 rounded-2xl border border-[#e9edf8] bg-white px-4 py-3 text-sm font-semibold text-[#4c5678] sm:min-w-[110px]"
                  type="button"
                >
                  <Filter className="h-4 w-4" />
                  Filter
                </button>
              </div>
            </div>

            <div className="mt-6 space-y-1">
              {confessionRequests.map((request) => (
                <div
                  key={request.name}
                  className="grid gap-4 rounded-3xl border border-transparent px-4 py-4 transition-colors hover:border-[#eef1fb] hover:bg-[#fbfcff] md:grid-cols-[2.8fr_1fr_1.2fr_120px]"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-base font-extrabold",
                        request.avatarClassName,
                      )}
                    >
                      {request.initials}
                    </div>
                    <div>
                      <p className="font-extrabold text-[#1d2859]">{request.name}</p>
                      <p className="mt-0.5 text-sm font-semibold text-[#6b7695]">{request.meta}</p>
                      <p className="mt-1 text-sm text-[#4c5678]">{request.requestedFor}</p>
                    </div>
                  </div>

                  <div className="flex items-center md:justify-center">
                    <Badge variant="warning">{request.status}</Badge>
                  </div>

                  <div className="flex flex-col justify-center">
                    <p className="text-sm font-semibold text-[#6b7695]">{request.requestDate}</p>
                    <p className="mt-1 text-sm font-bold text-[#4c5678]">{request.requestDay}</p>
                  </div>

                  <div className="flex items-center gap-2 text-[#7d86a7] md:justify-end">
                    <button
                      className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[#f5f7ff]"
                      type="button"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[#f5f7ff]"
                      type="button"
                    >
                      <CalendarCheck2 className="h-4 w-4" />
                    </button>
                    <button
                      className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[#f5f7ff]"
                      type="button"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center gap-2 text-sm font-extrabold text-[#3563ff]">
              <button type="button">View All Requests</button>
              <ChevronRight className="h-4 w-4" />
            </div>

            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e9edf8] bg-white text-[#7d86a7]"
                  type="button"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#132e8a] text-sm font-bold text-white" type="button">
                  1
                </button>
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e9edf8] bg-white text-sm font-bold text-[#4c5678]"
                  type="button"
                >
                  2
                </button>
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e9edf8] bg-white text-sm font-bold text-[#4c5678]"
                  type="button"
                >
                  3
                </button>
                <span className="px-1 text-[#7d86a7]">...</span>
                <button
                  className="flex h-10 min-w-10 items-center justify-center rounded-xl border border-[#e9edf8] bg-white px-3 text-sm font-bold text-[#4c5678]"
                  type="button"
                >
                  10
                </button>
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e9edf8] bg-white text-[#4c5678]"
                  type="button"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle>Today&apos;s Confessions</CardTitle>
            <button className="text-sm font-bold text-[#3563ff]" type="button">
              View Calendar
            </button>
          </CardHeader>
          <CardContent className="space-y-2">
            {todaysConfessions.map(({ group, name, time, variant }) => {
              const [clock, period] = time.split(" ");

              return (
                <div
                  key={`${time}-${name}`}
                  className="grid grid-cols-[72px_1fr_auto_auto] items-center gap-3 rounded-3xl px-2 py-4 transition-colors hover:bg-[#fbfcff]"
                >
                  <div className="flex h-14 w-14 flex-col items-center justify-center rounded-2xl bg-[#f7f9ff] text-center text-sm font-extrabold leading-5 text-[#3563ff]">
                    <span>{clock}</span>
                    <span>{period}</span>
                  </div>
                  <div>
                    <p className="font-extrabold text-[#1d2859]">{name}</p>
                    <p className="text-sm text-[#6b7695]">Confession</p>
                  </div>
                  <Badge variant={variant}>{group}</Badge>
                  <ChevronRight className="h-5 w-5 text-[#98a0bc]" />
                </div>
              );
            })}

            <button
              className="flex items-center gap-2 pt-3 text-sm font-extrabold text-[#3563ff]"
              type="button"
            >
              View All Today&apos;s
              <ChevronRight className="h-4 w-4" />
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle>Confession Notes</CardTitle>
            <button className="text-sm font-bold text-[#3563ff]" type="button">
              View All
            </button>
          </CardHeader>
          <CardContent className="space-y-2">
            {confessionNotes.map(({ followUp, followUpClassName, icon: Icon, iconClassName, lastConfession, name }) => (
              <div
                key={name}
                className="grid grid-cols-[56px_1fr_auto] items-center gap-4 rounded-3xl px-2 py-4 transition-colors hover:bg-[#fbfcff]"
              >
                <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl", iconClassName)}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-extrabold text-[#1d2859]">{name}</p>
                  <p className="mt-1 text-sm text-[#6b7695]">{lastConfession}</p>
                  <p className={cn("mt-1 text-sm font-semibold", followUpClassName)}>{followUp}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-[#98a0bc]" />
              </div>
            ))}

            <button
              className="flex items-center gap-2 pt-3 text-sm font-extrabold text-[#3563ff]"
              type="button"
            >
              View All Notes
              <ChevronRight className="h-4 w-4" />
            </button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 overflow-hidden bg-gradient-to-r from-[#f3f7ff] to-[#f8fbff]">
        <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#7b4ff7] shadow-sm">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xl font-extrabold text-[#2550d1]">Confidential &amp; Sacred</p>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-[#4c5678]">
                All confession details are private and visible only to you. Please handle with prayer
                and discretion.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center rounded-[28px] bg-white/60 px-8 py-5 text-[#7b4ff7]">
            <Users className="h-16 w-16" />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
