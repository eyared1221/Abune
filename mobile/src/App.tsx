import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";

import { ChildNavigation } from "./components/layout/childNavigation";
import { AppointmentDetailPage } from "./pages/AppointmentDetailPage";
import { AppointmentsPage } from "./pages/AppointmentsPage";
import { ChildHomePage } from "./pages/ChildHomePage";
import { MessagesPage } from "./pages/MessagesPage";
import { NewAppointmentPage } from "./pages/NewAppointmentPage";
import { ProfilePage } from "./pages/ProfilePage";
import { RemindersPage } from "./pages/RemindersPage";
import { SpiritualDatesPage } from "./pages/SpiritualDatesPage";
import { TimelinePage } from "./pages/TimelinePage";
import { LoginPage, type MobileSession } from "./pages/LoginPage";
import { authClient, clearBearerToken, isApiConfigured } from "./services";
import "./App.css";

type Session = MobileSession;

export default function App() {
  const [session, setSession] = useState<Session>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!isApiConfigured) {
      setChecking(false);
      return;
    }

    void authClient.getSession()
      .then((result) => setSession((result.data as Session) ?? null))
      .catch(() => setSession(null))
      .finally(() => setChecking(false));
  }, []);

  if (checking) return <div className="splash">Abune</div>;
  if (!session?.user || session.user.role !== "SPIRITUAL_CHILD") return <LoginPage configured={isApiConfigured} onSignedIn={setSession} />;
  return <ChildPortal session={{ user: session.user }} onSignedOut={() => setSession(null)} />;
}

function ChildPortal({ session, onSignedOut }: { session: { user: NonNullable<NonNullable<Session>["user"]> }; onSignedOut: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const active = location.pathname === "/child" ? "home" : location.pathname.startsWith("/child/appointments") ? "appointments" : location.pathname.startsWith("/child/messages") ? "messages" : "spiritual";
  const name = session.user.name?.split(" ")[0] || "Child";
  async function signOut() { try { await authClient.signOut(); } finally { clearBearerToken(); onSignedOut(); navigate("/login", { replace: true }); } }

  return <main className="portal"><header><button className="wordmark" onClick={() => navigate("/child")} type="button">✟ Abune</button><div><span className="eyebrow">SPIRITUAL CHILD PORTAL</span><strong>Welcome, {name}</strong></div><button className="text-button" onClick={() => void signOut()} type="button">Sign out</button></header><Routes><Route element={<ChildHomePage name={name} />} path="/child" /><Route element={<AppointmentsPage />} path="/child/appointments" /><Route element={<NewAppointmentPage />} path="/child/appointments/new" /><Route element={<AppointmentDetailPage />} path="/child/appointments/:appointmentId" /><Route element={<MessagesPage />} path="/child/messages" /><Route element={<ProfilePage email={session.user.email} />} path="/child/profile" /><Route element={<RemindersPage />} path="/child/reminders" /><Route element={<SpiritualDatesPage />} path="/child/spiritual-dates" /><Route element={<TimelinePage />} path="/child/timeline" /><Route element={<Navigate replace to="/child" />} path="*" /></Routes><ChildNavigation active={active} onSignOut={signOut} /></main>;
}
