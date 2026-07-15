"use client";

type ChildFilterProps = {
  value?: string;
  onChange?: (value: string) => void;
};

export function ChildFilter({
  value = "",
  onChange,
}: ChildFilterProps) {
  return (
    <input
      className="h-11 w-full rounded-2xl border border-[#dce1eb] px-4 text-sm outline-none"
      onChange={(event) => onChange?.(event.target.value)}
      placeholder="Filter children"
      type="text"
      value={value}
    />
  );
}
