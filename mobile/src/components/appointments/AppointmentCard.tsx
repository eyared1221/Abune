import { AppointmentStatusBadge, type AppointmentStatus } from "./AppointmentStatusBadge";

export type ChildAppointment = { id: string; reason: string; status: AppointmentStatus; requestedDate: string; requestedStartTime: string; meetingMethod?: string; location?: string | null };

export function AppointmentCard({ appointment }: { appointment: ChildAppointment }) {
  const date = new Date(`${appointment.requestedDate}T12:00:00`).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  const reason = appointment.reason.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  return <article><span><strong>{reason}</strong><small>{date} at {appointment.requestedStartTime.slice(0, 5)}</small>{appointment.location ? <small>{appointment.meetingMethod} · {appointment.location}</small> : null}</span><AppointmentStatusBadge status={appointment.status} /></article>;
}
