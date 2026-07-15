"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock3,
  MoreVertical,
  PencilLine,
  Phone,
  UserRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { SpiritualChild } from "@/lib/spiritual-children";
import { cn } from "@/lib/utils";

type TabKey = "overview" | "appointments" | "repentance" | "attendance";

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "overview", label: "Overview" },
  { key: "appointments", label: "Appointments" },
  { key: "repentance", label: "Repentance (ንስሐ)" },
  { key: "attendance", label: "Attendance" },
];

type ProfileProps = {
  child: SpiritualChild;
};

export function SpiritualChildProfileView({ child }: ProfileProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  return (
    <div className="space-y-6">
      <Link
        href="/father/children"
        className="inline-flex items-center gap-2 text-base font-medium text-[#7f8aa3] transition-colors hover:text-[#4d5c84]"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to Children
      </Link>

      <Card className="rounded-[30px] border border-[#ede6d8] bg-white shadow-[0_14px_36px_rgba(30,44,83,0.08)]">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <div
                className={cn(
                  "flex h-[120px] w-[120px] shrink-0 items-center justify-center rounded-[28px] text-[44px] font-extrabold shadow-sm",
                  child.avatarClassName,
                )}
              >
                {child.initials}
              </div>

              <div className="min-w-0">
                <h1 className="text-3xl font-extrabold tracking-tight text-[#132a57] sm:text-[3rem]">
                  {child.name}
                </h1>

                <p className="mt-3 text-lg font-medium text-[#8490ab]">
                  Age {child.age} • {child.gender} • {child.group}
                </p>

                <div className="mt-6 grid gap-4 lg:grid-cols-3">
                  <InfoTile icon={Phone} label="Phone" value={child.contact} />
                  <InfoTile icon={UserRound} label="Guardian" value={child.guardian} />
                  <InfoTile icon={Calendar} label="Joined" value={child.joinedOn} />
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold",
                      child.communionReady
                        ? "bg-[#eaf8ef] text-[#24935f]"
                        : "bg-[#edf1f8] text-[#6b7998]",
                    )}
                  >
                    {child.communionReady ? "Holy Communion Ready" : "Preparing for Holy Communion"}
                  </span>

                  <span className="inline-flex items-center rounded-full bg-[#fff1dd] px-4 py-2 text-sm font-semibold text-[#f09a16]">
                    {child.repentance.label}
                    {child.repentance.daysLeft > 0 ? ` (${child.repentance.daysLeft} days left)` : ""}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start">
              <Button
                variant="outline"
                className="h-12 rounded-[18px] border-[#e7d8bb] bg-[#fffaf0] px-5 text-base font-bold text-[#24355b] hover:bg-[#fbf3e4]"
              >
                <PencilLine className="h-5 w-5" />
                Edit
              </Button>

              <button
                aria-label="More child actions"
                className="flex h-12 w-12 items-center justify-center rounded-full text-[#334264] transition-colors hover:bg-[#f8f4ea]"
                type="button"
              >
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[30px] border border-[#ede6d8] bg-white shadow-[0_14px_36px_rgba(30,44,83,0.08)]">
        <div className="border-b border-[#eee5d4] px-4 sm:px-7">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className={cn(
                  "whitespace-nowrap border-b-2 px-5 py-5 text-lg font-semibold transition-colors",
                  activeTab === tab.key
                    ? "border-[#c89d43] text-[#c89d43]"
                    : "border-transparent text-[#7d89a3] hover:text-[#445276]",
                )}
                onClick={() => setActiveTab(tab.key)}
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <CardContent className="p-5 sm:p-7">
          {activeTab === "overview" ? <OverviewTab child={child} /> : null}
          {activeTab === "appointments" ? <AppointmentsTab child={child} /> : null}
          {activeTab === "repentance" ? <RepentanceTab child={child} /> : null}
          {activeTab === "attendance" ? <AttendanceTab child={child} /> : null}
        </CardContent>
      </Card>
    </div>
  );
}

function InfoTile({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Phone;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[22px] bg-[#fbf6ec] px-5 py-4">
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-[#c79c46]" />
        <div className="min-w-0">
          <p className="text-sm font-medium text-[#8d97ae]">{label}</p>
          <p className="truncate text-[15px] font-bold text-[#142b56]">{value}</p>
        </div>
      </div>
    </div>
  );
}

function OverviewTab({ child }: ProfileProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card className="overflow-hidden rounded-[26px] border-0 bg-gradient-to-br from-[#fff5db] via-[#fff8ea] to-[#fffdfa] shadow-none">
        <CardContent className="p-7">
          <p className="text-[2rem] font-extrabold text-[#17305d]">Next Appointment</p>
          <p className="mt-8 text-[2.5rem] font-extrabold text-[#b3842a]">{child.nextAppointment.date}</p>
          <p className="mt-4 text-2xl font-semibold text-[#50607f]">
            {child.nextAppointment.time} • {child.nextAppointment.title}
          </p>
          <p className="mt-5 text-lg text-[#8390ab]">{child.nextAppointment.note}</p>
        </CardContent>
      </Card>

      <Card className="rounded-[26px] border-0 bg-[#fbf6ec] shadow-none">
        <CardContent className="p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[2rem] font-extrabold text-[#17305d]">Current Status</p>
              <p className="mt-8 text-xl text-[#8692ad]">Repentance Progress</p>
            </div>

            <p className="text-2xl font-extrabold text-[#17305d]">{child.repentance.progress}%</p>
          </div>

          <div className="mt-4 h-3 overflow-hidden rounded-full bg-white">
            <div
              className="h-full rounded-full bg-[#b08835]"
              style={{ width: `${child.repentance.progress}%` }}
            />
          </div>

          <div className="mt-6 flex items-center gap-3 text-lg text-[#5d6d8f]">
            <CheckCircle2 className="h-6 w-6 text-[#2ea067]" />
            <span>
              {child.repentance.daysLeft > 0
                ? `${child.repentance.daysLeft} days remaining`
                : "Repentance cycle completed"}
            </span>
          </div>

          <p className="mt-5 text-base text-[#8692ad]">{child.repentance.note}</p>
        </CardContent>
      </Card>

      <Card className="rounded-[26px] border border-[#f0e5d2] bg-white shadow-none">
        <CardContent className="p-7">
          <p className="text-xl font-extrabold text-[#17305d]">Spiritual Snapshot</p>
          <div className="mt-5 space-y-4">
            <SnapshotRow label="Group" value={child.group} />
            <SnapshotRow label="Current Status" value={child.status} />
            <SnapshotRow label="Attendance Rate" value={child.attendance.rate} />
            <SnapshotRow label="Last Seen" value={child.attendance.lastSeen} />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[26px] border border-[#f0e5d2] bg-white shadow-none">
        <CardContent className="p-7">
          <p className="text-xl font-extrabold text-[#17305d]">Current Journey</p>
          <div className="mt-5 space-y-4">
            {child.repentanceSteps.map((step) => (
              <div key={step.title} className="flex gap-3">
                <div
                  className={cn(
                    "mt-1 h-5 w-5 shrink-0 rounded-full border-2",
                    step.complete ? "border-[#2ea067] bg-[#eaf8ef]" : "border-[#d9c081] bg-[#fff8e8]",
                  )}
                />
                <div>
                  <p className="font-bold text-[#17305d]">{step.title}</p>
                  <p className="mt-1 text-sm text-[#8692ad]">{step.note}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AppointmentsTab({ child }: ProfileProps) {
  return (
    <div className="space-y-5">
      {child.appointments.map((appointment, index) => {
        const isUpcoming = index === 0;
        const isCompleted = !isUpcoming;

        return (
          <div
            key={`${appointment.date}-${appointment.time}`}
            className="group rounded-[18px] bg-[#f7f2e9] px-5 py-5 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#f3ecdf] hover:shadow-[0_10px_22px_rgba(34,45,70,0.07)] sm:px-6"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-[19px] font-extrabold text-[#10213f]">
                  {appointment.title}
                </p>

                <p className="mt-2 text-[16px] font-medium text-[#8892a8]">
                  {appointment.date} at {appointment.time}
                </p>

                <p className="mt-4 text-[17px] font-medium text-[#4f5d78]">
                  {appointment.note}
                </p>
              </div>

              <div
                className={cn(
                  "inline-flex h-fit shrink-0 items-center gap-2 self-start rounded-full px-4 py-2 text-sm font-semibold",
                  isUpcoming
                    ? "bg-[#e5f1ff] text-[#1778ef]"
                    : "bg-[#e7f8ef] text-[#13975d]",
                )}
              >
                {isCompleted && (
                  <CheckCircle2 className="h-4 w-4" strokeWidth={1.8} />
                )}

                <span>
                  {isUpcoming ? "Upcoming" : "Completed"}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RepentanceTab({ child }: ProfileProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <Card className="rounded-[26px] border-0 bg-[#fbf6ec] shadow-none">
        <CardContent className="p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-2xl font-extrabold text-[#17305d]">Repentance Progress</p>
              <p className="mt-2 text-[#8692ad]">{child.repentance.note}</p>
            </div>
            <Clock3 className="h-8 w-8 text-[#c79c46]" />
          </div>

          <div className="mt-6 h-3 overflow-hidden rounded-full bg-white">
            <div
              className="h-full rounded-full bg-[#b08835]"
              style={{ width: `${child.repentance.progress}%` }}
            />
          </div>

          <div className="mt-4 flex items-center justify-between text-sm font-semibold text-[#6f7c98]">
            <span>{child.repentance.label}</span>
            <span>{child.repentance.progress}% complete</span>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[26px] border border-[#efe5d4] bg-white shadow-none">
        <CardContent className="p-7">
          <p className="text-2xl font-extrabold text-[#17305d]">Steps</p>
          <div className="mt-5 space-y-4">
            {child.repentanceSteps.map((step) => (
              <div key={step.title} className="rounded-[18px] bg-[#fcfaf5] px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-[#17305d]">{step.title}</p>
                    <p className="mt-1 text-sm text-[#8692ad]">{step.note}</p>
                  </div>
                  <Badge variant={step.complete ? "success" : "warning"}>
                    {step.complete ? "Done" : "Pending"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AttendanceTab({ child }: ProfileProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="rounded-[26px] border border-[#efe5d4] bg-white shadow-none lg:col-span-1">
        <CardContent className="p-7">
          <p className="text-lg font-semibold text-[#8d97ae]">Attendance Rate</p>
          <p className="mt-4 text-5xl font-extrabold text-[#17305d]">{child.attendance.rate}</p>
          <p className="mt-4 text-base text-[#8692ad]">{child.attendance.note}</p>
        </CardContent>
      </Card>

      <Card className="rounded-[26px] border border-[#efe5d4] bg-white shadow-none lg:col-span-2">
        <CardContent className="p-7">
          <p className="text-2xl font-extrabold text-[#17305d]">Recent Participation</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-[20px] bg-[#fbf6ec] p-5">
              <p className="text-sm font-semibold text-[#8d97ae]">Last Seen</p>
              <p className="mt-2 text-xl font-bold text-[#17305d]">{child.attendance.lastSeen}</p>
            </div>

            <div className="rounded-[20px] bg-[#fbf6ec] p-5">
              <p className="text-sm font-semibold text-[#8d97ae]">Holy Communion</p>
              <p className="mt-2 text-xl font-bold text-[#17305d]">
                {child.communionReady ? "Ready" : "Preparation Ongoing"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SnapshotRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[18px] bg-[#fcfaf5] px-4 py-3">
      <p className="text-sm font-semibold text-[#8d97ae]">{label}</p>
      <p className="text-right font-bold text-[#17305d]">{value}</p>
    </div>
  );
}
