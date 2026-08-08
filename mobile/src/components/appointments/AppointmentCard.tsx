import { CalendarClock, Pencil, Trash2 } from "lucide-react";

import { type AppointmentStatus } from "./AppointmentStatusBadge";

export type ChildAppointment = { id: string; reason: string; status: AppointmentStatus; requestedDate: string; requestedStartTime: string; meetingMethod?: string; location?: string | null; responseNote?: string | null };

export function AppointmentCard({ appointment, onDelete, onEdit }: { appointment: ChildAppointment; onDelete?: () => void; onEdit?: () => void }) {
  const date = new Date(`${appointment.requestedDate}T12:00:00`).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
  const reason = appointment.reason.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  const pending = appointment.status === "PENDING";
  return <article className="mobile-request-card"><span className="request-calendar"><CalendarClock /></span><div><b>{reason}</b><small>{date} at {appointment.requestedStartTime.slice(0, 5)}</small>{appointment.responseNote?.trim() ? <p className="request-response-note">Father’s note: {appointment.responseNote}</p> : null}</div><em className={`request-status ${appointment.status.toLowerCase()}`}>{appointment.status.replace("_", " ")}</em>{pending && onEdit ? <button aria-label={`Edit ${reason} request`} onClick={onEdit} type="button"><Pencil /></button> : null}{pending && onDelete ? <button aria-label={`Delete ${reason} request`} className="delete" onClick={onDelete} type="button"><Trash2 /></button> : null}</article>;
}
