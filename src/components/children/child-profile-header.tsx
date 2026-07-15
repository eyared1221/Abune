type ChildProfileHeaderProps = {
  name: string;
  summary: string;
};

export function ChildProfileHeader({
  name,
  summary,
}: ChildProfileHeaderProps) {
  return (
    <div className="rounded-3xl border border-[#eadfca] bg-white p-6">
      <h1 className="text-2xl font-extrabold text-[#243453]">{name}</h1>
      <p className="mt-2 text-sm text-[#6e7b96]">{summary}</p>
    </div>
  );
}
