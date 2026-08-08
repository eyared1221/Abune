"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarCheck2,
  CalendarClock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Cross,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type {
  FatherAppointmentListItem,
  FatherAppointmentsResponse,
} from "@/contracts/appointment";
import type {
  AppointmentRequestListItem,
  FatherAppointmentRequestsResponse,
} from "@/contracts/appointment-request";
import type {
  FatherCanonListItem,
  FatherCanonsResponse,
} from "@/contracts/canon";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 8;
const tabs = ["Requests", "Scheduled", "Completed", "Follow-up"] as const;

type ConfessionTab = (typeof tabs)[number];
type CanonTaskDraft = { id: string; isSelected: boolean; guidance: string };

type ConfessionRow = {
  id: string;
  childName: string;
  childPhone: string | null;
  date: string;
  time: string;
  status: string;
  statusVariant: "warning" | "success" | "danger" | "neutral";
  requestedOn: string;
  guidance: string[];
  canonId?: string;
  appointmentId?: string;
};

function formatDate(value: string) {
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T00:00:00`)
    : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatTime(value: string) {
  const [hourText = "0", minute = "00"] = value.split(":");
  const hour = Number(hourText);
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${minute} ${suffix}`;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function toRequestRow(request: AppointmentRequestListItem): ConfessionRow {
  return {
    id: request.id,
    childName: request.childName,
    childPhone: request.childPhone,
    date: request.requestedDate,
    time: request.requestedStartTime,
    status: "Pending",
    statusVariant: "warning",
    requestedOn: formatDate(request.createdAt),
    guidance: [],
  };
}

function toAppointmentRow(
  appointment: FatherAppointmentListItem,
): ConfessionRow {
  const completed = appointment.status === "COMPLETED";
  const needsFollowUp = appointment.status === "RESCHEDULED";

  return {
    id: appointment.id,
    childName: appointment.childName,
    childPhone: appointment.childPhone,
    date: appointment.scheduleDate,
    time: appointment.startTime,
    status: completed
      ? "Completed"
      : needsFollowUp
        ? "Follow-up"
        : "Scheduled",
    statusVariant: completed
      ? "success"
      : needsFollowUp
        ? "neutral"
        : "warning",
    requestedOn: formatDate(appointment.scheduleDate),
    guidance: [],
    appointmentId: appointment.id,
  };
}

function toCanonRow(canon: FatherCanonListItem): ConfessionRow {
  return {
    id: `canon-${canon.id}`,
    childName: canon.childName,
    childPhone: canon.childPhone,
    date: canon.fethaDate,
    time: canon.fethaTime,
    status: "Canon",
    statusVariant: "success",
    requestedOn: formatDate(canon.createdAt),
    guidance: canon.tasks,
    canonId: canon.id,
  };
}

export function ConfessionsView() {
  const [requests, setRequests] = useState<AppointmentRequestListItem[]>([]);
  const [appointments, setAppointments] = useState<
    FatherAppointmentListItem[]
  >([]);
  const [canons, setCanons] = useState<FatherCanonListItem[]>([]);
  const [activeTab, setActiveTab] = useState<ConfessionTab>("Requests");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCanon, setEditingCanon] = useState<FatherCanonListItem | null>(null);
  const [editTasks, setEditTasks] = useState<CanonTaskDraft[]>([]);
  const [editFethaDate, setEditFethaDate] = useState("");
  const [editFethaTime, setEditFethaTime] = useState("");
  const [editError, setEditError] = useState<string | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadConfessions = async () => {
      try {
        const [requestResponse, appointmentResponse, canonResponse] = await Promise.all([
          fetch("/api/appointment-requests", { cache: "no-store" }),
          fetch("/api/appointments", { cache: "no-store" }),
          fetch("/api/canons", { cache: "no-store" }),
        ]);
        const [requestBody, appointmentBody, canonBody] = await Promise.all([
          requestResponse.json() as Promise<
            FatherAppointmentRequestsResponse | { error?: string }
          >,
          appointmentResponse.json() as Promise<
            FatherAppointmentsResponse | { error?: string }
          >,
          canonResponse.json() as Promise<
            FatherCanonsResponse | { error?: string }
          >,
        ]);

        if (!requestResponse.ok || !appointmentResponse.ok || !canonResponse.ok) {
          const requestError =
            "error" in requestBody ? requestBody.error : undefined;
          const appointmentError =
            "error" in appointmentBody ? appointmentBody.error : undefined;
          const canonError =
            "error" in canonBody ? canonBody.error : undefined;
          const apiError = requestError ?? appointmentError ?? canonError;
          throw new Error(apiError ?? "Unable to load confessions.");
        }

        if (!cancelled) {
          setRequests(
            (requestBody as FatherAppointmentRequestsResponse).requests,
          );
          setAppointments(
            (appointmentBody as FatherAppointmentsResponse).appointments,
          );
          setCanons((canonBody as FatherCanonsResponse).canons);
        }
      } catch (loadError: unknown) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load confessions.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadConfessions();

    return () => {
      cancelled = true;
    };
  }, []);

  const confessionRequests = useMemo(
    () =>
      requests.filter(
        (request) =>
          request.reason === "confession" && request.status === "PENDING",
      ),
    [requests],
  );
  const confessionAppointments = useMemo(
    () => appointments.filter((appointment) => appointment.reason === "confession"),
    [appointments],
  );

  const rows = useMemo(() => {
    switch (activeTab) {
      case "Requests":
        return [
          ...canons.map(toCanonRow),
          ...confessionRequests.map(toRequestRow),
        ];
      case "Scheduled":
        return confessionAppointments
          .filter((appointment) => appointment.status === "CONFIRMED")
          .map(toAppointmentRow);
      case "Completed":
        return confessionAppointments
          .filter((appointment) => appointment.status === "COMPLETED")
          .map(toAppointmentRow);
      case "Follow-up":
        return confessionAppointments
          .filter((appointment) => appointment.status === "RESCHEDULED")
          .map(toAppointmentRow);
    }
  }, [activeTab, canons, confessionAppointments, confessionRequests]);

  const filteredRows = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) {
      return rows;
    }

    return rows.filter((row) =>
      [row.childName, row.childPhone ?? "", row.status, ...row.guidance]
        .some((value) => value.toLowerCase().includes(query)),
    );
  }, [rows, searchText]);

  const updateScheduledAppointment = async (appointmentId: string, action: "COMPLETE" | "FOLLOW_UP") => {
    const response = await fetch(`/api/appointments/${appointmentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    if (!response.ok) {
      const data = await response.json();
      setError(data.error || "Unable to update appointment.");
      return;
    }
    setAppointments((current) => current.map((appointment) => appointment.id === appointmentId ? { ...appointment, status: action === "COMPLETE" ? "COMPLETED" : "RESCHEDULED" } : appointment));
  };

  const stats = [
    {
      icon: Cross,
      label: "Pending Requests",
      value: confessionRequests.length,
    },
    {
      icon: CalendarCheck2,
      label: "Upcoming",
      value: confessionAppointments.filter(
        (appointment) => appointment.status === "CONFIRMED",
      ).length,
    },
    {
      icon: CheckCircle2,
      label: "Completed",
      value: confessionAppointments.filter(
        (appointment) => appointment.status === "COMPLETED",
      ).length,
    },
    {
      icon: CalendarClock,
      label: "Follow-up Needed",
      value: confessionAppointments.filter(
        (appointment) => appointment.status === "RESCHEDULED",
      ).length,
    },
  ] as const;

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const visibleRows = filteredRows.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );
  const firstShown = filteredRows.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const lastShown = Math.min(safePage * PAGE_SIZE, filteredRows.length);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchText]);

  const openEditCanon = (row: ConfessionRow) => {
    const canon = canons.find((item) => item.id === row.canonId);
    if (!canon) return;
    setEditingCanon(canon);
    setEditTasks(canon.tasks.map((guidance, index) => ({ id: `task-${index}`, isSelected: true, guidance })));
    setEditFethaDate(canon.fethaDate);
    setEditFethaTime(canon.fethaTime);
    setEditError(null);
  };

  const closeEditCanon = () => {
    if (!isSavingEdit) {
      setEditingCanon(null);
      setEditError(null);
    }
  };

  const saveEditedCanon = async () => {
    if (!editingCanon || isSavingEdit) return;
    const tasks = editTasks.filter((task) => task.isSelected).map((task) => task.guidance.trim()).filter(Boolean);
    if (!tasks.length || !editFethaDate || !editFethaTime) {
      setEditError("Add at least one guidance item and choose the Fetha date and time.");
      return;
    }
    setIsSavingEdit(true);
    setEditError(null);
    try {
      const response = await fetch(`/api/canons/${editingCanon.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks, fethaDate: editFethaDate, fethaTime: editFethaTime }),
      });
      const body = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(body.error ?? "Unable to update the canon.");
      setCanons((items) => items.map((canon) => canon.id === editingCanon.id ? { ...canon, tasks, fethaDate: editFethaDate, fethaTime: editFethaTime } : canon));
      setEditingCanon(null);
    } catch (updateError: unknown) {
      setEditError(updateError instanceof Error ? updateError.message : "Unable to update the canon.");
    } finally {
      setIsSavingEdit(false);
    }
  };

  const deleteCanon = async (row: ConfessionRow) => {
    if (!row.canonId || !window.confirm(`Delete the canon for ${row.childName}?`)) return;
    try {
      const response = await fetch(`/api/canons/${row.canonId}`, { method: "DELETE" });
      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        throw new Error(body.error ?? "Unable to delete the canon.");
      }
      setCanons((items) => items.filter((canon) => canon.id !== row.canonId));
    } catch (deleteError: unknown) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete the canon.");
    }
  };

  return (
    <>
      <section className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ icon: Icon, label, value }) => (
          <Card
            key={label}
            className="group relative min-h-[174px] overflow-hidden rounded-[24px] border border-[#ebe5d9] bg-[#fdfcf9] shadow-[0_10px_30px_rgba(26,38,67,0.07)]"
          >
            <CardContent className="relative z-10 p-7">
              <div className="flex h-[58px] w-[58px] items-center justify-center rounded-[18px] bg-[#ddb84f] text-[#18335f] shadow-[0_7px_16px_rgba(205,163,58,0.24)]">
                <Icon className="h-7 w-7" strokeWidth={1.9} />
              </div>
              <p className="mt-6 text-[42px] font-extrabold leading-none tracking-tight text-[#17223f]">
                {value}
              </p>
              <p className="mt-3 text-[18px] font-bold text-[#263453]">{label}</p>
            </CardContent>
            <div className="pointer-events-none absolute -right-12 -top-14 h-32 w-32 rounded-full bg-[#d7b04d]/[0.07]" />
          </Card>
        ))}
      </section>

      <Card className="mt-6 rounded-[28px] border border-[#ebe5d9] bg-[#fdfcf9] shadow-[0_14px_38px_rgba(25,38,70,0.08)]">
        <CardContent className="p-0">
          <div className="grid grid-cols-2 border-b border-[#ebe5d9] text-base font-extrabold text-[#6b7695] md:grid-cols-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "border-b-2 px-2 py-5 text-center transition-colors sm:px-4",
                  activeTab === tab
                    ? "border-[#b99645] text-[#9b7525]"
                    : "border-transparent hover:text-[#1d2859]",
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-4 sm:p-6">
            <label className="flex min-w-0 items-center gap-3 rounded-2xl border border-[#e9e3d8] bg-white px-4 py-3 text-[#7b86a7]">
              <Search className="h-5 w-5 shrink-0" />
              <input
                className="min-w-0 flex-1 bg-transparent text-base font-semibold text-[#33415f] outline-none placeholder:text-[#7b86a7]"
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Search by name or phone..."
                value={searchText}
              />
            </label>

            {error ? (
              <div className="mt-4 rounded-2xl border border-[#f1c7c4] bg-[#fff5f4] px-4 py-3 text-sm font-semibold text-[#b7443e]">
                {error}
              </div>
            ) : null}

            <div className="mt-6 overflow-x-auto border border-[#ebe5d9]">
              <div className="min-w-[900px]">
                <div className="grid grid-cols-[minmax(320px,1fr)_150px_150px_110px_80px] items-center gap-2 border-b border-[#eee9df] bg-[#faf8f3] px-7 py-4 text-[14px] font-extrabold uppercase tracking-[0.06em] text-[#7b8499]">
                  <p>Confession Request / Canon</p>
                  <p>Scheduled For</p>
                  <p>Requested On</p>
                  <p>Status</p>
                  <p className="text-right">Actions</p>
                </div>

                <div className="divide-y divide-[#f0ece4] bg-white">
                  {isLoading ? (
                    <p className="px-7 py-14 text-center text-sm font-semibold text-[#7b8499]">Loading confessions...</p>
                  ) : visibleRows.length === 0 ? (
                    <p className="px-7 py-14 text-center text-sm font-semibold text-[#7b8499]">
                      {activeTab === "Follow-up"
                        ? "No confession follow-ups are scheduled."
                        : "No confessions match the selected filters."}
                    </p>
                  ) : (
                    visibleRows.map((row) => (
                      <div
                        key={row.id}
                        className="grid grid-cols-[minmax(320px,1fr)_150px_150px_110px_80px] items-center gap-2 px-7 py-5 transition-colors hover:bg-[#fcfaf6]"
                      >
                        <div className="flex min-w-0 items-center">
                          <div className="min-w-0">
                            <p className="truncate font-extrabold text-[#1d2859]">{row.childName}</p>
                            {row.childPhone ? <p className="mt-1 text-sm font-medium text-[#7b8499]">{row.childPhone}</p> : null}
                            {row.guidance.length ? (
                              <p className="mt-1 break-words whitespace-normal text-sm font-semibold text-[#9b7525]">
                                Canon: {row.guidance.join(" · ")}
                              </p>
                            ) : null}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#56617d]">{formatDate(row.date)}</p>
                          <p className="mt-1 text-sm font-medium text-[#7b8499]">{formatTime(row.time)}</p>
                        </div>
                        <p className="text-sm font-semibold text-[#56617d]">{row.requestedOn}</p>
                        <Badge variant={row.statusVariant} className="w-fit rounded-full px-3 py-1">{row.status}</Badge>
                        <div className="flex justify-end gap-1.5">
                          {activeTab === "Scheduled" && row.appointmentId ? <><button className="rounded-[10px] bg-[#d4ab4f] px-3 py-2 text-xs font-bold text-white hover:bg-[#c49b3f]" onClick={() => void updateScheduledAppointment(row.appointmentId!, "COMPLETE")} type="button">Completed</button><button className="rounded-[10px] border border-[#e5c97f] px-3 py-2 text-xs font-bold text-[#9b7525] hover:bg-[#fff8e9]" onClick={() => void updateScheduledAppointment(row.appointmentId!, "FOLLOW_UP")} type="button">Needs follow-up</button></> : row.canonId ? <><button aria-label="Edit canon" className="flex h-9 w-9 items-center justify-center rounded-xl text-[#9b7525] hover:bg-[#faf6ed]" onClick={() => openEditCanon(row)} type="button"><Pencil className="h-4 w-4" /></button><button aria-label="Delete canon" className="flex h-9 w-9 items-center justify-center rounded-xl text-[#cf4f48] hover:bg-[#fff4f3]" onClick={() => void deleteCanon(row)} type="button"><Trash2 className="h-4 w-4" /></button></> : <span className="text-sm font-semibold text-[#8a93a7]">—</span>}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-4 text-sm font-semibold text-[#4c5678] sm:flex-row sm:items-center sm:justify-between">
              <p>Showing {firstShown} to {lastShown} of {filteredRows.length} confessions</p>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  aria-label="Previous page"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e9e3d8] bg-white text-[#7d86a7] disabled:opacity-40"
                  disabled={safePage <= 1}
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  type="button"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="flex h-10 min-w-10 items-center justify-center rounded-xl bg-[#b99645] px-3 text-sm font-bold text-white">{safePage}</span>
                <button
                  aria-label="Next page"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e9e3d8] bg-white text-[#4c5678] disabled:opacity-40"
                  disabled={safePage >= totalPages}
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  type="button"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {editingCanon ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <button aria-label="Close edit canon dialog" className="absolute inset-0 bg-[#17223f]/45 backdrop-blur-sm" onClick={closeEditCanon} type="button" />
          <div aria-labelledby="edit-canon-title" aria-modal="true" className="relative z-10 max-h-[calc(100vh-2rem)] w-full max-w-[720px] overflow-y-auto rounded-[24px] border border-[#eee4d4] bg-white p-6 shadow-[0_24px_64px_rgba(23,34,63,0.22)]" role="dialog">
            <div className="flex items-start justify-between gap-4"><div><h2 id="edit-canon-title" className="text-2xl font-extrabold text-[#1d2b51]">Edit Canon</h2><p className="mt-2 text-sm font-medium text-[#6d7892]">Guidance for <span className="font-extrabold text-[#1d2b51]">{editingCanon.childName}</span></p></div><button aria-label="Close edit canon dialog" className="flex h-9 w-9 items-center justify-center rounded-full text-[#71809b] hover:bg-[#f7f3eb]" disabled={isSavingEdit} onClick={closeEditCanon} type="button"><X className="h-5 w-5" /></button></div>

            <div className="mt-5 rounded-2xl border border-[#eee7da] bg-[#fcfaf6] p-4"><p className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#8b93a5]">Appointment Summary</p><dl className="mt-4 grid grid-cols-[110px_1fr] gap-x-4 gap-y-3 text-sm"><dt className="font-bold text-[#758098]">Child</dt><dd className="font-extrabold text-[#263453]">{editingCanon.childName}</dd><dt className="font-bold text-[#758098]">Date</dt><dd className="font-extrabold text-[#263453]">{formatDate(editingCanon.appointmentDate)}</dd><dt className="font-bold text-[#758098]">Time</dt><dd className="font-extrabold text-[#263453]">{formatTime(editingCanon.appointmentStartTime)}–{formatTime(editingCanon.appointmentEndTime)}</dd></dl></div>

            <div className="mt-5"><div className="flex items-center justify-between gap-3"><p className="text-sm font-bold text-[#33415f]">Canon guidance checklist</p><button className="flex items-center gap-1 text-sm font-bold text-[#9b7525] hover:text-[#7d5d1d]" onClick={() => setEditTasks((tasks) => [...tasks, { id: `task-${Date.now()}-${tasks.length}`, isSelected: true, guidance: "" }])} type="button"><Plus className="h-4 w-4" />Add item</button></div><p className="mt-1 text-sm text-[#7d89a3]">Check each guidance item you want to save for the child.</p><div className="mt-3 space-y-2">{editTasks.map((task) => <div key={task.id} className="flex items-center gap-3 rounded-xl border border-[#e4e0d8] bg-white px-3 py-2"><input aria-label="Include guidance item" checked={task.isSelected} className="h-4 w-4 accent-[#b99645]" onChange={(event) => setEditTasks((tasks) => tasks.map((item) => item.id === task.id ? { ...item, isSelected: event.target.checked } : item))} type="checkbox" /><input className="min-w-0 flex-1 bg-transparent py-1 text-sm font-medium text-[#253252] outline-none placeholder:text-[#9ba4b6]" onChange={(event) => setEditTasks((tasks) => tasks.map((item) => item.id === task.id ? { ...item, guidance: event.target.value } : item))} placeholder="Add the father’s guidance for the child..." value={task.guidance} />{editTasks.length > 1 ? <button aria-label="Remove guidance item" className="text-[#9ba4b6] hover:text-[#cf4f48]" onClick={() => setEditTasks((tasks) => tasks.filter((item) => item.id !== task.id))} type="button"><X className="h-4 w-4" /></button> : null}</div>)}</div></div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="text-sm font-bold text-[#33415f]">Date<input className="mt-2 h-11 w-full rounded-[12px] border border-[#e4e0d8] px-3 text-sm font-medium text-[#253252] outline-none focus:border-[#c5a860]" onChange={(event) => setEditFethaDate(event.target.value)} type="date" value={editFethaDate} /></label><label className="text-sm font-bold text-[#33415f]">Time<input className="mt-2 h-11 w-full rounded-[12px] border border-[#e4e0d8] px-3 text-sm font-medium text-[#253252] outline-none focus:border-[#c5a860]" onChange={(event) => setEditFethaTime(event.target.value)} type="time" value={editFethaTime} /></label></div>
            {editError ? <p className="mt-3 text-sm font-semibold text-[#b7443e]">{editError}</p> : null}
            <div className="mt-6 flex gap-3"><button className="h-11 flex-1 rounded-[12px] border border-[#ded8cd] bg-white px-4 text-sm font-bold text-[#56627c] hover:bg-[#faf8f4] disabled:opacity-50" disabled={isSavingEdit} onClick={closeEditCanon} type="button">Cancel</button><button className="h-11 flex-1 rounded-[12px] bg-[#b99645] px-4 text-sm font-bold text-white hover:bg-[#a78336] disabled:opacity-60" disabled={isSavingEdit} onClick={() => void saveEditedCanon()} type="button">{isSavingEdit ? "Saving..." : "Save Canon"}</button></div>
          </div>
        </div>
      ) : null}
    </>
  );
}
