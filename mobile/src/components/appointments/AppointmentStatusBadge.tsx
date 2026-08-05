export type AppointmentStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED" | "COMPLETED" | "CONFIRMED" | "NO_SHOW" | "RESCHEDULED";

export function AppointmentStatusBadge({ status }: { status: AppointmentStatus }) {
  return <b>{status.replace("_", " ")}</b>;
}
