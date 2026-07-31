"use client";

import type { ReactNode } from "react";
import {
  ArrowLeft,
  Bell,
  Calendar,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Cross,
  Equal,
  House,
  LoaderCircle,
  MessageCircle,
  Moon,
  MoreHorizontal,
  Plus,
  Sunrise,
  Users,
} from "lucide-react";
import { useLocale } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useRouter } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import type { AppointmentReason, MeetingMethod } from "@/types/availability";

// ─── Constants ───────────────────────────────────────────────────────────────

const appointmentTypes = [
  {
    id: "confession" as AppointmentReason,
    title: "Confession",
    description: "Sacrament of Reconciliation",
    icon: Plus,
    color: "text-[#2563eb]",
    bg: "bg-[#eff4ff]",
  },
  {
    id: "spiritual-guidance" as AppointmentReason,
    title: "Spiritual Guidance",
    description: "Spiritual advice and teaching",
    icon: Sunrise,
    color: "text-[#b47a13]",
    bg: "bg-[#fff8e9]",
  },
  {
    id: "counseling" as AppointmentReason,
    title: "Counseling",
    description: "Personal or emotional support",
    icon: Equal,
    color: "text-[#0d9488]",
    bg: "bg-[#ecfdf5]",
  },
  {
    id: "repentance" as AppointmentReason,
    title: "Repentance",
    description: "Seeking spiritual renewal",
    icon: Moon,
    color: "text-[#dc6843]",
    bg: "bg-[#fff3ee]",
  },
  {
    id: "family-issue" as AppointmentReason,
    title: "Family Issue",
    description: "Family problems and relationships",
    icon: Users,
    color: "text-[#dc6843]",
    bg: "bg-[#fff3ee]",
  },
  {
    id: "other" as AppointmentReason,
    title: "Other",
    description: "Other reason not listed above",
    icon: MoreHorizontal,
    color: "text-[#7c3aed]",
    bg: "bg-[#f3f0ff]",
  },
] as const;

type Tab = "request" | "my-requests" | "history";

const tabLabels: Record<Tab, string> = {
  request: "Request",
  "my-requests": "My Requests",
  history: "History",
};

const methodLabels: Record<MeetingMethod, string> = {
  "in-person": "Direct meeting",
  phone: "Phone call",
  online: "Online meeting",
};

const weekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;

// ─── Types ───────────────────────────────────────────────────────────────────

type Slot = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  meetingMethod: MeetingMethod;
  location: string;
  notes: string | null;
};

type AppointmentRequest = {
  id: string;
  reason: AppointmentReason;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED" | "EXPIRED";
  requestedDate: string;
  requestedStartTime: string;
  requestedEndTime: string;
  meetingMethod: MeetingMethod;
  location: string | null;
  createdAt: string;
};

type Appointment = {
  id: string;
  reason: AppointmentReason;
  status: "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW" | "RESCHEDULED";
  scheduleDate: string;
  startTime: string;
  endTime: string;
  meetingMethod: MeetingMethod;
  location: string | null;
  notes: string | null;
  createdAt: string;
};

type Step = "list" | "select-date" | "select-time" | "confirmed";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function dateKey(d: Date) {
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
}

function calendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const result: Array<Date | null> = Array(firstDay).fill(null);
  for (let day = 1; day <= totalDays; day += 1) {
    result.push(new Date(year, month, day));
  }
  while (result.length % 7 !== 0) result.push(null);
  return result;
}

function displayMonth(d: Date) {
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(d);
}

function displayDateLong(dateStr: string) {
  const d = new Date(`${dateStr}T00:00:00`);
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(d);
}

function displayTime(time: string) {
  const [h = "0", m = "00"] = time.split(":");
  const hours = Number(h);
  const suffix = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${m} ${suffix}`;
}

function durationMinutes(start: string, end: string) {
  const [sh = "0", sm = "0"] = start.split(":").map(Number);
  const [eh = "0", em = "0"] = end.split(":").map(Number);
  return (Number(eh) * 60 + Number(em)) - (Number(sh) * 60 + Number(sm));
}

function shortDay(dateStr: string) {
  const d = new Date(`${dateStr}T00:00:00`);
  return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(d);
}

function shortDate(dateStr: string) {
  const d = new Date(`${dateStr}T00:00:00`);
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(d);
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function ChildAppointmentsView() {
  const [activeTab, setActiveTab] = useState<Tab>("request");
  const [selectedType, setSelectedType] = useState<AppointmentReason | null>(null);
  const [step, setStep] = useState<Step>("list");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [requests, setRequests] = useState<AppointmentRequest[]>([]);
  const [history, setHistory] = useState<Appointment[]>([]);
  const [error, setError] = useState("");

  // Date picker state
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Slots state
  const [slots, setSlots] = useState<Slot[]>([]);
  const [fatherName, setFatherName] = useState("Your Spiritual Father");
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  // Confirmation state
  const [confirmedData, setConfirmedData] = useState<{
    reason: string;
    date: string;
    startTime: string;
    endTime: string;
    fatherName: string;
  } | null>(null);

  const router = useRouter();
  const locale = useLocale() as AppLocale;

  // ─── Tab data fetching ───────────────────────────────────────────────────

  useEffect(() => {
    if (activeTab === "my-requests") fetchRequests();
    else if (activeTab === "history") fetchHistory();
  }, [activeTab]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/appointments/request?type=requests");
      const data = await response.json();
      if (response.ok) setRequests(data.requests || []);
      else setError(data.error || "Failed to fetch requests");
    } catch {
      setError("Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/appointments/request?type=history");
      const data = await response.json();
      if (response.ok) setHistory(data.appointments || []);
      else setError(data.error || "Failed to fetch history");
    } catch {
      setError("Failed to fetch history");
    } finally {
      setLoading(false);
    }
  };

  // ─── Slot fetching ───────────────────────────────────────────────────────

  const fetchSlots = useCallback(async (startDate: string, endDate: string) => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(
        `/api/appointments/slots?startDate=${startDate}&endDate=${endDate}`,
      );
      const data = await response.json();
      if (response.ok) {
        setSlots(data.slots || []);
        setFatherName(data.fatherName || "Your Spiritual Father");
      } else {
        setError(data.error || "Failed to fetch slots");
      }
    } catch {
      setError("Failed to fetch slots");
    } finally {
      setLoading(false);
    }
  }, []);

  // When month changes in date picker, fetch slots for that month
  useEffect(() => {
    if (step === "select-date" || step === "select-time") {
      const start = new Date(month.getFullYear(), month.getMonth(), 1);
      const end = new Date(month.getFullYear(), month.getMonth() + 1, 0);
      fetchSlots(dateKey(start), dateKey(end));
    }
  }, [month, step, fetchSlots]);

  // ─── Calendar helpers ────────────────────────────────────────────────────

  const days = useMemo(() => calendarDays(month.getFullYear(), month.getMonth()), [month]);
  const today = useMemo(() => dateKey(new Date()), []);

  const datesWithSlots = useMemo(() => {
    const set = new Set<string>();
    slots.forEach((s) => set.add(s.date));
    return set;
  }, [slots]);

  // Slots for selected date in time picker
  const slotsForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return slots.filter((s) => s.date === selectedDate);
  }, [slots, selectedDate]);

  // Nearby dates with slots (for the day tabs in time picker)
  const nearbyDates = useMemo(() => {
    if (!selectedDate) return [];
    const allDates = [...datesWithSlots].sort();
    const idx = allDates.indexOf(selectedDate);
    const start = Math.max(0, idx - 1);
    const end = Math.min(allDates.length, idx + 3);
    return allDates.slice(start, end);
  }, [selectedDate, datesWithSlots]);

  // ─── Actions ─────────────────────────────────────────────────────────────

  const handleChooseDateTime = () => {
    if (!selectedType) return;
    setStep("select-date");
  };

  const handleDateSelected = (dateStr: string) => {
    setSelectedDate(dateStr);
    setStep("select-time");
  };

  const handleSelectSlot = async (slot: Slot) => {
    if (!selectedType) return;
    setSelectedSlot(slot);
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/appointments/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason: selectedType,
          requestedDate: slot.date,
          requestedStartTime: slot.startTime,
          requestedEndTime: slot.endTime,
          meetingMethod: slot.meetingMethod,
          location: slot.location || undefined,
          availabilityEntryId: slot.id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setConfirmedData({
          reason: appointmentTypes.find((t) => t.id === selectedType)?.title || selectedType,
          date: slot.date,
          startTime: slot.startTime,
          endTime: slot.endTime,
          fatherName,
        });
        setStep("confirmed");
      } else {
        setError(data.error || "Failed to submit request");
      }
    } catch {
      setError("Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackToAppointments = () => {
    setStep("list");
    setSelectedType(null);
    setSelectedDate(null);
    setSelectedSlot(null);
    setConfirmedData(null);
  };

  const handleViewMyRequests = () => {
    handleBackToAppointments();
    setActiveTab("my-requests");
  };

  // ─── Step: Select Date ───────────────────────────────────────────────────

  if (step === "select-date") {
    const selectedTypeData = appointmentTypes.find((t) => t.id === selectedType);
    const TypeIcon = selectedTypeData?.icon || Calendar;

    return (
      <main className="min-h-screen bg-[#fffaf1] px-3 pb-24 pt-4 text-[#0e265b] min-[480px]:px-5 min-[480px]:pt-7 sm:px-8 sm:pb-28">
        <div className="mx-auto max-w-[920px]">
          <header className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Go back"
              onClick={() => setStep("list")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e8c77e] bg-white text-[#0e265b] shadow-sm transition-colors hover:bg-[#fff8e9] min-[480px]:h-12 min-[480px]:w-12"
            >
              <ArrowLeft className="h-5 w-5 min-[480px]:h-6 min-[480px]:w-6" />
            </button>
            <h1 className="font-serif text-2xl font-bold text-[#10275e] min-[480px]:text-3xl">
              Select Date
            </h1>
            <div className="ml-auto flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#10275e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#b47a13]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#d4d4d8]" />
            </div>
          </header>

          {/* Selected type badge */}
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-[#d0e8d4] bg-[#f0faf2] px-4 py-3">
            <div className={`flex h-9 w-9 items-center justify-center rounded-full ${selectedTypeData?.bg} ${selectedTypeData?.color}`}>
              <TypeIcon className="h-4 w-4" />
            </div>
            <span className="font-serif font-bold text-[#10275e]">{selectedTypeData?.title}</span>
            <button
              type="button"
              onClick={() => setStep("list")}
              className="ml-auto text-sm font-semibold text-[#10275e] hover:text-[#b47a13]"
            >
              Change
            </button>
          </div>

          {/* Calendar */}
          <div className="mt-5 rounded-[22px] border border-[#ead3a4] bg-[#fffdf8] p-4 shadow-[0_3px_8px_rgba(93,65,24,0.08)] min-[480px]:p-6">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e8c77e] text-[#10275e] hover:bg-[#fff8e9]"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <h2 className="font-serif text-lg font-bold text-[#10275e]">{displayMonth(month)}</h2>
              <button
                type="button"
                onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e8c77e] text-[#10275e] hover:bg-[#fff8e9]"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-7 text-center text-xs font-semibold text-[#5c6b8a]">
              {weekdays.map((wd) => (
                <div key={wd} className="py-2">{wd}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 text-center text-sm">
              {days.map((day, i) => {
                if (!day) return <div key={`empty-${i}`} />;
                const dk = dateKey(day);
                const isToday = dk === today;
                const hasSlots = datesWithSlots.has(dk);
                const isPast = dk < today;
                const isSelected = dk === selectedDate;

                return (
                  <button
                    key={dk}
                    type="button"
                    disabled={isPast}
                    onClick={() => !isPast && handleDateSelected(dk)}
                    className={`relative mx-auto my-1 flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                      isSelected
                        ? "bg-[#10275e] text-white"
                        : isToday
                          ? "cursor-pointer border border-[#b47a13] text-[#b47a13] hover:bg-[#fff8e9]"
                          : isPast
                            ? "cursor-not-allowed text-[#d4d4d8]"
                            : hasSlots
                              ? "cursor-pointer font-bold text-[#10275e] hover:bg-[#e8d7b3]"
                              : "cursor-pointer text-[#10275e] hover:bg-[#f5f0e5]"
                    }`}
                  >
                    {day.getDate()}
                    {hasSlots && !isSelected && (
                      <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#b47a13]" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center justify-center gap-5 text-xs text-[#5c6b8a]">
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-[#10275e]" /> Selected
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full border border-[#b47a13]" /> Today
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-[#d4d4d8]" /> Unavailable
              </span>
            </div>
          </div>

          {/* Bottom action */}
          <button
            type="button"
            disabled
            className="mt-5 flex w-full items-center justify-center gap-3 rounded-[20px] bg-gradient-to-r from-[#ce9e35] to-[#a96f0d] px-6 py-4 font-serif text-base font-bold text-white opacity-70 shadow-[0_6px_15px_rgba(128,79,8,0.24)] min-[480px]:rounded-[24px] min-[480px]:py-5 min-[480px]:text-lg"
          >
            <ChevronRight className="h-5 w-5" />
            Select a Date First
          </button>
        </div>

        <BottomNav />
      </main>
    );
  }

  // ─── Step: Select Time ───────────────────────────────────────────────────

  if (step === "select-time" && selectedDate) {
    const selectedTypeData = appointmentTypes.find((t) => t.id === selectedType);
    const TypeIcon = selectedTypeData?.icon || Calendar;

    return (
      <main className="min-h-screen bg-[#fffaf1] px-3 pb-24 pt-4 text-[#0e265b] min-[480px]:px-5 min-[480px]:pt-7 sm:px-8 sm:pb-28">
        <div className="mx-auto max-w-[920px]">
          <header className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Go back"
              onClick={() => setStep("select-date")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e8c77e] bg-white text-[#0e265b] shadow-sm transition-colors hover:bg-[#fff8e9] min-[480px]:h-12 min-[480px]:w-12"
            >
              <ArrowLeft className="h-5 w-5 min-[480px]:h-6 min-[480px]:w-6" />
            </button>
            <h1 className="font-serif text-2xl font-bold text-[#10275e] min-[480px]:text-3xl">
              Select Time
            </h1>
            <div className="ml-auto flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#10275e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#10275e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#b47a13]" />
            </div>
          </header>

          {/* Selected type + date badge */}
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-[#d0e8d4] bg-[#f0faf2] px-4 py-3">
            <div className={`flex h-9 w-9 items-center justify-center rounded-full ${selectedTypeData?.bg} ${selectedTypeData?.color}`}>
              <TypeIcon className="h-4 w-4" />
            </div>
            <div>
              <span className="font-serif font-bold text-[#10275e]">{selectedTypeData?.title}</span>
              <p className="text-xs text-[#706559]">{displayDateLong(selectedDate)}</p>
            </div>
            <button
              type="button"
              onClick={() => setStep("select-date")}
              className="ml-auto text-sm font-semibold text-[#10275e] hover:text-[#b47a13]"
            >
              Change date
            </button>
          </div>

          {/* Day tabs */}
          <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
            {nearbyDates.map((d) => {
              const isActive = d === selectedDate;
              const daySlots = slots.filter((s) => s.date === d);
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setSelectedDate(d)}
                  className={`flex shrink-0 flex-col items-center rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-[#10275e] text-white"
                      : "border border-[#ead3a4] bg-[#fffdf8] text-[#10275e] hover:bg-[#fff8e9]"
                  }`}
                >
                  <span>{shortDay(d)}</span>
                  <span className="mt-0.5 text-sm font-bold">{shortDate(d)}</span>
                  <span className={`mt-1 text-[10px] ${isActive ? "text-[#b47a13]" : "text-[#706559]"}`}>
                    {daySlots.length} slots
                  </span>
                </button>
              );
            })}
          </div>

          {/* Available slots */}
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <p className="font-serif text-base font-bold text-[#10275e]">
                {slotsForSelectedDate.length} slots available
              </p>
              <p className="text-sm text-[#b47a13]">{fatherName}</p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <LoaderCircle className="h-8 w-8 animate-spin text-[#b47a13]" />
              </div>
            ) : slotsForSelectedDate.length === 0 ? (
              <div className="mt-4 flex min-h-[160px] items-center justify-center rounded-[22px] border border-[#ead3a4] bg-[#fffdf8] p-6 text-center">
                <p className="text-sm text-[#706559]">No available slots for this date</p>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {slotsForSelectedDate.map((slot) => (
                  <div
                    key={slot.id}
                    className="rounded-[22px] border border-[#ead3a4] bg-[#fffdf8] p-5 shadow-[0_3px_8px_rgba(93,65,24,0.08)]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-xl font-bold text-[#10275e]">
                        {displayTime(slot.startTime)}
                      </span>
                      <span className="text-[#b47a13]">+</span>
                      <span className="font-serif text-xl font-bold text-[#10275e]">
                        {displayTime(slot.endTime)}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm text-[#706559]">
                      <span>{fatherName} · {methodLabels[slot.meetingMethod]}</span>
                      <span className="font-semibold text-[#b47a13]">
                        {durationMinutes(slot.startTime, slot.endTime)} min
                      </span>
                    </div>
                    {slot.notes && (
                      <p className="mt-1 text-sm text-[#706559]">{slot.notes}</p>
                    )}
                    <div className="mt-3 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-xs text-[#8c96a8]">
                        <span className="h-2 w-2 rounded-full bg-[#8c96a8]" /> Available
                      </span>
                      <button
                        type="button"
                        disabled={submitting}
                        onClick={() => handleSelectSlot(slot)}
                        className="flex items-center gap-1 text-sm font-semibold text-[#b47a13] hover:text-[#8d6b22] disabled:opacity-50"
                      >
                        {submitting && selectedSlot?.id === slot.id ? (
                          <LoaderCircle className="h-4 w-4 animate-spin" />
                        ) : null}
                        Select this slot →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="mt-4 rounded-xl bg-[#fff0ec] p-3 text-center text-sm text-[#b85445]">
                {error}
              </div>
            )}
          </div>
        </div>

        <BottomNav />
      </main>
    );
  }

  // ─── Step: Confirmed ─────────────────────────────────────────────────────

  if (step === "confirmed" && confirmedData) {
    return (
      <main className="min-h-screen bg-[#fffaf1] px-3 pb-24 pt-4 text-[#0e265b] min-[480px]:px-5 min-[480px]:pt-7 sm:px-8 sm:pb-28">
        <div className="mx-auto max-w-[920px]">
          <header className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Go back"
              onClick={handleBackToAppointments}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e8c77e] bg-white text-[#0e265b] shadow-sm transition-colors hover:bg-[#fff8e9] min-[480px]:h-12 min-[480px]:w-12"
            >
              <ArrowLeft className="h-5 w-5 min-[480px]:h-6 min-[480px]:w-6" />
            </button>
            <h1 className="font-serif text-2xl font-bold text-[#10275e] min-[480px]:text-3xl">
              Confirmed
            </h1>
          </header>

          <p className="mt-6 text-center text-sm leading-relaxed text-[#5c6b8a] min-[480px]:text-base">
            Your <span className="font-bold text-[#10275e]">{confirmedData.reason}</span> appointment
            request for{" "}
            <span className="font-bold text-[#b47a13]">
              {displayDateLong(confirmedData.date)} at {displayTime(confirmedData.startTime)}
            </span>{" "}
            has been sent to <span className="font-bold text-[#10275e]">{confirmedData.fatherName}</span>.
          </p>

          {/* Details table */}
          <div className="mt-6 overflow-hidden rounded-[18px] border border-[#ead3a4]">
            <DetailRow label="Reason" value={confirmedData.reason} />
            <DetailRow label="Date" value={displayDateLong(confirmedData.date)} />
            <DetailRow
              label="Time"
              value={`${displayTime(confirmedData.startTime)} – ${displayTime(confirmedData.endTime)}`}
            />
            <DetailRow
              label="Duration"
              value={`${durationMinutes(confirmedData.startTime, confirmedData.endTime)} min`}
              highlight
            />
            <DetailRow label="Father" value={confirmedData.fatherName} />
            <DetailRow label="Status" value="Pending Review" status />
          </div>

          {/* Reminder */}
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-[#f0dab0] bg-[#fff8e9] px-4 py-3">
            <Bell className="h-5 w-5 shrink-0 text-[#b47a13]" />
            <p className="text-sm text-[#706559]">
              You will receive a reminder <span className="font-bold text-[#b47a13]">1 day before</span> your appointment.
            </p>
          </div>

          {/* Actions */}
          <button
            type="button"
            onClick={handleBackToAppointments}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-[20px] bg-[#10275e] px-6 py-4 font-serif text-base font-bold text-white shadow-[0_6px_15px_rgba(16,39,94,0.24)] transition-transform hover:-translate-y-0.5 min-[480px]:rounded-[24px] min-[480px]:py-5 min-[480px]:text-lg"
          >
            Back to Appointments
          </button>

          <button
            type="button"
            onClick={handleViewMyRequests}
            className="mt-3 flex w-full items-center justify-center gap-1 text-sm font-semibold text-[#10275e] hover:text-[#b47a13]"
          >
            View My Requests →
          </button>
        </div>

        <BottomNav />
      </main>
    );
  }

  // ─── Step: List (default) ────────────────────────────────────────────────

  return (
    <main className="min-h-screen bg-[#fffaf1] px-3 pb-24 pt-4 text-[#0e265b] min-[480px]:px-5 min-[480px]:pt-7 sm:px-8 sm:pb-28">
      <div className="mx-auto max-w-[920px]">
        {/* Back Header */}
        <header className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Go back"
            onClick={() => router.push("/child", { locale })}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e8c77e] bg-white text-[#0e265b] shadow-sm transition-colors hover:bg-[#fff8e9] min-[480px]:h-12 min-[480px]:w-12"
          >
            <ArrowLeft className="h-5 w-5 min-[480px]:h-6 min-[480px]:w-6" />
          </button>
          <h1 className="font-serif text-2xl font-bold text-[#10275e] min-[480px]:text-3xl">
            Appointments
          </h1>
        </header>

        {/* Tab Navigation */}
        <div className="mt-5 flex gap-6 border-b border-[#e8c77e]">
          {(["request", "my-requests", "history"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`border-b-2 pb-2.5 text-sm font-semibold transition-colors min-[480px]:text-base ${
                activeTab === tab
                  ? "border-[#10275e] text-[#10275e]"
                  : "border-transparent text-[#8c96a8] hover:text-[#5c6b8a]"
              }`}
            >
              {tabLabels[tab]}
            </button>
          ))}
        </div>

        {/* Request Tab Content */}
        {activeTab === "request" && (
          <div className="mt-5 space-y-5">
            <div className="rounded-[22px] border border-[#ead3a4] bg-[#fffdf8] p-5 shadow-[0_3px_8px_rgba(93,65,24,0.08)] min-[480px]:rounded-[28px] min-[480px]:p-6">
              <h2 className="font-serif text-xl font-bold text-[#10275e] min-[480px]:text-2xl">
                Request New Appointment
              </h2>
              <p className="mt-1 text-sm text-[#706559]">
                Choose the type of appointment you need
              </p>

              <div className="mt-5 grid grid-cols-2 gap-x-3 gap-y-4">
                {appointmentTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = selectedType === type.id;

                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setSelectedType(type.id)}
                      className={`flex items-start gap-3 rounded-xl border-l-4 p-3 text-left transition-all min-[480px]:p-4 ${
                        isSelected
                          ? "border-l-[#3b963e] bg-[#f0faf2]"
                          : "border-l-transparent hover:bg-[#fdfaf3]"
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${type.bg} ${type.color}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-serif text-sm font-bold leading-tight text-[#10275e] min-[480px]:text-base">
                          {type.title}
                        </p>
                        <p className="mt-0.5 text-xs leading-tight text-[#706559] min-[480px]:text-sm">
                          {type.description}
                        </p>
                      </div>
                      <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-[#b47a13]/60" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected indicator */}
            {selectedType && (
              <div className="flex items-center gap-2 rounded-xl bg-[#fffdf8] px-4 py-3 text-sm">
                <span className="h-3 w-3 rounded-full bg-[#b47a13]" />
                <span className="text-[#706559]">Selected:</span>
                <span className="font-semibold text-[#b47a13]">
                  {appointmentTypes.find((t) => t.id === selectedType)?.title}
                </span>
              </div>
            )}

            <button
              type="button"
              disabled={!selectedType}
              onClick={handleChooseDateTime}
              className="flex w-full items-center justify-center gap-3 rounded-[20px] bg-gradient-to-r from-[#ce9e35] to-[#a96f0d] px-6 py-4 font-serif text-base font-bold text-white shadow-[0_6px_15px_rgba(128,79,8,0.24)] transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 min-[480px]:rounded-[24px] min-[480px]:py-5 min-[480px]:text-lg"
            >
              <CalendarCheck className="h-5 w-5 min-[480px]:h-6 min-[480px]:w-6" />
              Choose Date & Time
            </button>
          </div>
        )}

        {/* My Requests Tab Content */}
        {activeTab === "my-requests" && (
          <div className="mt-5 space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <LoaderCircle className="h-8 w-8 animate-spin text-[#b47a13]" />
              </div>
            ) : error ? (
              <div className="rounded-[22px] border border-[#ead3a4] bg-[#fffdf8] p-6 text-center">
                <p className="text-sm text-[#b85445]">{error}</p>
              </div>
            ) : requests.length === 0 ? (
              <div className="flex min-h-[220px] items-center justify-center rounded-[22px] border border-[#ead3a4] bg-[#fffdf8] p-8 text-center">
                <div>
                  <CalendarClock className="mx-auto h-12 w-12 text-[#b47a13]/40" />
                  <p className="mt-4 font-serif text-lg font-bold text-[#10275e]">
                    No pending requests
                  </p>
                  <p className="mt-1 text-sm text-[#706559]">
                    Your appointment requests will appear here
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {requests.map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* History Tab Content */}
        {activeTab === "history" && (
          <div className="mt-5 space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <LoaderCircle className="h-8 w-8 animate-spin text-[#b47a13]" />
              </div>
            ) : error ? (
              <div className="rounded-[22px] border border-[#ead3a4] bg-[#fffdf8] p-6 text-center">
                <p className="text-sm text-[#b85445]">{error}</p>
              </div>
            ) : history.length === 0 ? (
              <div className="flex min-h-[220px] items-center justify-center rounded-[22px] border border-[#ead3a4] bg-[#fffdf8] p-8 text-center">
                <div>
                  <Calendar className="mx-auto h-12 w-12 text-[#b47a13]/40" />
                  <p className="mt-4 font-serif text-lg font-bold text-[#10275e]">
                    No appointment history
                  </p>
                  <p className="mt-1 text-sm text-[#706559]">
                    Your past appointments will appear here
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((appointment) => (
                  <HistoryCard key={appointment.id} appointment={appointment} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  );
}

// ─── Shared Sub-components ─────────────────────────────────────────────────

function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 rounded-t-[28px] border-t border-[#294579] bg-[radial-gradient(circle_at_5%_0%,rgba(124,148,202,0.15),transparent_25%),linear-gradient(120deg,#0d285e,#122f69)] px-2 py-3 text-[#c7cbe0] shadow-[0_-3px_12px_rgba(20,45,103,0.15)] min-[480px]:rounded-t-[40px] min-[480px]:px-5 min-[480px]:py-5">
      <div className="mx-auto grid max-w-[700px] grid-cols-4">
        <NavItem icon={<House className="h-7 w-7" />} label="Home" href="/child" />
        <NavItem active icon={<CalendarDays className="h-6 w-6" />} label="Appointments" href="/child/appointments" />
        <NavItem icon={<MessageCircle className="h-6 w-6" />} label="Messages" href="/child/messages" />
        <NavItem icon={<Cross className="h-6 w-6" />} label="Spiritual" href="/child/spiritual-dates" />
      </div>
    </nav>
  );
}

function NavItem({ active = false, icon, label, href }: { active?: boolean; icon: ReactNode; label: string; href: string }) {
  const router = useRouter();
  const locale = useLocale() as AppLocale;

  return (
    <button
      className={`flex min-w-0 flex-col items-center gap-1 border-r border-[#3d5484]/70 font-serif text-[10px] min-[480px]:text-sm ${active ? "text-[#e5a72e]" : "text-[#c7cbe0]"}`}
      type="button"
      onClick={() => router.push(href, { locale })}
    >
      {icon}
      {active && <span className="h-[3px] w-5 rounded-full bg-[#e5a72e]" />}
      {label}
    </button>
  );
}

function DetailRow({ label, value, highlight, status }: { label: string; value: string; highlight?: boolean; status?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-[#ead3a4] px-5 py-3.5 last:border-b-0">
      <span className="text-sm text-[#706559]">{label}</span>
      <span
        className={`text-sm font-semibold ${
          status
            ? "text-[#b47a13]"
            : highlight
              ? "text-[#b47a13]"
              : "text-[#10275e]"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function RequestCard({ request }: { request: AppointmentRequest }) {
  const type = appointmentTypes.find((t) => t.id === request.reason);

  return (
    <div className="flex items-center gap-3 rounded-[22px] border border-[#ead3a4] bg-[#fffdf8] px-4 py-4 shadow-[0_3px_8px_rgba(93,65,24,0.08)] min-[480px]:gap-4 min-[480px]:rounded-[28px] min-[480px]:px-5 min-[480px]:py-5">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#f0dab0] bg-[#fff8e9] text-[#b47a13] min-[480px]:h-14 min-[480px]:w-14">
        <CalendarClock className="h-6 w-6 min-[480px]:h-7 min-[480px]:w-7" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-serif text-lg font-bold min-[480px]:text-xl">{type?.title}</p>
        <p className="mt-0.5 text-sm text-[#706559]">
          {displayDateLong(request.requestedDate)} at {displayTime(request.requestedStartTime)}
        </p>
      </div>
      <span
        className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
          request.status === "PENDING"
            ? "bg-[#fff8e9] text-[#b47a13]"
            : request.status === "APPROVED"
              ? "bg-[#eef6e7] text-[#3b963e]"
              : "bg-[#fff0ec] text-[#b85445]"
        }`}
      >
        {request.status}
      </span>
    </div>
  );
}

function HistoryCard({ appointment }: { appointment: Appointment }) {
  const type = appointmentTypes.find((t) => t.id === appointment.reason);

  return (
    <div className="flex items-center gap-3 rounded-[22px] border border-[#ead3a4] bg-[#fffdf8] px-4 py-4 shadow-[0_3px_8px_rgba(93,65,24,0.08)] min-[480px]:gap-4 min-[480px]:rounded-[28px] min-[480px]:px-5 min-[480px]:py-5">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#f0dab0] bg-[#fff8e9] text-[#b47a13] min-[480px]:h-14 min-[480px]:w-14">
        <Calendar className="h-6 w-6 min-[480px]:h-7 min-[480px]:w-7" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-serif text-lg font-bold min-[480px]:text-xl">{type?.title}</p>
        <p className="mt-0.5 text-sm text-[#706559]">
          {displayDateLong(appointment.scheduleDate)} at {displayTime(appointment.startTime)}
        </p>
      </div>
      <span
        className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
          appointment.status === "COMPLETED"
            ? "bg-[#eef6e7] text-[#3b963e]"
            : appointment.status === "CANCELLED"
              ? "bg-[#fff0ec] text-[#b85445]"
              : "bg-[#fff8e9] text-[#b47a13]"
        }`}
      >
        {appointment.status}
      </span>
    </div>
  );
}
