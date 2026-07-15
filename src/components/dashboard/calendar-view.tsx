"use client";

import { useMemo, useState } from "react";
import {
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import {
  NewAppointmentModal,
  type AppointmentStatus,
  type AppointmentType,
  type NewAppointmentSubmission,
} from "@/components/dashboard/new-appointment-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

type CalendarAppointment = {
  id: number;
  title: string;
  date: string;
  time: string;
  type: AppointmentType;
  spiritualChild?: string;
  duration?: string;
  notes?: string;
  reminder?: string;
  status?: AppointmentStatus;
};

const appointmentTypeConfig: Record<
  AppointmentType,
  {
    label: string;
    dotClassName: string;
    badgeClassName: string;
  }
> = {
  confession: {
    label: "Confession",
    dotClassName: "bg-[#963bd8]",
    badgeClassName: "bg-[#f3e8ff] text-[#7d2bc1]",
  },
  reflection: {
    label: "Reflection",
    dotClassName: "bg-[#2799cf]",
    badgeClassName: "bg-[#e8f7fd] text-[#167fae]",
  },
  review: {
    label: "Review",
    dotClassName: "bg-[#d72768]",
    badgeClassName: "bg-[#ffe9f1] text-[#bd1e59]",
  },
};

const initialAppointments: CalendarAppointment[] = [
  {
    id: 1,
    title: "Confession Meeting",
    spiritualChild: "Mekdes Assefa",
    date: "2026-07-09",
    time: "9:00 AM",
    type: "confession",
    status: "scheduled",
  },
  {
    id: 2,
    title: "Spiritual Reflection",
    spiritualChild: "Daniel Gebre",
    date: "2026-07-09",
    time: "11:30 AM",
    type: "reflection",
    status: "scheduled",
  },
  {
    id: 3,
    title: "Pastoral Review",
    spiritualChild: "Hanna Tesfaye",
    date: "2026-07-09",
    time: "2:00 PM",
    type: "review",
    status: "scheduled",
  },
  {
    id: 4,
    title: "Spiritual Reflection",
    spiritualChild: "Yonas Berhe",
    date: "2026-07-11",
    time: "10:00 AM",
    type: "reflection",
    status: "scheduled",
  },
  {
    id: 5,
    title: "Confession Meeting",
    spiritualChild: "Rachel Michael",
    date: "2026-07-13",
    time: "3:00 PM",
    type: "confession",
    status: "scheduled",
  },
  {
    id: 6,
    title: "Pastoral Review",
    spiritualChild: "Samuel Bekele",
    date: "2026-07-16",
    time: "1:30 PM",
    type: "review",
    status: "scheduled",
  },
];

function createDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function isSameDate(firstDate: Date, secondDate: Date) {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  );
}

function getCalendarDays(year: number, month: number) {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const leadingDays = firstDayOfMonth.getDay();
  const totalDays = lastDayOfMonth.getDate();

  const cells: Array<Date | null> = [];

  for (let index = 0; index < leadingDays; index += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= totalDays; day += 1) {
    cells.push(new Date(year, month, day));
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}

function formatMonthTitle(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatSelectedDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function CalendarView() {
  const today = useMemo(() => new Date(), []);
  const [isNewAppointmentModalOpen, setIsNewAppointmentModalOpen] =
    useState(false);
  const [appointmentBeingEdited, setAppointmentBeingEdited] =
    useState<CalendarAppointment | null>(null);
  const [swipedAppointmentId, setSwipedAppointmentId] = useState<number | null>(
    null,
  );
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(2026, 6, 1),
  );
  const [selectedDate, setSelectedDate] = useState(
    () => new Date(2026, 6, 8),
  );
  const [calendarAppointments, setCalendarAppointments] =
    useState<CalendarAppointment[]>(initialAppointments);

  const calendarDays = useMemo(
    () =>
      getCalendarDays(
        visibleMonth.getFullYear(),
        visibleMonth.getMonth(),
      ),
    [visibleMonth],
  );

  const appointmentsByDate = useMemo(() => {
    return calendarAppointments.reduce<Record<string, CalendarAppointment[]>>(
      (result, appointment) => {
        if (!result[appointment.date]) {
          result[appointment.date] = [];
        }

        result[appointment.date].push(appointment);
        return result;
      },
      {},
    );
  }, [calendarAppointments]);

  const selectedDateKey = createDateKey(selectedDate);
  const selectedAppointments =
    appointmentsByDate[selectedDateKey] ?? [];

  const goToPreviousMonth = () => {
    setVisibleMonth((currentMonth) => {
      const previousMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() - 1,
        1,
      );

      setSelectedDate(previousMonth);

      return previousMonth;
    });
  };

  const goToNextMonth = () => {
    setVisibleMonth((currentMonth) => {
      const nextMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        1,
      );

      setSelectedDate(nextMonth);

      return nextMonth;
    });
  };

  const goToToday = () => {
    const currentDate = new Date();

    setVisibleMonth(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1,
      ),
    );

    setSelectedDate(currentDate);
  };

  const handleCreateAppointment = (
    submission: NewAppointmentSubmission,
  ) => {
    if (appointmentBeingEdited) {
      setCalendarAppointments((currentAppointments) =>
        currentAppointments.map((appointment) =>
          appointment.id === appointmentBeingEdited.id
            ? {
                ...appointment,
                title: submission.title,
                date: submission.date,
                time: submission.time,
                type: submission.type,
                spiritualChild: submission.spiritualChild,
                duration: submission.duration,
                notes: submission.notes,
                reminder: submission.reminder,
                status: submission.status,
              }
            : appointment,
        ),
      );
    } else {
      setCalendarAppointments((currentAppointments) => [
        ...currentAppointments,
        {
          id:
            currentAppointments.length === 0
              ? 1
              : Math.max(...currentAppointments.map((item) => item.id)) + 1,
          title: submission.title,
          date: submission.date,
          time: submission.time,
          type: submission.type,
          spiritualChild: submission.spiritualChild,
          duration: submission.duration,
          notes: submission.notes,
          reminder: submission.reminder,
          status: submission.status,
        },
      ]);
    }

    const appointmentDate = new Date(submission.date);
    if (!Number.isNaN(appointmentDate.getTime())) {
      setVisibleMonth(
        new Date(
          appointmentDate.getFullYear(),
          appointmentDate.getMonth(),
          1,
        ),
      );
      setSelectedDate(appointmentDate);
    }

    setAppointmentBeingEdited(null);
    setSwipedAppointmentId(null);
    setIsNewAppointmentModalOpen(false);
  };

  const handleDeleteAppointment = (appointmentId: number) => {
    setCalendarAppointments((currentAppointments) =>
      currentAppointments.filter(
        (appointment) => appointment.id !== appointmentId,
      ),
    );
    setSwipedAppointmentId(null);

    if (appointmentBeingEdited?.id === appointmentId) {
      setAppointmentBeingEdited(null);
      setIsNewAppointmentModalOpen(false);
    }
  };

  const handleEditAppointment = (appointment: CalendarAppointment) => {
    setAppointmentBeingEdited(appointment);
    setSwipedAppointmentId(null);
    setIsNewAppointmentModalOpen(true);
  };

  const openCreateModal = () => {
    setAppointmentBeingEdited(null);
    setSwipedAppointmentId(null);
    setIsNewAppointmentModalOpen(true);
  };

  return (
    <>
      <div className="space-y-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#10295a]">
              Calendar
            </h1>

            <p className="mt-1 text-sm font-medium text-[#7d89a3]">
              Manage appointments and schedule
            </p>
          </div>

          <Button
            className="h-11 rounded-[14px] bg-[#d4ab4f] px-5 text-sm font-bold text-white shadow-[0_8px_18px_rgba(212,171,79,0.22)] hover:bg-[#c49b3f]"
            onClick={openCreateModal}
          >
            <Plus className="h-4 w-4" />
            New Appointment
          </Button>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          <Card className="rounded-[22px] border border-[#ede5d8] bg-white shadow-[0_12px_30px_rgba(30,44,83,0.07)]">
            <CardContent className="p-5 sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-bold text-[#10295a]">
                  {formatMonthTitle(visibleMonth)}
                </h2>

                <div className="flex items-center gap-2">
                  <button
                    className="h-9 rounded-[11px] border border-[#e8e0d2] bg-white px-3 text-xs font-bold text-[#52607b] transition-colors hover:bg-[#faf6ee]"
                    onClick={goToToday}
                    type="button"
                  >
                    Today
                  </button>

                  <button
                    aria-label="Previous month"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-[#263453] transition-colors hover:bg-[#faf6ee]"
                    onClick={goToPreviousMonth}
                    type="button"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <button
                    aria-label="Next month"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-[#263453] transition-colors hover:bg-[#faf6ee]"
                    onClick={goToNextMonth}
                    type="button"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-7 gap-1 sm:gap-2">
                {weekdays.map((weekday) => (
                  <div
                    key={weekday}
                    className="pb-2 text-center text-xs font-semibold text-[#8b95ad] sm:text-sm"
                  >
                    {weekday}
                  </div>
                ))}

                {calendarDays.map((date, index) => {
                  if (!date) {
                    return (
                      <div
                        key={`empty-${index}`}
                        className="min-h-[48px] sm:min-h-[66px]"
                      />
                    );
                  }

                  const dateKey = createDateKey(date);
                  const dayAppointments =
                    appointmentsByDate[dateKey] ?? [];

                  const appointmentTypes = Array.from(
                    new Set(
                      dayAppointments.map(
                        (appointment) => appointment.type,
                      ),
                    ),
                  );

                  const selected = isSameDate(date, selectedDate);
                  const currentDay = isSameDate(date, today);

                  return (
                    <button
                      key={dateKey}
                      aria-label={`Select ${date.toLocaleDateString()}`}
                      className={cn(
                        "group relative flex min-h-[48px] flex-col items-center justify-center rounded-[12px] border border-transparent px-1 py-1.5 text-center transition-all sm:min-h-[66px] sm:rounded-[15px]",
                        selected &&
                          "border-[#e5c77d] bg-[#fbf0d8] shadow-[0_6px_15px_rgba(180,145,70,0.12)]",
                        !selected &&
                          "hover:border-[#eee4d2] hover:bg-[#fcfaf6]",
                      )}
                      onClick={() => {
                        setSelectedDate(date);
                        setSwipedAppointmentId(null);
                      }}
                      type="button"
                    >
                      <span
                        className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors sm:h-8 sm:w-8 sm:text-sm",
                          selected &&
                            "bg-[#c69a39] text-white shadow-[0_4px_10px_rgba(198,154,57,0.24)]",
                          !selected && "text-[#10295a]",
                          currentDay &&
                            !selected &&
                            "border border-[#c69a39] text-[#a47820]",
                        )}
                      >
                        {date.getDate()}
                      </span>

                      {appointmentTypes.length > 0 && (
                        <div className="mt-1 flex items-center justify-center gap-1">
                          {appointmentTypes.map((type) => (
                            <span
                              key={`${dateKey}-${type}`}
                              aria-label={
                                appointmentTypeConfig[type].label
                              }
                              className={cn(
                                "h-1.5 w-1.5 rounded-full",
                                appointmentTypeConfig[type]
                                  .dotClassName,
                              )}
                            />
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 border-t border-[#e9e1d5] pt-4">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  {(
                    Object.entries(appointmentTypeConfig) as Array<
                      [
                        AppointmentType,
                        (typeof appointmentTypeConfig)[AppointmentType],
                      ]
                    >
                  ).map(([type, config]) => (
                    <div
                      key={type}
                      className="flex items-center gap-2"
                    >
                      <span
                        className={cn(
                          "h-2.5 w-2.5 rounded-full",
                          config.dotClassName,
                        )}
                      />

                      <span className="text-xs font-medium text-[#78849e] sm:text-sm">
                        {config.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[22px] border border-[#ede5d8] bg-white shadow-[0_12px_30px_rgba(30,44,83,0.07)]">
            <CardContent className="p-5 sm:p-6">
              <h2 className="text-xl font-bold text-[#10295a]">
                {formatSelectedDate(selectedDate)}
              </h2>

              <p className="mt-1 text-xs font-medium text-[#929bb0]">
                {selectedAppointments.length}{" "}
                {selectedAppointments.length === 1
                  ? "appointment"
                  : "appointments"}
              </p>

              {selectedAppointments.length === 0 ? (
                <div className="flex min-h-[380px] flex-col items-center justify-center text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f8f1e6] text-[#8d99b0]">
                    <Clock3 className="h-6 w-6" />
                  </div>

                  <p className="mt-4 text-sm font-semibold text-[#8a95ae]">
                    No appointments scheduled
                  </p>
                </div>
              ) : (
                <div className="mt-5 space-y-3">
                  {selectedAppointments.map((appointment) => {
                    const typeConfig =
                      appointmentTypeConfig[appointment.type];

                    return (
                      <div
                        key={appointment.id}
                        className="relative overflow-hidden rounded-[16px]"
                        onTouchEnd={(event) => {
                          if (touchStartX === null) {
                            return;
                          }

                          const delta = touchStartX - event.changedTouches[0].clientX;
                          if (delta > 60) {
                            setSwipedAppointmentId(appointment.id);
                          } else if (delta < -40) {
                            setSwipedAppointmentId(null);
                          }

                          setTouchStartX(null);
                        }}
                        onTouchStart={(event) => {
                          setTouchStartX(event.touches[0].clientX);
                        }}
                      >
                        <div className="absolute inset-y-0 right-0 flex w-[88px] items-center justify-center rounded-[16px] bg-[#d84f4f]">
                          <button
                            className="flex h-full w-full items-center justify-center gap-2 text-sm font-bold text-white"
                            onClick={() => handleDeleteAppointment(appointment.id)}
                            type="button"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </div>

                        <div
                          className={cn(
                            "relative rounded-[16px] border border-[#ebe4d8] bg-[#fdfcf9] p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[#dacaab] hover:shadow-[0_8px_18px_rgba(30,44,83,0.06)]",
                            swipedAppointmentId === appointment.id &&
                              "-translate-x-[88px]",
                          )}
                        >
                          <div className="flex items-start gap-2.5">
                            <span
                              className={cn(
                                "mt-1 h-2.5 w-2.5 shrink-0 rounded-full",
                                typeConfig.dotClassName,
                              )}
                            />

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-start justify-between gap-2">
                                <p className="text-sm font-bold text-[#1d2b51]">
                                  {appointment.title}
                                </p>

                                <span
                                  className={cn(
                                    "rounded-full px-2 py-0.5 text-[10px] font-bold",
                                    typeConfig.badgeClassName,
                                  )}
                                >
                                  {typeConfig.label}
                                </span>
                              </div>

                              {appointment.spiritualChild && (
                                <p className="mt-1.5 text-xs font-semibold text-[#66728c]">
                                  {appointment.spiritualChild}
                                </p>
                              )}

                              <div className="mt-2 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-1.5 text-xs font-medium text-[#8993aa]">
                                  <Clock3 className="h-3.5 w-3.5" />
                                  {appointment.time}
                                </div>

                                <div className="flex items-center gap-1">
                                  <button
                                    aria-label={`Edit ${appointment.title}`}
                                    className="flex h-8 w-8 items-center justify-center rounded-full text-[#7b86a0] transition-colors hover:bg-[#f3eee4] hover:text-[#2b3a5e]"
                                    onClick={() =>
                                      handleEditAppointment(appointment)
                                    }
                                    type="button"
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </button>

                                  <button
                                    aria-label={`Delete ${appointment.title}`}
                                    className="flex h-8 w-8 items-center justify-center rounded-full text-[#c05555] transition-colors hover:bg-[#fff1f1] hover:text-[#a93636]"
                                    onClick={() =>
                                      handleDeleteAppointment(appointment.id)
                                    }
                                    type="button"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
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

        <Card className="rounded-[22px] border border-[#ede5d8] bg-gradient-to-r from-[#fff9ef] to-[#fffdf9] shadow-[0_8px_22px_rgba(30,44,83,0.05)]">
          <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#f8efdc] text-[#c79b43]">
              <CalendarClock className="h-5 w-5" />
            </div>

            <div>
              <p className="text-base font-bold text-[#17305d]">
                Schedule Overview
              </p>

              <p className="mt-1 text-xs leading-5 text-[#7d89a3] sm:text-sm">
                Use the calendar to review upcoming appointments and
                select a day to manage its spiritual meetings.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <NewAppointmentModal
        defaultDate={selectedDateKey}
        initialValues={appointmentBeingEdited}
        mode={appointmentBeingEdited ? "edit" : "create"}
        open={isNewAppointmentModalOpen}
        onClose={() => {
          setIsNewAppointmentModalOpen(false);
          setAppointmentBeingEdited(null);
        }}
        onSave={handleCreateAppointment}
      />
    </>
  );
}
