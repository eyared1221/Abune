import { ArrowLeft, Bell, CheckCheck } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./remindersPage.css";

export function RemindersPage() {
  const navigate = useNavigate();
  const [read, setRead] = useState(false);

  return <section className="reminders-page">
    <div className="reminders-top"><button aria-label="Back" className="reminders-back" onClick={() => navigate(-1)} type="button"><ArrowLeft /></button><div><h1>Notifications</h1><p>Stay up to date with your spiritual journey.</p></div></div>
    <div className="reminders-actions"><span>{read ? "All caught up" : "1 new notification"}</span>{!read ? <button onClick={() => setRead(true)} type="button"><CheckCheck /> Mark all as read</button> : null}</div>
    <article className={`notification-card${read ? " read" : ""}`}><span className="notification-icon"><Bell /></span><div><b>Welcome to Abune</b><p>Complete your profile to help your Spiritual Father support you well.</p><small>Just now</small></div>{!read ? <i aria-label="Unread" /> : null}</article>
  </section>;
}
