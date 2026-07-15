import type { ReactNode } from "react";

type DashboardHeaderProps = {
  title: string;
  description: string;
  actions?: ReactNode;
};

export function DashboardHeader({
  title,
  description,
  actions,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-[#eadfca] bg-white p-6 shadow-[0_12px_30px_rgba(32,46,92,0.08)] md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-extrabold text-[#243453]">{title}</h1>
        <p className="mt-2 text-sm text-[#6e7b96]">{description}</p>
      </div>
      {actions}
    </div>
  );
}
