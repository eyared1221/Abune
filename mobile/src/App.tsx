import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";

import { ChildNavigation } from "./components/layout/childNavigation";
import { AppointmentDetailPage } from "./pages/AppointmentDetailPage";
import { AboutPage } from "./pages/AboutPage";
import { AppointmentsPage } from "./pages/AppointmentsPage";
import { ChildHomePage } from "./pages/ChildHomePage";
import { CompleteProfilePage } from "./pages/CompleteProfilePage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { LoginPage, type MobileSession } from "./pages/LoginPage";
import { MessagesPage } from "./pages/MessagesPage";
import { MorePage } from "./pages/MorePage";
import { MoreFeaturePage } from "./pages/MoreFeaturePage";
import { NewAppointmentPage } from "./pages/NewAppointmentPage";
import { ProfilePage } from "./pages/ProfilePage";
import { RegisterPage } from "./pages/RegisterPage";
import { RemindersPage } from "./pages/RemindersPage";
import { SpiritualDatesPage } from "./pages/SpiritualDatesPage";
import { TimelinePage } from "./pages/TimelinePage";
import { authClient, clearBearerToken, isApiConfigured } from "./services";
import "./App.css";
import "./header.css";
import "./headerCompact.css";
import "./headerSmallWordmark.css";
import "./splash.css";

type Session = MobileSession;

export default function App() {
  const [session, setSession] = useState<Session>(null);
  const [checking, setChecking] = useState(true);
  useEffect(() => { if (!isApiConfigured) { setChecking(false); return; } void authClient.getSession().then((result) => setSession((result.data as Session) ?? null)).catch(() => setSession(null)).finally(() => setChecking(false)); }, []);
  if (checking) return <div className="splash"><img alt="Abune" src="/icons/abune-512.png" /></div>;
  if (!session?.user || session.user.role !== "SPIRITUAL_CHILD") return <Routes><Route element={<LoginPage configured={isApiConfigured} onSignedIn={setSession} />} path="*" /><Route element={<RegisterPage />} path="/register" /><Route element={<ForgotPasswordPage />} path="/forgot-password" /></Routes>;
  async function logout() {
    try { await authClient.signOut(); } catch { /* Clear the local session even if the server cannot be reached. */ }
    clearBearerToken();
    setSession(null);
  }
  return <ChildPortal onLogout={logout} session={{ user: session.user }} />;
}

function ChildPortal({ session, onLogout }: { session: { user: NonNullable<NonNullable<Session>["user"]> }; onLogout: () => Promise<void> }) {
  const location = useLocation(); const navigate = useNavigate();
  const active = location.pathname === "/child" ? "home" : location.pathname.startsWith("/child/appointments") ? "appointments" : location.pathname.startsWith("/child/messages") ? "messages" : location.pathname.startsWith("/child/more") ? "more" : "spiritual";
  const name = session.user.name?.trim() || "Child";
  return <main className="portal"><header><button className="wordmark" onClick={() => navigate("/child")} type="button">Abune</button><button aria-label="Open reminders" className="header-bell" onClick={() => navigate("/child/reminders")} type="button"><Bell /><i /></button></header><Routes><Route element={<ChildHomePage name={name} />} path="/child" /><Route element={<AppointmentsPage />} path="/child/appointments" /><Route element={<NewAppointmentPage />} path="/child/appointments/new" /><Route element={<AppointmentDetailPage />} path="/child/appointments/:appointmentId" /><Route element={<MessagesPage />} path="/child/messages" /><Route element={<MorePage onLogout={onLogout} />} path="/child/more" /><Route element={<AboutPage />} path="/child/more/about" /><Route element={<CompleteProfilePage />} path="/child/more/profile" /><Route element={<MoreFeaturePage />} path="/child/more/:feature" /><Route element={<ProfilePage email={session.user.email} />} path="/child/profile" /><Route element={<RemindersPage />} path="/child/reminders" /><Route element={<SpiritualDatesPage />} path="/child/spiritual-dates" /><Route element={<TimelinePage />} path="/child/timeline" /><Route element={<Navigate replace to="/child" />} path="*" /></Routes><ChildNavigation active={active} /></main>;
}
