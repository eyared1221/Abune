import { useNavigate } from "react-router-dom";
import "./childNavigation.css";
import "./childNavigationFive.css";

type ChildRoute = "home" | "appointments" | "messages" | "spiritual" | "more";
const items: Array<{ key: ChildRoute; label: string; path?: string; icon: "home" | "calendar" | "messages" | "cross" | "menu" }> = [
  { key: "home", label: "Home", path: "/child", icon: "home" }, { key: "appointments", label: "Appointments", path: "/child/appointments", icon: "calendar" }, { key: "messages", label: "Messages", path: "/child/messages", icon: "messages" }, { key: "spiritual", label: "Spiritual", path: "/child/spiritual-dates", icon: "cross" }, { key: "more", label: "More", path: "/child/more", icon: "menu" },
];

export function ChildNavigation({ active }: { active: ChildRoute; onSignOut?: () => Promise<void> | void }) {
  const navigate = useNavigate();
  return <nav aria-label="Child navigation" className="child-bottom-nav"><div>{items.map((item) => <button className={active === item.key ? "active" : ""} key={item.key} onClick={() => navigate(item.path!)} type="button"><NavIcon name={item.icon} /><span>{item.label}</span>{active === item.key ? <i aria-hidden="true" /> : null}</button>)}</div></nav>;
}

function NavIcon({ name }: { name: (typeof items)[number]["icon"] }) {
  const common = { fill: "none", stroke: "currentColor", strokeLinecap: "round" as const, strokeLinejoin: "round" as const, strokeWidth: 1.8 };
  if (name === "home") return <svg aria-hidden="true" viewBox="0 0 24 24"><path {...common} d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z" /><path {...common} d="M9 21v-6h6v6" /></svg>;
  if (name === "calendar") return <svg aria-hidden="true" viewBox="0 0 24 24"><rect {...common} height="18" rx="2" width="18" x="3" y="4" /><path {...common} d="M16 2v4M8 2v4M3 10h18" /></svg>;
  if (name === "messages") return <svg aria-hidden="true" viewBox="0 0 24 24"><path {...common} d="M21 11.5a8.2 8.2 0 0 1-8.5 8 9.5 9.5 0 0 1-3.8-.8L3 21l1.8-5.1A7.4 7.4 0 0 1 4 12a8.2 8.2 0 0 1 8.5-8 8.2 8.2 0 0 1 8.5 7.5Z" /></svg>;
  if (name === "menu") return <svg aria-hidden="true" viewBox="0 0 24 24"><path {...common} d="M4 6h16M4 12h16M4 18h16" /></svg>;
  return <svg aria-hidden="true" viewBox="0 0 24 24"><path {...common} d="M12 3v18M6 7h12M7 17h10" /></svg>;
}
