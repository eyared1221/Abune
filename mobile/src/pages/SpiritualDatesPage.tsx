import { useEffect, useState } from "react";
import { BookOpen, Church } from "lucide-react";

import { api } from "../services";
import "./spiritualPage.css";

type SpiritualTab = "canon" | "sacraments";
type Canon = { id: string; reason: string; fethaDate: string; fethaTime: string; tasks: string[] };

const reasonLabels: Record<string, string> = {
  confession: "Confession",
  counseling: "Counseling",
  repentance: "Repentance",
  "spiritual-guidance": "Spiritual Guidance",
  "family-issue": "Family Issues",
  other: "Other",
};

export function SpiritualDatesPage() {
  const [tab, setTab] = useState<SpiritualTab>("canon");
  const [canons, setCanons] = useState<Canon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    void api<{ canons: Canon[] }>("/api/child/canons")
      .then((data) => setCanons(data.canons ?? []))
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Unable to load canon guidance."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="spiritual-page">
      <nav aria-label="Spiritual sections" className="spiritual-tabs">
        <button className={tab === "canon" ? "active" : ""} onClick={() => setTab("canon")} type="button">Canon</button>
        <button className={tab === "sacraments" ? "active" : ""} onClick={() => setTab("sacraments")} type="button">Sacraments</button>
      </nav>

      {tab === "canon" ? (
        <section className="spiritual-canon-list">
          {loading ? <p className="spiritual-state">Loading canon guidance…</p> : error ? <p className="spiritual-state error">{error}</p> : canons.length ? canons.map((canon) => (
            <article className="spiritual-canon-card" key={canon.id}>
              <span><BookOpen /></span>
              <div>
                <h1>{reasonLabels[canon.reason] ?? "Canon"}</h1>
                <ul>{canon.tasks.map((task, index) => <li key={`${canon.id}-${index}`}>{task}</li>)}</ul>
              </div>
            </article>
          )) : <section className="spiritual-empty-card"><span><BookOpen /></span><div><h1>Canon</h1><p>Your canon guidance from your Spiritual Father will appear here.</p></div></section>}
        </section>
      ) : (
        <section className="spiritual-empty-card">
          <span><Church /></span>
          <div>
            <h1>Sacraments</h1>
            <p>Your sacramental records and reminders will appear here.</p>
          </div>
        </section>
      )}
    </section>
  );
}
