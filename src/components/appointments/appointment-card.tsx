type AppointmentCardProps = {
  title: string;
  date: string;
};

export function AppointmentCard({
  title,
  date,
}: AppointmentCardProps) {
  return (
    <div className="rounded-2xl border border-[#e4e7ef] bg-white p-4">
      <h3 className="font-bold text-[#243453]">{title}</h3>
      <p className="mt-1 text-sm text-[#6e7b96]">{date}</p>
    </div>
  );
}
