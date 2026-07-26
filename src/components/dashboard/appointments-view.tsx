import {
  CalendarCheck2,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Filter,
  MoreHorizontal,
  Search,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const stats = [
  {
    label: "Total Appointments",
    value: "24",
    icon: CalendarClock,
    iconClassName: "bg-[#ddb84f] text-[#18335f]",
  },
  {
    label: "Upcoming",
    value: "6",
    icon: CalendarCheck2,
    iconClassName: "bg-[#ddb84f] text-[#18335f]",
  },
  {
    label: "Completed",
    value: "3",
    icon: Clock3,
    iconClassName: "bg-[#ddb84f] text-[#18335f]",
  },
  {
    label: "Canceled",
    value: "18",
    icon: CheckCircle2,
    iconClassName: "bg-[#ddb84f] text-[#18335f]",
  },
] as const;

const tabs = ["All Appointments", "Upcoming", "Completed", "Canceled"] as const;

const appointments = [
  {
    month: "May",
    day: "20",
    weekday: "Tue",
    time: "10:30 AM",
    initials: "MA",
    name: "Mekdes Assefa",
    phone: "0912 345 678",
    avatarClassName: "bg-[#f8efdc] text-[#a37d2d]",
    type: "Personal Meeting",
    typeVariant: "warning" as const,
    status: "Today",
    statusVariant: "warning" as const,
    highlighted: true,
  },
  {
    month: "May",
    day: "20",
    weekday: "Tue",
    time: "02:00 PM",
    initials: "DG",
    name: "Daniel Gebre",
    phone: "0921 234 567",
    avatarClassName: "bg-[#ddb84f] text-[#18335f]",
    type: "Spiritual Counseling",
    typeVariant: "success" as const,
    status: "Today",
    statusVariant: "warning" as const,
    highlighted: false,
  },
  {
    month: "May",
    day: "20",
    weekday: "Tue",
    time: "04:30 PM",
    initials: "HT",
    name: "Hanna Tesfaye",
    phone: "0933 456 789",
    avatarClassName: "bg-[#ffe9f0] text-[#ef476f]",
    type: "Follow-up",
    typeVariant: "info" as const,
    status: "Today",
    statusVariant: "warning" as const,
    highlighted: false,
  },
  {
    month: "May",
    day: "21",
    weekday: "Wed",
    time: "09:00 AM",
    initials: "YB",
    name: "Yonas Berhe",
    phone: "0918 765 432",
    avatarClassName: "bg-[#eaf1ff] text-[#4676ff]",
    type: "Personal Meeting",
    typeVariant: "warning" as const,
    status: "Upcoming",
    statusVariant: "warning" as const,
    highlighted: false,
  },
  {
    month: "May",
    day: "21",
    weekday: "Wed",
    time: "11:30 AM",
    initials: "RM",
    name: "Rachel Michael",
    phone: "0924 567 890",
    avatarClassName: "bg-[#f8efdc] text-[#a37d2d]",
    type: "Spiritual Counseling",
    typeVariant: "success" as const,
    status: "Upcoming",
    statusVariant: "warning" as const,
    highlighted: false,
  },
  {
    month: "May",
    day: "22",
    weekday: "Thu",
    time: "10:00 AM",
    initials: "SB",
    name: "Samuel Bekele",
    phone: "0911 223 344",
    avatarClassName: "bg-[#fff2da] text-[#f59e0b]",
    type: "Follow-up",
    typeVariant: "info" as const,
    status: "Upcoming",
    statusVariant: "warning" as const,
    highlighted: false,
  },
  {
    month: "May",
    day: "23",
    weekday: "Fri",
    time: "03:00 PM",
    initials: "AT",
    name: "Aster Tadesse",
    phone: "0932 334 455",
    avatarClassName: "bg-[#e9fff7] text-[#31a97f]",
    type: "Personal Meeting",
    typeVariant: "warning" as const,
    status: "Upcoming",
    statusVariant: "warning" as const,
    highlighted: false,
  },
  {
    month: "May",
    day: "24",
    weekday: "Sat",
    time: "09:30 AM",
    initials: "TG",
    name: "Tigist Gebremedhin",
    phone: "0915 667 788",
    avatarClassName: "bg-[#ffe9f5] text-[#ef476f]",
    type: "Spiritual Counseling",
    typeVariant: "success" as const,
    status: "Upcoming",
    statusVariant: "warning" as const,
    highlighted: false,
  },
  {
    month: "May",
    day: "18",
    weekday: "Sun",
    time: "08:30 AM",
    initials: "MS",
    name: "Mihret Solomon",
    phone: "0917 889 900",
    avatarClassName: "bg-[#e7fff8] text-[#22a67a]",
    type: "Personal Meeting",
    typeVariant: "warning" as const,
    status: "Completed",
    statusVariant: "success" as const,
    highlighted: false,
  },
  {
    month: "May",
    day: "17",
    weekday: "Sat",
    time: "02:00 PM",
    initials: "BT",
    name: "Biniam Tesfaye",
    phone: "0912 111 222",
    avatarClassName: "bg-[#edf2ff] text-[#4f7bff]",
    type: "Follow-up",
    typeVariant: "info" as const,
    status: "Completed",
    statusVariant: "success" as const,
    highlighted: false,
  },
] as const;

const chartLabels = ["Apr 20-26", "Apr 27-May 3", "May 4-10", "May 11-17", "May 18-24"] as const;

export function AppointmentsView() {
  return (
    <>
      <section className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(
          ({
            icon: Icon,
            label,
            value,
          }) => (
            <div
              key={label}
              className="group relative min-h-[190px] overflow-hidden rounded-[24px] border border-[#ebe5d9] bg-[#fdfcf9] px-7 py-6 shadow-[0_10px_30px_rgba(26,38,67,0.07)] transition-all duration-300 hover:-translate-y-1 hover:border-[#d9c79e] hover:shadow-[0_18px_40px_rgba(26,38,67,0.12)]"
            >
              <div className="pointer-events-none absolute -right-12 -top-14 h-32 w-32 rounded-full bg-[#d7b04d]/[0.07] transition-transform duration-500 group-hover:scale-125" />

              <div className="relative z-10">
                <div className="flex h-[58px] w-[58px] items-center justify-center rounded-[18px] bg-[#ddb84f] text-[#18335f] shadow-[0_7px_16px_rgba(205,163,58,0.24)] ring-1 ring-black/[0.025] transition-transform duration-300 group-hover:scale-105">
                  <Icon className="h-7 w-7" strokeWidth={1.9} />
                </div>

                <div className="mt-6">
                  <p className="text-[38px] font-extrabold leading-none tracking-tight text-[#17223f]">
                    {value}
                  </p>

                  <p className="mt-3 text-[18px] font-bold text-[#263453]">
                    {label}
                  </p>
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#b99645] to-[#e0bf68] transition-transform duration-300 group-hover:scale-x-100" />
            </div>
          ),
        )}
      </section>

      <div className="mt-6">
        <Card className="rounded-[26px] border border-[#ebe5d9] bg-[#fdfcf9] shadow-[0_12px_32px_rgba(26,38,67,0.07)]">
          <CardContent className="p-0">
            <div className="grid grid-cols-2 border-b border-[#ebe5d9] text-sm font-bold text-[#6b7695] md:grid-cols-4">
              {tabs.map((tab, index) => (
                <button
                  key={tab}
                  type="button"
                  className={cn(
                    "border-b-2 px-4 py-5 text-center transition-colors",
                    index === 0 ? "border-[#b99645] text-[#a47e2d]" : "border-transparent hover:text-[#1d2859]",
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-4 sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row">
                <div className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-[#e7dfcf] bg-[#fffdf9] px-4 py-3 text-[#7b86a7]">
                  <Search className="h-5 w-5 shrink-0" />
                  <span className="truncate text-sm font-semibold">Search by name or phone...</span>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    className="flex items-center justify-between gap-4 rounded-2xl border border-[#e7dfcf] bg-[#fffdf9] px-4 py-3 text-sm font-semibold text-[#4c5678] sm:min-w-[120px]"
                    type="button"
                  >
                    All Status
                    <ChevronDown className="h-4 w-4 text-[#97a0bb]" />
                  </button>

                  <button
                    className="flex items-center justify-between gap-4 rounded-2xl border border-[#e7dfcf] bg-[#fffdf9] px-4 py-3 text-sm font-semibold text-[#4c5678] sm:min-w-[120px]"
                    type="button"
                  >
                    All Types
                    <ChevronDown className="h-4 w-4 text-[#97a0bb]" />
                  </button>

                  <button
                    className="flex items-center justify-center gap-2 rounded-2xl border border-[#e7dfcf] bg-[#fffdf9] px-4 py-3 text-sm font-semibold text-[#4c5678] sm:min-w-[90px]"
                    type="button"
                  >
                    <Filter className="h-4 w-4" />
                    Filter
                  </button>
                </div>
              </div>

              <div className="mt-6 hidden overflow-x-auto md:block">
                <div className="min-w-[980px]">
                <div className="grid grid-cols-[1.2fr_1.7fr_1.2fr_1fr_100px] items-center gap-4 border-b border-[#eee9df] bg-[#faf8f3] px-7 py-4 text-[13px] font-extrabold uppercase tracking-[0.06em] text-[#7b8499]">
                  <p>Date &amp; Time</p>
                  <p>Spiritual Child</p>
                  <p>Type</p>
                  <p>Status</p>
                  <p className="text-right">Actions</p>
                </div>

                <div className="divide-y divide-[#f0ece4]">
                  {appointments.map((appointment) => (
                    <div
                      key={`${appointment.name}-${appointment.time}`}
                      className={cn(
                        "group grid grid-cols-[1.2fr_1.7fr_1.2fr_1fr_100px] items-center gap-4 px-7 py-4 transition-all duration-200 hover:bg-[#fcfaf6]",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-14 w-14 flex-col items-center justify-center rounded-[16px] bg-[#f7f2e8] text-center">
                          <span className="text-xs font-bold uppercase tracking-wide text-[#7b86a7]">{appointment.month}</span>
                          <span className="text-xl font-extrabold leading-none text-[#1d2859]">{appointment.day}</span>
                          <span className="text-xs font-semibold text-[#7b86a7]">{appointment.weekday}</span>
                        </div>
                        <p className="text-sm font-extrabold text-[#1d2859]">{appointment.time}</p>
                      </div>

                      <div className="min-w-0">
                        <div className="min-w-0">
                          <p className="truncate text-[15px] font-extrabold text-[#1d2859]">{appointment.name}</p>
                        </div>
                      </div>

                      <div>
                        <Badge variant={appointment.typeVariant} className="rounded-full px-3 py-1">
                          {appointment.type}
                        </Badge>
                      </div>

                      <div>
                        <Badge variant={appointment.statusVariant} className="rounded-full px-3 py-1">
                          {appointment.status}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-end">
                        <button
                          className="flex h-9 w-9 items-center justify-center rounded-[12px] border border-transparent text-[#7d86a7] transition-all hover:border-[#e7dfcf] hover:bg-white hover:text-[#a47e2d] hover:shadow-sm"
                          type="button"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-4 text-sm font-semibold text-[#4c5678] sm:flex-row sm:items-center sm:justify-between">
                <p>Showing 1 to 10 of 24 appointments</p>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e7dfcf] bg-[#fffdf9] text-[#7d86a7]"
                    type="button"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#b99645] text-sm font-bold text-white" type="button">
                    1
                  </button>
                  <button
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e7dfcf] bg-[#fffdf9] text-sm font-bold text-[#4c5678]"
                    type="button"
                  >
                    2
                  </button>
                  <button
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e7dfcf] bg-[#fffdf9] text-sm font-bold text-[#4c5678]"
                    type="button"
                  >
                    3
                  </button>
                  <button
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e7dfcf] bg-white text-[#4c5678]"
                    type="button"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      <Card className="mt-6 rounded-[26px] border border-[#ebe5d9] bg-[#fdfcf9] shadow-[0_12px_32px_rgba(26,38,67,0.07)]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Appointments Overview</CardTitle>
          <button className="text-sm font-bold text-[#a47e2d] hover:text-[#8d6b22]" type="button">
            View Calendar
          </button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-5 text-sm font-semibold text-[#4c5678]">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#b99645]" />
              Scheduled
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#2eaf67]" />
              Completed
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ef476f]" />
              Canceled
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <div className="min-w-[760px]">
              <svg viewBox="0 0 760 220" className="h-[220px] w-full">
                <line x1="50" y1="20" x2="50" y2="190" stroke="#e7dfcf" />
                <line x1="50" y1="190" x2="730" y2="190" stroke="#e7dfcf" />

                {[40, 80, 120, 160].map((y) => (
                  <line key={y} x1="50" y1={y} x2="730" y2={y} stroke="#f4efe5" />
                ))}

                <polyline
                  fill="none"
                  stroke="#b99645"
                  strokeWidth="3"
                  points="90,135 240,90 390,65 540,52 690,60"
                />
                <polyline
                  fill="none"
                  stroke="#2eaf67"
                  strokeWidth="3"
                  points="90,160 240,145 390,132 540,108 690,92"
                />
                <polyline
                  fill="none"
                  stroke="#ef476f"
                  strokeWidth="3"
                  points="90,152 240,150 390,165 540,160 690,164"
                />

                {[
                  { x: 90, y: 135, color: "#b99645" },
                  { x: 240, y: 90, color: "#b99645" },
                  { x: 390, y: 65, color: "#b99645" },
                  { x: 540, y: 52, color: "#b99645" },
                  { x: 690, y: 60, color: "#b99645" },
                  { x: 90, y: 160, color: "#2eaf67" },
                  { x: 240, y: 145, color: "#2eaf67" },
                  { x: 390, y: 132, color: "#2eaf67" },
                  { x: 540, y: 108, color: "#2eaf67" },
                  { x: 690, y: 92, color: "#2eaf67" },
                  { x: 90, y: 152, color: "#ef476f" },
                  { x: 240, y: 150, color: "#ef476f" },
                  { x: 390, y: 165, color: "#ef476f" },
                  { x: 540, y: 160, color: "#ef476f" },
                  { x: 690, y: 164, color: "#ef476f" },
                ].map((point, index) => (
                  <circle key={index} cx={point.x} cy={point.y} r="4" fill={point.color} />
                ))}

                {chartLabels.map((label, index) => (
                  <text
                    key={label}
                    x={90 + index * 150}
                    y="210"
                    textAnchor="middle"
                    fontSize="12"
                    fill="#6b7695"
                  >
                    {label}
                  </text>
                ))}
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>

    </>
  );
}
