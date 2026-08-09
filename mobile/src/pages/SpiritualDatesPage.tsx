import { useEffect, useState } from "react";
import { BookOpen, ChevronRight, Church, X } from "lucide-react";

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

const appointmentDateLabel = (value: string) => new Date(`${value}T12:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
const timeLabel = (value: string) => new Date(`2000-01-01T${value}`).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

export function SpiritualDatesPage() {
  const [tab, setTab] = useState<SpiritualTab>("canon");
  const [canons, setCanons] = useState<Canon[]>([]);
  const [selectedCanon, setSelectedCanon] = useState<Canon | null>(null);
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
              </div>
              <button aria-label={`View ${reasonLabels[canon.reason] ?? "Canon"} summary`} className="spiritual-canon-view" onClick={() => setSelectedCanon(canon)} type="button"><ChevronRight /></button>
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

      {selectedCanon ? <div className="spiritual-dialog-backdrop" role="presentation">
        <section aria-labelledby="canon-summary-title" aria-modal="true" className="spiritual-summary-dialog" role="dialog">
          <button aria-label="Close summary" className="spiritual-dialog-close" onClick={() => setSelectedCanon(null)} type="button"><X /></button>
          <h1 id="canon-summary-title">{reasonLabels[selectedCanon.reason] ?? "Canon"}</h1>
          <div className="spiritual-summary-box">
            <p>Canon Summary</p>
            <dl>
              <div className="spiritual-summary-canons"><dt>Canons</dt><dd>{selectedCanon.tasks.length ? <ul>{selectedCanon.tasks.map((task, index) => <li key={`${selectedCanon.id}-${index}`}>{task}</li>)}</ul> : "No canon guidance was provided."}</dd></div>
              <div><dt>Scheduled Date</dt><dd>{appointmentDateLabel(selectedCanon.fethaDate)}</dd></div>
              <div><dt>Scheduled Time</dt><dd>{timeLabel(selectedCanon.fethaTime)}</dd></div>
            </dl>
          </div>
        </section>
      </div> : null}
    </section>
  );
}
