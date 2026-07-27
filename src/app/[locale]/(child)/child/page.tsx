import {
  Bell,
  CalendarDays,
  Check,
  ChevronRight,
  ClipboardList,
  Cross,
  House,
  Menu,
  MessageCircle,
  Plus,
} from "lucide-react";

export default function ChildDashboardPage() {
  return (
    <main className="min-h-screen bg-[#fffaf1] px-3 pb-24 pt-4 text-[#0e265b] min-[480px]:px-5 min-[480px]:pt-7 sm:px-8 sm:pb-28">
      <div className="mx-auto max-w-[920px]">
        <header className="flex items-center justify-between">
          <button
            aria-label="Open menu"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-[#f1dfbd] bg-[#fff8ea] text-[#aa7615] shadow-[0_4px_10px_rgba(126,83,13,0.12)] min-[480px]:h-14 min-[480px]:w-14"
            type="button"
          >
            <Menu className="h-6 w-6 min-[480px]:h-7 min-[480px]:w-7" />
          </button>

          <button
            aria-label="Add new item"
            className="flex h-14 w-14 items-center justify-center rounded-full border-[5px] border-[#fff9ed] bg-gradient-to-br from-[#ce9e35] to-[#a96f0d] text-white shadow-[0_6px_15px_rgba(128,79,8,0.24)] min-[480px]:h-16 min-[480px]:w-16"
            type="button"
          >
            <Plus className="h-7 w-7 min-[480px]:h-8 min-[480px]:w-8" />
          </button>

          <button
            aria-label="Notifications"
            className="relative flex h-12 w-12 items-center justify-center rounded-full border border-[#f1dfbd] bg-[#fff8ea] text-[#aa7615] shadow-[0_4px_10px_rgba(126,83,13,0.12)] min-[480px]:h-14 min-[480px]:w-14"
            type="button"
          >
            <Bell className="h-6 w-6 min-[480px]:h-7 min-[480px]:w-7" />
            <span className="absolute right-3 top-2 h-3 w-3 rounded-full border-2 border-[#fff8ea] bg-[#bc8423]" />
          </button>
        </header>

        <section className="relative mt-5 flex min-h-[150px] items-center overflow-hidden rounded-[26px] border border-[#e8c77e] bg-[radial-gradient(circle_at_100%_50%,rgba(234,204,142,0.2),transparent_31%),linear-gradient(135deg,#fffefa,#fff9f0)] px-5 py-4 shadow-[0_4px_12px_rgba(98,68,23,0.12)] min-[480px]:mt-6 min-[480px]:min-h-[185px] min-[480px]:rounded-[32px] min-[480px]:px-8 min-[480px]:py-5">
          <div className="absolute -right-10 bottom-1 h-44 w-44 rounded-full border-[18px] border-[#f5e7cc]/60" />
          <div className="relative z-10 min-w-0 flex-1">
            <h1 className="font-serif text-3xl font-bold leading-tight text-[#10275e] min-[480px]:text-4xl sm:text-5xl">
              <span className="font-normal text-[#ad7318]">Welcome, </span>
              Selam!
            </h1>
            <p className="mt-2 font-serif text-base italic leading-tight text-[#b27416] min-[480px]:mt-3 min-[480px]:text-lg sm:text-xl">
              Walk in faith. Grow in grace.
            </p>
            <div className="hidden mt-3 items-center gap-3 text-[#dcbd7c] min-[480px]:mt-5">
              <span className="h-px flex-1 bg-[#ead4a9]" />
              <span>✧</span>
              <span className="h-px flex-1 bg-[#ead4a9]" />
            </div>
          </div>

          <ChevronRight className="relative z-10 ml-1 h-6 w-6 shrink-0 text-[#af7615] min-[480px]:ml-3 min-[480px]:h-8 min-[480px]:w-8" />
        </section>

        <section className="mt-8">
          <SectionHeading>Quick Access</SectionHeading>

          <div className="mt-4 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 min-[480px]:gap-4">
            <QuickAccessCard
              icon={<CalendarDays className="h-7 w-7" />}
              iconClassName="text-[#b47a13]"
              subtitle="Schedule a meeting"
              title="Appointments"
            />
            <QuickAccessCard
              icon={<MessageCircle className="h-7 w-7" />}
              iconClassName="text-[#b47a13]"
              subtitle="2 unread"
              title="Messages"
            />
            <QuickAccessCard
              icon={<Cross className="h-7 w-7" />}
              iconClassName="text-[#b47a13]"
              subtitle="Sacraments & Canon"
              title="Spiritual Dates"
            />
            <QuickAccessCard
              icon={<ClipboardList className="h-7 w-7" />}
              iconClassName="text-[#b47a13]"
              subtitle="Past requests"
              title="My History"
            />
          </div>
        </section>

        <section className="mt-8">
          <SectionHeading>Recent Activity</SectionHeading>
          <div className="mt-4 flex items-center gap-3 rounded-[22px] border border-[#ead3a4] bg-[#fffdf8] px-4 py-4 shadow-[0_3px_8px_rgba(93,65,24,0.08)] min-[480px]:gap-4 min-[480px]:rounded-[28px] min-[480px]:px-5 min-[480px]:py-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#f0dab0] bg-[#fff8e9] text-[#b67912] min-[480px]:h-16 min-[480px]:w-16">
              <Cross className="h-7 w-7 min-[480px]:h-8 min-[480px]:w-8" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-serif text-xl font-bold min-[480px]:text-2xl">Confession</p>
              <p className="mt-1 text-sm text-[#766a5a] min-[480px]:text-base">Request submitted</p>
              <p className="mt-2 text-xs text-[#766a5a] min-[480px]:text-sm">May 12, 2024&nbsp; • &nbsp;10:30 AM</p>
            </div>
            <div className="flex flex-col items-end gap-3 self-stretch">
              <span className="flex items-center gap-1 rounded-full bg-[#eef6e7] px-2 py-1 text-xs font-medium text-[#3b963e] min-[480px]:px-3 min-[480px]:text-sm"><Check className="h-4 w-4" /> <span className="hidden min-[480px]:inline">Completed</span></span>
              <ChevronRight className="mt-auto h-7 w-7 text-[#b47a13]" />
            </div>
          </div>
        </section>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-10 rounded-t-[28px] border-t border-[#294579] bg-[radial-gradient(circle_at_5%_0%,rgba(124,148,202,0.15),transparent_25%),linear-gradient(120deg,#0d285e,#122f69)] px-2 py-3 text-[#c7cbe0] shadow-[0_-3px_12px_rgba(20,45,103,0.15)] min-[480px]:rounded-t-[40px] min-[480px]:px-5 min-[480px]:py-5">
        <div className="mx-auto grid max-w-[700px] grid-cols-4">
          <NavItem active icon={<House className="h-8 w-8" />} label="Home" />
          <NavItem icon={<CalendarDays className="h-6 w-6" />} label="Appointments" />
          <NavItem icon={<MessageCircle className="h-6 w-6" />} label="Messages" />
          <NavItem icon={<Cross className="h-6 w-6" />} label="Spiritual" />
        </div>
      </nav>
    </main>
  );
}

function QuickAccessCard({
  icon,
  iconClassName,
  subtitle,
  title,
  tone = "bg-[radial-gradient(circle_at_100%_50%,rgba(237,214,174,0.26),transparent_31%),linear-gradient(135deg,#fffefa,#fff9f0)] border-[#ead0a0]",
}: {
  icon: React.ReactNode;
  iconClassName: string;
  subtitle: string;
  title: string;
  tone?: string;
}) {
  return (
    <button
      className={`flex min-h-[125px] flex-col rounded-[20px] border p-4 text-left shadow-[0_3px_8px_rgba(93,65,24,0.10)] transition-transform hover:-translate-y-0.5 [&>svg+span]:hidden min-[480px]:min-h-[150px] min-[480px]:rounded-[24px] min-[480px]:p-5 ${tone}`}
      type="button"
    >
      <div className="flex items-center gap-3 min-[480px]:gap-4">
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#f0dab0] bg-[#fff8e9] min-[480px]:h-12 min-[480px]:w-12 ${iconClassName}`}>
          {icon}
        </span>
        <span className="min-w-0">
          <span className="block font-serif text-lg font-bold leading-tight text-[#10275e] min-[480px]:text-xl">{title}</span>
          <span className="mt-1 block font-serif text-sm text-[#706559] min-[480px]:text-base">{subtitle}</span>
        </span>
      </div>
      <ChevronRight className="mt-auto self-end h-5 w-5 text-[#b47a13] min-[480px]:h-6 min-[480px]:w-6" />
      <span className="mt-auto self-end text-2xl leading-none text-[#c58a25]">›</span>
    </button>
  );
}

function NavItem({
  active = false,
  icon,
  label,
}: {
  active?: boolean;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      className={`flex min-w-0 flex-col items-center gap-1 border-r border-[#3d5484]/70 text-[10px] font-serif min-[480px]:text-sm ${active ? "text-[#e5a72e]" : "text-[#c7cbe0]"}`}
      type="button"
    >
      {icon}
      {label}
    </button>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-5">
      <h2 className="shrink-0 font-serif text-lg font-bold uppercase tracking-wide text-[#10275e] min-[480px]:text-xl sm:text-2xl">
        {children}
      </h2>
      <span className="h-px flex-1 bg-[#e4c486]" />
    </div>
  );
}
