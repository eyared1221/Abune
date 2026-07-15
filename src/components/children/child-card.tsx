type ChildCardProps = {
  name: string;
  subtitle?: string;
};

export function ChildCard({ name, subtitle }: ChildCardProps) {
  return (
    <div className="rounded-2xl border border-[#e4e7ef] bg-white p-4">
      <h3 className="font-bold text-[#243453]">{name}</h3>
      {subtitle ? <p className="mt-1 text-sm text-[#6e7b96]">{subtitle}</p> : null}
    </div>
  );
}
