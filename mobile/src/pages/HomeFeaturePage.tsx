import { ArrowLeft, BookOpen, CalendarDays, Cross, Heart, Target, UserRound, type LucideIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import "./moreFeaturePage.css";

const features: Record<string, { title: string; description: string; icon: LucideIcon }> = {
  bible: { title: "Bible", description: "Read and organize your spiritual reading.", icon: BookOpen },
  prayer: { title: "Prayer", description: "Keep your prayers and prayer intentions close.", icon: Cross },
  calendar: { title: "Calendar", description: "View your personal spiritual calendar and dates.", icon: CalendarDays },
  profile: { title: "Profile", description: "View and manage your spiritual profile.", icon: UserRound },
  devotion: { title: "Devotion", description: "Keep your daily devotion and spiritual reflection in one place.", icon: Heart },
  goals: { title: "Goals", description: "Set and follow meaningful spiritual goals.", icon: Target },
};

export function HomeFeaturePage() {
  const navigate = useNavigate();
  const { feature } = useParams();
  const item = features[feature ?? ""] ?? features.bible;
  const Icon = item.icon;

  return <section className="more-feature-page"><button aria-label="Back to Home" className="more-feature-back" onClick={() => navigate("/child")} type="button"><ArrowLeft /></button><span><Icon /></span><h1>{item.title}</h1><p>{item.description}</p></section>;
}
