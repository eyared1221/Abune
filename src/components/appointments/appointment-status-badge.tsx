type AppointmentStatusBadgeProps = {
  status: "pending" | "confirmed" | "completed";
};

const styles = {
  pending: "bg-[#fff4d8] text-[#8a6a10]",
  confirmed: "bg-[#e6f4ec] text-[#1f6d42]",
  completed: "bg-[#e7eefc] text-[#294898]",
};

export function AppointmentStatusBadge({
  status,
}: AppointmentStatusBadgeProps) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}
