import Link from "next/link";

type MobileNavigationProps = {
  items: Array<{ href: string; label: string }>;
};

export function MobileNavigation({ items }: MobileNavigationProps) {
  return (
    <nav className="flex gap-2 overflow-x-auto">
      {items.map((item) => (
        <Link
          key={item.href}
          className="whitespace-nowrap rounded-full border border-[#e4e7ef] bg-white px-4 py-2 text-sm font-semibold text-[#243453]"
          href={item.href}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
