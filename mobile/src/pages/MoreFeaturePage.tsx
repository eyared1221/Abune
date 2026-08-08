import { ArrowLeft, BookOpen, Heart, NotebookPen, ScrollText, Settings, Target, UserRound, type LucideIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import "./moreFeaturePage.css";

const features: Record<string, { title: string; description: string; icon: LucideIcon }> = {
  profile: { title: "My Profile", description: "View and manage your Spiritual Child profile.", icon: UserRound },
  devotions: { title: "Devotions", description: "Keep your daily devotion and spiritual reflection in one place.", icon: Heart },
  prayers: { title: "Prayers", description: "Keep your personal prayers and prayer intentions close at hand.", icon: BookOpen },
  journal: { title: "Journal", description: "Write and revisit reflections from your spiritual journey.", icon: NotebookPen },
  reading: { title: "Reading", description: "Organize spiritual reading and continue where you left off.", icon: ScrollText },
  goals: { title: "Goals", description: "Set and follow meaningful spiritual goals.", icon: Target },
  settings: { title: "Settings", description: "Manage your application preferences and reminders.", icon: Settings },
};

export function MoreFeaturePage() {
  const navigate = useNavigate(); const { feature } = useParams(); const item = features[feature ?? ""] ?? features.devotions; const Icon = item.icon;
  return <section className="more-feature-page"><button aria-label="Back to More" className="more-feature-back" onClick={() => navigate("/child/more")} type="button"><ArrowLeft /></button><span><Icon /></span><h1>{item.title}</h1><p>{item.description}</p></section>;
}
