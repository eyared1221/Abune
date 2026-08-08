import { BookOpen, ChevronRight, CircleHelp, Heart, LogOut, NotebookPen, ScrollText, Settings, Target, UserRound, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./morePage.css";
import "./moreCards.css";
import "./moreCardsTheme.css";
import "./moreCardsCompact.css";

function MoreItem({ icon: Icon, label, onClick }: { icon: LucideIcon; label: string; onClick: () => void }) {
  return <button onClick={onClick} type="button"><Icon /><span><b>{label}</b></span><ChevronRight /></button>;
}

export function MorePage({ onLogout }: { onLogout: () => Promise<void> }) {
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  async function logout() { setLoggingOut(true); await onLogout(); }
  return <section className="more-page"><h1>More</h1><p>Manage your Spiritual Child account.</p><div><MoreItem icon={CircleHelp} label="About" onClick={() => navigate("/child/more/about")} /><MoreItem icon={UserRound} label="My Profile" onClick={() => navigate("/child/more/profile")} /><MoreItem icon={Heart} label="Devotions" onClick={() => navigate("/child/more/devotions")} /><MoreItem icon={BookOpen} label="Prayers" onClick={() => navigate("/child/more/prayers")} /><MoreItem icon={NotebookPen} label="Journal" onClick={() => navigate("/child/more/journal")} /><MoreItem icon={ScrollText} label="Reading" onClick={() => navigate("/child/more/reading")} /><MoreItem icon={Target} label="Goals" onClick={() => navigate("/child/more/goals")} /><MoreItem icon={Settings} label="Settings" onClick={() => navigate("/child/more/settings")} /><button className="more-logout" onClick={() => setConfirming(true)} type="button"><LogOut /><span><b>Log Out</b></span></button></div>{confirming ? <div className="logout-dialog-backdrop" role="presentation"><section aria-labelledby="logout-title" aria-modal="true" className="logout-dialog" role="dialog"><LogOut /><h2 id="logout-title">Log out?</h2><p>Are you sure you want to log out?</p><div><button disabled={loggingOut} onClick={() => setConfirming(false)} type="button">No</button><button disabled={loggingOut} onClick={() => void logout()} type="button">{loggingOut ? "…" : "Yes"}</button></div></section></div> : null}</section>;
}
