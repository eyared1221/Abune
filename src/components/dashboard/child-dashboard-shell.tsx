"use client";

import type { ReactNode } from "react";
import {
  Bell,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  Cross,
  House,
  Info,
  LogOut,
  Menu,
  MessageCircle,
  Plus,
  Settings,
  UserRound,
  X,
} from "lucide-react";
import { useLocale } from "next-intl";
import { useState } from "react";

import { useRouter } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { authClient } from "@/lib/auth-client";
import { ChildBottomNav } from "@/components/dashboard/child-navigation";
import { AddSpiritualChildModal, type NewSpiritualChildSubmission } from "@/components/dashboard/add-spiritual-child-modal";
import { createSpiritualChildAction } from "@/server/actions/spiritual-children.actions";

export function ChildDashboardShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [addChildOpen, setAddChildOpen] = useState(false);
  const [savingChild, setSavingChild] = useState(false);
  const [childSaveError, setChildSaveError] = useState<string | null>(null);
  const router = useRouter();
  const locale = useLocale() as AppLocale;

  const handleLogout = async () => {
    setLogoutDialogOpen(false);
    setMenuOpen(false);
    await authClient.signOut();
    router.replace("/login", { locale });
    router.refresh();
  };

  const handleSaveChild = async (submission: NewSpiritualChildSubmission) => {
    setSavingChild(true);
    setChildSaveError(null);
    const result = await createSpiritualChildAction(submission);
    if (!result.success) {
      setChildSaveError(result.error);
      setSavingChild(false);
      return;
    }
    setSavingChild(false);
    setAddChildOpen(false);
  };

  return (
    <main className="min-h-dvh bg-[#fffbf2] pb-28 font-sans text-[#243453] xl:pb-10 xl:pl-[300px]">
      {logoutDialogOpen ? <LogoutDialog close={() => setLogoutDialogOpen(false)} confirm={handleLogout} /> : null}
      {menuOpen ? <button aria-label="Close navigation" className="fixed inset-0 z-40 bg-[#0b1425]/60 xl:hidden" onClick={() => setMenuOpen(false)} type="button" /> : null}

      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[min(82vw,330px)] flex-col overflow-hidden bg-[linear-gradient(145deg,#fffdf7,#fff7e6)] shadow-[16px_0_35px_rgba(8,16,32,.28)] transition-transform duration-300 xl:w-[300px] xl:translate-x-0 xl:shadow-[8px_0_28px_rgba(8,16,32,.08)] ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="px-6 pb-5 pt-9 text-center">
          <button aria-label="Close navigation" className="absolute right-4 top-4 text-[#7d6b50] xl:hidden" onClick={() => setMenuOpen(false)} type="button"><X className="h-5 w-5" /></button>
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#d69b27] bg-[#09264f] text-[#e3ae3a] shadow-md"><Cross className="h-10 w-10" /></div>
          <p className="mt-3 font-serif text-4xl text-[#b87814]">Abune</p>
          <div className="mt-4 flex items-center gap-3 text-[#d99b2c]"><span className="h-px flex-1 bg-[#dfbd7b]" /><Cross className="h-4 w-4" /><span className="h-px flex-1 bg-[#dfbd7b]" /></div>
        </div>
        <nav className="border-y border-[#eddfc7] px-5">
          <DrawerItem icon={<UserRound />} label="My Profile" />
          <DrawerItem icon={<ClipboardList />} label="My History" href="/child/appointments" />
          <DrawerItem icon={<CalendarDays />} label="Spiritual Dates" href="/child/spiritual-dates" />
          <DrawerItem icon={<Info />} label="About" />
          <DrawerItem icon={<Settings />} label="Settings" />
          <DrawerItem icon={<LogOut />} label="Logout" danger onClick={() => setLogoutDialogOpen(true)} />
        </nav>
        <div className="mt-auto border-t-2 border-[#dca449] px-5 py-4 text-center text-[#d49a2e]"><Cross className="mx-auto h-9 w-9" /></div>
      </aside>

      <div className="mx-auto max-w-[1280px] px-5 pt-7 sm:px-8 md:px-10 xl:px-12 xl:pt-9">
        <header className="flex items-center justify-between border-b border-transparent pb-1 xl:border-[#eadfca] xl:pb-6">
          <button aria-label="Open navigation" className="text-[#243453] xl:hidden" onClick={() => setMenuOpen(true)} type="button"><Menu className="h-7 w-7" /></button>
          <div className="hidden xl:block"><p className="text-xs font-black uppercase tracking-[.16em] text-[#c99d40]">Spiritual child portal</p><p className="mt-1 text-2xl font-extrabold tracking-tight text-[#173461]">Welcome, Selam</p></div>
          <p className="font-serif text-4xl text-[#b67813] xl:hidden">Abune</p>
          <div className="relative"><button aria-label="Notifications" className="text-[#243453]" type="button"><Bell className="h-7 w-7 stroke-[1.7]" /></button><span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full border border-white bg-[#aa1f27]" /></div>
        </header>

        <section className="mt-7 overflow-hidden rounded-[21px] shadow-[0_6px_17px_rgba(17,27,43,.17)] md:rounded-[28px] xl:mt-8">
          <img alt="Welcome Selam - Walk in faith, grow in grace" className="aspect-[1.39/1] h-auto w-full object-cover object-center md:aspect-[2.2/1]" src="/images/home.png" />
        </section>

        <button className="mt-5 flex w-full items-center justify-center gap-3 rounded-[18px] bg-[#b9903e] px-5 py-4 text-base font-medium text-white shadow-[0_8px_18px_rgba(185,144,62,.22)] transition-colors hover:bg-[#a98437] md:w-auto" onClick={() => setAddChildOpen(true)} type="button"><Plus className="h-5 w-5" />Add Spiritual Child</button>

        <section className="mt-5 grid gap-3 md:grid-cols-2 md:gap-5 xl:mt-7">
          <DashboardCard icon={<CalendarDays />} tone="gold" title="Upcoming Appointment" detail="Sunday School" meta="May 25, 2025 · 10:00 AM" href="/child/appointments" />
          <DashboardCard icon={<ClipboardList />} tone="gold" title="Pending Request" meta="1 request waiting for approval" href="/child/appointments" />
          <DashboardCard icon={<MessageCircle />} tone="blue" title="Messages" meta={<><span>You have </span><span className="font-bold text-[#b87814]">2</span><span> new messages</span></>} href="/child/messages" />
          <DashboardCard icon={<Cross />} tone="blue" title="Next Spiritual Date" detail="Kidase (Fast)" meta="June 4, 2025" href="/child/spiritual-dates" />
        </section>
      </div>

      <ChildBottomNav active="home" />
      <AddSpiritualChildModal open={addChildOpen} onClose={() => { if (!savingChild) { setChildSaveError(null); setAddChildOpen(false); } }} onSave={handleSaveChild} saving={savingChild} submitError={childSaveError} />
    </main>
  );
}

function DashboardCard({ icon, tone, title, detail, meta, href }: { icon: ReactNode; tone: "gold" | "blue"; title: string; detail?: string; meta: ReactNode; href: string }) {
  const router = useRouter(); const locale = useLocale() as AppLocale;
  return <button className="flex w-full items-center gap-3 rounded-[17px] border border-[#eee4d4] bg-[#fffdfa] px-4 py-3 text-left shadow-[0_3px_10px_rgba(30,34,40,.09)] transition-all hover:-translate-y-0.5 hover:border-[#dec488] hover:shadow-[0_10px_20px_rgba(30,34,40,.11)] md:min-h-[105px] md:px-5" onClick={() => router.push(href, { locale })} type="button"><span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] text-white shadow-inner ${tone === "gold" ? "bg-[linear-gradient(135deg,#d69a22,#a76b08)]" : "bg-[linear-gradient(135deg,#092a58,#123c73)]"}`}>{icon}</span><span className="min-w-0 flex-1"><span className="block text-[18px] font-semibold leading-5 text-[#1d2859]">{title}</span>{detail ? <span className="mt-1 block text-[15px] font-medium leading-5 text-[#33415f]">{detail}</span> : null}<span className="mt-1 block text-[14px] font-medium leading-4 text-[#6e7891]">{meta}</span></span><ChevronRight className="h-5 w-5 shrink-0 text-[#34383f]" /></button>;
}

function DrawerItem({ icon, label, href, danger = false, onClick }: { icon: ReactNode; label: string; href?: string; danger?: boolean; onClick?: () => void }) {
  const router = useRouter(); const locale = useLocale() as AppLocale;
  return <button className={`flex w-full items-center gap-5 border-b border-[#eddfc7] py-5 text-left text-[17px] last:border-b-0 ${danger ? "text-[#a31e24]" : "text-[#1b2230]"}`} onClick={() => { if (href) router.push(href, { locale }); onClick?.(); }} type="button"><span className="h-6 w-6 [&>svg]:h-6 [&>svg]:w-6">{icon}</span>{label}</button>;
}

function LogoutDialog({ close, confirm }: { close: () => void; confirm: () => void }) {
  return <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#08152d]/50 px-6" role="dialog" aria-modal="true"><div className="w-full max-w-sm rounded-3xl bg-[#fffdf8] p-6 text-center shadow-2xl"><LogOut className="mx-auto h-8 w-8 text-[#a31e24]" /><h2 className="mt-3 font-serif text-2xl font-bold">Log out?</h2><p className="mt-2 text-sm text-[#6e6d72]">Do you want to log out of your account?</p><div className="mt-6 grid grid-cols-2 gap-3"><button className="rounded-xl border border-[#e4d5bb] py-3 font-semibold" onClick={close} type="button">No</button><button className="rounded-xl bg-[#a31e24] py-3 font-semibold text-white" onClick={confirm} type="button">Yes, log out</button></div></div></div>;
}
