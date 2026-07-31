"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Clock3,
  MapPin,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import { NewAppointmentModal } from "@/components/dashboard/new-appointment-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  createAvailabilityAction,
  deleteAvailabilityAction,
  listAvailabilityCalendarAction,
  updateAvailabilityAction,
} from "@/server/actions/availability.actions";
import type {
  AvailabilityFormSubmission,
  CalendarEntryDto,
  MeetingMethod,
} from "@/types/availability";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

const methodLabels: Record<MeetingMethod, string> = {
  "in-person": "In-person meeting",
  phone: "Phone appointment",
  online: "Online meeting",
};

function dateKey(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function sameDate(first: Date, second: Date) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

function isPastDate(date: Date, today: Date) {
  const day = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const currentDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  return day < currentDay;
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

function monthRange(date: Date) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return { startDate: dateKey(start), endDate: dateKey(end) };
}

function displayMonth(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function displayDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function displayTime(value: string) {
  const [hoursText = "0", minutes = "00"] = value.split(":");
  const hours = Number(hoursText);
  const suffix = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${minutes} ${suffix}`;
}

export function CalendarView() {
  const today = useMemo(() => new Date(), []);
  const [month, setMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState(today);
  const [entries, setEntries] = useState<CalendarEntryDto[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CalendarEntryDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadMonth = useCallback(async (targetMonth: Date, quiet = false) => {
    if (!quiet) setLoading(true);

    const result = await listAvailabilityCalendarAction(
      monthRange(targetMonth),
    );

    if (result.success) {
      setEntries(result.data.entries);
      setError(null);
    } else {
      setError(result.error);
    }

    if (!quiet) setLoading(false);
    return result.success;
  }, []);

  useEffect(() => {
    let active = true;

    const run = async () => {
      setLoading(true);
      const result = await listAvailabilityCalendarAction(monthRange(month));
      if (!active) return;

      if (result.success) {
        setEntries(result.data.entries);
        const firstEntry = result.data.entries.find(
          (entry) => !isPastDate(new Date(`${entry.date}T00:00:00`), today),
        );

        setSelectedDate((current) => {
          const selectedDateHasEntry = result.data.entries.some(
            (entry) => entry.date === dateKey(current),
          );
          return !selectedDateHasEntry && firstEntry
            ? new Date(`${firstEntry.date}T00:00:00`)
            : current;
        });
        setError(null);
      } else {
        setError(result.error);
      }
      setLoading(false);
    };

    void run();
    return () => {
      active = false;
    };
  }, [month, today]);

  const days = useMemo(
    () => calendarDays(month.getFullYear(), month.getMonth()),
    [month],
  );

  const byDate = useMemo(
    () =>
      entries.reduce<Record<string, CalendarEntryDto[]>>((result, entry) => {
        result[entry.date] ??= [];
        result[entry.date].push(entry);
        return result;
      }, {}),
    [entries],
  );

  const selectedKey = dateKey(selectedDate);
  const selectedDateIsPast = isPastDate(selectedDate, today);
  const selectedEntries = [...(byDate[selectedKey] ?? [])].sort((a, b) =>
    a.startTime.localeCompare(b.startTime),
  );

  const openCreate = () => {
    if (selectedDateIsPast) {
      setError("Availability cannot be created for a past date.");
      return;
    }

    setEditing(null);
    setError(null);
    setModalOpen(true);
  };

  const saveEntry = async (submission: AvailabilityFormSubmission) => {
    setSaving(true);
    setError(null);

    const result = editing
      ? await updateAvailabilityAction(editing.id, submission)
      : await createAvailabilityAction(submission);

    if (!result.success) {
      setError(result.error);
      setSaving(false);
      return;
    }

    const savedDate = new Date(`${result.entry.date}T00:00:00`);
    const savedMonth = new Date(
      savedDate.getFullYear(),
      savedDate.getMonth(),
      1,
    );

    setSelectedDate(savedDate);
    setMonth(savedMonth);
    await loadMonth(savedMonth, true);
    setEditing(null);
    setModalOpen(false);
    setSaving(false);
  };

  const deleteEntry = async (entry: CalendarEntryDto) => {
    const confirmed = window.confirm(
      `Delete the ${displayTime(entry.startTime)} appointment time?`,
    );
    if (!confirmed) return;

    setDeletingId(entry.id);
    setError(null);
    const result = await deleteAvailabilityAction(entry.id);

    if (!result.success) {
      setError(result.error);
      setDeletingId(null);
      return;
    }

    await loadMonth(month, true);
    setDeletingId(null);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#10295a]">
              Availability Calendar
            </h1>
            <p className="mt-1 text-sm font-medium text-[#7d89a3]">
              Create the times spiritual children may request.
            </p>
          </div>

          <Button
            className="h-11 rounded-[14px] bg-[#d4ab4f] px-5 font-bold text-white hover:bg-[#c49b3f] disabled:cursor-not-allowed disabled:bg-[#c7cbd2]"
            disabled={selectedDateIsPast}
            onClick={openCreate}
          >
            <Plus className="h-4 w-4" />
            Add Availability
          </Button>
        </div>

        {error && !modalOpen ? (
          <div
            className="rounded-[16px] border border-[#f0d0ca] bg-[#fff5f3] px-5 py-4 text-sm font-semibold text-[#a3463b]"
            role="alert"
          >
            {error}
          </div>
        ) : null}

        <div className="grid items-stretch gap-5 xl:grid-cols-[minmax(0,1fr)_470px]">
          <Card className="order-1 rounded-[24px] border border-[#ede5d8] bg-white shadow-[0_12px_30px_rgba(30,44,83,0.07)] xl:order-2">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-[#10295a]">
                    {displayMonth(month)}
                  </h2>
                  <p className="mt-1 text-xs font-semibold text-[#8993aa]">
                    Select a day to manage its availability.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="h-9 rounded-[11px] border border-[#e8e0d2] px-3 text-xs font-bold text-[#52607b]"
                    onClick={() => {
                      const current = new Date();
                      setSelectedDate(current);
                      setMonth(
                        new Date(
                          current.getFullYear(),
                          current.getMonth(),
                          1,
                        ),
                      );
                    }}
                    type="button"
                  >
                    Today
                  </button>
                  <button
                    aria-label="Previous month"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-[#263453] hover:bg-[#faf6ee]"
                    onClick={() => {
                      const previous = new Date(
                        month.getFullYear(),
                        month.getMonth() - 1,
                        1,
                      );
                      setMonth(previous);
                    }}
                    type="button"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    aria-label="Next month"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-[#263453] hover:bg-[#faf6ee]"
                    onClick={() => {
                      const next = new Date(
                        month.getFullYear(),
                        month.getMonth() + 1,
                        1,
                      );
                      setMonth(next);
                      setSelectedDate(next);
                    }}
                    type="button"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-7 auto-rows-[44px] gap-1.5 sm:auto-rows-[52px] sm:gap-2">
                {weekdays.map((weekday) => (
                  <div
                    key={weekday}
                    className="pb-2 text-center text-xs font-semibold text-[#8b95ad]"
                  >
                    {weekday}
                  </div>
                ))}

                {days.map((date, index) => {
                  if (!date) {
                    return (
                      <div
                        key={`empty-${index}`}
                        className="h-full"
                      />
                    );
                  }

                  const key = dateKey(date);
                  const hasAvailability = (byDate[key] ?? []).length > 0;
                  const selected = sameDate(date, selectedDate);
                  const currentDay = sameDate(date, today);
                  const pastDate = isPastDate(date, today);

                  return (
                    <button
                      key={key}
                      aria-label={
                        pastDate
                          ? `${displayDate(date)} (past date)`
                          : displayDate(date)
                      }
                      className="group flex h-full flex-col items-center justify-center py-1"
                      onClick={() => {
                        setSelectedDate(date);
                        setError(null);
                      }}
                      type="button"
                    >
                      <span
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold",
                          pastDate
                            ? selected
                              ? "bg-[#eef0f3] text-[#687386]"
                              : "text-[#8b95ad] group-hover:bg-[#f5f6f8]"
                            : selected
                              ? "bg-[#c69a39] text-white"
                              : "text-[#10295a] group-hover:bg-[#fcfaf6]",
                          currentDay && !pastDate &&
                            !selected &&
                            "border border-[#c69a39] text-[#a47820]",
                        )}
                      >
                        {date.getDate()}
                      </span>

                      <div className="mt-1.5 flex h-1.5 gap-1">
                        {hasAvailability ? (
                          <span
                            className={cn(
                              "h-1.5 w-1.5 rounded-full",
                              pastDate ? "bg-[#9aa2af]" : "bg-[#c69a39]",
                            )}
                          />
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center gap-4 border-t border-[#e9e1d5] pt-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#c69a39]" />
                  <span className="text-xs font-semibold text-[#78849e]">
                    Available
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#9aa2af]" />
                  <span className="text-xs font-semibold text-[#78849e]">
                    Past
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="order-2 rounded-[24px] border border-[#ede5d8] bg-white shadow-[0_12px_30px_rgba(30,44,83,0.07)] xl:order-1">
            <CardContent className="flex flex-col p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-[#10295a]">
                    {displayDate(selectedDate)}
                  </h2>
                  <p className="mt-1 text-xs font-semibold text-[#929bb0]">
                    {loading
                      ? "Loading..."
                      : selectedDateIsPast
                        ? `${selectedEntries.length} past ${selectedEntries.length === 1 ? "availability" : "availabilities"}`
                        : `${selectedEntries.length} calendar entries`}
                  </p>
                </div>

                <button
                  className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-[#f6efe1] text-[#a37d2d] disabled:cursor-not-allowed disabled:bg-[#f1f2f4] disabled:text-[#a0a7b3]"
                  disabled={selectedDateIsPast}
                  onClick={openCreate}
                  type="button"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>



              {loading ? (
                <div className="flex min-h-[390px] flex-1 items-center justify-center text-sm font-bold text-[#8792aa]">
                  Loading calendar…
                </div>
              ) : selectedEntries.length === 0 ? (
                <div className="flex min-h-[390px] flex-1 flex-col items-center justify-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f8f1e6] text-[#8d99b0]">
                    <Clock3 className="h-7 w-7" />
                  </div>
                  <p className="mt-4 text-sm font-bold text-[#4f5c77]">
                    No availability created
                  </p>
                  <p className="mt-2 text-xs text-[#8a95ae]">
                    Add a time slot for this date.
                  </p>
                </div>
              ) : (
                <div className="mt-5 min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
                  {selectedEntries.map((entry) => {
                    return (
                      <div
                        key={entry.id}
                        className={cn(
                          "rounded-[18px] border p-4",
                          selectedDateIsPast
                            ? "border-[#e1e4e8] bg-[#f7f8f9]"
                            : "border-[#e4d3a5] bg-[#fffdf8]",
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "flex h-10 w-10 items-center justify-center rounded-[13px]",
                              selectedDateIsPast
                                ? "bg-[#e9ecef] text-[#8490a0]"
                                : "bg-[#f8efd6] text-[#a47820]",
                            )}
                          >
                            <CircleCheck className="h-5 w-5" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap justify-between gap-2">
                              <div>
                                <p className="mt-1 text-xs font-bold text-[#66728c]">
                                  {displayTime(entry.startTime)}–
                                  {displayTime(entry.endTime)}
                                </p>
                              </div>

                              <span
                                className={cn(
                                  "rounded-full px-2.5 py-1 text-[10px] font-extrabold",
                                  selectedDateIsPast
                                    ? "bg-[#e9ecef] text-[#687386]"
                                    : "bg-[#f8efd6] text-[#a47820]",
                                )}
                              >
                                {selectedDateIsPast ? "Expired" : "Available"}
                              </span>
                            </div>

                            <div
                              className={cn(
                                "mt-3 space-y-2 text-xs font-semibold",
                                selectedDateIsPast
                                  ? "text-[#8a94a3]"
                                  : "text-[#758098]",
                              )}
                            >
                              <p className="flex items-center gap-2">
                                    <MapPin className="h-3.5 w-3.5" />
                                    {methodLabels[entry.meetingMethod]} ·{" "}
                                    {entry.location || "No location"}
                              </p>

                              {entry.notes ? (
                                <p className="leading-5">{entry.notes}</p>
                              ) : null}

                              {selectedDateIsPast ? (
                                <p className="border-t border-[#e1e4e8] pt-3 leading-5 text-[#7e8795]">
                                  This availability has passed and is no longer bookable.
                                </p>
                              ) : null}
                            </div>

                            {entry.editable && !selectedDateIsPast ? (
                              <div className="mt-4 flex justify-end gap-2 border-t border-black/[0.05] pt-3">
                                <button
                                  className="flex items-center gap-1.5 rounded-[10px] px-2.5 py-2 text-xs font-bold text-[#64708a] hover:bg-white"
                                  onClick={() => {
                                    setEditing(entry);
                                    setError(null);
                                    setModalOpen(true);
                                  }}
                                  type="button"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                  Edit
                                </button>
                                <button
                                  className="flex items-center gap-1.5 rounded-[10px] px-2.5 py-2 text-xs font-bold text-[#b44d4d] hover:bg-[#fff1f1] disabled:opacity-50"
                                  disabled={deletingId === entry.id}
                                  onClick={() => void deleteEntry(entry)}
                                  type="button"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  {deletingId === entry.id ? "Deleting…" : "Delete"}
                                </button>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>

      <NewAppointmentModal
        busy={saving}
        defaultDate={selectedKey}
        error={error}
        initialValues={editing}
        mode={editing ? "edit" : "create"}
        open={modalOpen}
        onClose={() => {
          if (saving) return;
          setModalOpen(false);
          setEditing(null);
          setError(null);
        }}
        onSave={saveEntry}
      />
    </>
  );
}
