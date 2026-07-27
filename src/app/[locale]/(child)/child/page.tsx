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
  ScrollText,
} from "lucide-react";

export default function ChildDashboardPage() {
  return (
    <main className="min-h-screen bg-[#fffaf1] px-5 pb-28 pt-7 text-[#0e265b] sm:px-8">
      <div className="mx-auto max-w-[920px]">
        <header className="flex items-center justify-between">
          <button
            aria-label="Open menu"
            className="flex h-16 w-16 items-center justify-center rounded-full border border-[#f1dfbd] bg-[#fff8ea] text-[#aa7615] shadow-[0_4px_10px_rgba(126,83,13,0.12)]"
            type="button"
          >
            <Menu className="h-8 w-8" />
          </button>

          <button
            aria-label="Add new item"
            className="flex h-[74px] w-[74px] items-center justify-center rounded-full border-[7px] border-[#fff9ed] bg-gradient-to-br from-[#ce9e35] to-[#a96f0d] text-white shadow-[0_6px_15px_rgba(128,79,8,0.24)]"
            type="button"
          >
            <Plus className="h-10 w-10" />
          </button>

          <button
            aria-label="Notifications"
            className="relative flex h-16 w-16 items-center justify-center rounded-full border border-[#f1dfbd] bg-[#fff8ea] text-[#aa7615] shadow-[0_4px_10px_rgba(126,83,13,0.12)]"
            type="button"
          >
            <Bell className="h-8 w-8" />
            <span className="absolute right-3 top-2 h-3 w-3 rounded-full border-2 border-[#fff8ea] bg-[#bc8423]" />
          </button>
        </header>

        <section className="relative mt-7 flex min-h-[280px] items-center overflow-hidden rounded-[38px] border border-[#e8c77e] bg-[radial-gradient(circle_at_100%_50%,rgba(234,204,142,0.2),transparent_31%),linear-gradient(135deg,#fffefa,#fff9f0)] px-5 py-5 shadow-[0_4px_12px_rgba(98,68,23,0.12)] sm:px-8">
          <div className="absolute -right-10 bottom-1 h-44 w-44 rounded-full border-[18px] border-[#f5e7cc]/60" />
          <img
            alt="Child praying"
            className="w-[38%] max-w-[280px] shrink-0 [clip-path:circle(45%_at_50%_50%)]"
            src="/images/prayer-child-source.png"
          />

          <div className="relative z-10 min-w-0 flex-1 pl-1 sm:pl-5">
            <p className="font-serif text-xl text-[#ad7318] sm:text-2xl">Welcome,</p>
            <h1 className="mt-1 font-serif text-5xl font-bold leading-none sm:text-6xl">Selam!</h1>
            <p className="mt-4 font-serif text-xl italic text-[#b27416] sm:text-2xl">
              Walk in faith. Grow in grace.
            </p>
            <div className="mt-8 flex items-center gap-3 text-[#dcbd7c]">
              <span className="h-px flex-1 bg-[#ead4a9]" />
              <span>✧</span>
              <span className="h-px flex-1 bg-[#ead4a9]" />
            </div>
          </div>

          <ChevronRight className="relative z-10 ml-3 h-10 w-10 shrink-0 text-[#af7615]" />
        </section>

        <section className="mt-8">
          <SectionHeading>Quick Access</SectionHeading>

          <div className="mt-4 grid grid-cols-2 gap-4">
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
          <div className="mt-4 flex items-center gap-4 rounded-[28px] border border-[#ead3a4] bg-[#fffdf8] px-5 py-5 shadow-[0_3px_8px_rgba(93,65,24,0.08)]">
            <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full border border-[#f0dab0] bg-[#fff8e9] text-[#b67912]">
              <Cross className="h-9 w-9" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-serif text-2xl font-bold">Confession</p>
              <p className="mt-1 text-base text-[#766a5a]">Request submitted</p>
              <p className="mt-2 text-sm text-[#766a5a]">May 12, 2024&nbsp; • &nbsp;10:30 AM</p>
            </div>
            <div className="flex flex-col items-end gap-3 self-stretch">
              <span className="flex items-center gap-1 rounded-full bg-[#eef6e7] px-3 py-1 text-sm font-medium text-[#3b963e]"><Check className="h-4 w-4" /> Completed</span>
              <ChevronRight className="mt-auto h-7 w-7 text-[#b47a13]" />
            </div>
          </div>
        </section>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-10 rounded-t-[40px] border-t border-[#294579] bg-[radial-gradient(circle_at_5%_0%,rgba(124,148,202,0.15),transparent_25%),linear-gradient(120deg,#0d285e,#122f69)] px-5 py-5 text-[#c7cbe0] shadow-[0_-3px_12px_rgba(20,45,103,0.15)]">
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
      className={`flex min-h-[220px] flex-col rounded-[28px] border p-6 text-left shadow-[0_3px_8px_rgba(93,65,24,0.10)] transition-transform hover:-translate-y-0.5 ${tone}`}
      type="button"
    >
      <span className={`flex h-[72px] w-[72px] items-center justify-center rounded-full border border-[#f0dab0] bg-[#fff8e9] ${iconClassName}`}>
        {icon}
      </span>
      <span className="mt-6 font-serif text-[27px] font-bold leading-tight text-[#10275e]">{title}</span>
      <span className="mt-2 font-serif text-lg text-[#706559]">{subtitle}</span>
      <ChevronRight className="mt-auto self-end h-8 w-8 text-[#b47a13]" />
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
      className={`flex flex-col items-center gap-2 border-r border-[#3d5484]/70 text-lg font-serif ${active ? "text-[#e5a72e]" : "text-[#c7cbe0]"}`}
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
      <h2 className="shrink-0 font-serif text-[29px] font-bold uppercase tracking-wide text-[#10275e] sm:text-[33px]">
        {children}
      </h2>
      <span className="h-px flex-1 bg-[#e4c486]" />
    </div>
  );
}
