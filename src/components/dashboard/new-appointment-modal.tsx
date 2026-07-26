"use client";

import {
  useEffect,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  AlertCircle,
  CalendarDays,
  Clock3,
  MapPin,
  Plus,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  AvailabilityFormSubmission,
  CalendarEntryDto,
  MeetingMethod,
} from "@/types/availability";

export type {
  AvailabilityFormSubmission,
  MeetingMethod,
  NewAppointmentSubmission,
  ScheduleStatus,
} from "@/types/availability";

type Props = {
  busy?: boolean;
  defaultDate: string;
  error?: string | null;
  initialValues?: Partial<CalendarEntryDto> | null;
  mode?: "create" | "edit";
  open: boolean;
  onClose: () => void;
  onSave: (
    submission: AvailabilityFormSubmission,
  ) => void | Promise<void>;
};

const fieldClass =
  "h-12 w-full rounded-[14px] border border-[#e5dece] bg-white px-4 text-sm font-semibold text-[#253252] outline-none focus:border-[#c5a860] focus:ring-4 focus:ring-[#d7b04d]/10";

function localDateKey(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function Label({
  children,
  required = false,
}: {
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label className="mb-2 block text-sm font-bold text-[#33415f]">
      {children}
      {required ? <span className="ml-1 text-[#d9534f]">*</span> : null}
    </label>
  );
}

export function NewAppointmentModal({
  busy = false,
  defaultDate,
  error = null,
  initialValues = null,
  mode = "create",
  open,
  onClose,
  onSave,
}: Props) {
  const [date, setDate] = useState(defaultDate);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [meetingMethod, setMeetingMethod] =
    useState<MeetingMethod>("in-person");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!open) return;

    setDate(initialValues?.date ?? defaultDate);
    setStartTime(initialValues?.startTime ?? "");
    setEndTime(initialValues?.endTime ?? "");
    setMeetingMethod(initialValues?.meetingMethod ?? "in-person");
    setLocation(initialValues?.location ?? "");
    setNotes(initialValues?.notes ?? "");
  }, [defaultDate, initialValues, open]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;

    void onSave({
      date,
      startTime,
      endTime,
      meetingMethod,
      location: location.trim(),
      notes: notes.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-[80]">
      <button
        aria-label="Close calendar form"
        className="absolute inset-0 bg-[#17223f]/45 backdrop-blur-[3px]"
        disabled={busy}
        onClick={onClose}
        type="button"
      />

      <div className="relative flex min-h-full items-center justify-center p-4">
        <div className="relative z-10 w-full max-w-[920px] overflow-hidden rounded-[26px] border border-[#ece4d6] bg-[#fdfcf9] shadow-[0_32px_80px_rgba(17,24,39,0.24)]">
          <form className="max-h-[92vh] overflow-y-auto" onSubmit={submit}>
            <div className="p-5 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-[#1c2850]">
                    {mode === "edit" ? "Edit Available Time" : "Add Available Time"}
                  </h2>
                  <p className="mt-1 text-sm font-medium text-[#73809b]">
                    Add a time spiritual children may request.
                  </p>
                </div>

                <button
                  aria-label="Close form"
                  className="flex h-10 w-10 items-center justify-center rounded-full text-[#6d7690] hover:bg-[#f4efe4] disabled:opacity-50"
                  disabled={busy}
                  onClick={onClose}
                  type="button"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {error ? (
                <div
                  className="mt-5 flex items-start gap-3 rounded-[16px] border border-[#efc8bf] bg-[#fff6f3] px-4 py-3 text-sm text-[#9f3f34]"
                  role="alert"
                >
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                  <div>
                    <p className="font-extrabold">Unable to save this time</p>
                    <p className="mt-0.5 font-medium text-[#b25a4d]">
                      {error}
                    </p>
                  </div>
                </div>
              ) : null}

              <section className="mt-7">
                <h3 className="border-b border-[#eee6d8] pb-3 text-sm font-extrabold uppercase tracking-[0.05em] text-[#576789]">
                  Date and time
                </h3>

                <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <Label required>Date</Label>
                    <div className="relative">
                      <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#73809b]" />
                      <input
                        className={cn(fieldClass, "pl-11")}
                        disabled={busy}
                        min={localDateKey(new Date())}
                        onChange={(event) => setDate(event.target.value)}
                        required
                        type="date"
                        value={date}
                      />
                    </div>
                  </div>

                  <div>
                    <Label required>Start time</Label>
                    <div className="relative">
                      <Clock3 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#73809b]" />
                      <input
                        className={cn(fieldClass, "pl-11")}
                        disabled={busy}
                        onChange={(event) => setStartTime(event.target.value)}
                        required
                        step={300}
                        type="time"
                        value={startTime}
                      />
                    </div>
                  </div>

                  <div>
                    <Label required>End time</Label>
                    <div className="relative">
                      <Clock3 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#73809b]" />
                      <input
                        className={cn(fieldClass, "pl-11")}
                        disabled={busy}
                        onChange={(event) => setEndTime(event.target.value)}
                        required
                        step={300}
                        type="time"
                        value={endTime}
                      />
                    </div>
                  </div>

                </div>
              </section>

              <section className="mt-7">
                    <h3 className="border-b border-[#eee6d8] pb-3 text-sm font-extrabold uppercase tracking-[0.05em] text-[#576789]">
                      Meeting information
                    </h3>

                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      <div>
                        <Label required>Meeting method</Label>
                        <select
                          className={fieldClass}
                          disabled={busy}
                          onChange={(event) =>
                            setMeetingMethod(
                              event.target.value as MeetingMethod,
                            )
                          }
                          value={meetingMethod}
                        >
                          <option value="in-person">In person</option>
                          <option value="phone">Phone</option>
                          <option value="online">Online</option>
                        </select>
                      </div>

                      <div>
                    <Label required>Location or meeting details</Label>
                        <div className="relative">
                          <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#73809b]" />
                          <input
                            className={cn(fieldClass, "pl-11")}
                            disabled={busy}
                        maxLength={1_000}
                        onChange={(event) => setLocation(event.target.value)}
                        placeholder="Church office, phone, or online details"
                        required
                            value={location}
                          />
                        </div>
                      </div>
                    </div>
              </section>

              <section className="mt-7">
                <h3 className="border-b border-[#eee6d8] pb-3 text-sm font-extrabold uppercase tracking-[0.05em] text-[#576789]">
                  Notes
                </h3>

                <textarea
                  className="mt-4 min-h-[110px] w-full resize-none rounded-[15px] border border-[#e5dece] bg-white px-4 py-3 text-sm font-medium text-[#253252] outline-none focus:border-[#c5a860] focus:ring-4 focus:ring-[#d7b04d]/10 disabled:opacity-60"
                  disabled={busy}
                  maxLength={250}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder='Example: "Confession only" or "Emergency guidance".'
                  value={notes}
                />
              </section>
            </div>

            <div className="flex flex-col gap-3 border-t border-[#eee6d8] bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
              <p className="text-xs font-semibold text-[#8490a7]">
                This time will appear in the spiritual child portal.
              </p>

              <div className="flex gap-3">
                <Button
                  className="h-11 rounded-[13px] border border-[#dccfb8] bg-white px-5 font-bold text-[#344163] hover:bg-[#faf6ef]"
                  disabled={busy}
                  onClick={onClose}
                  type="button"
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  className="h-11 rounded-[13px] bg-[#c39a37] px-6 font-bold text-white hover:bg-[#af892f]"
                  disabled={busy}
                  type="submit"
                >
                  <Plus className="h-4 w-4" />
                  {busy
                    ? "Saving..."
                    : mode === "edit"
                      ? "Save Changes"
                      : "Add Available Time"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
