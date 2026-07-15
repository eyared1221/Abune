import {
  Bell,
  Calendar,
  CalendarCheck2,
  CalendarClock,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Filter,
  Search,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const stats = [
  {
    label: "Due Today",
    value: "3",
    note: "Needs your attention",
    icon: Bell,
    iconClassName: "bg-[#f3e8ff] text-[#8d5df6]",
    noteClassName: "text-[#8d5df6]",
  },
  {
    label: "This Week",
    value: "7",
    note: "Upcoming reminders",
    icon: CalendarCheck2,
    iconClassName: "bg-[#e8fff1] text-[#33b36b]",
    noteClassName: "text-[#6d7796]",
  },
  {
    label: "Upcoming",
    value: "12",
    note: "Next 30 days",
    icon: CalendarClock,
    iconClassName: "bg-[#fff5df] text-[#f59e0b]",
    noteClassName: "text-[#6d7796]",
  },
  {
    label: "Completed",
    value: "24",
    note: "This month",
    icon: CalendarCheck2,
    iconClassName: "bg-[#e9f1ff] text-[#4676ff]",
    noteClassName: "text-[#6d7796]",
  },
] as const;

const tabs = ["All Reminders", "Due Today", "This Week", "Upcoming", "Completed"] as const;

const reminders = [
  {
    title: "Follow-up: Confession",
    subtitle: "Follow up with Mekdes Assefa",
    type: "Confession",
    typeVariant: "violet" as const,
    relatedTo: "Mekdes Assefa",
    dueDate: "May 20, 2025",
    dueHint: "Today",
    dueHintClassName: "text-[#ef476f]",
    time: "10:30 AM",
    status: "Due Today",
    statusVariant: "danger" as const,
    icon: Calendar,
    iconClassName: "bg-[#f3ebff] text-[#8d5df6]",
  },
  {
    title: "Spiritual Check-in",
    subtitle: "Monthly check-in with Daniel",
    type: "Check-in",
    typeVariant: "success" as const,
    relatedTo: "Daniel Gebre",
    dueDate: "May 21, 2025",
    dueHint: "Tomorrow",
    dueHintClassName: "text-[#f59e0b]",
    time: "09:00 AM",
    status: "Upcoming",
    statusVariant: "warning" as const,
    icon: Bell,
    iconClassName: "bg-[#e8fff2] text-[#2eaf67]",
  },
  {
    title: "Family Visit",
    subtitle: "Visit Tesfaye family",
    type: "Visit",
    typeVariant: "info" as const,
    relatedTo: "Tesfaye Family",
    dueDate: "May 25, 2025",
    dueHint: "In 4 days",
    dueHintClassName: "text-[#6b7695]",
    time: "11:00 AM",
    status: "Upcoming",
    statusVariant: "warning" as const,
    icon: CalendarCheck2,
    iconClassName: "bg-[#eaf1ff] text-[#4676ff]",
  },
  {
    title: "Confession Follow-up",
    subtitle: "Follow up with Hanna Tesfaye",
    type: "Confession",
    typeVariant: "violet" as const,
    relatedTo: "Hanna Tesfaye",
    dueDate: "May 27, 2025",
    dueHint: "In 6 days",
    dueHintClassName: "text-[#6b7695]",
    time: "04:00 PM",
    status: "Upcoming",
    statusVariant: "warning" as const,
    icon: Bell,
    iconClassName: "bg-[#ffe9f0] text-[#ef476f]",
  },
  {
    title: "Read & Pray Together",
    subtitle: "Scripture reading with Yonas",
    type: "Spiritual Guidance",
    typeVariant: "warning" as const,
    relatedTo: "Yonas Berhe",
    dueDate: "May 29, 2025",
    dueHint: "In 8 days",
    dueHintClassName: "text-[#6b7695]",
    time: "07:00 PM",
    status: "Upcoming",
    statusVariant: "warning" as const,
    icon: Calendar,
    iconClassName: "bg-[#fff2da] text-[#f59e0b]",
  },
  {
    title: "Confession Follow-up",
    subtitle: "Follow up with Rachel Michael",
    type: "Confession",
    typeVariant: "violet" as const,
    relatedTo: "Rachel Michael",
    dueDate: "Jun 2, 2025",
    dueHint: "In 12 days",
    dueHintClassName: "text-[#6b7695]",
    time: "10:00 AM",
    status: "Upcoming",
    statusVariant: "warning" as const,
    icon: Calendar,
    iconClassName: "bg-[#f3ebff] text-[#8d5df6]",
  },
] as const;

const calendarWeeks = [
  ["27", "28", "29", "30", "1", "2", "3"],
  ["4", "5", "6", "7", "8", "9", "10"],
  ["11", "12", "13", "14", "15", "16", "17"],
  ["18", "19", "20", "21", "22", "23", "24"],
  ["25", "26", "27", "28", "29", "30", "31"],
] as const;

const calendarHighlights: Record<string, string> = {
  "20": "bg-[#ef476f] text-white shadow-lg shadow-[#ef476f]/20",
  "21": "bg-[#ff9a3d] text-white shadow-lg shadow-[#ff9a3d]/20",
  "27": "bg-[#8d5df6] text-white shadow-lg shadow-[#8d5df6]/20",
};

const upcomingReminders = [
  {
    title: "Follow-up: Confession",
    name: "Mekdes Assefa",
    date: "Today",
    time: "10:30 AM",
    icon: Calendar,
    iconClassName: "bg-[#f3ebff] text-[#8d5df6]",
    accentClassName: "text-[#ef476f]",
  },
  {
    title: "Spiritual Check-in",
    name: "Daniel Gebre",
    date: "Tomorrow",
    time: "09:00 AM",
    icon: Bell,
    iconClassName: "bg-[#e8fff2] text-[#2eaf67]",
    accentClassName: "text-[#f59e0b]",
  },
  {
    title: "Family Visit",
    name: "Tesfaye Family",
    date: "May 25, 2025",
    time: "11:00 AM",
    icon: CalendarCheck2,
    iconClassName: "bg-[#eaf1ff] text-[#4676ff]",
    accentClassName: "text-[#4c5678]",
  },
  {
    title: "Confession Follow-up",
    name: "Hanna Tesfaye",
    date: "May 27, 2025",
    time: "04:00 PM",
    icon: Bell,
    iconClassName: "bg-[#ffe9f0] text-[#ef476f]",
    accentClassName: "text-[#4c5678]",
  },
  {
    title: "Read & Pray Together",
    name: "Yonas Berhe",
    date: "May 29, 2025",
    time: "07:00 PM",
    icon: Calendar,
    iconClassName: "bg-[#fff2da] text-[#f59e0b]",
    accentClassName: "text-[#4c5678]",
  },
] as const;

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export function RemindersView() {
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
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-1 flex-col gap-4 md:flex-row">
                <div className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-[#e9edf8] bg-white px-4 py-3 text-[#7b86a7]">
                  <Search className="h-5 w-5 shrink-0" />
                  <span className="truncate text-sm font-semibold">Search reminders...</span>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    className="flex items-center justify-between gap-4 rounded-2xl border border-[#e9edf8] bg-white px-4 py-3 text-sm font-semibold text-[#4c5678] sm:min-w-[140px]"
                    type="button"
                  >
                    All Types
                    <ChevronDown className="h-4 w-4 text-[#97a0bb]" />
                  </button>

                  <button
                    className="flex items-center justify-between gap-4 rounded-2xl border border-[#e9edf8] bg-white px-4 py-3 text-sm font-semibold text-[#4c5678] sm:min-w-[140px]"
                    type="button"
                  >
                    All Status
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

              <Button className="rounded-2xl bg-[#132e8a] px-5 py-6 text-base font-bold shadow-lg shadow-[#132e8a]/20 hover:bg-[#102777]">
                <span className="text-lg">+</span>
                Add Reminder
              </Button>
            </div>

            <div className="mt-6 overflow-hidden rounded-[28px] border border-[#eef1fb]">
              <div className="hidden grid-cols-[2.2fr_1fr_1.1fr_1fr_0.8fr_1fr_90px] items-center gap-4 bg-[#fcfdff] px-6 py-4 text-sm font-extrabold text-[#6b7695] lg:grid">
                <p>Reminder</p>
                <p>Type</p>
                <p>Related To</p>
                <p>Due Date</p>
                <p>Time</p>
                <p>Status</p>
                <p className="text-right">Actions</p>
              </div>

              <div className="divide-y divide-[#eef1fb] bg-white">
                {reminders.map((reminder) => {
                  const Icon = reminder.icon;

                  return (
                    <div
                      key={`${reminder.title}-${reminder.relatedTo}`}
                      className="grid gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[2.2fr_1fr_1.1fr_1fr_0.8fr_1fr_90px] lg:items-center"
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl", reminder.iconClassName)}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-extrabold text-[#1d2859]">{reminder.title}</p>
                          <p className="text-sm text-[#6b7695]">{reminder.subtitle}</p>
                        </div>
                      </div>

                      <div>
                        <Badge variant={reminder.typeVariant}>{reminder.type}</Badge>
                      </div>

                      <div className="text-sm font-semibold text-[#4c5678]">{reminder.relatedTo}</div>

                      <div>
                        <p className="text-sm font-bold text-[#4c5678]">{reminder.dueDate}</p>
                        <p className={cn("mt-1 text-sm font-semibold", reminder.dueHintClassName)}>{reminder.dueHint}</p>
                      </div>

                      <div className="text-sm font-bold text-[#4c5678]">{reminder.time}</div>

                      <div>
                        <Badge variant={reminder.statusVariant}>{reminder.status}</Badge>
                      </div>

                      <div className="flex items-center justify-end gap-2 text-[#7d86a7]">
                        <button
                          className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[#f5f7ff]"
                          type="button"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[#f5f7ff]"
                          type="button"
                        >
                          <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-4 text-sm font-semibold text-[#4c5678] sm:flex-row sm:items-center sm:justify-between">
              <p>Showing 1 to 6 of 24 reminders</p>

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
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e9edf8] bg-white text-sm font-bold text-[#4c5678]"
                  type="button"
                >
                  4
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

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle>Calendar View</CardTitle>
            <div className="flex items-center gap-2">
              <button
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e9edf8] bg-white text-[#7d86a7]"
                type="button"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <p className="min-w-[120px] text-center text-lg font-extrabold text-[#1d2859]">May 2025</p>
              <button
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e9edf8] bg-white text-[#7d86a7]"
                type="button"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                className="rounded-xl border border-[#e9edf8] bg-white px-3 py-2 text-sm font-bold text-[#4c5678]"
                type="button"
              >
                Today
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-3 text-center text-sm font-extrabold text-[#7d86a7]">
              {days.map((day) => (
                <p key={day}>{day}</p>
              ))}
            </div>

            <div className="mt-4 space-y-3">
              {calendarWeeks.map((week, weekIndex) => (
                <div key={weekIndex} className="grid grid-cols-7 gap-3">
                  {week.map((date, dateIndex) => {
                    const isMuted = weekIndex === 0 && dateIndex < 4;
                    const highlightClassName = calendarHighlights[date];

                    return (
                      <div key={`${weekIndex}-${date}`} className="flex flex-col items-center gap-1">
                        <div
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold",
                            highlightClassName
                              ? highlightClassName
                              : isMuted
                                ? "text-[#b6bfd8]"
                                : "text-[#1d2859]",
                          )}
                        >
                          {date}
                        </div>
                        <div className="h-1.5 w-1.5 rounded-full bg-[#8ad0c6]" />
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle>Upcoming Reminders</CardTitle>
            <button className="text-sm font-bold text-[#3563ff]" type="button">
              View All
            </button>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcomingReminders.map(({ accentClassName, date, icon: Icon, iconClassName, name, time, title }) => (
              <div
                key={`${title}-${name}`}
                className="grid grid-cols-[56px_1fr_auto] items-center gap-4 rounded-3xl px-2 py-4 transition-colors hover:bg-[#fbfcff]"
              >
                <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl", iconClassName)}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-extrabold text-[#1d2859]">{title}</p>
                  <p className="mt-1 text-sm text-[#6b7695]">{name}</p>
                </div>
                <div className="text-right">
                  <p className={cn("text-sm font-bold", accentClassName)}>{date}</p>
                  <p className="mt-1 text-sm text-[#6b7695]">{time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 overflow-hidden bg-gradient-to-r from-[#f3f7ff] to-[#f8fbff]">
        <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#3563ff] shadow-sm">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xl font-extrabold text-[#2550d1]">Stay Organized</p>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-[#4c5678]">
                Set reminders for follow-ups, visits, prayers, and important spiritual responsibilities.
                You can add new reminders and manage your schedule effectively.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center rounded-[28px] bg-white/60 px-8 py-5 text-[#3563ff]">
            <Bell className="h-16 w-16" />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
