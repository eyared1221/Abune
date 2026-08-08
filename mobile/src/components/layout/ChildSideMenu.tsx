import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, ClipboardList, Cross, Info, LogOut, Settings, UserRound, type LucideIcon } from "lucide-react";

import "./childSideMenu.css";

export function ChildSideMenu({ onSignOut }: { onSignOut: () => Promise<void> | void }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const go = (path: string) => { setOpen(false); navigate(path); };
  useEffect(() => {
    const openMenu = () => setOpen(true);
    window.addEventListener("abune:open-side-menu", openMenu);
    return () => window.removeEventListener("abune:open-side-menu", openMenu);
  }, []);

  return <><button aria-label="Open navigation" className="child-menu-trigger" onClick={() => setOpen(true)} type="button"><span /><span /><span /></button>{open ? <><button aria-label="Close navigation" className="child-menu-overlay" onClick={() => setOpen(false)} type="button" /><aside className="child-side-menu"><button aria-label="Close navigation" className="child-menu-close" onClick={() => setOpen(false)} type="button">×</button><div className="child-menu-brand"><Cross /></div><nav><MenuItem icon={UserRound} label="My Profile" onClick={() => go("/child/profile")} /><MenuItem icon={ClipboardList} label="My History" onClick={() => go("/child/appointments")} /><MenuItem icon={CalendarDays} label="Spiritual Dates" onClick={() => go("/child/spiritual-dates")} /><MenuItem icon={Info} label="About" /><MenuItem icon={Settings} label="Settings" /><MenuItem danger icon={LogOut} label="Logout" onClick={() => void onSignOut()} /></nav><div className="child-menu-footer"><Cross /></div></aside></> : null}</>;
}

function MenuItem({ icon: Icon, label, danger = false, onClick }: { icon: LucideIcon; label: string; danger?: boolean; onClick?: () => void }) {
  return <button className={danger ? "danger" : ""} onClick={onClick} type="button"><Icon />{label}</button>;
}
