"use client";

import { Bell, CalendarDays, ClipboardList, Cross, House, Info, LogOut, Menu, MessageCircle, Settings, UserRound, X } from "lucide-react";
import { useLocale } from "next-intl";
import { useState } from "react";

import { useRouter } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { authClient } from "@/lib/auth-client";

type ChildRoute = "home" | "appointments" | "messages" | "spiritual";

export function ChildTopBar({ title }: { title?: string }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const locale = useLocale() as AppLocale;
  const navigate = (href: string) => { setOpen(false); router.push(href, { locale }); };
  const logout = async () => { setOpen(false); await authClient.signOut(); router.replace("/login", { locale }); router.refresh(); };

  return <><header className="flex items-center justify-between xl:hidden"><button aria-label="Open navigation" className="text-[#243453]" onClick={() => setOpen(true)} type="button"><Menu className="h-7 w-7" /></button><p className="text-xl font-semibold text-[#173461]">{title ?? "Abune"}</p><div className="relative"><button aria-label="Notifications" className="text-[#243453]" type="button"><Bell className="h-7 w-7 stroke-[1.7]" /></button><span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full border border-white bg-[#aa1f27]" /></div></header>{open ? <><button aria-label="Close navigation" className="fixed inset-0 z-40 bg-[#0b1425]/60" onClick={() => setOpen(false)} type="button" /><aside className="fixed inset-y-0 left-0 z-50 flex w-[min(82vw,330px)] flex-col overflow-hidden bg-[linear-gradient(145deg,#fffdf7,#fff7e6)] shadow-[16px_0_35px_rgba(8,16,32,.28)]"><div className="px-6 pb-5 pt-9 text-center"><button aria-label="Close navigation" className="absolute right-4 top-4 text-[#7d6b50]" onClick={() => setOpen(false)} type="button"><X className="h-5 w-5" /></button><div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#d69b27] bg-[#09264f] text-[#e3ae3a]"><Cross className="h-10 w-10" /></div><p className="mt-3 font-serif text-4xl text-[#b87814]">Abune</p></div><nav className="border-y border-[#eddfc7] px-5"><DrawerButton icon={UserRound} label="My Profile" /><DrawerButton icon={ClipboardList} label="My History" onClick={() => navigate("/child/appointments")} /><DrawerButton icon={CalendarDays} label="Spiritual Dates" onClick={() => navigate("/child/spiritual-dates")} /><DrawerButton icon={Info} label="About" /><DrawerButton icon={Settings} label="Settings" /><DrawerButton danger icon={LogOut} label="Logout" onClick={() => void logout()} /></nav><div className="mt-auto border-t-2 border-[#dca449] py-4 text-center text-[#d49a2e]"><Cross className="mx-auto h-9 w-9" /></div></aside></> : null}</>;
}

function DrawerButton({ icon: Icon, label, danger = false, onClick }: { icon: typeof UserRound; label: string; danger?: boolean; onClick?: () => void }) { return <button className={`flex w-full items-center gap-5 border-b border-[#eddfc7] py-5 text-left text-[17px] last:border-b-0 ${danger ? "text-[#a31e24]" : "text-[#1b2230]"}`} onClick={onClick} type="button"><Icon className="h-6 w-6" />{label}</button>; }

export function ChildBottomNav({ active }: { active: ChildRoute }) {
  const router = useRouter(); const locale = useLocale() as AppLocale;
  const items: Array<{ key: ChildRoute; label: string; href: string; icon: typeof House }> = [{ key: "home", label: "Home", href: "/child", icon: House }, { key: "appointments", label: "Appointments", href: "/child/appointments", icon: CalendarDays }, { key: "messages", label: "Messages", href: "/child/messages", icon: MessageCircle }, { key: "spiritual", label: "Spiritual", href: "/child/spiritual-dates", icon: Cross }];
  return <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-[#29436c] bg-[radial-gradient(circle_at_10%_0,rgba(74,109,164,.35),transparent_35%),linear-gradient(115deg,#061c42,#0c2c5d)] px-3 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3 text-white md:px-8 xl:hidden"><div className="mx-auto grid max-w-[700px] grid-cols-4">{items.map(({ key, label, href, icon: Icon }) => <button key={key} className={`relative flex min-h-[58px] flex-col items-center justify-center gap-1 text-[11px] ${active === key ? "text-[#f2b63a]" : "text-white"}`} onClick={() => router.push(href, { locale })} type="button"><Icon className="h-6 w-6" />{label}{active === key ? <span className="absolute bottom-0 h-1 w-1 rounded-full bg-[#f2b63a]" /> : null}</button>)}</div></nav>;
}
