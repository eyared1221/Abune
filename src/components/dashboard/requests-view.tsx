import {
  BookHeart,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDashed,
  Eye,
  FileBadge,
  Filter,
  MessageCircleMore,
  Plus,
  Search,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const stats = [
  {
    label: "New Requests",
    value: "14",
    note: "Need your review",
    icon: FileBadge,
    iconClassName: "bg-[#f3e8ff] text-[#8d5df6]",
    noteClassName: "text-[#8d5df6]",
  },
  {
    label: "In Progress",
    value: "8",
    note: "Awaiting your response",
    icon: CircleDashed,
    iconClassName: "bg-[#fff5df] text-[#f59e0b]",
    noteClassName: "text-[#f59e0b]",
  },
  {
    label: "Completed",
    value: "23",
    note: "This month",
    icon: CheckCircle2,
    iconClassName: "bg-[#e8fff2] text-[#2eaf67]",
    noteClassName: "text-[#33b36b]",
  },
  {
    label: "Total Requests",
    value: "56",
    note: "All time",
    icon: BookHeart,
    iconClassName: "bg-[#e9f1ff] text-[#4676ff]",
    noteClassName: "text-[#4676ff]",
  },
] as const;

const tabs = ["All Requests", "New", "In Progress", "Completed", "Archived"] as const;

const requests = [
  {
    initials: "MA",
    name: "Mekdes Assefa",
    description: "Request for spiritual counseling on a personal matter.",
    avatarClassName: "bg-[#f4ebff] text-[#8e59ff]",
    type: "Counseling",
    typeVariant: "violet" as const,
    requestedOn: "May 16, 2025",
    requestedAt: "10:15 AM",
    status: "New",
    statusVariant: "violet" as const,
  },
  {
    initials: "DG",
    name: "Daniel Gebre",
    description: "Request for guidance about choosing a career path.",
    avatarClassName: "bg-[#e8fff2] text-[#2eaf67]",
    type: "Guidance",
    typeVariant: "success" as const,
    requestedOn: "May 15, 2025",
    requestedAt: "09:45 AM",
    status: "In Progress",
    statusVariant: "warning" as const,
  },
  {
    initials: "HT",
    name: "Hanna Tesfaye",
    description: "Request for prayers for healing for a family member.",
    avatarClassName: "bg-[#ffe9f0] text-[#ef476f]",
    type: "Prayer",
    typeVariant: "danger" as const,
    requestedOn: "May 14, 2025",
    requestedAt: "04:30 PM",
    status: "In Progress",
    statusVariant: "warning" as const,
  },
  {
    initials: "YB",
    name: "Yonas Berhe",
    description: "Request to prepare for first confession.",
    avatarClassName: "bg-[#eaf1ff] text-[#4676ff]",
    type: "Confession",
    typeVariant: "violet" as const,
    requestedOn: "May 13, 2025",
    requestedAt: "02:20 PM",
    status: "Completed",
    statusVariant: "success" as const,
  },
  {
    initials: "RM",
    name: "Rachel Michael",
    description: "Request for advice on spiritual discipline and routines.",
    avatarClassName: "bg-[#f3ebff] text-[#8c5bff]",
    type: "Counseling",
    typeVariant: "violet" as const,
    requestedOn: "May 12, 2025",
    requestedAt: "11:00 AM",
    status: "Completed",
    statusVariant: "success" as const,
  },
  {
    initials: "SB",
    name: "Samuel Bekele",
    description: "Request for prayers before important exam.",
    avatarClassName: "bg-[#fff2da] text-[#f59e0b]",
    type: "Prayer",
    typeVariant: "danger" as const,
    requestedOn: "May 11, 2025",
    requestedAt: "08:30 AM",
    status: "Completed",
    statusVariant: "success" as const,
  },
  {
    initials: "AT",
    name: "Aster Tadesse",
    description: "Request for support during a difficult time.",
    avatarClassName: "bg-[#e9fff7] text-[#31a97f]",
    type: "Counseling",
    typeVariant: "violet" as const,
    requestedOn: "May 10, 2025",
    requestedAt: "06:10 PM",
    status: "New",
    statusVariant: "violet" as const,
  },
  {
    initials: "TG",
    name: "Tigist Gebremedhin",
    description: "Request for spiritual reading recommendation.",
    avatarClassName: "bg-[#ffe9f5] text-[#ef476f]",
    type: "Guidance",
    typeVariant: "success" as const,
    requestedOn: "May 9, 2025",
    requestedAt: "04:25 PM",
    status: "New",
    statusVariant: "violet" as const,
  },
] as const;

const summaryItems = [
  { label: "Counseling", value: 5, percent: "36%", color: "bg-[#b47bff]" },
  { label: "Guidance", value: 4, percent: "29%", color: "bg-[#67d89c]" },
  { label: "Prayer", value: 3, percent: "21%", color: "bg-[#ff9bb6]" },
  { label: "Confession", value: 2, percent: "14%", color: "bg-[#d7b9ff]" },
] as const;

const popularTypes = [
  { label: "Counseling", count: 5, icon: FileBadge, iconClassName: "bg-[#f3ebff] text-[#8d5df6]" },
  { label: "Guidance", count: 4, icon: BookHeart, iconClassName: "bg-[#e8fff2] text-[#2eaf67]" },
  { label: "Prayer", count: 3, icon: MessageCircleMore, iconClassName: "bg-[#ffe9f0] text-[#ef476f]" },
  { label: "Confession", count: 2, icon: BookHeart, iconClassName: "bg-[#f3ebff] text-[#8d5df6]" },
] as const;

const quickActions = [
  "Create Guidance Note",
  "Send Message",
  "Schedule Appointment",
  "Add Reminder",
] as const;

export function RequestsView() {
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

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_320px]">
        <Card>
          <CardContent className="p-0">
            <div className="grid grid-cols-2 border-b border-[#eef1fb] text-sm font-extrabold text-[#6b7695] md:grid-cols-5">
              {tabs.map((tab, index) => (
                <button
                  key={tab}
                  type="button"
                  className={cn(
                    "border-b-2 px-4 py-5 text-center transition-colors",
                    index === 0 ? "border-[#3563ff] text-[#3563ff]" : "border-transparent hover:text-[#1d2859]",
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-4 sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row">
                <div className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-[#e9edf8] bg-white px-4 py-3 text-[#7b86a7]">
                  <Search className="h-5 w-5 shrink-0" />
                  <span className="truncate text-sm font-semibold">Search by name or request type...</span>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    className="flex items-center justify-between gap-4 rounded-2xl border border-[#e9edf8] bg-white px-4 py-3 text-sm font-semibold text-[#4c5678] sm:min-w-[120px]"
                    type="button"
                  >
                    All Types
                    <ChevronDown className="h-4 w-4 text-[#97a0bb]" />
                  </button>

                  <button
                    className="flex items-center justify-between gap-4 rounded-2xl border border-[#e9edf8] bg-white px-4 py-3 text-sm font-semibold text-[#4c5678] sm:min-w-[120px]"
                    type="button"
                  >
                    All Status
                    <ChevronDown className="h-4 w-4 text-[#97a0bb]" />
                  </button>

                  <button
                    className="flex items-center justify-center gap-2 rounded-2xl border border-[#e9edf8] bg-white px-4 py-3 text-sm font-semibold text-[#4c5678] sm:min-w-[100px]"
                    type="button"
                  >
                    <Filter className="h-4 w-4" />
                    Filter
                  </button>
                </div>
              </div>

              <div className="mt-6 overflow-hidden rounded-[28px] border border-[#eef1fb]">
                <div className="hidden grid-cols-[2.3fr_0.8fr_0.9fr_0.8fr_70px] items-center gap-4 bg-[#fcfdff] px-6 py-4 text-sm font-extrabold text-[#6b7695] lg:grid">
                  <p>Request</p>
                  <p>Type</p>
                  <p>Requested On</p>
                  <p>Status</p>
                  <p className="text-right">Actions</p>
                </div>

                <div className="divide-y divide-[#eef1fb] bg-white">
                  {requests.map((request) => (
                    <div
                      key={`${request.name}-${request.requestedOn}`}
                      className="grid gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[2.3fr_0.8fr_0.9fr_0.8fr_70px] lg:items-center"
                    >
                      <div className="flex items-start gap-4">
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
                          <p className="mt-1 max-w-md text-sm leading-6 text-[#4c5678]">{request.description}</p>
                        </div>
                      </div>

                      <div>
                        <Badge variant={request.typeVariant}>{request.type}</Badge>
                      </div>

                      <div>
                        <p className="text-sm font-bold text-[#4c5678]">{request.requestedOn}</p>
                        <p className="mt-1 text-sm text-[#6b7695]">{request.requestedAt}</p>
                      </div>

                      <div>
                        <Badge variant={request.statusVariant}>{request.status}</Badge>
                      </div>

                      <div className="flex items-center justify-end gap-2 text-[#7d86a7]">
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
                          <ChevronDown className="h-4 w-4 -rotate-90" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-4 text-sm font-semibold text-[#4c5678] sm:flex-row sm:items-center sm:justify-between">
                <p>Showing 1 to 8 of 14 requests</p>

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

        <div className="space-y-6">
          <Button className="w-full rounded-2xl bg-[#132e8a] px-5 py-6 text-base font-bold shadow-lg shadow-[#132e8a]/20 hover:bg-[#102777]">
            <Plus className="h-5 w-5" />
            New Request Note
          </Button>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Request Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full bg-[conic-gradient(#b47bff_0_36%,#67d89c_36%_65%,#ff9bb6_65%_86%,#d7b9ff_86%_100%)] p-5">
                <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-white">
                  <p className="text-4xl font-extrabold text-[#1d2859]">14</p>
                  <p className="text-sm font-semibold text-[#6b7695]">Total</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {summaryItems.map((item) => (
                  <div key={item.label} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3 text-[#4c5678]">
                      <span className={cn("h-3 w-3 rounded-full", item.color)} />
                      <span className="font-semibold">{item.label}</span>
                    </div>
                    <span className="font-bold text-[#1d2859]">
                      {item.value} ({item.percent})
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Popular Request Types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {popularTypes.map(({ count, icon: Icon, iconClassName, label }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("flex h-10 w-10 items-center justify-center rounded-2xl", iconClassName)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="font-semibold text-[#4c5678]">{label}</span>
                  </div>
                  <span className="font-bold text-[#1d2859]">{count}</span>
                </div>
              ))}

              <button className="flex items-center gap-2 pt-2 text-sm font-extrabold text-[#3563ff]" type="button">
                View Full Report
                <ChevronRight className="h-4 w-4" />
              </button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickActions.map((action) => (
                <button
                  key={action}
                  className="flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left text-sm font-semibold text-[#4c5678] transition-colors hover:bg-[#f8faff]"
                  type="button"
                >
                  <span>{action}</span>
                  <ChevronRight className="h-4 w-4 text-[#98a0bc]" />
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-6 overflow-hidden bg-gradient-to-r from-[#f3f7ff] to-[#f8fbff]">
        <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#3563ff] shadow-sm">
              <MessageCircleMore className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xl font-extrabold text-[#2550d1]">Respond with Prayer and Wisdom</p>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-[#4c5678]">
                Each request is an opportunity to guide a soul closer to God. Take time to listen,
                pray, and respond with love.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center rounded-[28px] bg-white/60 px-8 py-5 text-[#3563ff]">
            <BookHeart className="h-16 w-16" />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
