"use client";

import {
  ArrowLeft,
  Bell,
  Calendar,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  CalendarPlus,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Cross,
  Pencil,
  Equal,
  House,
  LoaderCircle,
  MessageCircle,
  Moon,
  MoreHorizontal,
  Plus,
  Trash2,
  Sunrise,
  Users,
} from "lucide-react";
import { useLocale } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useRouter } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { ChildBottomNav, ChildTopBar } from "@/components/dashboard/child-navigation";
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
    icon: Plus,
    color: "text-[#b47a13]",
    bg: "bg-[#fff8e9]",
  },
  {
    id: "counseling" as AppointmentReason,
    title: "Counseling",
    description: "Personal or emotional support",
    icon: Plus,
    color: "text-[#0d9488]",
    bg: "bg-[#ecfdf5]",
  },
  {
    id: "repentance" as AppointmentReason,
    title: "Repentance",
    description: "Seeking spiritual renewal",
    icon: Plus,
    color: "text-[#dc6843]",
    bg: "bg-[#fff3ee]",
  },
  {
    id: "family-issue" as AppointmentReason,
    title: "Family Issue",
    description: "Family problems and relationships",
    icon: Plus,
    color: "text-[#dc6843]",
    bg: "bg-[#fff3ee]",
  },
  {
    id: "other" as AppointmentReason,
    title: "Other",
    description: "Other reason not listed above",
    icon: Plus,
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

function sessionLabel(time: string) {
  return Number(time.split(":")[0]) < 12 ? "Morning session" : "Afternoon session";
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
  const [pendingDelete, setPendingDelete] = useState<AppointmentRequest | null>(null);

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

  // Every remaining scheduled date, from the selected day through the last
  // availability entry, for the time-picker date tabs.
  const nearbyDates = useMemo(() => {
    if (!selectedDate) return [];
    const allDates = [...datesWithSlots].sort();
    const idx = allDates.indexOf(selectedDate);
    return idx >= 0 ? allDates.slice(idx) : allDates;
  }, [selectedDate, datesWithSlots]);

  // ─── Actions ─────────────────────────────────────────────────────────────

  const handleChooseDateTime = () => {
    if (!selectedType) return;
    setStep("select-date");
  };

  const handleDateSelected = (dateStr: string) => {
    setSelectedDate(dateStr);
  };

  const handleSelectSlot = (slot: Slot) => {
    setSelectedSlot(slot);
  };

  const handleConfirmSlot = async () => {
    if (!selectedType || !selectedSlot) return;
    const slot = selectedSlot;

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
          fatherName: slots.length ? fatherName : "Abba Yohannes",
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

  const removeRequest = async (request: AppointmentRequest, edit = false) => {
    const response = await fetch(`/api/appointments/request/${request.id}`, { method: "DELETE" });
    if (!response.ok) { const data = await response.json(); setError(data.error || "Unable to remove request"); return; }
    setRequests((current) => current.filter((item) => item.id !== request.id));
    if (edit) { setSelectedType(request.reason); setSelectedDate(request.requestedDate); setActiveTab("request"); setStep("select-date"); }
  };

  // ─── Step: Select Date ───────────────────────────────────────────────────

  if (step === "select-date") {
    const selectedTypeData = appointmentTypes.find((t) => t.id === selectedType);
    const TypeIcon = selectedTypeData?.icon || Calendar;

    return (
      <main className="min-h-dvh bg-[#fffbf2] px-5 pb-28 pt-7 font-sans text-[#243453] sm:px-8 md:px-10 xl:mx-auto xl:max-w-[1280px] xl:pb-10 xl:pt-9">
        <div className="mx-auto max-w-[920px]">
          <ChildTopBar title="Select Date" />
          <header className="mt-5 flex items-center xl:mt-0">
            <div className="ml-auto flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#10275e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#b47a13]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#d4d4d8]" />
            </div>
          </header>

          {/* Selected type badge */}
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-[#ead3a4] bg-[#fff8e9] px-4 py-3 sm:px-5">
            <div className={`flex h-9 w-9 items-center justify-center rounded-full ${selectedTypeData?.bg} ${selectedTypeData?.color}`}>
              <TypeIcon className="h-4 w-4" />
            </div>
            <span className="font-medium text-[#1d2859]">{selectedTypeData?.title}</span>
            <button
              type="button"
              onClick={() => setStep("list")}
              className="ml-auto text-sm font-medium text-[#173461] hover:text-[#b47a13]"
            >
              Change
            </button>
          </div>

          {/* Calendar */}
          <div className="mt-5 rounded-[22px] border border-[#ead3a4] bg-[#fffdf8] p-4 shadow-[0_3px_8px_rgba(93,65,24,0.08)] sm:rounded-[28px] sm:p-6 md:p-8">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e8c77e] text-[#10275e] hover:bg-[#fff8e9]"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <h2 className="text-lg font-medium text-[#173461]">{displayMonth(month)}</h2>
              <button
                type="button"
                onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e8c77e] text-[#10275e] hover:bg-[#fff8e9]"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-7 text-center text-xs font-medium text-[#5c6b8a]">
              {weekdays.map((wd) => (
                <div key={wd} className="py-2">{wd}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 text-center text-sm md:text-base">
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
                    className={`relative mx-auto my-1 flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-colors sm:h-11 sm:w-11 md:h-12 md:w-12 ${
                      isSelected
                        ? "bg-[#10275e] text-white"
                        : isToday
                          ? "cursor-pointer border border-[#b47a13] text-[#b47a13] hover:bg-[#fff8e9]"
                          : isPast
                            ? "cursor-not-allowed text-[#d4d4d8]"
                            : hasSlots
                              ? "cursor-pointer text-[#10275e] hover:bg-[#e8d7b3]"
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
            disabled={!selectedDate}
            onClick={() => selectedDate && setStep("select-time")}
            className="mt-5 flex w-full items-center justify-center rounded-[18px] bg-[#b9903e] px-6 py-4 text-base font-medium text-white shadow-[0_6px_15px_rgba(128,79,8,0.24)] transition-colors hover:bg-[#a98437] disabled:opacity-70 disabled:hover:bg-[#b9903e] sm:py-5 sm:text-lg"
          >
            Select a Date
          </button>
        </div>

        <ChildBottomNav active="appointments" />
      </main>
    );
  }

  // ─── Step: Select Time ───────────────────────────────────────────────────

  if (step === "select-time" && selectedDate) {
    const selectedTypeData = appointmentTypes.find((t) => t.id === selectedType);
    const TypeIcon = selectedTypeData?.icon || Calendar;
    const visibleSlots = slots;
    const visibleDates = nearbyDates;
    const visibleSlotsForDate = visibleSlots.filter((slot) => slot.date === selectedDate);
    const displayFatherName = fatherName;

    return (
      <main className="min-h-dvh bg-[#fffbf2] px-5 pb-28 pt-7 font-sans text-[#243453] sm:px-8 md:px-10 xl:mx-auto xl:max-w-[1280px] xl:pb-10 xl:pt-9">
        <div className="mx-auto max-w-[920px]">
          <ChildTopBar title="Select Time" />
          <header className="mt-5 flex items-center xl:mt-0">
            <div className="ml-auto flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#10275e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#10275e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#b47a13]" />
            </div>
          </header>

          {/* Selected type + date badge */}
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-[#ead3a4] bg-[#fff8e9] px-4 py-3 sm:px-5">
            <div className={`flex h-9 w-9 items-center justify-center rounded-full ${selectedTypeData?.bg} ${selectedTypeData?.color}`}>
              <TypeIcon className="h-4 w-4" />
            </div>
            <div>
              <span className="font-medium text-[#1d2859]">{selectedTypeData?.title}</span>
              <p className="text-xs font-medium text-[#6e7891]">{displayDateLong(selectedDate)}</p>
            </div>
            <button
              type="button"
              onClick={() => setStep("select-date")}
              className="ml-auto text-sm font-medium text-[#173461] hover:text-[#b47a13]"
            >
              Change date
            </button>
          </div>

          {/* Day tabs */}
          <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
            {visibleDates.map((d) => {
              const isActive = d === selectedDate;
              const daySlots = visibleSlots.filter((s) => s.date === d);
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
              <p className="text-base font-medium text-[#173461]">
                {visibleSlotsForDate.length} slots available
              </p>
              <p className="text-sm text-[#b47a13]">{displayFatherName}</p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <LoaderCircle className="h-8 w-8 animate-spin text-[#b47a13]" />
              </div>
            ) : visibleSlotsForDate.length === 0 ? (
              <div className="mt-8 flex min-h-[190px] flex-col items-center justify-center text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#fff1d6] text-[#b47a13]"><CalendarClock className="h-7 w-7" /></span>
                <p className="mt-4 text-base font-medium text-[#6e7891]">No available slots for this date</p>
                <p className="mt-1 text-sm text-[#9aa2b1]">Please choose another scheduled day.</p>
              </div>
            ) : (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {visibleSlotsForDate.map((slot) => (
                  <div
                    key={slot.id}
                    className={`rounded-[22px] border bg-[#fffdf8] p-5 shadow-[0_3px_8px_rgba(93,65,24,0.08)] transition-colors ${selectedSlot?.id === slot.id ? "border-[3px] border-[#173461]" : "border-[#ead3a4]"}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-medium text-[#173461]">
                        {displayTime(slot.startTime)}
                      </span>
                      <span className="text-[#b47a13]">+</span>
                      <span className="text-xl font-medium text-[#173461]">
                        {displayTime(slot.endTime)}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm text-[#706559]">
                      <span>{sessionLabel(slot.startTime)} · {slot.meetingMethod.replace("-", " ")}</span>
                      <span className="font-semibold text-[#b47a13]">
                        {durationMinutes(slot.startTime, slot.endTime)} min
                      </span>
                    </div>
                    {slot.notes && (
                      <p className="mt-1 text-sm text-[#706559]">{slot.notes}</p>
                    )}
                    <div className="mt-3 flex items-center justify-between">
                      <span className={`flex items-center gap-1.5 text-xs ${selectedSlot?.id === slot.id ? "text-[#159447]" : "text-[#8c96a8]"}`}>
                        <span className={`h-2 w-2 rounded-full ${selectedSlot?.id === slot.id ? "bg-[#22c55e]" : "bg-[#8c96a8]"}`} /> {selectedSlot?.id === slot.id ? "Selected" : "Available"}
                      </span>
                      <button
                        type="button"
                        disabled={submitting}
                        onClick={() => handleSelectSlot(slot)}
                        className="flex items-center gap-1 text-sm font-medium text-[#b47a13] hover:text-[#8d6b22] disabled:opacity-50"
                      >
                        {submitting && selectedSlot?.id === slot.id ? (
                          <LoaderCircle className="h-4 w-4 animate-spin" />
                        ) : null}
                        {selectedSlot?.id === slot.id ? "Tap confirm →" : "Select →"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              disabled={!selectedSlot || submitting}
              onClick={() => selectedSlot && void handleConfirmSlot()}
              className={`mt-5 flex w-full items-center justify-center gap-2 rounded-[18px] px-6 py-4 text-base font-medium text-white shadow-[0_6px_15px_rgba(23,52,97,.18)] transition-colors ${selectedSlot ? "bg-[#173461] hover:bg-[#102b55]" : "bg-[#c9b28d]"}`}
            >
              <CalendarPlus className="h-5 w-5" />
              {submitting ? "Sending request..." : selectedSlot ? `Confirm — ${displayTime(selectedSlot.startTime)}` : "Select a Time Slot"}
            </button>

            {error && (
              <div className="mt-4 rounded-xl bg-[#fff0ec] p-3 text-center text-sm text-[#b85445]">
                {error}
              </div>
            )}
          </div>
        </div>

        <ChildBottomNav active="appointments" />
      </main>
    );
  }

  // ─── Step: Confirmed ─────────────────────────────────────────────────────

  if (step === "confirmed" && confirmedData) {
    return (
      <main className="min-h-dvh bg-[#fffbf2] px-5 pb-28 pt-7 font-sans text-[#243453] sm:px-8 md:px-10 xl:mx-auto xl:max-w-[1280px] xl:pb-10 xl:pt-9">
        <div className="mx-auto max-w-[920px]">
          <ChildTopBar title="Appointments" />
          <div className="mt-7 text-center">
            <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#dcfce7] text-[#16a34a]"><CheckCircle2 className="h-11 w-11" /></span>
            <h1 className="mt-5 text-2xl font-semibold text-[#173461]">Request Submitted!</h1>
          </div>

          <p className="mt-4 text-center text-sm leading-relaxed text-[#5c6b8a] sm:text-base">
            Your <span className="font-semibold text-[#10275e]">{confirmedData.reason}</span> appointment
            request for{" "}
            <span className="font-semibold text-[#b47a13]">
              {displayDateLong(confirmedData.date)} at {displayTime(confirmedData.startTime)}
            </span>{" "}has been sent to <span className="font-semibold text-[#10275e]">{confirmedData.fatherName}</span>.
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
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-[#bfdbfe] bg-[#eff6ff] px-4 py-3">
            <Bell className="h-5 w-5 shrink-0 text-[#2563eb]" />
            <p className="text-sm text-[#1d4ed8]">
              You will receive a reminder <span className="font-semibold">1 day before</span> your appointment.
            </p>
          </div>

          {/* Actions */}
          <button
            type="button"
            onClick={handleBackToAppointments}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-[18px] bg-[#173461] px-6 py-4 text-base font-medium text-white shadow-[0_6px_15px_rgba(16,39,94,0.24)] transition-transform hover:-translate-y-0.5 sm:py-5 sm:text-lg"
          >
            Back to Appointments
          </button>

          <button
            type="button"
            onClick={handleViewMyRequests}
            className="mt-3 flex w-full items-center justify-center gap-1 text-sm font-medium text-[#b47a13] hover:text-[#8d6b22]"
          >
            View My Requests →
          </button>
        </div>

        <ChildBottomNav active="appointments" />
      </main>
    );
  }

  // ─── Step: List (default) ────────────────────────────────────────────────

  return (
    <main className="min-h-dvh bg-[#fffbf2] px-5 pb-28 pt-7 font-sans text-[#243453] sm:px-8 md:px-10 xl:mx-auto xl:max-w-[1280px] xl:pb-10 xl:pt-9">
      <div className="mx-auto max-w-[1120px]">
        <ChildTopBar title="Appointments" />
        <header className="hidden items-center justify-between border-b border-[#eadfca] pb-6 xl:flex"><div><p className="text-xs font-black uppercase tracking-[.16em] text-[#c99d40]">Spiritual child portal</p><h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#173461]">Appointments</h1></div><div className="relative"><Bell className="h-7 w-7 text-[#243453]" /><span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full border border-white bg-[#aa1f27]" /></div></header>

        {/* Tab Navigation */}
        <div className="mt-7 flex gap-8 border-b border-[#e8c77e] sm:gap-10">
          {(["request", "my-requests", "history"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`border-b-2 pb-3 text-sm transition-colors min-[480px]:text-base ${
                activeTab === tab
                  ? "border-[#10275e] font-medium text-[#10275e]"
                  : "border-transparent font-medium text-[#8c96a8] hover:text-[#5c6b8a]"
              }`}
            >
              {tabLabels[tab]}
            </button>
          ))}
        </div>

        {/* Request Tab Content */}
        {activeTab === "request" && (
          <div className="mt-6 space-y-5">
            <div className="rounded-[24px] border border-[#eadfca] bg-[#fffdf8] p-5 shadow-[0_8px_24px_rgba(42,48,59,.08)] sm:p-7">
              <h2 className="text-2xl font-medium tracking-tight text-[#173461] sm:text-3xl">What would you like to discuss?</h2>
              <p className="mt-2 text-sm font-medium text-[#6e7891] sm:text-base">Select one reason and we’ll show the available times with your spiritual father.</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {appointmentTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = selectedType === type.id;

                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setSelectedType(type.id)}
                      className={`group flex items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
                        isSelected
                          ? "border-[#c99d40] bg-[#fff8e9] shadow-[0_7px_18px_rgba(201,157,64,.14)]"
                          : "border-[#eee6d8] bg-white hover:-translate-y-0.5 hover:border-[#dfc488] hover:shadow-[0_7px_18px_rgba(42,48,59,.08)]"
                      }`}
                    >
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] ${type.bg} ${type.color}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-base font-bold leading-tight text-[#1d2859]">
                          {type.title}
                        </p>
                        <p className="mt-0.5 text-sm font-medium leading-tight text-[#6e7891]">
                          {type.description}
                        </p>
                      </div>
                      <ChevronRight className={`mt-0.5 h-5 w-5 shrink-0 ${isSelected ? "text-[#b47a13]" : "text-[#9ba4b5]"}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedType && (
              <div className="flex items-center gap-2 rounded-xl border border-[#eadfca] bg-white px-4 py-3 text-sm">
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
              className="flex w-full items-center justify-center gap-3 rounded-[18px] bg-[#b9903e] px-6 py-4 text-base font-medium text-white shadow-[0_8px_18px_rgba(185,144,62,.22)] transition-transform hover:-translate-y-0.5 hover:bg-[#a98437] disabled:opacity-60 disabled:hover:translate-y-0 sm:py-5 sm:text-lg"
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
                  <RequestCard key={request.id} request={request} onDelete={() => setPendingDelete(request)} onEdit={() => void removeRequest(request, true)} />
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

      <ChildBottomNav active="appointments" />
      {pendingDelete ? <div className="fixed inset-0 z-[70] flex items-center justify-center px-5"><button aria-label="Close delete confirmation" className="absolute inset-0 bg-[#08152d]/50" onClick={() => setPendingDelete(null)} type="button" /><section aria-modal="true" className="relative w-full max-w-sm rounded-3xl bg-[#fffdf8] p-6 text-center shadow-2xl" role="dialog"><Trash2 className="mx-auto h-8 w-8 text-[#b85445]" /><h2 className="mt-4 text-xl font-medium text-[#173461]">Delete this request?</h2><p className="mt-2 text-sm text-[#6e7891]">Are you sure you want to delete your request?</p><div className="mt-6 grid grid-cols-2 gap-3"><button className="rounded-xl border border-[#e4d5bb] py-3 text-sm font-medium text-[#53617c]" onClick={() => setPendingDelete(null)} type="button">No</button><button className="rounded-xl bg-[#b85445] py-3 text-sm font-medium text-white" onClick={() => { void removeRequest(pendingDelete); setPendingDelete(null); }} type="button">Yes, delete</button></div></section></div> : null}
    </main>
  );
}

// ─── Shared Sub-components ─────────────────────────────────────────────────

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

function RequestCard({ request, onDelete, onEdit }: { request: AppointmentRequest; onDelete: () => void; onEdit: () => void }) {
  const type = appointmentTypes.find((t) => t.id === request.reason);

  return (
    <div className="flex items-center gap-3 rounded-[18px] border border-[#ead3a4] bg-[#fffdf8] px-3.5 py-3 shadow-[0_3px_8px_rgba(93,65,24,0.08)]">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#f0dab0] bg-[#fff8e9] text-[#b47a13]">
        <CalendarClock className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-base font-medium text-[#173461]">{type?.title}</p>
        <p className="mt-0.5 text-xs font-medium text-[#706559] sm:text-sm">
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
      {request.status === "PENDING" ? <span className="flex shrink-0 gap-1"><button aria-label="Edit request" className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#ead3a4] text-[#b47a13] hover:bg-[#fff8e9]" onClick={onEdit} type="button"><Pencil className="h-4 w-4" /></button><button aria-label="Delete request" className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#f1d3cf] text-[#b85445] hover:bg-[#fff0ec]" onClick={onDelete} type="button"><Trash2 className="h-4 w-4" /></button></span> : null}
    </div>
  );
}

function HistoryCard({ appointment }: { appointment: Appointment }) {
  const type = appointmentTypes.find((t) => t.id === appointment.reason);

  return (
    <div className="flex items-center gap-3 rounded-[18px] border border-[#ead3a4] bg-[#fffdf8] px-3.5 py-3 shadow-[0_3px_8px_rgba(93,65,24,0.08)]">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#f0dab0] bg-[#fff8e9] text-[#b47a13]">
        <Calendar className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-base font-medium text-[#173461]">{type?.title}</p>
        <p className="mt-0.5 text-xs font-medium text-[#706559] sm:text-sm">
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
