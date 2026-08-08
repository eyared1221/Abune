import { BookOpen, CalendarDays, ChevronRight, MessageCircle, type LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

import "./childHomePage.css";
import "../homeCompact.css";
import "../welcomeBannerFit.css";
import "../homeSingleColumn.css";
import "../homeBannerShort.css";
import "../homeCompactCards.css";
import "../homeReflectionTheme.css";

type HomeCardProps = { icon: LucideIcon; title: string; line1: string; line2?: string; path: string; tone?: "gold" | "blue" };

function HomeCard({ icon: Icon, title, line1, line2, path, tone = "gold" }: HomeCardProps) {
  const navigate = useNavigate();
  return <button className="home-card" onClick={() => navigate(path)} type="button"><span className={`home-card-icon ${tone}`}><Icon /></span><span className="home-card-copy"><b>{title}</b><small>{line1}</small>{line2 ? <strong>{line2}</strong> : null}</span><ChevronRight className="home-chevron" /></button>;
}

export function ChildHomePage({ name = "Welete" }: { name?: string }) {
  const navigate = useNavigate();
  return <section className="child-home-page">
    <section className="child-welcome-banner">
      <div><p>Welcome, {name}</p><h1>Walk in faith,<br />grow in grace.</h1><span className="welcome-rule"><i />✦<i /></span></div>
      <div aria-hidden="true" className="welcome-cross">☦</div>
    </section>

    <section className="home-summary"><HomeCard icon={BookOpen} title="Complete Profile" line1="Provide your information" path="/child/more/profile" tone="gold" /><HomeCard icon={CalendarDays} title="Next Appointment" line1="No appointment scheduled" path="/child/appointments" /><HomeCard icon={MessageCircle} title="Pending Request" line1="New messages" path="/child/messages" tone="gold" /></section>

    <section className="home-section-heading"><h2>Quick Updates</h2><button onClick={() => navigate("/child/messages")} type="button">View all</button></section>
    <section className="quick-updates">
      <QuickCard icon={MessageCircle} title="Messages" detail="Stay connected" path="/child/messages" />
      <QuickCard icon={CalendarDays} title="Spiritual Dates" detail="View your calendar" path="/child/spiritual-dates" tone="gold" />
      <QuickCard icon={BookOpen} title="My Timeline" detail="Continue your journey" path="/child/timeline" />
    </section>

    <button className="daily-reflection" onClick={() => navigate("/child/timeline")} type="button"><span><b>Daily Reflection</b><p>“I can do all things through Christ who strengthens me.” — Philippians 4:13</p><strong>Read more →</strong></span></button>

  </section>;
}

function QuickCard({ icon: Icon, title, detail, path, tone = "blue" }: Pick<HomeCardProps, "icon" | "title" | "path" | "tone"> & { detail: string }) {
  const navigate = useNavigate();
  return <button className="quick-card" onClick={() => navigate(path)} type="button"><span className={`quick-icon ${tone}`}><Icon /></span><span><b>{title}</b><small>{detail}</small></span><ChevronRight /></button>;
}
