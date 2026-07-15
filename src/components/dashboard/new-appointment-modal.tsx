"use client";

import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  Bell,
  CalendarDays,
  CalendarRange,
  ChevronDown,
  Clock3,
  Plus,
  UserRound,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { spiritualChildren } from "@/lib/spiritual-children";
import { cn } from "@/lib/utils";

export type AppointmentType = "confession" | "reflection" | "review";
export type AppointmentStatus = "scheduled" | "completed" | "cancelled";

export type NewAppointmentSubmission = {
  title: string;
  date: string;
  time: string;
  type: AppointmentType;
  spiritualChild: string;
  duration: string;
  notes: string;
  reminder: string;
  status: AppointmentStatus;
};

type NewAppointmentModalProps = {
  defaultDate: string;
  initialValues?: Partial<NewAppointmentSubmission> | null;
  mode?: "create" | "edit";
  open: boolean;
  onClose: () => void;
  onSave: (submission: NewAppointmentSubmission) => void;
};

const fieldClassName =
  "h-[56px] w-full rounded-[16px] border border-[#e5dece] bg-white px-4 text-[15px] font-semibold text-[#253252] outline-none transition-all placeholder:text-[#9ca5b5] focus:border-[#c5a860] focus:ring-4 focus:ring-[#d7b04d]/10";

const selectClassName = cn(
  fieldClassName,
  "appearance-none pr-11",
);

const appointmentTypeOptions: Array<{
  label: string;
  title: string;
  type: AppointmentType;
}> = [
  {
    label: "Confession Meeting",
    title: "Confession Meeting",
    type: "confession",
  },
  {
    label: "Spiritual Reflection",
    title: "Spiritual Reflection",
    type: "reflection",
  },
  {
    label: "Pastoral Review",
    title: "Pastoral Review",
    type: "review",
  },
] as const;

const timeOptions = [
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:30 AM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:30 PM",
] as const;

const durationOptions = [
  "30 minutes",
  "45 minutes",
  "1 hour",
  "1 hour 30 minutes",
] as const;

const reminderOptions = [
  "No reminder",
  "15 minutes before",
  "30 minutes before",
  "1 hour before",
] as const;

const statusOptions: Array<{ label: string; value: AppointmentStatus }> = [
  { label: "Scheduled", value: "scheduled" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

function toTimeInputValue(value?: string) {
  if (!value) {
    return "10:00";
  }

  if (/^\d{2}:\d{2}$/.test(value)) {
    return value;
  }

  const match = value.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
  if (!match) {
    return "10:00";
  }

  let hours = Number(match[1]);
  const minutes = match[2];
  const period = match[3].toUpperCase();

  if (period === "PM" && hours !== 12) {
    hours += 12;
  }

  if (period === "AM" && hours === 12) {
    hours = 0;
  }

  return `${String(hours).padStart(2, "0")}:${minutes}`;
}

function toDisplayTime(value: string) {
  const [rawHours = "10", minutes = "00"] = value.split(":");
  const hours = Number(rawHours);

  if (Number.isNaN(hours)) {
    return "10:00 AM";
  }

  const suffix = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;

  return `${hour12}:${minutes} ${suffix}`;
}

function FieldLabel({
  label,
  required = false,
}: {
  label: string;
  required?: boolean;
}) {
  return (
    <label className="mb-2 block text-sm font-bold text-[#33415f]">
      {label}
      {required ? <span className="ml-1 text-[#db5d5d]">*</span> : null}
    </label>
  );
}

function IconField({
  children,
  icon,
}: {
  children: ReactNode;
  icon: ReactNode;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[#73809b]">
        {icon}
      </span>
      {children}
    </div>
  );
}

function SelectField({
  children,
  leftIcon,
}: {
  children: ReactNode;
  leftIcon?: ReactNode;
}) {
  return (
    <div className="relative">
      {leftIcon && (
        <span className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[#73809b]">
          {leftIcon}
        </span>
      )}

      {children}

      <ChevronDown
        className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#7b859d]"
        strokeWidth={2}
      />
    </div>
  );
}

export function NewAppointmentModal({
  defaultDate,
  initialValues = null,
  mode = "create",
  open,
  onClose,
  onSave,
}: NewAppointmentModalProps) {
  const participantOptions = useMemo(
    () => spiritualChildren.map((child) => child.name),
    [],
  );

  const [appointmentType, setAppointmentType] =
    useState<AppointmentType>("confession");
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState<string>("10:00");
  const [duration, setDuration] = useState<string>("30 minutes");
  const [spiritualChild, setSpiritualChild] = useState("");
  const [notes, setNotes] = useState("");
  const [reminder, setReminder] = useState("15 minutes before");
  const [status, setStatus] =
    useState<AppointmentStatus>("scheduled");

  useEffect(() => {
    if (!open) {
      return;
    }

    setAppointmentType(initialValues?.type ?? "confession");
    setDate(initialValues?.date ?? defaultDate);
    setTime(toTimeInputValue(initialValues?.time));
    setDuration(initialValues?.duration ?? "30 minutes");
    setSpiritualChild(initialValues?.spiritualChild ?? "");
    setNotes(initialValues?.notes ?? "");
    setReminder(initialValues?.reminder ?? "15 minutes before");
    setStatus(initialValues?.status ?? "scheduled");
  }, [defaultDate, initialValues, open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  const selectedAppointmentType =
    appointmentTypeOptions.find((option) => option.type === appointmentType) ??
    appointmentTypeOptions[0];

  const modalTitle =
    mode === "edit" ? "Edit Appointment" : "New Appointment";
  const modalDescription =
    mode === "edit"
      ? "Update this appointment and save your changes."
      : "Create a new appointment and add the necessary details.";
  const submitLabel =
    mode === "edit" ? "Update Appointment" : "Create Appointment";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSave({
      title: selectedAppointmentType.title,
      date,
      time: toDisplayTime(time),
      type: appointmentType,
      spiritualChild,
      duration,
      notes: notes.trim(),
      reminder,
      status,
    });
  };

  return (
    <div className="fixed inset-0 z-[80]">
      <button
        aria-label="Close new appointment form"
        className="absolute inset-0 bg-[#17223f]/40 backdrop-blur-[3px]"
        onClick={onClose}
        type="button"
      />

      <div className="relative flex min-h-full items-center justify-center p-4 lg:p-8">
        <div className="relative z-10 w-full max-w-[1020px] overflow-hidden rounded-[28px] border border-[#ece4d6] bg-[#fdfcf9] shadow-[0_32px_80px_rgba(17,24,39,0.24)]">
          <form className="max-h-[92vh] overflow-y-auto" onSubmit={handleSubmit}>
            <div className="px-5 pb-6 pt-5 sm:px-7 sm:pb-7 sm:pt-6 lg:px-9">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[16px] border border-[#eadfc9] bg-[#fbf6ec] text-[#cb951f] shadow-[0_8px_18px_rgba(185,150,69,0.12)]">
                    <CalendarRange className="h-7 w-7" strokeWidth={1.8} />
                  </div>

                  <div>
                    <h2 className="text-[28px] font-extrabold leading-tight text-[#1c2850]">
                      {modalTitle}
                    </h2>

                    <p className="mt-1 text-sm font-medium text-[#73809b]">
                      {modalDescription}
                    </p>
                  </div>
                </div>

                <button
                  aria-label="Close form"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#6d7690] transition-colors hover:bg-[#f4efe4] hover:text-[#1c2850]"
                  onClick={onClose}
                  type="button"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-8 space-y-8">
                <section>
                  <h3 className="border-b border-[#eee6d8] pb-4 text-[15px] font-extrabold uppercase text-[#576789] sm:text-[18px]">
                    Appointment Details
                  </h3>

                  <div className="mt-6 grid gap-5 lg:grid-cols-3">
<div>
  <FieldLabel label="Appointment Type" required />

  <SelectField>
    <span className="pointer-events-none absolute left-4 top-1/2 z-10 h-3.5 w-3.5 -translate-y-1/2 rounded-full bg-[#963bd8]" />

    <select
      className={cn(selectClassName, "pl-12")}
      onChange={(event) =>
        setAppointmentType(
          event.target.value as AppointmentType,
        )
      }
      required
      value={appointmentType}
    >
      {appointmentTypeOptions.map((option) => (
        <option key={option.type} value={option.type}>
          {option.label}
        </option>
      ))}
    </select>
  </SelectField>
</div>

                    <div>
                      <FieldLabel label="Date" required />
                      <IconField icon={<CalendarDays className="h-5 w-5" />}>
                        <input
                          className={cn(fieldClassName, "pl-12")}
                          onChange={(event) => setDate(event.target.value)}
                          required
                          type="date"
                          value={date}
                        />
                      </IconField>
                    </div>

<div>
  <FieldLabel label="Time" required />

  <IconField icon={<Clock3 className="h-5 w-5" />}>
    <input
      type="time"
      className={cn(fieldClassName, "pl-12")}
      value={time}
      onChange={(event) => setTime(event.target.value)}
      required
      step={60}
    />
  </IconField>
</div>

<div className="lg:max-w-[340px]">
  <FieldLabel label="Duration" />

  <SelectField
    leftIcon={<Clock3 className="h-5 w-5" />}
  >
    <select
      className={cn(selectClassName, "pl-12")}
      onChange={(event) => setDuration(event.target.value)}
      value={duration}
    >
      {durationOptions.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </SelectField>
</div>
                  </div>
                </section>

                <section>
                  <h3 className="border-b border-[#eee6d8] pb-4 text-[15px] font-extrabold uppercase text-[#576789] sm:text-[18px]">
                    Participant
                  </h3>

<div className="mt-6 max-w-[520px]">
  <FieldLabel label="Spiritual Child" required />

  <SelectField
    leftIcon={<UserRound className="h-5 w-5" />}
  >
    <select
      className={cn(selectClassName, "pl-12")}
      onChange={(event) =>
        setSpiritualChild(event.target.value)
      }
      required
      value={spiritualChild}
    >
      <option value="">Select spiritual child</option>

      {participantOptions.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </SelectField>
</div>
                </section>

                <section>
                  <h3 className="border-b border-[#eee6d8] pb-4 text-[15px] font-extrabold uppercase text-[#576789] sm:text-[18px]">
                    Additional Information
                  </h3>

                  <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_290px]">
                    <div>
                      <FieldLabel label="Purpose / Notes" />
                      <div className="overflow-hidden rounded-[16px] border border-[#e5dece] bg-white transition-all focus-within:border-[#c5a860] focus-within:ring-4 focus-within:ring-[#d7b04d]/10">
                        <textarea
                          className="min-h-[124px] w-full resize-none border-0 bg-transparent px-4 py-4 text-[15px] font-medium text-[#253252] outline-none placeholder:text-[#9ca5b5]"
                          maxLength={250}
                          onChange={(event) => setNotes(event.target.value)}
                          placeholder="Add purpose or notes for this appointment (optional)"
                          value={notes}
                        />
                        <div className="px-4 pb-3 text-right text-sm font-semibold text-[#91a0b8]">
                          {notes.length}/250
                        </div>
                      </div>
                    </div>

                    <div className="space-y-5">
<div>
  <FieldLabel label="Reminder" />

  <SelectField
    leftIcon={<Bell className="h-5 w-5" />}
  >
    <select
      className={cn(selectClassName, "pl-12")}
      onChange={(event) =>
        setReminder(event.target.value)
      }
      value={reminder}
    >
      {reminderOptions.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </SelectField>
</div>

<div>
  <FieldLabel label="Status" />

  <SelectField
    leftIcon={
      <span className="h-3.5 w-3.5 rounded-full bg-[#63c04d]" />
    }
  >
    <select
      className={cn(selectClassName, "pl-12")}
      onChange={(event) =>
        setStatus(
          event.target.value as AppointmentStatus,
        )
      }
      value={status}
    >
      {statusOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </SelectField>
</div>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-[#eee6d8] bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-7 lg:px-9">
              <Button
                className="h-11 rounded-[14px] border border-[#dccfb8] bg-white px-5 text-[15px] font-bold text-[#344163] shadow-none hover:bg-[#faf6ef]"
                onClick={onClose}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>

              <Button className="h-11 rounded-[14px] bg-[#c39a37] px-6 text-[15px] font-bold text-white shadow-[0_10px_24px_rgba(195,154,55,0.24)] hover:bg-[#af892f]">
                <Plus className="h-4 w-4" />
                {submitLabel}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
