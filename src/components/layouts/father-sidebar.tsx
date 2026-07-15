import type { ReactNode } from "react";

type FatherSidebarProps = {
  children?: ReactNode;
};

export function FatherSidebar({ children }: FatherSidebarProps) {
  return (
    <aside className="rounded-3xl border border-[#eadfca] bg-[#fbf7ee] p-5">
      {children ?? <p className="text-sm text-[#6e7b96]">Father sidebar</p>}
    </aside>
  );
}
