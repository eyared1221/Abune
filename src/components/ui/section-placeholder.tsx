type SectionPlaceholderProps = {
  title: string;
  description: string;
};

export function SectionPlaceholder({
  title,
  description,
}: SectionPlaceholderProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f9fc] px-6 py-12">
      <div className="max-w-xl rounded-3xl border border-[#eadfca] bg-white p-8 text-center shadow-[0_18px_50px_rgba(32,46,92,0.10)]">
        <h1 className="text-2xl font-extrabold text-[#243453]">{title}</h1>
        <p className="mt-3 text-sm text-[#6e7b96]">{description}</p>
      </div>
    </div>
  );
}
