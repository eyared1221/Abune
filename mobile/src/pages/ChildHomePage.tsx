import { BookOpen, CalendarDays, ChevronRight, Cross, Heart, Target, UserRound, type LucideIcon } from "lucide-react";
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
  return <button className="home-card" onClick={() => navigate(path, { state: path === "/child/more/profile" ? { fromHome: true } : undefined })} type="button"><span className={`home-card-icon ${tone}`}><Icon /></span><span className="home-card-copy"><b>{title}</b><small>{line1}</small>{line2 ? <strong>{line2}</strong> : null}</span><ChevronRight className="home-chevron" /></button>;
}

export function ChildHomePage({ name = "Welete" }: { name?: string }) {
  const navigate = useNavigate();
  return <section className="child-home-page">
    <section className="child-welcome-banner">
      <div><p>Welcome, {name}</p><h1>Walk in faith,<br />grow in grace.</h1><span className="welcome-rule"><i />✦<i /></span></div>
      <div aria-hidden="true" className="welcome-cross">☦</div>
    </section>

    <section className="home-summary home-profile-summary"><HomeCard icon={BookOpen} title="Complete Profile" line1="Provide your information" path="/child/more/profile" tone="gold" /></section>

    <section className="home-feature-grid">
      <FeatureTile icon={BookOpen} label="Bible" path="/child/home/bible" />
      <FeatureTile icon={Cross} label="Prayer" path="/child/home/prayer" />
      <FeatureTile icon={CalendarDays} label="Calendar" path="/child/home/calendar" />
      <FeatureTile icon={UserRound} label="Profile" path="/child/home/profile" />
      <FeatureTile icon={Heart} label="Devotion" path="/child/home/devotion" />
      <FeatureTile icon={Target} label="Goals" path="/child/home/goals" />
    </section>

    <button className="daily-reflection" onClick={() => navigate("/child/timeline")} type="button"><span><b>Daily Reflection</b><p>“I can do all things through Christ who strengthens me.” — Philippians 4:13</p><strong>Read more →</strong></span></button>

  </section>;
}

function FeatureTile({ icon: Icon, label, path }: { icon: LucideIcon; label: string; path: string }) {
  const navigate = useNavigate();
  return <button className="home-feature-tile" onClick={() => navigate(path)} type="button"><i className="home-feature-icon"><Icon /></i><span>{label}</span></button>;
}
