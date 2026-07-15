import type { ReactNode } from "react";

type ChildSidebarProps = {
  children?: ReactNode;
};

export function ChildSidebar({ children }: ChildSidebarProps) {
  return (
    <aside className="rounded-3xl border border-[#eadfca] bg-white p-5">
      {children ?? <p className="text-sm text-[#6e7b96]">Child sidebar</p>}
    </aside>
  );
}
