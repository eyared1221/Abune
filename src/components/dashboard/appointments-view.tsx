import {
  Bell,
  CalendarCheck2,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Edit3,
  Filter,
  MapPin,
  MoreHorizontal,
  Plus,
  Search,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const stats = [
  {
    label: "Total Appointments",
    value: "24",
    note: "All time",
    icon: CalendarClock,
    iconClassName: "bg-[#f3e8ff] text-[#8d5df6]",
    noteClassName: "text-[#6d7796]",
  },
  {
    label: "This Month",
    value: "6",
    note: "May 2025",
    icon: CalendarCheck2,
    iconClassName: "bg-[#e8fff2] text-[#2eaf67]",
    noteClassName: "text-[#6d7796]",
  },
  {
    label: "Today",
    value: "3",
    note: "May 20, 2025",
    icon: Clock3,
    iconClassName: "bg-[#fff5df] text-[#f59e0b]",
    noteClassName: "text-[#6d7796]",
  },
  {
    label: "Completed",
    value: "18",
    note: "All time",
    icon: CheckCircle2,
    iconClassName: "bg-[#e9f1ff] text-[#4676ff]",
    noteClassName: "text-[#6d7796]",
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
    avatarClassName: "bg-[#f4ebff] text-[#8e59ff]",
    type: "Personal Meeting",
    typeVariant: "violet" as const,
    status: "Today",
    statusVariant: "violet" as const,
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
    avatarClassName: "bg-[#e8fff2] text-[#2eaf67]",
    type: "Spiritual Counseling",
    typeVariant: "success" as const,
    status: "Today",
    statusVariant: "violet" as const,
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
    statusVariant: "violet" as const,
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
    typeVariant: "violet" as const,
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
    avatarClassName: "bg-[#f3ebff] text-[#8c5bff]",
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
    typeVariant: "violet" as const,
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
    typeVariant: "violet" as const,
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

const selectedAppointment = {
  initials: "MA",
  name: "Mekdes Assefa",
  status: "Online",
  statusClassName: "text-[#2eaf67]",
  type: "Personal Meeting",
  typeVariant: "violet" as const,
  date: "May 20, 2025 (Today)",
  time: "10:30 AM - 11:30 AM",
  location: "Church Office",
  purpose: "Personal guidance and spiritual growth",
  appointmentStatus: "Scheduled",
  appointmentStatusVariant: "violet" as const,
  remindDate: "1 day before",
  remindTime: "May 19, 9:00 AM",
  notes: "She requested prayer for her family and work.",
} as const;

const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;

const calendarWeeks = [
  ["27", "28", "29", "30", "1", "2", "3"],
  ["4", "5", "6", "7", "8", "9", "10"],
  ["11", "12", "13", "14", "15", "16", "17"],
  ["18", "19", "20", "21", "22", "23", "24"],
  ["25", "26", "27", "28", "29", "30", "31"],
] as const;

const todayUpcoming = [
  {
    time: "10:30 AM",
    name: "Mekdes Assefa",
    type: "Personal Meeting",
    avatarClassName: "bg-[#f4ebff] text-[#8e59ff]",
    initials: "MA",
  },
  {
    time: "02:00 PM",
    name: "Daniel Gebre",
    type: "Spiritual Counseling",
    avatarClassName: "bg-[#e8fff2] text-[#2eaf67]",
    initials: "DG",
  },
  {
    time: "04:30 PM",
    name: "Hanna Tesfaye",
    type: "Follow-up",
    avatarClassName: "bg-[#edf2ff] text-[#4f7bff]",
    initials: "BT",
  },
] as const;

const chartLabels = ["Apr 20-26", "Apr 27-May 3", "May 4-10", "May 11-17", "May 18-24"] as const;

export function AppointmentsView() {
  return (
    <>
      <div className="mt-6 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="grid flex-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

        <Button className="rounded-2xl bg-[#132e8a] px-5 py-6 text-base font-bold shadow-lg shadow-[#132e8a]/20 hover:bg-[#102777]">
          <Plus className="h-5 w-5" />
          New Appointment
        </Button>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_340px]">
        <Card>
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
              <div className="flex flex-col gap-4 lg:flex-row">
                <div className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-[#e9edf8] bg-white px-4 py-3 text-[#7b86a7]">
                  <Search className="h-5 w-5 shrink-0" />
                  <span className="truncate text-sm font-semibold">Search by name or phone...</span>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    className="flex items-center justify-between gap-4 rounded-2xl border border-[#e9edf8] bg-white px-4 py-3 text-sm font-semibold text-[#4c5678] sm:min-w-[120px]"
                    type="button"
                  >
                    All Status
                    <ChevronDown className="h-4 w-4 text-[#97a0bb]" />
                  </button>

                  <button
                    className="flex items-center justify-between gap-4 rounded-2xl border border-[#e9edf8] bg-white px-4 py-3 text-sm font-semibold text-[#4c5678] sm:min-w-[120px]"
                    type="button"
                  >
                    All Types
                    <ChevronDown className="h-4 w-4 text-[#97a0bb]" />
                  </button>

                  <button
                    className="flex items-center justify-center gap-2 rounded-2xl border border-[#e9edf8] bg-white px-4 py-3 text-sm font-semibold text-[#4c5678] sm:min-w-[90px]"
                    type="button"
                  >
                    <Filter className="h-4 w-4" />
                    Filter
                  </button>
                </div>
              </div>

              <div className="mt-6 overflow-hidden rounded-[28px] border border-[#eef1fb]">
                <div className="hidden grid-cols-[110px_1.4fr_1.1fr_0.9fr_60px] items-center gap-4 bg-[#fcfdff] px-6 py-4 text-sm font-extrabold text-[#6b7695] lg:grid">
                  <p>Date &amp; Time</p>
                  <p>Spiritual Child</p>
                  <p>Type</p>
                  <p>Status</p>
                  <p className="text-right">Actions</p>
                </div>

                <div className="divide-y divide-[#eef1fb] bg-white">
                  {appointments.map((appointment) => (
                    <div
                      key={`${appointment.name}-${appointment.time}`}
                      className={cn(
                        "grid gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[110px_1.4fr_1.1fr_0.9fr_60px] lg:items-center",
                        appointment.highlighted ? "bg-[#fbf9ff]" : "",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-16 w-16 flex-col items-center justify-center rounded-2xl bg-[#f7f9ff] text-center">
                          <span className="text-xs font-bold uppercase tracking-wide text-[#7b86a7]">{appointment.month}</span>
                          <span className="text-xl font-extrabold leading-none text-[#1d2859]">{appointment.day}</span>
                          <span className="text-xs font-semibold text-[#7b86a7]">{appointment.weekday}</span>
                        </div>
                        <p className="text-sm font-bold text-[#1d2859]">{appointment.time}</p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-base font-extrabold",
                            appointment.avatarClassName,
                          )}
                        >
                          {appointment.initials}
                        </div>
                        <div>
                          <p className="font-extrabold text-[#1d2859]">{appointment.name}</p>
                          <p className="mt-1 text-sm text-[#6b7695]">{appointment.phone}</p>
                        </div>
                      </div>

                      <div>
                        <Badge variant={appointment.typeVariant}>{appointment.type}</Badge>
                      </div>

                      <div>
                        <Badge variant={appointment.statusVariant}>{appointment.status}</Badge>
                      </div>

                      <div className="flex items-center justify-end">
                        <button
                          className="flex h-9 w-9 items-center justify-center rounded-full text-[#7d86a7] transition-colors hover:bg-[#f5f7ff]"
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
                <p>Showing 1 to 10 of 24 appointments</p>

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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle>Appointment Details</CardTitle>
              <button className="text-[#98a0bc]" type="button">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f4ebff] text-lg font-extrabold text-[#8e59ff]">
                  {selectedAppointment.initials}
                </div>
                <div>
                  <p className="font-extrabold text-[#1d2859]">{selectedAppointment.name}</p>
                  <p className={cn("mt-1 text-sm font-semibold", selectedAppointment.statusClassName)}>
                    {selectedAppointment.status}
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-5 text-sm">
                <div className="grid grid-cols-[84px_1fr] gap-4">
                  <p className="font-semibold text-[#6b7695]">Type</p>
                  <Badge variant={selectedAppointment.typeVariant} className="w-fit">
                    {selectedAppointment.type}
                  </Badge>
                </div>
                <div className="grid grid-cols-[84px_1fr] gap-4">
                  <p className="font-semibold text-[#6b7695]">Date &amp; Time</p>
                  <div className="text-[#4c5678]">
                    <p className="font-bold">{selectedAppointment.date}</p>
                    <p className="mt-1">{selectedAppointment.time}</p>
                  </div>
                </div>
                <div className="grid grid-cols-[84px_1fr] gap-4">
                  <p className="font-semibold text-[#6b7695]">Location</p>
                  <div className="flex items-start gap-2 text-[#4c5678]">
                    <MapPin className="mt-0.5 h-4 w-4 text-[#7b86a7]" />
                    <p>{selectedAppointment.location}</p>
                  </div>
                </div>
                <div className="grid grid-cols-[84px_1fr] gap-4">
                  <p className="font-semibold text-[#6b7695]">Purpose</p>
                  <p className="text-[#4c5678]">{selectedAppointment.purpose}</p>
                </div>
                <div className="grid grid-cols-[84px_1fr] gap-4">
                  <p className="font-semibold text-[#6b7695]">Status</p>
                  <Badge variant={selectedAppointment.appointmentStatusVariant} className="w-fit">
                    {selectedAppointment.appointmentStatus}
                  </Badge>
                </div>
                <div className="grid grid-cols-[84px_1fr] gap-4">
                  <p className="font-semibold text-[#6b7695]">Remind</p>
                  <div className="flex items-start gap-2 text-[#4c5678]">
                    <Bell className="mt-0.5 h-4 w-4 text-[#7b86a7]" />
                    <div>
                      <p>{selectedAppointment.remindDate}</p>
                      <p className="mt-1">{selectedAppointment.remindTime}</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-[84px_1fr] gap-4">
                  <p className="font-semibold text-[#6b7695]">Notes</p>
                  <p className="text-[#4c5678]">{selectedAppointment.notes}</p>
                </div>
              </div>

              <Button className="mt-6 w-full rounded-2xl bg-[#132e8a] py-6 text-base font-bold hover:bg-[#102777]">
                <Edit3 className="h-5 w-5" />
                Edit Appointment
              </Button>

              <button
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold text-[#ef476f] transition-colors hover:bg-[#fff5f7]"
                type="button"
              >
                <XCircle className="h-4 w-4" />
                Cancel Appointment
              </button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle>Calendar</CardTitle>
              <div className="flex items-center gap-2">
                <button className="text-[#98a0bc]" type="button">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <p className="text-base font-extrabold text-[#1d2859]">May 2025</p>
                <button className="text-[#98a0bc]" type="button">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 text-center text-xs font-extrabold text-[#7d86a7]">
                {days.map((day) => (
                  <p key={day}>{day}</p>
                ))}
              </div>

              <div className="mt-4 space-y-2">
                {calendarWeeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="grid grid-cols-7 gap-2">
                    {week.map((date, dateIndex) => {
                      const isMuted = weekIndex === 0 && dateIndex < 4;
                      const isActive = date === "20";

                      return (
                        <div key={`${weekIndex}-${date}`} className="flex flex-col items-center gap-1">
                          <div
                            className={cn(
                              "flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold",
                              isActive
                                ? "bg-[#7c3aed] text-white shadow-lg shadow-[#7c3aed]/20"
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
                              ["18", "20", "21", "22", "23", "24"].includes(date) ? "bg-[#7c3aed]" : "bg-[#d6deef]",
                            )}
                          />
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
              <CardTitle>Upcoming Today</CardTitle>
              <button className="text-sm font-bold text-[#3563ff]" type="button">
                View All
              </button>
            </CardHeader>
            <CardContent className="space-y-3">
              {todayUpcoming.map((item) => (
                <div
                  key={`${item.name}-${item.time}`}
                  className="grid grid-cols-[72px_44px_1fr_auto] items-center gap-3 rounded-3xl px-2 py-3 transition-colors hover:bg-[#fbfcff]"
                >
                  <p className="text-sm font-bold text-[#1d2859]">{item.time}</p>
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-extrabold", item.avatarClassName)}>
                    {item.initials}
                  </div>
                  <div>
                    <p className="font-extrabold text-[#1d2859]">{item.name}</p>
                    <p className="text-sm text-[#6b7695]">{item.type}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-[#98a0bc]" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Appointments Overview</CardTitle>
          <button className="text-sm font-bold text-[#3563ff]" type="button">
            View Calendar
          </button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-5 text-sm font-semibold text-[#4c5678]">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#7c3aed]" />
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
                <line x1="50" y1="20" x2="50" y2="190" stroke="#e7ebf5" />
                <line x1="50" y1="190" x2="730" y2="190" stroke="#e7ebf5" />

                {[40, 80, 120, 160].map((y) => (
                  <line key={y} x1="50" y1={y} x2="730" y2={y} stroke="#f1f4fa" />
                ))}

                <polyline
                  fill="none"
                  stroke="#7c3aed"
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
                  { x: 90, y: 135, color: "#7c3aed" },
                  { x: 240, y: 90, color: "#7c3aed" },
                  { x: 390, y: 65, color: "#7c3aed" },
                  { x: 540, y: 52, color: "#7c3aed" },
                  { x: 690, y: 60, color: "#7c3aed" },
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

      <Card className="mt-6 overflow-hidden bg-gradient-to-r from-[#f6efff] to-[#fbf9ff]">
        <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#8d5df6] shadow-sm">
              <CalendarClock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xl font-extrabold text-[#5c35d6]">Stay Organized</p>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-[#4c5678]">
                Keep your schedule up to date and give each soul the time and care they need.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center rounded-[28px] bg-white/60 px-8 py-5 text-[#8d5df6]">
            <CalendarCheck2 className="h-16 w-16" />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
