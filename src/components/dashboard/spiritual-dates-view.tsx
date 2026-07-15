import {
  Bell,
  Calendar,
  CalendarCheck2,
  CalendarHeart,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Cross,
  Edit3,
  Filter,
  MoreHorizontal,
  Search,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const stats = [
  {
    label: "Upcoming Dates",
    value: "18",
    note: "Next 90 days",
    icon: Calendar,
    iconClassName: "bg-[#f3e8ff] text-[#8d5df6]",
    noteClassName: "text-[#8d5df6]",
  },
  {
    label: "Feasts & Celebrations",
    value: "7",
    note: "Next 90 days",
    icon: CalendarHeart,
    iconClassName: "bg-[#e8fff2] text-[#2eaf67]",
    noteClassName: "text-[#33b36b]",
  },
  {
    label: "Fasting Periods",
    value: "3",
    note: "Next 90 days",
    icon: Cross,
    iconClassName: "bg-[#fff5df] text-[#f59e0b]",
    noteClassName: "text-[#f59e0b]",
  },
  {
    label: "Special Reminders",
    value: "2",
    note: "This month",
    icon: Bell,
    iconClassName: "bg-[#e9f1ff] text-[#4676ff]",
    noteClassName: "text-[#6d7796]",
  },
] as const;

const tabs = ["Upcoming", "Feasts", "Fasting Periods", "Past Dates"] as const;

const spiritualDates = [
  {
    month: "May",
    day: "20",
    weekday: "Tue",
    event: "St. Mary of Zion",
    subtitle: "(Kidist Maryam Sion)",
    type: "Feast",
    typeVariant: "violet" as const,
    description: "Commemoration of St. Mary of Zion.",
    reminder: "1 day before",
    reminderTime: "9:00 AM",
    status: "Upcoming",
    statusVariant: "success" as const,
  },
  {
    month: "May",
    day: "28",
    weekday: "Wed",
    event: "Ascension of Our Lord",
    subtitle: "(Ergeta Geta)",
    type: "Feast",
    typeVariant: "violet" as const,
    description: "The Ascension of Jesus Christ to Heaven.",
    reminder: "1 day before",
    reminderTime: "9:00 AM",
    status: "Upcoming",
    statusVariant: "success" as const,
  },
  {
    month: "Jun",
    day: "8",
    weekday: "Sun",
    event: "Pentecost (Green Sunday)",
    subtitle: "(Paraklitos)",
    type: "Feast",
    typeVariant: "violet" as const,
    description: "The descent of the Holy Spirit on the Apostles.",
    reminder: "1 day before",
    reminderTime: "9:00 AM",
    status: "Upcoming",
    statusVariant: "success" as const,
  },
  {
    month: "Jun",
    day: "16",
    weekday: "Mon",
    event: "Apostles' Fast Begins",
    subtitle: "(Tsome Hawaryat)",
    type: "Fasting",
    typeVariant: "warning" as const,
    description: "Beginning of the Holy Apostles' Fast.",
    reminder: "On the day",
    reminderTime: "8:00 AM",
    status: "Upcoming",
    statusVariant: "success" as const,
  },
  {
    month: "Jul",
    day: "12",
    weekday: "Sat",
    event: "St. Mary's Fast Begins",
    subtitle: "(Tsome Filseta)",
    type: "Fasting",
    typeVariant: "warning" as const,
    description: "Beginning of the Holy Virgin Mary's Fast.",
    reminder: "On the day",
    reminderTime: "8:00 AM",
    status: "Upcoming",
    statusVariant: "success" as const,
  },
  {
    month: "Aug",
    day: "19",
    weekday: "Tue",
    event: "Transfiguration of Our Lord",
    subtitle: "(Debre Tabor)",
    type: "Feast",
    typeVariant: "violet" as const,
    description: "The Transfiguration of Jesus Christ.",
    reminder: "1 day before",
    reminderTime: "9:00 AM",
    status: "Upcoming",
    statusVariant: "success" as const,
  },
  {
    month: "Sep",
    day: "11",
    weekday: "Thu",
    event: "Exaltation of the Holy Cross",
    subtitle: "(Meskel)",
    type: "Feast",
    typeVariant: "violet" as const,
    description: "Exaltation of the Life-Giving Holy Cross.",
    reminder: "1 day before",
    reminderTime: "9:00 AM",
    status: "Upcoming",
    statusVariant: "success" as const,
  },
] as const;

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

const calendarWeeks = [
  ["27", "28", "29", "30", "1", "2", "3"],
  ["4", "5", "6", "7", "8", "9", "10"],
  ["11", "12", "13", "14", "15", "16", "17"],
  ["18", "19", "20", "21", "22", "23", "24"],
  ["25", "26", "27", "28", "29", "30", "31"],
] as const;

const calendarHighlights: Record<string, string> = {
  "8": "bg-[#f3e8ff] text-[#8d5df6]",
  "20": "bg-[#7c3aed] text-white shadow-lg shadow-[#7c3aed]/20",
  "28": "bg-[#ff9a3d] text-white shadow-lg shadow-[#ff9a3d]/20",
};

const nextSevenDays = [
  {
    month: "May",
    day: "20",
    weekday: "Tue",
    title: "St. Mary of Zion",
    type: "Feast",
    typeVariant: "violet" as const,
    reminder: "1 day before at 9:00 AM",
  },
  {
    month: "May",
    day: "21",
    weekday: "Wed",
    title: "Follow-up: Confession",
    type: "Reminder",
    typeVariant: "info" as const,
    reminder: "Tomorrow at 10:30 AM",
  },
  {
    month: "May",
    day: "28",
    weekday: "Wed",
    title: "Ascension of Our Lord",
    type: "Feast",
    typeVariant: "violet" as const,
    reminder: "1 day before at 9:00 AM",
  },
  {
    month: "Jun",
    day: "8",
    weekday: "Sun",
    title: "Pentecost (Green Sunday)",
    type: "Feast",
    typeVariant: "violet" as const,
    reminder: "1 day before at 9:00 AM",
  },
] as const;

export function SpiritualDatesView() {
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
                  <span className="truncate text-sm font-semibold">Search spiritual dates...</span>
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
                    className="flex items-center justify-center gap-2 rounded-2xl border border-[#e9edf8] bg-white px-4 py-3 text-sm font-semibold text-[#4c5678] sm:min-w-[170px]"
                    type="button"
                  >
                    <Calendar className="h-4 w-4" />
                    Select Date Range
                  </button>
                </div>
              </div>

              <Button className="rounded-2xl bg-[#132e8a] px-5 py-6 text-base font-bold shadow-lg shadow-[#132e8a]/20 hover:bg-[#102777]">
                <span className="text-lg">+</span>
                Add Spiritual Date
              </Button>
            </div>

            <div className="mt-6 overflow-hidden rounded-[28px] border border-[#eef1fb]">
              <div className="hidden grid-cols-[88px_2fr_0.9fr_1.5fr_1fr_0.9fr_80px] items-center gap-4 bg-[#fcfdff] px-6 py-4 text-sm font-extrabold text-[#6b7695] lg:grid">
                <p>Date</p>
                <p>Event</p>
                <p>Type</p>
                <p>Description</p>
                <p>Reminder</p>
                <p>Status</p>
                <p className="text-right">Actions</p>
              </div>

              <div className="divide-y divide-[#eef1fb] bg-white">
                {spiritualDates.map((item) => (
                  <div
                    key={`${item.event}-${item.day}`}
                    className="grid gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[88px_2fr_0.9fr_1.5fr_1fr_0.9fr_80px] lg:items-center"
                  >
                    <div className="flex h-16 w-16 flex-col items-center justify-center rounded-2xl bg-[#f7f9ff] text-center">
                      <span className="text-xs font-bold uppercase tracking-wide text-[#7b86a7]">{item.month}</span>
                      <span className="text-xl font-extrabold leading-none text-[#1d2859]">{item.day}</span>
                      <span className="text-xs font-semibold text-[#7b86a7]">{item.weekday}</span>
                    </div>

                    <div>
                      <p className="font-extrabold text-[#1d2859]">{item.event}</p>
                      <p className="mt-1 text-sm text-[#6b7695]">{item.subtitle}</p>
                    </div>

                    <div>
                      <Badge variant={item.typeVariant}>{item.type}</Badge>
                    </div>

                    <div className="text-sm text-[#4c5678]">{item.description}</div>

                    <div className="flex items-start gap-2 text-sm text-[#4c5678]">
                      <Bell className="mt-0.5 h-4 w-4 text-[#7b86a7]" />
                      <div>
                        <p>{item.reminder}</p>
                        <p className="mt-1 font-semibold text-[#6b7695]">{item.reminderTime}</p>
                      </div>
                    </div>

                    <div>
                      <Badge variant={item.statusVariant}>{item.status}</Badge>
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
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-4 text-sm font-semibold text-[#4c5678] sm:flex-row sm:items-center sm:justify-between">
              <p>Showing 1 to 7 of 8 results</p>

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
                  3
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
                        <div
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            date === "20"
                              ? "bg-[#7c3aed]"
                              : date === "28"
                                ? "bg-[#ff9a3d]"
                                : date === "8"
                                  ? "bg-[#3b82f6]"
                                  : "bg-[#d6deef]",
                          )}
                        />
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-6 text-sm font-semibold text-[#4c5678]">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#7c3aed]" />
                Feast
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff9a3d]" />
                Fasting
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#3b82f6]" />
                Special
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle>Upcoming Next 7 Days</CardTitle>
            <button className="text-sm font-bold text-[#3563ff]" type="button">
              View All
            </button>
          </CardHeader>
          <CardContent className="space-y-2">
            {nextSevenDays.map((item) => (
              <div
                key={`${item.title}-${item.day}`}
                className="grid grid-cols-[64px_1fr_auto] items-center gap-4 rounded-3xl px-2 py-4 transition-colors hover:bg-[#fbfcff]"
              >
                <div className="text-center">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#7b86a7]">{item.month}</p>
                  <p className="text-2xl font-extrabold leading-none text-[#1d2859]">{item.day}</p>
                  <p className="text-xs font-semibold text-[#7b86a7]">{item.weekday}</p>
                </div>
                <div>
                  <p className="font-extrabold text-[#1d2859]">{item.title}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant={item.typeVariant}>{item.type}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-right text-sm text-[#4c5678]">{item.reminder}</p>
                  <Bell className="h-4 w-4 text-[#7b86a7]" />
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
              <p className="text-xl font-extrabold text-[#2550d1]">Stay Spiritually Prepared</p>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-[#4c5678]">
                Keep track of important spiritual dates and prepare your heart in advance through
                prayer, fasting and confession.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center rounded-[28px] bg-white/60 px-8 py-5 text-[#3563ff]">
            <CalendarHeart className="h-16 w-16" />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
