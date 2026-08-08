"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarCheck2,
  CalendarClock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Plus,
  Search,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type {
  AppointmentStatus,
  FatherAppointmentListItem,
  FatherAppointmentsResponse,
} from "@/contracts/appointment";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 8;
const tabs = [
  "All Appointments",
  "Upcoming",
  "Completed",
  "Canceled",
] as const;

const typeLabels: Record<string, string> = {
  confession: "Confession",
  counseling: "Counseling",
  repentance: "Repentance",
  "spiritual-guidance": "Spiritual Guidance",
  "family-issue": "Family Issues",
  other: "Other",
};

type AppointmentTab = (typeof tabs)[number];
type AppointmentAction = "COMPLETE" | "CANCEL" | "REOPEN";
type CanonTaskDraft = { id: string; isSelected: boolean; guidance: string };

function formatDateParts(value: string) {
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T00:00:00`)
    : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return { day: "--", month: "Date", weekday: "" };
  }

  return {
    day: new Intl.DateTimeFormat("en-US", { day: "numeric" }).format(date),
    month: new Intl.DateTimeFormat("en-US", { month: "short" }).format(date),
    weekday: new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date),
  };
}

function formatTime(value: string) {
  const [hourText = "0", minute = "00"] = value.split(":");
  const hour = Number(hourText);
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${minute} ${suffix}`;
}

function isToday(scheduleDate: string) {
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  return scheduleDate.slice(0, 10) === today;
}

function statusLabel(appointment: FatherAppointmentListItem) {
  switch (appointment.status) {
    case "CONFIRMED":
      return isToday(appointment.scheduleDate) ? "Today" : "Upcoming";
    case "COMPLETED":
      return "Completed";
    case "CANCELLED":
      return "Canceled";
    case "NO_SHOW":
      return "No show";
    case "RESCHEDULED":
      return "Rescheduled";
  }
}

function statusVariant(status: AppointmentStatus) {
  switch (status) {
    case "CONFIRMED": return "warning" as const;
    case "COMPLETED": return "success" as const;
    case "CANCELLED": return "danger" as const;
    case "RESCHEDULED": return "info" as const;
    case "NO_SHOW": return "neutral" as const;
  }
}

function typeVariant(reason: string) {
  if (reason === "spiritual-guidance") return "success" as const;
  if (reason === "family-issue") return "danger" as const;
  if (reason === "repentance") return "info" as const;
  if (reason === "confession" || reason === "counseling") return "violet" as const;
  return "warning" as const;
}

function tabMatches(appointment: FatherAppointmentListItem, tab: AppointmentTab) {
  if (tab === "All Appointments") return true;
  if (tab === "Upcoming") return appointment.status === "CONFIRMED";
  if (tab === "Completed") return appointment.status === "COMPLETED";
  return appointment.status === "CANCELLED";
}

export function AppointmentsView() {
  const [appointments, setAppointments] = useState<FatherAppointmentListItem[]>([]);
  const [activeTab, setActiveTab] = useState<AppointmentTab>("All Appointments");
  const [searchText, setSearchText] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingAppointmentId, setUpdatingAppointmentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [canonAppointment, setCanonAppointment] = useState<FatherAppointmentListItem | null>(null);
  const [canonTasks, setCanonTasks] = useState<CanonTaskDraft[]>([]);
  const [fethaDate, setFethaDate] = useState("");
  const [fethaTime, setFethaTime] = useState("");
  const [canonError, setCanonError] = useState<string | null>(null);
  const [isSavingCanon, setIsSavingCanon] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const loadAppointments = async () => {
      try {
        const response = await fetch("/api/appointments", { cache: "no-store" });
        const body = (await response.json()) as FatherAppointmentsResponse | { error?: string };
        if (!response.ok) {
          throw new Error("error" in body ? body.error ?? "Unable to load appointments." : "Unable to load appointments.");
        }
        if (!cancelled) setAppointments((body as FatherAppointmentsResponse).appointments);
      } catch (loadError: unknown) {
        if (!cancelled) setError(loadError instanceof Error ? loadError.message : "Unable to load appointments.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    void loadAppointments();
    return () => { cancelled = true; };
  }, []);

  const typeOptions = useMemo(() => [
    "All Types",
    ...Array.from(new Set(appointments.map((appointment) => typeLabels[appointment.reason] ?? appointment.reason))).sort(),
  ], [appointments]);

  const filteredAppointments = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    return appointments.filter((appointment) => {
      const type = typeLabels[appointment.reason] ?? appointment.reason;
      return tabMatches(appointment, activeTab)
        && (selectedType === "All Types" || type === selectedType)
        && (!query || [appointment.childName, appointment.childPhone ?? "", type]
          .some((value) => value.toLowerCase().includes(query)));
    });
  }, [activeTab, appointments, searchText, selectedType]);

  const stats = useMemo(() => [
    { icon: CalendarClock, label: "Total Appointments", value: appointments.length },
    { icon: CalendarCheck2, label: "Upcoming", value: appointments.filter((item) => item.status === "CONFIRMED").length },
    { icon: Clock3, label: "Completed", value: appointments.filter((item) => item.status === "COMPLETED").length },
    { icon: CheckCircle2, label: "Canceled", value: appointments.filter((item) => item.status === "CANCELLED").length },
  ], [appointments]);

  const totalPages = Math.max(1, Math.ceil(filteredAppointments.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const visibleAppointments = filteredAppointments.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const firstShown = filteredAppointments.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const lastShown = Math.min(safePage * PAGE_SIZE, filteredAppointments.length);

  useEffect(() => { setCurrentPage(1); }, [activeTab, searchText, selectedType]);

  const updateAppointment = async (appointment: FatherAppointmentListItem, action: AppointmentAction) => {
    if (updatingAppointmentId) return;
    setUpdatingAppointmentId(appointment.id);
    setError(null);
    try {
      const response = await fetch(`/api/appointments/${appointment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const body = (await response.json()) as { appointment?: { id: string; status: AppointmentStatus }; error?: string };
      if (!response.ok || !body.appointment) throw new Error(body.error ?? "Unable to update the appointment.");
      setAppointments((items) => items.map((item) => item.id === body.appointment?.id ? { ...item, status: body.appointment.status } : item));
      setActiveTab(action === "COMPLETE" ? "Completed" : action === "CANCEL" ? "Canceled" : "Upcoming");
    } catch (updateError: unknown) {
      setError(updateError instanceof Error ? updateError.message : "Unable to update the appointment.");
    } finally {
      setUpdatingAppointmentId(null);
    }
  };

  const openCanonDialog = (appointment: FatherAppointmentListItem) => {
    setCanonAppointment(appointment);
    setCanonTasks([
      { id: "first-guidance", isSelected: true, guidance: "" },
    ]);
    setFethaDate(appointment.scheduleDate.slice(0, 10));
    setFethaTime("");
    setCanonError(null);
  };

  const closeCanonDialog = () => {
    if (!isSavingCanon) {
      setCanonAppointment(null);
      setCanonError(null);
    }
  };

  const saveCanon = async () => {
    if (!canonAppointment || isSavingCanon) return;

    const tasks = canonTasks
      .filter((task) => task.isSelected)
      .map((task) => task.guidance.trim())
      .filter(Boolean);

    if (tasks.length === 0 || !fethaDate || !fethaTime) {
      setCanonError("Add at least one guidance item and choose the Fetha date and time.");
      return;
    }

    setIsSavingCanon(true);
    setCanonError(null);
    try {
      const response = await fetch("/api/canons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: canonAppointment.id,
          tasks,
          fethaDate,
          fethaTime,
        }),
      });
      const body = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(body.error ?? "Unable to save the canon.");
      }
      setCanonAppointment(null);
    } catch (saveError: unknown) {
      setCanonError(saveError instanceof Error ? saveError.message : "Unable to save the canon.");
    } finally {
      setIsSavingCanon(false);
    }
  };

  return (
    <>
      <section className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="group relative min-h-[174px] overflow-hidden rounded-[24px] border border-[#ebe5d9] bg-[#fdfcf9] px-7 py-6 shadow-[0_10px_30px_rgba(26,38,67,0.07)]">
            <div className="pointer-events-none absolute -right-12 -top-14 h-32 w-32 rounded-full bg-[#d7b04d]/[0.07]" />
            <div className="relative z-10">
              <div className="flex h-[58px] w-[58px] items-center justify-center rounded-[18px] bg-[#ddb84f] text-[#18335f] shadow-[0_7px_16px_rgba(205,163,58,0.24)]"><Icon className="h-7 w-7" strokeWidth={1.9} /></div>
              <p className="mt-6 text-[42px] font-extrabold leading-none tracking-tight text-[#17223f]">{value}</p>
              <p className="mt-3 text-[18px] font-bold text-[#263453]">{label}</p>
            </div>
          </div>
        ))}
      </section>

      <div className="mt-6">
        <Card className="rounded-[26px] border border-[#ebe5d9] bg-[#fdfcf9] shadow-[0_12px_32px_rgba(26,38,67,0.07)]">
          <CardContent className="p-0">
            <div className="grid grid-cols-2 border-b border-[#ebe5d9] text-sm font-bold text-[#6b7695] md:grid-cols-4">
              {tabs.map((tab) => <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={cn("border-b-2 px-4 py-5 text-center transition-colors", activeTab === tab ? "border-[#b99645] text-[#a47e2d]" : "border-transparent hover:text-[#1d2859]")}>{tab}</button>)}
            </div>
            <div className="p-4 sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row">
                <label className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-[#e7dfcf] bg-[#fffdf9] px-4 py-3 text-[#7b86a7]">
                  <Search className="h-5 w-5 shrink-0" />
                  <input className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#33415f] outline-none placeholder:text-[#7b86a7]" onChange={(event) => setSearchText(event.target.value)} placeholder="Search by name or phone..." value={searchText} />
                </label>
                <select aria-label="Filter appointments by type" className="rounded-2xl border border-[#e7dfcf] bg-[#fffdf9] px-4 py-3 text-sm font-semibold text-[#4c5678] outline-none" onChange={(event) => setSelectedType(event.target.value)} value={selectedType}>
                  {typeOptions.map((type) => <option key={type}>{type}</option>)}
                </select>
              </div>
              {error ? <div className="mt-4 rounded-2xl border border-[#f1c7c4] bg-[#fff5f4] px-4 py-3 text-sm font-semibold text-[#b7443e]">{error}</div> : null}
              <div className="mt-6 overflow-x-auto border border-[#ebe5d9]">
                <div className="min-w-[900px]">
                  <div className="grid grid-cols-[1.2fr_1.6fr_1.1fr_1fr_270px] items-center gap-4 border-b border-[#eee9df] bg-[#faf8f3] px-7 py-4 text-[13px] font-extrabold uppercase tracking-[0.06em] text-[#7b8499]"><p>Date &amp; Time</p><p>Spiritual Child</p><p>Type</p><p>Status</p><p className="text-right">Actions</p></div>
                  <div className="divide-y divide-[#f0ece4] bg-white">
                    {isLoading ? <p className="px-7 py-14 text-center text-sm font-semibold text-[#7b8499]">Loading appointments...</p> : visibleAppointments.length === 0 ? <p className="px-7 py-14 text-center text-sm font-semibold text-[#7b8499]">No appointments match the selected filters.</p> : visibleAppointments.map((appointment) => {
                      const date = formatDateParts(appointment.scheduleDate);
                      const type = typeLabels[appointment.reason] ?? appointment.reason;
                      const isUpdating = updatingAppointmentId === appointment.id;
                      return <div key={appointment.id} className="grid grid-cols-[1.2fr_1.6fr_1.1fr_1fr_270px] items-center gap-4 px-7 py-4 transition-colors hover:bg-[#fcfaf6]">
                        <div className="flex items-center gap-3"><div className="flex h-14 w-14 flex-col items-center justify-center rounded-[16px] bg-[#f7f2e8] text-center"><span className="text-xs font-bold uppercase tracking-wide text-[#7b86a7]">{date.month}</span><span className="text-xl font-extrabold leading-none text-[#1d2859]">{date.day}</span><span className="text-xs font-semibold text-[#7b86a7]">{date.weekday}</span></div><p className="text-sm font-extrabold text-[#1d2859]">{formatTime(appointment.startTime)}</p></div>
                        <div className="min-w-0"><p className="truncate text-[15px] font-extrabold text-[#1d2859]">{appointment.childName}</p>{appointment.childPhone ? <p className="mt-1 text-sm font-medium text-[#8992a7]">{appointment.childPhone}</p> : null}</div>
                        <Badge variant={typeVariant(appointment.reason)} className="w-fit rounded-full px-3 py-1">{type}</Badge>
                        <Badge variant={statusVariant(appointment.status)} className="w-fit rounded-full px-3 py-1">{statusLabel(appointment)}</Badge>
                        <div className="flex justify-end gap-2">{appointment.status === "CONFIRMED" ? <><button className="rounded-[10px] bg-[#d4ab4f] px-3 py-2 text-xs font-bold text-white hover:bg-[#c49b3f] disabled:opacity-60" disabled={isUpdating} onClick={() => void updateAppointment(appointment, "COMPLETE")} type="button">Complete</button><button className="rounded-[10px] border border-[#e67670] bg-white px-3 py-2 text-xs font-bold text-[#cf4f48] hover:bg-[#fff4f3] disabled:opacity-60" disabled={isUpdating} onClick={() => void updateAppointment(appointment, "CANCEL")} type="button">Cancel</button></> : appointment.status === "COMPLETED" ? <><button className="rounded-[10px] border border-[#d7c391] bg-white px-3 py-2 text-xs font-bold text-[#9b7525] hover:bg-[#faf4e5]" onClick={() => openCanonDialog(appointment)} type="button">{appointment.reason === "confession" ? "Add Canon" : "Add Guide"}</button><button className="rounded-[10px] border border-[#d7c391] bg-white px-3 py-2 text-xs font-bold text-[#9b7525] hover:bg-[#faf4e5] disabled:opacity-60" disabled={isUpdating} onClick={() => void updateAppointment(appointment, "REOPEN")} type="button">Restore to Upcoming</button></> : appointment.status === "CANCELLED" ? <button className="rounded-[10px] border border-[#d7c391] bg-white px-3 py-2 text-xs font-bold text-[#9b7525] hover:bg-[#faf4e5] disabled:opacity-60" disabled={isUpdating} onClick={() => void updateAppointment(appointment, "REOPEN")} type="button">Restore to Upcoming</button> : <span className="text-sm font-semibold text-[#8a93a7]">No actions</span>}</div>
                      </div>;
                    })}
                  </div>
                </div>
              </div>
              <div className="mt-5 flex flex-col gap-4 text-sm font-semibold text-[#4c5678] sm:flex-row sm:items-center sm:justify-between"><p>Showing {firstShown} to {lastShown} of {filteredAppointments.length} appointments</p><div className="flex items-center gap-2 self-start sm:self-auto"><button aria-label="Previous page" className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e7dfcf] bg-[#fffdf9] text-[#7d86a7] disabled:opacity-40" disabled={safePage <= 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} type="button"><ChevronLeft className="h-4 w-4" /></button><span className="flex h-10 min-w-10 items-center justify-center rounded-xl bg-[#b99645] px-3 text-sm font-bold text-white">{safePage}</span><button aria-label="Next page" className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e7dfcf] bg-[#fffdf9] text-[#4c5678] disabled:opacity-40" disabled={safePage >= totalPages} onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} type="button"><ChevronRight className="h-4 w-4" /></button></div></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {canonAppointment ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <button
            aria-label="Close add canon dialog"
            className="absolute inset-0 bg-[#17223f]/45 backdrop-blur-sm"
            onClick={closeCanonDialog}
            type="button"
          />
          <div
            aria-labelledby="canon-dialog-title"
            aria-modal="true"
            className="relative z-10 max-h-[calc(100vh-2rem)] w-full max-w-[600px] overflow-y-auto rounded-[24px] border border-[#eee4d4] bg-white p-6 shadow-[0_24px_64px_rgba(23,34,63,0.22)]"
            role="dialog"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="canon-dialog-title" className="text-2xl font-extrabold text-[#1d2b51]">Add Canon</h2>
                <p className="mt-2 text-sm font-medium text-[#6d7892]">Guidance for <span className="font-extrabold text-[#1d2b51]">{canonAppointment.childName}</span></p>
              </div>
              <button aria-label="Close add canon dialog" className="flex h-9 w-9 items-center justify-center rounded-full text-[#71809b] hover:bg-[#f7f3eb]" disabled={isSavingCanon} onClick={closeCanonDialog} type="button"><X className="h-5 w-5" /></button>
            </div>

            <div className="mt-5 rounded-2xl border border-[#eee7da] bg-[#fcfaf6] p-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#8b93a5]">Appointment Summary</p>
              <dl className="mt-4 grid grid-cols-[110px_1fr] gap-x-4 gap-y-3 text-sm">
                <dt className="font-bold text-[#758098]">Child</dt><dd className="font-extrabold text-[#263453]">{canonAppointment.childName}</dd>
                <dt className="font-bold text-[#758098]">Date</dt><dd className="font-extrabold text-[#263453]">{formatDateParts(canonAppointment.scheduleDate).month} {formatDateParts(canonAppointment.scheduleDate).day}, {canonAppointment.scheduleDate.slice(0, 4)}</dd>
                <dt className="font-bold text-[#758098]">Time</dt><dd className="font-extrabold text-[#263453]">{formatTime(canonAppointment.startTime)}–{formatTime(canonAppointment.endTime)}</dd>
              </dl>
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-bold text-[#33415f]">Canon guidance checklist</p>
                <button className="flex items-center gap-1 text-sm font-bold text-[#9b7525] hover:text-[#7d5d1d]" onClick={() => setCanonTasks((tasks) => [...tasks, { id: `guidance-${Date.now()}-${tasks.length}`, isSelected: true, guidance: "" }])} type="button"><Plus className="h-4 w-4" />Add item</button>
              </div>
              <p className="mt-1 text-sm text-[#7d89a3]">Check each guidance item you want to save for the child.</p>
              <div className="mt-3 space-y-2">
                {canonTasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-3 rounded-xl border border-[#e4e0d8] bg-white px-3 py-2">
                    <input aria-label="Include guidance item" checked={task.isSelected} className="h-4 w-4 accent-[#b99645]" onChange={(event) => setCanonTasks((tasks) => tasks.map((item) => item.id === task.id ? { ...item, isSelected: event.target.checked } : item))} type="checkbox" />
                    <input className="min-w-0 flex-1 bg-transparent py-1 text-sm font-medium text-[#253252] outline-none placeholder:text-[#9ba4b6]" onChange={(event) => setCanonTasks((tasks) => tasks.map((item) => item.id === task.id ? { ...item, guidance: event.target.value } : item))} placeholder="Add the father’s guidance for the child..." value={task.guidance} />
                    {canonTasks.length > 1 ? <button aria-label="Remove guidance item" className="text-[#9ba4b6] hover:text-[#cf4f48]" onClick={() => setCanonTasks((tasks) => tasks.filter((item) => item.id !== task.id))} type="button"><X className="h-4 w-4" /></button> : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-bold text-[#33415f]">Date<input className="mt-2 h-11 w-full rounded-[12px] border border-[#e4e0d8] px-3 text-sm font-medium text-[#253252] outline-none focus:border-[#c5a860]" onChange={(event) => setFethaDate(event.target.value)} required type="date" value={fethaDate} /></label>
              <label className="text-sm font-bold text-[#33415f]">Time<input className="mt-2 h-11 w-full rounded-[12px] border border-[#e4e0d8] px-3 text-sm font-medium text-[#253252] outline-none focus:border-[#c5a860]" onChange={(event) => setFethaTime(event.target.value)} required type="time" value={fethaTime} /></label>
            </div>

            {canonError ? <p className="mt-3 text-sm font-semibold text-[#b7443e]">{canonError}</p> : null}

            <div className="mt-6 flex gap-3">
              <button className="h-11 flex-1 rounded-[12px] border border-[#ded8cd] bg-white px-4 text-sm font-bold text-[#56627c] hover:bg-[#faf8f4] disabled:opacity-50" disabled={isSavingCanon} onClick={closeCanonDialog} type="button">Cancel</button>
              <button className="h-11 flex-1 rounded-[12px] bg-[#b99645] px-4 text-sm font-bold text-white hover:bg-[#a78336] disabled:opacity-60" disabled={isSavingCanon} onClick={() => void saveCanon()} type="button">{isSavingCanon ? "Saving..." : "Save Canon"}</button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
