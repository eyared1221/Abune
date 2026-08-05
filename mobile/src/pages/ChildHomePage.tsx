import { useNavigate } from "react-router-dom";

const cards = [
  { title: "Appointments", detail: "Request a time with your spiritual father", path: "/child/appointments" },
  { title: "Messages", detail: "Stay connected", path: "/child/messages" },
  { title: "Spiritual Dates", detail: "View your calendar", path: "/child/spiritual-dates" },
  { title: "My Timeline", detail: "Reflect on your journey", path: "/child/timeline" },
];

export function ChildHomePage({ name = "Child" }: { name?: string }) {
  const navigate = useNavigate();
  return <section className="page"><section className="hero"><span aria-hidden="true">✟</span><div><p>Welcome, {name}</p><h1>Walk in faith, grow in grace.</h1></div></section><div className="cards">{cards.map((card) => <button className="card" key={card.title} onClick={() => navigate(card.path)} type="button"><strong>{card.title}</strong><small>{card.detail} →</small></button>)}</div></section>;
}
