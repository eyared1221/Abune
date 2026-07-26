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
import type { PersistedSpiritualChild } from "@/types/spiritual-child";
import { cn } from "@/lib/utils";

type TabKey = "overview" | "appointments" | "repentance" | "attendance";

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "overview", label: "Overview" },
  { key: "appointments", label: "Appointments" },
  { key: "repentance", label: "Repentance (ንስሐ)" },
  { key: "attendance", label: "Attendance" },
];

function formatGenderLabel(gender: string) {
  switch (gender) {
    case "MALE":
      return "Male";
    case "FEMALE":
      return "Female";
    default:
      return gender;
  }
}

function getInitials(name: string) {
  const segments = name
    .split(" ")
    .map((segment) => segment.trim())
    .filter(Boolean)
    .slice(0, 2);

  return (segments[0]?.[0] ?? "").concat(segments[1]?.[0] ?? "").toUpperCase();
}

function calculateAge(dateOfBirth: string) {
  const birthDate = new Date(dateOfBirth);

  if (Number.isNaN(birthDate.getTime())) {
    return 0;
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const hasBirthdayPassed =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());

  if (!hasBirthdayPassed) {
    age -= 1;
  }

  return age;
}

type ProfileProps = {
  child: PersistedSpiritualChild;
};

export function SpiritualChildProfileView({ child }: ProfileProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  const submission = child.submission;
  const age = calculateAge(submission.dateOfBirth);
  const initials = getInitials(submission.baptismalName);
  const isTeen = age > 0 && age < 20;
  const group = isTeen ? "Teens" : "Young Adults";
  const avatarClassName = "bg-[#e8fff2] text-[#2eaf67]";
  const joinedDate = new Date(child.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

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
                  avatarClassName,
                )}
              >
                {initials}
              </div>

              <div className="min-w-0">
                <h1 className="text-3xl font-extrabold tracking-tight text-[#132a57] sm:text-[3rem]">
                  {submission.baptismalName}
                </h1>

                <p className="mt-3 text-lg font-medium text-[#8490ab]">
                  Age {age} • {formatGenderLabel(submission.gender)} • {group}
                </p>

                <div className="mt-6 grid gap-4 lg:grid-cols-3">
                  <InfoTile icon={Phone} label="Phone" value={submission.phoneNumber} />
                  <InfoTile icon={UserRound} label="Guardian" value="N/A" />
                  <InfoTile icon={Calendar} label="Joined" value={joinedDate} />
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <span className="inline-flex items-center rounded-full bg-[#edf1f8] px-4 py-2 text-sm font-semibold text-[#6b7998]">
                    Preparing for Holy Communion
                  </span>

                  <span className="inline-flex items-center rounded-full bg-[#fff1dd] px-4 py-2 text-sm font-semibold text-[#f09a16]">
                    {child.status}
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
  const submission = child.submission;
  const age = calculateAge(submission.dateOfBirth);
  const isTeen = age > 0 && age < 20;
  const group = isTeen ? "Teens" : "Young Adults";

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card className="overflow-hidden rounded-[26px] border-0 bg-gradient-to-br from-[#fff5db] via-[#fff8ea] to-[#fffdfa] shadow-none">
        <CardContent className="p-7">
          <p className="text-[2rem] font-extrabold text-[#17305d]">Next Appointment</p>
          <p className="mt-8 text-[2.5rem] font-extrabold text-[#b3842a]">To be scheduled</p>
          <p className="mt-4 text-2xl font-semibold text-[#50607f]">
            Pending • Initial Follow-up
          </p>
          <p className="mt-5 text-lg text-[#8390ab]">Schedule an introductory follow-up with the spiritual child.</p>
        </CardContent>
      </Card>

      <Card className="rounded-[26px] border-0 bg-[#fbf6ec] shadow-none">
        <CardContent className="p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[2rem] font-extrabold text-[#17305d]">Current Status</p>
              <p className="mt-8 text-xl text-[#8692ad]">Profile Status</p>
            </div>

            <p className="text-2xl font-extrabold text-[#17305d]">{child.status}</p>
          </div>

          <div className="mt-4 h-3 overflow-hidden rounded-full bg-white">
            <div
              className="h-full rounded-full bg-[#b08835]"
              style={{ width: "100%" }}
            />
          </div>

          <div className="mt-6 flex items-center gap-3 text-lg text-[#5d6d8f]">
            <CheckCircle2 className="h-6 w-6 text-[#2ea067]" />
            <span>Profile created successfully</span>
          </div>

          <p className="mt-5 text-base text-[#8692ad]">Recently added and awaiting first pastoral follow-up.</p>
        </CardContent>
      </Card>

      <Card className="rounded-[26px] border border-[#f0e5d2] bg-white shadow-none">
        <CardContent className="p-7">
          <p className="text-xl font-extrabold text-[#17305d]">Spiritual Snapshot</p>
          <div className="mt-5 space-y-4">
            <SnapshotRow label="Group" value={group} />
            <SnapshotRow label="Current Status" value={child.status} />
            <SnapshotRow label="Marital Status" value={submission.maritalStatus} />
            <SnapshotRow label="Occupation" value={submission.occupation} />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[26px] border border-[#f0e5d2] bg-white shadow-none">
        <CardContent className="p-7">
          <p className="text-xl font-extrabold text-[#17305d]">Current Journey</p>
          <div className="mt-5 space-y-4">
            <div className="flex gap-3">
              <div
                className="mt-1 h-5 w-5 shrink-0 rounded-full border-2 border-[#2ea067] bg-[#eaf8ef]"
              />
              <div>
                <p className="font-bold text-[#17305d]">Registration completed</p>
                <p className="mt-1 text-sm text-[#8692ad]">Profile created successfully from the add child form.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div
                className="mt-1 h-5 w-5 shrink-0 rounded-full border-2 border-[#d9c081] bg-[#fff8e8]"
              />
              <div>
                <p className="font-bold text-[#17305d]">Pastoral welcome session</p>
                <p className="mt-1 text-sm text-[#8692ad]">Needs to be scheduled with the spiritual child.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div
                className="mt-1 h-5 w-5 shrink-0 rounded-full border-2 border-[#d9c081] bg-[#fff8e8]"
              />
              <div>
                <p className="font-bold text-[#17305d]">Holy Communion preparation review</p>
                <p className="mt-1 text-sm text-[#8692ad]">Pending initial spiritual guidance.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AppointmentsTab({ child }: ProfileProps) {
  return (
    <div className="space-y-5">
      <div className="rounded-[18px] bg-[#f7f2e9] px-5 py-5 sm:px-6">
        <p className="text-[19px] font-extrabold text-[#10213f]">No appointments scheduled yet</p>
        <p className="mt-2 text-[16px] font-medium text-[#8892a8]">
          Appointments will be added after the initial pastoral meeting.
        </p>
      </div>
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
              <p className="mt-2 text-[#8692ad]">No active repentance cycle</p>
            </div>
            <Clock3 className="h-8 w-8 text-[#c79c46]" />
          </div>

          <div className="mt-6 h-3 overflow-hidden rounded-full bg-white">
            <div
              className="h-full rounded-full bg-[#b08835]"
              style={{ width: "0%" }}
            />
          </div>

          <div className="mt-4 flex items-center justify-between text-sm font-semibold text-[#6f7c98]">
            <span>Not Started</span>
            <span>0% complete</span>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[26px] border border-[#efe5d4] bg-white shadow-none">
        <CardContent className="p-7">
          <p className="text-2xl font-extrabold text-[#17305d]">Steps</p>
          <div className="mt-5 space-y-4">
            <div className="rounded-[18px] bg-[#fcfaf5] px-4 py-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-[#17305d]">Registration completed</p>
                  <p className="mt-1 text-sm text-[#8692ad]">Profile created successfully from the add child form.</p>
                </div>
                <Badge variant="success">
                  Done
                </Badge>
              </div>
            </div>
            <div className="rounded-[18px] bg-[#fcfaf5] px-4 py-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-[#17305d]">Pastoral welcome session</p>
                  <p className="mt-1 text-sm text-[#8692ad]">Needs to be scheduled with the spiritual child.</p>
                </div>
                <Badge variant="warning">
                  Pending
                </Badge>
              </div>
            </div>
            <div className="rounded-[18px] bg-[#fcfaf5] px-4 py-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-[#17305d]">Holy Communion preparation review</p>
                  <p className="mt-1 text-sm text-[#8692ad]">Pending initial spiritual guidance.</p>
                </div>
                <Badge variant="warning">
                  Pending
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AttendanceTab({ child }: ProfileProps) {
  const submission = child.submission;
  const joinedDate = new Date(child.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="rounded-[26px] border border-[#efe5d4] bg-white shadow-none lg:col-span-1">
        <CardContent className="p-7">
          <p className="text-lg font-semibold text-[#8d97ae]">Attendance Rate</p>
          <p className="mt-4 text-5xl font-extrabold text-[#17305d]">New</p>
          <p className="mt-4 text-base text-[#8692ad]">No attendance activity recorded yet.</p>
        </CardContent>
      </Card>

      <Card className="rounded-[26px] border border-[#efe5d4] bg-white shadow-none lg:col-span-2">
        <CardContent className="p-7">
          <p className="text-2xl font-extrabold text-[#17305d]">Recent Participation</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-[20px] bg-[#fbf6ec] p-5">
              <p className="text-sm font-semibold text-[#8d97ae]">Last Seen</p>
              <p className="mt-2 text-xl font-bold text-[#17305d]">No visits recorded yet</p>
            </div>

            <div className="rounded-[20px] bg-[#fbf6ec] p-5">
              <p className="text-sm font-semibold text-[#8d97ae]">Holy Communion</p>
              <p className="mt-2 text-xl font-bold text-[#17305d]">
                Preparation Ongoing
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
